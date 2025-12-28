"use client"

import { useState, useEffect } from "react"
import { Keyboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

export function KeyboardShortcuts() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(true)
  const { theme } = useTheme()

  useEffect(() => {
    // Check if we're on a mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Don't show on mobile
  if (isMobile) return null

  const isRetro = theme === "retro"
  const isGirlypop = theme === "girlypop"

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={cn(
          "p-2 rounded-full shadow-lg",
          isRetro
            ? "bg-black border-2 border-green-500 text-green-500"
            : isGirlypop
              ? "bg-white text-pink-500 border border-pink-200"
              : "bg-gray-800 text-gray-300",
        )}
        aria-label="Keyboard shortcuts"
      >
        <Keyboard className="h-5 w-5" />
      </button>

      {isVisible && (
        <div
          className={cn(
            "absolute bottom-12 right-0 p-4 rounded-lg shadow-xl w-64",
            isRetro
              ? "bg-black border-2 border-green-500 text-green-500"
              : isGirlypop
                ? "bg-white text-gray-700 border border-pink-200"
                : "bg-gray-800 text-gray-200",
          )}
        >
          <h3 className="font-bold mb-2">Keyboard Shortcuts</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span>Send message</span>
              <kbd
                className={cn(
                  "px-2 py-0.5 rounded text-xs",
                  isRetro
                    ? "bg-green-900/30 border border-green-500"
                    : isGirlypop
                      ? "bg-pink-50 border border-pink-200"
                      : "bg-gray-700 border border-gray-600",
                )}
              >
                Enter
              </kbd>
            </li>
            <li className="flex justify-between">
              <span>New line</span>
              <kbd
                className={cn(
                  "px-2 py-0.5 rounded text-xs",
                  isRetro
                    ? "bg-green-900/30 border border-green-500"
                    : isGirlypop
                      ? "bg-pink-50 border border-pink-200"
                      : "bg-gray-700 border border-gray-600",
                )}
              >
                Shift + Enter
              </kbd>
            </li>
            <li className="flex justify-between">
              <span>Clear chat</span>
              <kbd
                className={cn(
                  "px-2 py-0.5 rounded text-xs",
                  isRetro
                    ? "bg-green-900/30 border border-green-500"
                    : isGirlypop
                      ? "bg-pink-50 border border-pink-200"
                      : "bg-gray-700 border border-gray-600",
                )}
              >
                Alt + C
              </kbd>
            </li>
          </ul>
          <button
            onClick={() => setIsVisible(false)}
            className={cn(
              "w-full mt-3 py-1 text-xs rounded",
              isRetro
                ? "bg-green-900/30 border border-green-500 hover:bg-green-900/50"
                : isGirlypop
                  ? "bg-pink-50 border border-pink-200 hover:bg-pink-100"
                  : "bg-gray-700 border border-gray-600 hover:bg-gray-600",
            )}
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}
