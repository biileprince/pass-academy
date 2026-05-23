import { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/shared/contact-form";
import { Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Enroll",
  description: "Get in touch with PAS Academy or enroll in our programs.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact & Enroll"
        description="Have questions? Ready to join? We'd love to hear from you."
      />

      <section className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Get in touch</h2>
              <p className="text-muted-foreground">
                Fill in the form and our team will get back to you within 24 hours.
                Ready to enroll? Create an account and start learning today!
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Mail, label: "Email", value: "hello@pasacademy.com" },
                { icon: MapPin, label: "Location", value: "Available worldwide, online" },
                { icon: Clock, label: "Response time", value: "Within 24 hours" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Send a message</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
