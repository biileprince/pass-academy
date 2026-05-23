import { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ComingSoon } from "@/components/shared/coming-soon";

export const metadata: Metadata = { title: "News & Updates" };

export default function NewsPage() {
  return (
    <>
      <PageHeader
        title="News & Updates"
        description="Stay up to date with the latest from PAS Academy."
      />
      <div className="container mx-auto px-4">
        <ComingSoon feature="News & Media Section" phase={2} />
      </div>
    </>
  );
}
