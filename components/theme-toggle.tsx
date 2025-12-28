"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // After mounting, we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = React.useCallback(() => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark"
    setTheme(newTheme)

    // Also manually set the class for immediate feedback
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Save to localStorage
    try {
      localStorage.setItem("theme", newTheme)
    } catch (e) {
      console.error("Failed to save theme preference:", e)
    }
  }, [resolvedTheme, setTheme])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
        <Moon className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-8 w-8 rounded-full bg-gray-100 dark:bg-[#3a3a3c] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#4a4a4c] transition-colors"
      aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
