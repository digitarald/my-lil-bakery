"use client"

import { CartProvider, useCart } from "@/components/cart-context"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ShoppingCart, Search, Clock, CalendarIcon, Star, Heart, Filter } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { getProducts, searchProducts, createOrder } from "@/lib/database"
import type { Product } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"
import { CartSidebar } from "@/components/cart-sidebar"

/*
 * Presentational component – contains all UI logic
 * MUST be rendered inside <CartProvider>
 */
function HomePageContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isPreOrderOpen, setIsPreOrderOpen] = useState(false)
  const [preOrderDate, setPreOrderDate] = useState<Date>()
  const [preOrderTime, setPreOrderTime] = useState("")
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    instructions: "",
  })

  const { items, addItem, getTotalItems, getTotalPrice } = useCart()

  const categories = ["all", "Cakes", "Cupcakes", "Cookies", "Muffins", "Bars", "Pastries", "Pies"]
  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ]

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, searchQuery, selectedCategory, sortBy])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      console.error("Error loading products:", error)
      toast({
        title: "Error loading products",
        description: "Please try refreshing the page.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProducts = async () => {
    try {
      let filtered = products

      // Apply search filter
      if (searchQuery.trim()) {
        filtered = await searchProducts(searchQuery)
      }

      // Apply category filter
      if (selectedCategory !== "all") {
        filtered = filtered.filter((product) => product.category === selectedCategory)
      }

      // Apply sorting
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price
          case "price-high":
            return b.price - a.price
          case "name":
          default:
            return a.name.localeCompare(b.name)
        }
      })

      setFilteredProducts(filtered)
    } catch (error) {
      console.error("Error filtering products:", error)
      setFilteredProducts(products)
    }
  }

  const handleAddToCart = (product: Product) => {
    if (product.pre_order) {
      setSelectedProduct(product)
      setIsPreOrderOpen(true)
    } else {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      })
    }
  }

  const handlePreOrder = async () => {
    if (
      !selectedProduct ||
      !preOrderDate ||
      !preOrderTime ||
      !customerInfo.name ||
      !customerInfo.email ||
      !customerInfo.phone
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const orderData = {
        total_amount: selectedProduct.price,
        pickup_date: format(preOrderDate, "yyyy-MM-dd"),
        pickup_time: preOrderTime,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        special_instructions: customerInfo.instructions,
        items: [
          {
            product_id: selectedProduct.id,
            quantity: 1,
            price: selectedProduct.price,
          },
        ],
      }

      await createOrder(orderData)

      toast({
        title: "Pre-order placed successfully!",
        description: `Your ${selectedProduct.name} has been ordered for pickup on ${format(preOrderDate, "MMM dd, yyyy")} at ${preOrderTime}.`,
      })

      // Reset form
      setIsPreOrderOpen(false)
      setSelectedProduct(null)
      setPreOrderDate(undefined)
      setPreOrderTime("")
      setCustomerInfo({ name: "", email: "", phone: "", instructions: "" })
    } catch (error) {
      console.error("Error placing pre-order:", error)
      toast({
        title: "Error placing order",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const featuredProducts = products.slice(0, 3)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-cream-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading delicious treats...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-cream-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">🧁</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Sweet Dreams Bakery
                </h1>
                <p className="text-sm text-gray-600">Freshly baked with love</p>
              </div>
            </div>
            <Button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart ({getTotalItems()})
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-full px-6 py-2 mb-6">
            ✨ Fresh Daily • Made with Love • Local Ingredients
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Delicious Treats
            <br />
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Made Fresh Daily
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            From custom cakes to daily fresh pastries, we create sweet memories one bite at a time. Pre-order your
            favorites or grab something fresh from our daily selection.
          </p>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-full px-4 py-2 mb-4">
                🌟 Featured Today
              </Badge>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Today's Specials</h3>
              <p className="text-gray-600">Our most popular items, baked fresh this morning</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 rounded-2xl overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Button size="icon" variant="ghost" className="bg-white/80 hover:bg-white rounded-full">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    {product.pre_order && (
                      <Badge className="absolute top-4 left-4 bg-purple-500 text-white">
                        <Clock className="h-3 w-3 mr-1" />
                        Pre-order
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="bg-pink-100 text-pink-700 rounded-full">
                        {product.category}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">4.9</span>
                      </div>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full"
                      >
                        {product.pre_order ? "Pre-order" : "Add to Cart"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Product Catalog */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full px-4 py-2 mb-4">
              🛍️ Full Menu
            </Badge>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Our Complete Collection</h3>
            <p className="text-gray-600">Browse our full selection of cakes, pastries, and treats</p>
          </div>

          {/* Filters */}
          <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 rounded-2xl">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-200 focus:ring-pink-500 focus:border-pink-500 rounded-xl"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="border-gray-200 focus:ring-pink-500 focus:border-pink-500 rounded-xl">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="border-gray-200 focus:ring-pink-500 focus:border-pink-500 rounded-xl">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="price-low">Price (Low to High)</SelectItem>
                    <SelectItem value="price-high">Price (High to Low)</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-gray-600 flex items-center">
                  Showing {filteredProducts.length} products
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 rounded-2xl overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Button size="icon" variant="ghost" className="bg-white/80 hover:bg-white rounded-full h-8 w-8">
                      <Heart className="h-3 w-3" />
                    </Button>
                  </div>
                  {product.pre_order && (
                    <Badge className="absolute top-3 left-3 bg-purple-500 text-white text-xs">
                      <Clock className="h-2 w-2 mr-1" />
                      Pre-order
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="bg-pink-100 text-pink-700 rounded-full text-xs">
                      {product.category}
                    </Badge>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600 ml-1">4.9</span>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h4>
                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-800">${product.price.toFixed(2)}</span>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      size="sm"
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full"
                    >
                      {product.pre_order ? "Pre-order" : "Add"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Pre-order Dialog */}
      <Dialog open={isPreOrderOpen} onOpenChange={setIsPreOrderOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pre-order {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Pickup Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !preOrderDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {preOrderDate ? format(preOrderDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={preOrderDate}
                    onSelect={setPreOrderDate}
                    disabled={(date) =>
                      date < new Date() ||
                      date < new Date(Date.now() + (selectedProduct?.min_order_time || 2) * 60 * 60 * 1000)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Pickup Time</Label>
              <Select value={preOrderTime} onValueChange={setPreOrderTime}>
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
            <div>
              <Label>Your Name *</Label>
              <Input
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label>Phone *</Label>
              <Input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div>
              <Label>Special Instructions</Label>
              <Textarea
                value={customerInfo.instructions}
                onChange={(e) => setCustomerInfo({ ...customerInfo, instructions: e.target.value })}
                placeholder="Any special requests or dietary requirements?"
                rows={3}
              />
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-lg font-semibold">Total: ${selectedProduct?.price.toFixed(2)}</span>
              <Button
                onClick={handlePreOrder}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                Place Pre-order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/*
 * Page component exported to Next.js – wraps the above content
 * with the required CartProvider context.
 */
export default function HomePage() {
  return (
    <CartProvider>
      <HomePageContent />
    </CartProvider>
  )
}
