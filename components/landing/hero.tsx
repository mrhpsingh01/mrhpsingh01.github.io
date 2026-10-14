"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  CalendarBlank,
  EnvelopeSimple,
  FileText,
  GithubLogo,
  LinkedinLogo,
  MediumLogo,
  SealCheck,
  XLogo,
} from "@phosphor-icons/react";
import { Container } from "@/components/container";
import { InteractiveMascot } from "@/components/landing/interactive-mascot";
import { TypewriterTitle } from "@/components/landing/typewriter-title";
import { SpotifyLastPlayed } from "@/components/landing/spotify-last-played";
import { HandwrittenArrow, HandwrittenNote } from "@/components/landing/handwritten-note";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { heroConfig, socialLinks } from "@/config/hero";

const iconMap = {
  x: XLogo,
  linkedin: LinkedinLogo,
  github: GithubLogo,
  medium: MediumLogo,
  mail: EnvelopeSimple,
  resume: FileText,
};

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure muted is set both as attribute and DOM property for iOS/mobile WebKit
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playVideo = () => {
      video.play().catch(() => {
        // Handled silently if mobile battery-saver blocks initial execution
      });
    };

    playVideo();

    // Secondary listener: kicks off playback immediately on the very first touch/scroll if blocked by OS
    const handleInteraction = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    };

    window.addEventListener("touchstart", handleInteraction, { once: true, passive: true });
    window.addEventListener("scroll", handleInteraction, { once: true, passive: true });
    window.addEventListener("click", handleInteraction, { once: true, passive: true });

    return () => {
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("click", handleInteraction);
    };
  }, []);

  return (
    <Container className="pt-4 sm:pt-6">
      <div className="flex flex-col gap-5">
        {/* Profile Banner with Palakonweb Aspect Ratio & Dimensions */}
        <div className="relative w-full mb-14 md:mb-20">
          <div className="rounded-[20px] w-full">
            <div className="relative w-full aspect-[21/9] md:aspect-[3/1] rounded-[20px] overflow-hidden border border-foreground/15 shadow-sm bg-black">
              <video
                ref={videoRef}
                src="/assets/uga_Arch_snow_1080.mp4"
                poster="/assets/arch.webp"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                controls={false}
                disablePictureInPicture
                disableRemotePlayback
                className="absolute inset-0 w-full h-full object-cover object-[center_38%] pointer-events-none select-none"
              />
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />

              {/* UGA Name Overlay */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-5 md:top-5 md:right-6 z-20 pointer-events-none select-none">
                <Image
                  src="/assets/uga_name.png"
                  alt="University of Georgia"
                  width={280}
                  height={92}
                  className="h-6 sm:h-8 md:h-10 lg:h-11 w-auto object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] filter"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Interactive Mascot Avatar with Red Gradient Ring */}
          <div className="absolute -bottom-16 md:-bottom-20 left-6 md:left-8 z-30">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full p-[3.5px] bg-gradient-to-br from-red-400 to-red-600 shadow-[0_8px_24px_rgba(220,38,38,0.2)]">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-white flex items-end justify-center pb-0.5 sm:pb-1">
                <div className="relative w-[74%] h-[74%] flex items-end justify-center">
                  <InteractiveMascot
                    directions="/mascots/male-directions.webp"
                    reactions="/mascots/male-reactions.webp"
                    label="Harmanpreet"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Handwritten Note next to Profile Avatar (from Chanhdai) */}
          <HandwrittenNote className="flex -bottom-10 sm:-bottom-12 md:-bottom-14 left-[148px] sm:left-[168px] md:left-[208px] flex-col items-start z-30 pointer-events-none select-none">
            <HandwrittenArrow className="-scale-y-100 -rotate-6 size-6 sm:size-7 md:size-8 text-muted-foreground/80" />
            <span className="ml-3 sm:ml-3.5 -rotate-6 text-sm sm:text-base md:text-lg text-muted-foreground leading-snug">
              follows your cursor
              <span className="block text-red-600 font-medium">click for a reaction</span>
            </span>
          </HandwrittenNote>

          {/* Desktop Action Buttons (Palakonweb) */}
          <div className="hidden md:flex absolute -bottom-12 md:-bottom-14 right-0 flex-wrap justify-end gap-3 z-30">
            <Link
              href="/work"
              className="group flex items-center gap-2 px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-sm font-medium text-xs md:text-sm hover:shadow-md transition-all duration-150"
            >
              <span>View Projects</span>
              <ArrowRight size={14} className="transition-transform duration-150 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/resume"
              className="group flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-100 border border-black/10 dark:border-white/10 rounded-full shadow-sm font-medium text-xs md:text-sm hover:shadow-md transition-all duration-150"
            >
              <span>View Resume</span>
              <ArrowRight size={14} className="transition-transform duration-150 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Mobile Action Buttons (Palakonweb) */}
        <div className="flex md:hidden w-full gap-2.5 mt-12 sm:mt-14 mb-4">
          <Link
            href="/work"
            className="flex-1 flex items-center justify-center gap-1.5 h-11 bg-white text-black border border-black/10 rounded-[18px] font-medium text-[13px] whitespace-nowrap shadow-sm"
          >
            <span>View Projects</span>
            <ArrowRight size={14} className="transform -rotate-45 opacity-60" />
          </Link>
          <Link
            href="/resume"
            className="flex-1 flex items-center justify-center gap-1.5 h-11 bg-[#1f1f1f] text-white rounded-[18px] font-medium text-[13px] whitespace-nowrap shadow-sm"
          >
            <span>View Resume</span>
            <ArrowRight size={14} className="transform -rotate-45 opacity-60" />
          </Link>
        </div>

        {/* Palakonweb Name, Pink Typewriter Subtitle, and Location */}
        <div className="w-full mb-3 pt-2 md:pt-1">
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-3xl md:text-4xl text-foreground tracking-tight">
              {heroConfig.name}
            </h1>
            <SealCheck
              className="size-6 text-[#1D9BF0] shrink-0"
              weight="fill"
              aria-label="Verified"
            />
          </div>

          <div className="mt-1">
            <TypewriterTitle />
          </div>

          <p className="font-sans text-[13px] md:text-sm text-muted-foreground mt-1.5">
            {heroConfig.location}
          </p>
        </div>

        <p className="w-full text-sm leading-relaxed text-secondary sm:text-base">
          {heroConfig.bio}
        </p>

        {/* Social Links & Contact */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-0.5">
            {socialLinks.map((link) => {
              const Icon = iconMap[link.icon];
              const external = link.href.startsWith("http") || link.href.startsWith("mailto:");

              return (
                <Tooltip key={link.name} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={link.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      aria-label={link.name}
                      className="flex items-center gap-2 p-1.5 text-secondary transition-colors hover:text-foreground"
                    >
                      <Icon className="size-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>{link.name}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Link
              href={heroConfig.calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90 sm:text-sm"
            >
              <CalendarBlank className="size-3.5 sm:size-4" weight="bold" />
              Book a call
            </Link>
            <Link
              href={`mailto:${heroConfig.email}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted sm:text-sm"
            >
              <EnvelopeSimple className="size-3.5 sm:size-4" weight="bold" />
              Email me
            </Link>
          </div>
        </div>

        <div className="max-w-full pt-1">
          <SpotifyLastPlayed />
        </div>
      </div>
    </Container>
  );
}
