"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems: number
}

export function Pagination({ currentPage, totalPages, onPageChange, totalItems }: PaginationProps) {
  const startItem = (currentPage - 1) * 10 + 1
  const endItem = Math.min(currentPage * 10, totalItems)

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  // Show only a window of pages
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages

    if (currentPage <= 3) return pages.slice(0, 5)
    if (currentPage >= totalPages - 2) return pages.slice(totalPages - 5)

    return pages.slice(currentPage - 3, currentPage + 2)
  }

  return (
    <div className="flex items-center justify-between mt-4 text-sm" >
      <div className="text-muted-foreground">
        Showing {startItem}-{endItem} from {totalItems}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getVisiblePages().map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

