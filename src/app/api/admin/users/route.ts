import { NextRequest, NextResponse } from "next/server"
import { getUsers } from "@/lib/storage"

export async function GET(request: NextRequest) {
  try {
    // For now, we'll allow access without authentication for testing
    // In production, you'd check for admin role here
    
    const users = getUsers()

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}