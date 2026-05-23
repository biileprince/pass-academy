import Link from "next/link";
import { Users, BookOpen, Briefcase, Video, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  {
    icon: Users,
    title: "PAS Connect",
    subtitle: "Mentorship",
    description:
      "Get matched with an expert mentor for one-on-one guidance in academics, media, and career development.",
    href: "/mentorship",
    badge: "Phase 1",
    highlights: ["Student & mentor profiles", "Session booking", "Chat & video"],
  },
  {
    icon: BookOpen,
    title: "Learning Hub",
    subtitle: "Tutorials",
    description:
      "Access structured courses in Math, English, Science, and Media — on your own schedule.",
    href: "/tutorials",
    badge: "Phase 1",
    highlights: ["Video lessons", "Live classes", "Downloadable resources"],
  },
  {
    icon: Briefcase,
    title: "Career Centre",
    subtitle: "Career Guidance",
    description:
      "Navigate your path from school to career with expert counselling, CV building, and skill assessments.",
    href: "/career",
    badge: "Phase 2",
    highlights: ["Career advice", "CV building", "Skill assessments"],
  },
  {
    icon: Video,
    title: "Events Hub",
    subtitle: "Webinars & Events",
    description:
      "Join live webinars and hear from industry leaders on leadership, sustainability, and digital skills.",
    href: "/webinars",
    badge: "Phase 1",
    highlights: ["Live webinars", "Guest speakers", "Recorded replays"],
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 sm:py-32 border-t border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center space-y-4">
          <h2 className="text-base font-bold leading-7 text-primary uppercase tracking-wide">
            Made for students
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Everything you need to{" "}
            <span className="text-brand-gradient">succeed</span>
          </p>
          <p className="text-lg leading-8 text-muted-foreground">
            Four pillars designed to support your academic, creative, and professional journey.
          </p>
        </div>

        <div className="mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl">
          {FEATURES.map(({ icon: Icon, title, subtitle, description, href, badge, highlights }) => (
            <Link
              key={href}
              href={href}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/30"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient shadow-brand">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <Badge variant="secondary" className="text-[10px]">{badge}</Badge>
              </div>
              <div className="mt-5 space-y-1">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">{subtitle}</p>
                <h3 className="text-lg font-bold">{title}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{description}</p>
              <ul className="mt-4 space-y-1.5">
                {highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                Explore <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
