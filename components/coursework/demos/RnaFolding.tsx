"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { mulberry32 } from "@/lib/coursework/hmm";
import { cleanRna, findOriginalMismatch, fold, type TracebackMode } from "@/lib/coursework/rna";
import { Btn, Panel, RangeField, Segmented, Stat, TextField } from "../ui";

const PRESETS = [
  { label: "My original example", value: "AAACCCCUUU" },
  { label: "Hairpin", value: "GGGGAAAACCCC" },
  { label: "Cloverleaf-like", value: "GCGGAUUUAGCUCAGUUGGGAGAGC" },
  { label: "AU rich", value: "AUAUAUGCGCAUAUAUA" },
];

const MAX_LENGTH = 40;

export default function RnaFolding() {
  const [raw, setRaw] = useState("AAACCCCUUU");
  const [minDistance, setMinDistance] = useState(4);
  const [mode, setMode] = useState<TracebackMode>("fixed");
  const [step, setStep] = useState<number | null>(null);
  const [searchSeed, setSearchSeed] = useState(1);
  const [message, setMessage] = useState("");

  const sequence = cleanRna(raw).slice(0, MAX_LENGTH);
  const result = useMemo(() => fold(sequence, minDistance, mode), [sequence, minDistance, mode]);
  const n = sequence.length;
  const total = result.order.length;
  const shown = step === null ? total : Math.min(step, total);
  const filled = useMemo(() => {
    const set = new Set<string>();
    for (let k = 0; k < shown; k += 1) set.add(`${result.order[k][0]},${result.order[k][1]}`);
    return set;
  }, [result, shown]);
  const maxValue = Math.max(1, ...result.dp.flat());
  const consistent = result.structureScore === result.tableScore;

  const cellSize = 26;
  const spacing = 22;
  const arcHeight = (dx: number) => Math.min(dx * 0.55, 170);
  const width = Math.max(1, n) * spacing + 20;
  const maxArc = result.pairs.reduce((m, [i, j]) => Math.max(m, arcHeight((j - i) * spacing)), 0);

  function findFailure() {
    const found = findOriginalMismatch(mulberry32(searchSeed), minDistance);
    setSearchSeed((s) => s + 1);
    if (found) {
      setRaw(found);
      setMode("original");
      setStep(null);
      setMessage("Found one. The original traceback's structure does not add up to the table's score.");
    } else {
      setMessage("No mismatch found in this search. Try again or change the minimum distance.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.4fr_1fr]">
        <div>
          <TextField
            label={`RNA sequence (A, C, G, U; up to ${MAX_LENGTH})`}
            value={raw}
            onChange={(value) => {
              setRaw(value);
              setStep(null);
              setMessage("");
            }}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <Btn
                key={preset.label}
                onClick={() => {
                  setRaw(preset.value);
                  setStep(null);
                  setMessage("");
                }}
                className="min-h-8 px-2.5 text-[0.8125rem]"
              >
                {preset.label}
              </Btn>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <RangeField
            label="Minimum distance between paired bases"
            value={minDistance}
            min={0}
            max={6}
            onChange={setMinDistance}
            hint="My original used 4, so a pair needs at least 3 bases between its ends."
          />
          <Segmented
            label="Traceback"
            value={mode}
            onChange={(value) => {
              setMode(value);
              setMessage("");
            }}
            options={[
              { value: "fixed", label: "Corrected" },
              { value: "original", label: "My original" },
            ]}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Btn onClick={findFailure}>
          <Search aria-hidden="true" size={16} />
          Find a sequence where the original traceback fails
        </Btn>
        <p role="status" className="text-[0.875rem] text-black font-semibold">
          {message}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Best score (table)" value={result.tableScore} />
        <Stat label="Score of traced structure" value={result.structureScore} />
        <Stat
          label="Check"
          value={consistent ? "match" : "mismatch"}
          note={consistent ? "The structure explains the table's score" : "The traceback chose pairs the table did not"}
        />
      </div>

      <Panel title="Predicted structure">
        {n > 0 ? (
          <>
            <div className="overflow-x-auto">
              <svg
                viewBox={`0 0 ${width} ${maxArc + 56}`}
                style={{ minWidth: Math.min(width, 640), maxWidth: Math.max(width * 1.7, 420) }}
                role="img"
                aria-label={`Arc diagram of the predicted structure ${result.structure} with ${result.pairs.length} base pairs`}
                className="h-auto w-full"
              >
                {result.pairs.map(([i, j]) => {
                  const x1 = 10 + i * spacing + spacing / 2;
                  const x2 = 10 + j * spacing + spacing / 2;
                  const h = arcHeight(x2 - x1);
                  const y = maxArc + 12;
                  return (
                    <path
                      key={`${i}-${j}`}
                      d={`M ${x1} ${y} C ${x1} ${y - h * 1.3}, ${x2} ${y - h * 1.3}, ${x2} ${y}`}
                      fill="none"
                      className="stroke-accent"
                      strokeWidth={2}
                    />
                  );
                })}
                {[...sequence].map((base, i) => (
                  <text
                    key={i}
                    x={10 + i * spacing + spacing / 2}
                    y={maxArc + 32}
                    textAnchor="middle"
                    fontSize={14}
                    className="fill-fg font-mono font-bold"
                  >
                    {base}
                  </text>
                ))}
                {[...result.structure].map((symbol, i) => (
                  <text
                    key={i}
                    x={10 + i * spacing + spacing / 2}
                    y={maxArc + 50}
                    textAnchor="middle"
                    fontSize={13}
                    className="fill-black font-mono font-semibold"
                  >
                    {symbol}
                  </text>
                ))}
              </svg>
            </div>
            <p className="mt-3 font-mono text-[0.8125rem] text-black font-bold">
              {sequence}
              <br />
              {result.structure}
            </p>
          </>
        ) : (
          <p className="text-black font-medium">Enter an RNA sequence.</p>
        )}
      </Panel>

      <Panel title="Dynamic-programming table">
        <p className="mb-3 text-[0.8125rem] text-black font-medium">
          Cell (i, j) holds the best score for bases i to j. Cells are filled by substring length, so each one only
          needs cells that are already known.
        </p>
        {n > 1 ? (
          <>
            <div className="overflow-x-auto">
              <div
                role="img"
                aria-label={`Table of best scores for each substring. The final answer in the top-right cell is ${result.tableScore}.`}
                className="inline-grid gap-px"
                style={{ gridTemplateColumns: `1.5rem repeat(${n}, ${cellSize}px)` }}
              >
                <span />
                {[...sequence].map((base, j) => (
                  <span key={`h${j}`} className="text-center font-mono text-[0.6875rem] text-black font-bold">
                    {base}
                  </span>
                ))}
                {[...sequence].map((base, i) => (
                  <RowCells
                    key={i}
                    i={i}
                    base={base}
                    n={n}
                    dp={result.dp}
                    filled={filled}
                    maxValue={maxValue}
                    last={i === 0}
                    size={cellSize}
                  />
                ))}
              </div>
            </div>
            <div className="mt-4">
              <RangeField
                label="Fill the table step by step"
                value={shown}
                min={0}
                max={total}
                onChange={setStep}
                format={(v) => `${v} of ${total} cells`}
              />
            </div>
          </>
        ) : (
          <p className="text-black font-medium">Enter at least two bases.</p>
        )}
      </Panel>
    </div>
  );
}

function RowCells({
  i,
  base,
  n,
  dp,
  filled,
  maxValue,
  last,
  size,
}: {
  i: number;
  base: string;
  n: number;
  dp: number[][];
  filled: Set<string>;
  maxValue: number;
  last: boolean;
  size: number;
}) {
  return (
    <>
      <span className="pr-1 text-right font-mono text-[0.6875rem] leading-[26px] text-black font-bold">{base}</span>
      {Array.from({ length: n }, (_, j) => {
        const upper = j >= i;
        const known = upper && (j === i || filled.has(`${i},${j}`));
        const value = known ? dp[i][j] : 0;
        const answer = last && j === n - 1;
        return (
          <span
            key={j}
            style={{ height: size, backgroundColor: known && value > 0 ? `color-mix(in srgb, var(--accent) ${Math.round(12 + 78 * (value / maxValue))}%, transparent)` : undefined }}
            className={`grid place-items-center font-mono text-[0.6875rem] ${
              upper ? "bg-surface" : "bg-transparent"
            } ${answer ? "outline outline-2 -outline-offset-2 outline-fg" : ""} ${known && value > 0 ? "text-black font-bold" : "text-black/60 font-medium"}`}
          >
            {upper && known ? value : ""}
          </span>
        );
      })}
    </>
  );
}
