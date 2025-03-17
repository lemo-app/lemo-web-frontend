
import type { ReactNode } from "react"

import Sidebar from "@/components/dashboard/common/sidebar"
import Header from "@/components/dashboard/common/header"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Fixed Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <Header />
        {/* Page Content */}
        <main className=" bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  )
}

