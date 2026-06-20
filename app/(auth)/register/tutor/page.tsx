import { Metadata } from "next";
import { TutorRegisterForm } from "@/components/auth/tutor-register-form";

export const metadata: Metadata = { title: "Tutor Registration" };

export default function TutorRegisterPage() {
  return <TutorRegisterForm />;
}
