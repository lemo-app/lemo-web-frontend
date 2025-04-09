"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2} from "lucide-react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import apiClient, { signup, fetchSchools, connectStaffToSchool as connectUserToSchool, updateUserProfile, updateUserInfo } from "@/utils/client-api"
import { User as UserType } from "@/utils/interface/user.types"

// Extend the UserType to include student-specific fields

// Current user interface
interface CurrentUser extends UserType {
  type: 'super_admin' | 'admin' | 'school_manager';
  school_name?: string;
  school?: string;
}

// School interface is now imported from school.types.ts

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  userType: string
}

export function AddStudentModal({ isOpen, onClose, onSuccess, userType }: AddStudentModalProps) {
  const queryClient = useQueryClient();
  // Form state
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    student_id: "",
    section: "",
    school: "",
    roll_no: "",
    gender: "",
    age: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch current user information
  const { 
    data: userData, 
    isLoading: isLoadingUser, 
    isError: isUserError 
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await apiClient.get('/users/me');
      return response.data as CurrentUser;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  // Check user roles
  const isSuperAdmin = userData?.type === 'super_admin';
  const userSchoolId = userData?.school;
  const userSchoolName = userData?.school_name || "Your School";

  // Fetch schools for super admin
  const { 
    data: schoolsResponse, 
    isLoading: isLoadingSchools 
  } = useQuery({
    queryKey: ['schools', userData],
    queryFn: () => fetchSchools({
      limit: 100, // Get all schools
      sortBy: 'school_name',
      order: 'asc'
    }),
    enabled: isSuperAdmin, // Only fetch schools for super admin
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  // Memoize the schoolsData to prevent unnecessary re-renders
  const schoolsData = useMemo(() => schoolsResponse?.data?.schools || [], [schoolsResponse]);

  // Log schools data for debugging
  useEffect(() => {
    if (schoolsData.length > 0) {
      console.log('Schools data:', schoolsData);
    }
  }, [schoolsData]);

  // Section options
  const sections = [
    { value: '10/A', label: '10/A' },
    { value: '9/B', label: '9/B' },
    { value: '8/C', label: '8/C' },
  ];

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        email: "",
        full_name: "",
        student_id: "",
        section: "",
        school: isSuperAdmin ? "" : userSchoolId || "",
        roll_no: "",
        gender: "",
        age: "",
      });
    }
  }, [isOpen, isSuperAdmin, userSchoolId]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.email) {
      toast.error("Email is required");
      setIsSubmitting(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    try {
      // Create student user using the signup function with type='student'
      const response = await signup(
        formData.email,
        'student',
      );
      
      if (response) {
        // connect student to school
        await connectUserToSchool(formData.email, formData.school)
        // update user info
        const userInfo = {
          full_name: formData.full_name,
          student_id: formData.student_id,
          roll_no: formData.roll_no,
          section: formData.section,
          gender: formData.gender,
          age: formData.age,
        }
        await updateUserInfo(userInfo, response.userId)
          
        toast.success("Student added successfully");
        onSuccess?.();
        onClose();
      }
    } catch (error: unknown) {
      console.log('error:', error)
      toast.error("Failed to add student");
    } finally {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      setIsSubmitting(false);
    }
  };

  // Loading state
  const isLoading = isLoadingUser || (isSuperAdmin && isLoadingSchools);

  // Error state
  if (isUserError) {
    toast.error('Failed to load user information');
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Student</DialogTitle>
          <DialogDescription>
            Add a new student to the system. They will receive an invitation email to set up their account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="student_id">Student ID *</Label>
                <Input
                  id="student_id"
                  name="student_id"
                  placeholder="STU123"
                  value={formData.student_id}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="roll_no">Roll Number</Label>
                <Input
                  id="roll_no"
                  name="roll_no"
                  placeholder="Roll number"
                  value={formData.roll_no}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="section">Section *</Label>
                <Select
                  value={formData.section}
                  onValueChange={(value) => handleSelectChange('section', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.value} value={section.value}>
                        {section.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange('gender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleInputChange}
                />
              </div>
              
              {isSuperAdmin && (
                <div className="grid gap-2">
                  <Label htmlFor="school">School *</Label>
                  <Select
                    value={formData.school}
                    onValueChange={(value) => handleSelectChange('school', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select school" />
                    </SelectTrigger>
                    <SelectContent>
                      {schoolsData.map((school) => (
                        <SelectItem key={school._id} value={school._id}>
                          {school.school_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {!isSuperAdmin && userSchoolId && (
                <div className="grid gap-2">
                  <Label>School</Label>
                  <div className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm">
                    <span>{userSchoolName}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isSubmitting}>
              {isLoading || isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Student"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

