import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import ReactQueryProvider from "@/components/providers/react-query-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LEMO - School Management Dashboard",
  description: "School management dashboard for administrators",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <Toaster />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  )
}

