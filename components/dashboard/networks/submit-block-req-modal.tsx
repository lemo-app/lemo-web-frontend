import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { sendBlockReq } from "@/utils/client-api"
import { User } from "@/utils/interface/user.types"
import { useQueryClient } from "@tanstack/react-query"

interface SubmitBlockReqModalProps {
  user: User
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function SubmitBlockReqModal({ user, isOpen, onOpenChange }: SubmitBlockReqModalProps) {
  const [siteLink, setSiteLink] = useState("")
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const handleSubmit = async () => {
    if (!siteLink || !reason) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      setIsSubmitting(true)
      await sendBlockReq(siteLink, reason, user._id, user.school._id)
      toast.success("Block request sent successfully")
      // Invalidate and refetch block requests
      queryClient.invalidateQueries({ queryKey: ['blockRequests', user.school._id] })
      // Reset form
      setSiteLink("")
      setReason("")
      // Close modal
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting block request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Add Sites to Blockage</DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="site-link" className="text-sm font-medium">
              Site link
            </label>
            <Input 
              id="site-link" 
              placeholder="Type link here..." 
              value={siteLink}
              onChange={(e) => setSiteLink(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="additional-reasons" className="text-sm font-medium">
              Additional Reasons
            </label>
            <Textarea 
              id="additional-reasons" 
              placeholder="Type reason here..." 
              className="min-h-[100px]"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="bg-gray-900 text-white hover:bg-gray-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}