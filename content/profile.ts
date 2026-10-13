/**
 * Central profile data. Edit here to change the name, positioning, contact
 * details and public links used across the site.
 */
export const profile = {
  name: "Harmanpreet Singh",
  shortName: "Harmanpreet",
  role: "Software engineer",
  location: "Athens, Georgia",

  headline: "I build full-stack software, applied ML pipelines, and backend systems.",
  intro:
    "Production full-stack development, applied machine learning research on smart-home sensor data, and backend systems work.",

  email: "harmansinghuga@gmail.com",
  links: {
    github: "https://github.com/mrhpsingh01",
    linkedin: "https://www.linkedin.com/in/harmanuga/",
  },
} as const;

export const mailto = `mailto:${profile.email}`;
