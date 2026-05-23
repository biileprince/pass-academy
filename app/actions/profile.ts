"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profileSchema } from "@/lib/validations/profile";
import type { ActionResult } from "@/types";

export async function updateProfile(input: unknown): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };

  const { name, avatarUrl, ...profileData } = parsed.data;

  try {
    await Promise.all([
      db.user.update({
        where: { id: session.user.id },
        data: { name, ...(avatarUrl ? { image: avatarUrl } : {}) },
      }),
      db.profile.upsert({
        where: { userId: session.user.id },
        create: { userId: session.user.id, ...profileData, avatarUrl },
        update: { ...profileData, avatarUrl },
      }),
    ]);
    revalidatePath("/profile");
    revalidatePath("/dashboard");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to update profile" };
  }
}

export async function getProfile() {
  const session = await auth();
  if (!session?.user) return null;

  return db.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true, mentorProfile: true },
  });
}
