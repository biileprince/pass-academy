"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { courseSchema, lessonSchema } from "@/lib/validations/course";
import { slugify } from "@/lib/utils";
import type { ActionResult, CourseFilters } from "@/types";
import type { Course, Lesson } from "@/prisma/generated/prisma/client";

export async function getCourses(filters: CourseFilters = {}): Promise<
  ActionResult<(Course & { _count: { enrollments: number; lessons: number } })[]>
> {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        ...(filters.category ? { category: filters.category as never } : {}),
        ...(filters.level ? { level: filters.level as never } : {}),
        ...(filters.isFeatured ? { isFeatured: true } : {}),
        ...(filters.search
          ? {
              OR: [
                { title: { contains: filters.search, mode: "insensitive" } },
                { description: { contains: filters.search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        _count: { select: { enrollments: true, lessons: true } },
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });
    return { success: true, data: courses };
  } catch {
    return { success: false, error: "Failed to load courses" };
  }
}

export async function getCourseBySlug(
  slug: string
): Promise<ActionResult<Course & { lessons: Lesson[]; _count: { enrollments: number } }>> {
  try {
    const course = await db.course.findUnique({
      where: { slug, isPublished: true },
      include: {
        lessons: { where: { isPublished: true }, orderBy: { order: "asc" } },
        _count: { select: { enrollments: true } },
      },
    });
    if (!course) return { success: false, error: "Course not found" };
    return { success: true, data: course };
  } catch {
    return { success: false, error: "Failed to load course" };
  }
}

export async function enrollInCourse(courseId: string): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };

  try {
    const course = await db.course.findUnique({ where: { id: courseId, isPublished: true } });
    if (!course) return { success: false, error: "Course not available" };

    await db.enrollment.upsert({
      where: { userId_courseId: { userId: session.user.id, courseId } },
      create: { userId: session.user.id, courseId },
      update: { status: "ACTIVE" },
    });
    revalidatePath("/my-courses");
    revalidatePath(`/tutorials/${course.slug}`);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to enroll" };
  }
}

export async function unenrollFromCourse(courseId: string): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };

  try {
    await db.enrollment.delete({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    });
    revalidatePath("/my-courses");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to unenroll" };
  }
}

export async function updateLessonProgress(
  lessonId: string,
  watchedSecs: number,
  isCompleted: boolean
): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };

  try {
    const lesson = await db.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) return { success: false, error: "Lesson not found" };

    await db.lessonProgress.upsert({
      where: { userId_lessonId: { userId: session.user.id, lessonId } },
      create: {
        userId: session.user.id,
        lessonId,
        watchedSecs,
        isCompleted,
        ...(isCompleted ? { completedAt: new Date() } : {}),
      },
      update: {
        watchedSecs,
        isCompleted,
        ...(isCompleted ? { completedAt: new Date() } : {}),
      },
    });

    const [totalLessons, completedLessons, course] = await Promise.all([
      db.lesson.count({ where: { courseId: lesson.courseId, isPublished: true } }),
      db.lessonProgress.count({
        where: {
          userId: session.user.id,
          isCompleted: true,
          lesson: { courseId: lesson.courseId },
        },
      }),
      db.course.findUnique({ where: { id: lesson.courseId }, select: { slug: true } }),
    ]);

    const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    await db.enrollment.updateMany({
      where: { userId: session.user.id, courseId: lesson.courseId },
      data: {
        progress,
        ...(progress >= 100 ? { status: "COMPLETED", completedAt: new Date() } : {}),
      },
    });

    revalidatePath("/my-courses");
    if (course) revalidatePath(`/my-courses/${course.slug}/lessons/${lesson.slug}`);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to update progress" };
  }
}

export async function createCourse(input: unknown): Promise<ActionResult<{ slug: string }>> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };
  if (session.user.role !== "ADMIN" && session.user.role !== "TUTOR") {
    return { success: false, error: "Only admins and tutors can create courses" };
  }

  const parsed = courseSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };

  try {
    const slug = slugify(parsed.data.title);
    const course = await db.course.create({
      data: { 
        ...parsed.data, 
        slug, 
        authorId: session.user.id,
        tutorId: session.user.id,
      },
    });
    revalidatePath("/admin/courses");
    revalidatePath("/tutorials");
    revalidatePath("/tutor/courses");
    return { success: true, data: { slug: course.slug } };
  } catch {
    return { success: false, error: "Failed to create course" };
  }
}

export async function updateCourse(
  courseId: string,
  input: unknown
): Promise<ActionResult<{ slug: string }>> {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return { success: false, error: "Forbidden" };

  const parsed = courseSchema.partial().safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };

  try {
    const data = { ...parsed.data };
    if (parsed.data.title) {
      (data as Record<string, unknown>).slug = slugify(parsed.data.title);
    }

    const course = await db.course.update({
      where: { id: courseId },
      data,
    });
    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath("/tutorials");
    revalidatePath(`/tutorials/${course.slug}`);
    return { success: true, data: { slug: course.slug } };
  } catch {
    return { success: false, error: "Failed to update course" };
  }
}

export async function deleteCourse(courseId: string): Promise<ActionResult<void>> {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return { success: false, error: "Forbidden" };

  try {
    await db.course.delete({ where: { id: courseId } });
    revalidatePath("/admin/courses");
    revalidatePath("/tutorials");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to delete course" };
  }
}

export async function createLesson(courseId: string, input: unknown): Promise<ActionResult<void>> {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return { success: false, error: "Forbidden" };

  const parsed = lessonSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };

  try {
    await db.lesson.create({
      data: {
        ...parsed.data,
        courseId,
        slug: slugify(parsed.data.title),
      },
    });
    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to create lesson" };
  }
}

export async function updateLesson(
  lessonId: string,
  input: unknown
): Promise<ActionResult<void>> {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return { success: false, error: "Forbidden" };

  const parsed = lessonSchema.partial().safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };

  try {
    const data = { ...parsed.data };
    if (parsed.data.title) {
      (data as Record<string, unknown>).slug = slugify(parsed.data.title);
    }

    const lesson = await db.lesson.update({ where: { id: lessonId }, data });
    revalidatePath(`/admin/courses/${lesson.courseId}`);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to update lesson" };
  }
}

export async function deleteLesson(lessonId: string): Promise<ActionResult<void>> {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return { success: false, error: "Forbidden" };

  try {
    const lesson = await db.lesson.delete({ where: { id: lessonId } });
    revalidatePath(`/admin/courses/${lesson.courseId}`);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to delete lesson" };
  }
}

export async function getMyEnrollments() {
  const session = await auth();
  if (!session?.user) return { success: false as const, error: "Not authenticated" };

  const enrollments = await db.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: { _count: { select: { lessons: true } } },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });
  return { success: true as const, data: enrollments };
}
