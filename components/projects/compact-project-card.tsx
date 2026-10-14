"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, GithubLogo } from "@phosphor-icons/react";
import type { Project } from "@/config/projects";
import { getProjectDoc } from "@/config/project-docs-data";
import { getTechIcon } from "@/lib/tech-icons";
import { cn } from "@/lib/utils";

export function CompactProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  const doc = getProjectDoc(project.slug);
  const targetHref = project.website || project.href || `/projects/${project.slug}`;
  const isExternal = Boolean(project.website || (project.href && project.href.startsWith("http")));
  const isLiveProduct = project.category === "live-products";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl sm:rounded-2xl",
        "border border-slate-200/90 dark:border-white/10",
        "bg-white dark:bg-card/95 backdrop-blur-md",
        "shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)]",
        "hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] hover:border-slate-300/90 dark:hover:border-white/20",
        "transition-all duration-300 p-5 sm:p-6",
        "animate-in-up-on-view"
      )}
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      <div className="grid gap-4 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] md:gap-6 lg:gap-8 md:items-start">
        {/* Left Side: Name, Period & Context Tag */}
        <div className="flex flex-col space-y-2">
          <Link
            href={targetHref}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="group/title inline-flex items-baseline gap-1"
          >
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground transition-colors group-hover/title:text-secondary">
              {project.title}
            </h3>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {project.contextLabel && (
              <span className="rounded bg-muted/70 px-2 py-0.5 font-mono text-[10px] font-semibold text-secondary">
                {project.contextLabel}
              </span>
            )}
            {project.period && (
              <span className="font-mono text-xs text-secondary/80">
                {project.period}
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Action Icons on Right Side, Description & Tech Pills */}
        <div className="flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm sm:text-base leading-relaxed text-secondary flex-1">
              {project.description}
            </p>

            {/* Action Icons on the right side */}
            <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
              {doc && (
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center gap-1 rounded-md border border-indigo-500/40 bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-2.5 py-1 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                >
                  <BookOpen className="size-3" weight="bold" />
                  <span>Case Study</span>
                </Link>
              )}

              {isLiveProduct && project.website && (
                <Link
                  href={project.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md border border-slate-300 dark:border-zinc-700 bg-white/90 dark:bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors shadow-2xs"
                >
                  <span>Visit Now</span>
                  <ArrowRight className="size-3" weight="bold" />
                </Link>
              )}

              {project.href && project.href.includes("github.com") && (
                <Link
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 dark:border-zinc-700 bg-white/90 dark:bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors shadow-2xs"
                >
                  <GithubLogo className="size-3.5" weight="fill" />
                  <span>GitHub</span>
                </Link>
              )}
            </div>
          </div>

          {/* Compact Tech Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.tech.map((tech) => {
              const icon = getTechIcon(tech);
              return icon ? (
                <div
                  key={tech}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 dark:border-zinc-700 bg-slate-50/80 dark:bg-zinc-800/80 px-2 py-0.5 text-[11px] font-medium text-foreground shadow-2xs"
                >
                  <Image
                    src={icon.startsWith("/") ? icon : `https://cdn.simpleicons.org/${icon}`}
                    alt=""
                    width={12}
                    height={12}
                    className="size-3 shrink-0"
                    unoptimized
                  />
                  <span>{tech}</span>
                </div>
              ) : (
                <span
                  key={tech}
                  className="inline-flex items-center rounded-md border border-dashed border-slate-300 dark:border-zinc-700 bg-slate-50/60 dark:bg-zinc-800/50 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-700 dark:text-zinc-300"
                >
                  {tech}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
