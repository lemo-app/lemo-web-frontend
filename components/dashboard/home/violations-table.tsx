import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { ArrowDown, Download, FileWarning } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchDashboardViolations, DashboardViolationItem } from "@/utils/client-api"
import { saveAs } from "file-saver"

export function ViolationsTable({
  userType,
  year,
  schoolId,
}: {
  userType: string
  year: number
  schoolId?: string
}) {
  const {
    data: violations = [],
    isLoading,
    refetch,
  } = useQuery<DashboardViolationItem[]>({
    queryKey: ["dashboardViolations", userType, year, schoolId],
    queryFn: () => fetchDashboardViolations({ userType, year, schoolId }),
    enabled: !!userType && (userType === "super_admin" || !!schoolId),
  })

  useEffect(() => {
    if (userType) refetch()
  }, [userType, year, schoolId])

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(violations.length / itemsPerPage)

  // Download handler
  const handleDownload = () => {
    if (!violations.length) return
    const csvRows = [
      ["Rank", "Student", "Early Leaves", "Late Arrivals", "Student ID"],
      ...violations.map((v) => [v.rank, v.student_name, v.early_leaves, v.tardy, v.student_id]),
    ]
    const csvContent = csvRows.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, `violations_report_${year}.csv`)
  }

  return (
    <Card className="shadow-none border-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Recurring violations</CardTitle>
        <Button
          variant="secondary"
          size="sm"
          className="gap-1"
          onClick={handleDownload}
          disabled={!violations.length}
        >
          <Download className="h-4 w-4" />
          Download report
        </Button>
      </CardHeader>
      <CardContent className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead className="text-right">Early Leaves</TableHead>
              <TableHead className="text-right">Late Arrivals</TableHead>
              <TableHead className="text-right">Student ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5}>Loading...</TableCell>
              </TableRow>
            ) : violations.length === 0 ? (
              <TableRow className="">
                <TableCell colSpan={5} className="text-nowrap text-gray-700 flex items-center w-full gap-2"> <FileWarning className="size-5" /> <span className=" text-lg">No data available</span></TableCell>
              </TableRow>
            ) : (
              violations
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((violation) => (
                  <TableRow key={violation.user_id}>
                    <TableCell className="font-medium">{violation.rank}</TableCell>
                    <TableCell>{violation.student_name}</TableCell>
                    <TableCell className="text-right">{violation.early_leaves}</TableCell>
                    <TableCell className="text-right">{violation.tardy}</TableCell>
                    <TableCell className="text-right">{violation.student_id}</TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      <div className="px-6">
        {/* Pagination can be added here if needed */}
      </div>
    </Card>
  )
}

