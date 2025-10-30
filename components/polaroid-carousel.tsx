"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCart } from "@/components/cart-context"
import type { ProductWithCategory } from "@/lib/database"

interface PolaroidCarouselProps {
  products: ProductWithCategory[]
  autoPlay?: boolean
}

export function PolaroidCarousel({ products, autoPlay = false }: PolaroidCarouselProps) {
  const { addToCart } = useCart()
  const [activeIndex, setActiveIndex] = useState(0)
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance for touch gestures (in px)
  const minSwipeDistance = 50

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || products.length === 0) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay, products.length])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        setActiveIndex((prev) => (prev - 1 + products.length) % products.length)
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        setActiveIndex((prev) => (prev + 1) % products.length)
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault()
        toggleFlip(activeIndex)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeIndex, products.length])

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % products.length)
  }

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
      handlePrev()
    }
  }

  const getCardPosition = (index: number) => {
    const diff = index - activeIndex
    if (diff === 0) return "active"
    if (diff === 1 || diff === -(products.length - 1)) return "next"
    if (diff === -1 || diff === products.length - 1) return "prev"
    return "hidden"
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No featured products available.</p>
      </div>
    )
  }

  return (
    <div 
      className="polaroid-deck-container"
      role="region"
      aria-label="Featured products carousel"
      aria-roledescription="carousel"
    >
      <div 
        className="polaroid-deck"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {products.map((product, index) => {
          const position = getCardPosition(index)
          const isFlipped = flippedCards.has(index)
          
          return (
            <div
              key={product.id}
              className={`polaroid-card ${position} ${isFlipped ? "flipped" : ""}`}
              onClick={() => position === "active" && toggleFlip(index)}
              onKeyDown={(e) => {
                if (position === "active" && (e.key === " " || e.key === "Enter")) {
                  e.preventDefault()
                  toggleFlip(index)
                }
              }}
              role="button"
              tabIndex={position === "active" ? 0 : -1}
              aria-label={`${product.name}. ${isFlipped ? "Showing details. Click to flip back." : "Click to flip and see details."}`}
              aria-pressed={isFlipped}
            >
              <div className="polaroid-card-inner">
                {/* Front of card */}
                <div className="polaroid-card-front">
                  <div className="polaroid-image">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="polaroid-photo"
                    />
                  </div>
                  <div className="polaroid-caption">
                    <p className="polaroid-text">{product.name}</p>
                  </div>
                  {product.preOrder && (
                    <Badge className="absolute top-4 left-4 bg-purple-500 text-white">
                      Pre-Order
                    </Badge>
                  )}
                </div>

                {/* Back of card */}
                <div className="polaroid-card-back">
                  <div className="polaroid-back-content">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-bold text-pink-600">${product.price}</span>
                      {product.preOrder && (
                        <Badge className="bg-purple-500 text-white">Pre-Order</Badge>
                      )}
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        addToCart(product)
                      }}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      disabled={!product.inStock}
                    >
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                    <p className="text-xs text-gray-500 mt-4 text-center">
                      Click to flip back
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation buttons */}
      <div className="polaroid-navigation">
        <Button
          onClick={handlePrev}
          variant="outline"
          size="icon"
          className="polaroid-nav-button"
          aria-label="Previous product"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          onClick={handleNext}
          variant="outline"
          size="icon"
          className="polaroid-nav-button"
          aria-label="Next product"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Dot indicators */}
      <div className="polaroid-indicators" role="tablist" aria-label="Product selection">
        {products.map((_, index) => (
          <button
            key={index}
            className={`polaroid-dot ${index === activeIndex ? "active" : ""}`}
            onClick={() => setActiveIndex(index)}
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Go to product ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
