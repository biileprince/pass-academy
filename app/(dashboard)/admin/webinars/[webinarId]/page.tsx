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

type Props = { params: Promise<{ webinarId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { webinarId } = await params;
  const webinar = await db.webinar.findUnique({ where: { id: webinarId }, select: { title: true } });
  return { title: `Edit: ${webinar?.title ?? "Webinar"} — Admin` };
}

export default async function AdminWebinarEditPage({ params }: Props) {
  const { webinarId } = await params;
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/dashboard");

  const webinar = await db.webinar.findUnique({
    where: { id: webinarId },
    include: { _count: { select: { registrations: true } } },
  });

  if (!webinar) notFound();

  // Format scheduledAt for datetime-local input
  const scheduledLocal = webinar.scheduledAt.toISOString().slice(0, 16);

  async function handleUpdate(formData: FormData) {
    "use server";
    const sess = await auth();
    if (sess?.user.role !== "ADMIN") throw new Error("Forbidden");

    const tags = (formData.get("tags") as string ?? "")
      .split(",").map((t) => t.trim()).filter(Boolean);

    await db.webinar.update({
      where: { id: webinarId },
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        hostName: formData.get("hostName") as string,
        scheduledAt: new Date(formData.get("scheduledAt") as string),
        durationMins: Number(formData.get("durationMins") || 60),
        meetingUrl: (formData.get("meetingUrl") as string) || null,
        replayUrl: (formData.get("replayUrl") as string) || null,
        thumbnailUrl: (formData.get("thumbnailUrl") as string) || null,
        maxAttendees: formData.get("maxAttendees") ? Number(formData.get("maxAttendees")) : null,
        isFree: formData.get("isFree") === "on",
        isPublic: formData.get("isPublic") === "on",
        status: formData.get("status") as never,
        tags,
      },
    });
    redirect("/admin/webinars");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Webinar" description={webinar.title} />

      <div className="text-sm text-muted-foreground">
        {webinar._count.registrations} registered attendees
      </div>

      <Card className="max-w-3xl">
        <CardContent className="p-6">
          <form action={handleUpdate} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" defaultValue={webinar.title} required minLength={3} maxLength={100} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={webinar.description ?? ""}
                rows={4}
                required
                minLength={20}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hostName">Host Name *</Label>
                <Input id="hostName" name="hostName" defaultValue={webinar.hostName} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={webinar.status}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="LIVE">Live</option>
                  <option value="ENDED">Ended</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Date &amp; Time *</Label>
                <Input
                  id="scheduledAt"
                  name="scheduledAt"
                  type="datetime-local"
                  defaultValue={scheduledLocal}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationMins">Duration (minutes) *</Label>
                <Input
                  id="durationMins"
                  name="durationMins"
                  type="number"
                  min={15}
                  max={480}
                  defaultValue={webinar.durationMins}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meetingUrl">Meeting URL</Label>
              <Input id="meetingUrl" name="meetingUrl" type="url" defaultValue={webinar.meetingUrl ?? ""} placeholder="https://meet.google.com/..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="replayUrl">Replay URL</Label>
              <Input id="replayUrl" name="replayUrl" type="url" defaultValue={webinar.replayUrl ?? ""} placeholder="https://youtube.com/..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
              <Input id="thumbnailUrl" name="thumbnailUrl" type="url" defaultValue={webinar.thumbnailUrl ?? ""} placeholder="https://..." />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxAttendees">Max Attendees</Label>
                <Input
                  id="maxAttendees"
                  name="maxAttendees"
                  type="number"
                  min={1}
                  defaultValue={webinar.maxAttendees ?? ""}
                  placeholder="Leave blank for unlimited"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags <span className="text-muted-foreground text-xs">(comma-separated)</span></Label>
                <Input id="tags" name="tags" defaultValue={webinar.tags.join(", ")} placeholder="math, algebra..." />
              </div>
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" name="isFree" defaultChecked={webinar.isFree} className="rounded" />
                Free
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" name="isPublic" defaultChecked={webinar.isPublic} className="rounded" />
                Public
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit">Save Changes</Button>
              <Button variant="outline" asChild>
                <Link href="/admin/webinars">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
