"use client"

import { useState } from "react"
import { MessageSquare } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { attendanceSummary } from "@/lib/data"
import { Pagination } from "../common/pagination"
import { WarningNoteModal } from "./warning-note-modal"
import avatarLogo from '@/assets/images/dashboard/common/avatar.png'; 

export function AttendanceTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isWarningNoteModalOpen, setIsWarningNoteModalOpen] = useState(false)
  const [selectedStudentForWarning, setSelectedStudentForWarning] = useState("")

  const openWarningNoteModal = (studentName: string) => {
    setSelectedStudentForWarning(studentName)
    setIsWarningNoteModalOpen(true)
  }

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Late Arrivals</TableHead>
              <TableHead>Early Leaves</TableHead>
              <TableHead>Total Incidents</TableHead>
              <TableHead>Last Incident</TableHead>
              <TableHead className="w-24">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceSummary.slice((currentPage - 1) * 10, currentPage * 10).map((student) => (
              <TableRow key={student.id}>
                <TableCell className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={avatarLogo.src} alt={student.name} />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div>{student.name}</div>
                    <div className="text-xs text-muted-foreground">{student.gradeSection}</div>
                  </div>
                </TableCell>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.lateArrivals}</TableCell>
                <TableCell>{student.earlyLeaves}</TableCell>
                <TableCell>{student.totalIncidents}</TableCell>
                <TableCell>{student.lastIncident}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openWarningNoteModal(student.name)}
                    >
                      <MessageSquare className="h-4 w-4" />
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
        totalPages={Math.ceil(attendanceSummary.length / 10)}
        onPageChange={setCurrentPage}
        totalItems={attendanceSummary.length}
      />

      <WarningNoteModal
        isOpen={isWarningNoteModalOpen}
        onClose={() => setIsWarningNoteModalOpen(false)}
        studentName={selectedStudentForWarning}
      />
    </>
  )
}

