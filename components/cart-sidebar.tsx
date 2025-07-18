"use client"

import type React from "react"

import { useState } from "react"
import { useCart } from "./cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, Trash2, Calendar, Clock, User, Mail, Phone } from "lucide-react"
import { createOrder } from "@/lib/database"
import { toast } from "@/hooks/use-toast"

type CartSidebarProps = {
  /** Optional controlled open state passed from a parent */
  isOpen?: boolean
  /** Callback fired when the sheet closes (helpful for parent state sync) */
  onClose?: () => void
}

export function CartSidebar({ isOpen: isOpenProp, onClose }: CartSidebarProps) {
  const {
    items,
    isOpen,
    toggleCart,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getTotalItems,
    getMinOrderTime,
  } = useCart()

  // Allow external control while falling back to context state
  const open = isOpenProp ?? isOpen

  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    pickupDate: "",
    pickupTime: "",
    specialInstructions: "",
  })

  // Ensure a valid positive number
  const rawMinOrderTime = getMinOrderTime()
  const minOrderTime = Number.isFinite(rawMinOrderTime) && rawMinOrderTime > 0 ? rawMinOrderTime : 2

  const minPickupDate = new Date()
  minPickupDate.setHours(minPickupDate.getHours() + minOrderTime)

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add some items to your cart before checking out.",
        variant: "destructive",
      })
      return
    }
    setIsCheckingOut(true)
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const orderData = {
        total_amount: getTotalPrice(),
        pickup_date: formData.pickupDate,
        pickup_time: formData.pickupTime,
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        special_instructions: formData.specialInstructions,
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      }

      await createOrder(orderData)

      toast({
        title: "Order placed successfully!",
        description: `Your order for $${getTotalPrice().toFixed(2)} has been placed. You'll receive a confirmation email shortly.`,
      })

      clearCart()
      closeCart()
      setIsCheckingOut(false)
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        pickupDate: "",
        pickupTime: "",
        specialInstructions: "",
      })
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Error placing order",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet
      open={open}
      /* keep both internal toggle behaviour and notify parent */
      onOpenChange={(value) => {
        toggleCart()
        if (!value) onClose?.()
      }}
    >
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative bg-transparent">
          <ShoppingCart className="h-4 w-4" />
          {getTotalItems() > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart ({getTotalItems()} items)
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {!isCheckingOut ? (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4">
                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                    <p className="text-sm text-gray-400 mt-2">Add some delicious treats to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-pink-600 font-semibold">${item.price.toFixed(2)}</p>
                          {item.preOrder && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              Pre-order ({item.minOrderTime}h notice)
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Summary */}
              {items.length > 0 && (
                <div className="border-t pt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-xl font-bold text-pink-600">${getTotalPrice().toFixed(2)}</span>
                  </div>

                  {minOrderTime > 2 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        <Clock className="inline h-4 w-4 mr-1" />
                        Minimum {minOrderTime} hours notice required for pre-order items
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    >
                      Proceed to Checkout
                    </Button>
                    <Button variant="outline" onClick={clearCart} className="w-full bg-transparent">
                      Clear Cart
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                  <h3 className="font-semibold text-pink-800 mb-2">Order Summary</h3>
                  <div className="space-y-1 text-sm">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>
                          {item.name} x{item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customerName" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerEmail" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerPhone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pickupDate" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Pickup Date
                      </Label>
                      <Input
                        id="pickupDate"
                        type="date"
                        value={formData.pickupDate}
                        onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                        min={minPickupDate.toISOString().split("T")[0]}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="pickupTime" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Pickup Time
                      </Label>
                      <Input
                        id="pickupTime"
                        type="time"
                        value={formData.pickupTime}
                        onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                    <Textarea
                      id="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                      placeholder="Any special requests or dietary requirements..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  {isSubmitting ? "Placing Order..." : `Place Order - $${getTotalPrice().toFixed(2)}`}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsCheckingOut(false)} className="w-full">
                  Back to Cart
                </Button>
              </div>
            </form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
