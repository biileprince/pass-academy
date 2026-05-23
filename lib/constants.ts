import { CourseCategory } from "@prisma/client";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "PAS Academy";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Mentorship", href: "/mentorship" },
  { label: "Tutorials", href: "/tutorials" },
  { label: "Webinars", href: "/webinars" },
  { label: "Contact", href: "/contact" },
] as const;

export const DASHBOARD_NAV = {
  STUDENT: [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "My Courses", href: "/my-courses", icon: "BookOpen" },
    { label: "My Sessions", href: "/sessions", icon: "Calendar" },
    { label: "Profile", href: "/profile", icon: "User" },
  ],
  MENTOR: [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "My Courses", href: "/my-courses", icon: "BookOpen" },
    { label: "Sessions", href: "/mentor/sessions", icon: "Calendar" },
    { label: "Availability", href: "/mentor/availability", icon: "Clock" },
    { label: "Profile", href: "/profile", icon: "User" },
  ],
  ADMIN: [
    { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
    { label: "Users", href: "/admin/users", icon: "Users" },
    { label: "Courses", href: "/admin/courses", icon: "BookOpen" },
    { label: "Webinars", href: "/admin/webinars", icon: "Video" },
    { label: "Mentors", href: "/admin/mentors", icon: "UserCheck" },
  ],
} as const;

export const COURSE_CATEGORIES: { value: CourseCategory; label: string }[] = [
  { value: "MATH", label: "Mathematics" },
  { value: "ENGLISH", label: "English" },
  { value: "SCIENCE", label: "Science" },
  { value: "MEDIA", label: "Media & Design" },
  { value: "OTHER", label: "Other" },
];

export const COURSE_LEVELS = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
] as const;

export const SESSION_DURATIONS = [30, 45, 60, 90, 120] as const;

export const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00",
] as const;

export const WEEKDAYS = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
] as const;

export const WEBINAR_TOPICS = [
  "Leadership",
  "Sustainability",
  "Digital Skills",
  "Personal Development",
  "Career Guidance",
  "Media & Design",
  "Academic Success",
] as const;

export const SOCIAL_LINKS = {
  twitter: "https://twitter.com/pasacademy",
  instagram: "https://instagram.com/pasacademy",
  linkedin: "https://linkedin.com/company/pasacademy",
  youtube: "https://youtube.com/@pasacademy",
} as const;
