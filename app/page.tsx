"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Search, Filter, Star, Clock, MapPin, Phone, Mail, Heart, Award, Users, Cake } from "lucide-react"
import { useCart } from "@/components/cart-context"
import { CartSidebar } from "@/components/cart-sidebar"
import { getProducts, type Product } from "@/lib/database"
import AuthButton from "@/components/auth-button"

export default function HomePage() {
  const { addToCart, cartItems, toggleCart, isCartOpen } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [loading, setLoading] = useState(true)

  // Load products from database
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await getProducts()
        setProducts(productsData)
        setFilteredProducts(productsData)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Filter and sort products
  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Sort products
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
  }, [products, searchTerm, selectedCategory, sortBy])

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))]
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const featuredProducts = products.filter((p) => p.category === "cakes").slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-cream-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🧁</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Sweet Dreams Bakery
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-pink-600 transition-colors">
                Home
              </Link>
              <Link href="#products" className="text-gray-700 hover:text-pink-600 transition-colors">
                Products
              </Link>
              <Link href="#about" className="text-gray-700 hover:text-pink-600 transition-colors">
                About
              </Link>
              <Link href="#contact" className="text-gray-700 hover:text-pink-600 transition-colors">
                Contact
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-pink-600 transition-colors">
                Admin
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <AuthButton />
              <Button
                onClick={toggleCart}
                variant="outline"
                size="icon"
                className="relative border-pink-200 hover:bg-pink-50 bg-transparent"
              >
                <ShoppingCart className="h-4 w-4" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-pink-500 text-white text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-200 rounded-full px-4 py-2 mb-6">
            ✨ Handcrafted with Love
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
            Sweet Dreams
            <span className="block bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Come True
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Handcrafted baked goods made fresh daily. Pre-order your favorites and make every moment sweeter!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg px-8 py-3"
            >
              <a href="#products">Order Now</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-pink-200 hover:bg-pink-50 text-lg px-8 py-3 bg-transparent"
            >
              <a href="#about">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-full px-4 py-2 mb-4">
              🌟 Featured
            </Badge>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Signature Creations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most beloved treats, crafted with premium ingredients and lots of love.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Card
                    key={i}
                    className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
                  >
                    <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))
              : featuredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.pre_order && (
                        <Badge className="absolute top-3 left-3 bg-purple-500 text-white">Pre-Order</Badge>
                      )}
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-pink-600">${product.price}</span>
                        <Button
                          onClick={() => addToCart(product)}
                          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full px-4 py-2 mb-4">🛍️ Shop</Badge>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">All Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our complete collection of freshly baked goods, from classic favorites to seasonal specials.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.pre_order && (
                      <Badge className="absolute top-2 left-2 bg-purple-500 text-white text-xs">Pre-Order</Badge>
                    )}
                    {!product.in_stock && (
                      <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs">Out of Stock</Badge>
                    )}
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-pink-600">${product.price}</span>
                      <Button
                        onClick={() => addToCart(product)}
                        size="sm"
                        disabled={!product.in_stock}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50"
                      >
                        {product.in_stock ? "Add to Cart" : "Out of Stock"}
                      </Button>
                    </div>
                    {product.pre_order && (
                      <p className="text-xs text-purple-600 mt-2 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Min {product.min_order_time}h notice required
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-200 rounded-full px-4 py-2 mb-6">
                🌱 Our Story
              </Badge>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Baking Dreams Since 2020</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Sweet Dreams Bakery was born from a passion for creating moments of joy through exceptional baked goods.
                Every item is handcrafted with premium ingredients and baked fresh daily in our kitchen.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                From custom celebration cakes to daily fresh pastries, we're committed to making your sweet dreams come
                true with every bite.
              </p>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="h-6 w-6 text-pink-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">50+</div>
                  <div className="text-sm text-gray-600">Recipes</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">1000+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Cake className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">500+</div>
                  <div className="text-sm text-gray-600">Custom Cakes</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img src="/placeholder.svg?height=500&width=500" alt="Baker at work" className="rounded-2xl shadow-2xl" />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div>
                    <div className="font-semibold">5.0 Rating</div>
                    <div className="text-sm text-gray-600">From 200+ reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-full px-4 py-2 mb-4">
              📞 Get in Touch
            </Badge>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Visit Our Bakery</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Come visit us in person or get in touch for custom orders and special requests.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center p-6">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-600 text-sm">
                123 Sweet Street
                <br />
                Bakery District, BD 12345
              </p>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600 text-sm">
                (555) 123-CAKE
                <br />
                Mon-Sat: 7AM-8PM
              </p>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-600 text-sm">
                hello@sweetdreamsbakery.com
                <br />
                We'll respond within 24hrs
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">🧁</span>
                </div>
                <span className="text-xl font-bold">Sweet Dreams Bakery</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Handcrafted with love, baked fresh daily. Making your sweet dreams come true since 2020.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#products" className="hover:text-white transition-colors">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cakes
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cupcakes
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pastries
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  123 Sweet Street, BD 12345
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  (555) 123-CAKE
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  hello@sweetdreamsbakery.com
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Sweet Dreams Bakery. All rights reserved. Made with ❤️ and lots of sugar.</p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => toggleCart()} />
    </div>
  )
}
