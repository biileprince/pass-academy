import { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { CourseCard } from "@/components/courses/course-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCourses } from "@/app/actions/courses";
import { COURSE_CATEGORIES } from "@/lib/constants";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Learning Hub",
  description: "Browse courses in Math, English, Science, and Media.",
};

async function CourseList({ category, search }: { category?: string; search?: string }) {
  const result = await getCourses({ category, search });
  if (!result.success) return <EmptyState title="Could not load courses" />;

  const courses = result.data;
  if (courses.length === 0)
    return (
      <EmptyState
        icon={<BookOpen className="h-10 w-10" />}
        title="No courses found"
        description="Try a different category or check back later."
      />
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((c) => (
        <CourseCard key={c.id} course={c} />
      ))}
    </div>
  );
}

function CourseSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-video rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

type PageProps = { searchParams: Promise<{ category?: string; search?: string }> };

export default async function TutorialsPage({ searchParams }: PageProps) {
  const { category, search } = await searchParams;

  return (
    <>
      <PageHeader
        title="Learning Hub"
        description="Learn at your own pace with structured courses across all subjects."
      />

      <section className="container mx-auto px-4 py-10 max-w-7xl space-y-8">
        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2">
          <Button variant={!category ? "default" : "outline"} size="sm" asChild>
            <Link href="/tutorials">All</Link>
          </Button>
          {COURSE_CATEGORIES.map((c) => (
            <Button
              key={c.value}
              variant={category === c.value ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link href={`/tutorials?category=${c.value}`}>{c.label}</Link>
            </Button>
          ))}
        </div>

        <Suspense fallback={<CourseSkeleton />}>
          <CourseList category={category} search={search} />
        </Suspense>
      </section>
    </>
  );
}
