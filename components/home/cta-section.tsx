import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTA_BG =
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=2000&q=80";

export function CTASection() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="relative isolate overflow-hidden rounded-3xl p-12 md:p-20 text-center text-white shadow-brand">
          <img
            src={CTA_BG}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 h-full w-full object-cover brightness-90 contrast-110"
          />
          <div className="absolute inset-0 -z-10 bg-brand-gradient opacity-75" />
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative space-y-5 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to start your journey?
            </h2>
            <p className="text-white/90 text-lg leading-relaxed">
              Join thousands of students growing through mentorship, learning,
              and community at PAS Academy.
            </p>
          </div>

          <div className="relative mt-10 flex flex-wrap gap-3 justify-center">
            <Button
              size="lg"
              asChild
              className="rounded-full bg-white text-primary hover:bg-white/95 border-0 shadow-lg h-12 px-7 font-semibold"
            >
              <Link href="/register" className="gap-2">
                Enroll for free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-full bg-white/10 backdrop-blur border-white/40 text-white hover:bg-white/20 hover:text-white h-12 px-7"
            >
              <Link href="/about">Learn more about us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
