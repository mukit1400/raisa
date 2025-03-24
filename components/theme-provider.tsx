"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      themes={["dark", "retro", "girlypop"]}
      defaultTheme="girlypop"
      forcedTheme={props.forcedTheme}
    >
      {children}
    </NextThemesProvider>
  )
}

