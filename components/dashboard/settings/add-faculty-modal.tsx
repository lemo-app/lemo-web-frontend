import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { signup, connectStaffToSchool, updateUserInfo } from "@/utils/client-api";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

interface AddFacultyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserSchool?: string;
  currentUserSchoolName?: string;
}

export const AddFacultyModal = ({ open, onOpenChange, currentUserSchool, currentUserSchoolName }: AddFacultyModalProps) => {
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [newJobTitle, setNewJobTitle] = useState("");
  const [isAddingJobTitle, setIsAddingJobTitle] = useState(false);
  const [customJobTitles, setCustomJobTitles] = useState<string[]>([]);
  const [selectOpen, setSelectOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load custom job titles from localStorage on component mount
  useEffect(() => {
    const loadCustomJobTitles = () => {
      if (typeof window !== "undefined") {
        const savedTitles = localStorage.getItem("customFacultyJobTitles");
        if (savedTitles) {
          try {
            setCustomJobTitles(JSON.parse(savedTitles));
          } catch (error) {
            // console.error("Failed to parse custom job titles:", error);
            setCustomJobTitles([]);
          }
        }
      }
    };
    loadCustomJobTitles();
  }, []);

  const handleAddCustomJobTitle = () => {
    if (!newJobTitle.trim()) return;
    
    if (customJobTitles.includes(newJobTitle.trim().toLowerCase())) {
      setNewJobTitle("");
      setIsAddingJobTitle(false);
      return;
    }
    
    const titleTrimmed = newJobTitle.trim().toLowerCase();
    const updatedTitles = [...customJobTitles, titleTrimmed];
    setCustomJobTitles(updatedTitles);
    
    if (typeof window !== "undefined") {
      localStorage.setItem("customFacultyJobTitles", JSON.stringify(updatedTitles));
    }
    
    setJobTitle(titleTrimmed);
    setNewJobTitle("");
    setIsAddingJobTitle(false);
  };

  const handleRemoveJobTitle = (titleToRemove: string) => {
    const updatedTitles = customJobTitles.filter(title => title !== titleToRemove);
    setCustomJobTitles(updatedTitles);
    
    if (typeof window !== "undefined") {
      localStorage.setItem("customFacultyJobTitles", JSON.stringify(updatedTitles));
    }
    
    if (jobTitle === titleToRemove) {
      setJobTitle("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !jobTitle || !currentUserSchool) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the user with type school_manager
      const signupResponse = await signup(email, "school_manager", jobTitle);
      const userId = signupResponse.userId;

      // Connect the faculty member to the school
      await connectStaffToSchool(email, currentUserSchool);

      // Update user info with full name
      if (fullName) {
        await updateUserInfo({ full_name: fullName }, userId);
      }

      toast.success(`Faculty member ${fullName || email} added successfully to ${currentUserSchoolName || "your school"}!`);
      
      // Invalidate faculty query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      
      // Reset form
      setFullName("");
      setEmail("");
      setJobTitle("");
      onOpenChange(false);
    } catch (err) {
      // console.error("Error adding faculty member:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to add faculty member";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom job title component with delete button
  const JobTitleItem = ({ title }: { title: string }) => {
    return (
      <div className="flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-sm cursor-default hover:bg-accent hover:text-accent-foreground">
        <div 
          className="flex-1" 
          onClick={() => {
            setJobTitle(title);
            setSelectOpen(false);
          }}
        >
          {title.charAt(0).toUpperCase() + title.slice(1)}
        </div>
        <button
          type="button"
          className="ml-2 focus:outline-none"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleRemoveJobTitle(title);
          }}
          title="Remove job title"
        >
          <Trash2 className="h-4 w-4 text-destructive hover:text-destructive/80" />
        </button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add a Faculty Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Enter full name..."
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="jobTitle">Job Title <span className="text-destructive">*</span></Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs"
                onClick={() => setIsAddingJobTitle(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Job Title
              </Button>
            </div>
            
            {isAddingJobTitle ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter job title"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  autoFocus
                />
                <Button size="sm" onClick={handleAddCustomJobTitle}>Add</Button>
                <Button size="sm" variant="outline" onClick={() => setIsAddingJobTitle(false)}>Cancel</Button>
              </div>
            ) : (
              <div className="relative">
                <div
                  className={cn(
                    "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground",
                    jobTitle ? "" : "text-muted-foreground"
                  )}
                  onClick={() => setSelectOpen(!selectOpen)}
                >
                  {jobTitle 
                    ? jobTitle.charAt(0).toUpperCase() + jobTitle.slice(1) 
                    : "Select job title"
                  }
                </div>
                
                {selectOpen && (
                  <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-1">
                        {customJobTitles.length > 0 ? (
                          customJobTitles.map((title) => (
                            <JobTitleItem key={title} title={title} />
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

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || !email || !jobTitle}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Faculty"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
