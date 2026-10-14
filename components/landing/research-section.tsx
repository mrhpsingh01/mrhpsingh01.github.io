"use client";

import { ArrowDown } from "@phosphor-icons/react";
import { Container } from "@/components/container";
import { thesisData, paperData } from "@/config/research";
import { cn } from "@/lib/utils";

export function ResearchSection() {
  return (
    <section id="research" className="space-y-12 sm:space-y-16">
      <Container className="max-w-5xl xl:max-w-6xl px-4 sm:px-6 space-y-12 sm:space-y-16">
        {/* Main Section Header */}
        <div className="flex flex-col gap-2 border-b border-border/60 pb-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-secondary">
            <span>[ Research &amp; Publications ]</span>
          </div>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Research &amp; Publications
          </h2>
          <p className="mt-1 text-sm text-secondary sm:text-base max-w-2xl leading-relaxed">
            Applied machine learning research in ambient smart-home activity recognition, self-supervised representation learning, and multimodal fusion at the University of Georgia.
          </p>
        </div>

        {/* 1. Thesis Section */}
        <div className="space-y-5 sm:space-y-6">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
                [ Academic Research ]
              </p>
              <h3 className="mt-1 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Thesis
              </h3>
            </div>
          </div>

          {/* Thesis Hero Card */}
          <div
            className={cn(
              "group relative overflow-hidden rounded-2xl md:rounded-3xl",
              "border border-slate-200/90 dark:border-white/10",
              "bg-white dark:bg-card/95 backdrop-blur-md",
              "shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.02)]",
              "p-6 sm:p-8 lg:p-10",
              "animate-in-up-on-view"
            )}
          >
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-start">
              {/* Left: Thesis Abstract & Representation Breakdown */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-border/80 bg-muted/40 px-2.5 py-1 font-mono text-[11px] font-medium text-secondary">
                    M.S. Thesis &middot; {thesisData.school}, {thesisData.year}
                  </span>
                  <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Complete &amp; Defended
                  </span>
                </div>

                <div>
                  <h4 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    {thesisData.shortTitle}
                  </h4>
                  <p className="mt-1.5 font-mono text-xs text-secondary/90 leading-relaxed">
                    {thesisData.title}
                  </p>
                </div>

                <p className="text-sm sm:text-base leading-relaxed text-secondary sm:leading-7">
                  {thesisData.lede}
                </p>

                {/* 4 Multimodal Views Grid */}
                <div className="space-y-2.5 pt-2">
                  <h5 className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
                    Four Synchronized Views of Sensor Streams
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {thesisData.views.map((view) => (
                      <div
                        key={view.name}
                        className="rounded-xl border border-slate-200/70 dark:border-white/10 bg-slate-50/60 dark:bg-zinc-800/40 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">{view.name}</span>
                          <span className="rounded bg-background/80 px-1.5 py-0.5 font-mono text-[10px] font-medium text-secondary border border-border/60">
                            {view.badge}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-secondary">
                          {view.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons & Thesis Metadata */}
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <a
                    href={thesisData.pdf.href}
                    download
                    className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-4 py-2 text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity shadow-xs"
                  >
                    <ArrowDown className="size-4" weight="bold" />
                    <span>{thesisData.pdf.label}</span>
                  </a>

                  <p className="font-mono text-xs text-secondary/80">
                    {thesisData.pdf.pages} pages &middot; {thesisData.pdf.size} &middot; Advisor: {thesisData.advisor}
                  </p>
                </div>
              </div>

              {/* Right: Key Facts & Results Table */}
              <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-slate-200/70 lg:dark:border-white/10 lg:pl-8">
                {/* Fact Metric Tiles */}
                <div className="grid grid-cols-2 gap-4">
                  {thesisData.facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-zinc-800/30 p-3.5"
                    >
                      <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                        {fact.value}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-foreground leading-tight">
                        {fact.label}
                      </p>
                      <p className="mt-0.5 text-[10px] text-secondary leading-tight">
                        {fact.note}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Evaluation Results Card */}
                <div className="rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-zinc-800/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
                      Benchmark Comparison
                    </span>
                    <span className="font-mono text-[10px] text-secondary">Mean over 3 seeds</span>
                  </div>

                  <div className="divide-y divide-slate-200/60 dark:divide-white/10 text-xs">
                    {thesisData.results.map((r) => (
                      <div key={r.house} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-foreground">{r.house} House</p>
                          <p className="text-[10px] text-secondary">{r.best}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-foreground">
                            {r.weightedF1} <span className="font-normal text-[10px] text-secondary">W-F1</span>
                          </p>
                          <p className="font-mono text-[10px] text-secondary/80">
                            vs {r.baseline}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Submitted Paper Section */}
        <div className="space-y-5 sm:space-y-6 pt-4 sm:pt-6">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
                [ Conference Proceedings ]
              </p>
              <h3 className="mt-1 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Submitted Paper
              </h3>
            </div>
          </div>

          {/* Conference Paper Card: FACET */}
          <div
            className={cn(
              "group relative overflow-hidden rounded-2xl md:rounded-3xl",
              "border border-slate-200/90 dark:border-white/10",
              "bg-white dark:bg-card/95 backdrop-blur-md",
              "shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.02)]",
              "p-6 sm:p-7 md:p-8",
              "animate-in-up-on-view"
            )}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2.5 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                    {paperData.status}
                  </span>
                  <span className="rounded-md border border-border/80 bg-muted/40 px-2.5 py-0.5 font-mono text-[11px] font-medium text-secondary">
                    Under Review &middot; IEEE PerCom 2027
                  </span>
                </div>

                <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {paperData.name}
                </h4>

                <p className="font-mono text-xs text-secondary/90 leading-relaxed">
                  {paperData.title}
                </p>

                <p className="text-sm sm:text-base leading-relaxed text-secondary pt-1">
                  {paperData.lede}
                </p>

                <p className="text-xs font-medium text-secondary/80 pt-1">
                  {paperData.credit} Submitted to IEEE PerCom 2027 (IEEE International Conference on Pervasive Computing and Communications).
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
