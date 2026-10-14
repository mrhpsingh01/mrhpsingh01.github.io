export const headerNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
] as const;

export const moreNav = [
  { label: "Work", href: "/work" },
  { label: "Resume", href: "/resume" },
  { label: "Certifications", href: "/achievements" },
  { label: "Books", href: "/books" },
  { label: "Favourites", href: "/favourites" },
  { label: "Blog", href: "/blog" },
] as const;

export const footerNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Work", href: "/work" },
  { label: "Resume", href: "/resume" },
  { label: "Certifications", href: "/achievements" },
  { label: "Books", href: "/books" },
  { label: "Favourites", href: "/favourites" },
  { label: "Blog", href: "/blog" },
] as const;

export const commandItems = [
  ...footerNav.map((item) => ({ label: item.label, href: item.href })),
  { label: "GitHub", href: "https://github.com/mrhpsingh01", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/harmanuga/", external: true },
  { label: "Email", href: "mailto:harmansinghuga@gmail.com", external: true },
];
