"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Twitter, Facebook, Linkedin, Copy, Check, Camera } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { useLanguage } from "@/contexts/language-context"
import { createPortal } from "react-dom"

interface SocialShareProps {
  className?: string
  currentPersona?: string
  onShareScreenshot?: () => void
}

export function SocialShare({ className, currentPersona = "raisa", onShareScreenshot }: SocialShareProps) {
  const { language, t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  // Get persona name based on language
  const personaName = (() => {
    if (currentPersona === "rudro") return t("persona.rudro")
    if (currentPersona === "raisa") return t("persona.raisa")
    return t("persona.partho")
  })()

  // Get share URL and text
  const getShareUrl = () => {
    const langPath = language === "bn" ? "/bn" : ""
    return `https://raisa.im${langPath}?persona=${currentPersona}`
  }

  const getShareText = () => {
    return language === "bn"
      ? `আমার বাঙালি এআই বন্ধু ${personaName}-এর সাথে কথোপকথন দেখুন! #RaisaAI`
      : `Check out my conversation with ${personaName}, my Bengali AI friend! #RaisaAI`
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareUrl())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    toast({
      title: t("button.copied"),
      description: language === "bn" ? "শেয়ার লিঙ্ক ক্লিপবোর্ডে কপি করা হয়েছে" : "Share link has been copied to clipboard",
      action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
    })

    setIsMenuOpen(false)
  }

  const openTwitterShare = (e: React.MouseEvent) => {
    e.preventDefault()
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}&url=${encodeURIComponent(getShareUrl())}`
    window.open(twitterUrl, "_blank")
    setIsMenuOpen(false)
  }

  const openFacebookShare = (e: React.MouseEvent) => {
    e.preventDefault()
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`
    window.open(facebookUrl, "_blank")
    setIsMenuOpen(false)
  }

  const openLinkedInShare = (e: React.MouseEvent) => {
    e.preventDefault()
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`
    window.open(linkedinUrl, "_blank")
    setIsMenuOpen(false)
  }

  const handleScreenshotClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onShareScreenshot) {
      onShareScreenshot()
    }
    setIsMenuOpen(false)
  }

  return (
    <div className={cn("relative", className)}>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="h-8 px-3 rounded-full bg-gray-100 dark:bg-[#3a3a3c] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#4a4a4c]"
      >
        <Share2 className="h-4 w-4 mr-1.5" />
        <span className="text-xs">{t("button.share")}</span>
      </Button>

      {isMenuOpen &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[9998]" onClick={() => setIsMenuOpen(false)}>
            <div
              ref={menuRef}
              className="absolute z-[9999] rounded-xl shadow-lg bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-[#3a3a3c] animate-in fade-in-0 zoom-in-95 duration-100"
              style={{
                top: buttonRef.current ? buttonRef.current.getBoundingClientRect().bottom + window.scrollY + 8 : 0,
                left: buttonRef.current ? buttonRef.current.getBoundingClientRect().left + window.scrollX : 0,
                width: "14rem",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-3 grid gap-2">
                <h3 className="text-sm font-medium mb-1 text-gray-900 dark:text-white">{t("dialog.share.title")}</h3>
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-white dark:bg-[#2c2c2e] border-gray-200 dark:border-[#3a3a3c] text-[#1DA1F2] hover:bg-gray-50 dark:hover:bg-[#3a3a3c]"
                    onClick={openTwitterShare}
                  >
                    <Twitter className="h-4 w-4" />
                    <span className="sr-only">Twitter</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-white dark:bg-[#2c2c2e] border-gray-200 dark:border-[#3a3a3c] text-[#1877F2] hover:bg-gray-50 dark:hover:bg-[#3a3a3c]"
                    onClick={openFacebookShare}
                  >
                    <Facebook className="h-4 w-4" />
                    <span className="sr-only">Facebook</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-white dark:bg-[#2c2c2e] border-gray-200 dark:border-[#3a3a3c] text-[#0A66C2] hover:bg-gray-50 dark:hover:bg-[#3a3a3c]"
                    onClick={openLinkedInShare}
                  >
                    <Linkedin className="h-4 w-4" />
                    <span className="sr-only">LinkedIn</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-white dark:bg-[#2c2c2e] border-gray-200 dark:border-[#3a3a3c] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#3a3a3c]"
                    onClick={handleScreenshotClick}
                  >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Screenshot</span>
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-1 bg-white dark:bg-[#2c2c2e] border-gray-200 dark:border-[#3a3a3c] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#3a3a3c]"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                      <span className="text-xs">{t("button.copied")}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1.5" />
                      <span className="text-xs">{t("button.copyLink")}</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
