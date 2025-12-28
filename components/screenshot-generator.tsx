"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Twitter, Facebook } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import html2canvas from "html2canvas"
import { useLanguage } from "@/contexts/language-context"
import { createPortal } from "react-dom"
import { useTheme } from "next-themes"

interface ScreenshotGeneratorProps {
  chatRef: React.RefObject<HTMLDivElement>
  isOpen: boolean
  onClose: () => void
}

export function ScreenshotGenerator({ chatRef, isOpen, onClose }: ScreenshotGeneratorProps) {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const isRetro = theme === "retro"
  const isGirlypop = theme === "girlypop" || !theme

  // Generate screenshot when dialog opens
  useEffect(() => {
    if (isOpen && !screenshotUrl && !isGenerating) {
      generateScreenshot()
    }
  }, [isOpen, screenshotUrl, isGenerating])

  const generateScreenshot = async () => {
    if (!chatRef.current || isGenerating) return

    setIsGenerating(true)

    try {
      // Add a class to the chat container for screenshot styling
      chatRef.current.classList.add("screenshot-mode")

      const canvas = await html2canvas(chatRef.current, {
        scale: 2, // Higher resolution
        backgroundColor: isRetro ? "#000000" : isGirlypop ? "#ffffff" : "#1c1917",
        logging: false,
        allowTaint: true,
        useCORS: true,
      })

      // Remove the screenshot mode class
      chatRef.current.classList.remove("screenshot-mode")

      const dataUrl = canvas.toDataURL("image/png")
      setScreenshotUrl(dataUrl)
    } catch (error) {
      console.error("Error generating screenshot:", error)
      toast({
        title: "Screenshot failed",
        description: "There was an error generating your screenshot",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Download the screenshot
  const downloadScreenshot = () => {
    if (!screenshotUrl) return

    const link = document.createElement("a")
    link.href = screenshotUrl
    link.download = `raisa-chat-${new Date().toISOString().slice(0, 10)}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Screenshot downloaded",
      description: "Your conversation screenshot has been saved",
    })
  }

  // Share on Twitter
  const shareOnTwitter = () => {
    if (!screenshotUrl) return

    // Since we can't share the image directly via Twitter's API,
    // we'll just share the URL with text encouraging to download the image
    const tweetText = "Check out my conversation with my Bengali AI friend! Chat with Raisa at raisa.im"
    const tweetUrl = "https://raisa.im"
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(tweetUrl)}`

    window.open(twitterUrl, "_blank")

    toast({
      title: "Shared on Twitter",
      description: "Your conversation link has been shared on Twitter",
    })
  }

  // Share on Facebook
  const shareOnFacebook = () => {
    if (!screenshotUrl) return

    // Facebook sharing - just share the URL
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://raisa.im")}`
    window.open(facebookUrl, "_blank")

    toast({
      title: "Shared on Facebook",
      description: "Your conversation link has been shared on Facebook",
    })
  }

  if (!isOpen || !mounted) return null

  // Create a direct portal to the document body
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-[#2c2c2e] border border-[#3a3a3c] rounded-lg shadow-xl w-full max-w-lg p-6 z-[10000] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute right-4 top-4 text-gray-400 hover:text-white" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div>
          <h2 className="text-xl font-semibold text-white mb-1">{t("dialog.share.title")}</h2>
          <p className="text-gray-400 text-sm mb-4">
            {isGenerating ? t("dialog.share.generating") : t("dialog.share.description")}
          </p>
        </div>

        <div className="flex justify-center p-2">
          {isGenerating ? (
            <div className="w-full h-48 flex items-center justify-center rounded-md bg-[#1a1a1a]">
              <div className="animate-pulse text-center">
                <div
                  className="h-8 w-8 mx-auto mb-2 border-t-2 border-[#0b84fe]"
                  style={{
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <p className="text-sm text-gray-400">{t("dialog.share.generating")}</p>
              </div>
            </div>
          ) : screenshotUrl ? (
            <div className="relative w-full overflow-hidden rounded-md shadow-md">
              <img
                ref={imageRef}
                src={screenshotUrl || "/placeholder.svg"}
                alt="Conversation Screenshot"
                className="w-full h-auto"
              />
              <div className="absolute bottom-2 right-2 text-xs py-1 px-2 rounded opacity-70 bg-[#1a1a1a] text-gray-400">
                raisa.im
              </div>
            </div>
          ) : (
            <div className="w-full h-48 flex items-center justify-center rounded-md bg-[#1a1a1a]">
              <p className="text-sm text-gray-400">{t("dialog.share.failed")}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={shareOnTwitter}
              disabled={!screenshotUrl || isGenerating}
              className="flex-1 bg-[#2c2c2e] border-[#3a3a3c] text-white hover:bg-[#3a3a3c]"
            >
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shareOnFacebook}
              disabled={!screenshotUrl || isGenerating}
              className="flex-1 bg-[#2c2c2e] border-[#3a3a3c] text-white hover:bg-[#3a3a3c]"
            >
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </Button>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-[#2c2c2e] border-[#3a3a3c] text-white hover:bg-[#3a3a3c]"
          >
            {t("button.cancel")}
          </Button>
          <Button
            variant="default"
            onClick={downloadScreenshot}
            disabled={!screenshotUrl || isGenerating}
            className="bg-[#0b84fe] text-white hover:bg-[#0a74e4]"
          >
            <Download className="h-4 w-4 mr-2" />
            {t("button.download")}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
