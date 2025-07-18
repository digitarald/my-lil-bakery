"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Clock, Heart, ShoppingBag, Search, Filter, Plus } from "lucide-react"
import { CartProvider, useCart } from "@/components/cart-context"
import { CartSidebar } from "@/components/cart-sidebar"

const allProducts = [
  {
    id: 1,
    name: "Rainbow Cupcakes",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.9,
    reviews: 127,
    preOrder: true,
    category: "Cupcakes",
    description: "Colorful vanilla cupcakes with rainbow frosting",
    minOrderTime: 24,
  },
  {
    id: 2,
    name: "Strawberry Shortcake",
    price: 32.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    reviews: 89,
    preOrder: true,
    category: "Cakes",
    description: "Fresh strawberries with fluffy cream and sponge cake",
    minOrderTime: 48,
  },
  {
    id: 3,
    name: "Chocolate Chip Cookies",
    price: 18.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    reviews: 203,
    preOrder: false,
    category: "Cookies",
    description: "Classic cookies with premium chocolate chips",
    minOrderTime: 2,
  },
  {
    id: 4,
    name: "Blueberry Muffins",
    price: 21.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.6,
    reviews: 156,
    preOrder: false,
    category: "Muffins",
    description: "Fluffy muffins bursting with fresh blueberries",
    minOrderTime: 4,
  },
  {
    id: 5,
    name: "Red Velvet Cake",
    price: 45.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.9,
    reviews: 78,
    preOrder: true,
    category: "Cakes",
    description: "Rich red velvet with cream cheese frosting",
    minOrderTime: 72,
  },
  {
    id: 6,
    name: "Croissants",
    price: 16.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.5,
    reviews: 92,
    preOrder: false,
    category: "Pastries",
    description: "Buttery, flaky French croissants",
    minOrderTime: 2,
  },
  {
    id: 7,
    name: "Lemon Tart",
    price: 28.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    reviews: 64,
    preOrder: true,
    category: "Pastries",
    description: "Tangy lemon curd in a buttery pastry shell",
    minOrderTime: 24,
  },
  {
    id: 8,
    name: "Chocolate Brownies",
    price: 22.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.6,
    reviews: 145,
    preOrder: false,
    category: "Brownies",
    description: "Fudgy chocolate brownies with walnuts",
    minOrderTime: 4,
  },
]

const categories = ["All", "Cakes", "Cupcakes", "Cookies", "Muffins", "Pastries", "Brownies"]

function Navigation() {
  const { items, toggleCart } = useCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">🧁</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Sweet Dreams Bakery
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#products" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">
              Products
            </a>
            <Link href="/about" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative" onClick={toggleCart} data-testid="cart-button">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-pink-500">
                  {itemCount}
                </Badge>
              )}
            </Button>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full px-6">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function ProductCatalog() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("name")
  const { addItem } = useCart()

  const filteredProducts = allProducts
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "All" || product.category === selectedCategory),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      minOrderTime: product.minOrderTime,
      preOrder: product.preOrder,
    })
  }

  return (
    <section id="products" className="py-20 bg-white/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-full px-4 py-2 mb-4">
            🛍️ Our Products
          </Badge>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Sweet Treats for Every Occasion</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our full collection of handcrafted baked goods, made fresh daily with love and premium ingredients
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-pink-100">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:ring-pink-500 focus:border-pink-500 rounded-xl"
                data-testid="search-input"
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
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="border-gray-200 focus:ring-pink-500 focus:border-pink-500 rounded-xl">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{filteredProducts.length} products found</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" data-testid="products-grid">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden rounded-2xl"
              data-testid={`product-${product.id}`}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {product.preOrder && (
                  <Badge className="absolute top-4 left-4 bg-pink-500 text-white rounded-full">
                    <Clock className="h-3 w-3 mr-1" />
                    Pre-Order
                  </Badge>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 rounded-full">
                    {product.category}
                  </Badge>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-pink-600">${product.price}</span>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full"
                    data-testid={`add-to-cart-${product.id}`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16" data-testid="no-products">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </section>
  )
}

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-cream-50 to-yellow-50">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-200 rounded-full px-4 py-2">
                  ✨ Fresh Daily & Pre-Orders Available
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Sweet Dreams
                  </span>
                  <br />
                  <span className="text-gray-800">Come True</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Handcrafted with love, baked fresh daily. Add items to your cart and choose your pickup time! 🍰
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full px-8 py-6 text-lg"
                  onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">500+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">4.9</div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    Rating
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">50+</div>
                  <div className="text-sm text-gray-600">Delicious Items</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/placeholder.svg?height=600&width=600"
                  alt="Delicious bakery items"
                  width={600}
                  height={600}
                  className="rounded-3xl shadow-2xl"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200/50 to-purple-200/50 rounded-3xl transform rotate-6"></div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-300 rounded-full flex items-center justify-center text-2xl animate-bounce">
                🎂
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-pink-300 rounded-full flex items-center justify-center text-xl animate-pulse">
                🍪
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductCatalog />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">🧁</span>
                </div>
                <span className="text-xl font-bold">Sweet Dreams Bakery</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Handcrafted with love, baked fresh daily. Making your sweet dreams come true since 2020.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="#products" className="block text-gray-400 hover:text-white transition-colors">
                  Products
                </a>
                <Link href="/about" className="block text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
                <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Categories</h4>
              <div className="space-y-2">
                <span className="block text-gray-400">Cakes</span>
                <span className="block text-gray-400">Cupcakes</span>
                <span className="block text-gray-400">Cookies</span>
                <span className="block text-gray-400">Pastries</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <p>📍 123 Sweet Street, Bakery Town</p>
                <p>📞 (555) 123-CAKE</p>
                <p>✉️ hello@sweetdreamsbakery.com</p>
                <p>🕐 Mon-Sat: 7AM-8PM</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Sweet Dreams Bakery. Made with 💖 and lots of sugar.</p>
          </div>
        </div>
      </footer>

      <CartSidebar />
    </div>
  )
}

export default function Page() {
  return (
    <CartProvider>
      <HomePage />
    </CartProvider>
  )
}
