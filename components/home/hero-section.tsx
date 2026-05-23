import Link from "next/link";
import { ArrowRight, Users, BookOpen, Briefcase, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

const HERO_BG =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=80";

const CTAS = [
  { label: "Find a Mentor", href: "/mentorship", icon: Users, primary: true },
  { label: "Start Learning", href: "/tutorials", icon: BookOpen, primary: false },
  { label: "Get Career Guidance", href: "/career", icon: Briefcase, primary: false },
  { label: "Join a Webinar", href: "/webinars", icon: Video, primary: false },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background image layer */}
      <div className="absolute inset-0 -z-10">
        <img
          src={HERO_BG}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-80 brightness-95 saturate-105"
        />
        <div className="absolute inset-0 bg-brand-gradient opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/35 via-transparent to-emerald-950/55" />
        <div className="absolute -top-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-[24rem] w-[24rem] rounded-full bg-emerald-300/15 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-24 sm:py-32 lg:py-40 relative z-10">
        <div className="mx-auto max-w-3xl text-center space-y-10">
          <div className="space-y-6 text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-4 py-1.5 text-sm font-medium text-white">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
              </span>
              Open enrollment for 2025 — join 2,000+ students
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-white">
              <span className="text-white">Learn.</span>{" "}
              <span className="text-white">Create.</span>{" "}
              <span className="text-emerald-100">Connect.</span>
            </h1>

            <p className="text-lg sm:text-xl text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
              PAS Academy connects students with expert mentors, high-quality tutorials,
              and career guidance to help you reach your full potential.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {CTAS.map(({ label, href, icon: Icon, primary }) =>
              primary ? (
                <Button
                  key={href}
                  size="lg"
                  asChild
                  className="rounded-full bg-brand-gradient shadow-brand text-white border-0 hover:opacity-90 h-12 px-7"
                >
                  <Link href={href} className="gap-2">
                    <Icon className="h-4 w-4" />
                    {label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button
                  key={href}
                  size="lg"
                  variant="outline"
                  asChild
                  className="rounded-full bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/60 hover:text-white h-12 px-6 shadow-sm"
                >
                  <Link href={href} className="gap-2">
                    <Icon className="h-4 w-4 text-emerald-100" />
                    {label}
                  </Link>
                </Button>
              )
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
