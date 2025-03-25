"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, Download, Edit, Filter, Lock, MessageSquare, Plus, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/dashboard/common/pagination"
import HeaderWithButtonsLinks from "@/components/dashboard/common/header-with-buttons-links"

// Define school data type
interface School {
  id: number
  name: string
  email: string
  status: "Signed Up" | "Subscribed" | "Invite Sent"
}

export default function ManageSchools() {
  // Sample data
  const [schools, setSchools] = useState<School[]>(
    Array.from({ length: 24 }, (_, i) => ({
      id: i + 1,
      name: "School Name",
      email: "schoolemail@domain.com",
      status: i % 4 === 0 ? "Subscribed" : i % 8 === 7 ? "Invite Sent" : "Signed Up",
    })),
  )

  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 10
  const totalItems = schools.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Get current page data
  const currentSchools = schools.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Status badge styling
  const getStatusBadge = (status: School["status"]) => {
    switch (status) {
      case "Signed Up":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-700">
            Signed Up
          </Badge>
        )
      case "Subscribed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Subscribed
          </Badge>
        )
      case "Invite Sent":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Invite Sent
          </Badge>
        )
    }
  }

 

  return (
    <div className="space-y-6">
      
      {/* Header with button */}
      <HeaderWithButtonsLinks 
        title={'Manage Schools'}
        modalTitle={'Add School'}
      />

      <div className="flex items-center justify-between">
        <div className="relative w-80 bg-white">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search by schools name..." className="pl-10" />
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Invitation Status
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All</DropdownMenuItem>
              <DropdownMenuItem>Signed Up</DropdownMenuItem>
              <DropdownMenuItem>Subscribed</DropdownMenuItem>
              <DropdownMenuItem>Invite Sent</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead>Correspondent Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSchools.map((school) => (
              <TableRow key={school.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="bg-red-100 text-red-600 p-2 rounded-full">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 22H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path
                          d="M17 22V6C17 4.11438 17 3.17157 16.4142 2.58579C15.8284 2 14.8856 2 13 2H11C9.11438 2 8.17157 2 7.58579 2.58579C7 3.17157 7 4.11438 7 6V22"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path d="M12 11V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M10 7H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    {school.name}
                  </div>
                </TableCell>
                <TableCell>{school.email}</TableCell>
                <TableCell>{getStatusBadge(school.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
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
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={totalItems}
      />

     
    </div>
  )
}

