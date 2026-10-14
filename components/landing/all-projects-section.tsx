"use client";

import { useState } from "react";
import { Container } from "@/components/container";
import { HorizontalProjectCard } from "@/components/projects/horizontal-project-card";
import { CompactProjectCard } from "@/components/projects/compact-project-card";
import {
  projectCategories,
  projects,
  type ProjectCategory,
} from "@/config/projects";
import { cn } from "@/lib/utils";

export function AllProjectsSection({
  title = "Work",
  subtitle = "[ My Projects ]",
  description = "Live products, research, distributed systems laboratories, and developer tooling across my engineering journey.",
}: {
  title?: string;
  subtitle?: string;
  description?: string;
}) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "all">("all");

  const categoriesToDisplay =
    activeCategory === "all"
      ? projectCategories
      : projectCategories.filter((cat) => cat.id === activeCategory);

  return (
    <section id="work-projects" className="space-y-12 sm:space-y-16">
      <Container className="max-w-5xl xl:max-w-6xl px-4 sm:px-6">
        {/* Main Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border/60 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-secondary">
              <span>{subtitle}</span>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-secondary sm:text-base max-w-2xl leading-relaxed">
              {description}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all shadow-xs cursor-pointer",
                activeCategory === "all"
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-card border border-border text-secondary hover:text-foreground hover:bg-muted"
              )}
            >
              All ({projects.length})
            </button>
            {projectCategories.map((cat) => {
              const count = projects.filter((p) => p.category === cat.id).length;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all shadow-xs cursor-pointer",
                    isActive
                      ? "bg-foreground text-background shadow-sm"
                      : "bg-card border border-border text-secondary hover:text-foreground hover:bg-muted"
                  )}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories Sections */}
        <div className="mt-10 space-y-16 sm:space-y-20">
          {categoriesToDisplay.map((category) => {
            const categoryProjects = projects.filter((p) => p.category === category.id);
            if (categoryProjects.length === 0) return null;
            const isAdditional = category.id === "additional-work";

            return (
              <div key={category.id} className="space-y-6">
                {/* Category Header with bracket accent */}
                <div className="flex flex-col gap-1 border-l-2 border-foreground/80 pl-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
                      [ {category.label} ]
                    </span>
                    <span className="text-xs text-secondary/60">&middot;</span>
                    <span className="font-mono text-xs text-secondary/80">
                      {categoryProjects.length} {categoryProjects.length === 1 ? "project" : "projects"}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {category.label}
                  </h2>
                  <p className="text-sm text-secondary">
                    {category.description}
                  </p>
                </div>

                {/* Cards List: smaller-longer box for Additional Work, horizontal cards for others */}
                {isAdditional ? (
                  <div className="space-y-4">
                    {categoryProjects.map((project, index) => (
                      <CompactProjectCard
                        key={project.slug}
                        project={project}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6 sm:space-y-7">
                    {categoryProjects.map((project, index) => (
                      <HorizontalProjectCard
                        key={project.slug}
                        project={project}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
