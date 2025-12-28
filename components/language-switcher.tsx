"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface LanguageSwitcherProps {
  className?: string
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage()
  const [currentPath, setCurrentPath] = useState<string>("")

  // Get current path on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname)
    }
  }, [])

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "bn" : "en")
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className={cn(
        "h-8 px-3 rounded-full bg-gray-100 dark:bg-[#3a3a3c] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#4a4a4c]",
        className,
      )}
    >
      <Globe className="h-4 w-4 mr-1.5" />
      <span className="text-xs">{t("language.switch")}</span>
    </Button>
  )
}
