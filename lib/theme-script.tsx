"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

export function ThemeScript() {
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    // Check if there's a stored theme preference
    try {
      const storedTheme = localStorage.getItem("theme")

      if (storedTheme) {
        setTheme(storedTheme)

        // Also manually set the class for immediate feedback
        if (storedTheme === "dark") {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      } else {
        // Check for system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        setTheme(prefersDark ? "dark" : "light")

        // Also manually set the class for immediate feedback
        if (prefersDark) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      }
    } catch (e) {
      console.error("Error initializing theme:", e)
    }
  }, [setTheme])

  // Save theme preference when it changes
  useEffect(() => {
    if (theme) {
      try {
        localStorage.setItem("theme", theme)
      } catch (e) {
        console.error("Failed to save theme preference:", e)
      }
    }
  }, [theme])

  return null
}
