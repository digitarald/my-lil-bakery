import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getFavoritesByUser, addFavorite, getUserFavoriteIds } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if request wants just IDs or full favorites
    const { searchParams } = new URL(request.url)
    const idsOnly = searchParams.get("idsOnly") === "true"

    if (idsOnly) {
      const favoriteIds = await getUserFavoriteIds(session.user.id)
      return NextResponse.json({ favoriteIds })
    }

    const favorites = await getFavoritesByUser(session.user.id)
    return NextResponse.json(favorites)
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    const favorite = await addFavorite(session.user.id, productId)
    return NextResponse.json(favorite)
  } catch (error) {
    console.error("Error adding favorite:", error)
    
    // Handle unique constraint violation (already favorited)
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Product is already in favorites" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to add favorite" },
      { status: 500 }
    )
  }
}
