"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut, Menu, Settings, User } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardNav } from "@/components/layout/dashboard-sidebar";
import { APP_NAME } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import type { Session } from "next-auth";

type Props = { user: Session["user"] };

const formatRole = (role: string) =>
  role.charAt(0) + role.slice(1).toLowerCase();

export function DashboardHeader({ user }: Props) {
  const roleLabel = user.role ? formatRole(user.role) : null;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-3 md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background hover:bg-accent"
              aria-label="Open dashboard menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
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
            <DashboardNav
              role={user.role}
              className="px-2 py-4"
              onNavigate={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>
        <span className="text-sm font-semibold text-foreground">Dashboard</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.image ?? ""} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {getInitials(user.name ?? user.email ?? "U")}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
              {user.name ?? user.email}
            </span>
            {roleLabel && (
              <Badge
                variant="secondary"
                className="hidden sm:inline-flex text-[11px] uppercase tracking-wide"
              >
                {roleLabel}
              </Badge>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
          {roleLabel && (
            <div className="px-2 pb-2">
              <Badge
                variant="secondary"
                className="text-[11px] uppercase tracking-wide"
              >
                {roleLabel}
              </Badge>
            </div>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" /> Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile/edit">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
