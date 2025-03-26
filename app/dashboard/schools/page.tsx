"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Lock, MessageSquare, Trash2, ArrowUpDown, ChevronDown } from "lucide-react"
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
import { School } from "@/utils/interface/school.types"

// Define sorting options
type SortOption = 'nameAsc' | 'nameDesc' | 'dateAsc' | 'dateDesc' | 'none';

// Helper function to format ISO datetime to readable time
const formatTimeFromISO = (isoString?: string): string => {
  if (!isoString) return '';
  
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return isoString; // Return original string if parsing fails
  }
};

export default function ManageSchools() {
  // Sample data with ISO format times
  const [schools] = useState<School[]>(
    Array.from({ length: 24 }, (_, i) => {
      // Create proper ISO format dates for start and end times
      const today = new Date();
      const startTime = new Date(today);
      startTime.setHours(9, 0, 0, 0);
      
      const endTime = new Date(today);
      endTime.setHours(15, 0, 0, 0);
      
      return {
        id: i + 1,
        school_name: "School Name " + (i + 1),
        address: `123 Education St, City ${i + 1}`,
        contact_number: `+1 555-${1000 + i}`,
        description: `Description for School ${i + 1}. This is a sample description.`,
        start_time: startTime.toISOString(), // Full ISO format
        end_time: endTime.toISOString(), // Full ISO format
        logo_url: i % 3 === 0 ? "/placeholder.svg" : undefined,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      };
    })
  )

  const [currentPage, setCurrentPage] = useState(1)
  const [sortOption, setSortOption] = useState<SortOption>('none')
  const [searchQuery, setSearchQuery] = useState('')

  const itemsPerPage = 10
  
  // Function to sort schools based on current sort option
  const getSortedSchools = () => {
    let sortedSchools = [...schools];
    
    // First apply search filter if there is a search query
    if (searchQuery) {
      sortedSchools = sortedSchools.filter(school => 
        school.school_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.contact_number?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Then apply sorting
    switch (sortOption) {
      case 'nameAsc':
        return sortedSchools.sort((a, b) => a.school_name.localeCompare(b.school_name));
      case 'nameDesc':
        return sortedSchools.sort((a, b) => b.school_name.localeCompare(a.school_name));
      case 'dateAsc':
        return sortedSchools.sort((a, b) => 
          (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0)
        );
      case 'dateDesc':
        return sortedSchools.sort((a, b) => 
          (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
        );
      default:
        return sortedSchools;
    }
  };

  const sortedSchools = getSortedSchools();
  const totalItems = sortedSchools.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current page data from sorted schools
  const currentSchools = sortedSchools.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

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
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
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
            {currentSchools.map((school) => (
              <TableRow key={school.id} className="hover:bg-gray-50">
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
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={totalItems}
      />
    </div>
  )
}

