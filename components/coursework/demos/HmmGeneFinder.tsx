"use client";

import { useMemo, useState } from "react";
import { Dices } from "lucide-react";
import {
  accuracy,
  cleanDna,
  generateSequence,
  geneRegions,
  mulberry32,
  viterbi,
} from "@/lib/coursework/hmm";
import { Btn, Panel, RangeField, Stat, TextAreaField, TextField, Toggle } from "../ui";

const LINE = 40;

function Strip({ labels, other, tone }: { labels: string; other?: string; tone: "truth" | "predicted" }) {
  return (
    <div className="flex">
      {[...labels].map((label, i) => {
        const gene = label === "g";
        const wrong = other !== undefined && other[i] !== label;
        return (
          <span
            key={i}
            className={`h-3.5 w-4 shrink-0 border-r border-bg ${gene ? "bg-accent" : "bg-line"} ${
              wrong && tone === "predicted" ? "outline outline-2 -outline-offset-2 outline-fg" : ""
            }`}
          />
        );
      })}
    </div>
  );
}

export default function HmmGeneFinder() {
  const [alpha, setAlpha] = useState(0.4);
  const [stay, setStay] = useState(0.95);
  const [length, setLength] = useState(100);
  const [geneCount, setGeneCount] = useState(2);
  const [geneLength, setGeneLength] = useState(10);
  const [seed, setSeed] = useState(42);
  const [own, setOwn] = useState(false);
  const [ownText, setOwnText] = useState("CTCTCTCTCTCTAGAGAGAGAGAGAGGAGACTCTCTCTCTCTTC");
  const [step, setStep] = useState(0);

  const generated = useMemo(
    () => generateSequence(mulberry32(seed), length, geneCount, geneLength, alpha),
    [seed, length, geneCount, geneLength, alpha],
  );
  const sequence = own ? cleanDna(ownText) : generated.sequence;
  const truth = own ? undefined : generated.labels;
  const result = useMemo(() => viterbi(sequence, { alpha, stay }), [sequence, alpha, stay]);

  const n = sequence.length;
  const t = Math.min(step, Math.max(0, n - 1));
  const acc = truth ? accuracy(truth, result.labels) : undefined;
  const regions = geneRegions(result.labels);
  const trueRegions = truth ? geneRegions(truth) : [];

  const lines: number[] = [];
  for (let i = 0; i < n; i += LINE) lines.push(i);

  // Trellis: colour by which state is ahead at each position.
  const deltas = result.table[1].map((g, i) => g - result.table[0][i]);
  const maxDelta = Math.max(1e-9, ...deltas.map(Math.abs));
  const cell = 10;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <RangeField
          label="Alpha (A and G inside a gene)"
          value={alpha}
          min={0.26}
          max={0.49}
          step={0.01}
          onChange={setAlpha}
          format={(v) => `${v.toFixed(2)}, beta ${(0.5 - v).toFixed(2)}`}
          hint="Beta is 0.5 minus alpha, so 2(alpha + beta) = 1. At 0.25 genes look like background."
        />
        <RangeField
          label="Chance of switching state"
          value={Math.round((1 - stay) * 100)}
          min={1}
          max={20}
          onChange={(v) => setStay(1 - v / 100)}
          format={(v) => `${v}%`}
        />
        <div className="grid grid-cols-[1fr_auto] items-end gap-3">
          <TextField
            label="Seed"
            value={String(seed)}
            onChange={(v) => setSeed(Number(v.replace(/\D/g, "")) || 0)}
            className="min-w-0"
          />
          <Btn onClick={() => setSeed((value) => (value * 1103515245 + 12345) % 100000)} title="New random sequence">
            <Dices aria-hidden="true" size={16} />
            New
          </Btn>
        </div>
        <RangeField label="Sequence length" value={length} min={40} max={160} step={10} onChange={setLength} />
        <RangeField label="Planted genes" value={geneCount} min={1} max={4} onChange={setGeneCount} />
        <RangeField label="Gene length" value={geneLength} min={6} max={20} onChange={setGeneLength} />
      </div>

      <div>
        <Toggle label="Decode my own sequence instead" checked={own} onChange={setOwn} />
        {own ? (
          <TextAreaField label="DNA (A, C, G, T only)" value={ownText} onChange={setOwnText} rows={3} className="mt-2" />
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat
          label="Accuracy against planted genes"
          value={acc === undefined ? "n/a" : `${(acc * 100).toFixed(0)}%`}
          note={acc === undefined ? "No planted truth for your own sequence" : `${n} bases`}
        />
        <Stat label="Log-probability of best path" value={result.logProbability.toFixed(1)} />
        <Stat
          label="Gene regions found"
          value={regions.length}
          note={regions.length ? regions.map(([a, b]) => `${a}-${b}`).join(", ") : "none"}
        />
      </div>

      <Panel title="Sequence, planted truth and decoded labels">
        <div
          role="group"
          aria-label={`Decoded gene regions: ${regions.length ? regions.map(([a, b]) => `${a} to ${b}`).join(", ") : "none"}. ${
            truth ? `Planted gene regions: ${trueRegions.map(([a, b]) => `${a} to ${b}`).join(", ")}.` : ""
          }`}
          className="space-y-3 overflow-x-auto"
        >
          {lines.map((start) => {
            const slice = sequence.slice(start, start + LINE);
            return (
              <div key={start} className="flex gap-3">
                <span className="w-9 shrink-0 pt-0.5 text-right font-mono text-[0.6875rem] text-black font-semibold">{start + 1}</span>
                <div>
                  <div className="flex font-mono text-[0.75rem] leading-4">
                    {[...slice].map((base, i) => (
                      <span key={i} className="w-4 shrink-0 text-center">
                        {base}
                      </span>
                    ))}
                  </div>
                  {truth ? <Strip labels={truth.slice(start, start + LINE)} tone="truth" /> : null}
                  <Strip
                    labels={result.labels.slice(start, start + LINE)}
                    other={truth?.slice(start, start + LINE)}
                    tone="predicted"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[0.8125rem] text-black font-medium">
          <li>
            <span className="mr-1.5 inline-block size-2.5 bg-accent align-middle" />
            gene
          </li>
          <li>
            <span className="mr-1.5 inline-block size-2.5 bg-line align-middle" />
            background
          </li>
          {truth ? <li>Top strip: planted truth. Bottom strip: decoded. Outlined cells disagree.</li> : <li>Strip: decoded.</li>}
        </ul>
      </Panel>

      <Panel title="Viterbi table: which state is ahead at each position">
        {n > 0 ? (
          <>
            <div className="overflow-x-auto">
              <svg
                viewBox={`0 0 ${n * cell} 62`}
                style={{ minWidth: Math.min(n * cell, 900) }}
                role="img"
                aria-label="Heat map of the Viterbi table. The top row is the gene state and the bottom row is the background state. Darker cells mark the state with the better score. A line follows the winning path."
                className="h-auto w-full"
              >
                {deltas.map((delta, i) => {
                  const geneAhead = delta >= 0;
                  const strength = 0.15 + 0.85 * (Math.abs(delta) / maxDelta);
                  return (
                    <g key={i}>
                      <rect x={i * cell} y={4} width={cell - 1} height={24} className="fill-accent" opacity={geneAhead ? strength : 0.07} />
                      <rect x={i * cell} y={32} width={cell - 1} height={24} className="fill-fg" opacity={geneAhead ? 0.07 : strength * 0.7} />
                    </g>
                  );
                })}
                <polyline
                  points={result.path.map((s, i) => `${i * cell + cell / 2},${s === 1 ? 16 : 44}`).join(" ")}
                  fill="none"
                  className="stroke-accent-strong"
                  strokeWidth={2}
                  strokeLinejoin="round"
                />
                <rect x={t * cell - 1} y={0} width={cell + 1} height={62} fill="none" className="stroke-fg" strokeWidth={1.5} />
              </svg>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
              <RangeField
                label="Step through the decoding"
                value={t}
                min={0}
                max={Math.max(0, n - 1)}
                onChange={setStep}
                format={(v) => `position ${v + 1} of ${n}`}
              />
              <div className="font-mono text-[0.75rem] text-black font-medium">
                <p>
                  base {sequence[t]}: V(gene) {result.table[1][t].toFixed(1)}, V(background) {result.table[0][t].toFixed(1)}
                </p>
                <p>
                  best path into {result.path[t] === 1 ? "gene" : "background"} here came from{" "}
                  {t === 0 ? "the 50/50 prior" : result.back[result.path[t]][t] === 1 ? "gene" : "background"}
                </p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-black font-medium">Enter at least one base.</p>
        )}
      </Panel>
    </div>
  );
}
