import { NextResponse } from "next/server"
import { getOrderStats } from "@/lib/database"

export async function GET() {
  try {
    const stats = await getOrderStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching order stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch order stats" },
      { status: 500 }
    )
  }
}
