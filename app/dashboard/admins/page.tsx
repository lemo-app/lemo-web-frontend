"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Loader2, UserCog } from "lucide-react"
import { Pagination } from "@/components/dashboard/common/pagination"
import { format, parseISO } from "date-fns"
import apiClient, { fetchUsers, FetchUsersParams } from "@/utils/client-api"
import { User } from "@/utils/interface/user.types"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import HeaderWithButtonsLinks from "@/components/dashboard/common/header-with-buttons-links"
import { InviteAdminModal } from "@/components/dashboard/admins/invite-admin-modal"

export default function ManageAdmins() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  
  const queryClient = useQueryClient()

  // Fetch current user information
  const { 
    data: userData, 
    isLoading: isLoadingUser, 
    isError: isUserError 
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await apiClient.get('/users/me');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  // Build query parameters for React Query
  const buildQueryParams = (): FetchUsersParams => {
    return {
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearchQuery,
      type: "super_admin", // Filter to only get admins
      sortBy: "createdAt",
      order: "desc"
    };
  };

  // React Query hook for fetching users
  const { 
    data, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['admins', currentPage, itemsPerPage, debouncedSearchQuery],
    queryFn: () => fetchUsers(buildQueryParams()),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Extract data from query result
  const admins = data?.data?.users || [];
  const totalItems = data?.data?.totalUsers || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Effect for debouncing search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Format date to readable string
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "MMM d, yyyy 'at' h:mm a");
    } catch {
      return dateString;
    }
  }
  
  // Handle limit change
  const handleLimitChange = (limit: number) => {
    setItemsPerPage(limit)
    setCurrentPage(1) // Reset to first page when changing limit
  }

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };
  
  // Handle opening invite modal
  const handleOpenInviteModal = () => {
    setIsInviteModalOpen(true);
  };
  
  // Handle closing invite modal
  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
    // Refresh the admin list after modal is closed (in case a new admin was added)
    queryClient.invalidateQueries({ queryKey: ['admins'] });
  };

  // Handle error
  if (isError && error) {
    console.error('Error fetching admins:', error);
    toast.error('Failed to load admins data');
  }

  return (
    <div className="space-y-6">
      <HeaderWithButtonsLinks 
        title={'Manage Admins'}
        modalTitle={'Invite Admin'}
        onModalOpen={handleOpenInviteModal}
      />

      <div className="flex items-center justify-between">
        <div className="relative w-80 bg-white">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search by admin email or name..." 
            className="pl-10" 
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Invitation Time</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                    <span>Loading admins...</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
            
            {!isLoading && admins.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No admins found
                </TableCell>
              </TableRow>
            )}
            
            {!isLoading && admins.map((admin: User) => (
              <TableRow key={admin._id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                      <UserCog className="h-4 w-4" />
                    </div>
                    {admin.email}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 capitalize">
                    {admin.type.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`${admin.email_verified 
                      ? "bg-green-50 text-green-700" 
                      : "bg-yellow-50 text-yellow-700"}`
                    }
                  >
                    {admin.email_verified ? "Verified" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-600">{formatDate(admin.createdAt)}</TableCell>
                <TableCell className="text-sm text-gray-600">{formatDate(admin.updatedAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="outline" size="sm">Details</Button>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {admins.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onLimitChange={handleLimitChange}
        />
      )}
      
      {/* Invite Admin Modal */}
      <InviteAdminModal
        isOpen={isInviteModalOpen}
        onClose={handleCloseInviteModal}
        userType={userData?.type}
      />
    </div>
  )
}

