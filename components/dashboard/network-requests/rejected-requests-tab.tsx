import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { XCircle, User, Building2, Globe, Clock } from "lucide-react"
import { BlockRequest } from "@/utils/interface/block-request.types"

interface RejectedRequestsTabProps {
  requests: BlockRequest[]
  isLoading: boolean
}

export function RejectedRequestsTab({ requests, isLoading }: RejectedRequestsTabProps) {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1">
                    <h3 className="font-medium flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <a 
                        href={request.site_url.startsWith('http') ? request.site_url : `https://${request.site_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {request.site_url}
                      </a>
                    </h3>
                    <p className="text-sm text-muted-foreground truncate max-w-md">
                      Reason: {request.reason}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-red-100 text-red-800 flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    Rejected
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span>{request.school.school_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{request.user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>Rejected on {formatDate(request.updatedAt)}</span>
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