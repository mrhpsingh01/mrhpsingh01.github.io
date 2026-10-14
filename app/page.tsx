import { Hero } from "@/components/landing/hero";
import { LazyTechStack } from "@/components/landing/lazy-tech-stack";
import { FeaturedExperienceSection } from "@/components/landing/featured-experience-section";
import { EducationSection } from "@/components/landing/education-section";
import { CertificationsSection } from "@/components/landing/certifications-section";
import { ProjectSection, ProfessionalProjects } from "@/components/landing/featured-projects";

export default function HomePage() {
  return (
    <div className="space-y-12 pb-24 pt-0 sm:space-y-16 sm:pb-28 sm:pt-8">
      <Hero />
      <LazyTechStack />
      <FeaturedExperienceSection />
      <EducationSection />
      <CertificationsSection />
      <ProjectSection />
      <ProfessionalProjects />
    </div>
  );
}
