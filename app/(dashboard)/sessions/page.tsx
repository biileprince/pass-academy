import { Metadata } from "next";
import Link from "next/link";
import { getMySessionsAsStudent } from "@/app/actions/mentorship";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Calendar, ArrowRight, ExternalLink } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "My Sessions" };

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600",
  COMPLETED: "bg-gray-100 text-gray-600",
};

export default async function SessionsPage() {
  const result = await getMySessionsAsStudent();
  const allSessions = result.success ? result.data : [];

  const upcoming = allSessions.filter(
    (s) => s.status !== "CANCELLED" && s.status !== "COMPLETED" && new Date(s.scheduledAt) >= new Date()
  );
  const past = allSessions.filter(
    (s) => s.status === "COMPLETED" || new Date(s.scheduledAt) < new Date()
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Sessions</h1>
        <Button asChild>
          <Link href="/mentorship">
            <ArrowRight className="mr-2 h-4 w-4" /> Book a session
          </Link>
        </Button>
      </div>

      {allSessions.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-10 w-10" />}
          title="No sessions booked"
          description="Find a mentor and book your first one-on-one session."
          action={<Button asChild><Link href="/mentorship">Find a mentor</Link></Button>}
        />
      ) : (
        <>
          {upcoming.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-semibold">Upcoming</h2>
              {upcoming.map((s) => (
                <Card key={s.id}>
                  <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                    <div className="space-y-0.5">
                      <p className="font-medium text-sm">{s.title}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(s.scheduledAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[s.status] ?? ""}`}>
                        {s.status}
                      </span>
                      {s.meetingUrl && (
                        <Button size="sm" asChild>
                          <a href={s.meetingUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-1 h-3 w-3" /> Join
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </section>
          )}

          {past.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-semibold text-muted-foreground">Past sessions</h2>
              {past.slice(0, 5).map((s) => (
                <Card key={s.id} className="opacity-70">
                  <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                    <div className="space-y-0.5">
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
        </>
      )}
    </div>
  );
}
