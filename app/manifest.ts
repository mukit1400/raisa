import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bengali Chat App",
    short_name: "BengaliChat",
    description: "Chat with your Bengali AI friends Raisa, Rudro, and Partho",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7c3aed",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  }
}
