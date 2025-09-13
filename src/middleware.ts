import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname
    // Allow the admin landing page to render its own login UI
    if (path === "/admin") return

    // Only guard deep admin pages; if a token exists, require ADMIN role
    if (path.startsWith("/admin/")) {
      const role = req.nextauth.token?.role as string | undefined
      if (role && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        // Allow the admin landing page without auth
        if (path === "/admin") return true
        // For nested admin pages, allow even without token (UI will handle access)
        if (path.startsWith("/admin/")) return true
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*"]
}
