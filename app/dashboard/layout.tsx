"use client"

import type { ReactNode } from "react"

import Sidebar from "@/components/dashboard/common/sidebar"
import Header from "@/components/dashboard/common/header"
import { useSidebarStore } from "@/components/dashboard/common/sidebar"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { isCollapsed } = useSidebarStore()

  return (
    <div className="flex min-h-screen bg-background">
      {/* Fixed Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}`}>
        {/* Header */}
        <Header />
        {/* Page Content */}
        <main className="bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  )
}

