"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Clock,
  User,
  Users,
  Video,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME, DASHBOARD_NAV } from "@/lib/constants";
import type { Role } from "@prisma/client";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Clock,
  User,
  Users,
  Video,
  UserCheck,
};

type Props = { role: Role };

type NavProps = {
  role: Role;
  className?: string;
  onNavigate?: () => void;
};

export function DashboardNav({ role, className, onNavigate }: NavProps) {
  const pathname = usePathname();
  const links = DASHBOARD_NAV[role] ?? DASHBOARD_NAV.STUDENT;

  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {links.map((link) => {
        const Icon = ICON_MAP[link.icon] ?? LayoutDashboard;
        const active = pathname === link.href || pathname.startsWith(link.href + "/");
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardSidebar({ role }: Props) {
  return (
    <aside className="hidden md:flex w-60 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <div className="h-7 w-7 rounded-lg bg-white/90 flex items-center justify-center ring-1 ring-black/5">
            <Image
              src="/pas-logo.jpeg"
              alt="PAS Academy logo"
              width={28}
              height={28}
              className="h-6 w-6 object-contain"
            />
          </div>
          <span className="text-sm">{APP_NAME}</span>
        </Link>
      </div>

      <DashboardNav role={role} className="flex-1 overflow-y-auto px-2 py-4" />

      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground capitalize">
          {role.toLowerCase()} account
        </p>
      </div>
    </aside>
  );
}
