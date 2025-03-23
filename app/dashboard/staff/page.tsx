"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, Edit, Filter, Lock, MessageSquare, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/dashboard/common/pagination"
import HeaderWithButtonsLinks from "@/components/dashboard/common/header-with-buttons-links"

// Define staff data type
interface Staff {
  id: number
  name: string
  email: string
  role: string
  status: "Active" | "Inactive" | "Pending"
}

export default function ManageStaff() {
  // Sample data
  const [staffMembers, setStaffMembers] = useState<Staff[]>(
    Array.from({ length: 24 }, (_, i) => ({
      id: i + 1,
      name: `Staff Member ${i + 1}`,
      email: "staff@example.com",
      role: i % 3 === 0 ? "Admin" : i % 3 === 1 ? "Teacher" : "Support",
      status: i % 4 === 0 ? "Inactive" : i % 5 === 0 ? "Pending" : "Active",
    })),
  )

  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 10
  const totalItems = staffMembers.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Get current page data
  const currentStaff = staffMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Status badge styling
  const getStatusBadge = (status: Staff["status"]) => {
    switch (status) {
      case "Active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Active
          </Badge>
        )
      case "Inactive":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-700">
            Inactive
          </Badge>
        )
      case "Pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            Pending
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with button */}
      <HeaderWithButtonsLinks title="Manage Platform Staff" modalTitle="Add Staff" />

      <div className="flex items-center justify-between">
        <div className="relative w-80 bg-white">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search by staff name..." className="pl-10" />
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Role
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All</DropdownMenuItem>
              <DropdownMenuItem>Admin</DropdownMenuItem>
              <DropdownMenuItem>Teacher</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Status
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All</DropdownMenuItem>
              <DropdownMenuItem>Active</DropdownMenuItem>
              <DropdownMenuItem>Inactive</DropdownMenuItem>
              <DropdownMenuItem>Pending</DropdownMenuItem>
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
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentStaff.map((staff) => (
              <TableRow key={staff.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    {staff.name}
                  </div>
                </TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>{staff.role}</TableCell>
                <TableCell>{getStatusBadge(staff.status)}</TableCell>
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

