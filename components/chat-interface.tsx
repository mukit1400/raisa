"use client"

import type React from "react"
import { useRef, useEffect, useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2, Trash2, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { useChat } from "ai/react"
import { SocialShare } from "@/components/social-share"
import { ScreenshotGenerator } from "@/components/screenshot-generator"
import { useLanguage } from "@/contexts/language-context"

// Update the welcome messages for Raisa and Partho to include more Banglish and be more welcoming

// Replace the English WELCOME_MESSAGES object with this:
const WELCOME_MESSAGES = {
  raisa:
    "Assalamu alaikum! Kemon achen? I'm Raisa, your Bengali friend! Apnar shathe kotha bolte khub bhalo lagche. You can chat with me in simple English or Bangla - je bhabe apnar comfortable lage. Ami Dhaka theke, UX design kori. Apni chaile amar bondhu Partho ar Rudro'r shathe-o kotha bolte paren - just tap their photos above! Apni ki niye kotha bolte chan? Let's start our adda!",
  partho:
    "Assalamu alaikum, bondhu. Ami Partho. Kemon achen? Allah'r rohomot e apni bhalo achen, tai ashakori. Life is like a nodi - always flowing, guided by Allah's hukum. Apnar mon e ki chinta ache? Amra ekshathe alochona korte pari. Apni chaile amar bondhu Raisa or Rudro'r shathe-o kotha bolte paren - just tap their photos above. Bolun, apni ki niye janate chan?",
  rudro:
    "Ami Rudro! Kemon acho bondhu? Let's chat about tech, city life, or whatever's on your mind! I'm your tech-savvy Bengali friend. Want to talk to someone else? You can chat with Raisa or Partho by tapping their icons above. Type something to get started...",
}

// Replace the Bengali BN_WELCOME_MESSAGES object with this:
const BN_WELCOME_MESSAGES = {
  raisa:
    "আসসালামু আলাইকুম! কেমন আছেন? আমি রাইসা, আপনার বাঙালি বন্ধু! আপনার সাথে কথা বলতে খুব ভালো লাগছে। আমি ঢাকা থেকে, ইউএক্স ডিজাইন করি। আপনি ইংরেজি বা বাংলা যেভাবে আপনার সুবিধা হয় সেভাবে কথা বলতে পারেন। আপনি চাইলে আমার বন্ধু পার্থো আর রুদ্রর সাথেও কথা বলতে পারেন - উপরের ছবিতে ট্যাপ করুন! আপনি কী নিয়ে কথা বলতে চান? আমাদের আড্ডা শুরু করি!",
  partho:
    "আসসালামু আলাইকুম, বন্ধু। আমি পার্থো। কেমন আছেন? আল্লাহর রহমতে আপনি ভালো আছেন, তাই আশা করি। জীবন একটি নদীর মতো - সর্বদা প্রবাহমান, আল্লাহর হুকুম দ্বারা পরিচালিত। আপনার মনে কি চিন্তা আছে? আমরা একসাথে আলোচনা করতে পারি। আপনি চাইলে আমার বন্ধু রাইসা বা রুদ্রর সাথেও কথা বলতে পারেন - উপরের ছবিতে ট্যাপ করুন। বলুন, আপনি কী নিয়ে জানাতে চান?",
  rudro:
    "আমি রুদ্র! কেমন আছো বন্ধু? আসুন টেক, শহুরে জীবন, বা আপনার মনে যা আছে তা নিয়ে কথা বলি! আমি আপনার প্রযুক্তি-দক্ষ বাঙালি বন্ধু। অন্য কারো সাথে কথা বলতে চান? আপনি উপরের আইকনগুলিতে ট্যাপ করে রাইসা বা পার্থোর সাথে কথা বলতে পারেন। শুরু করতে কিছু টাইপ করুন...",
}

// Global cache for chat messages by persona and language
// This needs to be outside the component to persist across renders
const chatCache: Record<string, any[]> = {}

export default function ChatInterface() {
  const { language, t } = useLanguage()
  const [currentPersona, setCurrentPersona] = useState<string>("raisa") // Default to raisa
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isScreenshotOpen, setIsScreenshotOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [previousPersona, setPreviousPersona] = useState<string | null>(null)

  // Get welcome messages based on language
  const WELCOME_MESSAGE = language === "bn" ? BN_WELCOME_MESSAGES : WELCOME_MESSAGES

  // Create a chat instance that changes based on persona
  const { messages, input, handleInputChange, isLoading, error, handleSubmit, setMessages } = useChat({
    api: "/api/chat",
    id: `${currentPersona}-${language}`,
    initialMessages: [
      {
        id: `welcome-${currentPersona}-${language}`,
        role: "assistant",
        content: WELCOME_MESSAGE[currentPersona as keyof typeof WELCOME_MESSAGE] || WELCOME_MESSAGE.raisa,
      },
    ],
    body: { persona: currentPersona, language },
    onFinish: (message) => {
      // Update cache when a new message is received
      const cacheKey = `${currentPersona}-${language}`

      // Get the current messages including the new one
      const updatedMessages = [...messages, message]

      // Update the cache
      chatCache[cacheKey] = updatedMessages

      // Play a subtle notification sound if enabled
      if (soundEnabled) {
        playMessageSound()
      }
    },
  })

  // Initialize persona from URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const url = new URL(window.location.href)
        const personaParam = url.searchParams.get("persona")
        if (personaParam && ["raisa", "partho", "rudro"].includes(personaParam)) {
          setCurrentPersona(personaParam)
        }
      } catch (error) {
        console.error("Error getting URL params:", error)
      }
    }
  }, [])

  // Listen for persona change events
  useEffect(() => {
    const handlePersonaChange = (event: CustomEvent) => {
      if (event.detail && event.detail.persona && event.detail.persona !== currentPersona) {
        // Save current persona before changing
        setPreviousPersona(currentPersona)

        // Save current messages to cache before switching
        const cacheKey = `${currentPersona}-${language}`
        if (messages && messages.length > 0) {
          chatCache[cacheKey] = [...messages]
        }

        // Set the new persona with transition
        setIsTransitioning(true)
        setCurrentPersona(event.detail.persona)

        // Reset after animation completes
        setTimeout(() => setIsTransitioning(false), 300)
      }
    }

    window.addEventListener("personaChange", handlePersonaChange as EventListener)
    return () => window.removeEventListener("personaChange", handlePersonaChange as EventListener)
  }, [currentPersona, language, messages])

  // Play message received sound with proper error handling
  const playMessageSound = () => {
    if (!soundEnabled) return

    try {
      // Create a simple beep sound using the Web Audio API instead of loading a file
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (error) {
      console.error("Error playing sound:", error)
      // Silently fail - no need to show error to user for sound
    }
  }

  // Check if audio is supported
  useEffect(() => {
    // Only enable sound if the browser supports it
    try {
      const audio = new Audio()
      if (audio) {
        setSoundEnabled(true)
      }
    } catch (error) {
      console.error("Audio not supported:", error)
      setSoundEnabled(false)
    }
  }, [])

  // Update messages when persona changes
  useEffect(() => {
    if (isTransitioning) return // Skip during transitions

    const cacheKey = `${currentPersona}-${language}`

    // If we have cached messages for this persona and language, use them
    if (chatCache[cacheKey] && chatCache[cacheKey].length > 0) {
      setMessages(chatCache[cacheKey])
    } else {
      // Otherwise reset to welcome message
      const welcomeMessage = {
        id: `welcome-${currentPersona}-${language}`,
        role: "assistant",
        content: WELCOME_MESSAGE[currentPersona as keyof typeof WELCOME_MESSAGE] || WELCOME_MESSAGE.raisa,
      }

      setMessages([welcomeMessage])

      // Initialize cache
      chatCache[cacheKey] = [welcomeMessage]
    }
  }, [currentPersona, language, setMessages, WELCOME_MESSAGE, isTransitioning])

  // Save messages to cache when they change
  useEffect(() => {
    if (messages && messages.length > 0 && !isTransitioning) {
      const cacheKey = `${currentPersona}-${language}`
      chatCache[cacheKey] = [...messages]
    }
  }, [messages, currentPersona, language, isTransitioning])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  // Focus textarea when component mounts
  useEffect(() => {
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 500)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSubmit(e as any)
      }
    },
    [handleSubmit],
  )

  const clearChat = useCallback(() => {
    const welcomeMessage = {
      id: `welcome-reset-${Date.now()}`,
      role: "assistant",
      content: WELCOME_MESSAGE[currentPersona as keyof typeof WELCOME_MESSAGE] || WELCOME_MESSAGE.raisa,
    }

    // Update messages state
    setMessages([welcomeMessage])

    // Update cache
    const cacheKey = `${currentPersona}-${language}`
    chatCache[cacheKey] = [welcomeMessage]
  }, [currentPersona, language, setMessages, WELCOME_MESSAGE])

  const formatTime = useCallback(() => {
    const date = new Date()
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }, [])

  const handleShareScreenshot = useCallback(() => {
    setIsScreenshotOpen(true)
  }, [])

  // Group messages by date
  const groupedMessages = useMemo(() => {
    const groups: { [key: string]: typeof messages } = {}

    messages.forEach((message) => {
      // Use today's date as a placeholder since we don't have actual timestamps
      const date = new Date().toLocaleDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })

    return groups
  }, [messages])

  // Memoize persona info to prevent recalculations
  const personaInfo = useMemo(() => {
    return {
      emoji: currentPersona === "rudro" ? "👨🏽‍💻" : currentPersona === "raisa" ? "👧🏽" : "👨🏽‍🦳",
      name:
        currentPersona === "rudro"
          ? t("persona.rudro")
          : currentPersona === "raisa"
            ? t("persona.raisa")
            : t("persona.partho"),
      color:
        currentPersona === "rudro"
          ? "from-emerald-400 to-green-500"
          : currentPersona === "raisa"
            ? "from-orange-400 to-pink-500"
            : "from-blue-400 to-cyan-500",
      lightColor:
        currentPersona === "rudro"
          ? "bg-emerald-500/10"
          : currentPersona === "raisa"
            ? "bg-pink-500/10"
            : "bg-blue-500/10",
    }
  }, [currentPersona, t])

  return (
    <>
      <div
        ref={chatContainerRef}
        className="flex-1 flex flex-col overflow-hidden shadow-lg transition-colors duration-300 bg-[#f5f5f7] dark:bg-[#1a1a1a] border border-[#e0e0e5] dark:border-[#3a3a3c] rounded-xl"
        role="region"
        aria-label="Chat with AI assistant"
      >
        {/* Chat header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e0e5] dark:border-[#3a3a3c]/50 bg-white/90 dark:bg-[#2c2c2e]/90 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br ${personaInfo.color}`}
            >
              <span className="text-lg text-white">{personaInfo.emoji}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm text-gray-900 dark:text-white/90">{personaInfo.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></span>
                {isLoading ? t("status.typing") : t("status.online")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SocialShare currentPersona={currentPersona} onShareScreenshot={handleShareScreenshot} />
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="h-8 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-[#3a3a3c]"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              <span className="text-xs">{t("button.clear")}</span>
            </Button>
          </div>
        </div>

        {/* Chat messages */}
        <ScrollArea
          ref={scrollAreaRef}
          className="flex-1 px-4 py-4 overflow-y-auto bg-[#f5f5f7] dark:bg-[#1a1a1a]"
          aria-label="Chat messages"
        >
          <div className="space-y-6 pb-4 max-w-3xl mx-auto">
            {/* Date separator */}
            <div className="flex justify-center">
              <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400">
                {new Date().toLocaleDateString(language === "bn" ? "bn-BD" : "en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>

            {messages.map((message, index) => {
              // Check if this is the first message or if the previous message was from a different sender
              const isFirstInGroup = index === 0 || messages[index - 1].role !== message.role
              // Check if this is the last message or if the next message is from a different sender
              const isLastInGroup = index === messages.length - 1 || messages[index + 1].role !== message.role

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2 animate-in fade-in-0 slide-in-from-bottom-2",
                    message.role === "user" ? "justify-end" : "justify-start",
                    !isLastInGroup && message.role === "assistant" ? "mb-1" : "mb-3",
                    !isLastInGroup && message.role === "user" ? "mb-1" : "mb-3",
                  )}
                >
                  {message.role === "assistant" && isFirstInGroup && (
                    <div
                      className={`h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br ${personaInfo.color} mt-1`}
                    >
                      <span className="text-xs text-white">{personaInfo.emoji}</span>
                    </div>
                  )}

                  {message.role === "assistant" && !isFirstInGroup && <div className="w-8 flex-shrink-0"></div>}

                  <div
                    className={cn("flex flex-col max-w-[85%]", message.role === "user" ? "items-end" : "items-start")}
                  >
                    <div
                      className={cn(
                        "px-4 py-2.5 rounded-2xl text-sm",
                        message.role === "user"
                          ? "bg-[#0b84fe] text-white rounded-br-md"
                          : `${personaInfo.lightColor} dark:bg-[#2c2c2e] text-gray-900 dark:text-white rounded-bl-md`,
                        !isLastInGroup && message.role === "assistant" ? "rounded-bl-2xl" : "",
                        !isLastInGroup && message.role === "user" ? "rounded-br-2xl" : "",
                      )}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>

                    {isLastInGroup && (
                      <div
                        className={cn(
                          "flex text-[10px] text-gray-500 dark:text-gray-400 mt-1",
                          message.role === "user" ? "justify-end mr-1" : "justify-start ml-1",
                        )}
                      >
                        {formatTime()}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {isLoading && (
              <div className="flex gap-2 animate-in fade-in-0 slide-in-from-bottom-2">
                <div
                  className={`h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br ${personaInfo.color} mt-1`}
                >
                  <span className="text-xs text-white">{personaInfo.emoji}</span>
                </div>
                <div className="flex flex-col max-w-[85%]">
                  <div className={`${personaInfo.lightColor} dark:bg-[#2c2c2e] px-4 py-2 rounded-2xl rounded-bl-md`}>
                    <div className="typing-indicator flex space-x-2 h-5 items-center">
                      <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex gap-2 animate-in fade-in-0 slide-in-from-bottom-2">
                <div className="h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center bg-red-500 mt-1">
                  <span className="text-xs font-bold text-white">!</span>
                </div>
                <div className="flex flex-col max-w-[85%]">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 px-4 py-2.5 rounded-2xl rounded-bl-md text-red-800 dark:text-red-200">
                    <p className="text-sm">{"Oops! " + (error.message || "Something went wrong. Please try again.")}</p>
                  </div>
                  <div className="flex text-[10px] text-gray-500 dark:text-gray-400 mt-1 ml-1">{formatTime()}</div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input area */}
        <div className="p-3 border-t border-[#e0e0e5] dark:border-[#3a3a3c] bg-white/80 dark:bg-[#2c2c2e]/80 backdrop-blur-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (input.trim() !== "") {
                handleSubmit(e)
                if (textareaRef.current) {
                  textareaRef.current.style.height = "auto"
                }
              }
            }}
            className="flex items-end gap-2 max-w-3xl mx-auto relative"
            aria-label="Message input form"
          >
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                placeholder={
                  currentPersona === "raisa"
                    ? t("input.raisa")
                    : currentPersona === "partho"
                      ? t("input.partho")
                      : t("input.rudro")
                }
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="min-h-[44px] max-h-32 py-3 px-4 resize-none shadow-sm flex-1 transition-colors duration-300 bg-gray-100 dark:bg-[#3a3a3c] border-0 focus-visible:ring-1 focus-visible:ring-gray-300 dark:focus-visible:ring-gray-600 text-gray-900 dark:text-white rounded-2xl"
                disabled={isLoading}
                aria-label="Type your message"
                rows={1}
              />
            </div>

            <Button
              type="submit"
              className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-[#0b84fe] text-white hover:bg-[#0a74e4] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
              disabled={isLoading || input.trim() === ""}
              aria-label="Send message"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </form>

          <div className="flex justify-center mt-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {t("app.powered")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot generator dialog */}
      <ScreenshotGenerator
        chatRef={chatContainerRef}
        isOpen={isScreenshotOpen}
        onClose={() => setIsScreenshotOpen(false)}
      />
    </>
  )
}
