"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Trash2, Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { connectStaffToSchool, signup } from "@/utils/client-api"
import { toast } from "sonner"

// Static school ID as requested
const SCHOOL_ID = "67e3d08a10ea1b14d7af4142"

interface AddStaffModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddStaffModal({ isOpen, onClose }: AddStaffModalProps) {
  const [staffName, setStaffName] = useState("")
  const [staffEmail, setStaffEmail] = useState("")
  const [staffRole, setStaffRole] = useState("")
  const [staffType, setStaffType] = useState<"admin" | "school_manager">("school_manager")
  const [newRole, setNewRole] = useState("")
  const [isAddingRole, setIsAddingRole] = useState(false)
  const [customRoles, setCustomRoles] = useState<string[]>([])
  const [selectOpen, setSelectOpen] = useState(false)
  const [typeSelectOpen, setTypeSelectOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Load custom roles from localStorage on component mount
  useEffect(() => {
    const loadCustomRoles = () => {
      if (typeof window !== "undefined") {
        const savedRoles = localStorage.getItem("customStaffRoles")
        if (savedRoles) {
          try {
            setCustomRoles(JSON.parse(savedRoles))
          } catch (error) {
            console.error("Failed to parse custom roles:", error)
            setCustomRoles([])
          }
        }
      }
    }
    
    loadCustomRoles()
  }, [])

  // All available roles for job title (custom + predefined)
  const allRoles = [...customRoles]

  const handleSubmit = async () => {
    if (!staffEmail || !staffRole || !staffType) return
    
    setIsSubmitting(true)
    setError("")
    
    try {
      // console.log("Submitting staff with job title:", staffRole);
      
      // Use the specialized createStaffMember function that handles both signup and job title update
      await signup(staffEmail, staffType, staffName, staffRole);
      // console.log("Staff creation response:", response);
      
      // Connect the staff to the school
      await connectStaffToSchool(staffEmail, SCHOOL_ID)
      
      // Notify success
      toast.success(`Staff member ${staffName || staffEmail} added successfully!`)
      
      // Reset form
      setStaffName("")
      setStaffEmail("")
      setStaffRole("")
      setStaffType("school_manager")
      onClose()
    } catch (err) {
      console.error("Error creating staff:", err)
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
    console.log("Adding custom role:", roleTrimmed);
    
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

  // Custom type selector
  const TypeItem = ({ type, label }: { type: "admin" | "school_manager"; label: string }) => {
    return (
      <div 
        className="flex items-center w-full px-2 py-1.5 text-sm rounded-sm cursor-default hover:bg-accent hover:text-accent-foreground"
        onClick={() => {
          setStaffType(type)
          setTypeSelectOpen(false)
        }}
      >
        {label}
      </div>
    )
  }

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

          <div className="space-y-2">
            <Label htmlFor="staffType">Staff Type <span className="text-destructive">*</span></Label>
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
            disabled={!staffEmail || !staffRole || !staffType || isSubmitting || isAddingRole}
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

