import Link from "next/link"
import type { Metadata } from "next"
import { ThemeHeader } from "@/components/theme-header"

export const metadata: Metadata = {
  title: "পৃষ্ঠা পাওয়া যায়নি | রাইসা এআই",
  description: "দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নেই।",
}

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a]">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <ThemeHeader />

        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">৪০৪ - পৃষ্ঠা পাওয়া যায়নি</h1>
          <p className="text-lg mb-8 text-gray-300">দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নেই।</p>

          <div className="space-y-4">
            <p className="text-gray-400">আপনি চেষ্টা করতে পারেন:</p>
            <ul className="space-y-2 text-blue-400">
              <li>
                <Link href="/bn" className="hover:underline">
                  হোম পেজে ফিরে যান
                </Link>
              </li>
              <li>
                <Link href="/bn/chat" className="hover:underline">
                  চ্যাটে যান
                </Link>
              </li>
              <li>
                <Link href="/bn/about" className="hover:underline">
                  রাইসা সম্পর্কে জানুন
                </Link>
              </li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  )
}
