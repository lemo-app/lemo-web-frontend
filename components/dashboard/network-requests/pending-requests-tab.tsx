import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Shield } from "lucide-react"
import { BlockRequest } from "@/utils/interface/block-request.types"

interface PendingRequestsTabProps {
  requests: BlockRequest[]
  isLoading: boolean
  onViewDetails: (request: BlockRequest) => void
  onReject: (request: BlockRequest) => void
  onApprove: (request: BlockRequest) => void
}

export function PendingRequestsTab({ 
  requests, 
  isLoading, 
  onViewDetails, 
  onReject, 
  onApprove 
}: PendingRequestsTabProps) {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Approval Requests</CardTitle>
        <CardDescription>Review and approve or reject site blocking requests</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8">
            <div className="rounded-full bg-blue-100 p-4 mx-auto w-fit mb-4">
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Pending Requests</h3>
            <p className="text-muted-foreground">All site blocking requests have been processed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{request.site_url}</h3>
                    <p className="text-sm text-muted-foreground truncate max-w-md">{request.reason}</p>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Pending
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-muted-foreground">
                    Requested by {request.user.email} ({request.school.school_name}) on {formatDate(request.createdAt)}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => onViewDetails(request)}>
                      Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => onReject(request)}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => onApprove(request)}
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
  )
}