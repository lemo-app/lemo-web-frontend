"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { School } from "@/utils/interface/school.types";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { 
  Camera, 
  Clock, 
  Upload, 
  Save, 
  X, 
  MapPin, 
  Phone, 
  School as SchoolIcon, 
  Shield,
  Loader2
} from "lucide-react";
import { uploadFile, updateSchool } from "@/utils/client-api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface EditSchoolModalProps {
  school: School | null;
  isOpen: boolean;
  onClose: () => void;
}

const EditSchoolModal = ({
  school,
  isOpen,
  onClose,
}: EditSchoolModalProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<School>>({});
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [vpnConfigFile, setVpnConfigFile] = useState<File | null>(null);
  const [vpnConfigName, setVpnConfigName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const vpnConfigFileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form data when the school prop changes
  useEffect(() => {
    if (school) {
      setFormData({ ...school });
      setLogoPreview(school.logo_url);
      setVpnConfigName(school.vpn_config_url ? "VPN configuration file" : "");
    }
  }, [school]);

  if (!formData) return null;

  // Helper function to convert HTML time input to full ISO date-time string
  const formatTimeToFullISO = (timeString: string): string => {
    if (!timeString) return "";
    
    // Convert HTML time input (HH:MM) to full ISO format
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(0);
    date.setMilliseconds(0);
    
    return date.toISOString();
  };

  // Convert ISO time to HTML time input format (HH:MM)
  const formatISOToTimeInput = (isoString?: string): string => {
    if (!isoString) return "";
    
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) {
        return "";
      }
      
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${hours}:${minutes}`;
    } catch {
      return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVpnConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVpnConfigFile(file);
      setVpnConfigName(file.name);
    }
  };

  const triggerLogoFileInput = () => {
    logoFileInputRef.current?.click();
  };

  const triggerVpnConfigFileInput = () => {
    vpnConfigFileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!formData.school_name) {
      toast.error("School name is required");
      return;
    }

    if (!school || !school._id) {
      toast.error("School ID is missing");
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedSchoolData: Partial<Omit<School, '_id'>> = { ...formData };
      // Remove _id from the data to be sent to the API
      if ('_id' in updatedSchoolData) {
        const { _id, ...rest } = updatedSchoolData;
        Object.assign(updatedSchoolData, rest);
      }
      
      // Upload logo if a new one was selected
      if (logoFile) {
        try {
          const logoUrl = await uploadFile(logoFile);
          updatedSchoolData.logo_url = logoUrl;
        } catch (error) {
          toast.error("Failed to upload logo");
          // console.error("Logo upload error:", error);
        }
      }

      // Upload VPN config if a new one was selected
      if (vpnConfigFile) {
        try {
          const vpnConfigUrl = await uploadFile(vpnConfigFile);
          updatedSchoolData.vpn_config_url = vpnConfigUrl;
        } catch (error) {
          toast.error("Failed to upload VPN configuration file");
          // console.error("VPN config upload error:", error);
        }
      }

      // Convert time inputs to ISO format
      if (formData.start_time && typeof formData.start_time !== 'string') {
        updatedSchoolData.start_time = formatTimeToFullISO(formData.start_time as unknown as string);
      }
      
      if (formData.end_time && typeof formData.end_time !== 'string') {
        updatedSchoolData.end_time = formatTimeToFullISO(formData.end_time as unknown as string);
      }

      // Call the API to update the school
      await updateSchool(school._id, updatedSchoolData);
      
      // Invalidate the schools query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      
      toast.success('School updated successfully');
      onClose();
    } catch (error) {
      // console.error("Error updating school:", error);
      toast.error("Failed to update school");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            Edit School Information
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* School Logo */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative mb-4">
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt={formData.school_name || "School Logo"}
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

          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="school_name" className="flex items-center gap-1">
                School Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="school_name"
                name="school_name"
                value={formData.school_name || ""}
                onChange={handleChange}
                placeholder="School Name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="address"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  placeholder="Address"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_number">Contact Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="contact_number"
                  name="contact_number"
                  value={formData.contact_number || ""}
                  onChange={handleChange}
                  placeholder="Contact Number"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time">School Start Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="start_time"
                    name="start_time"
                    type="time"
                    value={typeof formData.start_time === 'string' ? formatISOToTimeInput(formData.start_time) : formData.start_time || ""}
                    onChange={handleChange}
                    placeholder="e.g., 09:00"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_time">School End Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="end_time"
                    name="end_time"
                    type="time"
                    value={typeof formData.end_time === 'string' ? formatISOToTimeInput(formData.end_time) : formData.end_time || ""}
                    onChange={handleChange}
                    placeholder="e.g., 15:00"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vpnConfig">VPN Configuration File
                <span className="text-xs text-muted-foreground ms-4">
                  - upload a VPN configuration file (.ovpn) for school network access.
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                placeholder="Description"
                className="min-h-[120px]"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose} className="gap-2">
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !formData.school_name}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditSchoolModal;
