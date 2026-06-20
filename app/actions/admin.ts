"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ActionResult } from "@/types";
import type { Role } from "@/prisma/generated/prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") throw new Error("Forbidden");
  return session;
}

export async function getAllUsers() {
  await requireAdmin();
  return db.user.findMany({
    include: { profile: true, mentorProfile: { select: { isApproved: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateUserRole(userId: string, role: Role): Promise<ActionResult<void>> {
  try {
    await requireAdmin();
    await db.user.update({ where: { id: userId }, data: { role } });
    revalidatePath("/admin/users");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to update role" };
  }
}

export async function approveMentor(mentorUserId: string): Promise<ActionResult<void>> {
  try {
    await requireAdmin();
    await db.mentorProfile.update({
      where: { userId: mentorUserId },
      data: { isApproved: true },
    });
    revalidatePath("/admin/mentors");
    revalidatePath("/mentorship");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to approve mentor" };
  }
}

export async function rejectMentor(mentorUserId: string): Promise<ActionResult<void>> {
  try {
    await requireAdmin();
    await db.mentorProfile.update({
      where: { userId: mentorUserId },
      data: { isApproved: false },
    });
    await db.user.update({ where: { id: mentorUserId }, data: { role: "STUDENT" } });
    revalidatePath("/admin/mentors");
    revalidatePath("/mentorship");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to reject mentor" };
  }
}

export async function getAdminStats() {
  await requireAdmin();
  const [users, courses, webinars, sessions] = await Promise.all([
    db.user.count(),
    db.course.count({ where: { isPublished: true } }),
    db.webinar.count(),
    db.mentorSession.count(),
  ]);
  return { users, courses, webinars, sessions };
}

export async function getPendingMentors() {
  await requireAdmin();
  return db.user.findMany({
    where: { role: "MENTOR", mentorProfile: { isApproved: false } },
    include: { mentorProfile: true, profile: true },
  });
}

export async function approveTutor(tutorUserId: string): Promise<ActionResult<void>> {
  try {
    await requireAdmin();
    await db.tutorProfile.update({
      where: { userId: tutorUserId },
      data: { isApproved: true },
    });
    revalidatePath("/dashboard/admin");
    revalidatePath("/tutorials");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to approve tutor" };
  }
}

export async function rejectTutor(tutorUserId: string): Promise<ActionResult<void>> {
  try {
    await requireAdmin();
    await db.tutorProfile.update({
      where: { userId: tutorUserId },
      data: { isApproved: false },
    });
    await db.user.update({ where: { id: tutorUserId }, data: { role: "STUDENT" } });
    revalidatePath("/dashboard/admin");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to reject tutor" };
  }
}

export async function getPendingTutors() {
  await requireAdmin();
  return db.user.findMany({
    where: { role: "TUTOR", tutorProfile: { isApproved: false } },
    include: { tutorProfile: true, profile: true },
  });
}

export async function deactivateUser(userId: string): Promise<ActionResult<void>> {
  try {
    const session = await requireAdmin();
    if (userId === session.user.id) {
      return { success: false, error: "Cannot deactivate yourself" };
    }
    await db.user.delete({ where: { id: userId } });
    revalidatePath("/dashboard/admin");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to deactivate user" };
  }
}
