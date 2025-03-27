"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"
import { Pagination } from "@/components/dashboard/common/pagination"
import { format } from "date-fns"

// Mock data for admin table
const admins = [
  // ... existing mock data ...
]

interface Admin {
  id: number
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export default function ManageAdmins() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  const totalItems = admins.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  // Get current page data
  const currentAdmins = admins.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Format date to readable string
  const formatDate = (date: Date) => {
    return format(date, "MMM d, yyyy 'at' h:mm a")
  }
  
  // Handle limit change
  const handleLimitChange = (limit: number) => {
    setItemsPerPage(limit)
    setCurrentPage(1) // Reset to first page when changing limit
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Management</h1>
        <Button>Invite Admin</Button>
      </div>

      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input placeholder="Search admins..." className="pl-10" />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentAdmins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{formatDate(admin.createdAt)}</TableCell>
                <TableCell>{formatDate(admin.updatedAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="outline" size="sm">Details</Button>
                    <Button variant="outline" size="sm">Edit</Button>
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
        itemsPerPage={itemsPerPage}
        onLimitChange={handleLimitChange}
      />
    </div>
  )
}

