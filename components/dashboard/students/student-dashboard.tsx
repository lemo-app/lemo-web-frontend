"use client"

import { useState } from "react"
import { Search, Filter, ChevronDown, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { students } from "@/lib/data"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Pagination } from "../common/pagination"
import { AttendanceTable } from "./attendance-table"
import { AddStudentModal } from "./add-student-modal"
import { WarningNoteModal } from "./warning-note-modal"
import avatarLogo from '@/assets/images/dashboard/common/avatar.png'; 

export function StudentDashboard() {
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false)
  const [isWarningNoteModalOpen, setIsWarningNoteModalOpen] = useState(false)
  const [selectedStudentForWarning, setSelectedStudentForWarning] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)

  const toggleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(filteredStudents.map((student) => student.id))
    }
  }

  const toggleSelectStudent = (id: string) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter((studentId) => studentId !== id))
    } else {
      setSelectedStudents([...selectedStudents, id])
    }
  }

  const openWarningNoteModal = (studentId: string, studentName: string) => {
    setSelectedStudentForWarning(studentName)
    setIsWarningNoteModalOpen(true)
  }

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.studentId.includes(searchQuery),
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Manage Students</h1>
        <p className="text-muted-foreground">Manage student related all actions here</p>
      </div>

      <Tabs defaultValue="students" className="bg-white py-4 rounded-md">
        <TabsList className="mb-4 border-b w-full justify-start rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="students"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-4 py-2 h-auto bg-transparent"
          >
            Students
          </TabsTrigger>
          <TabsTrigger
            value="attendance"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-4 py-2 h-auto bg-transparent"
          >
            Attendance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name/ID..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    Grade/Section
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>All Grades</DropdownMenuItem>
                  <DropdownMenuItem>10/A</DropdownMenuItem>
                  <DropdownMenuItem>9/B</DropdownMenuItem>
                  <DropdownMenuItem>8/C</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {date ? format(date, "PPP") : "Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>

              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>

              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Export
              </Button>

              <Button onClick={() => setIsAddStudentModalOpen(true)} className="flex items-center gap-2">
                <span>+</span> Add Students
              </Button>
            </div>
          </div>

          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Grade/Section</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Parents Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.slice((currentPage - 1) * 10, currentPage * 10).map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={() => toggleSelectStudent(student.id)}
                      />
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={avatarLogo.src} alt={student.name} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{student.name}</span>
                    </TableCell>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>{student.gradeSection}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.parentsContact}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {student.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z"
                                  fill="currentColor"
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Student</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openWarningNoteModal(student.id, student.name)}>
                              Send Warning Note
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete Student</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredStudents.length / 10)}
            onPageChange={setCurrentPage}
            totalItems={filteredStudents.length}
          />
        </TabsContent>

        <TabsContent value="attendance" className="mt-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search by student Name/ID..." className="pl-10 w-full" />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    Select by Date
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Today</DropdownMenuItem>
                  <DropdownMenuItem>Yesterday</DropdownMenuItem>
                  <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                  <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                  <DropdownMenuItem>Custom range</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    Status
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>All</DropdownMenuItem>
                  <DropdownMenuItem>Present</DropdownMenuItem>
                  <DropdownMenuItem>Absent</DropdownMenuItem>
                  <DropdownMenuItem>Tardy</DropdownMenuItem>
                  <DropdownMenuItem>Early Leave</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    Grade/Section
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>All Grades</DropdownMenuItem>
                  <DropdownMenuItem>10/A</DropdownMenuItem>
                  <DropdownMenuItem>9/B</DropdownMenuItem>
                  <DropdownMenuItem>8/C</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>

              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <AttendanceTable />
        </TabsContent>

      </Tabs>

      <AddStudentModal isOpen={isAddStudentModalOpen} onClose={() => setIsAddStudentModalOpen(false)} />

      <WarningNoteModal
        isOpen={isWarningNoteModalOpen}
        onClose={() => setIsWarningNoteModalOpen(false)}
        studentName={selectedStudentForWarning}
      />
    </div>
  )
}

