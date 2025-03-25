"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { uploadFile, createSchool } from "@/utils/client-api"
import Image from "next/image"
import { Camera, User } from "lucide-react"
import { toast } from "sonner"

interface AddSchoolModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddSchoolModal({ isOpen, onClose }: AddSchoolModalProps) {
  const [schoolName, setSchoolName] = useState("")
  const [schoolEmail, setSchoolEmail] = useState("")
  const [address, setAddress] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [description, setDescription] = useState("")
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async () => {
    if (!schoolName || !schoolEmail || !address || !contactNumber) return

    setIsSubmitting(true)

    let logoUrl
    if (logoFile) {
      try {
        logoUrl = await uploadFile(logoFile)
      } catch (error) {
        toast.error("Failed to upload logo! Please try again later.")
        console.error(error)
        setIsSubmitting(false)
        return
      }
    }

    try {
      await createSchool({
        school_name: schoolName,
        address,
        contact_number: contactNumber,
        description: description || "First test school",
        logo_url: logoUrl,
      })

      toast.success("School created successfully")

      // Reset form
      setSchoolName("")
      setSchoolEmail("")
      setAddress("")
      setContactNumber("")
      setDescription("")
      setLogoPreview(undefined)
      setLogoFile(null)
      onClose()
    } catch (error) {
      toast.error("Failed to create school! Please try again later.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">Add a school to platform</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative mb-4">
              {logoPreview ? (
                <Image
                  src={logoPreview || "/placeholder.svg"}
                  alt="School Logo"
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-gray-100 shadow-sm"
                />
              ) : (
                <div className="w-[120px] h-[120px] rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-16 w-16 text-gray-400" />
                </div>
              )}
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary/90 transition-colors"
              >
                <Camera className="h-5 w-5" />
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoChange}
              accept="image/*"
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={triggerFileInput}
              className="text-sm"
            >
              Change School Logo
            </Button>
          </div>

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
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Type address here..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              placeholder="Type contact number here..."
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Type description here..."
              className="min-h-[120px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !schoolName || !schoolEmail || !address || !contactNumber}>
            {isSubmitting ? "Creating..." : "Confirm School"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

