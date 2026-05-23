import { Metadata } from "next";
import { getMySessionsAsMentor, updateSessionStatus, cancelSession } from "@/app/actions/mentorship";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { MentorSessionActions } from "@/components/mentorship/mentor-session-actions";
import { Calendar } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "My Sessions — Mentor" };

export default async function MentorSessionsPage() {
  const result = await getMySessionsAsMentor();
  const sessions = result.success ? result.data : [];

  const pending = sessions.filter((s) => s.status === "PENDING");
  const confirmed = sessions.filter(
    (s) => s.status === "CONFIRMED" && new Date(s.scheduledAt) >= new Date()
  );
  const past = sessions.filter(
    (s) => s.status === "COMPLETED" || (s.status === "CONFIRMED" && new Date(s.scheduledAt) < new Date())
  );

  if (sessions.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Sessions</h1>
        <EmptyState
          icon={<Calendar className="h-10 w-10" />}
          title="No session requests yet"
          description="Once students book sessions with you they will appear here."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Sessions</h1>

      {pending.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold flex items-center gap-2">
            Pending Requests
            <Badge className="bg-yellow-100 text-yellow-700 text-xs">{pending.length}</Badge>
          </h2>
          {pending.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-medium text-sm">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(s.scheduledAt)}</p>
                  {s.description && (
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm">{s.description}</p>
                  )}
                </div>
                <MentorSessionActions sessionId={s.id} status="PENDING" />
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {confirmed.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold">Upcoming</h2>
          {confirmed.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-medium text-sm">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(s.scheduledAt)}</p>
                </div>
                <MentorSessionActions sessionId={s.id} status="CONFIRMED" />
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {past.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold text-muted-foreground">Past</h2>
          {past.slice(0, 10).map((s) => (
            <Card key={s.id} className="opacity-70">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(s.scheduledAt)}</p>
                </div>
                <Badge variant="outline" className="capitalize text-xs">
                  {s.status.toLowerCase()}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
