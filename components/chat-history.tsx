"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle, MessageSquare, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface ChatSession {
  id: string
  title: string
  persona: string
  createdAt: number
  updatedAt: number
  messageCount: number
}

interface ChatHistoryProps {
  chatSessions: ChatSession[]
  onSelectChat: (chatId: string) => void
  onCreateNewChat: () => void
  onDeleteChat: (chatId: string) => void
  currentChatId: string
}

export function ChatHistory({
  chatSessions,
  onSelectChat,
  onCreateNewChat,
  onDeleteChat,
  currentChatId,
}: ChatHistoryProps) {
  const { theme } = useTheme()

  // Format date for display
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    }
  }

  // Get persona emoji
  const getPersonaEmoji = (persona: string) => {
    switch (persona) {
      case "retro":
        return "👨🏽‍💻"
      case "girlypop":
        return "👧🏽"
      default:
        return "👨🏽‍🦳"
    }
  }

  // Get persona name
  const getPersonaName = (persona: string) => {
    switch (persona) {
      case "retro":
        return "Rudro"
      case "girlypop":
        return "Raisa"
      default:
        return "Partho"
    }
  }

  // Group chats by date
  const groupedChats = chatSessions.reduce(
    (groups, chat) => {
      const date = formatDate(chat.createdAt)
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(chat)
      return groups
    },
    {} as Record<string, ChatSession[]>,
  )

  return (
    <div className="flex flex-col h-full">
      <Button
        onClick={onCreateNewChat}
        className={cn(
          "mb-4 justify-start gap-2",
          theme === "retro"
            ? "bg-green-900/30 border-2 border-green-500 text-green-500 hover:bg-green-900/50"
            : theme === "girlypop"
              ? "bg-pink-50 text-pink-600 border border-pink-200 hover:bg-pink-100"
              : "bg-gray-800 text-white hover:bg-gray-700",
        )}
      >
        <PlusCircle className="h-4 w-4" />
        <span>New Chat</span>
      </Button>

      <div className="text-sm font-medium mb-2 text-gray-400">Your Conversations</div>

      <ScrollArea className="flex-1 pr-3">
        {Object.keys(groupedChats).length > 0 ? (
          Object.entries(groupedChats).map(([date, chats]) => (
            <div key={date} className="mb-4">
              <div className="text-xs text-gray-500 mb-2">{date}</div>
              <div className="space-y-1">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={cn(
                      "flex items-center justify-between group rounded-lg p-2 cursor-pointer",
                      chat.id === currentChatId
                        ? theme === "retro"
                          ? "bg-green-900/30 border border-green-500"
                          : theme === "girlypop"
                            ? "bg-pink-100"
                            : "bg-gray-700"
                        : "hover:bg-gray-800/50",
                    )}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div
                        className={cn(
                          "h-6 w-6 flex-shrink-0 flex items-center justify-center",
                          theme === "retro"
                            ? "border border-green-500"
                            : theme === "girlypop"
                              ? "rounded-full bg-gradient-to-r from-pink-400 to-purple-400"
                              : "rounded-full bg-primary/80",
                        )}
                      >
                        <span className="text-xs">{getPersonaEmoji(chat.persona)}</span>
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-sm truncate text-gray-200">{chat.title}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <span>{getPersonaName(chat.persona)}</span>
                          <span>•</span>
                          <span>{chat.messageCount} messages</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteChat(chat.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-gray-400" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No conversations yet</p>
            <p className="text-xs mt-1">Start a new chat to begin</p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
