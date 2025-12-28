"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function SEOOptimization() {
  const pathname = usePathname()

  useEffect(() => {
    // Track page views for analytics (if you have analytics set up)
    if (typeof window !== "undefined") {
      // You can add your analytics tracking code here
      console.log("Page view:", pathname)
    }

    // Add structured data for breadcrumbs
    const breadcrumbScript = document.createElement("script")
    breadcrumbScript.type = "application/ld+json"

    // Create breadcrumb data based on current path
    const pathSegments = pathname.split("/").filter(Boolean)
    const breadcrumbItems = [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://raisa.im",
      },
    ]

    // Add additional breadcrumb items based on path
    pathSegments.forEach((segment, index) => {
      let name = segment
      if (segment === "bn") name = "Bengali"
      if (segment === "chat") name = "Chat"
      if (segment === "about") name = "About"

      breadcrumbItems.push({
        "@type": "ListItem",
        position: index + 2,
        name: name,
        item: `https://raisa.im/${pathSegments.slice(0, index + 1).join("/")}`,
      })
    })

    const breadcrumbData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems,
    }

    breadcrumbScript.textContent = JSON.stringify(breadcrumbData)
    document.head.appendChild(breadcrumbScript)

    return () => {
      document.head.removeChild(breadcrumbScript)
    }
  }, [pathname])

  return null
}
