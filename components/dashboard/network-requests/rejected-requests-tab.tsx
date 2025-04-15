import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { XCircle } from "lucide-react"
import { BlockRequest } from "@/utils/interface/block-request.types"

interface RejectedRequestsTabProps {
  requests: BlockRequest[]
  isLoading: boolean
}

export function RejectedRequestsTab({ requests, isLoading }: RejectedRequestsTabProps) {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rejected Requests</CardTitle>
        <CardDescription>Sites that have been rejected from blocking</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading requests...</div>
        ) : requests.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No rejected requests found.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{request.site_url}</h3>
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
                  Rejected on {formatDate(request.updatedAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}