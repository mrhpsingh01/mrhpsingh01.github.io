"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CaretLeft,
  CaretRight,
  ArrowsOutSimple,
  Eye,
  Info,
} from "@phosphor-icons/react";
import { getProjectDoc, type ProjectDocImage } from "@/config/project-docs-data";
import { cn } from "@/lib/utils";

interface ProjectPhotoCarouselProps {
  slug: string;
  fallbackCover?: string;
  fallbackGradient?: string;
  title?: string;
  aspectRatio?: string;
  className?: string;
  showCaption?: boolean;
  showCaseStudyButton?: boolean;
  onOpenCaseStudy?: (initialIndex?: number) => void;
}

export function ProjectPhotoCarousel({
  slug,
  fallbackCover,
  fallbackGradient,
  title = "Project",
  aspectRatio = "aspect-[16/10]",
  className = "",
  showCaption = true,
  showCaseStudyButton = true,
  onOpenCaseStudy,
}: ProjectPhotoCarouselProps) {
  const doc = getProjectDoc(slug);
  const images = doc?.images && doc.images.length > 0 ? doc.images : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const total = images.length;

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      e?.preventDefault();
      setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
    },
    [total]
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      e?.preventDefault();
      setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
    },
    [total]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (total <= 1) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    },
    [handlePrev, handleNext, total]
  );

  // Auto-advance carousel every 2 seconds (2000ms), pausing when hovered
  useEffect(() => {
    if (total <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, [total, isHovered]);

  // If no images from docs, use fallbackCover or gradient
  if (total === 0) {
    if (fallbackCover) {
      return (
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-xl border border-slate-200/70 dark:border-white/10 bg-muted shadow-xs",
            aspectRatio,
            className
          )}
        >
          <Image
            src={fallbackCover}
            alt={`${title} preview`}
            fill
            sizes="(max-width: 768px) 100vw, 460px"
            className="object-cover object-top transition-transform duration-500 hover:scale-[1.025]"
          />
        </div>
      );
    }

    return (
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-xl border border-slate-200/70 dark:border-white/10",
          "bg-linear-to-br flex flex-col justify-between p-5 shadow-xs",
          fallbackGradient || "from-slate-500/20 via-zinc-500/15 to-stone-500/20",
          aspectRatio,
          className
        )}
      >
        <div className="my-auto text-center">
          <span className="font-mono text-3xl font-extrabold tracking-tight text-foreground/30 sm:text-4xl">
            {title.slice(0, 3).toUpperCase()}
          </span>
        </div>
      </div>
    );
  }

  const currentImg = images[currentIndex];

  return (
    <div
      className={cn(
        "group/carousel relative w-full overflow-hidden rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-900 shadow-xs select-none",
        aspectRatio,
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} screenshots`}
    >
      {/* Active Screenshot Carousel with Crossfade */}
      {showCaseStudyButton ? (
        <Link
          href={`/projects/${slug}`}
          className="relative block size-full cursor-pointer"
          title={`View ${title} Case Study`}
        >
          {images.map((img, idx) => (
            <Image
              key={img.src}
              src={img.src}
              alt={img.caption || `${title} screenshot ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              className={cn(
                "object-cover object-top transition-opacity duration-300",
                idx === currentIndex
                  ? "opacity-100 z-10"
                  : "opacity-0 pointer-events-none z-0"
              )}
              priority={idx <= 1}
            />
          ))}
          {/* Subtle dark gradient overlay at top and bottom for readability */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/60 to-transparent z-15" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-15" />
        </Link>
      ) : (
        <div className="relative size-full">
          {images.map((img, idx) => (
            <Image
              key={img.src}
              src={img.src}
              alt={img.caption || `${title} screenshot ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              className={cn(
                "object-cover object-top transition-opacity duration-300",
                idx === currentIndex
                  ? "opacity-100 z-10"
                  : "opacity-0 pointer-events-none z-0"
              )}
              priority={idx <= 1}
            />
          ))}
          {/* Subtle dark gradient overlay at top and bottom for readability */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/60 to-transparent z-15" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-15" />
        </div>
      )}

      {/* Top Bar: Slide Index & Case Study Action */}
      <div className="absolute top-2.5 inset-x-2.5 z-20 flex items-center justify-between pointer-events-none">
        <span className="inline-flex items-center gap-1 rounded-md bg-black/75 px-2 py-0.5 font-mono text-[11px] font-medium text-white backdrop-blur-md shadow-xs pointer-events-auto">
          <span>{currentIndex + 1}</span>
          <span className="text-white/60">/</span>
          <span>{total}</span>
        </span>

        {showCaseStudyButton && (
          onOpenCaseStudy ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenCaseStudy(currentIndex);
              }}
              className="inline-flex items-center gap-1 rounded-md bg-black/75 hover:bg-black/90 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-md transition-colors shadow-xs pointer-events-auto"
              title="Expand into full case study"
            >
              <ArrowsOutSimple className="size-3" weight="bold" />
              <span className="hidden sm:inline">Case Study</span>
            </button>
          ) : (
            <Link
              href={`/projects/${slug}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 rounded-md bg-black/75 hover:bg-black/90 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-md transition-colors shadow-xs pointer-events-auto"
              title="Read full technical case study"
            >
              <ArrowsOutSimple className="size-3" weight="bold" />
              <span className="hidden sm:inline">Case Study</span>
            </Link>
          )
        )}
      </div>

      {/* Navigation Arrows (Visible on hover or when total > 1) */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous image"
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 z-20 size-8 sm:size-9 rounded-full",
              "flex items-center justify-center bg-black/70 hover:bg-black/90 text-white backdrop-blur-md",
              "border border-white/10 transition-all duration-200 active:scale-95 shadow-md",
              isHovered ? "opacity-100 scale-100" : "opacity-0 sm:opacity-75 scale-90 sm:scale-100"
            )}
          >
            <CaretLeft className="size-4 sm:size-5" weight="bold" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next image"
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 z-20 size-8 sm:size-9 rounded-full",
              "flex items-center justify-center bg-black/70 hover:bg-black/90 text-white backdrop-blur-md",
              "border border-white/10 transition-all duration-200 active:scale-95 shadow-md",
              isHovered ? "opacity-100 scale-100" : "opacity-0 sm:opacity-75 scale-90 sm:scale-100"
            )}
          >
            <CaretRight className="size-4 sm:size-5" weight="bold" />
          </button>
        </>
      )}

      {/* Bottom Bar: Caption & Dots */}
      <div className="absolute bottom-2.5 inset-x-2.5 z-20 flex flex-col gap-1.5 pointer-events-none">
        {showCaption && currentImg.caption && (
          <div className="pointer-events-auto rounded-lg bg-black/80 px-2.5 py-1.5 backdrop-blur-md border border-white/10 shadow-sm">
            <p className="line-clamp-2 text-[11px] leading-snug text-white/95">
              <strong className="font-semibold text-white mr-1.5">
                {currentImg.title}:
              </strong>
              {currentImg.caption}
            </p>
          </div>
        )}

        {/* Dots Navigator */}
        {total > 1 && (
          <div className="flex items-center justify-center gap-1 py-0.5 pointer-events-auto">
            {images.slice(0, 14).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                aria-label={`Go to image ${idx + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-200",
                  idx === currentIndex
                    ? "w-5 bg-white"
                    : "w-1.5 bg-white/40 hover:bg-white/70"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
