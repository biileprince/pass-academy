import { redirect } from "next/navigation";
import Link from "next/link";
import { getProfile } from "@/app/actions/profile";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Profile" };

export default async function ProfileEditPage() {
  const user = await getProfile();
  if (!user) redirect("/login");

  async function handleSubmit(formData: FormData) {
    "use server";
    const { updateProfile } = await import("@/app/actions/profile");
    const interests = (formData.get("interests") as string ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const result = await updateProfile({
      name: formData.get("name") as string,
      bio: (formData.get("bio") as string) || undefined,
      phone: (formData.get("phone") as string) || undefined,
      country: (formData.get("country") as string) || undefined,
      school: (formData.get("school") as string) || undefined,
      gradeLevel: (formData.get("gradeLevel") as string) || undefined,
      interests,
      avatarUrl: (formData.get("avatarUrl") as string) || undefined,
    });

    if (result.success) redirect("/profile");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Profile" description="Update your personal information" />

      <Card className="max-w-2xl">
        <CardContent className="p-6">
          <form action={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={user.name ?? ""}
                required
                minLength={2}
                maxLength={60}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={user.profile?.bio ?? ""}
                rows={4}
                maxLength={500}
                placeholder="Tell us a bit about yourself..."
              />
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
              <Label htmlFor="interests">
                Interests{" "}
                <span className="text-xs text-muted-foreground">(comma-separated)</span>
              </Label>
              <Input
                id="interests"
                name="interests"
                defaultValue={(user.profile?.interests ?? []).join(", ")}
                placeholder="Math, Science, Football..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                name="avatarUrl"
                type="url"
                defaultValue={user.profile?.avatarUrl ?? user.image ?? ""}
                placeholder="https://..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit">Save Changes</Button>
              <Button variant="outline" asChild>
                <Link href="/profile">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
