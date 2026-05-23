"use server";

import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { APP_URL } from "@/lib/constants";
import type { ActionResult } from "@/types";

const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function requestPasswordReset(
  email: string
): Promise<ActionResult<{ resetUrl?: string }>> {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") ?? "unknown";

  const { allowed } = checkRateLimit(`pw-reset:${ip}`, 5, 60_000);
  if (!allowed) return { success: false, error: "Too many attempts. Please wait a moment." };

  const parsed = z.string().email().safeParse(email);
  if (!parsed.success) return { success: false, error: "Invalid email" };

  const user = await db.user.findUnique({ where: { email: parsed.data } });

  // To avoid email enumeration, always succeed — but only generate a token if user exists.
  if (!user || !user.password) {
    return { success: true, data: {} };
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);

  await db.passwordResetToken.create({
    data: {
      email: parsed.data,
      tokenHash,
      expires: new Date(Date.now() + RESET_TTL_MS),
    },
  });

  const resetUrl = `${APP_URL}/reset-password?token=${rawToken}`;

  // TODO: send email via Resend/Postmark. For now return URL in dev only.
  if (process.env.NODE_ENV !== "production") {
    return { success: true, data: { resetUrl } };
  }
  return { success: true, data: {} };
}

const resetSchema = z
  .object({
    token: z.string().min(10),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function resetPassword(input: unknown): Promise<ActionResult<void>> {
  const parsed = resetSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const tokenHash = hashToken(parsed.data.token);
  const record = await db.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!record || record.used || record.expires < new Date()) {
    return { success: false, error: "Reset link is invalid or expired." };
  }

  const hashed = await bcrypt.hash(parsed.data.password, 12);

  await db.$transaction([
    db.user.update({ where: { email: record.email }, data: { password: hashed } }),
    db.passwordResetToken.update({ where: { id: record.id }, data: { used: true } }),
  ]);

  return { success: true, data: undefined };
}

const changeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function changePassword(input: unknown): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };

  const parsed = changeSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user?.password) {
    return { success: false, error: "Password change not available for OAuth accounts." };
  }

  const match = await bcrypt.compare(parsed.data.currentPassword, user.password);
  if (!match) return { success: false, error: "Current password is incorrect." };

  const hashed = await bcrypt.hash(parsed.data.newPassword, 12);
  await db.user.update({ where: { id: user.id }, data: { password: hashed } });

  return { success: true, data: undefined };
}
