"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full opacity-70" disabled>
        <span className="text-lg">👨🏽‍🦳</span>
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {/* Partho - Wise older Bengali gentleman */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("dark")}
        className={`h-9 w-9 ${theme === "dark" ? "bg-gray-700/50" : ""} rounded-full relative`}
        aria-label="Partho (Dark Theme)"
        title="Partho (Dark Theme)"
      >
        <span className="text-lg" style={theme === "retro" ? { color: "#00ff00" } : {}}>
          👨🏽‍🦳
        </span>
        {theme === "dark" && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background" />
        )}
      </Button>

      {/* Raisa - Young Bengali woman */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("girlypop")}
        className={`h-9 w-9 ${theme === "girlypop" ? "bg-pink-100" : ""} rounded-full relative`}
        aria-label="Raisa (Girlypop Theme)"
        title="Raisa (Girlypop Theme)"
      >
        <span className="text-lg" style={theme === "retro" ? { color: "#00ff00" } : {}}>
          👧🏽
        </span>
        {theme === "girlypop" && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full border-2 border-background" />
        )}
      </Button>

      {/* Rudro - Tech-savvy Bengali man */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("retro")}
        className={`h-9 w-9 ${theme === "retro" ? "bg-black border-2 border-green-500" : ""} relative`}
        aria-label="Rudro (Retro Theme)"
        title="Rudro (Retro Theme)"
        style={theme === "retro" ? { borderRadius: 0 } : {}}
      >
        <span className="text-lg" style={theme === "retro" ? { color: "#00ff00" } : {}}>
          👨🏽‍💻
        </span>
        {theme === "retro" && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500" style={{ borderRadius: 0 }} />
        )}
      </Button>
    </div>
  )
}

