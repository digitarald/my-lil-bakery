"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, ArrowLeft } from "lucide-react"
import { useCart } from "@/components/cart-context"
import { FavoriteButton } from "@/components/favorite-button"
import type { ProductWithCategory } from "@/lib/database"

interface FavoriteWithProduct {
  id: string
  productId: string
  userId: string
  createdAt: string
  product: ProductWithCategory
}

export default function FavoritesPage() {
  const { data: _session, status } = useSession()
  const router = useRouter()
  const { addToCart } = useCart()
  const [favorites, setFavorites] = useState<FavoriteWithProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      loadFavorites()
    }
  }, [status, router])

  const loadFavorites = async () => {
    try {
      const response = await fetch("/api/favorites")
      if (response.ok) {
        const data = await response.json()
        setFavorites(data)
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteRemoved = (productId: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.product.id !== productId))
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-cream-50 to-yellow-50 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-lg">
                  <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-cream-50 to-yellow-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            My Favorites
          </h1>
          <p className="text-gray-600 mt-2">
            {favorites.length === 0 
              ? "You haven't saved any favorites yet" 
              : `${favorites.length} ${favorites.length === 1 ? "item" : "items"} saved`}
          </p>
        </div>

        {/* Products Grid */}
        {favorites.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg p-12 text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No favorites yet</h2>
            <p className="text-gray-600 mb-6">
              Start adding products to your favorites by clicking the heart icon on any product.
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                Browse Products
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((favorite) => (
              <Card
                key={favorite.id}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={favorite.product.image || "/placeholder.svg"}
                    alt={favorite.product.name}
                    width={300}
                    height={300}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {favorite.product.preOrder && (
                    <Badge className="absolute top-2 left-2 bg-purple-500 text-white text-xs">
                      Pre-Order
                    </Badge>
                  )}
                  {!favorite.product.inStock && (
                    <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs">
                      Out of Stock
                    </Badge>
                  )}
                  <div className="absolute top-2 right-2">
                    <FavoriteButton
                      productId={favorite.product.id}
                      productName={favorite.product.name}
                      isFavorited={true}
                      onFavoriteChange={(isFavorited) => {
                        if (!isFavorited) {
                          handleFavoriteRemoved(favorite.product.id)
                        }
                      }}
                    />
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1 line-clamp-1">{favorite.product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {favorite.product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-pink-600">
                      ${favorite.product.price.toFixed(2)}
                    </span>
                    <Button
                      onClick={() => addToCart(favorite.product)}
                      size="sm"
                      disabled={!favorite.product.inStock}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      {favorite.product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
