// This is a Node.js script to generate all the required icon sizes
// You'll need to install sharp: npm install sharp
// Then run: node scripts/generate-icons.js

const fs = require("fs")
const path = require("path")
const sharp = require("sharp")

const SOURCE_SVG = path.join(__dirname, "../public/icons/icon-base.svg")
const OUTPUT_DIR = path.join(__dirname, "../public/icons")

// Make sure the output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

// Define the icon sizes we need
const ICON_SIZES = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192x192.png", size: 192 },
  { name: "icon-512x512.png", size: 512 },
]

// Generate each icon
async function generateIcons() {
  try {
    const svgBuffer = fs.readFileSync(SOURCE_SVG)

    for (const icon of ICON_SIZES) {
      await sharp(svgBuffer).resize(icon.size, icon.size).png().toFile(path.join(OUTPUT_DIR, icon.name))

      console.log(`Generated ${icon.name}`)
    }

    console.log("All icons generated successfully!")
  } catch (error) {
    console.error("Error generating icons:", error)
  }
}

generateIcons()
