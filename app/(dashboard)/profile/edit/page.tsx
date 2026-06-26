import { redirect } from "next/navigation";
import Link from "next/link";
import { getProfile } from "@/app/actions/profile";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Profile" };

export default async function ProfileEditPage() {
  const user = await getProfile();
  if (!user) redirect("/login");

  const isTutor = user.role === "TUTOR";
  const isMentor = user.role === "MENTOR";

  async function handleSubmit(formData: FormData) {
    "use server";
    const { updateProfile, updateTutorProfile, updateMentorProfile } = await import("@/app/actions/profile");

    const interests = (formData.get("interests") as string ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const profileResult = await updateProfile({
      name: formData.get("name") as string,
      bio: (formData.get("bio") as string) || undefined,
      phone: (formData.get("phone") as string) || undefined,
      country: (formData.get("country") as string) || undefined,
      school: (formData.get("school") as string) || undefined,
      gradeLevel: (formData.get("gradeLevel") as string) || undefined,
      interests,
      avatarUrl: (formData.get("avatarUrl") as string) || undefined,
    });

    if (user.role === "TUTOR") {
      const expertise = (formData.get("expertise") as string ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const subjects = (formData.get("subjects") as string ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const qualifications = (formData.get("qualifications") as string ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const languages = (formData.get("languages") as string ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await updateTutorProfile({
        headline: (formData.get("headline") as string) || `${user.name ?? "Tutor"} teaching PAS Academy courses`,
        bio: (formData.get("tutorBio") as string) || undefined,
        expertise,
        subjects,
        yearsExperience: Number(formData.get("yearsExperience") || 0),
        qualifications,
        languages,
      });
    }

    if (user.role === "MENTOR") {
      const expertise = (formData.get("expertise") as string ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const subjects = (formData.get("subjects") as string ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const languages = (formData.get("languages") as string ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await updateMentorProfile({
        headline: (formData.get("headline") as string) || `${user.name ?? "Mentor"} guiding students at PAS Academy`,
        expertise,
        subjects,
        yearsExperience: Number(formData.get("yearsExperience") || 0),
        hourlyRate: Number(formData.get("hourlyRate") || 0),
        timezone: (formData.get("timezone") as string) || "UTC",
        languages,
        availability: undefined,
      });
    }

    if (profileResult.success) redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isTutor ? "Complete your tutor profile" : isMentor ? "Complete your mentor profile" : "Edit your student profile"}
        description="Set up the information that will help students and learners find the right support."
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardContent className="p-6">
            <form action={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" name="name" defaultValue={user.name ?? ""} required minLength={2} maxLength={60} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" name="bio" defaultValue={user.profile?.bio ?? ""} rows={4} maxLength={500} placeholder="Tell us a bit about yourself..." />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" defaultValue={user.profile?.phone ?? ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" name="country" defaultValue={user.profile?.country ?? ""} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="school">School / Institution</Label>
                  <Input id="school" name="school" defaultValue={user.profile?.school ?? ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gradeLevel">Grade / Year</Label>
                  <Input id="gradeLevel" name="gradeLevel" defaultValue={user.profile?.gradeLevel ?? ""} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests">Interests <span className="text-xs text-muted-foreground">(comma-separated)</span></Label>
                <Input id="interests" name="interests" defaultValue={(user.profile?.interests ?? []).join(", ")} placeholder="Math, Science, Football..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input id="avatarUrl" name="avatarUrl" type="url" defaultValue={user.profile?.avatarUrl ?? user.image ?? ""} placeholder="https://..." />
              </div>

              {(isTutor || isMentor) && (
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="space-y-2">
                    <Label htmlFor="headline">Professional headline</Label>
                    <Input id="headline" name="headline" defaultValue={isTutor ? user.tutorProfile?.headline ?? "" : user.mentorProfile?.headline ?? ""} placeholder="Helping students master math and science" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expertise">Expertise <span className="text-xs text-muted-foreground">(comma-separated)</span></Label>
                    <Input id="expertise" name="expertise" defaultValue={(isTutor ? user.tutorProfile?.expertise : user.mentorProfile?.expertise)?.join(", ") ?? ""} placeholder="Teaching, Strategy, Content creation" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subjects">Subjects / Focus areas <span className="text-xs text-muted-foreground">(comma-separated)</span></Label>
                    <Input id="subjects" name="subjects" defaultValue={(isTutor ? user.tutorProfile?.subjects : user.mentorProfile?.subjects)?.join(", ") ?? ""} placeholder="MATH, SCIENCE, MEDIA" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="yearsExperience">Years of experience</Label>
                      <Input id="yearsExperience" name="yearsExperience" type="number" min="0" defaultValue={isTutor ? user.tutorProfile?.yearsExperience ?? 0 : user.mentorProfile?.yearsExperience ?? 0} />
                    </div>
                    {isMentor && (
                      <div className="space-y-2">
                        <Label htmlFor="hourlyRate">Hourly rate (USD)</Label>
                        <Input id="hourlyRate" name="hourlyRate" type="number" min="0" step="0.01" defaultValue={user.mentorProfile?.hourlyRate?.toString() ?? ""} />
                      </div>
                    )}
                  </div>

                  {isTutor && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="tutorBio">Teaching bio</Label>
                        <Textarea id="tutorBio" name="tutorBio" defaultValue={user.tutorProfile?.bio ?? ""} rows={4} maxLength={800} placeholder="Describe your teaching style and what students will learn." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="qualifications">Qualifications <span className="text-xs text-muted-foreground">(comma-separated)</span></Label>
                        <Input id="qualifications" name="qualifications" defaultValue={user.tutorProfile?.qualifications?.join(", ") ?? ""} placeholder="B.Ed, Google Certified Educator" />
                      </div>
                    </>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="languages">Languages <span className="text-xs text-muted-foreground">(comma-separated)</span></Label>
                      <Input id="languages" name="languages" defaultValue={(isTutor ? user.tutorProfile?.languages : user.mentorProfile?.languages)?.join(", ") ?? ""} placeholder="English, French" />
                    </div>
                    {isMentor && (
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Input id="timezone" name="timezone" defaultValue={user.mentorProfile?.timezone ?? "UTC"} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button type="submit">Save profile</Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Skip for now</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What you can do next</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {isTutor ? (
                <>
                  <p>• Create and publish courses for students.</p>
                  <p>• Track enrolled learners and support their progress.</p>
                  <p>• Build a trusted teaching profile in the PAS Academy community.</p>
                </>
              ) : isMentor ? (
                <>
                  <p>• Accept mentorship sessions and guide students.</p>
                  <p>• Share your availability and area of expertise.</p>
                  <p>• Help learners with academic, media, and career growth.</p>
                </>
              ) : (
                <>
                  <p>• Explore tutorials and learning resources.</p>
                  <p>• Book mentorship sessions and join webinars.</p>
                  <p>• Build a personal learning profile for support and recommendations.</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Role-based access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Students can enroll in courses and book mentor sessions.</p>
              <p>Tutors can create lessons, publish courses, and manage learners.</p>
              <p>Mentors can host sessions, share availability, and guide students.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
