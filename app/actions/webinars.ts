"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { webinarSchema } from "@/lib/validations/webinar";
import { slugify } from "@/lib/utils";
import type { ActionResult, WebinarFilter } from "@/types";
import type { Webinar } from "@prisma/client";

export async function getWebinars(
  filter: WebinarFilter = "upcoming"
): Promise<ActionResult<(Webinar & { _count: { registrations: number } })[]>> {
  try {
    const now = new Date();
    const webinars = await db.webinar.findMany({
      where: {
        isPublic: true,
        ...(filter === "upcoming"
          ? { scheduledAt: { gte: now }, status: { in: ["SCHEDULED", "LIVE"] } }
          : filter === "past"
          ? { status: { in: ["ENDED"] } }
          : {}),
      },
      include: { _count: { select: { registrations: true } } },
      orderBy: { scheduledAt: filter === "past" ? "desc" : "asc" },
    });
    return { success: true, data: webinars };
  } catch {
    return { success: false, error: "Failed to load webinars" };
  }
}

export async function getWebinarBySlug(
  slug: string
): Promise<ActionResult<Webinar & { _count: { registrations: number } }>> {
  try {
    const webinar = await db.webinar.findUnique({
      where: { slug },
      include: { _count: { select: { registrations: true } } },
    });
    if (!webinar) return { success: false, error: "Webinar not found" };
    return { success: true, data: webinar };
  } catch {
    return { success: false, error: "Failed to load webinar" };
  }
}

export async function registerForWebinar(webinarId: string): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };

  try {
    const webinar = await db.webinar.findUnique({ where: { id: webinarId } });
    if (!webinar) return { success: false, error: "Webinar not found" };
    if (webinar.status === "CANCELLED" || webinar.status === "ENDED") {
      return { success: false, error: "This webinar is no longer available" };
    }

    if (webinar.maxAttendees) {
      const count = await db.webinarRegistration.count({ where: { webinarId } });
      if (count >= webinar.maxAttendees) {
        return { success: false, error: "This webinar is fully booked" };
      }
    }

    await db.webinarRegistration.upsert({
      where: { userId_webinarId: { userId: session.user.id, webinarId } },
      create: { userId: session.user.id, webinarId },
      update: { status: "REGISTERED" },
    });
    revalidatePath(`/webinars/${webinar.slug}`);
    revalidatePath("/webinars");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to register" };
  }
}

export async function unregisterFromWebinar(webinarId: string): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };

  try {
    const webinar = await db.webinar.findUnique({ where: { id: webinarId }, select: { slug: true } });
    await db.webinarRegistration.delete({
      where: { userId_webinarId: { userId: session.user.id, webinarId } },
    });
    if (webinar) revalidatePath(`/webinars/${webinar.slug}`);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to unregister" };
  }
}

export async function createWebinar(input: unknown): Promise<ActionResult<{ slug: string }>> {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return { success: false, error: "Forbidden" };

  const parsed = webinarSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };

  try {
    const slug = slugify(parsed.data.title);
    const webinar = await db.webinar.create({
      data: { ...parsed.data, slug, hostId: session.user.id },
    });
    revalidatePath("/admin/webinars");
    revalidatePath("/webinars");
    return { success: true, data: { slug: webinar.slug } };
  } catch {
    return { success: false, error: "Failed to create webinar" };
  }
}

export async function updateWebinar(
  webinarId: string,
  input: unknown
): Promise<ActionResult<{ slug: string }>> {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return { success: false, error: "Forbidden" };

  const parsed = webinarSchema.partial().safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };

  try {
    const data = { ...parsed.data };
    if (parsed.data.title) {
      (data as Record<string, unknown>).slug = slugify(parsed.data.title);
    }
    const webinar = await db.webinar.update({ where: { id: webinarId }, data });
    revalidatePath("/admin/webinars");
    revalidatePath(`/admin/webinars/${webinarId}`);
    revalidatePath("/webinars");
    revalidatePath(`/webinars/${webinar.slug}`);
    return { success: true, data: { slug: webinar.slug } };
  } catch {
    return { success: false, error: "Failed to update webinar" };
  }
}

export async function deleteWebinar(webinarId: string): Promise<ActionResult<void>> {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return { success: false, error: "Forbidden" };

  try {
    await db.webinar.delete({ where: { id: webinarId } });
    revalidatePath("/admin/webinars");
    revalidatePath("/webinars");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to delete webinar" };
  }
}
