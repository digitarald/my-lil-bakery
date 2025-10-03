"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface FavoriteButtonProps {
  productId: string
  productName?: string
  isFavorited?: boolean
  onFavoriteChange?: (isFavorited: boolean) => void
  size?: "sm" | "md" | "lg"
  variant?: "default" | "ghost" | "outline"
}

export function FavoriteButton({
  productId,
  productName,
  isFavorited: initialIsFavorited = false,
  onFavoriteChange,
  size = "md",
  variant = "ghost",
}: FavoriteButtonProps) {
  const { data: session } = useSession()
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session) {
      toast.error("Please sign in to save favorites")
      return
    }

    setIsLoading(true)

    try {
      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(`/api/favorites/${productId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to remove favorite")
        }

        setIsFavorited(false)
        onFavoriteChange?.(false)
        toast.success(productName ? `${productName} removed from favorites` : "Removed from favorites")
      } else {
        // Add to favorites
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to add favorite")
        }

        setIsFavorited(true)
        onFavoriteChange?.(true)
        toast.success(productName ? `${productName} added to favorites` : "Added to favorites")
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update favorites")
    } finally {
      setIsLoading(false)
    }
  }

  const buttonSize = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10"
  const iconSize = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5"

  return (
    <Button
      variant={variant}
      size="icon"
      className={buttonSize}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`${iconSize} ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-500"} transition-colors`}
      />
    </Button>
  )
}
