import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider" // Import ThemeProvider
import { Toaster } from "@/components/ui/toaster" // Assuming Toaster is already here

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Smart Saathi",
  description: "Your ultimate movie companion.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8125604352764499"
          crossOrigin="anonymous"
        ></script>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
