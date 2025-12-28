import Link from "next/link"
import type { Metadata } from "next"
import { ThemeHeader } from "@/components/theme-header"

export const metadata: Metadata = {
  title: "Page Not Found | Raisa AI",
  description: "Sorry, the page you are looking for does not exist.",
}

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a]">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <ThemeHeader />

        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">404 - Page Not Found</h1>
          <p className="text-lg mb-8 text-gray-300">Sorry, the page you are looking for does not exist.</p>

          <div className="space-y-4">
            <p className="text-gray-400">You might want to try:</p>
            <ul className="space-y-2 text-blue-400">
              <li>
                <Link href="/" className="hover:underline">
                  Return to Home Page
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:underline">
                  Go to Chat
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  Learn About Raisa
                </Link>
              </li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  )
}
