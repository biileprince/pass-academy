"use server";

import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validations/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import type { ActionResult } from "@/types";

export async function registerUser(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") ?? "unknown";

  const { allowed } = checkRateLimit(`register:${ip}`, 5, 60_000);
  if (!allowed) {
    return {
      success: false,
      error: "Too many attempts. Please wait a moment.",
    };
  }

  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? "Invalid input",
    };
  }

  const { name, email, password, role } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return {
      success: false,
      error: "An account with this email already exists.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: { name, email, password: hashedPassword, role },
  });

  await signIn("credentials", { email, password, redirect: false });

  return { success: true, data: { id: user.id } };
}
