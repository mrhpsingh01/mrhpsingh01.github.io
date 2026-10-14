import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, CheckCircle, Lightbulb, PlayCircle } from "lucide-react";
import { Container } from "@/components/container";
import { LazyDemo } from "@/components/coursework/LazyDemo";
import { courseworkSubjects, type CourseProject, type CourseSubject } from "@/config/coursework";
import type { DemoId } from "@/content/coursework/types";
import { getTechIcon } from "@/lib/tech-icons";
import { cn } from "@/lib/utils";

const slugToDemoId: Record<string, DemoId> = {
  "gene-finding-hmm": "hmm-gene-finder",
  "rna-folding": "rna-folding",
  "dns-forwarder": "dns-forwarder",
  "https-downloader": "https-downloader",
  "latency-statistics": "latency-stats",
  "simple-ftp": "ftp-session",
  "concurrent-ftp": "ftp-concurrent",
  multicast: "multicast",
  "key-value-ring": "kv-ring",
  "property-management": "property-management",
  "sql-job-postings": "sql-lab",
};

function getProjectAndSubject(slug: string): { project: CourseProject; subject: CourseSubject } | null {
  for (const subject of courseworkSubjects) {
    const project = subject.projects.find((p) => p.slug === slug);
    if (project) {
      return { project, subject };
    }
  }
  return null;
}

export function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const subject of courseworkSubjects) {
    for (const project of subject.projects) {
      params.push({ slug: project.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getProjectAndSubject(slug);
  if (!data) return {};
  return {
    title: `${data.project.title} - Interactive Demo | Coursework`,
    description: data.project.summary,
  };
}

function TechBadge({ tech }: { tech: string }) {
  const icon = getTechIcon(tech);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200/80 dark:border-white/10 bg-slate-100/70 dark:bg-zinc-800/60 px-2.5 py-1 text-xs font-medium text-foreground">
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

export default async function DemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getProjectAndSubject(slug);
  if (!data) notFound();

  const { project, subject } = data;
  const demoId = slugToDemoId[slug];
  if (!demoId) notFound();

  return (
    <div className="pb-24 pt-6 sm:pb-28 sm:pt-10">
      <Container className="max-w-5xl xl:max-w-6xl px-4 sm:px-6 space-y-10 sm:space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/coursework"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-secondary hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Coursework</span>
          </Link>

          <span className="font-mono text-xs text-secondary font-medium">
            {subject.name}
          </span>
        </div>

        {/* Project Header */}
        <div className="space-y-4 border-b border-border/60 pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-border/80 bg-muted/40 px-2.5 py-1 font-mono text-xs font-semibold text-secondary">
              {project.teamNote}
            </span>
            {project.period && (
              <span className="rounded-md border border-slate-200/60 dark:border-white/5 bg-slate-50 dark:bg-zinc-800/40 px-2.5 py-1 font-mono text-xs text-secondary">
                {project.period}
              </span>
            )}
            <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Interactive Web Demo
            </span>
          </div>

          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg leading-relaxed text-secondary max-w-3xl">
            {project.summary}
          </p>

          <div className="rounded-xl border border-border/70 bg-muted/20 p-4 text-xs sm:text-sm text-secondary leading-relaxed max-w-3xl">
            <strong className="font-semibold text-foreground">My Contribution: </strong>
            {project.contribution}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {project.stack.map((tech) => (
              <TechBadge key={tech} tech={tech} />
            ))}
          </div>
        </div>

        {/* Interactive Simulation Frame */}
        <div
          className={cn(
            "rounded-2xl sm:rounded-3xl",
            "border border-slate-200/90 dark:border-white/10",
            "bg-white dark:bg-card/95 backdrop-blur-md",
            "shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.02)]",
            "overflow-hidden"
          )}
        >
          {/* Header Bar */}
          <div className="border-b border-border/60 p-5 sm:p-6 bg-slate-50/60 dark:bg-zinc-800/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
                  Live Browser Simulation
                </span>
              </div>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {project.demoHeading || "Working Simulation"}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full border border-border/80 bg-background/90 px-3 py-1 font-mono text-xs font-semibold text-secondary shadow-xs">
                Client-Side Engine
              </span>
            </div>
          </div>

          {/* Try This Banner */}
          {project.demoTryThis && (
            <div className="bg-amber-500/5 dark:bg-amber-500/10 px-5 sm:px-6 py-3.5 border-b border-amber-500/20 text-xs sm:text-sm text-foreground/90 flex items-start gap-2.5">
              <PlayCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-foreground">Try this: </strong>
                <span>{project.demoTryThis}</span>
              </div>
            </div>
          )}

          {/* Interactive Demo Body */}
          <div className="p-5 sm:p-8 lg:p-10">
            <LazyDemo id={demoId} eager={true} />
          </div>

          {/* Honesty / Simulation Note Footer */}
          {project.honestyBadge && (
            <div className="border-t border-border/60 bg-muted/20 px-5 sm:px-6 py-3 font-mono text-xs text-secondary">
              <strong className="text-foreground">Architecture verification: </strong>
              {project.honestyBadge}
            </div>
          )}
        </div>

        {/* Technical Architecture Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-4">
          {/* Highlights */}
          <div
            className={cn(
              "rounded-2xl border border-slate-200/90 dark:border-white/10",
              "bg-white dark:bg-card/95 backdrop-blur-md",
              "p-6 sm:p-7 space-y-4 shadow-xs"
            )}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="size-4 text-emerald-500" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-secondary">
                Implementation Highlights
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-secondary">
              {project.highlights.map((hl, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-secondary/70" />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How It Works */}
          <div
            className={cn(
              "rounded-2xl border border-slate-200/90 dark:border-white/10",
              "bg-white dark:bg-card/95 backdrop-blur-md",
              "p-6 sm:p-7 space-y-4 shadow-xs"
            )}
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4 text-amber-500" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-secondary">
                Algorithm &amp; System Mechanics
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-secondary">
              {project.howItWorks.map((hw, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-secondary/70" />
                  <span>{hw}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Return Button */}
        <div className="pt-4 flex items-center justify-between border-t border-border/60">
          <Link
            href="/coursework"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-4 py-2 text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity shadow-xs"
          >
            <ArrowLeft className="size-4" />
            <span>Back to All Coursework</span>
          </Link>

          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors shadow-xs"
          >
            <span>Explore Work</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </Container>
    </div>
  );
}
