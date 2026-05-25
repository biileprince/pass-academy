"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bookSessionSchema, mentorProfileSchema } from "@/lib/validations/mentorship";
import type { ActionResult, MentorFilters } from "@/types";
import type { User, MentorProfile, Profile, MentorSession, Prisma } from "@/prisma/generated/prisma/client";

type MentorWithProfile = User & { mentorProfile: MentorProfile; profile: Profile | null };

export async function getMentors(filters: MentorFilters = {}): Promise<ActionResult<MentorWithProfile[]>> {
  try {
    const mentors = await db.user.findMany({
      where: {
        role: "MENTOR",
        mentorProfile: {
          isApproved: true,
          isAvailable: true,
          ...(filters.subject ? { subjects: { has: filters.subject as never } } : {}),
        },
        ...(filters.search
          ? {
              OR: [
                { name: { contains: filters.search, mode: "insensitive" } },
                { mentorProfile: { headline: { contains: filters.search, mode: "insensitive" } } },
              ],
            }
          : {}),
      },
      include: { mentorProfile: true, profile: true },
    });
    return { success: true, data: mentors as MentorWithProfile[] };
  } catch {
    return { success: false, error: "Failed to load mentors" };
  }
}

export async function getMentorById(mentorId: string): Promise<ActionResult<MentorWithProfile>> {
  try {
    const mentor = await db.user.findUnique({
      where: { id: mentorId, role: "MENTOR" },
      include: { mentorProfile: true, profile: true },
    });
    if (!mentor?.mentorProfile) return { success: false, error: "Mentor not found" };
    return { success: true, data: mentor as MentorWithProfile };
  } catch {
    return { success: false, error: "Failed to load mentor" };
  }
}

export async function bookSession(input: unknown): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };

  const parsed = bookSessionSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };

  try {
    const mentorProfile = await db.mentorProfile.findUnique({
      where: { userId: parsed.data.mentorId },
    });
    if (!mentorProfile || !mentorProfile.isApproved) {
      return { success: false, error: "Mentor not available" };
    }

    await db.mentorSession.create({
      data: {
        studentId: session.user.id,
        mentorId: parsed.data.mentorId,
        mentorProfileId: mentorProfile.id,
        title: parsed.data.title,
        description: parsed.data.description,
        scheduledAt: parsed.data.scheduledAt,
        durationMinutes: parsed.data.durationMinutes,
      },
    });
    revalidatePath("/sessions");
    revalidatePath("/mentor/sessions");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to book session" };
  }
}

export async function cancelSession(sessionId: string): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };

  try {
    const mentorSession = await db.mentorSession.findUnique({ where: { id: sessionId } });
    if (!mentorSession) return { success: false, error: "Session not found" };

    const isOwner =
      mentorSession.studentId === session.user.id ||
      mentorSession.mentorId === session.user.id ||
      session.user.role === "ADMIN";

    if (!isOwner) return { success: false, error: "Forbidden" };

    await db.mentorSession.update({
      where: { id: sessionId },
      data: { status: "CANCELLED" },
    });
    revalidatePath("/sessions");
    revalidatePath("/mentor/sessions");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to cancel session" };
  }
}

export async function updateSessionStatus(
  sessionId: string,
  status: "CONFIRMED" | "COMPLETED"
): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };

  try {
    const mentorSession = await db.mentorSession.findUnique({ where: { id: sessionId } });
    if (!mentorSession) return { success: false, error: "Session not found" };
    if (mentorSession.mentorId !== session.user.id && session.user.role !== "ADMIN") {
      return { success: false, error: "Forbidden" };
    }

    await db.mentorSession.update({ where: { id: sessionId }, data: { status } });
    revalidatePath("/sessions");
    revalidatePath("/mentor/sessions");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to update session" };
  }
}

export async function updateAvailability(availability: unknown): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };

  try {
    await db.mentorProfile.update({
      where: { userId: session.user.id },
      data: { availability: availability as Prisma.InputJsonValue },
    });
    revalidatePath("/mentor/availability");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to update availability" };
  }
}

export async function getMySessionsAsStudent(): Promise<ActionResult<MentorSession[]>> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };

  const sessions = await db.mentorSession.findMany({
    where: { studentId: session.user.id },
    orderBy: { scheduledAt: "asc" },
  });
  return { success: true, data: sessions };
}

export async function getMySessionsAsMentor(): Promise<ActionResult<MentorSession[]>> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };

  const sessions = await db.mentorSession.findMany({
    where: { mentorId: session.user.id },
    orderBy: { scheduledAt: "asc" },
  });
  return { success: true, data: sessions };
}

export async function createMentorProfile(input: unknown): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };

  const parsed = mentorProfileSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };

  try {
    await db.mentorProfile.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id, ...parsed.data },
      update: { ...parsed.data },
    });
    await db.user.update({ where: { id: session.user.id }, data: { role: "MENTOR" } });
    revalidatePath("/mentorship");
    revalidatePath("/dashboard");
    revalidatePath("/admin/mentors");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to create mentor profile" };
  }
}
