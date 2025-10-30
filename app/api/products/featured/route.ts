import { NextResponse } from "next/server"
import { getFeaturedProducts } from "@/lib/database"

export async function GET() {
  try {
    const products = await getFeaturedProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return NextResponse.json(
      { error: "Failed to fetch featured products" },
      { status: 500 }
    )
  }
}
