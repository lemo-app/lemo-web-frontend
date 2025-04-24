"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Save, Loader2, AlertTriangle } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCurrentUser, updateSchool } from "@/utils/client-api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Helper function to convert ISO time to HTML time input format (HH:MM)
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

// Helper function to convert HTML time to ISO format
const formatTimeToISO = (timeString: string): string => {
  if (!timeString) return "";
  
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  date.setSeconds(0);
  date.setMilliseconds(0);
  
  return date.toISOString();
};

const SchoolDetails = () => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState({
    school_name: "",
    address: "",
    contact_number: "",
    description: "",
    start_time: "",
    end_time: "",
  });
  const [formData, setFormData] = useState({
    school_name: "",
    address: "",
    contact_number: "",
    description: "",
    start_time: "",
    end_time: "",
  });

  // Fetch current user to get school data
  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  // Update form data and initial data when user data is loaded
  useEffect(() => {
    if (userData?.school) {
      const newData = {
        school_name: userData.school.school_name || "",
        address: userData.school.address || "",
        contact_number: userData.school.contact_number || "",
        description: userData.school.description || "",
        start_time: formatISOToTimeInput(userData.school.start_time) || "",
        end_time: formatISOToTimeInput(userData.school.end_time) || "",
      };
      setFormData(newData);
      setInitialData(newData);
    }
  }, [userData]);

  // Check if form has any changes
  const hasChanges = useMemo(() => {
    return Object.keys(formData).some(key => {
      return formData[key as keyof typeof formData] !== initialData[key as keyof typeof initialData];
    });
  }, [formData, initialData]);

  // Check if time fields are missing
  const hasMissingTime = useMemo(() => {
    return !formData.start_time || !formData.end_time;
  }, [formData.start_time, formData.end_time]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSaveSettings = async () => {
    if (!userData?.school) {
      toast.error("No school associated with current user");
      return;
    }

    if (!hasChanges) {
      toast.info("No changes to save");
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert time values to ISO format before sending to the API
      const dataToSend = {
        ...formData,
        start_time: formData.start_time ? formatTimeToISO(formData.start_time) : undefined,
        end_time: formData.end_time ? formatTimeToISO(formData.end_time) : undefined,
      };

      await updateSchool(userData.school._id, dataToSend);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast.success("School settings updated successfully");
      setInitialData(formData); // Update initial data after successful save
    } catch (error) {
      console.error("Failed to update school settings:", error);
      toast.error("Failed to update school settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 flex justify-center items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">School Details</h2>
        <Button
          onClick={handleSaveSettings}
          disabled={isSubmitting || !formData.school_name || !hasChanges}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      {hasMissingTime && (
        <div className="flex items-center gap-2 p-3 text-red-600 bg-red-50 rounded-md">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-sm">Please set both start time and end time for your school hours.</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-muted-foreground">School Name</Label>
          <Input
            id="school_name"
            placeholder="Type School Name here..."
            value={formData.school_name}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground">School Address</Label>
          <Input
            id="address"
            placeholder="Type School Address here..."
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground">Contact Number</Label>
          <Input
            id="contact_number"
            placeholder="Type School Contact Number here..."
            value={formData.contact_number}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground">
            Additional Description (Optional)
          </Label>
          <Textarea
            id="description"
            placeholder="Type additional description here..."
            className="min-h-[120px]"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className={cn(
              "text-muted-foreground",
              !formData.start_time && "text-red-500"
            )}>
              Start Time {!formData.start_time && "*"}
            </Label>
            <Input
              id="start_time"
              type="time"
              value={formData.start_time}
              onChange={handleChange}
              className={cn(
                "w-full",
                !formData.start_time && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          <div className="space-y-2">
            <Label className={cn(
              "text-muted-foreground",
              !formData.end_time && "text-red-500"
            )}>
              End Time {!formData.end_time && "*"}
            </Label>
            <Input
              id="end_time"
              type="time"
              value={formData.end_time}
              onChange={handleChange}
              className={cn(
                "w-full",
                !formData.end_time && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolDetails;
