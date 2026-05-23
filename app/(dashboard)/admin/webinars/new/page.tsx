import { Metadata } from "next";
import { CreateWebinarForm } from "@/components/webinars/create-webinar-form";

export const metadata: Metadata = { title: "New Webinar — Admin" };

export default function NewWebinarPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Create Webinar</h1>
      <CreateWebinarForm />
    </div>
  );
}
