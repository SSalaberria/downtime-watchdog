import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Redirect to landing page if user is not authenticated
  if (!request.cookies.has("token")) return NextResponse.redirect(new URL("/", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard",
};
