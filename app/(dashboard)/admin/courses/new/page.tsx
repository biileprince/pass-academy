import { Metadata } from "next";
import { CreateCourseForm } from "@/components/courses/create-course-form";

export const metadata: Metadata = { title: "New Course — Admin" };

export default function NewCoursePage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Create Course</h1>
      <CreateCourseForm />
    </div>
  );
}
