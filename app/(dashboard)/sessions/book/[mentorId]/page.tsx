import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { getMentorById } from "@/app/actions/mentorship";
import { auth } from "@/lib/auth";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { COURSE_CATEGORIES } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import type { Metadata } from "next";

type Props = { params: Promise<{ mentorId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { mentorId } = await params;
  const result = await getMentorById(mentorId);
  if (!result.success) return { title: "Book Session" };
  return { title: `Book a session with ${result.data.name}` };
}

const DURATIONS = [
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
];

export default async function BookSessionPage({ params }: Props) {
  const { mentorId } = await params;

  const [result, session] = await Promise.all([getMentorById(mentorId), auth()]);

  if (!result.success) notFound();
  if (!session?.user) redirect(`/login?callbackUrl=/sessions/book/${mentorId}`);

  const mentor = result.data;
  const mp = mentor.mentorProfile;
  const subjectLabels = (mp.subjects as string[]).map(
    (s) => COURSE_CATEGORIES.find((c) => c.value === s)?.label ?? s
  );

  // Min datetime: 1 hour from now
  const minDateTime = new Date(Date.now() + 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

  async function handleBook(formData: FormData) {
    "use server";
    const { bookSession } = await import("@/app/actions/mentorship");
    const result = await bookSession({
      mentorId: formData.get("mentorId") as string,
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      scheduledAt: new Date(formData.get("scheduledAt") as string),
      durationMinutes: Number(formData.get("durationMinutes")),
    });
    if (result.success) redirect("/sessions?booked=1");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Book a Session"
        description="Schedule a 1-on-1 mentorship session"
      />

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl">
        {/* Booking form */}
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <form action={handleBook} className="space-y-5">
                <input type="hidden" name="mentorId" value={mentor.id} />

                <div className="space-y-2">
                  <Label htmlFor="title">Session Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    minLength={3}
                    maxLength={100}
                    placeholder="e.g. Help with Algebra, Essay review..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">What do you want to cover?</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={3}
                    maxLength={500}
                    placeholder="Describe what you'd like to focus on in this session..."
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduledAt" className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" /> Date &amp; Time *
                    </Label>
                    <Input
                      id="scheduledAt"
                      name="scheduledAt"
                      type="datetime-local"
                      required
                      min={minDateTime}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="durationMinutes" className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" /> Duration *
                    </Label>
                    <select
                      id="durationMinutes"
                      name="durationMinutes"
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      defaultValue={60}
                    >
                      {DURATIONS.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit">Confirm Booking</Button>
                  <Button variant="outline" asChild>
                    <Link href="/sessions">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Mentor summary */}
        <div>
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={mentor.profile?.avatarUrl ?? mentor.image ?? ""} alt={mentor.name ?? ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(mentor.name ?? "")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{mentor.name}</p>
                  {mp.headline && (
                    <p className="text-xs text-muted-foreground line-clamp-1">{mp.headline}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {subjectLabels.map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                ))}
              </div>

              {mp.hourlyRate && (
                <p className="text-sm text-muted-foreground">
                  Rate: <span className="font-medium text-foreground">${String(mp.hourlyRate)}/hr</span>
                </p>
              )}

              <p className="text-xs text-muted-foreground leading-relaxed">
                Sessions are subject to mentor confirmation. You&apos;ll receive an email once confirmed.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
