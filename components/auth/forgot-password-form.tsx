'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { CheckCheck, EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
import { requestForgotPassword, resetPassword } from "@/utils/client-api"
import { useRouter, useSearchParams } from 'next/navigation'

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resetToken, setResetToken] = useState("")
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      setResetToken(token)
      setStep(2)
    }
  }, [searchParams])

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await requestForgotPassword(email)
      if (response.token) {
        setResetToken(response.token)
        toast.success("Please provide the new password")
        setStep(2)
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
        const errorResponse = error.response as { data?: { message?: string } }
        toast.error(errorResponse.data?.message || "Failed to send reset instructions")
      } else {
        toast.error("Failed to send reset instructions")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    setStep(1)
  }

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await resetPassword(resetToken, newPassword)
      toast.success("Password reset successful!")
      // Redirect to login page after successful reset
       // check student or not 
       if(response.type == "student"){
        router.push("/student-verification");
      }else{
        router.push("/login");
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
        const errorResponse = error.response as { data?: { message?: string } }
        toast.error(errorResponse.data?.message || "Failed to reset password")
      } else {
        toast.error("Failed to reset password")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={step === 1 ? handleEmailSubmit : handlePasswordReset}
    >
      {step === 1 && (
        <>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Forgot Password</h1>
            <p className="text-balance text-sm text-muted-foreground">
              Enter your email below to reset your password
            </p>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Reset Password"}
            </Button>
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-balance text-sm text-muted-foreground">
              Enter your new password below
            </p>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-2 relative">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-2 top-[30px]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleRetry}
              >
                Try Again
              </Button>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Confirm Password"}
                {isLoading ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <CheckCheck className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </div>
        </>
      )}
      <div className="text-center text-sm">
        Remember your password?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  )
}
