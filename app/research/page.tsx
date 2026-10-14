import type { Metadata } from "next";
import { ResearchSection } from "@/components/landing/research-section";

export const metadata: Metadata = {
  title: "Research | Harmanpreet Singh",
  description:
    "Applied machine learning research in ambient smart-home activity recognition, self-supervised representation learning, and multimodal fusion at the University of Georgia.",
};

export default function ResearchPage() {
  return (
    <div className="pb-24 pt-4 sm:pb-28 sm:pt-8">
      <ResearchSection />
    </div>
  );
}
