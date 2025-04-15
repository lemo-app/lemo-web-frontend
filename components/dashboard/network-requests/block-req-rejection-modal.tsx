import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { BlockRequest } from "@/utils/interface/block-request.types"

interface BlockReqRejectionModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  request: BlockRequest | null
  rejectionReason: string
  onReasonChange: (reason: string) => void
  onConfirm: () => void
}

export function BlockReqRejectionModal({ 
  isOpen, 
  onOpenChange, 
  request, 
  rejectionReason,
  onReasonChange,
  onConfirm 
}: BlockReqRejectionModalProps) {
  if (!request) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reject Request</DialogTitle>
          <DialogDescription>Please provide a reason for rejecting this blocking request.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">Site to reject</h3>
            <p className="text-sm">{request.site_url}</p>
          </div>
          <div className="space-y-2">
            <label htmlFor="rejection-reason" className="text-sm font-medium">
              Rejection Reason
            </label>
            <Textarea
              id="rejection-reason"
              className="min-h-[100px]"
              placeholder="Enter reason for rejection..."
              value={rejectionReason}
              onChange={(e) => onReasonChange(e.target.value)}
            />
          </div>
          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm} disabled={!rejectionReason.trim()}>
              Confirm Rejection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}