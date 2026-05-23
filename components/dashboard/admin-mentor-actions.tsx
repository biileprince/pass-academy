"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { approveMentor, rejectMentor } from "@/app/actions/admin";
import { Loader2, Check, X } from "lucide-react";

export function AdminMentorActions({ userId }: { userId: string }) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  async function handle(action: "approve" | "reject") {
    setLoading(action);
    const result = action === "approve" ? await approveMentor(userId) : await rejectMentor(userId);
    setLoading(null);

    if (!result.success) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: action === "approve" ? "Mentor approved!" : "Application rejected" });
      router.refresh();
    }
  }

  return (
    <div className="flex gap-2 shrink-0">
      <Button size="sm" onClick={() => handle("approve")} disabled={loading !== null}>
        {loading === "approve" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
        <span className="ml-1">Approve</span>
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-destructive border-destructive hover:bg-destructive/10"
        onClick={() => handle("reject")}
        disabled={loading !== null}
      >
        {loading === "reject" ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
        <span className="ml-1">Reject</span>
      </Button>
    </div>
  );
}
