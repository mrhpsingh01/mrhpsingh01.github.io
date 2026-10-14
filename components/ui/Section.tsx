import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface SectionProps {
  id?: string;
  title: string;
  /** Short plain-language lead under the heading, stacked below it. */
  lead?: string;
  children: ReactNode;
  className?: string;
  headingLevel?: "h2" | "h3";
}

/** A page section with a labelled heading. Heading and lead stack vertically. */
export function Section({ id, title, lead, children, className = "", headingLevel = "h2" }: SectionProps) {
  const Heading = headingLevel;
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className={`py-16 sm:py-24 ${className}`}>
      <div className="container-page">
        <Reveal>
          <Heading id={headingId} className="text-title max-w-[22ch]">
            {title}
          </Heading>
          {lead ? <p className="mt-4 max-w-[62ch] text-muted">{lead}</p> : null}
        </Reveal>
        <div className="mt-10 sm:mt-12">{children}</div>
      </div>
    </section>
  );
}
