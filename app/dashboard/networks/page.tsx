"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"

export default function NetworksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [siteLink, setSiteLink] = useState("")
  const [reason, setReason] = useState("")

  const handleSubmit = () => {
    // Handle form submission
    console.log("Submitted:", { siteLink, reason })
    // Reset form
    setSiteLink("")
    setReason("")
    // Close modal
    setIsModalOpen(false)
    // Show success message (in a real app, you'd use a toast or notification)
    alert("Request submitted successfully!")
  }

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
            <Button onClick={() => setIsModalOpen(true)}>
              Submit Blocking Request
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Blocking Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No recent requests found.</p>
        </CardContent>
      </Card>

      {/* Site Blocking Request Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-gray-900 text-white hover:bg-gray-800">
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
