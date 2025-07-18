"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCart } from "./cart-context"
import { X, Plus, Minus, Calendar, Clock, CreditCard, ShoppingBag } from "lucide-react"

interface CheckoutFormData {
  customerInfo: {
    name: string
    email: string
    phone: string
  }
  pickupDetails: {
    date: string
    time: string
    specialInstructions: string
  }
}

export function CartSidebar() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotalPrice, getMinOrderTime, clearCart } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)
  const [formData, setFormData] = useState<CheckoutFormData>({
    customerInfo: {
      name: "",
      email: "",
      phone: "",
    },
    pickupDetails: {
      date: "",
      time: "",
      specialInstructions: "",
    },
  })

  const getMinDate = () => {
    const minHours = getMinOrderTime()
    const minDate = new Date()
    minDate.setHours(minDate.getHours() + minHours)
    return minDate.toISOString().split("T")[0]
  }

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle checkout logic here
    console.log("Checkout:", { items, formData, total: getTotalPrice() })
    alert("Order placed successfully! 🎉")
    clearCart()
    setShowCheckout(false)
    closeCart()
  }

  const isFormValid = () => {
    return (
      formData.customerInfo.name &&
      formData.customerInfo.email &&
      formData.customerInfo.phone &&
      formData.pickupDetails.date &&
      formData.pickupDetails.time
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg bg-gradient-to-br from-pink-50 to-purple-50 border-l-pink-200">
        <SheetHeader className="pb-4 border-b border-pink-200">
          <SheetTitle className="flex items-center text-2xl font-bold text-gray-800">
            <ShoppingBag className="h-6 w-6 mr-2 text-pink-600" />
            Your Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {!showCheckout ? (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4" data-testid="cart-items">
                {items.length === 0 ? (
                  <div className="text-center py-16" data-testid="empty-cart">
                    <div className="text-6xl mb-4">🛒</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
                    <p className="text-gray-600">Add some delicious treats to get started!</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <Card
                      key={item.id}
                      className="bg-white/80 backdrop-blur-sm border-0 rounded-xl"
                      data-testid={`cart-item-${item.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800">{item.name}</h4>
                            <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                            {item.preOrder && (
                              <Badge className="bg-pink-100 text-pink-700 text-xs mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {item.minOrderTime}h notice
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 rounded-full"
                              data-testid={`decrease-${item.id}`}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium" data-testid={`quantity-${item.id}`}>
                              {item.quantity}
                            </span>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 rounded-full"
                              data-testid={`increase-${item.id}`}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8 text-red-600 hover:bg-red-50"
                            data-testid={`remove-${item.id}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Cart Summary */}
              {items.length > 0 && (
                <div className="border-t border-pink-200 pt-4 space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-yellow-600 mr-2" />
                      <span className="text-sm text-yellow-800">
                        Minimum {getMinOrderTime()} hours advance notice required
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-pink-600" data-testid="cart-total">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>

                  <Button
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl py-3"
                    data-testid="checkout-button"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Checkout
                  </Button>
                </div>
              )}
            </>
          ) : (
            /* Checkout Form */
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">Checkout</h3>
                  <Button
                    variant="ghost"
                    onClick={() => setShowCheckout(false)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    ← Back to Cart
                  </Button>
                </div>

                <form onSubmit={handleCheckout} className="space-y-6" data-testid="checkout-form">
                  {/* Customer Information */}
                  <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-xl">
                    <CardHeader>
                      <CardTitle className="text-lg">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.customerInfo.name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              customerInfo: { ...formData.customerInfo, name: e.target.value },
                            })
                          }
                          className="border-gray-200 focus:ring-pink-500 focus:border-pink-500 rounded-xl"
                          required
                          data-testid="customer-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.customerInfo.email}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              customerInfo: { ...formData.customerInfo, email: e.target.value },
                            })
                          }
                          className="border-gray-200 focus:ring-pink-500 focus:border-pink-500 rounded-xl"
                          required
                          data-testid="customer-email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.customerInfo.phone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              customerInfo: { ...formData.customerInfo, phone: e.target.value },
                            })
                          }
                          className="border-gray-200 focus:ring-pink-500 focus:border-pink-500 rounded-xl"
                          required
                          data-testid="customer-phone"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pickup Details */}
                  <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Calendar className="h-5 w-5 mr-2 text-pink-600" />
                        Pickup Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="date">Pickup Date</Label>
                          <Input
                            id="date"
                            type="date"
                            min={getMinDate()}
                            value={formData.pickupDetails.date}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pickupDetails: { ...formData.pickupDetails, date: e.target.value },
                              })
                            }
                            className="border-gray-200 focus:ring-pink-500 focus:border-pink-500 rounded-xl"
                            required
                            data-testid="pickup-date"
                          />
                        </div>
                        <div>
                          <Label htmlFor="time">Pickup Time</Label>
                          <Select
                            value={formData.pickupDetails.time}
                            onValueChange={(value) =>
                              setFormData({
                                ...formData,
                                pickupDetails: { ...formData.pickupDetails, time: value },
                              })
                            }
                          >
                            <SelectTrigger className="border-gray-200 focus:ring-pink-500 focus:border-pink-500 rounded-xl">
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="09:00">9:00 AM</SelectItem>
                              <SelectItem value="10:00">10:00 AM</SelectItem>
                              <SelectItem value="11:00">11:00 AM</SelectItem>
                              <SelectItem value="12:00">12:00 PM</SelectItem>
                              <SelectItem value="13:00">1:00 PM</SelectItem>
                              <SelectItem value="14:00">2:00 PM</SelectItem>
                              <SelectItem value="15:00">3:00 PM</SelectItem>
                              <SelectItem value="16:00">4:00 PM</SelectItem>
                              <SelectItem value="17:00">5:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="instructions">Special Instructions</Label>
                        <Textarea
                          id="instructions"
                          placeholder="Any special requests, decorations, or dietary requirements..."
                          value={formData.pickupDetails.specialInstructions}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              pickupDetails: { ...formData.pickupDetails, specialInstructions: e.target.value },
                            })
                          }
                          className="border-gray-200 focus:ring-pink-500 focus:border-pink-500 rounded-xl"
                          data-testid="special-instructions"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Order Summary */}
                  <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-xl">
                    <CardHeader>
                      <CardTitle className="text-lg">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>
                              {item.name} x{item.quantity}
                            </span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 flex justify-between font-bold">
                          <span>Total:</span>
                          <span className="text-pink-600">${getTotalPrice().toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    type="submit"
                    disabled={!isFormValid()}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl py-3 disabled:opacity-50"
                    data-testid="place-order-button"
                  >
                    Place Order (${getTotalPrice().toFixed(2)})
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
