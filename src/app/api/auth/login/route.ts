import { NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/simple-auth"
import { sendWelcomeEmailIfFirst } from "@/lib/email"
import { getUserByEmail } from "@/lib/storage"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid Gmail" },
        { status: 400 }
      )
    }

    const existing = getUserByEmail(email)
    if (!existing) {
      return NextResponse.json(
        { error: "Invalid User" },
        { status: 404 }
      )
    }

    const user = authenticateUser(email, password)

    if (!user) {
      return NextResponse.json(
        { error: "Wrong Password" },
        { status: 401 }
      )
    }

    // send one-time welcome email (first login/signup for this email)
    try { sendWelcomeEmailIfFirst(user.email) } catch {}

    return NextResponse.json({
      message: "Login successful",
      user
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

