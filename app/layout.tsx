import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins, VT323, Press_Start_2P } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

// Load fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
})
const vt323 = VT323({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-vt323",
})
const pressStart2P = Press_Start_2P({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-press-start-2p",
})

export const metadata: Metadata = {
  title: "RAIsa - Your Bengali Friend",
  description: "Chat with your friendly Bengali AI assistant",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} ${vt323.variable} ${pressStart2P.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'