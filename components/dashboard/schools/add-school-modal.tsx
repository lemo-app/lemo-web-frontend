"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface AddSchoolModalProps {
  isOpen: boolean
  onClose: () => void
  onAddSchool: (school: { name: string; email: string; note?: string }) => void
}

export function AddSchoolModal({ isOpen, onClose, onAddSchool }: AddSchoolModalProps) {
  const [schoolName, setSchoolName] = useState("")
  const [schoolEmail, setSchoolEmail] = useState("")
  const [invitationNote, setInvitationNote] = useState("")

  const handleSubmit = () => {
    if (!schoolName || !schoolEmail) return

    onAddSchool({
      name: schoolName,
      email: schoolEmail,
      note: invitationNote || undefined,
    })

    // Reset form
    setSchoolName("")
    setSchoolEmail("")
    setInvitationNote("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">Add a school to platform</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="schoolName">School Name</Label>
            <Input
              id="schoolName"
              placeholder="Type Name here..."
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="schoolEmail">School Email</Label>
            <Input
              id="schoolEmail"
              type="email"
              placeholder="Type email here..."
              value={schoolEmail}
              onChange={(e) => setSchoolEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invitationNote">Invitation Note (Optional)</Label>
            <Textarea
              id="invitationNote"
              placeholder="Type note here..."
              className="min-h-[120px]"
              value={invitationNote}
              onChange={(e) => setInvitationNote(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!schoolName || !schoolEmail}>
            Send Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

