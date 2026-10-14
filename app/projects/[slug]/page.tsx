import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowUpRight,
  Globe,
  Terminal,
  Cpu,
  Layers,
  FileText,
  Lightbulb,
  FlaskConical,
} from "lucide-react";
import { GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/container";
import { projects, type Project } from "@/config/projects";
import { getProjectDoc, type ProjectDoc } from "@/config/project-docs-data";
import { ProjectPhotoCarousel } from "@/components/projects/project-photo-carousel";
import { SensorPlayback } from "@/components/lab/SensorPlayback";
import { getTechIcon } from "@/lib/tech-icons";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: `${project.title} - Technical Case Study | Harmanpreet Singh`,
    description: project.description,
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const doc = getProjectDoc(project.slug);
  const images = doc?.images || [];

  return (
    <div className="pb-24 pt-6 sm:pb-28 sm:pt-10">
      <Container className="max-w-5xl xl:max-w-6xl px-4 sm:px-6 space-y-10 sm:space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-secondary hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Projects</span>
          </Link>

          <span className="font-mono text-xs text-secondary font-medium">
            {project.categoryLabel}
          </span>
        </div>

        {/* Project Header */}
        <div className="space-y-4 border-b border-border/60 pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-border/80 bg-muted/40 px-2.5 py-1 font-mono text-xs font-semibold text-secondary">
              {project.categoryLabel}
            </span>
            {project.contextLabel && (
              <span className="rounded-md border border-slate-200/60 dark:border-white/5 bg-slate-50 dark:bg-zinc-800/40 px-2.5 py-1 font-mono text-xs text-secondary">
                {project.contextLabel}
              </span>
            )}
            {project.period && (
              <span className="rounded-md border border-slate-200/60 dark:border-white/5 bg-slate-50 dark:bg-zinc-800/40 px-2.5 py-1 font-mono text-xs text-secondary">
                {project.period}
              </span>
            )}
            <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Technical Case Study
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {project.title}
              </h1>
              {doc?.type && (
                <p className="mt-2 text-base sm:text-lg text-secondary">
                  {doc.type}
                </p>
              )}
            </div>

            {/* Links */}
            <div className="flex shrink-0 items-center gap-2.5">
              {project.website && (
                <Link
                  href={project.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-accent text-accent-fg hover:bg-accent-strong px-4 py-2 text-xs sm:text-sm font-semibold transition-colors shadow-xs"
                >
                  <span>Visit Live App</span>
                  <ArrowUpRight className="size-4" />
                </Link>
              )}
              {project.href && project.href.includes("github.com") && (
                <Link
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white/90 dark:bg-zinc-800 px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors shadow-xs"
                >
                  <GithubLogo className="size-4" weight="fill" />
                  <span>Repository</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Screenshot Carousel Hero */}
        <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-card/95 p-5 sm:p-8 md:p-10 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-accent" />
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-secondary">
                Interface Gallery ({images.length} Screens)
              </h2>
            </div>
            <span className="font-mono text-xs text-secondary">
              Use arrows or dots to navigate
            </span>
          </div>

          <ProjectPhotoCarousel
            slug={project.slug}
            fallbackCover={project.cover}
            fallbackGradient={project.gradient}
            title={project.title}
            aspectRatio="aspect-[16/10]"
            showCaseStudyButton={false}
          />
        </div>

        {/* Technical Architecture Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* System Overview */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-card/95 p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4 text-accent" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-secondary">
                System Overview
              </h3>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-secondary whitespace-pre-line">
              {doc?.whatItIs || project.description}
            </p>
          </div>

          {/* Infrastructure & Stack */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-card/95 p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Cpu className="size-4 text-accent" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-secondary">
                Infrastructure &amp; Stack
              </h3>
            </div>

            {doc?.stack && (
              <p className="text-sm sm:text-base leading-relaxed text-secondary">
                {doc.stack}
              </p>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              {project.tech.map((tech) => {
                const icon = getTechIcon(tech);
                return (
                  <div
                    key={tech}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/80 px-2.5 py-1 text-xs font-semibold text-foreground shadow-2xs"
                  >
                    {icon && (
                      <Image
                        src={icon.startsWith("/") ? icon : `https://cdn.simpleicons.org/${icon}`}
                        alt=""
                        width={14}
                        height={14}
                        className="size-3.5 shrink-0"
                        unoptimized
                      />
                    )}
                    <span>{tech}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Interactive Lab Section (HomeSense Platform) */}
        {project.slug === "homesense-platform" && (
          <div className="rounded-2xl sm:rounded-3xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/20 dark:from-indigo-950/25 dark:via-zinc-900/80 dark:to-purple-950/20 p-6 sm:p-8 md:p-10 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 px-3 py-1 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <span className="size-2 rounded-full bg-indigo-500 animate-pulse" />
                  LIVE INTERACTIVE LAB (FROM MYPORTFOLIO)
                </span>
                <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <FlaskConical className="size-7 text-indigo-600 dark:text-indigo-400" />
                  <span>Smart-Home Sensor Playback Lab</span>
                </h2>
                <p className="mt-2 text-sm sm:text-base text-secondary max-w-3xl leading-relaxed">
                  Step through synthetic smart-home motion and door sensor events over an apartment floor plan. See how the stream is dynamically projected into four synchronized representation modalities: <strong className="text-foreground">Sequence</strong>, <strong className="text-foreground">Text</strong>, <strong className="text-foreground">Raster</strong>, and <strong className="text-foreground">Graph</strong> for multimodal activity recognition.
                </p>
              </div>
            </div>

            <SensorPlayback />
          </div>
        )}

        {/* Local Deployment & Containers */}
        {(doc?.runsOn || doc?.howToRun) && (
          <div className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-slate-900 p-6 sm:p-8 text-white space-y-4 shadow-xs font-mono text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-slate-200">
              <Terminal className="size-4 text-emerald-400" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                Container Topology &amp; Ports
              </h3>
            </div>
            {doc.runsOn && (
              <div>
                <span className="text-emerald-400 font-bold">$ services: </span>
                <span className="text-slate-300">{doc.runsOn}</span>
              </div>
            )}
            {doc.howToRun && (
              <div className="pt-2 border-t border-slate-800">
                <span className="text-amber-400 font-bold">$ how to run: </span>
                <p className="mt-1 text-slate-300 whitespace-pre-line leading-relaxed">{doc.howToRun}</p>
              </div>
            )}
          </div>
        )}

        {/* Engineering Observations */}
        {doc?.notes && (
          <div className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-card/95 p-6 sm:p-8 space-y-3 shadow-xs">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-accent" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-secondary">
                Engineering Observations &amp; Notes
              </h3>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-secondary whitespace-pre-line">
              {doc.notes}
            </p>
          </div>
        )}

        {/* Screen by Screen Breakdown */}
        {images.length > 0 && (
          <div className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-card/95 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-accent" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-secondary">
                Complete Flow &amp; Screen Breakdown
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {images.map((img, i) => (
                <div
                  key={img.filename}
                  className="rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 p-4 space-y-2.5"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-border/60 bg-slate-900">
                    <Image
                      src={img.src}
                      alt={img.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-accent">
                      {i + 1}. {img.title}
                    </span>
                    {img.caption && (
                      <p className="mt-1 text-xs text-secondary leading-relaxed">
                        {img.caption}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
