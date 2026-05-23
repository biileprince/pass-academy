import { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { Plus } from "lucide-react";

export const metadata: Metadata = { title: "Webinars — Admin" };

const STATUS_COLORS: Record<string, string> = {
  SCHEDULED: "bg-blue-100 text-blue-700",
  LIVE: "bg-red-100 text-red-700",
  ENDED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-500",
};

export default async function AdminWebinarsPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/dashboard");

  const webinars = await db.webinar.findMany({
    include: { _count: { select: { registrations: true } } },
    orderBy: { scheduledAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Webinars</h1>
        <Button asChild size="sm">
          <Link href="/admin/webinars/new">
            <Plus className="mr-2 h-4 w-4" /> New webinar
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Title</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Scheduled</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Registrations</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {webinars.map((w) => (
              <tr key={w.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <Link
                    href={`/webinars/${w.slug}`}
                    className="font-medium hover:text-primary transition-colors line-clamp-1 max-w-[200px] inline-block"
                  >
                    {w.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">{w.hostName}</p>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground text-xs">
                  {formatDateTime(w.scheduledAt)}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">{w._count.registrations}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[w.status] ?? ""}`}>
                    {w.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/webinars/${w.id}`}
                    className="text-xs text-primary hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {webinars.length === 0 && (
          <p className="text-center text-muted-foreground py-8 text-sm">No webinars yet.</p>
        )}
      </div>
    </div>
  );
}
