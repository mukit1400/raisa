"use client"

import type React from "react"

import { useChat } from "ai/react"
import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

export default function ChatInterface() {
  const { theme } = useTheme()
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          theme === "retro"
            ? "Ami Rudro! Kemon acho bondhu? Let's chat about tech, city life, or whatever's on your mind!"
            : theme === "girlypop"
              ? "Heyy! Kemon achis? I'm Raisa! ✨ So excited to chat with you! We can talk in English or Bangla - whatever you like, bondhu! 💕"
              : "Nomoshkar. Ami Partho. How are you today? Life is like a river—always flowing. What's on your mind that we can explore together?",
      },
    ],
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Update welcome message when theme changes
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === "welcome") {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content:
            theme === "retro"
              ? "Ami Rudro! Kemon acho bondhu? Let's chat about tech, city life, or whatever's on your mind!"
              : theme === "girlypop"
                ? "Heyy! Kemon achis? I'm Raisa! ✨ So excited to chat with you! We can talk in English or Bangla - whatever you like, bondhu! 💕"
                : "Nomoshkar. Ami Partho. How are you today? Life is like a river—always flowing. What's on your mind that we can explore together?",
        },
      ])
    }
  }, [theme, messages, setMessages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        content:
          theme === "retro"
            ? "Ami abar Rudro! Let's start fresh. Office theke free? What's up?"
            : theme === "girlypop"
              ? "Chat cleared! ✨ Let's start fresh! How can I help you today, bondhu? 💖"
              : "Chat cleared. Notun kore shuru kori. Remember, every conversation is a new opportunity for wisdom.",
      },
    ])
  }

  const formatTime = () => {
    const date = new Date()
    return theme === "retro"
      ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const isRetro = theme === "retro"
  const isGirlypop = theme === "girlypop"

  return (
    <div
      className={cn(
        "flex-1 flex flex-col overflow-hidden rounded-b-xl",
        isRetro
          ? "bg-black border-green-500"
          : isGirlypop
            ? "bg-white/80 shadow-lg border border-pink-200"
            : "bg-secondary/30 shadow-lg",
      )}
    >
      {isRetro && <div className="retro-scanlines absolute inset-0 pointer-events-none" />}

      <div
        className={cn(
          "flex items-center justify-between px-6 py-3 border-b",
          isRetro ? "border-green-500 bg-black" : isGirlypop ? "border-pink-200 bg-white/80" : "chat-header",
        )}
      >
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-sm font-medium",
              isRetro ? "text-green-500" : isGirlypop ? "text-pink-500" : "text-gray-300",
            )}
            style={isRetro ? { color: "#00ff00" } : {}}
          >
            {isRetro ? "CHAT WITH RUDRO" : isGirlypop ? "Chat with Raisa ✨" : "Chat with Partho"}
          </span>
        </div>
        <Button
          variant={isRetro ? "outline" : "ghost"}
          size="sm"
          onClick={clearChat}
          className={cn(
            "h-8 px-3",
            isRetro
              ? "text-green-500 hover:text-green-400"
              : isGirlypop
                ? "text-pink-500 hover:text-pink-600"
                : "text-gray-400 hover:text-gray-200",
          )}
        >
          <Trash2 className="h-4 w-4 mr-1.5" style={isRetro ? { color: "#00ff00" } : {}} />
          <span className="text-xs" style={isRetro ? { color: "#00ff00" } : {}}>
            {isRetro ? "CLEAR" : "Clear"}
          </span>
        </Button>
      </div>

      <ScrollArea className={cn("flex-1 px-6 py-4", isRetro && "retro-scrollarea")}>
        <div className="space-y-6 pb-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-3 message-animation", message.role === "user" ? "justify-end" : "justify-start")}
            >
              <div className="flex flex-col max-w-[80%]">
                {message.role === "assistant" && (
                  <div className="flex items-center mb-1 ml-1">
                    <div
                      className={cn(
                        "h-6 w-6 flex-shrink-0 overflow-hidden flex items-center justify-center mr-2",
                        isRetro
                          ? "border-2 border-green-500"
                          : isGirlypop
                            ? "rounded-full bg-gradient-to-r from-pink-400 to-purple-400 shadow-md"
                            : "rounded-full bg-primary/90 shadow-md",
                      )}
                    >
                      <span
                        className={cn("text-xs font-bold", isRetro ? "text-green-500" : "text-white")}
                        style={isRetro ? { color: "#00ff00" } : {}}
                      >
                        {isRetro ? "R" : isGirlypop ? "R" : "P"}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "text-xs",
                        isRetro ? "text-green-500" : isGirlypop ? "text-pink-400" : "text-gray-400",
                      )}
                      style={isRetro ? { color: "#00ff00" } : {}}
                    >
                      {formatTime()}
                    </span>
                  </div>
                )}

                <div className={cn("message-bubble", message.role === "user" ? "user-bubble" : "assistant-bubble")}>
                  <p
                    className={cn("text-sm whitespace-pre-wrap leading-relaxed", isRetro && "font-mono")}
                    style={isRetro ? { color: "#00ff00" } : {}}
                  >
                    {message.content}
                  </p>
                </div>

                {message.role === "user" && (
                  <div className="flex justify-end mt-1 mr-1">
                    <span
                      className={cn(
                        "text-xs",
                        isRetro ? "text-green-500" : isGirlypop ? "text-pink-400" : "text-gray-400",
                      )}
                      style={isRetro ? { color: "#00ff00" } : {}}
                    >
                      {formatTime()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 message-animation">
              <div className="flex flex-col max-w-[80%]">
                <div className="flex items-center mb-1 ml-1">
                  <div
                    className={cn(
                      "h-6 w-6 flex-shrink-0 overflow-hidden flex items-center justify-center mr-2",
                      isRetro
                        ? "border-2 border-green-500"
                        : isGirlypop
                          ? "rounded-full bg-gradient-to-r from-pink-400 to-purple-400 shadow-md"
                          : "rounded-full bg-primary/90 shadow-md",
                    )}
                  >
                    <span
                      className={cn("text-xs font-bold", isRetro ? "text-green-500" : "text-white")}
                      style={isRetro ? { color: "#00ff00" } : {}}
                    >
                      {isRetro ? "R" : isGirlypop ? "R" : "P"}
                    </span>
                  </div>
                </div>
                <div
                  className={cn(
                    "message-bubble assistant-bubble",
                    isRetro ? "bg-black border-green-600" : isGirlypop && "bg-white border-pink-200",
                  )}
                >
                  <div className="typing-indicator flex space-x-1 h-5 items-center px-1">
                    <span className="w-2 h-2 rounded-full"></span>
                    <span className="w-2 h-2 rounded-full"></span>
                    <span className="w-2 h-2 rounded-full"></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-start message-animation">
              <div className="flex flex-col max-w-[80%]">
                <div className="flex items-center mb-1 ml-1">
                  <div
                    className={cn(
                      "h-6 w-6 flex-shrink-0 overflow-hidden flex items-center justify-center mr-2",
                      isRetro
                        ? "border-2 border-red-500"
                        : isGirlypop
                          ? "rounded-full bg-red-400"
                          : "rounded-full bg-amber-500",
                    )}
                  >
                    <span className={cn("text-xs font-bold", isRetro ? "text-red-500" : "text-white")}>!</span>
                  </div>
                </div>
                <div className="message-bubble error-bubble">
                  <p className="text-sm" style={isRetro ? { color: "#ff0000" } : {}}>
                    {isRetro
                      ? "ERROR: " + (error.message || "SYSTEM MALFUNCTION")
                      : isGirlypop
                        ? "Oops! " + (error.message || "Something went wrong. Let's try again, okay? 💖")
                        : "Aiyo! " + (error.message || "Something went wrong. Please try again, bondhu!")}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div
        className={cn(
          "p-6 border-t",
          isRetro ? "border-green-500 bg-black" : isGirlypop ? "border-pink-200 bg-white/80" : "chat-footer",
        )}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (input.trim() !== "") {
              handleSubmit(e)
            }
          }}
          className="flex gap-3 max-w-3xl mx-auto"
        >
          <Textarea
            ref={textareaRef}
            placeholder={
              isRetro
                ? "TYPE TO RUDRO..."
                : isGirlypop
                  ? "Type your message to Raisa... ✨"
                  : "Type your message to Partho..."
            }
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={cn(
              "min-h-[48px] max-h-32 resize-none px-4 py-3 shadow-sm",
              isRetro
                ? "bg-black border-2 border-green-500 text-green-400 rounded-none"
                : isGirlypop
                  ? "bg-white border border-pink-200 text-gray-700 rounded-xl"
                  : "input-dark rounded-lg text-gray-200",
            )}
            style={isRetro ? { color: "#00ff00" } : {}}
            disabled={isLoading}
          />
          <Button
            type="submit"
            className={cn(
              "h-[48px] w-[48px] shadow-sm",
              isRetro
                ? "bg-black border-2 border-green-500 text-green-500 hover:bg-green-900 hover:text-green-400"
                : isGirlypop
                  ? "rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500"
                  : "rounded-full btn-primary text-white",
            )}
            disabled={isLoading || input.trim() === ""}
            onClick={(e) => {
              e.preventDefault()
              if (input.trim() !== "") {
                handleSubmit(e as any)
              }
            }}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" style={isRetro ? { color: "#00ff00" } : {}} />
            ) : (
              <Send className="h-5 w-5" style={isRetro ? { color: "#00ff00" } : {}} />
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

