import { NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Public: the login page and the login/logout endpoints.
  if (
    pathname === "/login" ||
    pathname.startsWith("/api/login") ||
    pathname.startsWith("/api/logout")
  ) {
    return NextResponse.next();
  }

  const token = process.env.ADMIN_TOKEN || "dev-token";
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  if (!session || session !== token) {
    // API routes get a 401; pages redirect to login.
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
