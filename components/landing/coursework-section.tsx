"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CaretDown,
  ArrowUpRight,
  BookOpen,
  CheckCircle,
  Lightbulb,
  Cpu,
  ShareNetwork,
  Database,
  FileCode,
  TreeStructure,
} from "@phosphor-icons/react";
import { Container } from "@/components/container";
import { courseworkSubjects, type CourseSubject, type CourseProject } from "@/config/coursework";
import { getTechIcon } from "@/lib/tech-icons";
import { cn } from "@/lib/utils";

const subjectIcons: Record<string, React.ReactNode> = {
  algorithms: <TreeStructure className="size-4 text-indigo-500" weight="bold" />,
  "computer-networks": <ShareNetwork className="size-4 text-emerald-500" weight="bold" />,
  "distributed-computing": <Cpu className="size-4 text-amber-500" weight="bold" />,
  "database-systems": <Database className="size-4 text-purple-500" weight="bold" />,
  sql: <FileCode className="size-4 text-sky-500" weight="bold" />,
};

function TechBadge({ tech }: { tech: string }) {
  const icon = getTechIcon(tech);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200/80 dark:border-white/10 bg-slate-100/70 dark:bg-zinc-800/60 px-2 py-0.5 text-[11px] font-medium text-foreground">
      {icon ? (
        icon.startsWith("/") ? (
          <Image src={icon} alt={tech} width={12} height={12} className="size-3 object-contain" />
        ) : (
          <Image
            src={`https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/${icon}.svg`}
            alt={tech}
            width={12}
            height={12}
            className="size-3 object-contain dark:invert"
            unoptimized
          />
        )
      ) : null}
      <span>{tech}</span>
    </span>
  );
}

