"use client"

import { useState, useEffect } from "react"

interface GyroData {
  beta: number // x-axis rotation (-180 to 180)
  gamma: number // y-axis rotation (-90 to 90)
  alpha: number // z-axis rotation (0 to 360)
  isSupported: boolean
}

export function useGyro(): GyroData {
  const [gyroData, setGyroData] = useState<GyroData>({
    beta: 0,
    gamma: 0,
    alpha: 0,
    isSupported: false,
  })

  useEffect(() => {
    // Check if DeviceOrientationEvent is supported
    const isGyroSupported = window.DeviceOrientationEvent !== undefined

    if (!isGyroSupported) {
      console.log("Gyroscope not supported on this device")
      return
    }

    setGyroData((prev) => ({ ...prev, isSupported: true }))

    // Handler for device orientation changes
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // Some browsers use different properties or need prefixing
      const alpha = event.alpha || 0
      const beta = event.beta || 0
      const gamma = event.gamma || 0

      setGyroData({
        alpha,
        beta,
        gamma,
        isSupported: true,
      })
    }

    // Try to request permission on iOS 13+
    const requestPermission = async () => {
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        try {
          const permissionState = await DeviceOrientationEvent.requestPermission()
          if (permissionState === "granted") {
            window.addEventListener("deviceorientation", handleOrientation, true)
          } else {
            console.log("Gyroscope permission denied")
          }
        } catch (error) {
          console.error("Error requesting gyroscope permission:", error)
        }
      } else {
        // For non-iOS devices or older iOS versions
        window.addEventListener("deviceorientation", handleOrientation, true)
      }
    }

    // Request permission or add listener directly
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      // For iOS 13+ devices that require permission
      requestPermission()
    } else {
      // For other devices
      window.addEventListener("deviceorientation", handleOrientation, true)
    }

    // Cleanup
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true)
    }
  }, [])

  return gyroData
}

