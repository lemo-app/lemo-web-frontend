"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddStudentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddStudentModal({ isOpen, onClose }: AddStudentModalProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    gradeSection: "",
    email: "",
    parentEmail: "",
    parentPhone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log(formData)
    onClose()
    setStep(1)
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      studentId: "",
      gradeSection: "",
      email: "",
      parentEmail: "",
      parentPhone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            {step === 1 ? "Enter student's basic information" : "Enter student's contact details"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input id="studentId" name="studentId" value={formData.studentId} onChange={handleChange} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="gradeSection">Grade/Section</Label>
                <Select
                  value={formData.gradeSection}
                  onValueChange={(value) => handleSelectChange("gradeSection", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade/section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10/A">10/A</SelectItem>
                    <SelectItem value="9/B">9/B</SelectItem>
                    <SelectItem value="8/C">8/C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="parentEmail">Parent's Email</Label>
                <Input
                  id="parentEmail"
                  name="parentEmail"
                  type="email"
                  value={formData.parentEmail}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="parentPhone">Parent's Phone</Label>
                <Input
                  id="parentPhone"
                  name="parentPhone"
                  value={formData.parentPhone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {step === 1 ? (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <div className="flex gap-2 justify-end w-full">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button type="submit">Add Student</Button>
              </div>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

