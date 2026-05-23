import { Metadata } from "next";
import { getPendingMentors, approveMentor, rejectMentor } from "@/app/actions/admin";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCheck } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { COURSE_CATEGORIES } from "@/lib/constants";
import { AdminMentorActions } from "@/components/dashboard/admin-mentor-actions";

export const metadata: Metadata = { title: "Mentor Applications — Admin" };

export default async function AdminMentorsPage() {
  const pending = await getPendingMentors();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mentor Applications</h1>

      {pending.length === 0 ? (
        <EmptyState
          icon={<UserCheck className="h-10 w-10" />}
          title="No pending applications"
          description="All mentor applications have been reviewed."
        />
      ) : (
        <div className="space-y-4">
          {pending.map((user) => {
            if (!user.mentorProfile) return null;
            const mp = user.mentorProfile;
            return (
              <Card key={user.id}>
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.image ?? ""} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getInitials(user.name ?? "M")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{mp.headline}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {mp.subjects.slice(0, 3).map((s) => {
                          const label = COURSE_CATEGORIES.find((c) => c.value === s)?.label ?? s;
                          return (
                            <span key={s} className="text-xs bg-muted rounded-full px-2 py-0.5">
                              {label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <AdminMentorActions userId={user.id} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
