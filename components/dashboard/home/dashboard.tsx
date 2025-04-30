"use client";

import { Calendar, MoreVertical, PersonStanding } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceChart } from "@/components/dashboard/home/attendance-chart";
import { StatCard } from "@/components/dashboard/home/stat-card";
import { ViolationsTable } from "@/components/dashboard/home/violations-table";
import {
  fetchCurrentUser,
  fetchDashboardCardMetrics,
  fetchDashboardTrends,
} from "@/utils/client-api";
import { User } from "@/utils/interface/user.types";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState("all");
  const [year, setYear] = useState(new Date().getFullYear());
  // Dynamically generate years from 2025 to 2030, only 2025 enabled
  const availableYears = Array.from({ length: 6 }, (_, i) => 2025 + i);
  const isYearEnabled = (y: number) => y === 2025;

  // Map tab value to API range
  const rangeMap: Record<string, string> = {
    all: "All Date",
    "12m": "12 Months",
    "30d": "30 Days",
    "7d": "7 Days",
    "24h": "24 Hours",
  };

  // Fetch current user
  const { data: userData, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 15,
  });

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
    enabled:
      !!userData?.type &&
      (userData?.type === "super_admin" || !!userData?.school?._id),
  });

  // Fetch dashboard trends
  const {
    data: trendsData,
    isLoading: isLoadingTrends,
    refetch: refetchTrends,
  } = useQuery({
    queryKey: ["dashboardTrends", userData?.type, year, userData?.school?._id],
    queryFn: () =>
      fetchDashboardTrends({
        userType: userData?.type || "",
        year,
        schoolId: userData?.school?._id,
      }),
    enabled:
      !!userData?.type &&
      (userData?.type === "super_admin" || !!userData?.school?._id),
  });

  // Refetch metrics when filter changes
  useEffect(() => {
    if (userData?.type) {
      refetchMetrics();
    }
  }, [timeFilter, userData?.type, userData?.school?._id]);

  // Refetch trends when year or user changes
  useEffect(() => {
    if (userData?.type) {
      refetchTrends();
    }
  }, [year, userData?.type, userData?.school?._id]);

  // Transform API data for chart
  const chartData = (trendsData || []).map((item) => ({
    name: item.month.slice(0, 3),
    regular: item.attendance,
    lateEarly: item.absent,
  }));

  return (
    <main>
      {/* Welcome */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl ">
            Welcome Back{" "}
            <span className="font-semibold">{userData?.full_name}</span>
          </h1>
          <p className="text-muted-foreground">
            Find all analytics of your necessary role here
            {userData?.school?.school_name ? (
              <span className=" font-semibold">
                about {userData?.school?.school_name}
              </span>
            ) : (
              ""
            )}
          </p>
        </div>
        {/* Filter tabs */}
        <Tabs
          defaultValue="all"
          className="w-auto"
          value={timeFilter}
          onValueChange={setTimeFilter}
        >
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
        <StatCard
          title="Total Students"
          value={
            isLoadingMetrics
              ? "..."
              : cardMetrics?.total_students?.toLocaleString() ?? "..."
          }
          icon="users"
          color="amber"
        />
        <StatCard
          title="Late/Early Leaves"
          value={
            isLoadingMetrics
              ? "..."
              : cardMetrics?.late_early_leave?.toLocaleString() ?? "..."
          }
          icon="clock"
          color="blue"
        />
        <StatCard
          title="Blocked Sites"
          value={
            isLoadingMetrics
              ? "..."
              : cardMetrics?.blocked_sites?.toLocaleString() ?? "..."
          }
          icon="shield"
          color="teal"
        />
        <StatCard
          title="Pending Requests"
          value={
            isLoadingMetrics
              ? "..."
              : cardMetrics?.pending_requests?.toLocaleString() ?? "..."
          }
          icon="alert-circle"
          color="rose"
        />
      </div>

      {/* Trends Charts */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-0">
            <CardTitle>Trends</CardTitle>
            <CardDescription>
              Spikes in Attendance and Absence by Month
            </CardDescription>
          </div>
          <div className="flex items-center">
            <Select
              value={String(year)}
              onValueChange={(val) => setYear(Number(val))}
              disabled={isLoadingTrends}
            >
              <SelectTrigger className="border rounded px-2 py-1 text-sm ml-4 w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((y) => (
                  <SelectItem key={y} value={String(y)} disabled={!isYearEnabled(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* attendance */}
              <Card className="flex items-center gap-2 p-4 rounded-md shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400">
                  <Calendar className="text-white p-[1px]" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">Attendance</p>
                  <p className="text-2xl font-bold">
                    {isLoadingTrends
                      ? "..."
                      : trendsData?.reduce(
                          (sum, m) => sum + m.attendance,
                          0
                        ) ?? "0"}
                  </p>
                </div>
              </Card>
              {/* absence */}
              <Card className="flex items-center gap-2 p-4 rounded-md shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500">
                  <PersonStanding className="text-white p-[1px]" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">Absence</p>
                  <p className="text-2xl font-bold">
                    {isLoadingTrends
                      ? "..."
                      : trendsData?.reduce((sum, m) => sum + m.absent, 0) ??
                        "0"}
                  </p>
                </div>
              </Card>
            </div>
          </div>
          <div className="px-2 pb-6">
            <AttendanceChart
              data={chartData}
              year={year}
              onYearChange={setYear}
              availableYears={availableYears}
              loading={isLoadingTrends}
            />
          </div>
        </CardContent>
      </Card>
      {/* Violation */}
      <ViolationsTable />
    </main>
  );
}
