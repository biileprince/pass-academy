import { Metadata } from "next";
import Link from "next/link";
import { getMyEnrollments } from "@/app/actions/courses";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { BookOpen, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "My Courses" };

export default async function MyCoursesPage() {
  const result = await getMyEnrollments();
  const enrollments = result.success ? result.data : [];

  if (enrollments.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <EmptyState
          icon={<BookOpen className="h-10 w-10" />}
          title="No courses yet"
          description="Browse our learning hub and enroll in your first course."
          action={
            <Button asChild>
              <Link href="/tutorials">Browse courses</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Courses</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {enrollments.map(({ course, progress, status, enrolledAt }) => (
          <Card key={course.id} className="flex flex-col">
            <CardContent className="p-5 flex-1 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <Badge variant="secondary" className="text-xs capitalize">
                  {course.category.toLowerCase()}
                </Badge>
                {status === "COMPLETED" && (
                  <Badge className="text-xs bg-green-100 text-green-700">Completed</Badge>
                )}
              </div>
              <div>
                <h3 className="font-semibold line-clamp-2">{course.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Enrolled {formatDate(enrolledAt)}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground">
                {course._count.lessons} lessons
              </p>
            </CardContent>
            <CardFooter className="px-5 pb-5">
              <Button size="sm" variant="outline" asChild className="w-full">
                <Link href={`/tutorials/${course.slug}`} className="gap-2">
                  {progress > 0 ? "Continue" : "Start"} learning
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
