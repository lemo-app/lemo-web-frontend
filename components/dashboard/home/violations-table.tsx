import { ArrowDown, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
            {violations.map((violation) => (
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

      <CardFooter className="flex items-center justify-between mt-0 text-sm">
          <div className="text-muted-foreground">Showing 1-5 from 15</div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span className="sr-only">Previous page</span>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 bg-primary text-primary-foreground">
              1
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              2
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              3
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
              <span className="sr-only">Next page</span>
            </Button>
          </div>
      </CardFooter>
    </Card>
  )
}

