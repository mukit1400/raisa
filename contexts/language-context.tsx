"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type Language = "en" | "bn"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// English translations
const enTranslations: Record<string, string> = {
  // General UI
  "app.title": "Raisa - Your Bengali Friend",
  "app.powered": "Powered by GPT-4o-mini",

  // Buttons and actions
  "button.share": "Share",
  "button.clear": "Clear",
  "button.cancel": "Cancel",
  "button.download": "Download",
  "button.copied": "Copied!",
  "button.copyLink": "Copy link",

  // Placeholders
  "input.raisa": "Message Raisa...",
  "input.partho": "Message Partho...",
  "input.rudro": "Message Rudro...",

  // Headers
  "header.raisa": "Chat with Raisa",
  "header.partho": "Chat with Partho",
  "header.rudro": "Chat with Rudro",

  // Dialogs
  "dialog.share.title": "Share Conversation",
  "dialog.share.description": "Your conversation screenshot is ready to share!",
  "dialog.share.generating": "Generating your conversation screenshot...",
  "dialog.share.failed": "Failed to generate screenshot",

  // Persona names
  "persona.raisa": "Raisa",
  "persona.partho": "Partho",
  "persona.rudro": "Rudro",

  // Hints
  "hint.changePersona": "Tap to change personas",

  // Language switcher
  "language.switch": "বাংলা",

  // Status
  "status.online": "Online",
  "status.typing": "Typing...",
  "status.lastSeen": "Last seen today at",

  // Attachments
  "attachment.photo": "Photo",
  "attachment.file": "File",
  "attachment.voice": "Voice",

  // Message info
  "message.delivered": "Delivered",
  "message.read": "Read",
  "message.sending": "Sending...",
}

// Bengali translations
const bnTranslations: Record<string, string> = {
  // General UI
  "app.title": "রাইসা - আপনার বাঙালি বন্ধু",
  "app.powered": "জিপিটি-৪ও-মিনি দ্বারা চালিত",

  // Buttons and actions
  "button.share": "শেয়ার",
  "button.clear": "মুছুন",
  "button.cancel": "বাতিল",
  "button.download": "ডাউনলোড",
  "button.copied": "কপি হয়েছে!",
  "button.copyLink": "লিঙ্ক কপি করুন",

  // Placeholders
  "input.raisa": "রাইসাকে মেসেজ করুন...",
  "input.partho": "পার্থোকে মেসেজ করুন...",
  "input.rudro": "রুদ্রকে মেসেজ করুন...",

  // Headers
  "header.raisa": "রাইসার সাথে চ্যাট করুন",
  "header.partho": "পার্থোর সাথে চ্যাট করুন",
  "header.rudro": "রুদ্রর সাথে চ্যাট করুন",

  // Dialogs
  "dialog.share.title": "কথোপকথন শেয়ার করুন",
  "dialog.share.description": "আপনার কথোপকথনের স্ক্রিনশট শেয়ার করার জন্য প্রস্তুত!",
  "dialog.share.generating": "আপনার স্ক্রিনশট তৈরি করা হচ্ছে...",
  "dialog.share.failed": "স্ক্রিনশট তৈরি করতে ব্যর্থ হয়েছে",

  // Persona names
  "persona.raisa": "রাইসা",
  "persona.partho": "পার্থো",
  "persona.rudro": "রুদ্র",

  // Hints
  "hint.changePersona": "পার্সোনা পরিবর্তন করতে ট্যাপ করুন",

  // Language switcher
  "language.switch": "English",

  // Status
  "status.online": "অনলাইন",
  "status.typing": "টাইপিং...",
  "status.lastSeen": "আজ দেখা হয়েছে",

  // Attachments
  "attachment.photo": "ছবি",
  "attachment.file": "ফাইল",
  "attachment.voice": "ভয়েস",

  // Message info
  "message.delivered": "পৌঁছেছে",
  "message.read": "পড়া হয়েছে",
  "message.sending": "পাঠানো হচ্ছে...",
}

const translations: Record<Language, Record<string, string>> = {
  en: enTranslations,
  bn: bnTranslations,
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    // Determine language from URL on client side
    if (typeof window !== "undefined") {
      const path = window.location.pathname
      const lang = path.startsWith("/bn") ? "bn" : "en"
      setLanguageState(lang)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)

    // Navigate to the appropriate route
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname
      const newPath = lang === "bn" ? currentPath.replace(/^\/(?:bn)?/, "/bn") : currentPath.replace(/^\/bn/, "")

      // Preserve search params
      const searchParams = window.location.search
      router.push(newPath + searchParams)
    }
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
