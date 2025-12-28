"use client"

import { useEffect, useState } from "react"

interface CuteTextProps {
  text: string
  aiText?: string
  className?: string
  intensity?: "low" | "medium" | "high"
}

export function CuteText({ text, aiText, className = "", intensity = "low" }: CuteTextProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [emoji, setEmoji] = useState("")

  // Much more subtle animation with less frequent changes
  useEffect(() => {
    // Only animate occasionally
    const animationInterval = setInterval(
      () => {
        // 20% chance to animate at all
        if (Math.random() > 0.8) {
          setIsAnimating(true)

          // More subtle emoji choices
          const emojis = ["✨", ""]
          setEmoji(emojis[Math.floor(Math.random() * emojis.length)])

          // Turn off animation after a short period
          setTimeout(() => {
            setIsAnimating(false)
          }, 1000)
        }
      },
      intensity === "high" ? 5000 : intensity === "medium" ? 8000 : 10000,
    )

    return () => clearInterval(animationInterval)
  }, [intensity])

  return (
    <span className={`${className} relative`}>
      {text}
      {aiText && (
        <span className="ml-1 font-medium text-gray-600">
          {aiText}
          {emoji && (
            <span className={`inline-block ml-0.5 text-xs ${isAnimating ? "animate-pulse" : "opacity-70"}`}>
              {emoji}
            </span>
          )}
        </span>
      )}
    </span>
  )
}
