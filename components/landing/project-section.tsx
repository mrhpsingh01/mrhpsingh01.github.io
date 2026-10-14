"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "@phosphor-icons/react";
import { Container } from "@/components/container";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { HomeSenseTwin } from "@/components/landing/homesense-twin";
import { getTechIcon } from "@/lib/tech-icons";
import { projects } from "@/config/projects";

export function ProjectSection() {
  const project = projects.find((p) => p.slug === "homesense-platform") || projects[0];

  return (
    <section>
      <Container>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-secondary">Featured</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
              Latest Project
            </h2>
          </div>
        </div>

        <LiquidGlassCard
          glowIntensity="md"
          shadowIntensity="lg"
          borderRadius="24px"
          blurIntensity="md"
          className="p-6 sm:p-8 lg:p-10"
        >
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left side: Description & Tech Stack */}
            <div className="flex flex-col justify-between lg:col-span-6">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
                  Latest project, June to October 2026
                </p>

                <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  {project.title}
                </h3>

                <p className="mt-4 text-base leading-relaxed text-secondary sm:text-lg">
                  I took my thesis model for smart-home activity recognition and built the platform a real deployment would need around it: a streaming pipeline, anomaly review, a controlled assistant, a resident simulator, gated model releases, web and phone apps, and Kubernetes packaging.
                </p>

                <p className="mt-3 text-sm leading-relaxed text-secondary/85">
                  Built around live Kafka streaming, digital-twin floorplan viewer, anomaly review, and Kubernetes orchestration.
                </p>

                {/* Case Study Actions */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all hover:shadow-lg active:scale-95 cursor-pointer"
                  >
                    <BookOpen className="size-4" weight="bold" />
                    <span>Explore Case Study</span>
                    <ArrowRight className="size-4" weight="bold" />
                  </Link>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-sm font-semibold text-secondary">Technologies</p>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {project.tech.map((tech) => {
                    const icon = getTechIcon(tech);
                    return (
                      <div
                        key={tech}
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/80 px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs"
                      >
                        {icon && (
                          <Image
                            src={icon.startsWith("/") ? icon : `https://cdn.simpleicons.org/${icon}`}
                            alt={tech}
                            width={16}
                            height={16}
                            className="size-4 shrink-0"
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

            {/* Right side: Animation from myportfolio */}
            <div className="flex items-center justify-center p-2 sm:p-4 lg:col-span-6">
              <HomeSenseTwin />
            </div>
          </div>
        </LiquidGlassCard>
      </Container>
    </section>
  );
}
