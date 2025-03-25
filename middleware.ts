import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // Add custom headers if needed
        const requestHeaders = new Headers(req.headers);
        const token = req.nextauth?.token?.accessToken;

        if (token) {
            requestHeaders.set("Authorization", `Bearer ${token}`);
        }

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: [
        // Protected routes
        "/me",
        "favorites",
        "/profile",
        "/api/protected/:path*",
        // Exclude auth routes
        "/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)",
    ],
};