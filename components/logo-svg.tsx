"use client"

import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface LogoSVGProps {
  className?: string
}

export function LogoSVG({ className }: LogoSVGProps) {
  const { theme } = useTheme()

  // Different SVG based on theme
  if (theme === "retro") {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("mr-2", className)}
      >
        <rect x="2" y="2" width="20" height="20" stroke="#00FF00" strokeWidth="2" />
        <rect x="6" y="6" width="12" height="12" fill="#00FF00" />
        <rect x="9" y="9" width="6" height="6" fill="black" />
      </svg>
    )
  }

  if (theme === "girlypop") {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("mr-2", className)}
      >
        {/* Heart shape */}
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="url(#girlypop-gradient)"
        />

        {/* Sparkles */}
        <circle cx="6" cy="7" r="1" fill="white" opacity="0.8" />
        <circle cx="18" cy="7" r="1" fill="white" opacity="0.8" />
        <circle cx="10" cy="4" r="1" fill="white" opacity="0.8" />
        <circle cx="14" cy="4" r="1" fill="white" opacity="0.8" />
        <circle cx="20" cy="12" r="1" fill="white" opacity="0.8" />
        <circle cx="4" cy="12" r="1" fill="white" opacity="0.8" />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="girlypop-gradient" x1="2" y1="3" x2="22" y2="21" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF9FF3" />
            <stop offset="0.5" stopColor="#F368E0" />
            <stop offset="1" stopColor="#B83ACE" />
          </linearGradient>
        </defs>
      </svg>
    )
  }

  // Enhance the dark theme logo
  // Default dark theme
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("mr-2", className)}
    >
      {/* Brain/AI shape with enhanced glow effect */}
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        fill="url(#purple-gradient)"
        filter="url(#glow)"
      />
      <path
        d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm3 7h-2v2h-2v-2H9v-2h2V9h2v2h2v2z"
        fill="url(#purple-gradient)"
        filter="url(#glow)"
      />

      {/* Enhanced gradient definition */}
      <defs>
        <linearGradient id="purple-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A78BFA" />
          <stop offset="0.5" stopColor="#954CEA" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>

      {/* Add subtle pulse animation */}
      <circle cx="12" cy="12" r="11" stroke="url(#purple-gradient)" strokeWidth="0.5" fill="none" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite" />
        <animate attributeName="r" values="11;11.5;11" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

