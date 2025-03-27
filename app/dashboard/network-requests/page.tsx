"use client"

import React, { useState, ChangeEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Shield, Clock } from "lucide-react"

// Define interfaces for the different request types
interface BaseRequest {
  id: number;
  siteLink: string;
  reason: string;
  requestedBy: string;
  requestedAt: string;
}

// PendingRequest is kept as a separate type for semantic clarity
// and to enable future extension with pending-specific fields
type PendingRequest = BaseRequest;

interface ApprovedRequest extends BaseRequest {
  approvedAt: string;
}

interface RejectedRequest extends BaseRequest {
  rejectedAt: string;
  rejectionReason: string;
}

// Union type for all possible request states
type NetworkRequest = PendingRequest | ApprovedRequest | RejectedRequest;

// Mock data for demonstration
const mockPendingRequests: PendingRequest[] = [
  {
    id: 1,
    siteLink: "example.com",
    reason: "Contains malicious content and phishing attempts",
    requestedBy: "john.doe@company.com",
    requestedAt: "2025-03-25T10:30:00",
  },
  {
    id: 2,
    siteLink: "malware-site.net",
    reason: "Distributes malware and unauthorized software",
    requestedBy: "jane.smith@company.com",
    requestedAt: "2025-03-26T14:45:00",
  },
  {
    id: 3,
    siteLink: "inappropriate-content.org",
    reason: "Contains inappropriate content not suitable for work environment",
    requestedBy: "robert.johnson@company.com",
    requestedAt: "2025-03-27T09:15:00",
  },
]

const mockApprovedRequests: ApprovedRequest[] = [
  {
    id: 4,
    siteLink: "blocked-site.com",
    reason: "Known phishing site",
    requestedBy: "admin@company.com",
    requestedAt: "2025-03-20T11:20:00",
    approvedAt: "2025-03-21T09:30:00",
  },
  {
    id: 5,
    siteLink: "spam-domain.net",
    reason: "Spam distribution",
    requestedBy: "security@company.com",
    requestedAt: "2025-03-22T16:10:00",
    approvedAt: "2025-03-23T10:15:00",
  },
]

const mockRejectedRequests: RejectedRequest[] = [
  {
    id: 6,
    siteLink: "legitimate-business.com",
    reason: "Competitor site",
    requestedBy: "marketing@company.com",
    requestedAt: "2025-03-18T13:40:00",
    rejectedAt: "2025-03-19T14:25:00",
    rejectionReason: "Site is legitimate and does not violate policies",
  },
  {
    id: 7,
    siteLink: "news-portal.org",
    reason: "Distracting content",
    requestedBy: "team.lead@company.com",
    requestedAt: "2025-03-19T09:50:00",
    rejectedAt: "2025-03-20T11:05:00",
    rejectionReason: "News sites are allowed as per company policy",
  },
]

