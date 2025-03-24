"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, Edit, Lock, MessageSquare, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/dashboard/common/pagination"
import HeaderWithButtonsLinks from "@/components/dashboard/common/header-with-buttons-links"
import { format } from "date-fns"

// Define admin data type
interface Admin {
    id: number
    name: string
    email: string
    createdAt: Date
    updatedAt: Date
  }
  

export default function ManageAdmins() {
  // Sample data - only admins
  const [admins, setAdmins] = useState<Admin[]>(
    Array.from({ length: 15 }, (_, i) => {
      // Create random dates within the last year
      const createdAt = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
      const updatedAt = new Date(createdAt.getTime() + Math.random() * (Date.now() - createdAt.getTime()))

      return {
        id: i + 1,
        name: `Admin ${i + 1}`,
        email: `admin${i + 1}@example.com`,
        createdAt,
        updatedAt,
      }
    }),
  )

  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 10
  const totalItems = admins.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Get current page data
  const currentAdmins = admins.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
// Format date to readable string
const formatDate = (date: Date) => {
    return format(date, "MMM d, yyyy 'at' h:mm a")
  }
  
  return (
    <div className="space-y-6">
      {/* Header with button */}
      <HeaderWithButtonsLinks title="Manage Admins" modalTitle="Add Admin" />

      <div className="flex items-center justify-between">
        <div className="relative w-80 bg-white">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search by admin name..." className="pl-10" />
        </div>

      </div>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentAdmins.map((admin) => (
              <TableRow key={admin.id} className="hover:bg-gray-50">
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
                    {admin.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-gray-50 text-gray-700">
                    {admin.email}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-600">{formatDate(admin.createdAt)}</TableCell>
                <TableCell className="text-sm text-gray-600">{formatDate(admin.updatedAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MessageSquare className="h-4 w-4" />
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

