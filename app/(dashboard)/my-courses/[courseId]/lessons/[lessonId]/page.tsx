import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Download, FileText } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

type Props = { params: Promise<{ courseId: string; lessonId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseId, lessonId } = await params;
  const lesson = await db.lesson.findFirst({
    where: { slug: lessonId, course: { slug: courseId } },
    select: { title: true },
  });
  return { title: lesson?.title ?? "Lesson" };
}

export default async function LessonViewerPage({ params }: Props) {
  const { courseId, lessonId } = await params;
  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=/my-courses/${courseId}/lessons/${lessonId}`);

  const course = await db.course.findUnique({
    where: { slug: courseId },
    include: {
      lessons: {
        where: { isPublished: true },
        orderBy: { order: "asc" },
        select: { id: true, title: true, slug: true, duration: true, isFree: true, order: true },
      },
    },
  });

  if (!course) notFound();

  // Verify enrollment
  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  });
  if (!enrollment) redirect(`/tutorials/${courseId}`);

  const lesson = await db.lesson.findFirst({
    where: { slug: lessonId, courseId: course.id, isPublished: true },
  });
  if (!lesson) notFound();

  const [lessonProgress, allProgress] = await Promise.all([
    db.lessonProgress.findUnique({
      where: { userId_lessonId: { userId: session.user.id, lessonId: lesson.id } },
    }),
    db.lessonProgress.findMany({
      where: { userId: session.user.id, isCompleted: true, lesson: { courseId: course.id } },
      select: { lessonId: true },
    }),
  ]);

  const completedIds = new Set(allProgress.map((p) => p.lessonId));
  const isCompleted = lessonProgress?.isCompleted ?? false;

  const lessonIndex = course.lessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = lessonIndex > 0 ? course.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < course.lessons.length - 1 ? course.lessons[lessonIndex + 1] : null;
  const overallProgress = course.lessons.length > 0
    ? (completedIds.size / course.lessons.length) * 100
    : 0;

  const currentLessonId = lesson.id;
  const currentLessonDuration = lesson.duration;

  async function markComplete() {
    "use server";
    const { updateLessonProgress } = await import("@/app/actions/courses");
    await updateLessonProgress(currentLessonId, currentLessonDuration, true);
  }

  async function markIncomplete() {
    "use server";
    const { updateLessonProgress } = await import("@/app/actions/courses");
    await updateLessonProgress(currentLessonId, 0, false);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-0 -m-6 min-h-screen">
      {/* Main content */}
      <div className="flex-1 min-w-0 p-6 space-y-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/my-courses" className="hover:text-foreground transition-colors">My Courses</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/tutorials/${course.slug}`} className="hover:text-foreground transition-colors line-clamp-1">
            {course.title}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground line-clamp-1">{lesson.title}</span>
        </div>

        {/* Video player */}
        {lesson.videoUrl ? (
          <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
            {lesson.videoUrl.includes("youtube.com") || lesson.videoUrl.includes("youtu.be") ? (
              <iframe
                src={lesson.videoUrl.replace("watch?v=", "embed/")}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={lesson.title}
              />
            ) : (
              <video
                src={lesson.videoUrl}
                controls
                className="w-full h-full"
                controlsList="nodownload"
              >
                Your browser does not support video playback.
              </video>
            )}
          </div>
        ) : (
          <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
            <FileText className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}

        {/* Lesson header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Lesson {lessonIndex + 1} of {course.lessons.length}</span>
              {isCompleted && <Badge className="text-xs gap-1"><CheckCircle className="h-3 w-3" /> Completed</Badge>}
            </div>
            <h1 className="text-2xl font-bold">{lesson.title}</h1>
          </div>

          <form action={isCompleted ? markIncomplete : markComplete}>
            <Button type="submit" variant={isCompleted ? "outline" : "default"} className="shrink-0">
              {isCompleted ? (
                <><Circle className="h-4 w-4 mr-2" /> Mark incomplete</>
              ) : (
                <><CheckCircle className="h-4 w-4 mr-2" /> Mark complete</>
              )}
            </Button>
          </form>
        </div>

        {lesson.description && (
          <p className="text-muted-foreground leading-relaxed">{lesson.description}</p>
        )}

        {lesson.content && (
          <>
            <Separator />
            <div className="prose prose-sm max-w-none text-foreground">
              <p className="whitespace-pre-line">{lesson.content}</p>
            </div>
          </>
        )}

        {lesson.downloadUrl && (
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Lesson Resources</p>
                  <p className="text-xs text-muted-foreground">Download the lesson materials</p>
                </div>
              </div>
              <Button size="sm" variant="outline" asChild>
                <a href={lesson.downloadUrl} target="_blank" rel="noopener noreferrer">Download</a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t">
          {prevLesson ? (
            <Button variant="outline" asChild>
              <Link href={`/my-courses/${courseId}/lessons/${prevLesson.slug}`}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Link>
            </Button>
          ) : <div />}

          {nextLesson ? (
            <Button asChild>
              <Link href={`/my-courses/${courseId}/lessons/${nextLesson.slug}`}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/my-courses">Back to My Courses</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Sidebar: lesson list */}
      <aside className="w-full lg:w-80 shrink-0 border-l bg-card">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-sm truncate">{course.title}</h2>
          <div className="flex items-center gap-2 mt-2">
            <Progress value={overallProgress} className="flex-1 h-1.5" />
            <span className="text-xs text-muted-foreground shrink-0">{Math.round(overallProgress)}%</span>
          </div>
        </div>

        <nav className="overflow-y-auto max-h-[calc(100vh-8rem)]">
          {course.lessons.map((l, idx) => {
            const isDone = completedIds.has(l.id);
            const isCurrent = l.id === lesson.id;

            return (
              <Link
                key={l.id}
                href={`/my-courses/${courseId}/lessons/${l.slug}`}
                className={`flex items-start gap-3 px-4 py-3 border-b last:border-0 transition-colors text-sm ${
                  isCurrent
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-accent text-foreground"
                }`}
              >
                <span className="shrink-0 mt-0.5">
                  {isDone ? (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <Circle className={`h-4 w-4 ${isCurrent ? "text-primary" : "text-muted-foreground"}`} />
                  )}
                </span>
                <span className="flex-1 line-clamp-2 leading-snug">
                  <span className="text-muted-foreground mr-1">{idx + 1}.</span>
                  {l.title}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
