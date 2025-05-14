"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { verifyEmail } from "@/utils/client-api"
import { toast } from "sonner"
import Image from "next/image"
import { AlertDialogDemo } from "@/components/auth/alert-dialog-verification"
import { useUserStore } from "@/utils/store/user-store"

const VerifyEmail = () => {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [emailMissing, setEmailMissing] = useState(false)
  const setUser = useUserStore((state) => state.setUser); // Get the setUser function from the store
  const setIsProfileCompleted = useUserStore((state) => state.setIsProfileCompleted); 
  
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
    setError(null)
    setIsSubmitting(true)

    if (newPassword !== newPasswordConfirm) {
      setError("Passwords do not match")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await verifyEmail(email as string, tempPassword, newPassword, newPasswordConfirm)
      toast.success("Email verified successfully!")
      // same way as login
      document.cookie = `token=${response.token}; path=/`; // Store token in cookies
      setUser(response); // Update the user store with the response data
      if(!response.full_name){
        setIsProfileCompleted(false);
      }

      // check student or not
      if(response.type == "student"){
        router.push("/student-verification");
      }else{
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify email")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <div className="bg-white p-2 md:p-8 rounded-lg shadow-md border border-gray-100">
        <div className="flex justify-start items-start w-full flex-col">
          <Image src={"https://lemobucket.s3.eu-west-2.amazonaws.com/6.png"} width={200} height={20} alt="logo" />
          <AlertDialogDemo />
        </div>
        {emailMissing ? (
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-lg font-medium">No email address found in the URL.</p>
            <p className="mt-3 text-gray-700">Please check the verification link or contact support.</p>
            <Button className="mt-6 py-2.5 px-5 text-base w-full" onClick={() => router.push("/login")}>
              Return to Login
            </Button>
          </div>
        ) : email ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-base font-medium mb-2 block">
                Email
              </Label>
              <Input id="email" type="email" value={email} readOnly className="h-12 text-base px-4" />
            </div>

            <div>
              <Label htmlFor="temp-password" className="text-base font-medium mb-2 block">
                Temporary Password
              </Label>
              <Input
                id="temp-password"
                type="password"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                required
                className="h-12 text-base px-4"
              />
            </div>

            <div>
              <Label htmlFor="new-password" className="text-base font-medium mb-2 block">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="h-12 text-base px-4 pr-12"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="new-password-confirm" className="text-base font-medium mb-2 block">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="new-password-confirm"
                  type={showPassword ? "text" : "password"}
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  required
                  className="h-12 text-base px-4 pr-12"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-base font-medium mt-4 from-blue-400 to-blue-500 bg-gradient-to-r text-white"
            >
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </Button>
          </form>
        ) : (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail