"use client"

import type React from "react"

import { useEffect, useState } from "react"

export function VercelSpeedInsights() {
  const [SpeedInsights, setSpeedInsights] = useState<React.ComponentType | null>(null)

  useEffect(() => {
    // Only load the SpeedInsights component on the client side
    const loadSpeedInsights = async () => {
      try {
        const module = await import("@vercel/speed-insights/next")
        setSpeedInsights(() => module.SpeedInsights)
      } catch (error) {
        console.error("Failed to load Vercel Speed Insights:", error)
      }
    }

    loadSpeedInsights()
  }, [])

  // Only render the component if it's loaded
  if (!SpeedInsights) return null

  return <SpeedInsights />
}
