import { NextResponse } from "next/server";

// Guards the admin panel (/admin) and its APIs (/api/admin). Everything else on
// the site is public and untouched — the matcher below only runs on admin paths.
const SESSION_COOKIE = "admin_session";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Public: the login page and the login/logout endpoints.
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/login") ||
    pathname.startsWith("/api/admin/logout")
  ) {
    return NextResponse.next();
  }

  const token = process.env.ADMIN_TOKEN || "dev-token";
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  if (!session || session !== token) {
    // API routes get a 401; pages redirect to the login screen.
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
