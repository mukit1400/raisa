import { NextResponse } from "next/server"
import generateServiceWorker from "../service-worker"

export function GET() {
  const serviceWorkerContent = generateServiceWorker()
  return new NextResponse(serviceWorkerContent, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  })
}
