import Link from "next/link";
import { ArrowUpRight, Download } from "lucide-react";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "quiet";

const base =
  "btn-chunk inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-[0.9375rem] font-semibold transition-[background-color,color,border-color,transform,box-shadow] duration-150";

const variants: Record<Variant, string> = {
  primary: "border-2 border-ink bg-accent text-accent-fg hover:bg-accent-strong",
  secondary: "border-2 border-ink bg-surface text-fg hover:bg-p4",
  quiet: "px-2 text-accent hover:text-accent-strong underline-offset-4 hover:underline",
};

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  /** A file the visitor should save rather than open: a plain anchor with the download attribute. */
  download?: boolean;
}

/** Internal links use next/link; mailto and external links use a plain anchor. */
export function ButtonLink({ href, children, variant = "primary", className = "", download = false }: ButtonLinkProps) {
  const classes = `${base} ${variants[variant]} ${className}`;
  const isExternal = /^https?:\/\//.test(href);

  if (download) {
    return (
      <a href={href} download className={classes}>
        <Download aria-hidden="true" size={16} strokeWidth={2} />
        {children}
      </a>
    );
  }
  const isMail = href.startsWith("mailto:");

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
        <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2} />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }
  if (isMail) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
