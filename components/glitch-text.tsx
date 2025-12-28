"use client"

import { useEffect, useState } from "react"

interface GlitchTextProps {
  text: string
  className?: string
  intensity?: "low" | "medium" | "high"
}

export function GlitchText({ text, className = "", intensity = "medium" }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(true)

  // Randomly toggle glitch effect for more realistic appearance
  useEffect(() => {
    const intervalDuration = intensity === "high" ? 200 : intensity === "medium" ? 500 : 1000

    const glitchInterval = setInterval(() => {
      setIsGlitching(true)

      // Turn off glitch after a short period
      setTimeout(() => {
        setIsGlitching(Math.random() > 0.3) // 70% chance to keep glitching
      }, Math.random() * 200)
    }, intervalDuration)

    return () => clearInterval(glitchInterval)
  }, [intensity])

  return (
    <span className={`${className} ${isGlitching ? "glitch-text" : ""}`} data-text={text}>
      {text}
      <span className="inline-block ml-0.5 text-xs opacity-70 animate-pulse">{isGlitching ? "_//>" : ""}</span>
    </span>
  )
}
