import Link from "next/link";
import { Calendar, Clock, Users } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime, formatDuration } from "@/lib/utils";
import type { Webinar } from "@/prisma/generated/prisma/client";

const STATUS_STYLES: Record<string, string> = {
  SCHEDULED: "bg-blue-100 text-blue-700",
  LIVE: "bg-red-100 text-red-700 animate-pulse",
  ENDED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-600",
};

type Props = {
  webinar: Webinar & { _count?: { registrations: number } };
};

export function WebinarCard({ webinar }: Props) {
  return (
    <Card className="flex flex-col hover:shadow-md hover:-translate-y-1 transition-all">
      <CardContent className="p-5 space-y-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[webinar.status] ?? ""}`}>
            {webinar.status === "LIVE" ? "🔴 LIVE" : webinar.status}
          </span>
          {webinar.isFree && <Badge variant="secondary" className="text-xs">Free</Badge>}
        </div>

        <div>
          <h3 className="font-semibold leading-snug line-clamp-2">{webinar.title}</h3>
          <p className="text-xs text-muted-foreground mt-1">Hosted by {webinar.hostName}</p>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{webinar.description}</p>

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDateTime(webinar.scheduledAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDuration(webinar.durationMins)}
          </span>
          {webinar._count && (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {webinar._count.registrations} registered
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-5 pb-5">
        <Button size="sm" variant={webinar.status === "ENDED" ? "outline" : "default"} asChild className="w-full">
          <Link href={`/webinars/${webinar.slug}`}>
            {webinar.status === "ENDED" ? "Watch replay" : "View details"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
