"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CaretDown, ArrowUpRight } from "@phosphor-icons/react";
import { Container } from "@/components/container";
import { experience, type ExperienceItem } from "@/config/experience";

type FeaturedItem = {
  type: "experience";
  title: string;
  subtitle: string;
  period: string;
  location: string;
  image: string;
  website?: string;
  details: string[];
  tech: string[];
  href: string;
};

const techIcons: Record<string, string> = {
  "Data Pipelines": "apacheairflow",
  "Feature Engineering": "scikitlearn",
  IoT: "arduino",
  "Machine Learning": "tensorflow",
  Nextjs: "nextdotjs",
  "Next.js": "nextdotjs",
  PostgreSQL: "postgresql",
  Python: "python",
  React: "react",
  TypeScript: "typescript",
  Docker: "docker",
  Kubernetes: "kubernetes",
  AWS: "amazonwebservices",
  MongoDB: "mongodb",
  "Node.js": "nodedotjs",
  FastAPI: "fastapi",
  Redis: "redis",
  Redux: "redux",
  "Tailwind CSS": "tailwindcss",
  Git: "git",
  "CI/CD": "githubactions",
  Prometheus: "prometheus",
  Grafana: "grafana",
  Postman: "postman",
  "RESTful APIs": "fastapi",
  JavaScript: "javascript",
  "Vue 2/3": "vuedotjs",
  "React Native": "react",
  Jira: "jira",
  Swagger: "swagger",
};

function experienceToFeatured(item: ExperienceItem): FeaturedItem {
  return {
    type: "experience",
    title: item.company,
    subtitle: item.role,
    period: item.periodLong,
    location: item.locationLong.trim(),
    image: item.logo ?? "/assets/products/profound-properties.webp",
    website: item.website,
    details: item.details ?? [],
    tech: item.tech ?? [],
    href: "/work",
  };
}

function TechPill({ name }: { name: string }) {
  const icon = techIcons[name] ?? name.toLowerCase().replaceAll(" ", "");

  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/70 px-3 py-1.5 text-sm font-semibold text-foreground shadow-sm">
      <Image
        src={`https://cdn.simpleicons.org/${icon}`}
        alt=""
        width={16}
        height={16}
        className="size-4 shrink-0"
        unoptimized
      />
      {name}
    </span>
  );
}

function FeaturedExperienceItem({
  item,
  delay,
  isOpen,
  onToggle,
}: {
  item: FeaturedItem;
  delay: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const hasContent = item.details.length > 0 || item.tech.length > 0;

  return (
    <article
      className="animate-in-up-on-view py-7"
      style={{ animationDelay: `${delay}s` }}
    >
      <div
        onClick={hasContent ? onToggle : undefined}
        className={`grid gap-4 sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:items-start ${
          hasContent ? "cursor-pointer select-none" : ""
        }`}
        role={hasContent ? "button" : undefined}
        aria-expanded={hasContent ? isOpen : undefined}
        tabIndex={hasContent ? 0 : undefined}
        onKeyDown={(e) => {
          if (hasContent && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        {item.website ? (
          <a
            href={item.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card p-2.5 shadow-sm transition-all hover:scale-105 hover:border-accent"
            title={`Visit ${item.title}`}
          >
            <Image
              src={item.image}
              alt={`${item.title} logo`}
              fill
              sizes="64px"
              className="object-contain p-2"
            />
          </a>
        ) : (
          <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card p-2.5 shadow-sm transition-transform hover:scale-[1.02]">
            <Image
              src={item.image}
              alt={`${item.title} logo`}
              fill
              sizes="64px"
              className="object-contain p-2"
            />
          </div>
        )}

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            {item.website ? (
              <a
                href={item.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="group/link inline-flex items-center gap-1.5 transition-colors"
                title={`Visit ${item.title}`}
              >
                <h3 className="text-2xl font-bold tracking-tight text-foreground transition-colors group-hover/link:text-accent">
                  {item.title}
                </h3>
                <ArrowUpRight className="size-5 text-secondary/70 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:text-accent" />
              </a>
            ) : (
              <h3 className="text-2xl font-bold tracking-tight text-foreground">
                {item.title}
              </h3>
            )}
          </div>
          <p className="mt-1 text-xl text-foreground">{item.subtitle}</p>
        </div>

        <div className="flex items-start justify-between gap-3 text-left text-base text-secondary sm:min-w-[190px] sm:justify-end sm:text-right sm:text-lg">
          <div>
            <p>{item.period}</p>
            <p className="mt-1">{item.location}</p>
          </div>
          {hasContent && (
            <div
              className={`mt-1 inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-secondary transition-all duration-300 hover:bg-muted hover:text-foreground ${
                isOpen ? "rotate-180 bg-muted text-foreground" : ""
              }`}
            >
              <CaretDown className="size-4" weight="bold" />
            </div>
          )}
        </div>
      </div>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="mt-5 space-y-4">
            {item.details.length > 0 && (
              <ul className="space-y-2.5 text-base leading-relaxed text-secondary sm:text-lg">
                {item.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-2.5">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-secondary/60" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            )}

            {item.tech.length > 0 && (
              <div className="flex flex-wrap gap-2.5 pt-1">
                {item.tech.map((name) => (
                  <TechPill key={name} name={name} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function FeaturedExperienceSection() {
  const items: FeaturedItem[] = experience.map(experienceToFeatured);
  // Start all experience items minimized
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section>
      <Container className="py-2">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="font-serif font-bold text-2xl md:text-3xl tracking-tight text-foreground">
            Experience
          </h2>
        </div>
        <div className="divide-y divide-border">
          {items.map((item, index) => (
            <FeaturedExperienceItem
              key={`${item.type}-${item.title}-${index}`}
              item={item}
              delay={(index + 1) * 0.05}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex((prev) => (prev === index ? null : index))
              }
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
