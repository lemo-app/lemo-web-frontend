"use client"

import { useState } from "react"
import { Search, Filter, ChevronDown, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { students } from "@/lib/data"
import { Pagination } from "../common/pagination"
import { AddStudentModal } from "./add-student-modal"

export function StudentDashboard() {
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const toggleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(students.map((student) => student.id))
    }
  }

  const toggleSelectStudent = (id: string) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter((studentId) => studentId !== id))
    } else {
      setSelectedStudents([...selectedStudents, id])
    }
  }

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Manage Students</h1>

      <Tabs defaultValue="students" className="mb-6">
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
          <TabsTrigger
            value="incidents"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-4 py-2 h-auto bg-transparent"
          >
            Incidents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search students..." className="pl-10 w-full" />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
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
                      checked={selectedStudents.length === students.length && students.length > 0}
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
                {students.slice((currentPage - 1) * 10, currentPage * 10).map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={() => toggleSelectStudent(student.id)}
                      />
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.avatar} alt={student.name} />
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
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H3.5C3.22386 4 3 3.77614 3 3.5ZM3 7C3 6.44772 3.44772 6 4 6H11C11.5523 6 12 6.44772 12 7V11C12 11.5523 11.5523 12 11 12H4C3.44772 12 3 11.5523 3 11V7ZM4 7H11V11H4V7Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(students.length / 10)}
            onPageChange={setCurrentPage}
            totalItems={students.length}
          />
        </TabsContent>

        <TabsContent value="attendance">
          <div className="flex items-center justify-center h-64 border rounded-md">
            <p className="text-muted-foreground">Attendance content will be added later</p>
          </div>
        </TabsContent>

        <TabsContent value="incidents">
          <div className="flex items-center justify-center h-64 border rounded-md">
            <p className="text-muted-foreground">Incidents content will be added later</p>
          </div>
        </TabsContent>
      </Tabs>

      <AddStudentModal isOpen={isAddStudentModalOpen} onClose={() => setIsAddStudentModalOpen(false)} />
    </div>
  )
}

