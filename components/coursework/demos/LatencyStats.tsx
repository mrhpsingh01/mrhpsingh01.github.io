"use client";

import { useMemo, useState } from "react";
import { savedTraces } from "@/lib/coursework/latencySamples";
import {
  boxStats,
  hopStats,
  insights,
  parsePing,
  parseTraceroute,
  pingSummary,
  syntheticPing,
} from "@/lib/coursework/latency";
import { Btn, Panel, Pre, Segmented, Stat, TextAreaField, Toggle } from "../ui";

interface Series {
  label: string;
  values: number[];
}

function BoxPlot({ series, xLabel, title }: { series: Series[]; xLabel: string; title: string }) {
  const slot = 52;
  const left = 54;
  const top = 14;
  const plotHeight = 230;
  const width = left + series.length * slot + 12;
  const all = series.flatMap((s) => s.values);
  const maxValue = Math.max(10, ...all) * 1.08;
  const y = (v: number) => top + plotHeight - (v / maxValue) * plotHeight;
  const ticks = Array.from({ length: 5 }, (_, i) => Math.round((maxValue / 4) * i));

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${top + plotHeight + 44}`}
        style={{ minWidth: Math.min(width, 560) }}
        role="img"
        aria-label={`${title}. ${series.map((s) => `${s.label}: median ${boxStats(s.values).median.toFixed(1)} milliseconds`).join("; ")}`}
        className="h-auto w-full"
      >
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={left} x2={width - 8} y1={y(tick)} y2={y(tick)} className="stroke-line" strokeWidth={1} />
            <text x={left - 8} y={y(tick) + 4} textAnchor="end" fontSize={11} className="fill-black font-mono font-semibold">
              {tick}
            </text>
          </g>
        ))}
        <text x={12} y={top + plotHeight / 2} fontSize={11} className="fill-black font-mono font-bold" transform={`rotate(-90 12 ${top + plotHeight / 2})`} textAnchor="middle">
          Latency (ms)
        </text>
        {series.map((s, i) => {
          const box = boxStats(s.values);
          const cx = left + i * slot + slot / 2;
          return (
            <g key={s.label}>
              <line x1={cx} x2={cx} y1={y(box.whiskerHigh)} y2={y(box.q3)} className="stroke-fg" strokeWidth={1.5} />
              <line x1={cx} x2={cx} y1={y(box.q1)} y2={y(box.whiskerLow)} className="stroke-fg" strokeWidth={1.5} />
              <line x1={cx - 8} x2={cx + 8} y1={y(box.whiskerHigh)} y2={y(box.whiskerHigh)} className="stroke-fg" strokeWidth={1.5} />
              <line x1={cx - 8} x2={cx + 8} y1={y(box.whiskerLow)} y2={y(box.whiskerLow)} className="stroke-fg" strokeWidth={1.5} />
              <rect
                x={cx - 14}
                y={y(box.q3)}
                width={28}
                height={Math.max(2, y(box.q1) - y(box.q3))}
                className="fill-tint stroke-accent"
                strokeWidth={1.5}
              />
              <line x1={cx - 14} x2={cx + 14} y1={y(box.median)} y2={y(box.median)} className="stroke-accent-strong" strokeWidth={2.5} />
              {box.outliers.map((v, k) => (
                <circle key={k} cx={cx} cy={y(v)} r={3} fill="none" className="stroke-fg" strokeWidth={1.5} />
              ))}
              <text x={cx} y={top + plotHeight + 18} textAnchor="middle" fontSize={12} className="fill-black font-mono font-bold">
                {s.label}
              </text>
            </g>
          );
        })}
        <text x={left + (series.length * slot) / 2} y={top + plotHeight + 38} textAnchor="middle" fontSize={11} className="fill-black font-mono font-bold">
          {xLabel}
        </text>
      </svg>
    </div>
  );
}

function fixed(v: number) {
  return v.toFixed(1);
}

function TraceView() {
  const [source, setSource] = useState<"saved" | "paste">("saved");
  const [included, setIncluded] = useState([true, true, true, true, true]);
  const [pasted, setPasted] = useState("");
  const [firstOnly, setFirstOnly] = useState(false);

  const parsed = useMemo(() => {
    const texts = source === "saved" ? savedTraces.filter((_, i) => included[i]) : [pasted];
    return texts.map((t) => parseTraceroute(t, firstOnly));
  }, [source, included, pasted, firstOnly]);
  const stats = useMemo(() => hopStats(parsed.flatMap((p) => p.readings)), [parsed]);
  const silent = parsed.flatMap((p) => p.silent);
  const notes = insights(stats, silent);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[auto_1fr]">
        <Segmented
          label="Input"
          value={source}
          onChange={setSource}
          options={[
            { value: "saved", label: "My 5 saved runs" },
            { value: "paste", label: "Paste traceroute output" },
          ]}
        />
        <Toggle
          label="Read only the first probe on each hop line"
          checked={firstOnly}
          onChange={setFirstOnly}
          hint="That is what my original regex did. Reading all three probes gives each hop more data."
        />
      </div>

      {source === "saved" ? (
        <fieldset>
          <legend className="text-[0.8125rem] font-medium">Runs to include</legend>
          <div className="mt-1 flex flex-wrap gap-4">
            {included.map((on, i) => (
              <Toggle
                key={i}
                label={`Run ${i + 1}`}
                checked={on}
                onChange={(checked) => setIncluded((list) => list.map((v, k) => (k === i ? checked : v)))}
              />
            ))}
          </div>
        </fieldset>
      ) : (
        <TextAreaField
          label="Paste the output of one or more traceroute runs (Linux or macOS format)"
          value={pasted}
          onChange={setPasted}
          rows={7}
          placeholder={" 1  router.lan (192.168.1.1)  4.1 ms  4.0 ms  3.9 ms\n 2  * * *\n 3  host.example (203.0.113.9)  18.2 ms  18.0 ms  19.4 ms"}
        />
      )}

      {stats.length === 0 ? (
        <p className="text-black font-medium">No hops found yet. Pick a run or paste traceroute output.</p>
      ) : (
        <>
          <Panel title="Latency per hop across the selected runs">
            <BoxPlot
              title="Box plot of latency per hop"
              xLabel="Hop"
              series={stats.map((s) => ({ label: String(s.hop), values: s.latency }))}
            />
            <p className="mt-2 text-[0.8125rem] text-black font-medium">
              Box: middle half of the readings. Line: median. Whiskers: furthest reading within 1.5 times the box height. Rings: outliers.
            </p>
          </Panel>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Panel title="What the data says">
              <ul className="space-y-2 text-[0.9375rem]">
                {notes.map((note) => (
                  <li key={note} className="pl-4 -indent-4 before:mr-2 before:content-['+'] before:text-accent">
                    {note}
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="Per-hop statistics (ms)">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[26rem] text-left font-mono text-[0.75rem]">
                  <caption className="sr-only">Per-hop latency statistics</caption>
                  <thead>
                    <tr className="text-black font-bold">
                      <th scope="col" className="py-1 pr-3 font-bold">hop</th>
                      <th scope="col" className="py-1 pr-3 font-bold">n</th>
                      <th scope="col" className="py-1 pr-3 font-bold">min</th>
                      <th scope="col" className="py-1 pr-3 font-bold">med</th>
                      <th scope="col" className="py-1 pr-3 font-bold">avg</th>
                      <th scope="col" className="py-1 pr-3 font-bold">max</th>
                      <th scope="col" className="py-1 font-bold">host</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map((s) => (
                      <tr key={s.hop} className="border-t border-line">
                        <th scope="row" className="py-1 pr-3 font-medium text-black">{s.hop}</th>
                        <td className="py-1 pr-3 text-black">{s.latency.length}</td>
                        <td className="py-1 pr-3 text-black">{fixed(s.min)}</td>
                        <td className="py-1 pr-3 text-black">{fixed(s.med)}</td>
                        <td className="py-1 pr-3 text-black">{fixed(s.avg)}</td>
                        <td className="py-1 pr-3 text-black">{fixed(s.max)}</td>
                        <td className="max-w-[16rem] truncate py-1 text-black" title={s.hosts[0]?.[0]}>{s.hosts[0]?.[0] ?? ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>

          <details className="rounded-lg border border-line bg-bg p-4">
            <summary className="cursor-pointer text-[0.875rem] font-bold text-black">The JSON my tool would write</summary>
            <Pre className="mt-3 max-h-80">{JSON.stringify(stats, null, 4)}</Pre>
          </details>
        </>
      )}
    </div>
  );
}

function PingView() {
  const [seed, setSeed] = useState(4);
  const [text, setText] = useState(() => syntheticPing(4));
  const latencies = useMemo(() => parsePing(text), [text]);
  const summary = latencies.length ? pingSummary(latencies) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <Btn
          onClick={() => {
            const next = seed + 1;
            setSeed(next);
            setText(syntheticPing(next));
          }}
        >
          Generate another synthetic run
        </Btn>
        <p className="text-[0.8125rem] text-black font-medium">The sample below is synthetic. Paste real ping output to replace it.</p>
      </div>
      <TextAreaField label="Ping output" value={text} onChange={setText} rows={8} />
      {summary ? (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <Stat label="avg" value={`${fixed(summary.avg)} ms`} />
            <Stat label="median" value={`${fixed(summary.med)} ms`} />
            <Stat label="min" value={`${fixed(summary.min)} ms`} />
            <Stat label="max" value={`${fixed(summary.max)} ms`} />
          </div>
          <Panel title="Latency distribution">
            <BoxPlot title="Box plot of ping latency" xLabel="Ping" series={[{ label: "all", values: latencies }]} />
          </Panel>
          <details className="rounded-lg border border-line bg-bg p-4">
            <summary className="cursor-pointer text-[0.875rem] font-bold text-black">The JSON my tool would write</summary>
            <Pre className="mt-3">{JSON.stringify({ avg: summary.avg, med: summary.med, min: summary.min, max: summary.max }, null, 4)}</Pre>
          </details>
        </>
      ) : (
        <p className="text-black font-medium">No time=... ms values found.</p>
      )}
    </div>
  );
}

export default function LatencyStats() {
  const [tool, setTool] = useState<"trstats" | "pingstats">("trstats");
  return (
    <div className="space-y-6">
      <Segmented
        label="Tool"
        value={tool}
        onChange={setTool}
        options={[
          { value: "trstats", label: "trstats (traceroute)" },
          { value: "pingstats", label: "pingstats (ping)" },
        ]}
      />
      {tool === "trstats" ? <TraceView /> : <PingView />}
    </div>
  );
}
