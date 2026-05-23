"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { updateSessionStatus, cancelSession } from "@/app/actions/mentorship";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { SessionStatus } from "@prisma/client";

type Props = { sessionId: string; status: SessionStatus };

export function MentorSessionActions({ sessionId, status }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handle(action: "confirm" | "complete" | "cancel") {
    setLoading(action);
    let result;
    if (action === "cancel") {
      result = await cancelSession(sessionId);
    } else {
      result = await updateSessionStatus(sessionId, action === "confirm" ? "CONFIRMED" : "COMPLETED");
    }
    setLoading(null);

    if (!result.success) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Updated!" });
      router.refresh();
    }
  }

  return (
    <div className="flex gap-2">
      {status === "PENDING" && (
        <>
          <Button size="sm" onClick={() => handle("confirm")} disabled={loading !== null}>
            {loading === "confirm" && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
            Confirm
          </Button>
          <Button size="sm" variant="outline" onClick={() => handle("cancel")} disabled={loading !== null}>
            {loading === "cancel" && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
            Decline
          </Button>
        </>
      )}
      {status === "CONFIRMED" && (
        <>
          <Button size="sm" variant="outline" onClick={() => handle("complete")} disabled={loading !== null}>
            {loading === "complete" && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
            Mark complete
          </Button>
          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handle("cancel")} disabled={loading !== null}>
            Cancel
          </Button>
        </>
      )}
    </div>
  );
}
