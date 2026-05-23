import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Metadata } from "next";

type Props = { params: Promise<{ courseId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseId } = await params;
  const course = await db.course.findUnique({ where: { id: courseId }, select: { title: true } });
  return { title: `New Lesson — ${course?.title ?? "Course"} — Admin` };
}

export default async function AdminNewLessonPage({ params }: Props) {
  const { courseId } = await params;
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/dashboard");

  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { id: true, title: true, _count: { select: { lessons: true } } },
  });

  if (!course) notFound();
  const nextOrder = course._count.lessons + 1;

  async function handleCreate(formData: FormData) {
    "use server";
    const sess = await auth();
    if (sess?.user.role !== "ADMIN") throw new Error("Forbidden");

    const { createLesson } = await import("@/app/actions/courses");
    const result = await createLesson(courseId, {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      videoUrl: (formData.get("videoUrl") as string) || undefined,
      downloadUrl: (formData.get("downloadUrl") as string) || undefined,
      content: (formData.get("content") as string) || undefined,
      duration: Number(formData.get("duration") || 0),
      order: Number(formData.get("order") || nextOrder),
      isFree: formData.get("isFree") === "on",
      isPublished: formData.get("isPublished") === "on",
    });

    if (result.success) redirect(`/admin/courses/${courseId}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Lesson"
        description={`Adding to: ${course.title}`}
      />

      <Card className="max-w-3xl">
        <CardContent className="p-6">
          <form action={handleCreate} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Lesson Title *</Label>
              <Input id="title" name="title" required minLength={3} maxLength={100} placeholder="Introduction to..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={3} placeholder="What will students learn in this lesson?" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order">Lesson Order *</Label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  min={1}
                  required
                  defaultValue={course._count.lessons + 1}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Input id="duration" name="duration" type="number" min={0} defaultValue={0} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                name="videoUrl"
                type="url"
                placeholder="https://youtube.com/watch?v=... or UploadThing URL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="downloadUrl">Download / Resource URL</Label>
              <Input id="downloadUrl" name="downloadUrl" type="url" placeholder="https://..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Lesson Notes / Text Content</Label>
              <Textarea id="content" name="content" rows={6} placeholder="Optional text content or notes for this lesson..." />
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" name="isFree" className="rounded" />
                Free preview (accessible without enrollment)
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" name="isPublished" className="rounded" />
                Published
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit">Add Lesson</Button>
              <Button variant="outline" asChild>
                <Link href={`/admin/courses/${courseId}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
