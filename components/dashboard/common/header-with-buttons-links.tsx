'use client'

import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import React, { useState } from "react";
import { AddSchoolModal } from "../schools/add-school-modal";
import { AddStudentModal } from "../students/add-student-modal";
import { AddStaffModal } from "../staff/add-staff-modal";
import { InviteAdminModal } from "../admins/invite-admin-modal";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "@/utils/client-api";

interface HeaderWithButtonsLinksProps {
  title: string;
  modalTitle: string;
  onModalOpen?: () => void; // Optional callback for custom modal handling
}

const HeaderWithButtonsLinks = ({
  title,
  modalTitle,
  onModalOpen
}: HeaderWithButtonsLinksProps) => {
   // Fetch current user information
  const { 
    data: userData, 
    // isLoading: isLoadingUser, 
    // isError: isUserError 
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">{title}</h1>

      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-2 bg-white">
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button
          variant={isAddModalOpen ? "outline" : "default"}
          className="gap-2 "
          onClick={() => {
            // If there's a custom handler, use it
            if (onModalOpen) {
              onModalOpen();
              return;
            }
            
            // Default behavior
            if (modalTitle === "Add Student") {
              setIsAddStudentModalOpen(true);
            } else if(modalTitle === "Add Staff") {
              setIsAddStaffModalOpen(true);
            } else if(modalTitle === "Invite Admin" || modalTitle === "Add Admin") {
              setIsAddAdminModalOpen(true);
            } else {
              setIsAddModalOpen(!isAddModalOpen);
            }
          }}
        >
          <Plus className="h-4 w-4" />
          {modalTitle}
        </Button>
      </div>

      {/* Add modals */}
      {!onModalOpen && userData?.type && (
        <>
          <AddSchoolModal
            userType={userData?.type}
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          />
          <AddStudentModal
            userType={userData?.type}
            isOpen={isAddStudentModalOpen}
            onClose={() => setIsAddStudentModalOpen(false)}
          />
          <InviteAdminModal
            userType={userData?.type}
            isOpen={isAddAdminModalOpen}
            onClose={() => setIsAddAdminModalOpen(false)}
          />
          <AddStaffModal
            userType={userData?.type}
            isOpen={isAddStaffModalOpen}
            onClose={() => setIsAddStaffModalOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default HeaderWithButtonsLinks;
