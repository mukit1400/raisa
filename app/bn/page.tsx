import { ThemeHeader } from "@/components/theme-header"
import ChatInterface from "@/components/chat-interface"
import { ClientUrlHandler } from "@/components/client-url-handler"

export default function BengaliHome() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
      <ClientUrlHandler />

      <div className="w-full max-w-3xl flex flex-col h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)] lg:h-[calc(100vh-6rem)]">
        <ThemeHeader />
        <ChatInterface />
      </div>
    </main>
  )
}
