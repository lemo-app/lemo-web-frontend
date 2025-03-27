"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteSchool } from "@/utils/client-api"
import { School } from "@/utils/interface/school.types"

interface DeleteSchoolModalProps {
  school: Pick<School, '_id' | 'school_name'> | null
  isOpen: boolean
  onClose: () => void
}

const DeleteSchoolModal = ({ school, isOpen, onClose }: DeleteSchoolModalProps) => {
  const queryClient = useQueryClient()
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(false)

  // Setup delete mutation with React Query
  const deleteSchoolMutation = useMutation({
    mutationFn: (schoolId: string) => deleteSchool(schoolId),
    onMutate: () => {
      setIsConfirmDisabled(true)
    },
    onSuccess: () => {
      // Invalidate the schools query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['schools'] })
      toast.success('School deleted successfully')
      onClose()
    },
    onError: (error) => {
      console.error('Failed to delete school:', error)
      toast.error('Failed to delete school')
    },
    onSettled: () => {
      setIsConfirmDisabled(false)
    }
  })

  // Handle delete confirmation
  const handleConfirmDelete = () => {
    if (school?._id) {
      deleteSchoolMutation.mutate(school._id)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete School
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <span className="font-semibold">{school?.school_name}</span>? 
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={deleteSchoolMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirmDelete}
            disabled={deleteSchoolMutation.isPending || isConfirmDisabled}
          >
            {
                deleteSchoolMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />
            }
            {deleteSchoolMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteSchoolModal