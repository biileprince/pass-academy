import { Metadata } from "next";
import { StudentRegisterForm } from "@/components/auth/student-register-form";

export const metadata: Metadata = { title: "Student Registration" };

export default function StudentRegisterPage() {
  return <StudentRegisterForm />;
}
