/**
 * Coursework content model. A subject groups several small projects; each project has a
 * write-up and one working browser demo identified by a DemoId (see components/coursework/demos).
 */

export type DemoId =
  | "hmm-gene-finder"
  | "rna-folding"
  | "dns-forwarder"
  | "https-downloader"
  | "latency-stats"
  | "ftp-session"
  | "ftp-concurrent"
  | "multicast"
  | "kv-ring"
  | "property-management"
  | "sql-lab";

export interface CourseProject {
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  /** "Individual", "Pair project with ...", "Team of three" and so on, as the repository history supports. */
  teamNote: string;
  /** What I personally did. */
  contribution: string;
  /** Only where the repository history gives dates. */
  period?: string;
  /** What the original coursework program does, taken from its code. */
  original: string[];
  howItWorks: string[];
  /** What was added or changed to make the showcase demo. */
  touches: string[];
  /** Honest notes: what is simulated, what I found when revisiting the code. */
  notes: string[];
  demo: {
    id: DemoId;
    heading: string;
    /** One sentence on what to try. */
    tryThis: string;
    /** What the demo does and does not do. */
    honesty: string;
  };
  /** Link to an existing case study on this site, when there is one. */
  relatedProject?: { slug: string; label: string };
}

export interface Subject {
  slug: string;
  name: string;
  blurb: string;
  /** Short line on what the subject covered, from the projects, not from a syllabus. */
  focus: string;
  projects: CourseProject[];
}
