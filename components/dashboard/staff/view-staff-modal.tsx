"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import Image from "next/image";
import { 
  User as UserIcon, 
  Building, 
  Mail, 
  Calendar,
  Briefcase,
  Clock,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, formatDistance } from "date-fns";
import { Badge } from "@/components/ui/badge";

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

interface ViewStaffModalProps {
  staff: StaffMember | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewStaffModal = ({ staff, isOpen, onClose }: ViewStaffModalProps) => {
  if (!staff) return null;

  // Helper function to format ISO date to readable date
  const formatDateFromISO = (isoString?: string | Date): string => {
    if (!isoString) return "Not specified";

    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return format(date, "MMMM d, yyyy h:mm a");
    } catch {
      return "Invalid date format";
    }
  };

  // Helper to get the time ago from a date
  const getTimeAgo = (isoString?: string | Date): string => {
    if (!isoString) return "";

    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) {
        return "";
      }
      return formatDistance(date, new Date(), { addSuffix: true });
    } catch {
      return "";
    }
  };

  // Get staff type display name
  const getStaffType = (type: string) => {
    switch (type) {
      case "admin":
        return "Admin";
      case "school_manager":
        return "School Manager";
      case "super_admin":
        return "Super Admin";
      default:
        return type;
    }
  };

  // Get verification status badge
  const getStatusBadge = (verified: boolean) => {
    return verified ? (
      <Badge variant="outline" className="bg-green-50 text-green-700">
        Verified
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
        Pending
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            Staff Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header with avatar and name */}
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="relative">
              <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {staff.avatar_url ? (
                  <Image
                    src={staff.avatar_url}
                    alt={staff.full_name || staff.email}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-gray-100">
                    <UserIcon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-y-3">
              <h2 className="text-2xl font-bold text-center sm:text-left">
                {staff.full_name || "No name provided"}
              </h2>

              <div className="flex items-center text-sm text-gray-500 justify-center sm:justify-start">
                <Mail className="h-4 w-4 mr-2" />
                <span>{staff.email}</span>
              </div>

              <div className="flex items-center text-sm text-gray-500 justify-center sm:justify-start">
                <Shield className="h-4 w-4 mr-2" />
                <span>{getStaffType(staff.type)}</span>
                <span className="ml-2">{getStatusBadge(staff.email_verified)}</span>
              </div>

              {staff.job_title && (
                <div className="flex items-center text-sm text-gray-500 justify-center sm:justify-start">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span className="capitalize">{staff.job_title}</span>
                </div>
              )}

              {staff.school_name && (
                <div className="flex items-center text-sm text-gray-500 justify-center sm:justify-start">
                  <Building className="h-4 w-4 mr-2" />
                  <span>{staff.school_name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Technical Details */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Account Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-medium text-gray-500">Staff ID:</div>
                <div className="text-gray-700 break-all">{staff._id}</div>
              </div>
              
              {staff.updatedAt && (
                <div className="p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-500">Last Updated:</div>
                  <div className="text-gray-700">
                    {formatDateFromISO(staff.updatedAt)}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {getTimeAgo(staff.updatedAt)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Created date */}
          <div className="text-xs text-gray-400 border-t pt-4">
            <div className="flex items-center text-sm text-gray-500 mb-1 mt-2 justify-center sm:justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              <span>
                Account created {formatDateFromISO(staff.createdAt)} (
                {getTimeAgo(staff.createdAt)})
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewStaffModal;
