import { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { COURSE_CATEGORIES } from "@/lib/constants";
import { Plus } from "lucide-react";

export const metadata: Metadata = { title: "Courses — Admin" };

export default async function AdminCoursesPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/dashboard");

  const courses = await db.course.findMany({
    include: { _count: { select: { enrollments: true, lessons: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Courses</h1>
        <Button asChild size="sm">
          <Link href="/admin/courses/new">
            <Plus className="mr-2 h-4 w-4" /> New course
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Title</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Lessons</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Enrolled</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Created</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {courses.map((course) => {
              const cat = COURSE_CATEGORIES.find((c) => c.value === course.category);
              return (
                <tr key={course.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/tutorials/${course.slug}`}
                      className="font-medium hover:text-primary transition-colors line-clamp-1 max-w-[200px] inline-block"
                    >
                      {course.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                    {cat?.label ?? course.category}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">{course._count.lessons}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">{course._count.enrollments}</td>
                  <td className="px-4 py-3">
                    <Badge variant={course.isPublished ? "default" : "secondary"} className="text-xs">
                      {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                    {formatDate(course.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/courses/${course.id}`}
                      className="text-xs text-primary hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {courses.length === 0 && (
          <p className="text-center text-muted-foreground py-8 text-sm">No courses yet.</p>
        )}
      </div>
    </div>
  );
}
