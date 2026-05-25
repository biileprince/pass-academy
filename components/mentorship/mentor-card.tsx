import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { COURSE_CATEGORIES } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import type { User, MentorProfile, Profile } from "@/prisma/generated/prisma/client";

type MentorWithProfile = User & {
  mentorProfile: MentorProfile;
  profile: Profile | null;
};

export function MentorCard({ mentor }: { mentor: MentorWithProfile }) {
  const { mentorProfile, profile } = mentor;

  return (
    <Card className="flex flex-col hover:shadow-md hover:-translate-y-1 transition-all">
      <CardContent className="p-5 space-y-4 flex-1">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarImage src={profile?.avatarUrl ?? mentor.image ?? ""} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(mentor.name ?? "M")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h3 className="font-semibold truncate">{mentor.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{mentorProfile.headline}</p>
            {mentorProfile.rating && (
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{mentorProfile.rating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({mentorProfile.reviewCount})</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {mentorProfile.subjects.slice(0, 3).map((s) => {
            const label = COURSE_CATEGORIES.find((c) => c.value === s)?.label ?? s;
            return <Badge key={s} variant="secondary" className="text-xs">{label}</Badge>;
          })}
        </div>

        {mentorProfile.expertise.length > 0 && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {mentorProfile.expertise.slice(0, 3).join(" · ")}
          </p>
        )}
      </CardContent>

      <CardFooter className="px-5 pb-5 flex items-center justify-between gap-2">
        <div className="text-sm">
          {mentorProfile.hourlyRate ? (
            <span className="font-semibold">${Number(mentorProfile.hourlyRate)}/hr</span>
          ) : (
            <span className="text-muted-foreground text-xs">Rate on request</span>
          )}
        </div>
        <Button size="sm" asChild>
          <Link href={`/mentorship/${mentor.id}`}>View profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
