import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BlockRequest } from "@/utils/interface/block-request.types"
import { XCircle } from "lucide-react"

interface BlockReqRejectionModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  request: BlockRequest | null
  onConfirm: () => void
}

export function BlockReqRejectionModal({
  isOpen,
  onOpenChange,
  request,
  onConfirm,
}: BlockReqRejectionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            Confirm Rejection
          </DialogTitle>
          <DialogDescription className="text-sm">
            Are you sure you want to reject the block request for{" "}
            <span className="font-medium break-all">{request?.site_url}</span>?
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Confirm Rejection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}