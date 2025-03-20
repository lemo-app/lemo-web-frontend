'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { toast } from "sonner"
import { useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [tempPassword, setTempPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Simulate sending verification email
    toast.success("Verification email sent!")
    setStep(2)
  }

  const handlePasswordReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Simulate password reset
    toast.success("Password reset successful!")
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
              />
            </div>
            <Button type="submit" className="w-full">
              Reset Password
            </Button>
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-balance text-sm text-muted-foreground">
              Enter the temporary password sent to your email and your new password
            </p>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-2 relative">
              <Label htmlFor="temp-password">Temporary Password</Label>
              <Input
                id="temp-password"
                type={showPassword ? "text" : "password"}
                placeholder="Temporary Password"
                required
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
              />
              {/* <button
                type="button"
                className="absolute right-2 top-[30px]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button> */}
            </div>
            <div className="grid gap-2 relative">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-[30px]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            <Button type="submit" className="w-full">
              Confirm Password
            </Button>
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
