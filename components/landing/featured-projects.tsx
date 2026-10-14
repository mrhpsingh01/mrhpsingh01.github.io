import { ProjectsGrid } from "@/components/projects-grid";
import { professionalProjects } from "@/config/projects";
import { ProjectSection } from "@/components/landing/project-section";

export { ProjectSection };
export const LatestProjects = ProjectSection;

export function ProfessionalProjects({
  limit = 2,
  showViewAll = true,
}: {
  limit?: number;
  showViewAll?: boolean;
}) {
  return (
    <ProjectsGrid
      items={professionalProjects}
      limit={limit}
      title="Live Professional Products"
      subtitle="Featured"
      actionLabel="Visit Now"
      viewAllHref="/work"
      viewAllText="Show all projects"
      showViewAll={showViewAll}
    />
  );
}

export function FeaturedProjects() {
  return (
    <div className="space-y-12 sm:space-y-16">
      <ProjectSection />
      <ProfessionalProjects />
    </div>
  );
}
