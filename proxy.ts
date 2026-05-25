import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/profile", "/my-courses", "/sessions"];
const MENTOR_ONLY = ["/mentor"];
const ADMIN_ONLY = ["/admin"];

export async function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isLoggedIn = !!token?.sub || !!(token as { id?: string } | null)?.id;
  const role = (token as { role?: string } | null)?.role;
  const path = nextUrl.pathname;

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
