import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

interface ExternalAnchorProps {
  href: string;
  children: ReactNode;
  className?: string;
}

/** An outbound link that always carries an href and announces that it opens a new tab. */
export function ExternalAnchor({ href, children, className = "link-inline" }: ExternalAnchorProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <ArrowUpRight aria-hidden="true" size={14} strokeWidth={2} className="ml-0.5 inline-block align-[-1px]" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
