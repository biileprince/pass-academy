import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, Clock, Users, Play, Lock, CheckCircle } from "lucide-react";
import { getCourseBySlug } from "@/app/actions/courses";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/page-header";
import { COURSE_CATEGORIES } from "@/lib/constants";
import { formatDuration } from "@/lib/utils";
import type { Metadata } from "next";

type Props = { params: Promise<{ courseId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseId } = await params;
  const result = await getCourseBySlug(courseId);
  if (!result.success) return { title: "Course Not Found" };
  return {
    title: result.data.title,
    description: result.data.shortDesc ?? result.data.description ?? undefined,
  };
}

export default async function CoursePage({ params }: Props) {
  const { courseId } = await params;
  const [result, session] = await Promise.all([getCourseBySlug(courseId), auth()]);

  if (!result.success) notFound();

  const course = result.data;

  let isEnrolled = false;
  let completedIds = new Set<string>();

  if (session?.user) {
    const [enrollment, progress] = await Promise.all([
      db.enrollment.findUnique({
        where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
      }),
      db.lessonProgress.findMany({
        where: { userId: session.user.id, isCompleted: true, lesson: { courseId: course.id } },
        select: { lessonId: true },
      }),
    ]);
    isEnrolled = !!enrollment;
    completedIds = new Set(progress.map((p) => p.lessonId));
  }

  const categoryLabel = COURSE_CATEGORIES.find((c) => c.value === course.category)?.label ?? course.category;
  const publishedLessons = course.lessons;
  const freeLessons = publishedLessons.filter((l) => l.isFree);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-background border-b">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge>{categoryLabel}</Badge>
                <Badge variant="outline" className="capitalize">{course.level.toLowerCase()}</Badge>
                {course.isFree && <Badge variant="secondary">Free</Badge>}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">{course.title}</h1>
              {course.shortDesc && (
                <p className="text-lg text-muted-foreground">{course.shortDesc}</p>
              )}
              <div className="flex flex-wrap gap-5 text-sm text-muted-foreground pt-2">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" /> {publishedLessons.length} lessons
                </span>
                {course.totalDuration > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> {formatDuration(course.totalDuration)}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" /> {course._count.enrollments} students
                </span>
              </div>
            </div>

            {/* Enroll card */}
            <div>
              <Card className="sticky top-24 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div className="text-2xl font-bold">
                    {course.isFree ? (
                      <span className="text-primary">Free</span>
                    ) : (
                      <span>${(course.price ?? 0).toFixed(2)}</span>
                    )}
                  </div>

                  {isEnrolled ? (
                    <Button className="w-full" asChild>
                      <Link href={`/my-courses/${course.slug}/lessons/${publishedLessons[0]?.slug ?? ""}`}>
                        Continue Learning
                      </Link>
                    </Button>
                  ) : session?.user ? (
                    <EnrollForm courseId={course.id} />
                  ) : (
                    <Button className="w-full" asChild>
                      <Link href={`/login?callbackUrl=/tutorials/${course.slug}`}>
                        Enroll Now — It&apos;s Free
                      </Link>
                    </Button>
                  )}

                  <ul className="text-sm text-muted-foreground space-y-1.5">
                    <li>✓ {publishedLessons.length} on-demand lessons</li>
                    {freeLessons.length > 0 && <li>✓ {freeLessons.length} free preview lessons</li>}
                    <li>✓ Full lifetime access</li>
                    <li>✓ Certificate on completion</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="md:w-2/3 space-y-8">
          {course.description && (
            <section>
              <h2 className="text-xl font-semibold mb-3">About this course</h2>
              <p className="text-muted-foreground leading-relaxed">{course.description}</p>
            </section>
          )}

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-4">Curriculum</h2>
            <div className="space-y-2">
              {publishedLessons.map((lesson, idx) => {
                const isCompleted = completedIds.has(lesson.id);
                const canAccess = isEnrolled || lesson.isFree;

                return (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center">
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      ) : canAccess ? (
                        <Play className="h-4 w-4 text-primary" />
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground w-5 flex-shrink-0">{idx + 1}.</span>
                    <div className="flex-1 min-w-0">
                      {canAccess ? (
                        <Link
                          href={isEnrolled
                            ? `/my-courses/${course.slug}/lessons/${lesson.slug}`
                            : `/tutorials/${course.slug}/lessons/${lesson.slug}`}
                          className="text-sm font-medium hover:text-primary transition-colors truncate block"
                        >
                          {lesson.title}
                        </Link>
                      ) : (
                        <span className="text-sm font-medium text-muted-foreground truncate block">
                          {lesson.title}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {lesson.isFree && <Badge variant="secondary" className="text-xs">Preview</Badge>}
                      {lesson.duration > 0 && (
                        <span className="text-xs text-muted-foreground">{formatDuration(lesson.duration)}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function EnrollForm({ courseId }: { courseId: string }) {
  async function enroll() {
    "use server";
    const { enrollInCourse } = await import("@/app/actions/courses");
    await enrollInCourse(courseId);
  }

  return (
    <form action={enroll}>
      <Button type="submit" className="w-full">Enroll Now — It&apos;s Free</Button>
    </form>
  );
}
