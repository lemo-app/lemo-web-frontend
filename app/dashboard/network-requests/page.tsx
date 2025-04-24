"use client"

import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { BlockReqRejectionModal } from "@/components/dashboard/network-requests/block-req-rejection-modal"
import { PendingRequestsTab } from "@/components/dashboard/network-requests/pending-requests-tab"
import { ApprovedRequestsTab } from "@/components/dashboard/network-requests/approved-requests-tab"
import { RejectedRequestsTab } from "@/components/dashboard/network-requests/rejected-requests-tab"
import { BlockRequest } from "@/utils/interface/block-request.types"
import { fetchBlockRequests, updateBlockRequest } from "@/utils/client-api"

export default function NetworkApprovalPage(): React.ReactElement {
  const [selectedRequest, setSelectedRequest] = useState<BlockRequest | null>(null)
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState<boolean>(false)
  // Add filter states
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage] = useState<number>(10)
  const [sortBy, setSortBy] = useState<string>('created_date')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [schoolFilter, setSchoolFilter] = useState<string>('')

  const queryClient = useQueryClient()

  // Build query parameters
  const buildQueryParams = () => {
    const params = new URLSearchParams()
    
    // Add pagination
    params.append('page', currentPage.toString())
    params.append('limit', itemsPerPage.toString())
    
    // Add sorting
    if (sortBy) {
      params.append('sortBy', sortBy)
      params.append('order', order)
    }
    
    // Add school filter if selected
    if (schoolFilter) {
      params.append('school', schoolFilter)
    }
    
    return params.toString()
  }

  // Using real API endpoint with filters
  const { data: requests = [], isLoading = false } = useQuery({
    queryKey: ['blockRequests', currentPage, itemsPerPage, sortBy, order, schoolFilter],
    queryFn: async () => {
      const response = await fetchBlockRequests(buildQueryParams())
      return response.data || []
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  const updateRequestMutation = useMutation({
    mutationFn: ({ requestId, status }: { requestId: string; status: 'approved' | 'rejected' }) => {
      return updateBlockRequest(requestId, status)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockRequests'] })
      toast.success(
        selectedRequest?.status === 'rejected' 
          ? `Site ${selectedRequest?.site_url} has been rejected` 
          : `Site ${selectedRequest?.site_url} has been approved for blocking`
      )
      setIsRejectionModalOpen(false)
      setSelectedRequest(null)
    },
    onError: (error) => {
      console.error('Error updating request:', error)
      toast.error('Failed to update request')
    }
  })

  const handleApprove = async (request: BlockRequest) => {
    setSelectedRequest(request)
    updateRequestMutation.mutate({ 
      requestId: request._id, 
      status: 'approved' 
    })
  }

  const handleReject = async () => {
    if (!selectedRequest) return

    updateRequestMutation.mutate({ 
      requestId: selectedRequest._id, 
      status: 'rejected'
    })
  }

  // Filter requests by status
  const pendingRequests = requests.filter(req => req.status === 'pending')
  const approvedRequests = requests.filter(req => req.status === 'approved')
  const rejectedRequests = requests.filter(req => req.status === 'rejected')

  return (
    <div className=""> 
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Network Blocking Approval</h1>
        <p className="text-muted-foreground">Review and manage network blocking requests</p>
      </div>
      
      <Tabs defaultValue="pending" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending{" "}
            <Badge variant="secondary" className="ml-1">
              {pendingRequests.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Approved{" "}
            <Badge variant="secondary" className="ml-1">
              {approvedRequests.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Rejected{" "}
            <Badge variant="secondary" className="ml-1">
              {rejectedRequests.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <PendingRequestsTab
            requests={pendingRequests}
            isLoading={isLoading}
            onReject={(request) => {
              setSelectedRequest(request)
              setIsRejectionModalOpen(true)
            }}
            onApprove={handleApprove}
          />
        </TabsContent>

        <TabsContent value="approved">
          <ApprovedRequestsTab
            requests={approvedRequests}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="rejected">
          <RejectedRequestsTab
            requests={rejectedRequests}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>


      <BlockReqRejectionModal
        isOpen={isRejectionModalOpen}
        onOpenChange={setIsRejectionModalOpen}
        request={selectedRequest}
        onConfirm={handleReject}
      />
    </div>
  )
}

