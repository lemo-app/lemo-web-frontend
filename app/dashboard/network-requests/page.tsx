"use client"

import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { BlockReqDetailsModal } from "@/components/dashboard/network-requests/block-req-details-modal"
import { BlockReqRejectionModal } from "@/components/dashboard/network-requests/block-req-rejection-modal"
import { PendingRequestsTab } from "@/components/dashboard/network-requests/pending-requests-tab"
import { ApprovedRequestsTab } from "@/components/dashboard/network-requests/approved-requests-tab"
import { RejectedRequestsTab } from "@/components/dashboard/network-requests/rejected-requests-tab"
import { BlockRequest } from "@/utils/interface/block-request.types"

// Demo data
const demoRequests = [
  {
    _id: "1",
    user: {
      _id: "user1",
      email: "teacher@school.com"
    },
    school: {
      _id: "school1",
      school_name: "International School"
    },
    site_url: "facebook.com",
    reason: "Social media distraction during class hours",
    status: "pending",
    createdAt: "2025-04-15T08:30:00.000Z",
    updatedAt: "2025-04-15T08:30:00.000Z"
  },
  {
    _id: "2",
    user: {
      _id: "user2",
      email: "admin@highschool.com"
    },
    school: {
      _id: "school2",
      school_name: "City High School"
    },
    site_url: "tiktok.com",
    reason: "Students accessing during study periods",
    status: "approved",
    createdAt: "2025-04-14T10:15:00.000Z",
    updatedAt: "2025-04-14T11:20:00.000Z"
  },
  {
    _id: "3",
    user: {
      _id: "user3",
      email: "principal@academy.com"
    },
    school: {
      _id: "school3",
      school_name: "STEM Academy"
    },
    site_url: "gaming.site.com",
    reason: "Gaming website affecting student focus",
    status: "rejected",
    rejectionReason: "Site contains educational gaming content",
    createdAt: "2025-04-13T09:45:00.000Z",
    updatedAt: "2025-04-13T14:30:00.000Z"
  }
] as BlockRequest[]

export default function NetworkApprovalPage(): React.ReactElement {
  const [selectedRequest, setSelectedRequest] = useState<BlockRequest | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false)
  const [rejectionReason, setRejectionReason] = useState<string>("")
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState<boolean>(false)

  const queryClient = useQueryClient()

  // Using demo data instead of API call
  const { data: requests = demoRequests, isLoading = false } = useQuery({
    queryKey: ['blockRequests'],
    queryFn: async () => {
      // Commented out actual API call
      // const response = await fetchBlockRequests()
      // return response.data
      return demoRequests
    },
    staleTime: 1000 * 60 * 5
  })

  // Mock mutation for demo
  const updateRequestMutation = useMutation({
    mutationFn: ({ requestId, status, reason }: { requestId: string; status: 'approved' | 'rejected'; reason?: string }) => {
      // Mock API call
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('Mock update:', { requestId, status, reason })
          resolve({ success: true })
        }, 1000)
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockRequests'] })
      toast.success(
        selectedRequest?.status === 'rejected' 
          ? `Site ${selectedRequest?.site_url} has been rejected` 
          : `Site ${selectedRequest?.site_url} has been approved for blocking`
      )
      setIsRejectionModalOpen(false)
      setRejectionReason("")
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
    if (!selectedRequest || !rejectionReason.trim()) return

    updateRequestMutation.mutate({ 
      requestId: selectedRequest._id, 
      status: 'rejected',
      reason: rejectionReason
    })
  }

  // Filter requests by status
  const pendingRequests = requests.filter(req => req.status === 'pending')
  const approvedRequests = requests.filter(req => req.status === 'approved')
  const rejectedRequests = requests.filter(req => req.status === 'rejected')

  return (
    <div>
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
            onViewDetails={(request) => {
              setSelectedRequest(request)
              setIsDetailsModalOpen(true)
            }}
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

      <BlockReqDetailsModal
        isOpen={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        request={selectedRequest}
      />

      <BlockReqRejectionModal
        isOpen={isRejectionModalOpen}
        onOpenChange={setIsRejectionModalOpen}
        request={selectedRequest}
        rejectionReason={rejectionReason}
        onReasonChange={setRejectionReason}
        onConfirm={handleReject}
      />
    </div>
  )
}

