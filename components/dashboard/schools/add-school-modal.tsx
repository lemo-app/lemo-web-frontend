"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { 
  uploadFile, 
  createSchool, 
  generateSchoolQRCode,
  storeSchoolQRCode
} from "@/utils/client-api"
import Image from "next/image"
import { Camera, Clock, School as SchoolIcon } from "lucide-react"
import { toast } from "sonner"
import { School } from "@/utils/interface/school.types"

interface AddSchoolModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddSchoolModal({ isOpen, onClose }: AddSchoolModalProps) {
  const [schoolName, setSchoolName] = useState("")
  const [address, setAddress] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [description, setDescription] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Helper function to convert HTML time input to full ISO date-time string
  const formatTimeToFullISO = (timeString: string): string => {
    if (!timeString) return "";
    
    // Convert HTML time input (HH:MM) to full ISO format (YYYY-MM-DDThh:mm:ss.sssZ)
    // Use current date as the base
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(0);
    date.setMilliseconds(0);
    
    return date.toISOString();
  };

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
    if (!schoolName) return

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
      // Using the School interface, omitting id and createdAt which are handled by the backend
      const schoolData: Omit<School, 'id' | 'createdAt'> = {
        school_name: schoolName
      };

      if (address) schoolData.address = address;
      if (contactNumber) schoolData.contact_number = contactNumber;
      if (description) schoolData.description = description;
      
      // Convert time inputs to full ISO format before sending to the API
      if (startTime) schoolData.start_time = formatTimeToFullISO(startTime);
      if (endTime) schoolData.end_time = formatTimeToFullISO(endTime);
      
      if (logoUrl) schoolData.logo_url = logoUrl;

      // Step 1: Create the school
      const createdSchool = await createSchool(schoolData);
      
      if (!createdSchool || !createdSchool._id) {
        toast.error("School was created but we couldn't retrieve its ID");
        setIsSubmitting(false);
        onClose();
        return;
      }
      
      const schoolId = createdSchool._id;

      // Step 2: Generate QR code for every school, regardless of logo
      try {
        const qrResponse = await generateSchoolQRCode(schoolId);
        
        if (qrResponse && qrResponse.qr_code_url) {
          // Only update the school with QR code URL - don't modify the logo that was already set
          await storeSchoolQRCode(schoolId, qrResponse.qr_code_url);
          toast.success("School created successfully with QR code");
        } else {
          toast.success("School created successfully, but QR code generation didn't return a URL");
        }
      } catch (qrError) {
        console.error("QR code generation error:", qrError);
        toast.warning("School created successfully, but QR code generation failed");
      }

      // Reset form
      setSchoolName("")
      setAddress("")
      setContactNumber("")
      setDescription("")
      setStartTime("")
      setEndTime("")
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
                  <SchoolIcon className="h-16 w-16 text-gray-400" />
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
            <div className="text-xs text-muted-foreground text-center mt-1">
              A QR code will be automatically generated for every school. If no logo is provided, the QR code will be used as the school logo.
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="schoolName" className="flex items-center gap-1">
              School Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="schoolName"
              placeholder="Type Name here..."
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address (Optional)</Label>
            <Input
              id="address"
              placeholder="Type address here..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactNumber">Contact Number (Optional)</Label>
            <Input
              id="contactNumber"
              placeholder="Type contact number here..."
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">School Start Time (Optional)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="startTime"
                  type="time"
                  placeholder="e.g., 09:00"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">School End Time (Optional)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="endTime"
                  type="time"
                  placeholder="e.g., 15:00"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
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
          <Button onClick={handleSubmit} disabled={isSubmitting || !schoolName}>
            {isSubmitting ? "Creating..." : "Confirm School"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

