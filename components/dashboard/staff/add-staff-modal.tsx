"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddStaffModalProps {
  isOpen: boolean
  onClose: () => void
  onAddStaff?: (staff: { name: string; email: string; role: string }) => void
}

export function AddStaffModal({ isOpen, onClose, onAddStaff }: AddStaffModalProps) {
  const [staffName, setStaffName] = useState("")
  const [staffEmail, setStaffEmail] = useState("")
  const [staffRole, setStaffRole] = useState("")

  const handleSubmit = () => {
    if (!staffName || !staffEmail || !staffRole) return

    if (onAddStaff) {
      onAddStaff({
        name: staffName,
        email: staffEmail,
        role: staffRole,
      })
    }

    // Reset form
    setStaffName("")
    setStaffEmail("")
    setStaffRole("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">Add Staff Member</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="staffName">Full Name</Label>
            <Input
              id="staffName"
              placeholder="Enter full name"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="staffEmail">Email Address</Label>
            <Input
              id="staffEmail"
              type="email"
              placeholder="Enter email address"
              value={staffEmail}
              onChange={(e) => setStaffEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="staffRole">Role</Label>
            <Select value={staffRole} onValueChange={setStaffRole}>
              <SelectTrigger id="staffRole">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!staffName || !staffEmail || !staffRole}>
            Add Staff
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

