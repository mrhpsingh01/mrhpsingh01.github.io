/**
 * Port of my ping and traceroute statistics tools (cn-proj-3), plus box-plot maths like matplotlib's.
 * Reads text only: nothing here runs ping or traceroute.
 */
import { mulberry32 } from "./hmm";

export interface HopReading {
  hop: number;
  hosts: [string, string][];
  latencies: number[];
}

export interface HopStats {
  avg: number;
  hop: number;
  hosts: [string, string][];
  latency: number[];
  max: number;
  med: number;
  min: number;
}

export interface TraceParse {
  readings: HopReading[];
  /** Hop numbers where no probe answered (* * *). */
  silent: number[];
}

/**
 * Parses traceroute output. By default every probe time on a hop line is used. With `firstProbeOnly` it
 * mimics my original regex, which read just the first time on each line.
 */
export function parseTraceroute(text: string, firstProbeOnly = false): TraceParse {
  const readings: HopReading[] = [];
  const silent: number[] = [];
  for (const line of text.split(/\r?\n/)) {
    const head = /^\s*(\d+)\s+(.*)$/.exec(line);
    if (!head) continue;
    const hop = Number(head[1]);
    const rest = head[2];
    const times = [...rest.matchAll(/(\d+(?:\.\d+)?)\s+ms/g)].map((m) => Number(m[1]));
    if (times.length === 0) {
      if (/\*/.test(rest)) silent.push(hop);
      continue;
    }
    const hosts: [string, string][] = [];
    for (const m of rest.matchAll(/(\S+)\s+\((\d+\.\d+\.\d+\.\d+)\)/g)) hosts.push([m[1], m[2]]);
    if (hosts.length === 0) {
      const bare = /(\d+\.\d+\.\d+\.\d+)\s+\d/.exec(rest);
      if (bare) hosts.push([bare[1], bare[1]]);
    }
    readings.push({ hop, hosts: hosts.slice(0, 1), latencies: firstProbeOnly ? times.slice(0, 1) : times });
  }
  return { readings, silent };
}

export function mean(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** Groups readings by hop across runs, producing the same fields as my JSON output. */
export function hopStats(readings: HopReading[]): HopStats[] {
  const byHop = new Map<number, { hosts: [string, string][]; latencies: number[] }>();
  for (const r of readings) {
    const entry = byHop.get(r.hop) ?? { hosts: r.hosts, latencies: [] };
    entry.latencies.push(...r.latencies);
    byHop.set(r.hop, entry);
  }
  return [...byHop.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([hop, { hosts, latencies }]) => ({
      avg: mean(latencies),
      hop,
      hosts,
      latency: latencies,
      max: Math.max(...latencies),
      med: median(latencies),
      min: Math.min(...latencies),
    }));
}

/** Linear-interpolation percentile, the default in numpy and matplotlib. */
export function percentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  const index = (sorted.length - 1) * p;
  const lo = Math.floor(index);
  const hi = Math.ceil(index);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (index - lo);
}

export interface BoxStats {
  q1: number;
  median: number;
  q3: number;
  whiskerLow: number;
  whiskerHigh: number;
  outliers: number[];
}

/** Whiskers reach the furthest point within 1.5 x IQR of the box, like matplotlib. */
export function boxStats(values: number[]): BoxStats {
  const q1 = percentile(values, 0.25);
  const q3 = percentile(values, 0.75);
  const iqr = q3 - q1;
  const lowFence = q1 - 1.5 * iqr;
  const highFence = q3 + 1.5 * iqr;
  const inside = values.filter((v) => v >= lowFence && v <= highFence);
  return {
    q1,
    median: median(values),
    q3,
    whiskerLow: Math.min(...inside),
    whiskerHigh: Math.max(...inside),
    outliers: values.filter((v) => v < lowFence || v > highFence).sort((a, b) => a - b),
  };
}

/* -------------------------------------------------------------------- ping */

export function parsePing(text: string): number[] {
  return [...text.matchAll(/time[=<](\d+(?:\.\d+)?)\s*ms/g)].map((m) => Number(m[1]));
}

export function pingSummary(latencies: number[]) {
  return { avg: mean(latencies), med: median(latencies), min: Math.min(...latencies), max: Math.max(...latencies) };
}

/** Synthetic ping output in Linux format, for the demo only. */
export function syntheticPing(seed: number, count = 20): string {
  const rng = mulberry32(seed);
  const lines = ["PING demo.example (203.0.113.7) 56(84) bytes of data."];
  for (let i = 1; i <= count; i += 1) {
    const spike = rng() < 0.08 ? 25 + rng() * 40 : 0;
    const time = 18 + rng() * 5 + spike;
    lines.push(`64 bytes from 203.0.113.7: icmp_seq=${i} ttl=117 time=${time.toFixed(1)} ms`);
  }
  lines.push("", "--- demo.example ping statistics ---", `${count} packets transmitted, ${count} received, 0% packet loss`);
  return lines.join("\n");
}

/** Plain-language readouts computed from the data, in the spirit of my written conclusions. */
export function insights(stats: HopStats[], silent: number[]): string[] {
  if (stats.length === 0) return [];
  const lines: string[] = [];
  const boxes = stats.map((s) => ({ s, box: boxStats(s.latency) }));
  const highest = boxes.reduce((a, b) => (b.s.med > a.s.med ? b : a));
  lines.push(`Highest median latency: hop ${highest.s.hop} at ${highest.s.med.toFixed(1)} ms.`);
  const widest = boxes.reduce((a, b) => (b.box.q3 - b.box.q1 > a.box.q3 - a.box.q1 ? b : a));
  lines.push(`Widest spread (interquartile range): hop ${widest.s.hop}, ${(widest.box.q3 - widest.box.q1).toFixed(1)} ms.`);
  const withOutliers = boxes.filter((b) => b.box.outliers.length > 0);
  if (withOutliers.length) {
    lines.push(
      `Outliers at ${withOutliers.map((b) => `hop ${b.s.hop} (${b.box.outliers.map((v) => v.toFixed(0)).join(", ")} ms)`).join(", ")}.`,
    );
  } else {
    lines.push("No outliers: every reading sits inside the whiskers.");
  }
  let biggestJump = { hop: 0, jump: 0 };
  for (let i = 1; i < stats.length; i += 1) {
    const jump = stats[i].med - stats[i - 1].med;
    if (jump > biggestJump.jump) biggestJump = { hop: stats[i].hop, jump };
  }
  // A hop that is slower than hops after it is usually slow to answer probes, not slow to forward traffic.
  const slowToAnswer = stats.filter((s, i) => stats.slice(i + 1).some((later) => later.med * 1.5 < s.med));
  if (slowToAnswer.length) {
    lines.push(
      `Hop ${slowToAnswer.map((s) => s.hop).join(", ")} answers slower than hops after it, so it is probably slow to reply to probes rather than slow to forward traffic.`,
    );
  }
  if (biggestJump.jump > 0) lines.push(`Biggest rise between neighbouring hops: into hop ${biggestJump.hop}, +${biggestJump.jump.toFixed(1)} ms in the median.`);
  if (silent.length) lines.push(`Hops that never answered: ${[...new Set(silent)].sort((a, b) => a - b).join(", ")} (skipped, as in my parser).`);
  return lines;
}
