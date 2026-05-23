export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type CourseFilters = {
  category?: string;
  level?: string;
  search?: string;
  isFeatured?: boolean;
};

export type MentorFilters = {
  subject?: string;
  search?: string;
};

export type WebinarFilter = "upcoming" | "past" | "all";

export type Availability = Record<string, string[]>;
