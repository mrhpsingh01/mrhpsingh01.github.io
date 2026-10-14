"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GithubLogo, BookOpen } from "@phosphor-icons/react";
import type { Project } from "@/config/projects";
import { getTechIcon } from "@/lib/tech-icons";
import { cn } from "@/lib/utils";
import { ProjectPhotoCarousel } from "@/components/projects/project-photo-carousel";

export function HorizontalProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  const targetHref = project.website || project.href || `/projects/${project.slug}`;
  const isExternal = Boolean(project.website || (project.href && project.href.startsWith("http")));
  const isLiveProduct = project.category === "live-products";

  return (
    <div
      className={cn(
          "group relative overflow-hidden rounded-2xl md:rounded-3xl",
          "border border-slate-200/90 dark:border-white/10",
          "bg-white dark:bg-card/95 backdrop-blur-md",
          "shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.02)]",
          "hover:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.09)] hover:border-slate-300/90 dark:hover:border-white/20",
          "transition-all duration-300 p-6 sm:p-7 md:p-8",
          "animate-in-up-on-view"
        )}
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div className="grid gap-6 md:grid-cols-[400px_1fr] lg:grid-cols-[460px_1fr] md:gap-8 lg:gap-10 md:items-start">
          {/* ========================================================= */}
          {/* Left Side: Top Name -> Photo Below -> Tech Stack Below   */}
          {/* ========================================================= */}
          <div className="flex flex-col space-y-4">
            {/* 1. Top in the box: Project Name & Date */}
            <div>
              <Link
                href={targetHref}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="group/title inline-flex items-baseline gap-1.5"
              >
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground transition-colors group-hover/title:text-secondary">
                  {project.title}
                </h3>
              </Link>
              {project.period && (
                <p className="mt-0.5 font-mono text-xs text-secondary">
                  {project.period}
                </p>
              )}
            </div>

            {/* 2. Below Name: Interactive Photo Carousel */}
            <div className="relative min-w-0">
              <ProjectPhotoCarousel
                slug={project.slug}
                fallbackCover={project.cover}
                fallbackGradient={project.gradient}
                title={project.title}
                aspectRatio="aspect-[16/10]"
              />
            </div>

            {/* 3. Below Photo: Tech Stack */}
            <div className="pt-1">
              <h4 className="text-xs font-semibold tracking-wide text-foreground uppercase sm:text-sm sm:normal-case">
                Technologies Used:
              </h4>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {project.tech.map((tech) => {
                  const icon = getTechIcon(tech);
                  return icon ? (
                    <div
                      key={tech}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50/80 dark:bg-zinc-800/80 px-2.5 py-1 text-xs font-medium text-foreground shadow-2xs"
                    >
                      <Image
                        src={icon.startsWith("/") ? icon : `https://cdn.simpleicons.org/${icon}`}
                        alt=""
                        width={14}
                        height={14}
                        className="size-3.5 shrink-0"
                        unoptimized
                      />
                      <span>{tech}</span>
                    </div>
                  ) : (
                    <span
                      key={tech}
                      className="inline-flex items-center rounded-lg border border-dashed border-slate-300 dark:border-zinc-700 bg-slate-50/60 dark:bg-zinc-800/50 px-2.5 py-1 font-mono text-[11px] font-medium text-slate-700 dark:text-zinc-300"
                    >
                      {tech}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* Right Side: Action Icons on Top Right, Description & Role */}
          {/* ========================================================= */}
          <div className="flex flex-col justify-between h-full space-y-4 pt-1 sm:pt-2">
            {/* Top Row on Right Side: Context Badge on left, Action Icons on right */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                {project.context ? (
                  <span className="rounded-md border border-border/80 bg-muted/40 px-2.5 py-1 font-mono text-[11px] font-medium text-secondary">
                    {project.context}
                  </span>
                ) : (
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
                    Overview
                  </span>
                )}
              </div>

              {/* Action Icons: Case Study, Visit Now & GitHub on the right side */}
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-3 py-1.5 text-xs font-semibold transition-colors shadow-xs"
                >
                  <BookOpen className="size-3.5" weight="bold" />
                  <span>Case Study</span>
                </Link>

                {isLiveProduct && project.website && (
                  <Link
                    href={project.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white/90 dark:bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors shadow-xs"
                  >
                    <span>Visit Now</span>
                    <ArrowRight className="size-3.5" weight="bold" />
                  </Link>
                )}

                {project.href && project.href.includes("github.com") && (
                  <Link
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white/90 dark:bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors shadow-xs"
                  >
                    <GithubLogo className="size-3.5" weight="fill" />
                    <span>GitHub</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Main Description */}
            <div>
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                Description
              </h4>
              <p className="text-base sm:text-lg leading-relaxed text-secondary sm:leading-8">
                {project.description}
              </p>
            </div>

            {/* Role & Contribution */}
            {project.role && (
              <div className="rounded-xl border border-slate-200/70 dark:border-white/10 bg-slate-50/60 dark:bg-zinc-800/30 p-4 sm:p-5 mt-2">
                <h5 className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
                  Role &amp; Contribution
                </h5>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-secondary/95">
                  {project.role}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
