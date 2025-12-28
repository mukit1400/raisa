import ChatInterface from "../components/chat-interface"
import { ThemeHeader } from "@/components/theme-header"
import { ClientUrlHandler } from "@/components/client-url-handler"
import Script from "next/script"

export default function Page() {
  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Raisa - Bengali AI Chat",
            description:
              "Chat with your friendly Bengali AI assistants - Raisa, Partho, and Rudro. Experience Bengali culture through conversation.",
            url: "https://raisa.im",
            applicationCategory: "ChatApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            inLanguage: ["en", "bn"],
            author: {
              "@type": "Organization",
              name: "Raisa.im",
            },
          }),
        }}
      />

      <ClientUrlHandler />

      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="w-full max-w-3xl flex flex-col h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)] lg:h-[calc(100vh-6rem)]">
          <ThemeHeader />
          <ChatInterface />
        </div>
      </main>
    </>
  )
}