export default function NetworkApprovalPage(): React.ReactElement {
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>(mockPendingRequests);
  const [approvedRequests, setApprovedRequests] = useState<ApprovedRequest[]>(mockApprovedRequests);
  const [rejectedRequests, setRejectedRequests] = useState<RejectedRequest[]>(mockRejectedRequests);
  const [selectedRequest, setSelectedRequest] = useState<NetworkRequest | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState<boolean>(false);

  const handleApprove = (request: PendingRequest): void => {
    // Move request from pending to approved
    const updatedPending = pendingRequests.filter((req) => req.id !== request.id);
    const approvedRequest: ApprovedRequest = {
      ...request,
      approvedAt: new Date().toISOString(),
    };

    setPendingRequests(updatedPending);
    setApprovedRequests([approvedRequest, ...approvedRequests]);

    // In a real app, you would call an API to update the database
    alert(`Site ${request.siteLink} has been approved for blocking`);
  };

  const openRejectionModal = (request: PendingRequest): void => {
    setSelectedRequest(request);
    setRejectionReason("");
    setIsRejectionModalOpen(true);
  };

  const handleReject = (): void => {
    if (!selectedRequest) return;

    // Type guard to ensure we're working with a PendingRequest
    if (!('approvedAt' in selectedRequest && 'rejectedAt' in selectedRequest)) {
      // Move request from pending to rejected
      const updatedPending = pendingRequests.filter((req) => req.id !== selectedRequest.id);
      const rejectedRequest: RejectedRequest = {
        ...selectedRequest,
        rejectedAt: new Date().toISOString(),
        rejectionReason: rejectionReason,
      };

      setPendingRequests(updatedPending);
      setRejectedRequests([rejectedRequest, ...rejectedRequests]);
      setIsRejectionModalOpen(false);

      // In a real app, you would call an API to update the database
      alert(`Site ${selectedRequest.siteLink} has been rejected from blocking`);
    }
  };

  const viewRequestDetails = (request: NetworkRequest): void => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const handleRejectionReasonChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setRejectionReason(e.target.value);
  };

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
          <Card>
            <CardHeader>
              <CardTitle>Pending Approval Requests</CardTitle>
              <CardDescription>Review and approve or reject site blocking requests</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <div className="rounded-full bg-blue-100 p-4 mx-auto w-fit mb-4">
                    <Shield className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Pending Requests</h3>
                  <p className="text-muted-foreground">All site blocking requests have been processed.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{request.siteLink}</h3>
                          <p className="text-sm text-muted-foreground truncate max-w-md">{request.reason}</p>
                        </div>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Pending
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sm text-muted-foreground">
                          Requested by {request.requestedBy} on {formatDate(request.requestedAt)}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => viewRequestDetails(request)}>
                            Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => openRejectionModal(request)}
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleApprove(request)}
                          >
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Requests</CardTitle>
              <CardDescription>Sites that have been approved for blocking</CardDescription>
            </CardHeader>
            <CardContent>
              {approvedRequests.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No approved requests found.</p>
              ) : (
                <div className="space-y-4">
                  {approvedRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{request.siteLink}</h3>
                          <p className="text-sm text-muted-foreground truncate max-w-md">{request.reason}</p>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Approved
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        Approved on {formatDate(request.approvedAt)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Requests</CardTitle>
              <CardDescription>Sites that have been rejected from blocking</CardDescription>
            </CardHeader>
            <CardContent>
              {rejectedRequests.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No rejected requests found.</p>
              ) : (
                <div className="space-y-4">
                  {rejectedRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{request.siteLink}</h3>
                          <p className="text-sm text-muted-foreground truncate max-w-md">{request.reason}</p>
                        </div>
                        <Badge variant="destructive" className="bg-red-100 text-red-800 flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Rejected
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium">Rejection reason:</p>
                        <p className="text-sm text-muted-foreground">{request.rejectionReason}</p>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        Rejected on {formatDate(request.rejectedAt)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Request Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Site Link</h3>
                <p className="text-sm">{selectedRequest.siteLink}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Reason for Blocking</h3>
                <p className="text-sm">{selectedRequest.reason}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Requested By</h3>
                <p className="text-sm">{selectedRequest.requestedBy}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Requested At</h3>
                <p className="text-sm">{formatDate(selectedRequest.requestedAt)}</p>
              </div>
              {/* Show approval date if it exists */}
              {'approvedAt' in selectedRequest && (
                <div>
                  <h3 className="text-sm font-medium">Approved At</h3>
                  <p className="text-sm">{formatDate(selectedRequest.approvedAt)}</p>
                </div>
              )}
              {/* Show rejection details if they exist */}
              {'rejectedAt' in selectedRequest && (
                <>
                  <div>
                    <h3 className="text-sm font-medium">Rejected At</h3>
                    <p className="text-sm">{formatDate(selectedRequest.rejectedAt)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Rejection Reason</h3>
                    <p className="text-sm">{selectedRequest.rejectionReason}</p>
                  </div>
                </>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rejection Reason Modal */}
      <Dialog open={isRejectionModalOpen} onOpenChange={setIsRejectionModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>Please provide a reason for rejecting this blocking request.</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Site to reject</h3>
                <p className="text-sm">{selectedRequest.siteLink}</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="rejection-reason" className="text-sm font-medium">
                  Rejection Reason
                </label>
                <textarea
                  id="rejection-reason"
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  placeholder="Enter reason for rejection..."
                  value={rejectionReason}
                  onChange={handleRejectionReasonChange}
                />
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setIsRejectionModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason.trim()}>
                  Confirm Rejection
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

