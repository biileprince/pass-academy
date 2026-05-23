import { notFound } from "next/navigation";
import { Calendar, Clock, Users, Video, Globe } from "lucide-react";
import { getWebinarBySlug } from "@/app/actions/webinars";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDateTime, formatDuration } from "@/lib/utils";
import type { Metadata } from "next";

type Props = { params: Promise<{ webinarId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { webinarId } = await params;
  const result = await getWebinarBySlug(webinarId);
  if (!result.success) return { title: "Webinar Not Found" };
  return {
    title: result.data.title,
    description: result.data.description ?? undefined,
  };
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  SCHEDULED: { label: "Upcoming", className: "bg-blue-100 text-blue-700" },
  LIVE: { label: "🔴 Live Now", className: "bg-red-100 text-red-700" },
  ENDED: { label: "Ended", className: "bg-gray-100 text-gray-600" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-600" },
};

export default async function WebinarDetailPage({ params }: Props) {
  const { webinarId } = await params;
  const [result, session] = await Promise.all([getWebinarBySlug(webinarId), auth()]);

  if (!result.success) notFound();

  const webinar = result.data;

  let isRegistered = false;
  if (session?.user) {
    const reg = await db.webinarRegistration.findUnique({
      where: { userId_webinarId: { userId: session.user.id, webinarId: webinar.id } },
    });
    isRegistered = !!reg;
  }

  const statusInfo = STATUS_LABELS[webinar.status] ?? STATUS_LABELS["SCHEDULED"]!;
  const isUpcoming = webinar.status === "SCHEDULED" || webinar.status === "LIVE";
  const hasReplay = webinar.status === "ENDED" && webinar.replayUrl;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-background border-b">
        <div className="container mx-auto px-4 py-16 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusInfo.className}`}>
                  {statusInfo.label}
                </span>
                {webinar.isFree && <Badge variant="secondary">Free</Badge>}
                {webinar.tags[0] && <Badge variant="outline">{webinar.tags[0]}</Badge>}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold leading-tight">{webinar.title}</h1>

              <p className="text-muted-foreground">Hosted by <span className="font-medium text-foreground">{webinar.hostName}</span></p>

              <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDateTime(webinar.scheduledAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {formatDuration(webinar.durationMins)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {webinar._count.registrations} registered
                </span>
                {webinar.maxAttendees && (
                  <span className="text-amber-600 flex items-center gap-1.5">
                    <Globe className="h-4 w-4" />
                    {webinar.maxAttendees - webinar._count.registrations} spots left
                  </span>
                )}
              </div>
            </div>

            {/* Registration card */}
            <div>
              <Card className="sticky top-24 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  {hasReplay ? (
                    <>
                      <p className="text-sm text-muted-foreground">This webinar has ended. Watch the replay below.</p>
                      <Button className="w-full" asChild>
                        <a href={webinar.replayUrl!} target="_blank" rel="noopener noreferrer">
                          <Video className="h-4 w-4 mr-2" /> Watch Replay
                        </a>
                      </Button>
                    </>
                  ) : isUpcoming ? (
                    isRegistered ? (
                      <>
                        <div className="text-center p-3 bg-primary/10 rounded-lg">
                          <p className="text-sm font-medium text-primary">You&apos;re registered!</p>
                          <p className="text-xs text-muted-foreground mt-1">We&apos;ll send you a reminder before it starts.</p>
                        </div>
                        {webinar.meetingUrl && (
                          <Button variant="outline" className="w-full" asChild>
                            <a href={webinar.meetingUrl} target="_blank" rel="noopener noreferrer">
                              <Video className="h-4 w-4 mr-2" /> Join Meeting
                            </a>
                          </Button>
                        )}
                      </>
                    ) : session?.user ? (
                      <RegisterForm webinarId={webinar.id} />
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground">Sign in to register for this webinar.</p>
                        <Button className="w-full" asChild>
                          <a href={`/login?callbackUrl=/webinars/${webinar.slug}`}>Sign In to Register</a>
                        </Button>
                      </>
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      This webinar has been {webinar.status === "CANCELLED" ? "cancelled" : "ended"}.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="md:w-2/3 space-y-8">
          {webinar.description && (
            <section>
              <h2 className="text-xl font-semibold mb-3">About this webinar</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{webinar.description}</p>
            </section>
          )}

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-4">Session Details</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex gap-3">
                <dt className="text-muted-foreground w-32 flex-shrink-0">Date &amp; Time</dt>
                <dd className="font-medium">{formatDateTime(webinar.scheduledAt)}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="text-muted-foreground w-32 flex-shrink-0">Duration</dt>
                <dd className="font-medium">{formatDuration(webinar.durationMins)}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="text-muted-foreground w-32 flex-shrink-0">Host</dt>
                <dd className="font-medium">{webinar.hostName}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="text-muted-foreground w-32 flex-shrink-0">Format</dt>
                <dd className="font-medium">Online — via video conference</dd>
              </div>
              <div className="flex gap-3">
                <dt className="text-muted-foreground w-32 flex-shrink-0">Price</dt>
                <dd className="font-medium">{webinar.isFree ? "Free" : "Paid"}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}

function RegisterForm({ webinarId }: { webinarId: string }) {
  async function register() {
    "use server";
    const { registerForWebinar } = await import("@/app/actions/webinars");
    await registerForWebinar(webinarId);
  }

  return (
    <form action={register} className="space-y-3">
      <Button type="submit" className="w-full">Register — It&apos;s Free</Button>
      <p className="text-xs text-muted-foreground text-center">
        You&apos;ll receive a confirmation email with joining instructions.
      </p>
    </form>
  );
}
