"use client"

import { cn } from "@/lib/utils"

interface LogoSVGProps {
  className?: string
}

export function LogoSVG({ className }: LogoSVGProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("mr-2", className)}
    >
      <rect width="24" height="24" rx="12" fill="#0b84fe" />
      <path d="M7 12.5C7 10.0147 9.01472 8 11.5 8H17V12.5C17 14.9853 14.9853 17 12.5 17H7V12.5Z" fill="white" />
      <path d="M6 9.5C6 8.11929 7.11929 7 8.5 7H11V9.5C11 10.8807 9.88071 12 8.5 12H6V9.5Z" fill="white" />
    </svg>
  )
}
