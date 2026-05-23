import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calculator, BookText, Microscope, Palette, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Programs",
  description: "Explore PAS Academy's education and media programs.",
};

const PROGRAMS = [
  {
    icon: Calculator,
    title: "Mathematics",
    category: "Education",
    level: "All levels",
    description: "From foundational arithmetic to advanced calculus — structured, practical, and exam-ready.",
    topics: ["Algebra", "Geometry", "Statistics", "Calculus"],
    href: "/tutorials?category=MATH",
  },
  {
    icon: BookText,
    title: "English & Literacy",
    category: "Education",
    level: "All levels",
    description: "Build strong reading, writing, and communication skills for school and beyond.",
    topics: ["Essay writing", "Grammar", "Literature", "Public speaking"],
    href: "/tutorials?category=ENGLISH",
  },
  {
    icon: Microscope,
    title: "Sciences",
    category: "Education",
    level: "All levels",
    description: "Explore biology, chemistry, and physics through engaging lessons and practical examples.",
    topics: ["Biology", "Chemistry", "Physics", "Environmental Science"],
    href: "/tutorials?category=SCIENCE",
  },
  {
    icon: Palette,
    title: "Media & Design",
    category: "Creative",
    level: "Beginner → Advanced",
    description: "Learn graphic design, video editing, photography, and digital content creation.",
    topics: ["Graphic Design", "Video Editing", "Photography", "Social Media"],
    href: "/tutorials?category=MEDIA",
  },
];

export default function ProgramsPage() {
  return (
    <>
      <PageHeader
        title="Our Programs"
        description="Education and creative tracks designed for students at every level."
      />

      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-6">
          {PROGRAMS.map(({ icon: Icon, title, category, level, description, topics, href }) => (
            <Card key={title} className="flex flex-col">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">{category}</Badge>
                    <Badge variant="secondary">{level}</Badge>
                  </div>
                </div>
                <div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription className="mt-1">{description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <span key={t} className="text-xs bg-muted rounded-full px-3 py-1">{t}</span>
                  ))}
                </div>
                <Button variant="outline" asChild className="self-start">
                  <Link href={href} className="gap-2">
                    Browse courses <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
