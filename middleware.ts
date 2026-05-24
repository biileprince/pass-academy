import { jwtDecrypt } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Edge-compatible JWT decryption (zero next-auth dependency) ─────────────
// Replicates @auth/core's key derivation using only Web Crypto API + jose,
// which are fully supported in Vercel's Edge Runtime.

async function deriveEncryptionKey(
  secret: string,
  salt: string
): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const ikm = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HKDF" },
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: enc.encode(salt),
      info: enc.encode(
        `Auth.js Generated Encryption Key${salt ? ` (${salt})` : ""}`
      ),
    },
    ikm,
    256
  );
  return new Uint8Array(bits);
}

interface AuthToken {
  sub?: string;
  id?: string;
  role?: string;
}

async function getToken(req: NextRequest): Promise<AuthToken | null> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;

  // next-auth v5 uses __Secure- prefix in production (HTTPS)
  const secureName = "__Secure-authjs.session-token";
  const plainName = "authjs.session-token";
  const cookieName = req.cookies.has(secureName) ? secureName : plainName;
  const raw = req.cookies.get(cookieName)?.value;
  if (!raw) return null;

  try {
    const key = await deriveEncryptionKey(secret, cookieName);
    const { payload } = await jwtDecrypt(raw, key, { clockTolerance: 15 });
    return payload as AuthToken;
  } catch {
    return null;
  }
}

// ─── Route protection ───────────────────────────────────────────────────────

const PROTECTED = ["/dashboard", "/profile", "/my-courses", "/sessions"];
const MENTOR_ONLY = ["/mentor"];
const ADMIN_ONLY = ["/admin"];

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  const token = await getToken(req);
  const isLoggedIn = !!token;
  const role = token?.role;

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

  const isMentorRoute = MENTOR_ONLY.some(
    (p) => path === p || path.startsWith(`${p}/`)
  );
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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)" ],
};
