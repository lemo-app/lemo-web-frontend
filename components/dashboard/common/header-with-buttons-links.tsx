import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import React, { useState } from "react";
import { AddSchoolModal } from "../schools/add-school-modal";
import { AddStudentModal } from "../students/add-student-modal";
import { AddStaffModal } from "../staff/add-staff-modal";
import { InviteAdminModal } from "../admins/invite-admin-modal";

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

      {/* Only render the modals if no custom handler is provided */}
      {!onModalOpen && (
        <>
          <AddSchoolModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          />
          <AddStudentModal
            isOpen={isAddStudentModalOpen}
            onClose={() => setIsAddStudentModalOpen(false)}
          />
          <InviteAdminModal
            isOpen={isAddAdminModalOpen}
            onClose={() => setIsAddAdminModalOpen(false)}
          />
          <AddStaffModal
            isOpen={isAddStaffModalOpen}
            onClose={() => setIsAddStaffModalOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default HeaderWithButtonsLinks;
