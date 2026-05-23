import { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ComingSoon } from "@/components/shared/coming-soon";

export const metadata: Metadata = { title: "Career Centre" };

export default function CareerPage() {
  return (
    <>
      <PageHeader
        title="Career Centre"
        description="Find your path with confidence."
      />
      <div className="container mx-auto px-4">
        <ComingSoon feature="Career Centre" phase={2} />
      </div>
    </>
  );
}
