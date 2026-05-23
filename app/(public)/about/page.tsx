import { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about PAS Academy's mission to empower students through mentorship and education.",
};

const PILLARS = [
  {
    icon: Eye,
    title: "Our Vision",
    content:
      "A world where every student, regardless of background, has access to quality mentorship, education, and career guidance to unlock their full potential.",
  },
  {
    icon: Target,
    title: "Our Mission",
    content:
      "To connect students with expert mentors and provide structured learning resources across academic subjects and media skills — empowering the next generation of leaders and creators.",
  },
  {
    icon: Heart,
    title: "Our Values",
    content:
      "Inclusivity, excellence, and community. We believe learning is a shared journey and that everyone deserves a guide, a community, and a clear path forward.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About PAS Academy"
        description="We exist to bridge the gap between students and opportunities."
      />

      <section className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid md:grid-cols-3 gap-6">
          {PILLARS.map(({ icon: Icon, title, content }) => (
            <Card key={title} className="text-center">
              <CardContent className="pt-8 pb-6 space-y-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 space-y-6 prose prose-lg dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold">Our Story</h2>
          <p className="text-muted-foreground">
            PAS Academy was founded with a simple but powerful belief: that quality education
            and mentorship should be accessible to every student, everywhere. We started as a
            small community of educators and professionals who wanted to give back — and have
            grown into a platform serving thousands of students across multiple disciplines.
          </p>
          <p className="text-muted-foreground">
            From academic tutoring to media production training, from one-on-one mentorship
            sessions to live industry webinars — PAS Academy is built for the whole student,
            not just their grades.
          </p>
        </div>
      </section>
    </>
  );
}
