"use client";

import { useState, useEffect, useTransition } from "react";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
const DAY_LABELS: Record<string, string> = {
  mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday",
  fri: "Friday", sat: "Saturday", sun: "Sunday",
};

const TIME_SLOTS = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
  "19:00", "20:00",
];

type Availability = Record<string, string[]>;

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState<Availability>({});
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    import("@/app/actions/profile").then(({ getProfile }) => {
      getProfile().then((user) => {
        if (user?.mentorProfile?.availability) {
          setAvailability(user.mentorProfile.availability as Availability);
        }
      });
    });
  }, []);

  function toggleSlot(day: string, time: string) {
    setAvailability((prev) => {
      const slots = prev[day] ?? [];
      const updated = slots.includes(time)
        ? slots.filter((t) => t !== time)
        : [...slots, time].sort();
      return { ...prev, [day]: updated };
    });
    setSaved(false);
  }

  function handleSave() {
    startTransition(async () => {
      const { updateAvailability } = await import("@/app/actions/mentorship");
      const result = await updateAvailability(availability);
      if (result.success) setSaved(true);
    });
  }

  const totalSlots = Object.values(availability).reduce((sum, slots) => sum + slots.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Availability"
          description="Set the times you're available for mentorship sessions"
        />
        <div className="flex items-center gap-3 flex-shrink-0">
          {saved && (
            <span className="text-sm text-primary flex items-center gap-1">
              <Check className="h-4 w-4" /> Saved
            </span>
          )}
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save Availability"}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="outline">{totalSlots} slot{totalSlots !== 1 ? "s" : ""} selected</Badge>
        <span>Click a time slot to toggle your availability</span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          {/* Header */}
          <div className="grid grid-cols-8 gap-1 mb-1">
            <div className="text-xs text-muted-foreground p-2">Time</div>
            {DAYS.map((day) => (
              <div key={day} className="text-xs font-medium text-center p-2">
                {DAY_LABELS[day]?.slice(0, 3)}
              </div>
            ))}
          </div>

          {/* Slots grid */}
          {TIME_SLOTS.map((time) => (
            <div key={time} className="grid grid-cols-8 gap-1 mb-1">
              <div className="text-xs text-muted-foreground p-2 flex items-center">{time}</div>
              {DAYS.map((day) => {
                const isActive = (availability[day] ?? []).includes(time);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleSlot(day, time)}
                    className={`rounded p-2 text-xs font-medium transition-colors border ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
                    }`}
                    aria-label={`${isActive ? "Remove" : "Add"} ${DAY_LABELS[day]} ${time}`}
                  >
                    {isActive ? "✓" : ""}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Per-day summary */}
      <Card>
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold mb-3">Weekly Summary</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {DAYS.map((day) => {
              const slots = availability[day] ?? [];
              return (
                <div key={day} className="text-sm">
                  <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    {DAY_LABELS[day]}
                  </p>
                  {slots.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {slots.map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Not available</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
