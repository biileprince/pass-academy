import { z } from "zod";

export const webinarSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters"),
  hostName: z.string().min(2, "Host name is required"),
  scheduledAt: z.coerce.date().refine((d) => d > new Date(), {
    message: "Webinar must be scheduled in the future",
  }),
  durationMins: z.coerce.number().min(15).max(480),
  meetingUrl: z.string().url().optional().or(z.literal("")),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  maxAttendees: z.coerce.number().min(1).optional(),
  isPublic: z.boolean().default(true),
  isFree: z.boolean().default(true),
  tags: z.array(z.string()).max(10).default([]),
});

export type WebinarInput = z.infer<typeof webinarSchema>;
