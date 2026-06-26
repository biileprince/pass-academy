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

export async function updateTutorProfile(input: {
  headline: string;
  bio?: string;
  expertise: string[];
  subjects: string[];
  yearsExperience: number;
  qualifications: string[];
  languages: string[];
}): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };
  if (session.user.role !== "TUTOR") return { success: false, error: "Unauthorized" };

  try {
    await db.tutorProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        headline: input.headline,
        bio: input.bio,
        expertise: input.expertise,
        subjects: input.subjects as any,
        yearsExperience: input.yearsExperience,
        qualifications: input.qualifications,
        languages: input.languages,
      },
      update: {
        headline: input.headline,
        bio: input.bio,
        expertise: input.expertise,
        subjects: input.subjects as any,
        yearsExperience: input.yearsExperience,
        qualifications: input.qualifications,
        languages: input.languages,
      },
    });
    revalidatePath("/profile");
    revalidatePath("/dashboard");
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: "Failed to update tutor profile" };
  }
}

export async function updateMentorProfile(input: {
  headline: string;
  expertise: string[];
  subjects: string[];
  yearsExperience: number;
  hourlyRate?: number;
  timezone: string;
  languages: string[];
  availability?: Record<string, any>;
}): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };
  if (session.user.role !== "MENTOR") return { success: false, error: "Unauthorized" };

  try {
    await db.mentorProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        headline: input.headline,
        expertise: input.expertise,
        subjects: input.subjects as any,
        yearsExperience: input.yearsExperience,
        hourlyRate: input.hourlyRate ?? undefined,
        timezone: input.timezone,
        languages: input.languages,
        availability: input.availability,
      },
      update: {
        headline: input.headline,
        expertise: input.expertise,
        subjects: input.subjects as any,
        yearsExperience: input.yearsExperience,
        hourlyRate: input.hourlyRate ?? undefined,
        timezone: input.timezone,
        languages: input.languages,
        availability: input.availability,
      },
    });
    revalidatePath("/profile");
    revalidatePath("/dashboard");
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: "Failed to update mentor profile" };
  }
}

export async function getProfile() {
  const session = await auth();
  if (!session?.user) return null;

  return db.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
      mentorProfile: true,
      tutorProfile: true,
    },
  });
}

