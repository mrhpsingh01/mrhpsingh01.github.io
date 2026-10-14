import type { Metadata } from "next";
import { CourseworkSection } from "@/components/landing/coursework-section";

export const metadata: Metadata = {
  title: "Coursework | Harmanpreet Singh",
  description:
    "Graduate coursework and systems engineering labs across dynamic programming, networks, distributed consensus, relational schema design, and SQL query optimization at the University of Georgia.",
};

export default function CourseworkPage() {
  return (
    <div className="pb-24 pt-4 sm:pb-28 sm:pt-8">
      <CourseworkSection />
    </div>
  );
}
