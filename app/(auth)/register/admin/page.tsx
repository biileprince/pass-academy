import { Metadata } from "next";
import { AdminRegisterForm } from "@/components/auth/admin-register-form";

export const metadata: Metadata = { title: "Admin Registration" };

export default function AdminRegisterPage() {
  return <AdminRegisterForm />;
}
