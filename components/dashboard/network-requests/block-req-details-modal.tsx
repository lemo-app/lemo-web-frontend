import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BlockRequest } from "@/utils/interface/block-request.types"

interface BlockReqDetailsModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  request: BlockRequest | null
}

export function BlockReqDetailsModal({ isOpen, onOpenChange, request }: BlockReqDetailsModalProps) {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString()
  }

  if (!request) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">Site Link</h3>
            <p className="text-sm">{request.site_url}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Reason for Blocking</h3>
            <p className="text-sm">{request.reason}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Requested By</h3>
            <p className="text-sm">{request.user.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">School</h3>
            <p className="text-sm">{request.school.school_name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Requested At</h3>
            <p className="text-sm">{formatDate(request.createdAt)}</p>
          </div>
          {request.status === 'approved' && (
            <div>
              <h3 className="text-sm font-medium">Approved At</h3>
              <p className="text-sm">{formatDate(request.updatedAt)}</p>
            </div>
          )}
          {request.status === 'rejected' && (
            <>
              <div>
                <h3 className="text-sm font-medium">Rejected At</h3>
                <p className="text-sm">{formatDate(request.updatedAt)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Rejection Reason</h3>
                <p className="text-sm">{request.rejectionReason}</p>
              </div>
            </>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}