import type { Role } from "@/prisma/generated/prisma/client";

/**
 * Get the appropriate dashboard URL based on user role
 */
export function getDashboardUrl(role?: Role | null): string {
  if (!role) return "/dashboard";

  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "MENTOR":
      return "/profile/edit?tab=mentor";
    case "TUTOR":
      return "/profile/edit?tab=tutor";
    case "STUDENT":
      return "/dashboard";
    default:
      return "/dashboard";
  }
}

/**
 * Get the appropriate profile edit URL based on user role
 */
export function getProfileUrl(role?: Role | null): string {
  if (!role) return "/profile";

  switch (role) {
    case "ADMIN":
      return "/profile";
    case "MENTOR":
      return "/profile/edit?tab=mentor";
    case "TUTOR":
      return "/profile/edit?tab=tutor";
    case "STUDENT":
      return "/profile";
    default:
      return "/profile";
  }
}
