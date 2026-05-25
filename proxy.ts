import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/profile", "/my-courses", "/sessions"];
const MENTOR_ONLY = ["/mentor"];
const ADMIN_ONLY = ["/admin"];

export async function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  // next-auth v5 renamed the cookie from "next-auth.session-token"
  // to "authjs.session-token" (prefixed with __Secure- on HTTPS).
  const secureCookie = req.url.startsWith("https://");
  const cookieName = secureCookie
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  let token: Awaited<ReturnType<typeof getToken>> = null;
  try {
    token = await getToken({ req, secret: process.env.AUTH_SECRET, cookieName });
  } catch {
    // If token decoding fails (e.g. missing secret), treat as unauthenticated
  }

  const isLoggedIn = !!token?.sub || !!(token as { id?: string } | null)?.id;
  const role = (token as { role?: string } | null)?.role;

  const isAdminRoute = ADMIN_ONLY.some((p) => path.startsWith(p));
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(path)}`, req.url)
      );
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  const isMentorRoute = MENTOR_ONLY.some((p) => path === p || path.startsWith(`${p}/`));
  if (isMentorRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(path)}`, req.url)
      );
    }
    if (!["MENTOR", "ADMIN"].includes(role ?? "")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  const isProtected = PROTECTED.some((p) => path.startsWith(p));
  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(path)}`, req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
