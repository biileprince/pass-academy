import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  const roles = [
    {
      id: "student",
      title: "Student",
      description: "Enroll in courses and learn from expert tutors",
      icon: "👨‍🎓",
    },
    {
      id: "tutor",
      title: "Tutor",
      description: "Create and teach courses to students",
      icon: "👨‍🏫",
    },
    {
      id: "mentor",
      title: "Mentor",
      description: "Offer 1-on-1 mentorship sessions",
      icon: "👨‍💼",
    },
    {
      id: "admin",
      title: "Admin",
      description: "Manage the platform and users (invite only)",
      icon: "⚙️",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Select your role to get started with PAS Academy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => (
          <Link
            key={role.id}
            href={`/register/${role.id}`}
            className="group"
          >
            <div className="p-6 border rounded-lg hover:border-primary hover:shadow-lg transition-all cursor-pointer">
              <div className="text-4xl mb-3">{role.icon}</div>
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                {role.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {role.description}
              </p>
              <div className="mt-4 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium">Get started</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
}
