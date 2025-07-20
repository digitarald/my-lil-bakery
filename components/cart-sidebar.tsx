"use client"

import { useState } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/components/cart-context"
import { createOrder } from "@/lib/database"
import { toast } from "sonner"
import { ShoppingCart, Plus, Minus, Trash2, CalendarIcon, Clock, User, Mail, Phone, MessageSquare } from "lucide-react"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { checkoutSchema, type CheckoutInput } from "@/lib/validations"

interface CartSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function CartSidebar({ isOpen = false, onClose }: CartSidebarProps) {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal, getMinOrderTime } = useCart()
  const { data: session } = useSession()
  const router = useRouter()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [pickupDate, setPickupDate] = useState<Date>()
  const [pickupTime, setPickupTime] = useState("")
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    specialInstructions: "",
  })

  const minOrderTime = getMinOrderTime()
  const minPickupDate = new Date()
  if (minOrderTime > 0) {
    minPickupDate.setHours(minPickupDate.getHours() + minOrderTime)
  }

  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
  ]

  const handleCheckout = async () => {
    // Enhanced validation
    const errors: string[] = []

    if (!customerInfo.name.trim()) {
      errors.push("Name is required")
    } else if (customerInfo.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters")
    }

    if (!customerInfo.email.trim()) {
      errors.push("Email is required")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      errors.push("Please enter a valid email address")
    }

    if (!customerInfo.phone.trim()) {
      errors.push("Phone number is required")
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(customerInfo.phone.replace(/\s/g, ""))) {
      errors.push("Please enter a valid phone number")
    }

    if (!pickupDate) {
      errors.push("Pickup date is required")
    } else {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const selectedDate = new Date(pickupDate)
      selectedDate.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        errors.push("Pickup date cannot be in the past")
      }
      
      if (minOrderTime > 0) {
        const minDate = new Date()
        minDate.setHours(minDate.getHours() + minOrderTime)
        if (pickupDate < minDate) {
          errors.push(`Pickup date must be at least ${minOrderTime} hours from now`)
        }
      }
    }

    if (!pickupTime) {
      errors.push("Pickup time is required")
    }

    if (customerInfo.specialInstructions && customerInfo.specialInstructions.length > 500) {
      errors.push("Special instructions must be less than 500 characters")
    }

    if (errors.length > 0) {
      toast.error(errors[0]) // Show first error
      return
    }

    setIsCheckingOut(true)
    try {
      const orderData = {
        userId: (session?.user as any)?.id || null,
        customerName: customerInfo.name.trim(),
        customerEmail: customerInfo.email.trim().toLowerCase(),
        customerPhone: customerInfo.phone.trim(),
        pickupDate: pickupDate!,  // We know it's defined due to validation above
        pickupTime: pickupTime,
        ...(customerInfo.specialInstructions?.trim() && {
          specialInstructions: customerInfo.specialInstructions.trim()
        }),
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      }

      await createOrder(orderData)

      toast.success("Order Placed Successfully!")
      
      onClose?.()
      router.push("/checkout/success")
    } catch (error) {
      console.error("Error creating order:", error)
      toast.error("There was an error placing your order. Please try again.")
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose || (() => {})}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart ({cartItems.length})
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12" data-testid="empty-cart">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
              <p className="text-sm text-gray-400">Add some delicious treats to get started!</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="p-4" data-testid={`cart-item-${item.id}`}>
                    <div className="flex gap-4">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{item.name}</h3>
                        <p className="text-pink-600 font-bold">${item.price} each</p>
                        {(item as any).preOrder && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            Pre-order
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="h-6 w-6 text-red-500 hover:text-red-700"
                          data-testid={`remove-${item.id}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-6 w-6"
                            data-testid={`decrease-${item.id}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm" data-testid={`quantity-${item.id}`}>{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6"
                            data-testid={`increase-${item.id}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Separator />

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-pink-600" data-testid="cart-total">${getCartTotal().toFixed(2)}</span>
                </div>
                {minOrderTime > 0 && (
                  <p className="text-sm text-orange-600 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Minimum {minOrderTime} hours advance notice required
                  </p>
                )}
              </div>

              {!showCheckout ? (
                <div className="space-y-2">
                  <Button
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    data-testid="checkout-button"
                  >
                    Proceed to Checkout
                  </Button>
                  <Button variant="outline" onClick={clearCart} className="w-full bg-transparent">
                    Clear Cart
                  </Button>
                </div>
              ) : (
                /* Checkout Form */
                <Card className="p-4" data-testid="checkout-form">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-lg">Checkout Details</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 space-y-4">
                    {/* Customer Information */}
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="name" className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          Phone *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                    </div>

                    {/* Pickup Date & Time */}
                    <div className="space-y-3">
                      <div>
                        <Label className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          Pickup Date *
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal bg-transparent"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {pickupDate ? format(pickupDate, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={pickupDate}
                              onSelect={setPickupDate}
                              disabled={(date) => {
                                const today = new Date()
                                today.setHours(0, 0, 0, 0)
                                const minDate = new Date(minPickupDate)
                                minDate.setHours(0, 0, 0, 0)
                                return date < new Date(Math.max(today.getTime(), minDate.getTime()))
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Pickup Time *
                        </Label>
                        <Select value={pickupTime} onValueChange={setPickupTime}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Special Instructions */}
                    <div>
                      <Label htmlFor="instructions" className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        Special Instructions
                      </Label>
                      <Textarea
                        id="instructions"
                        value={customerInfo.specialInstructions}
                        onChange={(e) => setCustomerInfo((prev) => ({ ...prev, specialInstructions: e.target.value }))}
                        placeholder="Any special requests or dietary requirements..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2 pt-4">
                      <Button
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      >
                        {isCheckingOut ? "Placing Order..." : `Place Order - $${getCartTotal().toFixed(2)}`}
                      </Button>
                      <Button variant="outline" onClick={() => setShowCheckout(false)} className="w-full">
                        Back to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
