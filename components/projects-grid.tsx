"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GithubLogo, Globe, BookOpen } from "@phosphor-icons/react";
import { Container } from "@/components/container";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { projects, type Project } from "@/config/projects";
import { getTechIcon } from "@/lib/tech-icons";
import { cn } from "@/lib/utils";
import { ProjectPhotoCarousel } from "@/components/projects/project-photo-carousel";

export function ProjectCard({
  project,
  index = 0,
  actionLabel = "Visit Now",
}: {
  project: Project;
  index?: number;
  actionLabel?: string;
}) {
  const targetHref = project.website || project.href || `/projects/${project.slug}`;
  const isExternal = Boolean(project.website || (project.href && project.href.startsWith("http")));

  return (
    <LiquidGlassCard
      glowIntensity="sm"
      shadowIntensity="md"
      borderRadius="18px"
      blurIntensity="md"
      className="animate-in-up-on-view group flex min-w-0 flex-col"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="relative w-full">
        <ProjectPhotoCarousel
          slug={project.slug}
          fallbackCover={project.cover}
          fallbackGradient={project.gradient}
          title={project.title}
          aspectRatio="aspect-[16/10] sm:aspect-[16/11]"
        />
      </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <Link
              href={targetHref}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="min-w-0 text-xl font-bold tracking-tight transition-colors hover:text-secondary"
            >
              {project.title}
            </Link>
            <div className="flex shrink-0 items-center gap-1.5">
              {project.website && (
                <Link
                  href={project.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${project.title}`}
                  className="rounded-md p-1 text-secondary transition-colors hover:text-foreground"
                >
                  <Globe className="size-5" />
                </Link>
              )}
              {project.href && project.href.includes("github.com") && (
                <Link
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} on GitHub`}
                  className="rounded-md p-1 text-secondary transition-colors hover:text-foreground"
                >
                  <GithubLogo className="size-5" />
                </Link>
              )}
            </div>
          </div>

          <p className="mt-4 flex-1 text-base leading-relaxed text-secondary">
            {project.description}
          </p>

          <div className="mt-6">
            <p className="text-sm font-medium text-secondary">Technologies</p>
            <div className="mt-3 flex items-end justify-between gap-3 flex-wrap">
              <div className="flex min-w-0 flex-wrap gap-2">
                {project.tech.map((tech) => {
                  const icon = getTechIcon(tech);
                  return icon ? (
                    <div
                      key={tech}
                      title={tech}
                      className="flex size-7 items-center justify-center rounded-md bg-background/70 shadow-sm ring-1 ring-border/60 dark:bg-white/95"
                    >
                      <Image
                        src={icon.startsWith("/") ? icon : `https://cdn.simpleicons.org/${icon}`}
                        alt={tech}
                        width={16}
                        height={16}
                        className="size-4"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <span
                      key={tech}
                      className="rounded-md border border-dashed border-border bg-background/50 px-2 py-1 font-mono text-[10px] text-secondary"
                    >
                      {tech}
                    </span>
                  );
                })}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-50/80 dark:bg-indigo-950/50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 transition-colors hover:bg-indigo-100 dark:hover:bg-indigo-900/60 shadow-xs"
                >
                  <BookOpen className="size-3.5" weight="bold" />
                  <span>Case Study</span>
                </Link>

                <Link
                  href={targetHref}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-secondary transition-colors hover:bg-muted hover:text-foreground"
                >
                  <span>{actionLabel}</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </LiquidGlassCard>
    );
  }

export function ProjectsGrid({
  items,
  limit,
  showHeading = true,
  showViewAll = false,
  title = "Projects",
  subtitle = "Featured",
  viewAllHref = "/projects",
  viewAllText = "Show all projects",
  actionLabel = "Visit Now",
}: {
  items?: Project[];
  limit?: number;
  showHeading?: boolean;
  showViewAll?: boolean;
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllText?: string;
  actionLabel?: string;
}) {
  const source = items ?? projects;
  const list = limit && !items ? source.filter((p) => p.featured) : source;
  const displayed = limit ? list.slice(0, limit) : list;

  return (
    <Container>
      {showHeading && (
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-secondary">{subtitle}</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
          </div>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {displayed.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={index}
            actionLabel={actionLabel}
          />
        ))}
      </div>

      {showViewAll && (
        <div className="mt-10 flex justify-center">
          <Link
            href={viewAllHref}
            className="rounded-lg border border-border bg-card px-5 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
          >
            {viewAllText}
          </Link>
        </div>
      )}
    </Container>
  );
}
