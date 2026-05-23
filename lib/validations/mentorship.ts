import { z } from "zod";
import { CourseCategory } from "@prisma/client";

export const mentorProfileSchema = z.object({
  headline: z.string().min(5, "Headline must be at least 5 characters").max(120),
  expertise: z.array(z.string()).min(1, "Add at least one area of expertise"),
  subjects: z.array(z.nativeEnum(CourseCategory)).min(1, "Select at least one subject"),
  yearsExperience: z.coerce.number().min(0).max(50),
  hourlyRate: z.coerce.number().min(0).optional(),
  timezone: z.string().default("UTC"),
  languages: z.array(z.string()).default(["English"]),
});

export const bookSessionSchema = z.object({
  mentorId: z.string().cuid(),
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().max(500).optional(),
  scheduledAt: z.coerce.date().refine((d) => d > new Date(), {
    message: "Session must be scheduled in the future",
  }),
  durationMinutes: z.number().refine((v) => [30, 45, 60, 90, 120].includes(v), {
    message: "Invalid duration",
  }),
});

export const availabilitySchema = z.record(
  z.string(),
  z.array(z.string())
);

export type MentorProfileInput = z.infer<typeof mentorProfileSchema>;
export type BookSessionInput = z.infer<typeof bookSessionSchema>;
export type AvailabilityInput = z.infer<typeof availabilitySchema>;
