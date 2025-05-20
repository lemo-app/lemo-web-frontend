"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import  { signup, fetchSchools, connectStaffToSchool as connectUserToSchool, updateUserInfo, fetchCurrentUser } from "@/utils/client-api"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

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
  
  // Section management state
  const [customSections, setCustomSections] = useState<string[]>([]);
  const [newSection, setNewSection] = useState("");
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [sectionSelectOpen, setSectionSelectOpen] = useState(false);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState("");

  // Fetch current user information
  const { 
    data: userData, 
    isLoading: isLoadingUser, 
    isError: isUserError 
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  // Check user roles
  const isSuperAdmin = userData?.type === 'super_admin';
  const userSchoolId = userData?.school?._id;
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

  // Load custom sections from localStorage on component mount
  useEffect(() => {
    const loadCustomSections = () => {
      if (typeof window !== "undefined") {
        const savedSections = localStorage.getItem("customStudentSections");
        if (savedSections) {
          try {
            setCustomSections(JSON.parse(savedSections));
          } catch (error) {
            // console.error("Failed to parse custom sections:", error);
            setCustomSections([]);
          }
        }
      }
    };
    
    loadCustomSections();
  }, []);

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
      setIsAddingSection(false);
      setSchoolSearchQuery(""); // Reset school search query
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

  // Handle adding a custom section
  const handleAddCustomSection = () => {
    if (!newSection.trim()) return;
    
    // Don't add if the section already exists
    if (customSections.includes(newSection.trim())) {
      setNewSection("");
      setIsAddingSection(false);
      return;
    }
    
    const sectionTrimmed = newSection.trim();
    
    const updatedSections = [...customSections, sectionTrimmed];
    setCustomSections(updatedSections);
    
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("customStudentSections", JSON.stringify(updatedSections));
    }
    
    // Select the newly created section
    setFormData(prev => ({ ...prev, section: sectionTrimmed }));
    setNewSection("");
    setIsAddingSection(false);
  };

  // Handle removing a section
  const handleRemoveSection = (sectionToRemove: string) => {
    const updatedSections = customSections.filter(section => section !== sectionToRemove);
    setCustomSections(updatedSections);
    
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("customStudentSections", JSON.stringify(updatedSections));
    }
    
    // If the currently selected section is being removed, reset the selection
    if (formData.section === sectionToRemove) {
      setFormData(prev => ({ ...prev, section: "" }));
    }
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
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add student");
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

  // All available sections (custom + predefined)
  const allSections = useMemo(() => {
    const predefinedSections = ['A', 'B', 'C'];
    return [...predefinedSections, ...customSections.filter(section => !predefinedSections.includes(section))];
  }, [customSections]);

  // Custom section component with delete button
  const SectionItem = ({ section }: { section: string }) => {
    const isPredefined = ['A', 'B', 'C'].includes(section);
    
    return (
      <div className="flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-sm cursor-default hover:bg-accent hover:text-accent-foreground">
        <div 
          className="flex-1" 
          onClick={() => {
            setFormData(prev => ({ ...prev, section }));
            setSectionSelectOpen(false);
          }}
        >
          {section}
        </div>
        {!isPredefined && (
          <button
            type="button"
            className="ml-2 focus:outline-none"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleRemoveSection(section);
            }}
            title="Remove section"
          >
            <Trash2 className="h-4 w-4 text-destructive hover:text-destructive/80" />
          </button>
        )}
      </div>
    );
  };

  // Filter schools based on search query
  const filteredSchools = useMemo(() => {
    if (!schoolSearchQuery.trim()) {
      return schoolsData.slice(0, 3); // Show first 3 schools when no search
    }
    return schoolsData
      .filter(school => 
        school.school_name.toLowerCase().includes(schoolSearchQuery.toLowerCase())
      )
      .slice(0, 10); // Limit to 10 results for better performance
  }, [schoolsData, schoolSearchQuery]);

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
                <div className="flex items-center justify-between">
                  <Label htmlFor="section">Section</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2 text-xs"
                    onClick={() => setIsAddingSection(true)}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Section
                  </Button>
                </div>
                
                {isAddingSection ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter section"
                      value={newSection}
                      onChange={(e) => setNewSection(e.target.value)}
                      autoFocus
                    />
                    <Button size="sm" onClick={handleAddCustomSection}>Add</Button>
                    <Button size="sm" variant="outline" onClick={() => setIsAddingSection(false)}>Cancel</Button>
                  </div>
                ) : (
                  <div className="relative">
                    <div
                      className={cn(
                        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground",
                        formData.section ? "" : "text-muted-foreground"
                      )}
                      onClick={() => setSectionSelectOpen(!sectionSelectOpen)}
                    >
                      {formData.section || "Select section"}
                    </div>
                    
                    {sectionSelectOpen && (
                      <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                        <ScrollArea className="h-[200px]">
                          <div className="space-y-1">
                            {allSections.length > 0 ? (
                              allSections.map((section) => (
                                <SectionItem key={section} section={section} />
                              ))
                            ) : (
                              <div className="px-2 py-1.5 text-sm text-muted-foreground italic">
                                No sections available
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                )}
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
                  <div className="relative">
                    <Input
                      placeholder="Search schools..."
                      value={formData.school ? schoolsData.find((school) => school._id === formData.school)?.school_name : schoolSearchQuery}
                      onChange={(e) => {
                        setSchoolSearchQuery(e.target.value);
                        if (formData.school) {
                          setFormData(prev => ({ ...prev, school: "" }));
                        }
                      }}
                      className="w-full"
                    />
                    {(schoolSearchQuery || !formData.school) && (
                      <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md">
                        <div className="max-h-[200px] overflow-y-auto">
                          {filteredSchools.length === 0 ? (
                            <div className="p-2 text-sm text-muted-foreground text-center">
                              No schools found
                            </div>
                          ) : (
                            filteredSchools.map((school) => (
                              <div
                                key={school._id}
                                className={cn(
                                  "flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground",
                                  formData.school === school._id && "bg-accent text-accent-foreground"
                                )}
                                onClick={() => {
                                  handleSelectChange('school', school._id);
                                  setSchoolSearchQuery("");
                                }}
                              >
                                {school.school_name}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
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