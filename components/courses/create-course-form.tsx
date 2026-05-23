"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { courseSchema, type CourseInput } from "@/lib/validations/course";
import { createCourse } from "@/app/actions/courses";
import { COURSE_CATEGORIES, COURSE_LEVELS } from "@/lib/constants";

export function CreateCourseForm() {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CourseInput>({
    resolver: zodResolver(courseSchema),
    defaultValues: { isFree: true, isPublished: false, isFeatured: false, tags: [] },
  });

  async function onSubmit(data: CourseInput) {
    const result = await createCourse(data);
    if (!result.success) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
      return;
    }
    toast({ title: "Course created!" });
    router.push(`/tutorials/${result.data.slug}`);
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Introduction to Algebra" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDesc">Short description</Label>
            <Input id="shortDesc" placeholder="One-line summary (max 200 chars)" {...register("shortDesc")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Full description</Label>
            <Textarea id="description" rows={4} placeholder="Describe what students will learn..." {...register("description")} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select onValueChange={(v) => setValue("category", v as CourseInput["category"])}>
                <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  {COURSE_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Level</Label>
              <Select onValueChange={(v) => setValue("level", v as CourseInput["level"])} defaultValue="BEGINNER">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COURSE_LEVELS.map((l) => (
                    <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="isFree"
                checked={watch("isFree")}
                onCheckedChange={(v) => setValue("isFree", v)}
              />
              <Label htmlFor="isFree">Free course</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="isPublished"
                checked={watch("isPublished")}
                onCheckedChange={(v) => setValue("isPublished", v)}
              />
              <Label htmlFor="isPublished">Publish now</Label>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create course
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
