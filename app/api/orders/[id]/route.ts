import { NextRequest, NextResponse } from "next/server"
import { updateOrderStatus } from "@/lib/database"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    
    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      )
    }

    const order = await updateOrderStatus(params.id, status)
    return NextResponse.json(order)
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    )
  }
}
