"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { School as SchoolIcon, User as UserIcon, Book, Calendar, Users, Tag, GraduationCap, CheckCircle, XCircle } from "lucide-react"
import { User as UserType } from "@/utils/interface/user.types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ViewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: UserType | null;
}

const getInitials = (name: string | undefined | null, email: string) => {
  if (name) {
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  // Get initials from email if no name
  return email.slice(0, 2).toUpperCase();
};

const ViewStudentModal = ({ isOpen, onClose, student }: ViewStudentModalProps) => {
  if (!student) return null;

  // Format date if available
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return "Invalid date";
    }
  };

  // Format gender to display properly
  const formatGender = (gender?: string) => {
    if (!gender) return "Not specified";
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  // Format age to display properly
  const formatAge = (age?: number) => {
    if (age === undefined || age === null) return "Not specified";
    return age.toString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Student Details</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {/* Profile Picture */}
          <div className="flex justify-center mb-6">
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-xl">
                  {getInitials(student.full_name, student.email)}
                </AvatarFallback>
              </Avatar>
              <div className="mt-2 text-center">
                <h3 className="font-medium text-lg">{student.full_name || "No name provided"}</h3>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-sm text-gray-500">{student.email}</Badge> 
                  <div className="mt-1">
                    {student.email_verified ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 flex items-center gap-1">
                        <XCircle className="h-3.5 w-3.5" />
                        Pending Verification
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div className="grid grid-cols-2 gap-4">
            {/* Student ID */}
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Student ID</Label>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{student.student_id || "Not assigned"}</span>
              </div>
            </div>

            {/* Roll Number */}
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Roll Number</Label>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                <Book className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{student.roll_no || "Not assigned"}</span>
              </div>
            </div>

            {/* Section */}
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Section</Label>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{student.section || "Not assigned"}</span>
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Gender</Label>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                <UserIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{formatGender(student.gender)}</span>
              </div>
            </div>

            {/* Age */}
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Age</Label>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{formatAge(student.age)}</span>
              </div>
            </div>

            {/* School */}
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">School</Label>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                <SchoolIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{student.school.school_name || "Not assigned"}</span>
              </div>
            </div>

            {/* Created Date - Full width */}
            <div className="space-y-1 col-span-2">
              <Label className="text-xs text-gray-500">Joined Date</Label>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                <GraduationCap className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{formatDate(student.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewStudentModal;