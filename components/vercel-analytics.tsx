"use client"

import type React from "react"

import { useEffect, useState } from "react"

export function VercelAnalytics() {
  const [Analytics, setAnalytics] = useState<React.ComponentType | null>(null)

  useEffect(() => {
    // Only load the Analytics component on the client side
    const loadAnalytics = async () => {
      try {
        const module = await import("@vercel/analytics/react")
        setAnalytics(() => module.Analytics)
      } catch (error) {
        console.error("Failed to load Vercel Analytics:", error)
      }
    }

    loadAnalytics()
  }, [])

  // Only render the component if it's loaded
  if (!Analytics) return null

  return <Analytics />
}
