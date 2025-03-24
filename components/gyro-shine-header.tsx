"use client"

import { useEffect, useState, useRef } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { Sparkles } from "lucide-react"
import { LogoSVG } from "@/components/logo-svg"

interface GyroShineHeaderProps {
  className?: string
}

export function GyroShineHeader({ className }: GyroShineHeaderProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [isGyroAvailable, setIsGyroAvailable] = useState(false)
  const [isGyroActive, setIsGyroActive] = useState(false)
  const [needsPermission, setNeedsPermission] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  // Initialize gyroscope detection
  useEffect(() => {
    // Check if DeviceOrientationEvent is supported
    const isSupported = "DeviceOrientationEvent" in window
    setIsGyroAvailable(isSupported)

    // Check if permission is needed (iOS 13+)
    if (isSupported && typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      setNeedsPermission(true)
    }
  }, [])

  // Handle mouse movement for desktop fallback
  useEffect(() => {
    if (!headerRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!headerRef.current || isGyroActive) return

      const rect = headerRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100

      setPosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isGyroActive])

  // Request gyroscope permission and activate
  const activateGyro = async () => {
    try {
      if (needsPermission) {
        const permission = await (DeviceOrientationEvent as any).requestPermission()
        if (permission !== "granted") {
          console.log("Gyroscope permission denied")
          return
        }
      }

      // Set up the orientation event listener
      window.addEventListener("deviceorientation", handleOrientation)
      setIsGyroActive(true)

      // Clean up when component unmounts
      return () => {
        window.removeEventListener("deviceorientation", handleOrientation)
      }
    } catch (error) {
      console.error("Error activating gyroscope:", error)
    }
  }

  // Handle device orientation changes
  const handleOrientation = (event: DeviceOrientationEvent) => {
    // Beta is front-to-back tilt in degrees, where front is positive
    // Gamma is left-to-right tilt in degrees, where right is positive
    const beta = event.beta || 0 // Range: -180 to 180
    const gamma = event.gamma || 0 // Range: -90 to 90

    // Convert to percentage values for positioning the shine effect
    // Constrain beta to range of -90 to 90 for better UX
    const constrainedBeta = Math.max(-90, Math.min(90, beta))

    // Map to 0-100 range for CSS positioning
    // Make the effect more responsive by amplifying small movements
    const x = ((gamma + 90) / 180) * 100
    const y = ((constrainedBeta + 90) / 180) * 100

    setPosition({ x, y })
  }

  // Calculate gradient position and style
  const gradientPosition = `${position.x}% ${position.y}%`

  // Different gradient colors based on theme
  let primaryGradient, secondaryGradient, highlightGradient, blendMode

  if (theme === "dark") {
    // Dark mode - enhanced shine with purple/blue hues
    primaryGradient = "rgba(149, 76, 233, 0.4)"
    secondaryGradient = "rgba(76, 29, 149, 0.2)"
    highlightGradient = "rgba(255, 255, 255, 0.6)"
    blendMode = "screen"
  } else if (theme === "retro") {
    // Retro mode - green CRT-like glow
    primaryGradient = "rgba(0, 255, 0, 0.15)"
    secondaryGradient = "rgba(0, 255, 0, 0.1)"
    highlightGradient = "rgba(0, 255, 0, 0.2)"
    blendMode = "screen"
  } else if (theme === "girlypop") {
    // Girlypop mode - pink/purple pastel glow
    primaryGradient = "rgba(243, 104, 224, 0.25)"
    secondaryGradient = "rgba(255, 159, 243, 0.15)"
    highlightGradient = "rgba(255, 255, 255, 0.5)"
    blendMode = "soft-light"
  } else {
    // Fallback to dark mode
    primaryGradient = "rgba(124, 58, 237, 0.4)"
    secondaryGradient = "rgba(79, 70, 229, 0.2)"
    highlightGradient = "rgba(255, 255, 255, 0.6)"
    blendMode = "screen"
  }

  // Create a more dramatic multi-layered effect
  const gradientStyle = {
    background: `
      radial-gradient(circle at ${gradientPosition}, ${primaryGradient} 0%, transparent 70%),
      radial-gradient(circle at ${gradientPosition}, ${secondaryGradient} 0%, transparent 50%),
      radial-gradient(circle at ${gradientPosition}, ${highlightGradient} 0%, transparent 25%)
    `,
    mixBlendMode: blendMode as any,
  }

  return (
    <header
      ref={headerRef}
      className={cn(
        "relative h-16 px-6 flex items-center justify-between overflow-hidden",
        theme === "retro"
          ? "bg-black border-b border-green-500 retro-header"
          : theme === "girlypop"
            ? "bg-white/80 border-b border-pink-200 girlypop-header"
            : "glass-effect chat-header",
        className,
      )}
      onClick={isGyroAvailable && !isGyroActive ? activateGyro : undefined}
    >
      {/* Base shimmer effect */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          theme === "retro" ? "retro-scanlines" : theme === "girlypop" ? "shimmer-bg girlypop-sparkles" : "shimmer-bg",
        )}
      />

      {/* Shine effect overlay */}
      <div className="absolute inset-0 pointer-events-none shine-effect" style={gradientStyle} />

      {/* Holographic lines effect - not for retro mode */}
      {theme !== "retro" && <div className="absolute inset-0 holographic-lines pointer-events-none" />}

      {/* CRT flicker for retro mode */}
      {theme === "retro" && <div className="absolute inset-0 crt-flicker pointer-events-none" />}

      {/* Floating hearts for girlypop mode */}
      {theme === "girlypop" && (
        <>
          <div className="floating-heart absolute text-pink-300 text-2xl">❤</div>
          <div className="floating-heart absolute text-pink-400 text-xl">❤</div>
          <div className="floating-heart absolute text-purple-300 text-2xl">❤</div>
          <div className="floating-heart absolute text-pink-300 text-xl">❤</div>
        </>
      )}

      {/* Logo */}
      <h1
        className={cn(
          "text-xl relative z-10 flex items-center",
          theme === "retro"
            ? "font-mono text-green-500 retro-text"
            : theme === "girlypop"
              ? "font-poppins text-pink-600 girlypop-text"
              : "logo-text text-white",
        )}
      >
        <LogoSVG />

        {theme === "retro" ? (
          <>
            <span
              className="font-mono retro-text"
              style={{ fontFamily: "var(--font-press-start-2p)", color: "#00ff00" }}
            >
              CHAT://
            </span>
            <span style={{ color: "#00ff00" }}>RUDRO</span>
          </>
        ) : theme === "girlypop" ? (
          <>
            <span className="font-poppins font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
              Raisa
            </span>
            <span className="text-pink-400 ml-1">✨</span>
          </>
        ) : (
          <>
            P<span className="logo-ai">[AI]</span>rtho
          </>
        )}

        {/* Gyroscope indicator - only shown when needed */}
        {isGyroAvailable && !isGyroActive && needsPermission && (
          <button
            onClick={activateGyro}
            className={cn(
              "ml-2 text-xs px-2 py-0.5 rounded-full flex items-center",
              theme === "retro"
                ? "bg-green-900/40 text-green-500 border border-green-500"
                : theme === "girlypop"
                  ? "bg-pink-100 text-pink-500 border border-pink-300"
                  : "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors",
            )}
          >
            <Sparkles className="h-3 w-3 mr-1" style={theme === "retro" ? { color: "#00ff00" } : {}} />
            <span>Enable effects</span>
          </button>
        )}
      </h1>

      {/* Theme toggle */}
      <div className="flex items-center gap-2 relative z-10">
        <ThemeToggle />
      </div>
    </header>
  )
}

