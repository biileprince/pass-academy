"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { webinarSchema, type WebinarInput } from "@/lib/validations/webinar";
import { createWebinar } from "@/app/actions/webinars";

export function CreateWebinarForm() {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<WebinarInput>({
    resolver: zodResolver(webinarSchema),
    defaultValues: { isPublic: true, isFree: true, durationMins: 60, tags: [] },
  });

  async function onSubmit(data: WebinarInput) {
    const result = await createWebinar(data);
    if (!result.success) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
      return;
    }
    toast({ title: "Webinar created!" });
    router.push(`/webinars/${result.data.slug}`);
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Leadership in the Digital Age" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hostName">Host / Speaker name</Label>
            <Input id="hostName" placeholder="Dr. Jane Smith" {...register("hostName")} />
            {errors.hostName && <p className="text-xs text-destructive">{errors.hostName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={4} placeholder="What will attendees learn?" {...register("description")} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledAt">Date & Time</Label>
              <Input id="scheduledAt" type="datetime-local" {...register("scheduledAt")} />
              {errors.scheduledAt && <p className="text-xs text-destructive">{errors.scheduledAt.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="durationMins">Duration (minutes)</Label>
              <Input id="durationMins" type="number" min={15} max={480} {...register("durationMins")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meetingUrl">Meeting URL (optional)</Label>
            <Input id="meetingUrl" placeholder="https://zoom.us/j/..." {...register("meetingUrl")} />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="isFree"
                checked={watch("isFree")}
                onCheckedChange={(v) => setValue("isFree", v)}
              />
              <Label htmlFor="isFree">Free event</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="isPublic"
                checked={watch("isPublic")}
                onCheckedChange={(v) => setValue("isPublic", v)}
              />
              <Label htmlFor="isPublic">Public</Label>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create webinar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
