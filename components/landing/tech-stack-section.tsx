"use client";

import Image from "next/image";
import { Container } from "@/components/container";
import { techCategories } from "@/config/tech-stack";

export function TechStackSection() {
  return (
    <Container className="py-2">
      {/* Section Heading from Palakonweb */}
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="font-serif font-bold text-2xl md:text-3xl tracking-tight text-foreground">
          Tech Stack
        </h2>
      </div>

      {/* Rotating Marquee Lines for Different Domains */}
      <div className="flex flex-col gap-4">
        {techCategories.map((cat) => (
          <div key={cat.id} className="flex flex-col">
            <div className="mb-1.5 flex items-center gap-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="size-1.5 rounded-full bg-red-600" />
              {cat.label}
            </div>

            <div className="marquee-container">
              <div
                className="marquee"
                style={{
                  animation: `${cat.direction === "left" ? "marquee-left" : "marquee-right"} ${cat.duration}s linear infinite`,
                }}
              >
                {[0, 1, 2].map((copyIndex) =>
                  cat.skills.map((skill, idx) => (
                    <div
                      key={`${cat.id}-${copyIndex}-${idx}`}
                      className="flex items-center gap-2 rounded-full border border-black/10 bg-white/90 px-3.5 py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-xs"
                    >
                      <span className="flex size-4.5 shrink-0 items-center justify-center">
                        <Image
                          src={`https://cdn.simpleicons.org/${skill.icon}/${(skill.color ?? "111111").replace("#", "")}`}
                          alt={skill.name}
                          width={16}
                          height={16}
                          className="size-4 shrink-0"
                          unoptimized
                        />
                      </span>
                      <span className="whitespace-nowrap text-xs font-semibold text-foreground/90">
                        {skill.name}
                      </span>
                    </div>
                  )),
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
