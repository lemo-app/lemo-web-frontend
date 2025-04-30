"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  Users,
  Network,
  LayoutDashboard,
  Settings,
  BriefcaseBusiness,
  GraduationCap,
  School,
  ChevronRight,
  LogOut,
  AlertCircleIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
// import logo from "@/assets/images/dashboard/common/logo.svg"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUserStore } from "@/utils/store/user-store"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Create a sidebar state for global use
import { create } from 'zustand'

interface SidebarState {
  isCollapsed: boolean
  toggleCollapse: () => void
  setCollapsed: (collapsed: boolean) => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
}))

export default function Sidebar() {
  const [isMounted, setIsMounted] = useState(false)
  const { isCollapsed, toggleCollapse } = useSidebarStore()
  const pathname = usePathname()
  const { user } = useUserStore()
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const isActive = (path: string) => isMounted && pathname === path
  const canAccess = (types: string[]) => types.includes(user.type)
  
  // Group navigation items for better organization
  const navigationGroups = [
    {
      title: "Main",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: <LayoutDashboard className="h-5 w-5" />,
          access: ["super_admin", "admin", "school_manager", "teacher", "student"],
        },
        {
          name: "Manage Students",
          href: "/dashboard/students",
          icon: <GraduationCap className="h-5 w-5" />,
          access: ["super_admin", "admin", "school_manager", "teacher"],
        },
      ],
    },
    {
      title: "Administration",
      items: [
        {
          name: "Manage Networks",
          href: "/dashboard/networks",
          icon: <Network className="h-5 w-5" />,
          access: ["school_manager", "admin"],
        },
        {
          name: "School Settings",
          href: "/dashboard/settings",
          icon: <Settings className="h-5 w-5" />,
          access: ["admin"],
        },
        {
          name: "Manage Schools",
          href: "/dashboard/schools",
          icon: <School className="h-5 w-5" />,
          access: ["super_admin"],
        },
        {
          name: "Manage Platform Staff",
          href: "/dashboard/staff",
          icon: <BriefcaseBusiness className="h-5 w-5" />,
          access: ["super_admin", "admin", "school_manager"],
        },
        {
          name: "Manage Admins",
          href: "/dashboard/admins",
          icon: <Users className="h-5 w-5" />,
          access: ["super_admin"],
        },
        {
          name: "Network Requests",
          href: "/dashboard/network-requests",
          icon: <Network className="h-5 w-5" />,
          access: ["super_admin"],
        },
      ],
    },
  ]


  const handleLogout = () => {
    // Clear cookies using js-cookie
    const cookies = document.cookie.split(";");
    // Loop through all cookies and remove them
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
    
    // Clear user store state
    useUserStore.getState().clearUser();
    
    // Redirect to login page
    router.push('/login');
  };

  return (
    <>
      {/* Dark overlay for mobile when sidebar is open */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleCollapse}
        />
      )}
      <div
        className={`fixed top-0 left-0 z-50 h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white border-r border-r-sky-100 transition-all duration-300 ease-in-out ${
          isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-64 lg:w-64'
        }`}
      >
        {/* Header with logo and collapse button */}
        <div className="flex h-16 items-center px-4 border-b border-sky-100">
          <div className="flex items-center gap-2 w-full">
            {!isCollapsed && (
              <Image
                src={"https://lemobucket.s3.eu-west-2.amazonaws.com/6.png"}
                width={100}
                height={20}
                alt="logo"
                className="transition-opacity duration-300"
              />
            )}
            {isCollapsed && (
              <div className="mx-auto">
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold">
                  <Image
                    src={"https://lemobucket.s3.eu-west-2.amazonaws.com/lemtrans.png"}
                    width={100}
                    height={20}
                    alt="logo"
                    className="transition-opacity duration-300"
                  />
                </div>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="text-sky-600 hover:text-sky-800 hover:bg-sky-100"
          >
            <ChevronRight
              className={`h-5 w-5 transition-transform duration-300 ${isCollapsed ? "rotate-0" : "rotate-180"}`}
            />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 py-4 px-3 overflow-y-auto scrollbar-thin scrollbar-thumb-sky-200 scrollbar-track-transparent">
          {navigationGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
              {!isCollapsed && <h3 className="text-xs uppercase font-semibold text-sky-800 px-3 mb-2">{group.title}</h3>}
              {isCollapsed && <div className="h-px bg-sky-100 my-4 mx-auto w-8" />}
              <div className="space-y-1">
                {group.items.map(
                  (item, itemIndex) =>
                    canAccess(item.access) && (
                      <TooltipProvider key={itemIndex} delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              className={`w-full justify-start gap-3 font-medium relative rounded-lg transition-all duration-200 
                              ${isCollapsed ? "px-3 py-3 justify-center" : "pl-3 pr-2 py-2"}
                              ${
                                isActive(item.href)
                                  ? "bg-gradient-to-r from-sky-100 to-sky-50 text-sky-700 shadow-sm"
                                  : "text-gray-600 hover:bg-sky-50 hover:text-sky-700"
                              }
                              ${isActive(item.href) && !isCollapsed ? "border-l-4 border-l-sky-500 pl-2" : ""}
                            `}
                              asChild
                            >
                              <Link href={item.href}>
                                <span className={`${isActive(item.href) ? "text-sky-600" : "text-gray-500"}`}>
                                  {item.icon}
                                </span>
                                {!isCollapsed && <span className="truncate">{item.name}</span>}
                                {isActive(item.href) && !isCollapsed && (
                                  <span className="absolute right-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-sky-500" />
                                )}
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isCollapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
                        </Tooltip>
                      </TooltipProvider>
                    ),
                )}
              </div>
            </div>
          ))}
        </nav>

        {/* User profile section at bottom */}
        <div className={`p-4 border-t border-sky-100 ${isCollapsed ? "text-center" : ""} cursor-pointer`} onClick={handleLogout}>
          <div className={`flex ${isCollapsed ? "flex-col items-center" : "items-center gap-3"}`}>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <AlertCircleIcon className="h-4 w-4" />
                <p className="text-sm font-medium text-gray-900 truncate">{ "Logout From LEMO"}</p>
              </div>
            )}

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-500 hover:bg-red-50">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Log out</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </>
  )
}

