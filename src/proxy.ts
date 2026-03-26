import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { isAuthRoute, isProtectedRoute, isPublicRoute } from "./integrations/better-auth/utils";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip static + Next internals early
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") || // allow auth endpoints
    pathname.startsWith("/api/inggest") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Get session (edge-safe)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isLoggedIn = !!session;

  // 3. Handle AUTH routes (e.g. /sign-in)
  // If already logged in → redirect to dashboard
  if (isAuthRoute(pathname)) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 4. Handle PROTECTED routes
  if (isProtectedRoute(pathname)) {
    if (!isLoggedIn) {
      const signInUrl = new URL("/sign-in", request.url);

      // preserve redirect target
      signInUrl.searchParams.set("callbackUrl", pathname);

      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  }

  // 5. Public routes → always allowed
  if (isPublicRoute(pathname)) return NextResponse.next();

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
