import { z } from "zod";
import { CourseCategory, CourseLevel } from "@prisma/client";

export const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters"),
  shortDesc: z.string().max(200).optional(),
  category: z.nativeEnum(CourseCategory),
  level: z.nativeEnum(CourseLevel),
  tags: z.array(z.string()).max(10).default([]),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  isFree: z.boolean().default(true),
  price: z.coerce.number().min(0).optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

export const lessonSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  duration: z.coerce.number().min(0).default(0),
  order: z.coerce.number().min(1),
  isFree: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  downloadUrl: z.string().url().optional().or(z.literal("")),
  content: z.string().optional(),
});

export const enrollSchema = z.object({
  courseId: z.string().cuid(),
});

export type CourseInput = z.infer<typeof courseSchema>;
export type LessonInput = z.infer<typeof lessonSchema>;
