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
import { Camera, Clock, Loader2, School as SchoolIcon, Shield, Upload } from "lucide-react"
import { toast } from "sonner"
import { School } from "@/utils/interface/school.types"
import { useQueryClient } from "@tanstack/react-query"

interface AddSchoolModalProps {
  isOpen: boolean
  onClose: () => void
  userType: string
}

export function AddSchoolModal({ isOpen, onClose, userType }: AddSchoolModalProps) {
  const queryClient = useQueryClient()
  const [schoolName, setSchoolName] = useState("")
  const [address, setAddress] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [description, setDescription] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [vpnConfigFile, setVpnConfigFile] = useState<File | null>(null)
  const [vpnConfigName, setVpnConfigName] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const logoFileInputRef = useRef<HTMLInputElement>(null)
  const vpnConfigFileInputRef = useRef<HTMLInputElement>(null)

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

  const handleVpnConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVpnConfigFile(file)
      setVpnConfigName(file.name)
    }
  }

  const triggerLogoFileInput = () => {
    logoFileInputRef.current?.click()
  }

  const triggerVpnConfigFileInput = () => {
    vpnConfigFileInputRef.current?.click()
  }

  const handleSubmit = async () => {
    if (!schoolName) return

    setIsSubmitting(true)

    let logoUrl
    let vpnConfigUrl

    try {
      // Upload logo if provided
      if (logoFile) {
        try {
          logoUrl = await uploadFile(logoFile)
        } catch (error) {
          toast.error("Failed to upload logo! Please try again later.")
          // console.error("Logo upload error:", error)
          setIsSubmitting(false)
          return
        }
      }

      // Upload VPN config if provided
      if (vpnConfigFile) {
        try {
          vpnConfigUrl = await uploadFile(vpnConfigFile)
        } catch (error) {
          toast.error("Failed to upload VPN configuration file! Please try again later.")
          // console.error("VPN config upload error:", error)
          setIsSubmitting(false)
          return
        }
      }

      // Using the School interface, omitting _id and createdAt which are handled by the backend
      const schoolData: Omit<School, '_id' | 'createdAt'> = {
        school_name: schoolName
      };

      if (address) schoolData.address = address;
      if (contactNumber) schoolData.contact_number = contactNumber;
      if (description) schoolData.description = description;
      
      // Convert time inputs to full ISO format before sending to the API
      if (startTime) schoolData.start_time = formatTimeToFullISO(startTime);
      if (endTime) schoolData.end_time = formatTimeToFullISO(endTime);
      
      if (logoUrl) schoolData.logo_url = logoUrl;
      if (vpnConfigUrl) schoolData.vpn_config_url = vpnConfigUrl;

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
        // console.error("QR code generation error:", qrError);
        toast.warning("School created successfully, but QR code generation failed");
      }

      // Invalidate the schools query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['schools'] });

      // Reset form
      setSchoolName("")
      setAddress("")
      setContactNumber("")
      setDescription("")
      setStartTime("")
      setEndTime("")
      setLogoPreview(undefined)
      setLogoFile(null)
      setVpnConfigFile(null)
      setVpnConfigName("")
      onClose()
    } catch (error) {
      toast.error("Failed to create school! Please try again later.")
      // console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
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
                onClick={triggerLogoFileInput}
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary/90 transition-colors"
              >
                <Camera className="h-5 w-5" />
              </button>
            </div>
            <input
              type="file"
              ref={logoFileInputRef}
              onChange={handleLogoChange}
              accept="image/*"
              className="hidden"  
            />
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
            <Label htmlFor="vpnConfig">VPN Configuration File
            <span className="text-xs text-muted-foreground ms-4">
             -  upload a VPN configuration file (.ovpn) for school network access.
            </span>

            </Label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="vpnConfig"
                  placeholder="Upload VPN configuration file..."
                  value={vpnConfigName}
                  readOnly
                  className="pl-10"
                />
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="flex gap-2"
                onClick={triggerVpnConfigFileInput}
              >
                <Upload className="h-4 w-4" />
                Browse
              </Button>
            </div>
            <input
              type="file"
              ref={vpnConfigFileInputRef}
              onChange={handleVpnConfigChange}
              accept=".ovpn,.conf,.config"
              className="hidden"  
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
          <Button onClick={handleSubmit} disabled={isSubmitting || !schoolName}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isSubmitting ? "Creating..." : "Confirm School"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

