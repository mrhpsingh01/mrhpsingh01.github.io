import { profile } from "./profile";

export const siteConfig = {
  title: `${profile.name} | Software engineer`,
  titleTemplate: `%s | ${profile.name}`,
  description:
    "Portfolio of Harmanpreet Singh: production full-stack development, applied machine learning research on smart-home sensor data, and backend systems work.",
} as const;

export interface NavItem {
  label: string;
  href: string;
  /** Other routes that belong under this item, so it stays highlighted on them. */
  also?: string[];
}

export const navItems: NavItem[] = [
  { label: "Work", href: "/projects" },
  { label: "Coursework", href: "/coursework" },
  { label: "Research", href: "/research", also: ["/thesis", "/paper"] },
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
  { label: "Lab", href: "/lab/sensor-playback" },
];

export const staticRoutes = ["/", "/projects", "/coursework", "/research", "/about", "/resume"] as const;
