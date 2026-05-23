import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, BookOpen, Calendar, MessageSquare } from "lucide-react";
import { getMentorById } from "@/app/actions/mentorship";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { COURSE_CATEGORIES } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import type { Metadata } from "next";

type Props = { params: Promise<{ mentorId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { mentorId } = await params;
  const result = await getMentorById(mentorId);
  if (!result.success) return { title: "Mentor Not Found" };
  return {
    title: `${result.data.name} — Mentor`,
    description: result.data.mentorProfile.headline ?? undefined,
  };
}

export default async function MentorProfilePage({ params }: Props) {
  const { mentorId } = await params;
  const result = await getMentorById(mentorId);

  if (!result.success) notFound();

  const mentor = result.data;
  const mp = mentor.mentorProfile;
  const profile = mentor.profile;

  const subjectLabels = (mp.subjects as string[]).map(
    (s) => COURSE_CATEGORIES.find((c) => c.value === s)?.label ?? s
  );

  return (
    <div className="min-h-screen">
      {/* Hero banner */}
      <div className="bg-linear-to-br from-primary/10 via-background to-background border-b">
        <div className="container mx-auto px-4 py-16 max-w-5xl">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <Avatar className="h-28 w-28 rounded-2xl shrink-0 shadow-lg">
              <AvatarImage src={profile?.avatarUrl ?? mentor.image ?? ""} alt={mentor.name ?? ""} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground rounded-2xl">
                {getInitials(mentor.name ?? "")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-3xl font-bold">{mentor.name}</h1>
                {mp.headline && <p className="text-lg text-muted-foreground mt-1">{mp.headline}</p>}
              </div>

              <div className="flex flex-wrap gap-2">
                {subjectLabels.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>

              {profile?.country && (
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {profile.country}
                </p>
              )}

              <div className="flex flex-wrap gap-3 pt-1">
                <Button asChild size="lg">
                  <Link href={`/sessions/book/${mentor.id}`}>
                    <Calendar className="h-4 w-4 mr-2" /> Book a Session
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href={`/messages?to=${mentor.id}`}>
                    <MessageSquare className="h-4 w-4 mr-2" /> Message
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Left: bio + expertise */}
          <div className="md:col-span-2 space-y-8">
            {profile?.bio && (
              <section>
                <h2 className="text-xl font-semibold mb-3">About</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{profile.bio}</p>
              </section>
            )}

            {(mp.expertise as string[]).length > 0 && (
              <>
                <Separator />
                <section>
                  <h2 className="text-xl font-semibold mb-3">Areas of Expertise</h2>
                  <div className="flex flex-wrap gap-2">
                    {(mp.expertise as string[]).map((e) => (
                      <Badge key={e} variant="outline">{e}</Badge>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Right: quick info card */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-5">
                <h3 className="font-semibold text-base">Session Info</h3>

                <ul className="text-sm space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary shrink-0" />
                    Subjects: {subjectLabels.join(", ") || "All subjects"}
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary shrink-0" />
                    {mp.hourlyRate ? `$${mp.hourlyRate}/hr` : "Rate on request"}
                  </li>
                  {mp.languages && (mp.languages as string[]).length > 0 && (
                    <li className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary shrink-0" />
                      {(mp.languages as string[]).join(", ")}
                    </li>
                  )}
                </ul>

                <Separator />

                <Button className="w-full" asChild>
                  <Link href={`/sessions/book/${mentor.id}`}>
                    <Calendar className="h-4 w-4 mr-2" /> Book a Session
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
