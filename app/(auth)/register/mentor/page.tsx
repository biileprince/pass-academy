import { Metadata } from "next";
import { MentorRegisterForm } from "@/components/auth/mentor-register-form";

export const metadata: Metadata = { title: "Mentor Registration" };

export default function MentorRegisterPage() {
  return <MentorRegisterForm />;
}
