import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getProfile } from "@/app/actions/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getInitials } from "@/lib/utils";
import { Edit } from "lucide-react";

export const metadata: Metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const user = await getProfile();
  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/profile/edit">
            <Edit className="mr-2 h-4 w-4" /> Edit profile
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.profile?.avatarUrl ?? user.image ?? ""} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {getInitials(user.name ?? "U")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{user.name ?? "No name set"}</h2>
              <p className="text-muted-foreground text-sm">{user.email}</p>
              <Badge className="mt-1 capitalize">{user.role.toLowerCase()}</Badge>
            </div>
          </div>

          {user.profile?.bio && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Bio</h3>
                <p className="text-sm">{user.profile.bio}</p>
              </div>
            </>
          )}

          {(user.profile?.school || user.profile?.country) && (
            <>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                {user.profile.school && (
                  <div>
                    <p className="text-muted-foreground text-xs">School</p>
                    <p className="font-medium">{user.profile.school}</p>
                  </div>
                )}
                {user.profile.country && (
                  <div>
                    <p className="text-muted-foreground text-xs">Country</p>
                    <p className="font-medium">{user.profile.country}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {user.role === "MENTOR" && !user.mentorProfile && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Become a mentor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Complete your mentor profile to start accepting session bookings.
            </p>
            <Button size="sm" asChild>
              <Link href="/profile/edit?tab=mentor">Set up mentor profile</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
