"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddStudentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddStudentModal({ isOpen, onClose }: AddStudentModalProps) {
  const [showStep1, setShowStep1] = useState(true)
  const [showStep2, setShowStep2] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    email: "",
    phone: "",
    gender: "",
    gradeSection: "",
    primaryGuardianName: "",
    primaryGuardianContact: "",
    permanentAddress: "",
    currentAddress: "",
    emergencyContact: "",
    emergencyAddress: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    setShowStep1(false)
    setShowStep2(true)
  }

  const handleBack = () => {
    setShowStep1(true)
    setShowStep2(false)
  }

  const handleCancel = () => {
    resetAndClose()
  }

  const resetAndClose = () => {
    onClose()
    // Reset state after a short delay to prevent visual glitches
    setTimeout(() => {
      setShowStep1(true)
      setShowStep2(false)
      setFormData({
        name: "",
        studentId: "",
        email: "",
        phone: "",
        gender: "",
        gradeSection: "",
        primaryGuardianName: "",
        primaryGuardianContact: "",
        permanentAddress: "",
        currentAddress: "",
        emergencyContact: "",
        emergencyAddress: "",
      })
    }, 300)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log(formData)
    resetAndClose()
  }

  // Only show the dialog if isOpen is true and either step1 or step2 is active
  const shouldShowDialog = isOpen && (showStep1 || showStep2)

  return (
    <>
      {shouldShowDialog && (
        <Dialog open={true} onOpenChange={resetAndClose}>
          <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
            <DialogHeader className="p-6 pb-2 flex flex-row items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                {showStep1 ? "Add Students" : "Add Students Information"}
              </DialogTitle>
            </DialogHeader>

            {showStep1 && (
              <div className="p-6 pt-2">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Type name here..."
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="studentId" className="text-sm font-medium">
                      Student ID
                    </label>
                    <Input
                      id="studentId"
                      name="studentId"
                      placeholder="Type ID here..."
                      value={formData.studentId}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Type email here..."
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="Type phone here..."
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="gender" className="text-sm font-medium">
                      Gender
                    </label>
                    <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a gender..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="gradeSection" className="text-sm font-medium">
                      Grade/Section
                    </label>
                    <Select
                      value={formData.gradeSection}
                      onValueChange={(value) => handleSelectChange("gradeSection", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a grade..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10/A">10/A</SelectItem>
                        <SelectItem value="9/B">9/B</SelectItem>
                        <SelectItem value="8/C">8/C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-between mt-4">
                    <Button type="button" variant="outline" onClick={handleCancel} className="px-6">
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="bg-gray-900 text-white hover:bg-gray-800 px-6"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {showStep2 && (
              <form onSubmit={handleSubmit} className="p-6 pt-2">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="primaryGuardianName" className="text-sm font-medium">
                      Primary Guardian Name (optional)
                    </label>
                    <Input
                      id="primaryGuardianName"
                      name="primaryGuardianName"
                      placeholder="Type name here..."
                      value={formData.primaryGuardianName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="primaryGuardianContact" className="text-sm font-medium">
                      Primary Guardian Contact Number (optional)
                    </label>
                    <Input
                      id="primaryGuardianContact"
                      name="primaryGuardianContact"
                      placeholder="Type number here..."
                      value={formData.primaryGuardianContact}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="permanentAddress" className="text-sm font-medium">
                      Permanent Address (optional)
                    </label>
                    <Input
                      id="permanentAddress"
                      name="permanentAddress"
                      placeholder="Type address here..."
                      value={formData.permanentAddress}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="currentAddress" className="text-sm font-medium">
                      Current Address (optional)
                    </label>
                    <Input
                      id="currentAddress"
                      name="currentAddress"
                      placeholder="Type address here..."
                      value={formData.currentAddress}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="emergencyContact" className="text-sm font-medium">
                      Emergency Contact Number (optional)
                    </label>
                    <Input
                      id="emergencyContact"
                      name="emergencyContact"
                      placeholder="Type emergency contact here..."
                      value={formData.emergencyContact}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="emergencyAddress" className="text-sm font-medium">
                      Emergency Address (optional)
                    </label>
                    <Input
                      id="emergencyAddress"
                      name="emergencyAddress"
                      placeholder="Type address here..."
                      value={formData.emergencyAddress}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex justify-between mt-4">
                    <Button type="button" variant="outline" onClick={handleBack} className="px-6">
                      Back
                    </Button>
                    <Button type="submit" className="bg-gray-900 text-white hover:bg-gray-800 px-6">
                      Submit
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

