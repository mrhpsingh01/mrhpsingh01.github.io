"use client";

import Image from "next/image";
import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { Container } from "@/components/container";
import { education, type EducationItem } from "@/config/education";

function EducationCardItem({
  item,
  delay,
  isOpen,
  onToggle,
}: {
  item: EducationItem;
  delay: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const hasContent = Boolean(item.details?.length || item.coursework?.length);

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
        <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card p-2.5 shadow-sm transition-transform hover:scale-[1.02]">
          <Image
            src={item.logo}
            alt={`${item.school} logo`}
            fill
            sizes="64px"
            className="object-contain p-2"
          />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-2xl font-bold tracking-tight text-foreground transition-colors hover:text-secondary">
              {item.school}
            </h3>
          </div>
          <p className="mt-1 text-xl text-foreground">{item.degree}</p>
        </div>

        <div className="flex items-start justify-between gap-3 text-left text-base text-secondary sm:min-w-[190px] sm:justify-end sm:text-right sm:text-lg">
          <div>
            <p>{item.periodLong}</p>
            <p className="mt-1">{item.locationLong}</p>
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
            {item.details && item.details.length > 0 && (
              <ul className="space-y-2.5 text-base leading-relaxed text-secondary sm:text-lg">
                {item.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-2.5">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-secondary/60" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            )}

            {item.coursework && item.coursework.length > 0 && (
              <div className="pt-1">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Key Coursework & Focus Areas
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.coursework.map((course) => (
                    <span
                      key={course}
                      className="inline-flex items-center rounded-lg border border-border bg-background/70 px-3 py-1.5 text-sm font-semibold text-foreground shadow-sm"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function EducationSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section>
      <Container className="py-2">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="font-serif font-bold text-2xl md:text-3xl tracking-tight text-foreground">
            Education
          </h2>
        </div>
        <div className="divide-y divide-border">
          {education.map((item, index) => (
            <EducationCardItem
              key={`${item.school}-${index}`}
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
