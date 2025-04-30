"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Trash2, Loader2, Search, School as SchoolIcon, Building, Lock } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { connectStaffToSchool as connectUserToSchool, signup, fetchSchools, updateUserInfo } from "@/utils/client-api"
import { toast } from "sonner"
import { School } from "@/utils/interface/school.types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import apiClient from "@/utils/client-api"

interface AddStaffModalProps {
  isOpen: boolean
  onClose: () => void
  userType: string
}

export function AddStaffModal({ isOpen, onClose, userType }: AddStaffModalProps) {
  const queryClient = useQueryClient()
  const [staffName, setStaffName] = useState("")
  const [staffEmail, setStaffEmail] = useState("")
  const [staffRole, setStaffRole] = useState("")
  const [staffType, setStaffType] = useState<"admin" | "school_manager">("school_manager")
  const [newRole, setNewRole] = useState("")
  const [isAddingRole, setIsAddingRole] = useState(false)
  const [customRoles, setCustomRoles] = useState<string[]>([])
  const [selectOpen, setSelectOpen] = useState(false)
  const [typeSelectOpen, setTypeSelectOpen] = useState(false)
  const [schoolSelectOpen, setSchoolSelectOpen] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [schoolSearch, setSchoolSearch] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [currentUserSchool, setCurrentUserSchool] = useState<string | null>(null)
  const [currentUserSchoolName, setCurrentUserSchoolName] = useState<string | null>(null)
  const [isLoadingUserData, setIsLoadingUserData] = useState(false)
  const [currentUserType, setCurrentUserType] = useState<string | null>(null)
  const schoolSearchInputRef = useRef<HTMLInputElement>(null)

  // Fetch schools with search - only for super_admin users
  const { data: schoolsData, isLoading: schoolsLoading } = useQuery({
    queryKey: ['schools', { search: schoolSearch }],
    queryFn: () => fetchSchools({ 
      search: schoolSearch,
      limit: 20,
      sortBy: 'school_name',
      order: 'asc'
    }),
    enabled: isOpen && userType === "super_admin", // Only fetch when modal is open and user is super_admin
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
  // console.log('schoolsData:', schoolsData)
  const schools = useMemo(()=> schoolsData?.data?.schools || [], [schoolsData])
  // console.log('schools:', schools)
  
  // Fetch current user's information and school
  const fetchCurrentUserInfo = useCallback(async () => {
    setIsLoadingUserData(true)
    try {
      const response = await apiClient.get('/users/me')
      if (response.data?.type) {
        setCurrentUserType(response.data.type)
        // Only set staffType for school_manager users
        if (response.data.type === "school_manager") {
          setStaffType("school_manager")
        }
      }

      if (response.data?.school) {
        setCurrentUserSchool(response.data.school._id)
        setCurrentUserSchoolName(response.data.school.school_name)
      }
    } catch (err) {
      // console.error("Error fetching current user info:", err)
      toast.error("Could not retrieve your user information.")
    } finally {
      setIsLoadingUserData(false)
    }
  }, [])

  // Load custom roles from localStorage on component mount
  useEffect(() => {
    const loadCustomRoles = () => {
      if (typeof window !== "undefined") {
        const savedRoles = localStorage.getItem("customStaffRoles")
        if (savedRoles) {
          try {
            setCustomRoles(JSON.parse(savedRoles))
          } catch (error) {
            // console.error("Failed to parse custom roles:", error)
            setCustomRoles([])
          }
        }
      }
    }
    
    loadCustomRoles()
  }, [])

  // Effect to fetch user's information when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCurrentUserInfo()
    }
  }, [isOpen, fetchCurrentUserInfo])
  // console.log('schoolSearch :', schoolSearch)
  // Focus school search input when school select opens
  useEffect(() => {
    if (schoolSelectOpen && schoolSearchInputRef.current) {
      setTimeout(() => {
        schoolSearchInputRef.current?.focus()
      }, 100)
    }
  }, [schoolSelectOpen])

  // All available roles for job title (custom + predefined)
  const allRoles = [...customRoles]

  const handleSubmit = async () => {
    if (!staffEmail || !staffRole || !staffType) {
      toast.error("Please fill all required fields")
      return
    }
    
    // For non-super_admin users or school_manager type, we need to have a current user school
    if (( currentUserType == 'school_manager' || currentUserType == 'admin') && !currentUserSchool) {
      toast.error("You are not associated with a school. Please contact an administrator.")
      return
    }
    
    // For super_admin users adding an admin, we need to have a selected school
    if (userType === "super_admin" && (staffType == 'admin' || staffType == 'school_manager') && !selectedSchool) {
      toast.error("Please select a school")
      return
    }
    
    // Determine which school ID to use based on user type and staff type
    let schoolId: string
    let schoolName: string
    
    if (userType !== "super_admin") {
      // school_manager | admin staff always use current user's school
      schoolId = currentUserSchool!
      schoolName = currentUserSchoolName || "Your School"
    } else {
      // Super admin adding school_manager | admin - use selected school
      schoolId = selectedSchool!._id
      schoolName = selectedSchool!.school_name
    }
    
    setIsSubmitting(true)
    setError("")
    
    try {
      const signupResponse = await signup(
        staffEmail, 
        staffType, 
        staffRole
      );
      const user_id = signupResponse.userId;
      
      // Connect the staff to the appropriate school
      await connectUserToSchool(staffEmail, schoolId)
      
      const userInfo = {
        full_name: staffName,
      }
      await updateUserInfo(userInfo, user_id)
      // Notify success
      toast.success(`Staff member ${staffName || staffEmail} added successfully to ${schoolName}!`)
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['staff'] })
      
      // Reset form
      setStaffName("")
      setStaffEmail("")
      setStaffRole("")
      setStaffType("school_manager")
      setSelectedSchool(null)
      setSchoolSearch("")
      onClose()
    } catch (err) {
      // console.error("Error creating staff:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to create staff member"
      setError(errorMessage)
      toast.error(`Failed to add staff: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddCustomRole = () => {
    if (!newRole.trim()) return
    
    // Don't add if the role already exists
    if (allRoles.includes(newRole.trim().toLowerCase())) {
      setNewRole("")
      setIsAddingRole(false)
      return
    }
    
    const roleTrimmed = newRole.trim().toLowerCase();
    
    const updatedRoles = [...customRoles, roleTrimmed]
    setCustomRoles(updatedRoles)
    
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("customStaffRoles", JSON.stringify(updatedRoles))
    }
    
    // Select the newly created role
    setStaffRole(roleTrimmed)
    setNewRole("")
    setIsAddingRole(false)
  }

  const handleRemoveRole = (roleToRemove: string) => {
    const updatedRoles = customRoles.filter(role => role !== roleToRemove)
    setCustomRoles(updatedRoles)
    
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("customStaffRoles", JSON.stringify(updatedRoles))
    }
    
    // If the currently selected role is being removed, reset the selection
    if (staffRole === roleToRemove) {
      setStaffRole("")
    }
  }

  // Handle school selection (only for super_admin)
  const handleSelectSchool = (school: School) => {
    setSelectedSchool(school)
    setSchoolSelectOpen(false)
    setSchoolSearch("")
  }

  // Handle staff type change (only for super_admin and admin)
  const handleTypeChange = (type: "admin" | "school_manager") => {
    if (userType === "super_admin" || userType === "admin") {
      setStaffType(type)
      setTypeSelectOpen(false)
    }else{
      toast.error("You cannot change the staff type")
    }
  }

  // Custom role component with delete button
  const RoleItem = ({ role }: { role: string }) => {
    return (
      <div className="flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-sm cursor-default hover:bg-accent hover:text-accent-foreground">
        <div 
          className="flex-1" 
          onClick={() => {
            setStaffRole(role)
            setSelectOpen(false)
          }}
        >
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </div>
        <button
          type="button"
          className="ml-2 focus:outline-none"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleRemoveRole(role)
          }}
          title="Remove role"
        >
          <Trash2 className="h-4 w-4 text-destructive hover:text-destructive/80" />
        </button>
      </div>
    )
  }

  // Custom type selector (for super_admin only)
  const TypeItem = ({ type, label }: { type: "admin" | "school_manager"; label: string }) => {
    return (
      <div 
        className="flex items-center w-full px-2 py-1.5 text-sm rounded-sm cursor-default hover:bg-accent hover:text-accent-foreground"
        onClick={() => handleTypeChange(type)}
      >
        {label}
      </div>
    )
  }

  // School item component (for super_admin only)
  const SchoolItem = ({ school }: { school: School }) => {
    return (
      <div 
        className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-sm cursor-default hover:bg-accent hover:text-accent-foreground"
        onClick={() => handleSelectSchool(school)}
      >
        <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
          <SchoolIcon className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="flex-1 truncate">{school.school_name}</div>
      </div>
    )
  }


  // console.log('userType:', userType)
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">Add Staff Member</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="staffEmail">Email Address <span className="text-destructive">*</span></Label>
            <Input
              id="staffEmail"
              type="email"
              placeholder="Enter email address"
              value={staffEmail}
              onChange={(e) => setStaffEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="staffName">Full Name</Label>
            <Input
              id="staffName"
              placeholder="Enter full name"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
            />
          </div>

          {/* Staff Type Selection - Only editable for super_admin and admin */}
          <div className="space-y-2">
            <Label htmlFor="staffType">Staff Type <span className="text-destructive">*</span></Label>
            {isLoadingUserData ? (
              <div className="flex h-10 items-center justify-center rounded-md border border-input bg-background">
                <Loader2 className="h-4 w-4 animate-spin text-primary mr-2" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (userType === "super_admin" || userType === "admin") ? (
              // For super_admin and admin, show dropdown to select staff type
              <div className="relative">
                <div
                  className={cn(
                    "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground",
                    staffType ? "" : "text-muted-foreground"
                  )}
                  onClick={() => setTypeSelectOpen(!typeSelectOpen)}
                >
                  {staffType === "admin" ? "Admin" : "School Manager"}
                </div>
                
                {typeSelectOpen && (
                  <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                    <div className="space-y-1">
                      <TypeItem type="admin" label="Admin" />
                      <TypeItem type="school_manager" label="School Manager" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // For school_manager, show locked school_manager type
              <div className="flex h-10 items-center px-3 rounded-md border border-input bg-background">
                <div className="flex items-center gap-2 text-sm">
                  <span>School Manager</span>
                  <Lock className="h-3.5 w-3.5 ml-2 text-muted-foreground" />
                </div>
              </div>
            )}
            {userType === "school_manager" && (
              <p className="text-xs text-muted-foreground">
                You can only add School Manager staff.
              </p>
            )}
          </div>

          {/* School Selection - Different UI based on user type and staff type */}
          <div className="space-y-2">
            <Label htmlFor="school">
              {userType === "super_admin" ? "Select School" : "School"} 
              <span className="text-destructive">*</span>
            </Label>
            
            {isLoadingUserData ? (
              <div className="flex h-10 items-center justify-center rounded-md border border-input bg-background">
                <Loader2 className="h-4 w-4 animate-spin text-primary mr-2" />
                <span className="text-sm text-muted-foreground">Loading your school...</span>
              </div>
            ) : userType === "super_admin" ? (
              // School dropdown for super_admin for BOTH staff types
              <div className="relative">
                <div
                  className={cn(
                    "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                    selectedSchool ? "" : "text-muted-foreground"
                  )}
                  onClick={() => setSchoolSelectOpen(!schoolSelectOpen)}
                >
                  {selectedSchool ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                        <SchoolIcon className="h-3 w-3 text-primary" />
                      </div>
                      <span>{selectedSchool.school_name}</span>
                    </div>
                  ) : (
                    "Select school"
                  )}
                </div>
                
                {schoolSelectOpen && (
                  <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-2 text-popover-foreground shadow-md">
                    <div className="relative mb-2">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        ref={schoolSearchInputRef}
                        placeholder="Search schools..."
                        value={schoolSearch}
                        onChange={(e) => setSchoolSearch(e.target.value)}
                        className="pl-8 h-9"
                      />
                    </div>
                    
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-1">
                        {schoolsLoading ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          </div>
                        ) : schools.length > 0 ? (
                          schools.map((school) => (
                            <SchoolItem key={school._id} school={school} />
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-muted-foreground italic">
                            {schoolSearch ? "No schools found matching your search" : "No schools available"}
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            ) : currentUserSchool ? (
              // Locked school display for non-super_admin
              <div className="flex h-10 items-center px-3 rounded-md border border-input bg-background">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                    <Building className="h-3 w-3 text-primary" />
                  </div>
                  {currentUserSchoolName || "Your School"}
                  <Lock className="h-3.5 w-3.5 ml-2 text-muted-foreground" />
                </div>
              </div>
            ) : (
              <div className="flex h-10 items-center px-3 rounded-md border border-input bg-background">
                <span className="text-sm text-destructive">
                  You are not associated with any school
                </span>
              </div>
            )}
            
            {userType !== "super_admin" && (
              <p className="text-xs text-muted-foreground">
                You can only add staff to your assigned school.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="staffRole">Job Title <span className="text-destructive">*</span></Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs"
                onClick={() => setIsAddingRole(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Job Title
              </Button>
            </div>
            
            {isAddingRole ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter job title"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  autoFocus
                />
                <Button size="sm" onClick={handleAddCustomRole}>Add</Button>
                <Button size="sm" variant="outline" onClick={() => setIsAddingRole(false)}>Cancel</Button>
              </div>
            ) : (
              <div className="relative">
                <div
                  className={cn(
                    "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground",
                    staffRole ? "" : "text-muted-foreground"
                  )}
                  onClick={() => setSelectOpen(!selectOpen)}
                >
                  {staffRole 
                    ? staffRole.charAt(0).toUpperCase() + staffRole.slice(1) 
                    : "Select job title"
                  }
                </div>
                
                {selectOpen && (
                  <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-1">
                        {allRoles.length > 0 ? (
                          allRoles.map((role) => (
                            <RoleItem key={role} role={role} />
                          ))
                        ) : (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground italic">
                            No job titles added yet
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground">
            Note: An invitation email will be sent to the staff member with account setup instructions.
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={
              !staffEmail || 
              !staffRole || 
              !staffType || 
              (userType === "super_admin" && staffType === "admin" && !selectedSchool) ||
              (userType !== "super_admin" && !currentUserSchool) ||
              isSubmitting || 
              isAddingRole
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Staff"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

