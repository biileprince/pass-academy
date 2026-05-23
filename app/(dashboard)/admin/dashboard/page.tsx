import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// Admin dashboard is rendered by the shared /dashboard page.
// Redirect there to keep a single dashboard entry point.
export default async function AdminDashboardPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/dashboard");
  redirect("/dashboard");
}
