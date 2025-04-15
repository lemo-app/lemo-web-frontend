"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SubmitBlockReqModal } from "@/components/dashboard/networks/submit-block-req-modal"
import { useQuery } from "@tanstack/react-query"
import { fetchCurrentUser } from "@/utils/client-api"
import { Loader2 } from "lucide-react"
import { User } from "@/utils/interface/user.types"

export default function NetworksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { 
    data: currentUser, 
    isLoading: isLoadingUser, 
  } = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5, // 15 minutes
  });

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
            {
              isLoadingUser ? (
                <div className="flex items-center justify-center h-16 gap-2">
                  <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
                  <p className="text-muted-foreground">Loading</p>
                </div>
              ) : (
                <Button onClick={() => setIsModalOpen(true)}>
                  Submit Block Request
                </Button>
              )
            }
            {/* <Button onClick={() => setIsModalOpen(true)}>
              Submit Blocking Request
            </Button> */}
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
      
      <SubmitBlockReqModal 
        user={currentUser as User}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  )
}
