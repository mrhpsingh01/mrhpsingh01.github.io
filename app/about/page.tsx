"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  CheckCircle,
  Compass,
  Envelope,
  FileText,
  GithubLogo,
  GraduationCap,
  HardDrives,
  LinkedinLogo,
  Sparkle,
} from "@phosphor-icons/react";
import { Container } from "@/components/container";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { aboutConfig } from "@/config/about";
import { education } from "@/config/education";
import { experience } from "@/config/experience";
import { writing } from "@/config/research";
import { mailto, profile } from "@/content/profile";
import { cn } from "@/lib/utils";

const workingStyle = [
  {
    title: "Evaluation is part of design.",
    body: "Every model and system is measured against standardized stratified splits, real-world workloads, and multiple random seeds rather than convenient headline numbers.",
    icon: CheckCircle,
  },
  {
    title: "Inspect the raw data.",
    body: "Before trusting an aggregate score, I build playback tools and visualizers to inspect raw event streams, coordinate rasters, and boundary cases directly.",
    icon: Compass,
  },
  {
    title: "Measure before optimizing.",
    body: "Profile real production workloads and query plans before making architectural bets — like dropping MongoDB aggregation latency from 750 ms to 350 ms.",
    icon: HardDrives,
  },
  {
    title: "Write clear contracts.",
    body: "Self-documenting APIs, strict TypeScript schemas, and thorough documentation ensure frontend, backend, and mobile developers can ship fast in parallel.",
    icon: FileText,
  },
  {
    title: "End-to-end ownership.",
    body: "From Kafka streaming pipelines and database schemas to reactive interfaces, digital twins, and Kubernetes Helm deployments, I own the entire lifecycle.",
    icon: Briefcase,
  },
  {
    title: "Build with observability.",
    body: "Instrument systems with structured logging, health checks, anomaly review queues, and latency metrics from commit zero.",
    icon: Sparkle,
  },
];

const impactStats = [
  { value: "500K+", label: "Production Users", sub: "across 4 live applications" },
  { value: "14", label: "SOTA Baselines", sub: "outperformed across smart homes" },
  { value: "10K+", label: "SystemForge Learners", sub: "learning distributed architectures" },
  { value: "16", label: "Verified Credentials", sub: "in Cloud, K8s & Generative AI" },
];

