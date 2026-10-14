import type { Metadata } from "next";
import { AllProjectsSection } from "@/components/landing/all-projects-section";

export const metadata: Metadata = {
  title: "Projects | Harmanpreet Singh",
  description:
    "Live products, research, distributed systems laboratories, and developer tooling across my engineering journey.",
};

export default function ProjectsPage() {
  return (
    <div className="pb-24 pt-4 sm:pb-28 sm:pt-8">
      <AllProjectsSection
        title="Work & Projects"
        subtitle="[ My Projects ]"
        description="Live products, research, distributed systems laboratories, and developer tooling across my engineering journey."
      />
    </div>
  );
}
