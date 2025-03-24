"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2, AlertTriangle, Info, Trash2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface Message {
  role: "assistant" | "user"
  content: string
  isError?: boolean
  errorType?: string
  usingFallback?: boolean
  timestamp?: number
}

export default function ChatInterface() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Assalamu alaikum! Kemon achen? I'm your Bangla Bondhu! You can chat with me in English or Bangla transliteration. 😊",
      timestamp: Date.now(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showApiKeyInfo, setShowApiKeyInfo] = useState(false)
  const { theme } = useTheme()

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = async () => {
    if (input.trim() === "") return

    const userMessage = input.trim()
    setInput("")

    // Focus back on textarea after sending
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 0)

    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        timestamp: Date.now(),
      },
    ])

    // Get response from OpenAI
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()

      // Add assistant response to chat
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.content,
          isError: data.isError,
          errorType: data.errorType,
          usingFallback: data.usingFallback,
          timestamp: Date.now(),
        },
      ])

      // Show API key info if we're using fallback
      if (data.usingFallback && data.errorType === "api_quota_exceeded") {
        setShowApiKeyInfo(true)
      }
    } catch (err) {
      console.error("Error:", err)
      setError("Sorry, something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleRetry = () => {
    // Remove the last assistant message (which was an error)
    setMessages((prev) => prev.slice(0, -1))
    // Try sending the last user message again
    const lastUserMessage = messages.filter((m) => m.role === "user").pop()
    if (lastUserMessage) {
      setInput(lastUserMessage.content)
      setTimeout(() => handleSend(), 100)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared! How can I help you today?",
        timestamp: Date.now(),
      },
    ])
  }

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 shadow-lg rounded-b-lg overflow-hidden">
      {showApiKeyInfo && (
        <div className="bg-amber-50 dark:bg-amber-900/30 p-3 border-b border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-amber-800 dark:text-amber-300">API Quota Exceeded</h3>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                Your OpenAI API key has exceeded its quota. The chatbot is currently running in offline mode with
                limited functionality.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <a
                  href="https://platform.openai.com/account/billing/overview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-md hover:bg-amber-200 dark:hover:bg-amber-700 transition-colors"
                >
                  Check OpenAI Billing
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-800"
                  onClick={() => setShowApiKeyInfo(false)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">GPT-4o-mini</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearChat}
          className="h-8 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          <span className="text-xs">Clear Chat</span>
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 pb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn("flex gap-3 max-w-[85%] message-animation", message.role === "user" ? "ml-auto" : "")}
            >
              {message.role === "assistant" && (
                <div className="h-8 w-8 rounded-full bg-indigo-600 dark:bg-indigo-500 flex-shrink-0 overflow-hidden flex items-center justify-center">
                  <span className="text-xs font-bold text-white">BB</span>
                </div>
              )}
              <div className="flex flex-col">
                <div
                  className={cn(
                    "p-3 rounded-2xl",
                    message.role === "assistant"
                      ? message.isError
                        ? "bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      : "bg-indigo-600 dark:bg-indigo-500 text-white",
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.isError && message.errorType === "api_quota_exceeded" && (
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-800"
                        onClick={() => setShowApiKeyInfo(true)}
                      >
                        <Info className="h-3 w-3 mr-1" /> API Key Info
                      </Button>
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 message-animation">
              <div className="h-8 w-8 rounded-full bg-indigo-600 dark:bg-indigo-500 flex-shrink-0 overflow-hidden flex items-center justify-center">
                <span className="text-xs font-bold text-white">BB</span>
              </div>
              <div className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="flex gap-3 message-animation">
              <div className="h-8 w-8 rounded-full bg-red-500 flex-shrink-0 overflow-hidden flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
              <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[44px] max-h-32 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-lg resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
            disabled={isLoading || input.trim() === ""}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

