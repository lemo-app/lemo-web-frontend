"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
  User as UserIcon,
  Camera,
  Building,
  Briefcase,
  Save,
  X,
  Loader2
} from "lucide-react";
import { updateUserInfo, uploadFile } from "@/utils/client-api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface StaffMember {
  _id: string;
  full_name?: string;
  email: string;
  avatar_url?: string;
  type: string;
  job_title?: string;
  school?: string;
  school_name?: string;
  email_verified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EditStaffModalProps {
  staff: StaffMember | null;
  isOpen: boolean;
  onClose: () => void;
}

const EditStaffModal = ({ staff, isOpen, onClose }: EditStaffModalProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<StaffMember>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form data when the staff prop changes
  useEffect(() => {
    if (staff) {
      setFormData({ ...staff });
      setAvatarPreview(staff.avatar_url);
    }
  }, [staff]);

  if (!formData) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAvatarFileInput = () => {
    avatarFileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!staff || !staff._id) {
      toast.error("Staff ID is missing");
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedStaffData: Partial<{
        full_name?: string;
        job_title?: string;
        avatar_url?: string;
      }> = {
        full_name: formData.full_name,
        job_title: formData.job_title
      };

      // Upload avatar if a new one was selected
      if (avatarFile) {
        try {
          const avatarUrl = await uploadFile(avatarFile);
          updatedStaffData.avatar_url = avatarUrl;
        } catch (error) {
          toast.error("Failed to upload avatar");
          // console.error("Avatar upload error:", error);
        }
      }

      // Call API to update staff info
      await updateUserInfo(updatedStaffData, staff._id);
      
      // Invalidate the staff query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      
      toast.success('Staff updated successfully');
      onClose();
    } catch (error) {
      // console.error("Error updating staff:", error);
      toast.error("Failed to update staff information");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            Edit Staff Information
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Staff Avatar */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative mb-4">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt={formData.full_name || "Staff Avatar"}
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-gray-100 shadow-sm"
                />
              ) : (
                <div className="w-[120px] h-[120px] rounded-full bg-gray-100 flex items-center justify-center">
                  <UserIcon className="h-16 w-16 text-gray-400" />
                </div>
              )}
              <button
                type="button"
                onClick={triggerAvatarFileInput}
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary/90 transition-colors"
              >
                <Camera className="h-5 w-5" />
              </button>
            </div>
            <input
              type="file"
              ref={avatarFileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            {/* Display Email (non-editable) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={formData.email || ""}
                readOnly
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name || ""}
                onChange={handleChange}
                placeholder="Enter full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_title">Job Title</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="job_title"
                  name="job_title"
                  value={formData.job_title || ""}
                  onChange={handleChange}
                  placeholder="Enter job title"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Display School (non-editable) */}
            {formData.school_name && (
              <div className="space-y-2">
                <Label htmlFor="school">School</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="school"
                    value={formData.school_name || ""}
                    readOnly
                    disabled
                    className="pl-10 bg-gray-50"
                  />
                </div>
                <p className="text-xs text-muted-foreground">School assignment cannot be changed here</p>
              </div>
            )}

            {/* Display Type (non-editable) */}
            <div className="space-y-2">
              <Label htmlFor="type">Staff Type</Label>
              <Input
                id="type"
                value={formData.type === "admin" ? "Admin" : formData.type === "school_manager" ? "School Manager" : formData.type}
                readOnly
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-muted-foreground">Staff type cannot be changed</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose} className="gap-2">
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
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

export default EditStaffModal;
