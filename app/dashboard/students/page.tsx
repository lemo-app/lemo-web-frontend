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
import { fetchUsers, FetchUsersParams, deleteUser } from "@/utils/client-api"
import { toast } from "sonner"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { User as UserType } from "@/utils/interface/user.types"
import Image from "next/image"
import apiClient from "@/utils/client-api"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import ViewStudentModal from "@/components/dashboard/students/view-student-modal"

// Extend the UserType to include student-specific fields
interface Student extends UserType {
  school_name?: string;
  school?: string;
}

// Current user interface
interface CurrentUser extends UserType {
  type: 'super_admin' | 'admin' | 'school_manager';
  school_name?: string;
  school?: string;
}

// Define sorting options
type SortOption = 'nameAsc' | 'nameDesc' | 'emailAsc' | 'emailDesc' | 'dateAsc' | 'dateDesc' | 'none';

export default function ManageStudents() {
  const queryClient = useQueryClient();
  // State for filtering and pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('none')
  const [sectionFilter, setSectionFilter] = useState<string>('')
  
  // Delete confirmation dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // View student modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  
  // Fetch current user information
  const { 
    data: userData, 
    isLoading: isLoadingUser, 
    isError: isUserError 
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await apiClient.get('/users/me');
      return response.data as CurrentUser;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  // Check user roles
  const isSuperAdmin = userData?.type === 'super_admin';
  const userSchoolId = userData?.school;
  const userSchoolName = userData?.school_name || "Your School";
  
  // Display appropriate title based on user type
  const getPageTitle = () => {
    if (isLoadingUser) return "Loading...";
    if (isSuperAdmin) return "Manage All Students";
    return "Manage School Students";
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
      type: 'student' // Always fetch students
    };
    
    // Add section filter if selected
    if (sectionFilter) {
      params.section = sectionFilter;
    }
    
    // For non-super-admin users, always restrict to their school
    if (!isSuperAdmin && userSchoolId) {
      params.school = userSchoolId;
    }
    
    return params;
  };

  // Fetch students data with React Query - Only enabled when user data is loaded
  const { 
    data, 
    isLoading: isLoadingStudents, 
    isError: isStudentsError
  } = useQuery({
    queryKey: ['students', currentPage, itemsPerPage, sortOption, debouncedSearchQuery, sectionFilter, userSchoolId, isSuperAdmin],
    queryFn: () => fetchUsers(buildQueryParams()),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !isLoadingUser && !isUserError, // Only fetch when user data is available
  });

  // Combined loading state
  const isLoading = isLoadingUser || isLoadingStudents;
  
  // Extract data from query result
  const students = (data?.data?.users || []) as Student[];
  const totalItems = data?.data?.totalUsers || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  console.log(students)
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

  // Handle section filter change
  const handleSectionFilterChange = (section: string) => {
    setSectionFilter(section);
    setCurrentPage(1); // Reset to first page when filtering
  };

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

  // // Format date
  // const formatDate = (dateString: string) => {
  //   try {
  //     const date = parseISO(dateString);
  //     return format(date, "MMM d, yyyy");
  //   } catch {
  //     return dateString;
  //   }
  // };

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

  // Handle view student details
  const handleViewStudentDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  // Handle edit student
  const handleEditStudent = (student: Student) => {
    toast.info(`Edit ${student.full_name || student.email}`, {
      description: "Edit student functionality coming soon"
    });
  };

  // Handle delete student confirmation
  const handleDeleteStudent = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteDialogOpen(true);
  };

  // Confirm and process student deletion
  const confirmDeleteStudent = async () => {
    if (!studentToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteUser(studentToDelete._id);
      toast.success(`${studentToDelete.full_name || studentToDelete.email} has been deleted successfully`);
      
      // Invalidate and refetch the students query
      queryClient.invalidateQueries({ queryKey: ['students'] });
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error("Failed to delete student. Please try again.");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  };

  // Cancel delete operation
  const cancelDeleteStudent = () => {
    setIsDeleteDialogOpen(false);
    setStudentToDelete(null);
  };

  // Section options for dropdown filter
  // const sections = [
  //   { value: '', label: 'All Sections' },
  //   { value: '10/A', label: '10/A' },
  //   { value: '9/B', label: '9/B' },
  //   { value: '8/C', label: '8/C' },
  // ];

  // Handle error
  if (isUserError) {
    toast.error('Failed to load user information');
  }
  
  if (isStudentsError) {
    toast.error('Failed to load students data');
  }

  return (
    <div className="space-y-6">
      {/* Header with button */}
      <HeaderWithButtonsLinks title={getPageTitle()} modalTitle="Add Student" />
      
      {/* Permission info banner for non-super-admin users */}
      {!isLoadingUser && !isSuperAdmin && (
        <div className="bg-blue-50 text-blue-700 p-4 rounded-md flex items-center gap-2 text-sm">
          <InfoIcon className="h-5 w-5 flex-shrink-0" />
          <p>You can only view and manage students associated with your school.</p>
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="relative w-full bg-white">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search by name or email..." 
            className="pl-10" 
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* School indicator for non-super-admin users */}
          {!isLoadingUser && !isSuperAdmin && userSchoolId && (
            <div className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm">
              <Building className="h-4 w-4 text-gray-500" />
              <span>{userSchoolName}</span>
            </div>
          )}
          
          {/* Section filter dropdown */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {sectionFilter ? sections.find(s => s.value === sectionFilter)?.label || 'Section' : 'Section'}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sections.map((section) => (
                <DropdownMenuItem 
                  key={section.value} 
                  onClick={() => handleSectionFilterChange(section.value)}
                >
                  {section.label}
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

      {/* Students table */}
      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>School</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                    <span>Loading students...</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
            
            {!isLoading && isUserError && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-destructive">
                  Error loading user information. Please refresh the page.
                </TableCell>
              </TableRow>
            )}
            
            {!isLoading && !isUserError && students.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No students found
                </TableCell>
              </TableRow>
            )}
            
            {!isLoading && !isUserError && students.map((student) => (
              <TableRow key={student._id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      {student.avatar_url ? (
                        <Image
                          src={student.avatar_url}
                          alt={student.full_name || student.email}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    {student.full_name || "No name provided"}
                  </div>
                </TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.student_id || "Not assigned"}</TableCell>
                <TableCell>{student.section || "Not assigned"}</TableCell>
                <TableCell>
                  {student.school_name || "Not assigned"}
                </TableCell>
                <TableCell>{getStatusBadge(student.email_verified)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleViewStudentDetails(student)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleEditStudent(student)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleDeleteStudent(student)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && students.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onLimitChange={handleLimitChange}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {studentToDelete?.full_name || studentToDelete?.email}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteStudent} disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteStudent}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Student Modal */}
      <ViewStudentModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        student={selectedStudent}
      />
    </div>
  )
}

