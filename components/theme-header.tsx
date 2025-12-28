"use client"

import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { LogoSVG } from "@/components/logo-svg"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/contexts/language-context"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useTheme } from "next-themes"

interface ThemeHeaderProps {
  className?: string
}

export function ThemeHeader({ className }: ThemeHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null)
  const { t, language } = useLanguage()
  const { theme } = useTheme()
  const [activePersona, setActivePersona] = useState<string>("raisa")

  // Initialize from URL if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const url = new URL(window.location.href)
        const personaParam = url.searchParams.get("persona")
        if (personaParam && ["raisa", "partho", "rudro"].includes(personaParam)) {
          setActivePersona(personaParam)
        }
      } catch (error) {
        console.error("Error getting URL params:", error)
      }
    }
  }, [])

  // Listen for persona change events
  useEffect(() => {
    const handlePersonaChange = (event: CustomEvent) => {
      if (event.detail && event.detail.persona) {
        setActivePersona(event.detail.persona)
      }
    }

    window.addEventListener("personaChange", handlePersonaChange as EventListener)
    return () => window.removeEventListener("personaChange", handlePersonaChange as EventListener)
  }, [])

  // Handle persona change
  const handlePersonaChange = (persona: string) => {
    if (persona === activePersona) return // Skip if already active

    setActivePersona(persona)

    // Create and dispatch a custom event for the chat interface to listen to
    const event = new CustomEvent("personaChange", {
      detail: { persona },
    })
    window.dispatchEvent(event)

    // Update URL without page reload
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      url.searchParams.set("persona", persona)
      window.history.pushState({}, "", url.toString())
    }
  }

  return (
    <header
      ref={headerRef}
      className={cn(
        "relative h-16 px-3 sm:px-6 flex items-center justify-between overflow-hidden rounded-t-xl bg-white/90 dark:bg-[#2c2c2e] border-b border-[#e0e0e5] dark:border-[#3a3a3c] backdrop-blur-sm",
        className,
      )}
    >
      {/* Logo */}
      <Link
        href={language === "bn" ? "/bn" : "/"}
        className="text-lg sm:text-xl relative z-10 flex items-center text-gray-900 dark:text-white"
        aria-label="Raisa AI - Home"
      >
        <LogoSVG />
        <span className="font-medium">Raisa</span>
        <span className="text-gray-500 dark:text-gray-400 ml-1 font-normal">AI</span>
      </Link>

      {/* Persona Switcher */}
      <div className="flex items-center gap-2 z-10 mx-auto">
        <button
          onClick={() => handlePersonaChange("raisa")}
          className={cn(
            "h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center transition-all duration-200",
            activePersona === "raisa"
              ? "bg-gradient-to-br from-orange-400 to-pink-500 shadow-md scale-100"
              : "bg-gray-100 dark:bg-[#3a3a3c] scale-90 hover:scale-95",
          )}
          aria-label={t("persona.raisa")}
          title={t("persona.raisa")}
        >
          <span
            className={cn(
              "text-base sm:text-lg",
              activePersona === "raisa" ? "text-white" : "text-gray-600 dark:text-gray-300",
            )}
          >
            👧🏽
          </span>
        </button>
        <button
          onClick={() => handlePersonaChange("partho")}
          className={cn(
            "h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center transition-all duration-200",
            activePersona === "partho"
              ? "bg-gradient-to-br from-blue-400 to-cyan-500 shadow-md scale-100"
              : "bg-gray-100 dark:bg-[#3a3a3c] scale-90 hover:scale-95",
          )}
          aria-label={t("persona.partho")}
          title={t("persona.partho")}
        >
          <span
            className={cn(
              "text-base sm:text-lg",
              activePersona === "partho" ? "text-white" : "text-gray-600 dark:text-gray-300",
            )}
          >
            👨🏽‍🦳
          </span>
        </button>
        <button
          onClick={() => handlePersonaChange("rudro")}
          className={cn(
            "h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center transition-all duration-200",
            activePersona === "rudro"
              ? "bg-gradient-to-br from-emerald-400 to-green-500 shadow-md scale-100"
              : "bg-gray-100 dark:bg-[#3a3a3c] scale-90 hover:scale-95",
          )}
          aria-label={t("persona.rudro")}
          title={t("persona.rudro")}
        >
          <span
            className={cn(
              "text-base sm:text-lg",
              activePersona === "rudro" ? "text-white" : "text-gray-600 dark:text-gray-300",
            )}
          >
            👨🏽‍💻
          </span>
        </button>
      </div>

      {/* Theme toggle and Language switcher */}
      <nav className="flex items-center gap-3 relative z-10" aria-label="Site navigation">
        <ThemeToggle />
        <LanguageSwitcher />
      </nav>
    </header>
  )
}
