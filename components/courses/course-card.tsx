import Link from "next/link";
import Image from "next/image";
import { BookOpen, Clock, Users } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { COURSE_CATEGORIES } from "@/lib/constants";
import { formatDuration } from "@/lib/utils";
import type { Course } from "@prisma/client";

type Props = {
  course: Course & { _count?: { enrollments: number; lessons: number } };
};

export function CourseCard({ course }: Props) {
  const categoryLabel = COURSE_CATEGORIES.find((c) => c.value === course.category)?.label ?? course.category;

  return (
    <Link href={`/tutorials/${course.slug}`}>
      <Card className="h-full overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all">
        <div className="relative aspect-video bg-muted overflow-hidden">
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <BookOpen className="h-10 w-10 text-muted-foreground/40" />
            </div>
          )}
          <div className="absolute top-2 left-2 flex gap-1">
            <Badge className="text-xs">{categoryLabel}</Badge>
            {course.isFree && <Badge variant="secondary" className="text-xs">Free</Badge>}
          </div>
        </div>

        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs capitalize">{course.level.toLowerCase()}</Badge>
          </div>
          <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          {course.shortDesc && (
            <p className="text-xs text-muted-foreground line-clamp-2">{course.shortDesc}</p>
          )}
        </CardContent>

        <CardFooter className="px-4 pb-4 flex items-center gap-4 text-xs text-muted-foreground">
          {course._count && (
            <>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {course._count.lessons} lessons
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {course._count.enrollments} enrolled
              </span>
            </>
          )}
          {course.totalDuration > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(course.totalDuration)}
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
