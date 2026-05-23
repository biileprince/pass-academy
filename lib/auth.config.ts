import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { Role } from "@prisma/client";

/**
 * Edge-compatible auth configuration.
 *
 * This file must NOT import anything that depends on Node.js APIs
 * (e.g. Prisma, bcryptjs) so that it can run in Vercel's Edge Runtime
 * (middleware).
 *
 * The Credentials `authorize` callback is defined in the full `auth.ts`
 * where Node.js APIs are available.
 */
export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    // Credentials provider is declared here so the middleware knows it exists,
    // but the actual `authorize` logic lives in `auth.ts` and overrides this.
    Credentials({
      async authorize() {
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
