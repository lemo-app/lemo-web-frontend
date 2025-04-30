"use client"

import { MoreVertical } from "lucide-react"
import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AttendanceChart } from "@/components/dashboard/home/attendance-chart"
import { BlockedSitesChart } from "@/components/dashboard/home/blocked-sites-chart"
import { StatCard } from "@/components/dashboard/home/stat-card"
import { ViolationsTable } from "@/components/dashboard/home/violations-table"
import { SocialNetworkVisits } from "@/components/dashboard/home/social-network-visits"
import { fetchCurrentUser, fetchDashboardCardMetrics } from "@/utils/client-api"
import { User } from "@/utils/interface/user.types"

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState("all")

  // Map tab value to API range
  const rangeMap: Record<string, string> = {
    all: "All Date",
    "12m": "12 Months",
    "30d": "30 Days",
    "7d": "7 Days",
    "24h": "24 Hours",
  }

  // Fetch current user
  const { data: userData, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 15,
  })

  // Fetch dashboard card metrics
  const {
    data: cardMetrics,
    isLoading: isLoadingMetrics,
    refetch: refetchMetrics,
  } = useQuery({
    queryKey: [
      "dashboardCardMetrics",
      userData?.type,
      timeFilter,
      userData?.school?._id,
    ],
    queryFn: () =>
      fetchDashboardCardMetrics({
        userType: userData?.type || "",
        range: rangeMap[timeFilter] || "All Date",
        schoolId: userData?.school?._id,
      }),
    enabled: !!userData?.type && (userData?.type === "super_admin" || !!userData?.school?._id),
  })

  // Refetch metrics when filter changes
  useEffect(() => {
    if (userData?.type) {
      refetchMetrics()
    }
  }, [timeFilter, userData?.type, userData?.school?._id])

  return (
    <main>
      {/* Welcome */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl ">Welcome Back <span className="font-semibold">{userData?.full_name}</span> </h1>
          <p className="text-muted-foreground">Find all analytics of your necessary role here {userData?.school?.school_name ? <span className=" font-semibold"> about {userData?.school?.school_name}</span> : '' }</p>
        </div>
        <Tabs defaultValue="all" className="w-auto" value={timeFilter} onValueChange={setTimeFilter}>
          <TabsList className="grid grid-cols-5 w-auto">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              All Date
            </TabsTrigger>
            <TabsTrigger value="12m" className="text-xs sm:text-sm">
              12 Months
            </TabsTrigger>
            <TabsTrigger value="30d" className="text-xs sm:text-sm">
              30 Days
            </TabsTrigger>
            <TabsTrigger value="7d" className="text-xs sm:text-sm">
              7 Days
            </TabsTrigger>
            <TabsTrigger value="24h" className="text-xs sm:text-sm">
              24 Hours
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Total Students"
          value={isLoadingMetrics ? "..." : cardMetrics?.total_students?.toLocaleString() ?? "..."}
          icon="users"
          color="amber"
        />
        <StatCard
          title="Late/Early Leaves"
          value={isLoadingMetrics ? "..." : cardMetrics?.late_early_leave?.toLocaleString() ?? "..."}
          icon="clock"
          color="blue"
        />
        <StatCard
          title="Blocked Sites"
          value={isLoadingMetrics ? "..." : cardMetrics?.blocked_sites?.toLocaleString() ?? "..."}
          icon="shield"
          color="teal"
        />
        <StatCard
          title="Pending Requests"
          value={isLoadingMetrics ? "..." : cardMetrics?.pending_requests?.toLocaleString() ?? "..."}
          icon="alert-circle"
          color="rose"
        />
      </div>

      {/* Charts */}
      <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0">
              <CardTitle>Trends</CardTitle>
              <CardDescription>Spikes in Late/Early Leaves over Regular Site Blockages</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Download Report</DropdownMenuItem>
                <DropdownMenuItem>Share</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <path d="M8 2v4" />
                      <path d="M16 2v4" />
                      <path d="M3 10h18" />
                      <rect width="18" height="16" x="3" y="4" rx="2" />
                      <path d="M8 14h.01" />
                      <path d="M12 14h.01" />
                      <path d="M16 14h.01" />
                      <path d="M8 18h.01" />
                      <path d="M12 18h.01" />
                      <path d="M16 18h.01" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">Attendance</p>
                    <p className="text-2xl font-bold">1500</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <path d="M16 16v-4a4 4 0 0 0-8 0v4" />
                      <path d="M10 16H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-4" />
                      <path d="M8 24l4-6 4 6" />
                      <path d="m2 8 20 8" />
                      <path d="m22 8-20 8" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">Absence</p>
                    <p className="text-2xl font-bold">280</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-2">
              <AttendanceChart />
            </div>
          </CardContent>
      </Card>
      {/*  */}
      <ViolationsTable />
    </main>
  )
}

