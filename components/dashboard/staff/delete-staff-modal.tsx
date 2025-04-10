"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import apiClient from "@/utils/client-api";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface StaffToDelete {
  _id: string;
  full_name?: string;
  email: string;
}

interface DeleteStaffModalProps {
  staff: StaffToDelete | null;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteStaffModal = ({ staff, isOpen, onClose }: DeleteStaffModalProps) => {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!staff) return null;

  const handleDelete = async () => {
    if (!staff._id) return;

    setIsDeleting(true);
    try {
      // Call the API to delete the staff
      await apiClient.delete(`/users/${staff._id}`);
      
      // Invalidate the staff query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      
      toast.success("Staff member successfully removed");
      onClose();
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error("Failed to delete staff member");
    } finally {
      setIsDeleting(false);
    }
  };

  const displayName = staff.full_name || staff.email;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Staff
          </DialogTitle>
          <DialogDescription className="pt-3">
            Are you sure you want to delete this staff member? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="p-4 bg-destructive/10 rounded-md flex flex-col gap-2">
            <h3 className="font-medium text-sm">{displayName}</h3>
            <p className="text-sm text-gray-600">{staff.email}</p>
          </div>

          <p className="text-sm text-gray-600">
            This staff member will lose all access to the platform immediately.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Staff
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteStaffModal;
