"use client"

import { useEffect } from "react"

export function ClientUrlHandler() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const url = new URL(window.location.href)
        const personaParam = url.searchParams.get("persona")

        if (personaParam && ["raisa", "partho", "rudro"].includes(personaParam)) {
          // Create and dispatch a custom event for the chat interface to listen to
          const event = new CustomEvent("personaChange", {
            detail: { persona: personaParam },
          })
          window.dispatchEvent(event)
        }
      } catch (error) {
        console.error("Error handling URL params:", error)
      }
    }
  }, [])

  return null
}
