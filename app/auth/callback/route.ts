import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const next = searchParams.get("next") ?? "/"

  // For NextAuth.js, the callback is handled automatically
  // This route might not be needed depending on your NextAuth configuration
  return NextResponse.redirect(`${origin}${next}`)
}
