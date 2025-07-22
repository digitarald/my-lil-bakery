import { NextRequest, NextResponse } from "next/server"
import { createOrder } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()
    const order = await createOrder(orderData)
    return NextResponse.json(order)
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}
