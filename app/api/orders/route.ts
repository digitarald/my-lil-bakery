import { NextResponse } from "next/server"
import { getOrders } from "@/lib/database"

export async function GET() {
  try {
    const orders = await getOrders()
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}
