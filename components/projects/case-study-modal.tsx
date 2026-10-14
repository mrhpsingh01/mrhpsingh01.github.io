"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  CaretLeft,
  CaretRight,
  ArrowSquareOut,
  GithubLogo,
  CheckCircle,
  Terminal,
  Cpu,
  Stack,
  FileText,
  Lightbulb,
  Flask,
} from "@phosphor-icons/react";
import { type Project } from "@/config/projects";
import { getProjectDoc, type ProjectDoc } from "@/config/project-docs-data";
import { SensorPlayback } from "@/components/lab/SensorPlayback";
import { getTechIcon } from "@/lib/tech-icons";
import { cn } from "@/lib/utils";

interface CaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  initialImageIndex?: number;
}

export function CaseStudyModal({
  isOpen,
  onClose,
  project,
  initialImageIndex = 0,
}: CaseStudyModalProps) {
  const doc: ProjectDoc | undefined = getProjectDoc(project.slug);
  const [activeImageIndex, setActiveImageIndex] = useState(initialImageIndex);
  const [isLabExpanded, setIsLabExpanded] = useState(true);

  useEffect(() => {
    setActiveImageIndex(initialImageIndex);
  }, [initialImageIndex, isOpen]);

  // Handle escape key and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (doc?.images && doc.images.length > 1) {
        if (e.key === "ArrowLeft") {
          setActiveImageIndex((prev) =>
            prev === 0 ? doc.images.length - 1 : prev - 1
          );
        } else if (e.key === "ArrowRight") {
          setActiveImageIndex((prev) =>
            prev === doc.images.length - 1 ? 0 : prev + 1
          );
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose, doc]);

  if (!isOpen) return null;

  const images = doc?.images || [];
  const currentImage = images[activeImageIndex];
  const isExternal = Boolean(project.website || (project.href && project.href.startsWith("http")));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-950 border border-slate-200/90 dark:border-white/10 shadow-2xl p-5 sm:p-7 md:p-9 text-foreground space-y-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close case study"
          className="absolute right-4 top-4 z-30 size-9 rounded-full bg-slate-100 dark:bg-zinc-800 text-foreground hover:bg-slate-200 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors shadow-xs"
        >
          <X className="size-5" weight="bold" />
        </button>

        {/* Modal Header */}
        <div className="space-y-4 border-b border-border/60 pb-6 pr-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-border/80 bg-muted/40 px-2.5 py-1 font-mono text-xs font-semibold text-secondary">
              {project.categoryLabel}
            </span>
            {project.contextLabel && (
              <span className="rounded-md border border-border/80 bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 font-mono text-xs text-secondary font-medium">
                {project.contextLabel}
              </span>
            )}
            {project.period && (
              <span className="rounded-md border border-slate-200 dark:border-zinc-800 px-2.5 py-1 font-mono text-xs text-secondary">
                {project.period}
              </span>
            )}
            <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Technical Case Study
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2
                id="case-study-title"
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground"
              >
                {project.title}
              </h2>
              {doc?.type && (
                <p className="mt-1.5 text-sm sm:text-base font-medium text-secondary">
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
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-accent text-accent-fg hover:bg-accent-strong px-3.5 py-1.5 text-xs font-semibold transition-colors shadow-xs"
                >
                  <span>Visit Live App</span>
                  <ArrowSquareOut className="size-3.5" weight="bold" />
                </Link>
              )}
              {project.href && project.href.includes("github.com") && (
                <Link
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white/90 dark:bg-zinc-800 px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors shadow-xs"
                >
                  <GithubLogo className="size-3.5" weight="fill" />
                  <span>Repository</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Interactive Screenshot Gallery & Walkthrough             */}
        {/* ========================================================= */}
        {images.length > 0 && (
          <div className="space-y-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-zinc-900/60 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stack className="size-4 text-accent" weight="bold" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-secondary">
                  Interface &amp; Flow Gallery ({images.length} Captured Screens)
                </h3>
              </div>
              <span className="font-mono text-xs font-semibold text-secondary">
                {activeImageIndex + 1} of {images.length}
              </span>
            </div>

            {/* Main Active Image View */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-900 shadow-md">
              <Image
                src={currentImage.src}
                alt={currentImage.caption || currentImage.title}
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover object-top"
                priority
              />

              {/* Prev / Next controls */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1
                      )
                    }
                    aria-label="Previous screen"
                    className="absolute left-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/75 hover:bg-black/95 text-white flex items-center justify-center transition-all border border-white/20 active:scale-95 shadow-md"
                  >
                    <CaretLeft className="size-5" weight="bold" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1
                      )
                    }
                    aria-label="Next screen"
                    className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/75 hover:bg-black/95 text-white flex items-center justify-center transition-all border border-white/20 active:scale-95 shadow-md"
                  >
                    <CaretRight className="size-5" weight="bold" />
                  </button>
                </>
              )}
            </div>

            {/* Active Screen Caption */}
            <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 sm:p-4 shadow-2xs">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-accent">
                  Screen {activeImageIndex + 1}:
                </span>
                <h4 className="font-bold text-sm sm:text-base text-foreground">
                  {currentImage.title}
                </h4>
              </div>
              {currentImage.caption && (
                <p className="mt-1 text-xs sm:text-sm text-secondary leading-relaxed">
                  {currentImage.caption}
                </p>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={img.filename}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={cn(
                      "relative aspect-[16/10] w-20 sm:w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                      idx === activeImageIndex
                        ? "border-accent scale-102 shadow-md ring-2 ring-accent/30"
                        : "border-border/70 opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={img.src}
                      alt={img.title}
                      fill
                      sizes="96px"
                      className="object-cover object-top"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* Core System Overview / "What It Is"                      */}
        {/* ========================================================= */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="size-4 text-accent" weight="bold" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-secondary">
              System Architecture &amp; Overview
            </h3>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-zinc-900/40 p-5 sm:p-6 space-y-4 text-sm sm:text-base leading-relaxed text-secondary">
            {doc?.whatItIs ? (
              <p className="whitespace-pre-line">{doc.whatItIs}</p>
            ) : (
              <p>{project.description}</p>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* Interactive Sensor Playback Lab (HomeSense Platform)      */}
        {/* ========================================================= */}
        {project.slug === "homesense-platform" && (
          <div className="space-y-4 rounded-2xl sm:rounded-3xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/20 dark:from-indigo-950/25 dark:via-zinc-900/80 dark:to-purple-950/20 p-5 sm:p-7 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 px-3 py-1 font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                  <span className="size-2 rounded-full bg-indigo-500 animate-pulse" />
                  INTERACTIVE LAB DEMO (FROM MYPORTFOLIO)
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <Flask className="size-5 text-indigo-600 dark:text-indigo-400" weight="bold" />
                  <span>Smart-Home Sensor Playback Lab</span>
                </h3>
                <p className="text-xs sm:text-sm text-secondary max-w-2xl leading-relaxed">
                  Interactive simulation of smart-home sensor events over an apartment floor plan. See how the raw stream is mapped into four synchronized modalities: <strong className="text-foreground">Sequence</strong>, <strong className="text-foreground">Text</strong>, <strong className="text-foreground">Raster</strong>, and <strong className="text-foreground">Graph</strong> for multimodal activity recognition.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsLabExpanded((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white/90 dark:bg-zinc-800 px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors shadow-2xs cursor-pointer"
              >
                <span>{isLabExpanded ? "Hide Interactive Lab" : "Open Interactive Lab"}</span>
              </button>
            </div>

            {isLabExpanded && (
              <div className="pt-2">
                <SensorPlayback />
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* Technology Stack & Pipeline                              */}
        {/* ========================================================= */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Cpu className="size-4 text-accent" weight="bold" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-secondary">
              Technologies &amp; Components
            </h3>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-zinc-900/40 p-5 sm:p-6 space-y-4">
            {doc?.stack && (
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
                  Infrastructure Stack:
                </p>
                <p className="mt-1 text-sm text-foreground/90 font-medium leading-relaxed">
                  {doc.stack}
                </p>
              </div>
            )}

            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary mb-2.5">
                Core Tech:
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => {
                  const icon = getTechIcon(tech);
                  return (
                    <div
                      key={tech}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-foreground shadow-2xs"
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
        </div>

        {/* ========================================================= */}
        {/* Local Deployment & Runs On                               */}
        {/* ========================================================= */}
        {(doc?.runsOn || doc?.howToRun) && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Terminal className="size-4 text-accent" weight="bold" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-secondary">
                Container Topology &amp; Execution
              </h3>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-900 p-5 sm:p-6 text-white font-mono text-xs sm:text-sm space-y-3">
              {doc.runsOn && (
                <div>
                  <span className="text-emerald-400 font-bold">$ services &amp; ports:</span>
                  <p className="mt-1 text-slate-300 leading-relaxed">{doc.runsOn}</p>
                </div>
              )}
              {doc.howToRun && (
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-amber-400 font-bold">$ how to run:</span>
                  <p className="mt-1 text-slate-300 whitespace-pre-line leading-relaxed">{doc.howToRun}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* Technical Notes & Trade-offs                             */}
        {/* ========================================================= */}
        {doc?.notes && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-accent" weight="bold" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-secondary">
                Engineering Observations &amp; Notes
              </h3>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-zinc-900/40 p-5 sm:p-6 text-xs sm:text-sm text-secondary leading-relaxed whitespace-pre-line">
              {doc.notes}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-6">
          <Link
            href={`/projects/${project.slug}`}
            className="text-xs sm:text-sm font-semibold text-secondary hover:text-foreground transition-colors underline underline-offset-4"
          >
            Open Standalone Case Study Page &rarr;
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-5 py-2 text-xs sm:text-sm font-semibold hover:bg-muted transition-colors"
          >
            Close Case Study
          </button>
        </div>
      </div>
    </div>
  );
}
