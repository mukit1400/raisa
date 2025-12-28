"use client"

import { VercelAnalytics } from "./vercel-analytics"
import { VercelSpeedInsights } from "./vercel-speed-insights"

export function ClientVercelWrapper() {
  return (
    <>
      <VercelAnalytics />
      <VercelSpeedInsights />
    </>
  )
}
