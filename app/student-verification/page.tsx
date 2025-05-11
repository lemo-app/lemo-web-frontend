import React from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Link from 'next/link'

const VerificationSuccessPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-6 animate-fade-in">
        <div className="flex justify-center">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Account Verified Successfully!
        </h1>
        
        <p className="text-gray-600">
          Your LEMO account has been successfully verified. You can now access all features of the platform.
        </p>

        <Link href="/login">
          <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
            Log in to LEMO
          </Button>
        </Link>
      </Card>
    </div>
  )
}

export default VerificationSuccessPage