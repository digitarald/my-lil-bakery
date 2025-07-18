"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Mail, ArrowLeft, Loader2 } from "lucide-react"
import { resetPassword } from "@/lib/auth"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    setIsLoading(true)
    try {
      await resetPassword(email)
      setIsSubmitted(true)
      toast({
        title: "Reset link sent!",
        description: "Please check your email for password reset instructions.",
      })
    } catch (error) {
      console.error("Password reset error:", error)
      toast({
        title: "Failed to send reset email",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-cream-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">🧁</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Sweet Dreams Bakery
              </span>
            </Link>

            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 rounded-full px-4 py-2 mb-4">
              ✅ Email Sent
            </Badge>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Check Your Email</h1>
            <p className="text-gray-600">We&apos;ve sent password reset instructions to {email}</p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardContent className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Password reset email sent!</h3>
              <p className="text-gray-600 mb-6">
                Please check your email and click the link to reset your password.
              </p>
              <div className="space-y-3">
                <Link href="/auth/signin">
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl py-3">
                    Back to Sign In
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setIsSubmitted(false)}
                  className="w-full border-gray-200 hover:bg-gray-50 rounded-xl py-3"
                >
                  Send to different email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-cream-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">🧁</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Sweet Dreams Bakery
            </span>
          </Link>

          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full px-4 py-2 mb-4">
            🔑 Reset Password
          </Badge>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password</h1>
          <p className="text-gray-600">Enter your email to receive reset instructions</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-bold text-gray-800">Reset your password</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-gray-200 focus:ring-pink-500 focus:border-pink-500 rounded-xl py-3"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl py-3 text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>

            <div className="text-center">
              <Link
                href="/auth/signin"
                className="inline-flex items-center text-sm text-pink-600 hover:text-pink-500 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Remember your password?{" "}
            <Link href="/auth/signin" className="text-pink-600 hover:text-pink-500">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}