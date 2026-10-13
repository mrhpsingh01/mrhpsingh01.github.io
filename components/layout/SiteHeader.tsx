"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navItems } from "@/content/site";
import { mailto, profile } from "@/content/profile";
import { ButtonLink } from "@/components/ui/ButtonLink";

function isActive(pathname: string, href: string, also: string[] = []) {
  return [href, ...also].some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function SiteHeader() {
  const pathname = usePathname();
  // Remember which path the menu was opened on: navigating closes it without an effect.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;
  const buttonRef = useRef<HTMLButtonElement>(null);

  const linkBase =
    "pill-nav rounded-full border-2 border-transparent px-4 py-2 text-[0.9375rem] font-semibold transition-colors duration-150";

  return (
    <header
      className="no-print sticky top-0 z-40 border-b-[2.5px] border-ink bg-bg"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpenFor(null);
          buttonRef.current?.focus();
        }
      }}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-[1.05rem] font-extrabold tracking-tight text-fg" aria-label={`${profile.name}, home`}>
          {profile.name}
        </Link>

        <div className="flex items-center gap-2">
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href, item.also);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`${linkBase} ${
                    active
                      ? "border-ink bg-p3 text-fg"
                      : "text-muted hover:border-ink hover:bg-surface hover:text-fg"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <ButtonLink href={mailto} variant="secondary" className="ml-2 min-h-10 py-2">
              Email me
            </ButtonLink>
          </nav>

          <button
            ref={buttonRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border-2 border-ink bg-surface text-fg transition-colors hover:bg-p4 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpenFor(open ? null : pathname)}
          >
            {open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-nav" aria-label="Primary mobile" className="border-t border-line bg-bg lg:hidden">
          <ul className="container-page flex flex-col gap-1 py-4">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href, item.also);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpenFor(null)}
                    className={`${linkBase} flex min-h-11 items-center ${
                      active ? "border-ink bg-p3 text-fg" : "text-fg hover:bg-sunken"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-2">
              <ButtonLink href={mailto} className="w-full">
                Email me
              </ButtonLink>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
