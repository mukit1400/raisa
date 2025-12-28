"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Check if the app is already installed
    const isAppInstalled = window.matchMedia("(display-mode: standalone)").matches

    if (isAppInstalled) {
      return // Don't show install prompt if already installed
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      // Show the install button
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as any)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as any)
    }
  }, [])

  const handleInstallClick = () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt")
      } else {
        console.log("User dismissed the install prompt")
      }
      // Clear the saved prompt since it can't be used again
      setDeferredPrompt(null)
      setShowPrompt(false)
    })
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-50">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium">Install Bengali Chat App</h3>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowPrompt(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        Install this app on your device for a better experience with offline support.
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => setShowPrompt(false)}>
          Not now
        </Button>
        <Button size="sm" onClick={handleInstallClick}>
          Install
        </Button>
      </div>
    </div>
  )
}
