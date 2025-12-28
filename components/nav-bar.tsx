"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { usePathname } from "next/navigation"

export function NavBar() {
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const isChatPage = pathname === "/chat"

  return (
    <header
      className={`py-4 px-6 ${isHomePage ? "absolute top-0 left-0 right-0 z-50" : "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"}`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div
            className={`h-8 w-8 rounded-full ${isHomePage ? "bg-white/20" : "bg-primary"} flex items-center justify-center`}
          >
            <span className={`${isHomePage ? "text-white" : "text-white"} font-bold text-xs`}>BB</span>
          </div>
          <span className={`font-bold ${isHomePage ? "text-white" : "dark:text-white"}`}>Bengali Bondhu</span>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {!isChatPage && (
            <Link href="/chat">
              <Button
                variant={isHomePage ? "outline" : "default"}
                className={isHomePage ? "border-white text-white hover:bg-white/10" : ""}
              >
                Open Chat
              </Button>
            </Link>
          )}

          {isChatPage && (
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
