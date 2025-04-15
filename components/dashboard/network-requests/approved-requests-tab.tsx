import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import { BlockRequest } from "@/utils/interface/block-request.types"

interface ApprovedRequestsTabProps {
  requests: BlockRequest[]
  isLoading: boolean
}

export function ApprovedRequestsTab({ requests, isLoading }: ApprovedRequestsTabProps) {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approved Requests</CardTitle>
        <CardDescription>Sites that have been approved for blocking</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading requests...</div>
        ) : requests.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No approved requests found.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{request.site_url}</h3>
                    <p className="text-sm text-muted-foreground truncate max-w-md">{request.reason}</p>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Approved
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Approved on {formatDate(request.updatedAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}