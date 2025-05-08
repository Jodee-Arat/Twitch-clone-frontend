import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const { url, cookies, nextUrl } = request;

  const session = cookies.get("session")?.value;
  const isAuthRoute = nextUrl.pathname.startsWith("/account");
  const isDeactivateRoute = nextUrl.pathname === "/account/deactivate";
  const isDashBoardRoute = nextUrl.pathname.startsWith("/dashboard");

  if (!session && isDashBoardRoute) {
    return NextResponse.redirect(new URL("/account/login", url));
  }

  if (!session && isDeactivateRoute) {
    return NextResponse.redirect(new URL("/account/login", url));
  }

  if (session && isAuthRoute && !isDeactivateRoute) {
    return NextResponse.redirect(new URL("/dashboard/settings", url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/dashboard/:path*"],
};
