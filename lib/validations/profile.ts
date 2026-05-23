import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60),
  bio: z.string().max(500).optional(),
  phone: z.string().max(20).optional(),
  country: z.string().max(60).optional(),
  school: z.string().max(100).optional(),
  gradeLevel: z.string().max(50).optional(),
  interests: z.array(z.string()).max(10).default([]),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;
