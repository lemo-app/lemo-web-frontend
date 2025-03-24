'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { verifyEmail } from "@/utils/client-api"
import { toast } from "sonner"

const VerifyEmail = () => {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [emailMissing, setEmailMissing] = useState(false)

  useEffect(() => {
    // Extract email from URL query parameters
    const params = new URLSearchParams(window.location.search)
    const emailParam = params.get("email")
    
    if (emailParam) {
      setEmail(emailParam)
      setEmailMissing(false)
    } else {
      setEmailMissing(true)
      toast.error("No email provided in the link.")
    }
  }, [])

  const [tempPassword, setTempPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== newPasswordConfirm) {
      setError("Passwords do not match")
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      await verifyEmail(email as string, tempPassword, newPassword, newPasswordConfirm)
      toast.success("Email verified successfully! Please log in.")
      router.push("/login")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify email")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-md py-8">
      <h1 className="text-2xl font-bold mb-4">Verify Email</h1>
      
      {emailMissing ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">No email address found in the URL.</p>
          <p className="mt-2">Please check the verification link or contact support.</p>
          <Button 
            className="mt-4" 
            onClick={() => router.push("/login")}
          >
            Return to Login
          </Button>
        </div>
      ) : email ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} readOnly />
          </div>
          <div className="mb-4">
            <Label htmlFor="temp-password">Temporary Password</Label>
            <Input
              id="temp-password"
              type="password"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 relative">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="mb-4 relative">
            <Label htmlFor="new-password-confirm">Confirm New Password</Label>
            <Input
              id="new-password-confirm"
              type={showPassword ? "text" : "password"}
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Verifying..." : "Verify Email"}
          </Button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default VerifyEmail