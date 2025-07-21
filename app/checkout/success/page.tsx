"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Home, ShoppingBag, Calendar } from "lucide-react"
import { useCart } from "@/components/cart-context"

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart()

  useEffect(() => {
    // Clear the cart when the success page is loaded
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-cream-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Order Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-gray-600">
              Thank you for your order! We&apos;ll send you an email confirmation shortly.
            </p>
            <p className="text-sm text-gray-500">
              Order reference: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>

          <div className="bg-pink-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-pink-600" />
              What&apos;s Next?
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-pink-600 mt-0.5">•</span>
                <span>We&apos;ll contact you to confirm your pickup details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600 mt-0.5">•</span>
                <span>You&apos;ll receive updates about your order status</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600 mt-0.5">•</span>
                <span>Pick up your order at the scheduled time</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/#products">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Need help? Contact us at{" "}
              <a href="mailto:hello@sweetdreamsbakery.com" className="text-pink-600 hover:underline">
                hello@sweetdreamsbakery.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}