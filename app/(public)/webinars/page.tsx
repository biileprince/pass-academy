import { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { WebinarCard } from "@/components/webinars/webinar-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getWebinars } from "@/app/actions/webinars";
import { Video } from "lucide-react";
import type { WebinarFilter } from "@/types";

export const metadata: Metadata = {
  title: "Webinars & Events",
  description: "Join live webinars and watch recorded sessions from industry leaders.",
};

async function WebinarList({ filter }: { filter: WebinarFilter }) {
  const result = await getWebinars(filter);
  if (!result.success) return <EmptyState title="Could not load webinars" />;

  const webinars = result.data;
  if (webinars.length === 0)
    return (
      <EmptyState
        icon={<Video className="h-10 w-10" />}
        title={filter === "upcoming" ? "No upcoming webinars" : "No past webinars"}
        description="Check back soon for new events."
      />
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {webinars.map((w) => (
        <WebinarCard key={w.id} webinar={w} />
      ))}
    </div>
  );
}

function WebinarSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3 p-5 border rounded-lg">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

type PageProps = { searchParams: Promise<{ tab?: string }> };

export default async function WebinarsPage({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  const filter: WebinarFilter = tab === "past" ? "past" : "upcoming";

  return (
    <>
      <PageHeader
        title="Webinars & Events"
        description="Learn beyond the classroom from industry leaders and experts."
      />

      <section className="container mx-auto px-4 py-10 max-w-7xl space-y-8">
        <div className="flex gap-2">
          <Button variant={filter === "upcoming" ? "default" : "outline"} size="sm" asChild>
            <Link href="/webinars">Upcoming</Link>
          </Button>
          <Button variant={filter === "past" ? "default" : "outline"} size="sm" asChild>
            <Link href="/webinars?tab=past">Past & Replays</Link>
          </Button>
        </div>

        <Suspense fallback={<WebinarSkeleton />}>
          <WebinarList filter={filter} />
        </Suspense>
      </section>
    </>
  );
}
