import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sweet Dreams Bakery - Handcrafted Baked Goods & Pre-Orders",
  description:
    "Handcrafted with love, baked fresh daily. Pre-order your favorite treats and make every moment sweeter! Custom cakes, cupcakes, cookies, and more.",
  keywords: "bakery, cakes, cupcakes, cookies, pre-order, custom cakes, fresh baked goods",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
