import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { COURSE_CATEGORIES } from "@/lib/constants";
import { formatDuration } from "@/lib/utils";
import type { Metadata } from "next";

type Props = { params: Promise<{ courseId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseId } = await params;
  const course = await db.course.findUnique({ where: { id: courseId }, select: { title: true } });
  return { title: `Edit: ${course?.title ?? "Course"} — Admin` };
}

export default async function AdminCourseEditPage({ params }: Props) {
  const { courseId } = await params;
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/dashboard");

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: { orderBy: { order: "asc" } },
    },
  });

  if (!course) notFound();

  async function handleUpdate(formData: FormData) {
    "use server";
    const sess = await auth();
    if (sess?.user.role !== "ADMIN") throw new Error("Forbidden");

    const tags = (formData.get("tags") as string ?? "")
      .split(",").map((t) => t.trim()).filter(Boolean);

    await db.course.update({
      where: { id: courseId },
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        shortDesc: (formData.get("shortDesc") as string) || null,
        category: formData.get("category") as never,
        level: formData.get("level") as never,
        thumbnailUrl: (formData.get("thumbnailUrl") as string) || null,
        isFree: formData.get("isFree") === "true",
        price: formData.get("isFree") === "true" ? null : Number(formData.get("price") || 0),
        isPublished: formData.get("isPublished") === "on",
        isFeatured: formData.get("isFeatured") === "on",
        tags,
      },
    });
    redirect("/admin/courses");
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Edit Course" description={course.title} />

      {/* Course form */}
      <Card className="max-w-3xl">
        <CardContent className="p-6">
          <form action={handleUpdate} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" defaultValue={course.title} required minLength={3} maxLength={100} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDesc">Short Description</Label>
              <Input id="shortDesc" name="shortDesc" defaultValue={course.shortDesc ?? ""} maxLength={200} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Full Description *</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={course.description}
                rows={5}
                required
                minLength={20}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  name="category"
                  required
                  defaultValue={course.category}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {COURSE_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Level *</Label>
                <select
                  id="level"
                  name="level"
                  required
                  defaultValue={course.level}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
              <Input id="thumbnailUrl" name="thumbnailUrl" type="url" defaultValue={course.thumbnailUrl ?? ""} placeholder="https://..." />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="isFree">Pricing</Label>
                <select
                  id="isFree"
                  name="isFree"
                  defaultValue={course.isFree ? "true" : "false"}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="true">Free</option>
                  <option value="false">Paid</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min={0}
                  step={0.01}
                  defaultValue={String(course.price ?? "")}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags <span className="text-muted-foreground text-xs">(comma-separated)</span></Label>
              <Input
                id="tags"
                name="tags"
                defaultValue={Array.isArray(course.tags) ? course.tags.join(", ") : ""}
                placeholder="algebra, equations..."
              />
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" name="isPublished" defaultChecked={course.isPublished} className="rounded" />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" name="isFeatured" defaultChecked={course.isFeatured} className="rounded" />
                Featured
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit">Save Changes</Button>
              <Button variant="outline" asChild>
                <Link href="/admin/courses">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lessons section */}
      <div className="max-w-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Lessons ({course.lessons.length})</h2>
          <Button size="sm" asChild>
            <Link href={`/admin/courses/${courseId}/lessons/new`}>
              <Plus className="h-4 w-4 mr-1" /> Add Lesson
            </Link>
          </Button>
        </div>

        {course.lessons.length === 0 ? (
          <p className="text-sm text-muted-foreground">No lessons yet. Add your first lesson above.</p>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-2.5 font-medium">#</th>
                  <th className="text-left px-4 py-2.5 font-medium">Title</th>
                  <th className="text-left px-4 py-2.5 font-medium hidden sm:table-cell">Duration</th>
                  <th className="text-left px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {course.lessons.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-muted/30">
                    <td className="px-4 py-2.5 text-muted-foreground">{lesson.order}</td>
                    <td className="px-4 py-2.5">
                      <p className="font-medium line-clamp-1">{lesson.title}</p>
                      {lesson.isFree && <span className="text-xs text-primary">Free preview</span>}
                    </td>
                    <td className="px-4 py-2.5 hidden sm:table-cell text-muted-foreground text-xs">
                      {lesson.duration > 0 ? formatDuration(lesson.duration) : "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge variant={lesson.isPublished ? "default" : "secondary"} className="text-xs">
                        {lesson.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
