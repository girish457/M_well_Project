import { NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/simple-auth"
import { sendWelcomeEmailIfFirst } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone } = await request.json()

    if (!email || !password || !firstName) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid Gmail" }, { status: 400 })
    }

    const user = registerUser({
      email,
      password,
      firstName,
      lastName,
      phone
    })

    if (!user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // send one-time welcome email
    try { sendWelcomeEmailIfFirst(user.email) } catch {}

    return NextResponse.json({
      message: "User created successfully",
      user
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

