/**
 * Gene finding with a two-state hidden Markov model (port of my Algorithms project).
 * State 0 is background (uniform emissions), state 1 is gene (A and G favoured by alpha, C and T by beta).
 */

export type Base = "A" | "C" | "G" | "T";
export const BASES: Base[] = ["A", "C", "G", "T"];

export interface HmmParams {
  /** Probability of A and G inside a gene. Beta = 0.5 - alpha so that 2(alpha + beta) = 1. */
  alpha: number;
  /** Probability of staying in the same state at each step. */
  stay: number;
}

export interface ViterbiResult {
  /** "b" for background, "g" for gene, one character per base. */
  labels: string;
  logProbability: number;
  /** V[state][t]: best log-probability of any path that ends in `state` at position t. */
  table: [number[], number[]];
  /** back[state][t]: the state at t-1 on the best path into (state, t). */
  back: [number[], number[]];
  /** The winning state at each position. */
  path: number[];
}

/** Small seeded generator so a seed always gives the same sequence. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function emissionProbabilities(alpha: number): [Record<Base, number>, Record<Base, number>] {
  const beta = 0.5 - alpha;
  return [
    { A: 0.25, C: 0.25, G: 0.25, T: 0.25 },
    { A: alpha, C: beta, G: alpha, T: beta },
  ];
}

function emit(rng: () => number, probs: Record<Base, number>): Base {
  const r = rng();
  let acc = 0;
  for (const base of BASES) {
    acc += probs[base];
    if (r < acc) return base;
  }
  return "T";
}

/** Plants non-overlapping genes in a background sequence and returns the sequence with its true labels. */
export function generateSequence(
  rng: () => number,
  length: number,
  geneCount: number,
  geneLength: number,
  alpha: number,
): { sequence: string; labels: string } {
  const [background, gene] = emissionProbabilities(alpha);
  const room = Math.max(0, length - geneCount * geneLength);
  // Choose how much background goes before each gene (and after the last one).
  const cuts = Array.from({ length: geneCount }, () => Math.floor(rng() * (room + 1))).sort((a, b) => a - b);

  let sequence = "";
  let labels = "";
  let usedBackground = 0;
  for (const cut of cuts) {
    for (; usedBackground < cut; usedBackground += 1) {
      sequence += emit(rng, background);
      labels += "b";
    }
    for (let i = 0; i < geneLength; i += 1) {
      sequence += emit(rng, gene);
      labels += "g";
    }
  }
  for (; usedBackground < room; usedBackground += 1) {
    sequence += emit(rng, background);
    labels += "b";
  }
  return { sequence, labels };
}

/** Viterbi in log space. Mirrors the original: a 50/50 prior on the first position, stay or switch each step. */
export function viterbi(sequence: string, params: HmmParams): ViterbiResult {
  const n = sequence.length;
  const [background, gene] = emissionProbabilities(params.alpha);
  const emissions = [background, gene];
  const logStay = Math.log(params.stay);
  const logSwitch = Math.log(1 - params.stay);

  const table: [number[], number[]] = [new Array(n).fill(0), new Array(n).fill(0)];
  const back: [number[], number[]] = [new Array(n).fill(0), new Array(n).fill(0)];
  if (n === 0) return { labels: "", logProbability: 0, table, back, path: [] };

  for (let s = 0; s < 2; s += 1) {
    table[s][0] = Math.log(0.5) + Math.log(emissions[s][sequence[0] as Base]);
  }
  for (let t = 1; t < n; t += 1) {
    for (let s = 0; s < 2; s += 1) {
      const emission = Math.log(emissions[s][sequence[t] as Base]);
      const stayValue = table[s][t - 1] + logStay;
      const switchValue = table[1 - s][t - 1] + logSwitch;
      if (stayValue > switchValue) {
        table[s][t] = stayValue + emission;
        back[s][t] = s;
      } else {
        table[s][t] = switchValue + emission;
        back[s][t] = 1 - s;
      }
    }
  }

  const path = new Array<number>(n).fill(0);
  path[n - 1] = table[0][n - 1] > table[1][n - 1] ? 0 : 1;
  for (let t = n - 2; t >= 0; t -= 1) path[t] = back[path[t + 1]][t + 1];

  return {
    labels: path.map((s) => (s === 0 ? "b" : "g")).join(""),
    logProbability: Math.max(table[0][n - 1], table[1][n - 1]),
    table,
    back,
    path,
  };
}

export function accuracy(truth: string, predicted: string): number {
  if (truth.length === 0) return 0;
  let same = 0;
  for (let i = 0; i < truth.length; i += 1) if (truth[i] === predicted[i]) same += 1;
  return same / truth.length;
}

/** Runs of "g" as inclusive 1-based [start, end] pairs. */
export function geneRegions(labels: string): [number, number][] {
  const regions: [number, number][] = [];
  let start = -1;
  for (let i = 0; i <= labels.length; i += 1) {
    const inGene = i < labels.length && labels[i] === "g";
    if (inGene && start < 0) start = i;
    if (!inGene && start >= 0) {
      regions.push([start + 1, i]);
      start = -1;
    }
  }
  return regions;
}

export function cleanDna(input: string): string {
  return input.toUpperCase().replace(/[^ACGT]/g, "");
}
