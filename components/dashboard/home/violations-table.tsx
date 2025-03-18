import { useState } from "react"
import { ArrowDown, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "../common/pagination"

const violations = [
  {
    rank: 1,
    student: "John Doe",
    id: "1234",
    earlyLeaves: 20,
    lateArrivals: 5,
    lastIncident: "22nd Nov",
  },
  {
    rank: 2,
    student: "John Doe",
    id: "1234",
    earlyLeaves: 20,
    lateArrivals: 5,
    lastIncident: "22nd Nov",
  },
  {
    rank: 3,
    student: "John Doe",
    id: "1234",
    earlyLeaves: 20,
    lateArrivals: 5,
    lastIncident: "22nd Nov",
  },
  {
    rank: 4,
    student: "John Doe",
    id: "1234",
    earlyLeaves: 20,
    lateArrivals: 5,
    lastIncident: "22nd Nov",
  },
  {
    rank: 5,
    student: "John Doe",
    id: "1234",
    earlyLeaves: 20,
    lateArrivals: 5,
    lastIncident: "22nd Nov",
  },
]

export function ViolationsTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(violations.length / itemsPerPage)

  return (
    <Card className="shadow-none border-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Recurring violations</CardTitle>
        <Button variant="secondary" size="sm" className="gap-1">
          <Download className="h-4 w-4" />
          Download report
        </Button>
      </CardHeader>
      <CardContent className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead>Student</TableHead>
              <TableHead className="text-right">
                Early Leaves
                <ArrowDown className="ml-1 inline-block h-4 w-4" />
              </TableHead>
              <TableHead className="text-right">
                Late Arrivals
                <ArrowDown className="ml-1 inline-block h-4 w-4" />
              </TableHead>
              <TableHead className="text-right">
                Last Incident
                <ArrowDown className="ml-1 inline-block h-4 w-4" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {violations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((violation) => (
              <TableRow key={violation.rank}>
                <TableCell className="font-medium">{violation.rank}</TableCell>
                <TableCell>
                  <div>
                    <div>{violation.student}</div>
                    <div className="text-sm text-muted-foreground">ID: {violation.id}</div>
                  </div>
                </TableCell>
                <TableCell className="text-right">{violation.earlyLeaves}</TableCell>
                <TableCell className="text-right">{violation.lateArrivals}</TableCell>
                <TableCell className="text-right">{violation.lastIncident}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <div className="px-6">
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={violations.length}
          />
      </div>
      
     
    </Card>
  )
}

