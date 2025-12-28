import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">You're offline</h1>
      <p className="mb-6">Please check your internet connection and try again.</p>
      <Link href="/" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
        Try again
      </Link>
    </div>
  )
}