function ProjectCard({ project }: { project: CourseProject }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/90 dark:border-white/10",
        "bg-white dark:bg-card/95 backdrop-blur-md",
        "shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.02)]",
        "p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between",
        "hover:border-slate-300 dark:hover:border-white/20 hover:shadow-md",
        "space-y-4"
      )}
    >
      <div className="space-y-3">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-md border border-border/80 bg-muted/40 px-2 py-0.5 font-mono text-[10px] font-semibold text-secondary">
              {project.teamNote}
            </span>
            {project.period && (
              <span className="rounded-md border border-slate-200/60 dark:border-white/5 bg-slate-50 dark:bg-zinc-800/40 px-2 py-0.5 font-mono text-[10px] text-secondary">
                {project.period}
              </span>
            )}
          </div>

          {/* Action Buttons: Demo & Architecture */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              href={`/coursework/demo/${project.slug}`}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer",
                "bg-foreground text-background hover:opacity-90 shadow-xs",
                "transition-all duration-150"
              )}
            >
              <span>Demo</span>
              <ArrowUpRight className="size-3" weight="bold" />
            </Link>

            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer",
                "border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-zinc-800/50 text-secondary hover:text-foreground",
                "transition-colors shadow-xs"
              )}
            >
              <span>{expanded ? "Less Details" : "Architecture"}</span>
              <CaretDown
                className={cn("size-3.5 transition-transform duration-200", expanded && "rotate-180")}
                weight="bold"
              />
            </button>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-lg sm:text-xl font-bold tracking-tight text-foreground leading-snug">
          {project.title}
        </h4>

        {/* Summary */}
        <p className="text-sm leading-relaxed text-secondary">
          {project.summary}
        </p>

        {/* Contribution Callout */}
        <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs text-secondary leading-relaxed">
          <strong className="font-semibold text-foreground">My Contribution: </strong>
          {project.contribution}
        </div>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.stack.map((tech) => (
            <TechBadge key={tech} tech={tech} />
          ))}
        </div>
      </div>

      {/* Expandable Architecture & Mechanics */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out overflow-hidden",
          expanded ? "grid-rows-[1fr] opacity-100 pt-3 border-t border-slate-200/60 dark:border-white/10" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0 space-y-3.5">
          {/* Key Highlights */}
          <div className="space-y-1.5">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <CheckCircle className="size-3.5 text-emerald-500" weight="fill" />
              <span>Implementation Highlights</span>
            </span>
            <ul className="space-y-1 text-xs text-secondary">
              {project.highlights.map((hl, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-secondary/70" />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How It Works */}
          <div className="space-y-1.5">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <Lightbulb className="size-3.5 text-amber-500" weight="fill" />
              <span>Algorithm &amp; System Mechanics</span>
            </span>
            <ul className="space-y-1 text-xs text-secondary">
              {project.howItWorks.map((hw, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-secondary/70" />
                  <span>{hw}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Honest Note Badge */}
          {project.honestyBadge && (
            <div className="rounded-lg border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-zinc-800/40 px-3 py-2 text-[11px] font-mono text-secondary">
              <strong className="text-foreground">Architecture verification: </strong>
              {project.honestyBadge}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SubjectBlock({ subject, index }: { subject: CourseSubject; index: number }) {
  const icon = subjectIcons[subject.slug] || <BookOpen className="size-4 text-indigo-500" />;

  return (
    <div className="space-y-5 sm:space-y-6 animate-in-up-on-view">
      {/* Subject Header on top of cards */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-border/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-6 items-center justify-center rounded-md border border-border/80 bg-muted/40">
              {icon}
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-secondary">
              Subject {String(index + 1).padStart(2, "0")}
            </span>
            <span className="rounded-md border border-border/80 bg-muted/40 px-2 py-0.5 font-mono text-[11px] font-semibold text-secondary">
              {subject.projects.length} {subject.projects.length === 1 ? "Project" : "Projects"}
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {subject.name}
          </h3>
          <p className="text-sm sm:text-base text-secondary max-w-2xl leading-relaxed">
            {subject.blurb}
          </p>
        </div>

        {subject.focus && (
          <div className="sm:max-w-xs shrink-0 rounded-xl border border-border/60 bg-muted/30 p-3 text-xs text-secondary leading-relaxed">
            <span className="font-semibold text-foreground block mb-0.5">Focus Areas:</span>
            {subject.focus}
          </div>
        )}
      </div>

      {/* Projects Grid: 2 columns of smaller square cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-start">
        {subject.projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}

export function CourseworkSection({
  title = "Coursework & Systems Labs",
  subtitle = "[ Graduate Coursework & Applied Labs ]",
  description = "Graduate coursework and systems engineering labs across dynamic programming, networks, distributed consensus, relational schema design, and SQL query optimization at the University of Georgia.",
}: {
  title?: string;
  subtitle?: string;
  description?: string;
}) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const displayedSubjects =
    activeTab === "all"
      ? courseworkSubjects
      : courseworkSubjects.filter((s) => s.slug === activeTab);

  const totalProjects = courseworkSubjects.reduce((sum, s) => sum + s.projects.length, 0);

  return (
    <section id="coursework" className="space-y-10 sm:space-y-14">
      <Container className="max-w-5xl xl:max-w-6xl px-4 sm:px-6 space-y-10 sm:space-y-14">
        {/* Main Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border/60 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-secondary">
              <span>{subtitle}</span>
            </div>
            <h2 className="mt-1 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              {title}
            </h2>
            <p className="mt-2 text-sm text-secondary sm:text-base max-w-2xl leading-relaxed">
              {description}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all shadow-xs cursor-pointer",
                activeTab === "all"
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-card border border-border text-secondary hover:text-foreground hover:bg-muted"
              )}
            >
              All ({totalProjects})
            </button>
            {courseworkSubjects.map((s) => (
              <button
                key={s.slug}
                type="button"
                onClick={() => setActiveTab(s.slug)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-all shadow-xs cursor-pointer",
                  activeTab === s.slug
                    ? "bg-foreground text-background shadow-sm"
                    : "bg-card border border-border text-secondary hover:text-foreground hover:bg-muted"
                )}
              >
                {s.shortName || s.name} ({s.projects.length})
              </button>
            ))}
          </div>
        </div>

        {/* Subjects List */}
        <div className="space-y-12 sm:space-y-16">
          {displayedSubjects.map((subject, index) => (
            <SubjectBlock
              key={subject.slug}
              subject={subject}
              index={activeTab === "all" ? index : courseworkSubjects.findIndex((s) => s.slug === subject.slug)}
            />
          ))}
        </div>

        {/* Bottom Banner */}
        <div
          className={cn(
            "rounded-2xl border border-slate-200/90 dark:border-white/10",
            "bg-white dark:bg-card/95 backdrop-blur-md",
            "p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
            "shadow-xs"
          )}
        >
          <div>
            <h4 className="font-bold text-base sm:text-lg text-foreground">
              Interested in full-scale applications and research?
            </h4>
            <p className="text-xs sm:text-sm text-secondary mt-0.5">
              Explore live production platforms, published research papers, and developer tooling.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/work"
              className="inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-3.5 py-2 text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity shadow-xs"
            >
              <span>Explore Work</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
            <Link
              href="/research"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2 text-xs sm:text-sm font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors shadow-xs"
            >
              <span>View Research</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
