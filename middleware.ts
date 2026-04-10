import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Nonce-based CSP removed: when a nonce is present in script-src,
  // browsers ignore 'unsafe-inline' per CSP3 spec — this caused all
  // Next.js static chunk <script> tags to be blocked (no matching nonce),
  // producing console CSP errors that fail Lighthouse Best Practices.
  // Static CSP with 'unsafe-inline' is the correct approach for a Next.js
  // App Router app where scripts are served from 'self' origin.
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "connect-src 'self' https:",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    { source: "/((?!api|_next/static|_next/image|favicon.ico|fonts/).*)" },
  ],
};
