import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if the request is for the API routes
  if (request.nextUrl.pathname.startsWith("/api")) {
    // Get the Authorization header
    const authHeader = request.headers.get("Authorization")

    // If no Authorization header is present, return a 401 Unauthorized response
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authorization header is required" },
        { status: 401 }
      )
    }

    // You can add additional authorization logic here
    // For example, validate JWT tokens, check specific auth schemes, etc.
  }

  // Continue with the request for non-API routes or if authorization is valid
  return NextResponse.next()
}

// Configure the middleware to only run on API routes
export const config = {
  matcher: "/api/:path*",
}
