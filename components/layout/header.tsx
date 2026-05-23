"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NAV_LINKS, APP_NAME } from "@/lib/constants";
import { getInitials } from "@/lib/utils";

const formatRole = (role: string) => role.charAt(0) + role.slice(1).toLowerCase();

const PROGRAM_LINKS = [
  { label: "Programs Overview", href: "/programs" },
  { label: "Mentorship", href: "/mentorship" },
  { label: "Tutorials", href: "/tutorials" },
  { label: "Webinars", href: "/webinars" },
] as const;

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const roleLabel = session?.user?.role ? formatRole(session.user.role) : null;
  const navLinks = NAV_LINKS.filter(
    (link) => link.label !== "Programs" && !PROGRAM_LINKS.some((item) => item.href === link.href)
  );

  function openUserMenu() {
    if (userMenuTimer.current) clearTimeout(userMenuTimer.current);
    setUserMenuOpen(true);
  }

  function scheduleUserMenuClose() {
    if (userMenuTimer.current) clearTimeout(userMenuTimer.current);
    userMenuTimer.current = setTimeout(() => setUserMenuOpen(false), 120);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/85">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl">
          <div className="h-9 w-9 rounded-xl bg-white/90 shadow-sm ring-1 ring-black/5 flex items-center justify-center">
            <Image
              src="/pas-logo.jpeg"
              alt="PAS Academy logo"
              width={36}
              height={36}
              className="h-8 w-8 object-contain"
              priority
            />
          </div>
          <span className="hidden sm:inline text-brand-gradient">{APP_NAME}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="relative group">
            <Link
              href="/programs"
              className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              aria-haspopup="menu"
            >
              Programs
              <ChevronDown className="h-4 w-4 opacity-70" />
            </Link>
            <div className="invisible absolute left-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-background/95 p-2 shadow-lg backdrop-blur transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 opacity-0 translate-y-1">
              {PROGRAM_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {session?.user ? (
            <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onMouseEnter={openUserMenu}
                  onMouseLeave={scheduleUserMenuClose}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image ?? ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials(session.user.name ?? session.user.email ?? "U")}
                    </AvatarFallback>
                  </Avatar>
                  {roleLabel && (
                    <Badge variant="secondary" className="hidden sm:inline-flex text-[11px] uppercase tracking-wide">
                      {roleLabel}
                    </Badge>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56"
                onMouseEnter={openUserMenu}
                onMouseLeave={scheduleUserMenuClose}
              >
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium truncate">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                </div>
                {roleLabel && (
                  <div className="px-2 pb-2">
                    <Badge variant="secondary" className="text-[11px] uppercase tracking-wide">
                      {roleLabel}
                    </Badge>
                  </div>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild className="rounded-full bg-brand-gradient shadow-brand text-white hover:opacity-90 border-0">
                <Link href="/register">Get started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex flex-col gap-6 mt-6">
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 rounded-md text-sm font-semibold hover:bg-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col gap-2 border-t pt-4">
                {session?.user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user.image ?? ""} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(session.user.name ?? "U")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{session.user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                        {roleLabel && (
                          <Badge variant="secondary" className="mt-2 text-[11px] uppercase tracking-wide">
                            {roleLabel}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="justify-start">
                      <Link href="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start text-destructive hover:text-destructive"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link href="/login" onClick={() => setMobileOpen(false)}>Sign in</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/register" onClick={() => setMobileOpen(false)}>Get started</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
