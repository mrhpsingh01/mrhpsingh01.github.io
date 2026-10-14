"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { Container } from "@/components/container";
import { navItems } from "@/content/site";
import { mailto, profile } from "@/content/profile";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string, also: string[] = []) {
  if (href === "/") return pathname === "/";
  return [href, ...also].some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className="no-print sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md transition-colors"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="group flex items-center select-none"
          aria-label={`${profile.name}, home`}
        >
          <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-foreground whitespace-nowrap transition-colors group-hover:text-accent">
            {profile.name}
          </span>
        </Link>

        {/* Desktop Nav Items inside Glass Pill Bar */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-1 rounded-full border border-border/80 bg-muted/30 px-1.5 py-1 backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
        >
          {navItems.map((item) => {
            const active = isActive(pathname, item.href, item.also);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all duration-150 select-none",
                  active
                    ? "bg-white dark:bg-card text-foreground font-semibold shadow-xs border border-border/80"
                    : "text-secondary hover:text-foreground hover:bg-muted/60",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action: Let's talk CTA */}
        <div className="flex items-center gap-2.5">
          <a
            href={mailto}
            className="group hidden sm:inline-flex flex-col items-center justify-center text-center px-3 py-1 select-none transition-all duration-200 ease-out hover:scale-110 active:scale-95 cursor-pointer origin-center"
            aria-label="Let's talk"
          >
            <span className="text-sm sm:text-base font-bold leading-none tracking-tight text-foreground transition-colors duration-200 group-hover:text-accent">
              Let&apos;s
            </span>
            <span className="mt-0.5 text-sm sm:text-base font-bold leading-none tracking-tight text-foreground transition-colors duration-200 group-hover:text-accent">
              talk
            </span>
            <span className="mt-1 h-[2px] w-0 rounded-full bg-accent transition-all duration-200 ease-out group-hover:w-full" />
          </a>

          {/* Mobile Hamburger Button */}
          <button
            ref={buttonRef}
            type="button"
            className="flex size-10 items-center justify-center rounded-xl border border-border/80 bg-card/80 text-foreground transition-colors hover:bg-muted md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </Container>

      {/* Mobile Menu Dropdown */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Primary mobile"
          className="border-b border-border/80 bg-background/95 backdrop-blur-xl md:hidden shadow-lg animate-in fade-in-0 slide-in-from-top-2 duration-200"
        >
          <Container className="flex flex-col gap-1.5 py-4">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href, item.also);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex min-h-11 items-center justify-between rounded-xl px-4 text-sm font-medium transition-all",
                    active
                      ? "bg-accent/10 text-accent font-semibold border border-accent/20"
                      : "text-foreground hover:bg-muted/60",
                  )}
                >
                  <span>{item.label}</span>
                  {active && <span className="size-1.5 rounded-full bg-accent" />}
                </Link>
              );
            })}
            <div className="pt-2">
              <a
                href={mailto}
                className="flex min-h-11 w-full items-center justify-center rounded-xl bg-accent px-4 text-sm font-semibold text-accent-fg transition-all duration-200 hover:bg-accent-strong hover:shadow-md active:scale-95"
              >
                <span>Let&apos;s talk</span>
              </a>
            </div>
          </Container>
        </nav>
      )}
    </header>
  );
}
