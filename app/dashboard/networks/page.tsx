"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SubmitBlockReqModal } from "@/components/dashboard/networks/submit-block-req-modal"
import { useQuery } from "@tanstack/react-query"
import { fetchCurrentUser, fetchBlockRequests } from "@/utils/client-api"
import { Loader2, Globe, User, Clock } from "lucide-react"
import { User as UserType } from "@/utils/interface/user.types"
import { BlockRequest } from "@/utils/interface/block-request.types"
import { Badge } from "@/components/ui/badge"

export default function NetworksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch current user
  const { 
    data: currentUser, 
    isLoading: isLoadingUser, 
  } = useQuery<UserType>({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch block requests for the school
  const { 
    data: blockRequests = [], 
    isLoading: isLoadingRequests 
  } = useQuery<BlockRequest[]>({
    queryKey: ['blockRequests', currentUser?.school?._id],
    queryFn: async () => {
      if (!currentUser?.school?._id) return [];
      const response = await fetchBlockRequests(`school=${currentUser.school._id}`);
      return response.data || [];
    },
    enabled: !!currentUser?.school?._id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Manage Networks</h1>
        <p className="text-muted-foreground">Configure and monitor network settings</p>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Network Blocking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center text-center p-8 space-y-4">
            <div className="rounded-full bg-blue-100 p-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Automated Site Blocking Coming Soon</h3>
            <p className="text-muted-foreground max-w-md">
              Our automated site blocking feature is currently under development. In the meantime, please submit a request for blocking specific sites.
            </p>
            {
              isLoadingUser ? (
                <div className="flex items-center justify-center h-16 gap-2">
                  <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
                  <p className="text-muted-foreground">Loading</p>
                </div>
              ) : (
                <Button onClick={() => setIsModalOpen(true)}>
                  Submit Block Request
                </Button>
              )
            }
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Blocking Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingRequests ? (
            <div className="flex items-center justify-center py-8 gap-2">
              <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
              <p className="text-muted-foreground">Loading requests...</p>
            </div>
          ) : blockRequests.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No recent requests found.</p>
          ) : (
            <div className="space-y-4">
              {blockRequests.map((request) => (
                <div key={request._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-1">
                      <h3 className="font-medium flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        {request.site_url}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Reason : {request.reason}
                      </p>
                    </div>
                    <Badge className={getStatusBadgeColor(request.status)} variant="outline">
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{request.user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(request.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <SubmitBlockReqModal 
        user={currentUser as UserType}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  )
}
