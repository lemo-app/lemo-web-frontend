"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { AddFacultyModal } from "@/components/dashboard/settings/add-faculty-modal";
import { useState } from "react";
import SchoolDetails from "@/components/dashboard/settings/school-details";
import QrCodes from "@/components/dashboard/settings/qr-codes";
import avatarLogo from '@/assets/images/dashboard/common/avatar.png'; 
import Image from "next/image";

interface FacultyMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

const Settings = () => {
  const [facultyMembers] = useState<FacultyMember[]>([
    {
      id: 1,
      name: "Jay Hargudson",
      role: "Project Manager",
      avatar: "https://ui.shadcn.com/avatars/01.png",
    },
    {
      id: 2,
      name: "Mohammad Karim",
      role: "Project Manager",
      avatar: "https://ui.shadcn.com/avatars/02.png",
    },
    {
      id: 3,
      name: "John Bushmill",
      role: "Project Manager",
      avatar: "https://ui.shadcn.com/avatars/03.png",
    },
    {
      id: 4,
      name: "Josh Adam",
      role: "UI/UX Designer",
      avatar: "https://ui.shadcn.com/avatars/04.png",
    },
    {
      id: 5,
      name: "Linda Blair",
      role: "Mobile Developer",
      avatar: "https://ui.shadcn.com/avatars/05.png",
    },
    {
      id: 6,
      name: "Sin Tae",
      role: "Front End Developer",
      avatar: "https://ui.shadcn.com/avatars/06.png",
    },
    {
      id: 7,
      name: "Laura Prichet",
      role: "Back End Developer",
      avatar: "https://ui.shadcn.com/avatars/07.png",
    },
    {
      id: 8,
      name: "Lisa Greg",
      role: "Tech Lead",
      avatar: "https://ui.shadcn.com/avatars/08.png",
    },
  ]);

  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="">
        <h1 className="text-2xl font-semibold text-gray-900 pb-4">
          School Settings
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - School Details */}
          <div className="lg:col-span-2 space-y-6">
            <SchoolDetails />

            {/* Faculty Members Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Faculty Members
                </h2>
                <Button
                  size="sm"
                  onClick={() => setShowAddFacultyModal(true)}
                  variant="secondary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Faculty Member
                </Button>
              </div>

              <div className="p-4 border-[2px] border-gray-100 rounded-lg">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-10"
                      placeholder="Search team member..."
                    />
                  </div>
                </div>

                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {facultyMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-1 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Image
                            width={40}
                            height={40}
                            src={avatarLogo.src}
                            alt={member.name}
                            className="rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {member.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {member.role}
                            </p>
                          </div>
                        </div>
                        <Checkbox />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>

          {/* Right Column - QR Codes */}
          <QrCodes />
        </div>
      </div>

      <AddFacultyModal
        open={showAddFacultyModal}
        onOpenChange={setShowAddFacultyModal}
      />
    </div>
  );
};

export default Settings;
