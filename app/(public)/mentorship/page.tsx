import { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { MentorCard } from "@/components/mentorship/mentor-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getMentors } from "@/app/actions/mentorship";
import { COURSE_CATEGORIES } from "@/lib/constants";
import { Users } from "lucide-react";

export const metadata: Metadata = {
  title: "PAS Connect — Mentorship",
  description: "Find an expert mentor for one-on-one guidance.",
};

async function MentorList({ subject }: { subject?: string }) {
  const result = await getMentors({ subject });
  if (!result.success) return <EmptyState title="Could not load mentors" />;

  const mentors = result.data;
  if (mentors.length === 0)
    return (
      <EmptyState
        icon={<Users className="h-10 w-10" />}
        title="No mentors found"
        description="Try a different subject filter."
      />
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {mentors.map((m) => (
        <MentorCard key={m.id} mentor={m} />
      ))}
    </div>
  );
}

function MentorSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3 p-5 border rounded-lg">
          <div className="flex gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

type PageProps = { searchParams: Promise<{ subject?: string }> };

export default async function MentorshipPage({ searchParams }: PageProps) {
  const { subject } = await searchParams;

  return (
    <>
      <PageHeader
        title="PAS Connect"
        description="Connect. Learn. Grow. — Find your perfect mentor today."
      />

      <section className="container mx-auto px-4 py-10 max-w-7xl space-y-8">
        <div className="flex flex-wrap gap-2">
          <Button variant={!subject ? "default" : "outline"} size="sm" asChild>
            <Link href="/mentorship">All subjects</Link>
          </Button>
          {COURSE_CATEGORIES.map((c) => (
            <Button
              key={c.value}
              variant={subject === c.value ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link href={`/mentorship?subject=${c.value}`}>{c.label}</Link>
            </Button>
          ))}
        </div>

        <Suspense fallback={<MentorSkeleton />}>
          <MentorList subject={subject} />
        </Suspense>
      </section>
    </>
  );
}
