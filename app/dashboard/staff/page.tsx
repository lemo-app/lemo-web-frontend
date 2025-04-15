"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, ChevronDown, Edit, Eye, Loader2, Search, Trash2, User, InfoIcon, Building } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/dashboard/common/pagination"
import HeaderWithButtonsLinks from "@/components/dashboard/common/header-with-buttons-links"
import { fetchUsers, FetchUsersParams, fetchCurrentUser, deleteUser } from "@/utils/client-api"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"
import { User as UserType } from "@/utils/interface/user.types"
import Image from "next/image"
import { format, parseISO } from 'date-fns'
import ViewStaffModal from "@/components/dashboard/staff/view-staff-modal"
import EditStaffModal from "@/components/dashboard/staff/edit-staff-modal"
import DeleteStaffModal from "@/components/dashboard/staff/delete-staff-modal"
import { AddStaffModal } from "@/components/dashboard/staff/add-staff-modal"

// Extend the UserType to include job_title which is returned from the API

// Define sorting options
type SortOption = 'nameAsc' | 'nameDesc' | 'emailAsc' | 'emailDesc' | 'dateAsc' | 'dateDesc' | 'none';

export default function ManageStaff() {
  // State for filtering and pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('none')
  const [jobTitleFilter, setJobTitleFilter] = useState<string>('')
  const [staffType, setStaffType] = useState<'school_manager' | 'admin'>('school_manager')
  
  // Modal state for staff operations
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<UserType | null>(null);
  
  // Fetch current user information
  const { 
    data: currentUser, 
    isLoading: isLoadingUser, 
    isError: isUserError 
  } = useQuery<UserType>({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5, // 15 minutes
  });

  // Check user roles
  const isSuperAdmin = currentUser?.type === 'super_admin';

  const userSchoolId = currentUser?.school?._id;
  
  // Handle staff type change (only for super_admin)
  const handleStaffTypeChange = (type: 'school_manager' | 'admin') => {
    if (isSuperAdmin) {
      setStaffType(type);
      setCurrentPage(1); // Reset to first page when changing type
    }
  };

  // Display appropriate title based on user type
  const getPageTitle = () => {
    if (isLoadingUser) return "Loading...";
    if (isSuperAdmin) return "Manage All Staff";
    return "Manage School Staff";
  };
  
  // Convert UI sort option to API parameters
  const getSortParams = () => {
    switch(sortOption) {
      case 'nameAsc':
        return { sortBy: 'full_name', order: 'asc' };
      case 'nameDesc':
        return { sortBy: 'full_name', order: 'desc' };
      case 'emailAsc':
        return { sortBy: 'email', order: 'asc' };
      case 'emailDesc':
        return { sortBy: 'email', order: 'desc' };
      case 'dateAsc':
        return { sortBy: 'createdAt', order: 'asc' };
      case 'dateDesc':
        return { sortBy: 'createdAt', order: 'desc' };
      default:
        return { sortBy: 'createdAt', order: 'desc' };
    }
  };

  // Build query parameters for API request based on user role
  const buildQueryParams = (): FetchUsersParams => {
    const { sortBy, order } = getSortParams();
    
    // Base query parameters
    const params: FetchUsersParams = {
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearchQuery,
      sortBy,
      order: order as 'asc' | 'desc',
      type: staffType // Use the staffType state
    };
    
    // Add job title filter if selected
    if (jobTitleFilter) {
      params.job_title = jobTitleFilter;
    }
    
    // For non-super-admin users, always restrict to their school
    if (!isSuperAdmin && userSchoolId) {
      params.school = userSchoolId;
    }
    
    return params;
  };

  // Fetch staff data with React Query - Only enabled when user data is loaded
  const { 
    data, 
    isLoading: isLoadingStaff, 
    isError: isStaffError
  } = useQuery({
    queryKey: ['staff', currentPage, itemsPerPage, sortOption, debouncedSearchQuery, jobTitleFilter, userSchoolId, isSuperAdmin, staffType],
    queryFn: () => fetchUsers(buildQueryParams()),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !isLoadingUser && !isUserError, // Only fetch when user data is available
  });

  // Combined loading state
  const isLoading = isLoadingUser || isLoadingStaff;
  
  // Extract data from query result
  const staffMembers = (data?.data?.users || []) as UserType[];
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

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle limit change
  const handleLimitChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Reset to first page when changing limit
  };

  // Handle job title filter change
  // const handleJobTitleFilterChange = (title: string) => {
  //   setJobTitleFilter(title);
  //   setCurrentPage(1); // Reset to first page when filtering
  // };

  // Get sort option display text
  const getSortOptionText = (option: SortOption) => {
    switch (option) {
      case 'nameAsc': return 'Name (A-Z)';
      case 'nameDesc': return 'Name (Z-A)';
      case 'emailAsc': return 'Email (A-Z)';
      case 'emailDesc': return 'Email (Z-A)';
      case 'dateAsc': return 'Date (Oldest first)';
      case 'dateDesc': return 'Date (Newest first)';
      default: return 'Sort by';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

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

  // Handle opening the add modal
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  // Handle closing the add modal
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Handle view staff details
  const handleViewStaffDetails = (staffMember: UserType) => {
    setSelectedStaff(staffMember);
    setIsViewModalOpen(true);
  };

  // Handle closing the view modal
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    // Clear the selected staff after a short delay to avoid UI flicker
    setTimeout(() => {
      setSelectedStaff(null);
    }, 300);
  };

  // Handle edit staff
  const handleEditStaff = (staffMember: UserType) => {
    setSelectedStaff(staffMember);
    setIsEditModalOpen(true);
  };

  // Handle closing the edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    // Clear the selected staff after a short delay to avoid UI flicker
    setTimeout(() => {
      setSelectedStaff(null);
    }, 300);
  };

  // Handle delete staff confirmation
  const handleDeleteStaff = (staffMember: UserType) => {
    setSelectedStaff(staffMember);
    setIsDeleteModalOpen(true);
  };

  // Handle closing the delete modal
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    // Clear the selected staff after a short delay to avoid UI flicker
    setTimeout(() => {
      setSelectedStaff(null);
    }, 300);
  };

  // // Job title options for dropdown filter
  // const jobTitles = [
  //   { value: '', label: 'All Titles' },
  //   { value: 'teacher', label: 'Teacher' },
  //   { value: 'principal', label: 'Principal' },
  //   { value: 'coordinator', label: 'Coordinator' },
  //   { value: 'support', label: 'Support Staff' },
  // ];

  // Staff type options for dropdown
  const staffTypes = [
    { value: 'school_manager', label: 'School Managers' },
    { value: 'admin', label: 'Admins' }
  ];

  // Handle error
  if (isUserError) {
    toast.error('Failed to load user information');
  }
  
  if (isStaffError) {
    toast.error('Failed to load staff data');
  }

  return (
    <div className="space-y-6">
      {/* Header with button */}
      <HeaderWithButtonsLinks 
        title={getPageTitle()} 
        modalTitle="Add Staff"
        onModalOpen={handleOpenAddModal}
      />
      
      {/* Permission info banner for non-super-admin users */}
      {!isLoadingUser && !isSuperAdmin && (
        <div className="bg-blue-50 text-blue-700 p-4 rounded-md flex items-center gap-2 text-sm">
          <InfoIcon className="h-5 w-5 flex-shrink-0" />
          <p>You can only view and manage team members associated with your school.</p>
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="relative bg-white w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search by name or email..." 
            className="pl-10 w-full" 
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Staff Type Filter - Only for super admins */}
          {isSuperAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  {staffTypes.find(t => t.value === staffType)?.label || 'Staff Type'}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {staffTypes.map((type) => (
                  <DropdownMenuItem 
                    key={type.value} 
                    onClick={() => handleStaffTypeChange(type.value as 'school_manager' | 'admin')}
                  >
                    {type.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* School indicator for non-super-admin users */}
          {/* {!isLoadingUser && !isSuperAdmin && userSchoolId && (
            <div className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm">
              <Building className="h-4 w-4 text-gray-500" />
              <span>{userSchoolName}</span>
            </div>
          )} */}
          
          {/* Job title filter dropdown
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {jobTitleFilter ? jobTitles.find(jt => jt.value === jobTitleFilter)?.label || 'Job Title' : 'Job Title'}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {jobTitles.map((title) => (
                <DropdownMenuItem 
                  key={title.value} 
                  onClick={() => handleJobTitleFilterChange(title.value)}
                >
                  {title.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu> */}

          {/* Sort options dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                {getSortOptionText(sortOption)}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOption('nameAsc')}>
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption('nameDesc')}>
                Name (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption('emailAsc')}>
                Email (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption('emailDesc')}>
                Email (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption('dateAsc')}>
                Date (Oldest)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption('dateDesc')}>
                Date (Newest)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Staff table */}
      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className={currentUser?.type == 'super_admin' ? 'block' : 'hidden'}>School Name</TableHead>
              <TableHead>Invited At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                    <span>Loading staff members...</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
            
            {!isLoading && isUserError && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-destructive">
                  Error loading user information. Please refresh the page.
                </TableCell>
              </TableRow>
            )}
            
            {!isLoading && !isUserError && staffMembers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No staff members found
                </TableCell>
              </TableRow>
            )}
            
            {!isLoading && !isUserError && staffMembers.map((staff) => (
              <TableRow key={staff._id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      {staff.avatar_url ? (
                        <Image
                          src={staff.avatar_url}
                          alt={staff.full_name || staff.email}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    {staff.full_name || "No name provided"}
                  </div>
                </TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>
                  {staff.job_title ? (
                    <span className="capitalize">{staff.job_title}</span>
                  ) : (
                    <span className="text-gray-400 italic">Not specified</span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(staff.email_verified)}</TableCell>
                <TableCell>{staff.type.replace('_', ' ').toLocaleUpperCase()}</TableCell>
                <TableCell className={(staff.type == 'super_admin' || currentUser?.type == 'super_admin') ? 'block' : 'hidden'}>{staff?.school?.school_name ?? 'N/A'}</TableCell>
                <TableCell>{formatDate(staff.createdAt)}</TableCell>
                <TableCell 
                  className="text-right flex items-center justify-end gap-2"
                >
                  <Button 
                      disabled={isLoading || currentUser?._id === staff._id}
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleViewStaffDetails(staff)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      disabled={isLoading || currentUser?._id === staff._id}
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleEditStaff(staff)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      disabled={isLoading || currentUser?._id === staff._id}
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleDeleteStaff(staff)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && staffMembers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onLimitChange={handleLimitChange}
        />
      )}

      {/* View Staff Modal */}
      {isViewModalOpen && selectedStaff && (
        <ViewStaffModal
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          staff={selectedStaff as any}
        />
      )}

      {/* Edit Staff Modal */}
      {isEditModalOpen && selectedStaff && (
        <EditStaffModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          staff={selectedStaff as any}
        />
      )}

      {/* Delete Staff Modal */}
      {isDeleteModalOpen && selectedStaff && (
        <DeleteStaffModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          staff={selectedStaff}
        />
      )}

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <AddStaffModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          userType={currentUser?.type || "admin"}
        />
      )}
    </div>
  )
}