export default function AboutPage() {
  return (
    <div className="pb-24 pt-4 sm:pb-28 sm:pt-8">
      <Container className="max-w-5xl xl:max-w-6xl px-4 sm:px-6 space-y-12 sm:space-y-16">
        {/* Header Hero Card */}
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl md:rounded-3xl",
            "border border-slate-200/90 dark:border-white/10",
            "bg-white dark:bg-card/95 backdrop-blur-md",
            "shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.02)]",
            "p-6 sm:p-10",
          )}
        >
          <div className="flex flex-col-reverse md:flex-row md:items-start justify-between gap-6 sm:gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-secondary">
                <span>[ About Me ]</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Harmanpreet Singh
              </h1>
              <p className="text-base sm:text-lg text-secondary leading-relaxed">
                Full-stack software engineer and applied ML researcher bridging high-scale distributed systems, real-time web architectures, and ambient sensor intelligence.
              </p>

              {/* Trait badges */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {aboutConfig.traits.map((trait) => (
                  <span
                    key={trait}
                    className={cn(
                      "rounded-full border px-3 py-1 font-mono text-xs font-medium",
                      aboutConfig.traitStyles[trait],
                    )}
                  >
                    {trait}
                  </span>
                ))}
                <span className="rounded-full border border-border/80 bg-muted/40 px-3 py-1 font-mono text-xs font-medium text-secondary">
                  📍 {profile.location}
                </span>
              </div>
            </div>

            <div className="flex justify-start md:justify-end shrink-0">
              <div className="relative size-24 sm:size-28 md:size-32 rounded-full p-[3.5px] bg-gradient-to-br from-red-400 to-red-600 shadow-[0_8px_24px_rgba(220,38,38,0.2)]">
                <div className="relative size-full rounded-full overflow-hidden bg-white flex items-end justify-center">
                  <Image
                    src="/assets/mascot-center.png"
                    alt="Harmanpreet Singh Mascot"
                    width={140}
                    height={140}
                    className="size-[88%] object-contain object-bottom select-none pointer-events-none"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Impact Stats Strip */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-border/60 pt-6">
            {impactStats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {stat.value}
                </span>
                <span className="text-xs font-semibold text-foreground/90 mt-0.5">
                  {stat.label}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {stat.sub}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 1: How I got here (Narrative) */}
        <section aria-labelledby="path-heading" className="space-y-6">
          <div className="flex flex-col gap-1 border-b border-border/60 pb-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
              [ Background &amp; Story ]
            </p>
            <h2 id="path-heading" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              How I got here
            </h2>
          </div>

          <LiquidGlassCard
            className="p-6 sm:p-8"
            borderRadius="1.5rem"
          >
            <div className="prose-block space-y-4 text-base sm:text-[1.0625rem] leading-relaxed text-secondary/90">
              <p>
                I am a software engineer and researcher focused on the intersection of <strong className="text-foreground font-semibold">full-stack systems</strong>, <strong className="text-foreground font-semibold">distributed architectures</strong>, and <strong className="text-foreground font-semibold">applied machine learning</strong>. I believe the best software balances rigorous evaluation, clear abstractions, and end-to-end craftsmanship — whether that means shaving 400 milliseconds off a high-volume database query or training specialized AI models that run with zero inference bloat.
              </p>
              <p>
                My foundation started in Computer Engineering at Savitribai Phule Pune University, diving deep into operating systems, compilers, networks, and algorithms. My undergraduate thesis was a resume ranking engine powered by NLP and ML; I led the team, built the full-stack architecture, and published our findings in <span className="text-foreground font-medium">IJSREM</span>.
              </p>
              <p>
                In industry, I engineered systems for high-stakes, production environments. At <strong className="text-foreground font-semibold">Lykan Technologies</strong>, I optimized asynchronous FastAPI backends, designed background workers handling 10,000+ records daily, and tuned Kubernetes deployments on AWS — reducing endpoint response times by 35% and infrastructure costs by 15%. At <strong className="text-foreground font-semibold">Stylabs AI Native Studio</strong>, I built applications serving over 500,000 users across commercial marketplaces like Manzil and Hireavilla, architected real-time WebSocket chat engines across multiple stakeholder roles, and built 40+ MongoDB aggregation pipelines that cut query latency by 53%.
              </p>
              <p>
                To deepen my theoretical and systems work, I joined the <strong className="text-foreground font-semibold">University of Georgia</strong> for my Master of Science in Computer Science, advised by Dr. Fei Dou. My research tackles ambient sensor intelligence and multimodal self-supervised learning on CASAS smart homes — recognizing daily human activities without invasive cameras or microphones. By factorizing sparse sensor windows into sequence, narrative text, floorplan raster, and graph views with local competence-weighted fusion, our work achieved the highest accuracy across all 5 testbed homes and beat the strongest multimodal baselines at one-sixth of the computational cost (submitted to <span className="text-foreground font-medium">IEEE PerCom 2027</span>).
              </p>
              <p>
                I don&apos;t leave research in Jupyter notebooks. To bring my thesis model into the real world, I engineered <strong className="text-foreground font-semibold">HomeSense</strong> — an end-to-end digital-twin platform streaming live sensor telemetry through Apache Kafka, orchestrating automated anomaly detection with human review, embedding a LangGraph assistant, and deploying everything onto Kubernetes with Helm. Alongside that, I build developer-first educational tools like <strong className="text-foreground font-semibold">SystemForge</strong> (a distributed systems simulation lab used by 10,000+ engineers) and <strong className="text-foreground font-semibold">MLForge</strong> (an in-browser ML laboratory implementing neural networks from scratch in TypeScript).
              </p>
            </div>

            {/* Case Study Quick Links */}
            <div className="mt-8 flex flex-wrap gap-3 border-t border-border/60 pt-6">
              <Link
                href="/projects/homesense-platform"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/30 px-3.5 py-2 font-mono text-xs font-medium text-foreground transition-all hover:bg-muted/70 hover:border-accent"
              >
                <span>Read HomeSense Case Study</span>
                <ArrowUpRight size={14} className="text-accent" />
              </Link>
              <Link
                href="/projects/smart-home-activity-recognition"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/30 px-3.5 py-2 font-mono text-xs font-medium text-foreground transition-all hover:bg-muted/70 hover:border-accent"
              >
                <span>Read Thesis Research Case Study</span>
                <ArrowUpRight size={14} className="text-accent" />
              </Link>
              <Link
                href="/projects/systemforge"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/30 px-3.5 py-2 font-mono text-xs font-medium text-foreground transition-all hover:bg-muted/70 hover:border-accent"
              >
                <span>Explore SystemForge</span>
                <ArrowUpRight size={14} className="text-accent" />
              </Link>
              <Link
                href="/projects/profound-properties"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/30 px-3.5 py-2 font-mono text-xs font-medium text-foreground transition-all hover:bg-muted/70 hover:border-accent"
              >
                <span>Read Profound Properties Case Study</span>
                <ArrowUpRight size={14} className="text-accent" />
              </Link>
            </div>
          </LiquidGlassCard>
        </section>

        {/* Section 2: How I work (Principles) */}
        <section aria-labelledby="style-heading" className="space-y-6">
          <div className="flex flex-col gap-1 border-b border-border/60 pb-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
              [ Philosophy &amp; Standards ]
            </p>
            <h2 id="style-heading" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              How I work
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workingStyle.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={cn(
                    "group relative flex flex-col justify-between overflow-hidden rounded-2xl",
                    "border border-slate-200/90 dark:border-white/10",
                    "bg-white dark:bg-card/95 backdrop-blur-md",
                    "p-6 transition-all duration-200 hover:shadow-md hover:border-accent/40",
                  )}
                >
                  <div className="space-y-3">
                    <div className="inline-flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <Icon size={20} weight="duotone" />
                    </div>
                    <h3 className="font-serif text-lg font-bold tracking-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-secondary">
                      {item.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Research and Writing */}
        <section aria-labelledby="writing-heading" className="space-y-6">
          <div className="flex flex-col gap-1 border-b border-border/60 pb-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
              [ Publications &amp; Surveys ]
            </p>
            <h2 id="writing-heading" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Research &amp; writing
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {writing.map((entry) => (
              <div
                key={entry.title}
                className={cn(
                  "relative flex flex-col justify-between rounded-2xl",
                  "border border-slate-200/90 dark:border-white/10",
                  "bg-white dark:bg-card/95 backdrop-blur-md",
                  "p-6 transition-all duration-200 hover:shadow-md hover:border-accent/40",
                )}
              >
                <div className="space-y-2.5">
                  <span className="inline-block rounded-md border border-border/80 bg-muted/40 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-secondary">
                    {entry.kind}
                  </span>
                  <h3 className="font-serif text-lg font-bold leading-snug tracking-tight text-foreground">
                    {entry.href ? (
                      <Link href={entry.href} className="hover:text-accent inline-flex items-center gap-1.5">
                        <span>{entry.title}</span>
                        <ArrowUpRight size={15} className="shrink-0 text-accent" />
                      </Link>
                    ) : (
                      entry.title
                    )}
                  </h3>
                  <p className="font-mono text-xs text-secondary/90">{entry.venue}</p>
                  <p className="text-sm text-secondary leading-relaxed pt-1">{entry.note}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border/80 bg-muted/30 p-4 text-sm text-secondary leading-relaxed flex items-start gap-3">
            <BookOpen size={20} className="shrink-0 text-accent mt-0.5" />
            <p>
              I also volunteered at the University of Georgia School of Computing 2025 Research Day, where I compiled the
              book of abstracts for the research seminars and academic posters on display.
            </p>
          </div>
        </section>

        {/* Section 4: Elsewhere & Contact */}
        <section aria-labelledby="links-heading" className="space-y-6">
          <div className="flex flex-col gap-1 border-b border-border/60 pb-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
              [ Get in Touch ]
            </p>
            <h2 id="links-heading" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Elsewhere
            </h2>
          </div>

          <LiquidGlassCard className="p-6 sm:p-8" borderRadius="1.5rem">
            <p className="text-base text-secondary leading-relaxed">
              Based in <span className="font-semibold text-foreground">{profile.location}</span>. Open to conversations about software engineering, distributed systems, and applied machine learning roles.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={mailto}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-strong"
              >
                <Envelope size={18} weight="bold" />
                <span>Email me</span>
              </a>

              <Link
                href="/resume"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-muted/50 hover:border-accent"
              >
                <FileText size={18} />
                <span>View resume</span>
              </Link>

              <a
                href={profile.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-muted/50 hover:border-accent"
              >
                <GithubLogo size={18} />
                <span>GitHub</span>
              </a>

              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-muted/50 hover:border-accent"
              >
                <LinkedinLogo size={18} />
                <span>LinkedIn</span>
              </a>
            </div>
          </LiquidGlassCard>
        </section>
      </Container>
    </div>
  );
}
