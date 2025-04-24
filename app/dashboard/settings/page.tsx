"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AddFacultyModal } from "@/components/dashboard/settings/add-faculty-modal";
import { useState, useMemo } from "react";
import SchoolDetails from "@/components/dashboard/settings/school-details";
import QrCodes from "@/components/dashboard/settings/qr-codes";
import avatarLogo from '@/assets/images/dashboard/common/avatar.png'; 
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser, fetchUsers } from "@/utils/client-api";
import { User } from "@/utils/interface/user.types";
import { Badge } from "@/components/ui/badge";

const Settings = () => {
  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch current user to get school information
  const { data: userData } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  // Fetch faculty members (school managers) for the current school
  const { data: facultyData, isLoading: isLoadingFaculty } = useQuery({
    queryKey: ['faculty', userData?.school?._id, searchQuery],
    queryFn: () => fetchUsers({
      type: 'school_manager',
      school: userData?.school?._id,
      search: searchQuery,
      limit: 100, // Get all faculty members
      sortBy: 'full_name',
      order: 'asc'
    }),
    enabled: !!userData?.school?._id, // Only fetch when we have a school ID
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Filter and transform faculty members
  const facultyMembers = useMemo(() => {
    if (!facultyData?.data?.users) return [];
    
    return facultyData.data.users.map((user: User) => ({
      id: user._id,
      name: user.full_name || user.email,
      role: user.job_title || 'School Manager',
      avatar: user.avatar_url || avatarLogo.src,
      email_verified: user.email_verified
    }));
  }, [facultyData]);

  // Get verification status badge
  const getStatusBadge = (verified: boolean) => {
    return verified ? (
      <Badge variant="outline" className="bg-green-50 text-green-700">
        Verified
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
        Pending
      </Badge>
    );
  };

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
                      placeholder="Search faculty member..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {isLoadingFaculty ? (
                      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                        Loading faculty members...
                      </div>
                    ) : facultyMembers.length === 0 ? (
                      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                        {searchQuery 
                          ? "No faculty members found matching your search" 
                          : "No faculty members added yet"
                        }
                      </div>
                    ) : (
                      facultyMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <Image
                              width={40}
                              height={40}
                              src={member.avatar}
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
                          <div>
                            {getStatusBadge(member.email_verified)}
                          </div>
                        </div>
                      ))
                    )}
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
        currentUserSchool={userData?.school?._id}
        currentUserSchoolName={userData?.school?.school_name}
      />
    </div>
  );
};

export default Settings;
