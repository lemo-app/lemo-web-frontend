"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Lock, Trash2, ArrowUpDown, ChevronDown, Eye } from "lucide-react"
import { Pagination } from "@/components/dashboard/common/pagination"
import HeaderWithButtonsLinks from "@/components/dashboard/common/header-with-buttons-links"
import Image from "next/image"
import { User } from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { fetchSchools, FetchSchoolsParams, updateSchool } from "@/utils/client-api"
import { toast } from "sonner"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { School } from "@/utils/interface/school.types"
import DeleteSchoolModal from "@/components/dashboard/schools/delete-school-modal"
import ViewSchoolDetailsModal from "@/components/dashboard/schools/view-school-details-modal"

// Define sorting options
type SortOption = 'nameAsc' | 'nameDesc' | 'dateAsc' | 'dateDesc' | 'none';

// Helper function to format ISO datetime to readable time
const formatTimeFromISO = (isoString?: string): string => {
  if (!isoString) return '';
  
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return isoString; // Return original string if date is invalid
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return isoString; // Return original string if parsing fails
  }
};

export default function ManageSchools() {
  // Get the query client for invalidation
  const queryClient = useQueryClient();
  
  // Query parameters state
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOption, setSortOption] = useState<SortOption>('none')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [editingSchool, setEditingSchool] = useState<string | null>(null)
  
  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [schoolToDelete, setSchoolToDelete] = useState<Pick<School, '_id' | 'school_name'> | null>(null)
  
  // View details modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [schoolToView, setSchoolToView] = useState<School | null>(null)

  const itemsPerPage = 10
  
  // Convert our UI sort option to API parameters
  const getSortParams = () => {
    switch(sortOption) {
      case 'nameAsc':
        return { sortBy: 'school_name', order: 'asc' };
      case 'nameDesc':
        return { sortBy: 'school_name', order: 'desc' };
      case 'dateAsc':
        return { sortBy: 'createdAt', order: 'asc' };
      case 'dateDesc':
        return { sortBy: 'createdAt', order: 'desc' };
      default:
        return { sortBy: 'school_name', order: 'asc' };
    }
  };

  // Build query parameters for React Query
  const buildQueryParams = (): FetchSchoolsParams => {
    const { sortBy, order } = getSortParams();
    return {
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearchQuery,
      sortBy,
      order: order as 'asc' | 'desc'
    };
  };
  
  // Setup edit mutation
  const updateSchoolMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Omit<School, '_id'>> }) => 
      updateSchool(id, data),
    onSuccess: () => {
      // Invalidate the schools query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      toast.success('School updated successfully');
      setEditingSchool(null); // Clear editing state
    },
    onError: (error) => {
      console.error('Failed to update school:', error);
      toast.error('Failed to update school');
    }
  });
  
  // Handle opening the delete modal
  const handleOpenDeleteModal = (school: Pick<School, '_id' | 'school_name'>) => {
    setSchoolToDelete(school)
    setIsDeleteModalOpen(true)
  }
  
  // Handle closing the delete modal
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    // Clear the school to delete after a short delay to avoid UI flicker
    setTimeout(() => {
      setSchoolToDelete(null)
    }, 300)
  }
  
  // Handle edit school
  const handleEditSchool = (schoolId: string) => {
    // In a real app, you would open a modal or navigate to an edit page
    // For now, just show a toast message
    setEditingSchool(schoolId);
    toast.info(`Edit functionality for school ${schoolId} would open a modal or edit page`, {
      description: "This is a placeholder for the edit functionality"
    });
    
    // Clear the editing state after a brief delay
    setTimeout(() => {
      setEditingSchool(null);
    }, 2000);
    
    // In a real implementation, you would:
    // 1. Open a modal or navigate to an edit page
    // 2. Get form data from the user
    // 3. Then call updateSchoolMutation.mutate({ id: schoolId, data: formData })
  };
  
  // Handle opening the view details modal
  const handleOpenViewModal = (school: School) => {
    setSchoolToView(school)
    setIsViewModalOpen(true)
  }
  
  // Handle closing the view details modal
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
    // Clear the school to view after a short delay to avoid UI flicker
    setTimeout(() => {
      setSchoolToView(null)
    }, 300)
  }
  
  // React Query hook for fetching schools
  const { 
    data, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['schools', currentPage, sortOption, debouncedSearchQuery],
    queryFn: () => fetchSchools(buildQueryParams()),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Extract data from query result
  const schools = data?.data?.schools || [];
  const totalItems = data?.data?.totalSchools || 0;
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

  // Get sort option display text
  const getSortOptionText = (option: SortOption) => {
    switch (option) {
      case 'nameAsc': return 'Name (A-Z)';
      case 'nameDesc': return 'Name (Z-A)';
      case 'dateAsc': return 'Date (Oldest first)';
      case 'dateDesc': return 'Date (Newest first)';
      default: return 'Sort by';
    }
  };

  // Handle error
  if (isError) {
    console.error('Error fetching schools:', error);
    toast.error('Failed to load schools data');
  }

  return (
    <div className="space-y-6">
      
      {/* Header with button */}
      <HeaderWithButtonsLinks 
        title={'Manage Schools'}
        modalTitle={'Add School'}
      />

      <div className="flex items-center justify-between">
        <div className="relative w-80 bg-white">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search by schools name..." 
            className="pl-10" 
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex gap-2">
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

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Loading schools...
                </TableCell>
              </TableRow>
            )}
            
            {!isLoading && schools.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No schools found
                </TableCell>
              </TableRow>
            )}
            
            {!isLoading && schools.map((school) => (
              <TableRow key={school._id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      {school.logo_url ? (
                        <Image
                          src={school.logo_url}
                          alt={school.school_name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    {school.school_name}
                  </div>
                </TableCell>
                <TableCell>{school.address}</TableCell>
                <TableCell>{school.contact_number}</TableCell>
                <TableCell>
                  {school.start_time && school.end_time 
                    ? `${formatTimeFromISO(school.start_time)} - ${formatTimeFromISO(school.end_time)}`
                    : 'Not specified'}
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate" title={school.description}>
                    {school.description}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleOpenViewModal(school)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleEditSchool(school._id)}
                      disabled={updateSchoolMutation.isPending && editingSchool === school._id}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleOpenDeleteModal({ _id: school._id, school_name: school.school_name })}
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

      {schools.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalItems}
        />
      )}
      
      {/* Delete School Modal */}
      <DeleteSchoolModal 
        school={schoolToDelete}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
      />
      
      {/* View School Details Modal */}
      <ViewSchoolDetailsModal 
        school={schoolToView}
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
      />
    </div>
  )
}

