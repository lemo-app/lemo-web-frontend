"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface WarningNoteModalProps {
  isOpen: boolean
  onClose: () => void
  studentName?: string
}

export function WarningNoteModal({ isOpen, onClose, studentName }: WarningNoteModalProps) {
  const [subject, setSubject] = useState("")
  const [note, setNote] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sending warning note
    console.log({ studentName, subject, note })
    onClose()
    setSubject("")
    setNote("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-6 overflow-hidden">
        <DialogHeader className="p-0 pb-4 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">Send Warning Note</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject
            </label>
            <Input
              id="subject"
              placeholder="Type Subject here..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="note" className="text-sm font-medium">
              Note
            </label>
            <Textarea
              id="note"
              placeholder="Type Note here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="h-[200px]"
              required
            />
          </div>

          <div className="flex justify-start gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="px-6">
              Cancel
            </Button>
            <Button type="submit" className="bg-gray-900 text-white hover:bg-gray-800 px-6">
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

