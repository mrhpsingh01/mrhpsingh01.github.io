/**
 * RNA secondary-structure prediction by dynamic programming (port of my Algorithms project).
 * Pair scores A-U 2, C-G 3, G-U 1, with a minimum distance between paired bases.
 */

export type TracebackMode = "fixed" | "original";

export function pairScore(a: string, b: string): number {
  const key = a + b;
  if (key === "AU" || key === "UA") return 2;
  if (key === "CG" || key === "GC") return 3;
  if (key === "GU" || key === "UG") return 1;
  return 0;
}

export interface FoldResult {
  sequence: string;
  minDistance: number;
  /** dp[i][j]: best score for the substring i..j (only i <= j is meaningful). */
  dp: number[][];
  /** Cells in the order they are filled: by substring length, then by start. */
  order: [number, number][];
  /** Dot-bracket structure from the chosen traceback. */
  structure: string;
  pairs: [number, number][];
  /** Best score according to the table. */
  tableScore: number;
  /** Sum of pair scores in the traced structure. Equal to tableScore when the traceback is right. */
  structureScore: number;
  /** For the original traceback: the cells where a pair flag was recorded before a split raised the value. */
  mode: TracebackMode;
}

export function fold(sequence: string, minDistance = 4, mode: TracebackMode = "fixed"): FoldResult {
  const n = sequence.length;
  const dp = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  const pairFlag = Array.from({ length: n }, () => new Array<boolean>(n).fill(false));
  const order: [number, number][] = [];

  for (let length = 2; length <= n; length += 1) {
    for (let i = 0; i + length - 1 < n; i += 1) {
      const j = i + length - 1;
      order.push([i, j]);
      dp[i][j] = dp[i][j - 1];
      if (j - i >= minDistance) {
        const s = pairScore(sequence[i], sequence[j]);
        if (s > 0) {
          const potential = s + (i + 1 <= j - 1 ? dp[i + 1][j - 1] : 0);
          if (potential > dp[i][j]) {
            dp[i][j] = potential;
            pairFlag[i][j] = true; // recorded now; the split loop below may raise dp[i][j] further
          }
        }
      }
      for (let k = i; k < j; k += 1) dp[i][j] = Math.max(dp[i][j], dp[i][k] + dp[k + 1][j]);
    }
  }

  const pairs: [number, number][] = [];

  if (mode === "original") {
    // My original traceback: trust the pair flag, otherwise split.
    const trace = (i: number, j: number) => {
      if (i >= j) return;
      if (pairFlag[i][j]) {
        pairs.push([i, j]);
        trace(i + 1, j - 1);
      } else {
        for (let k = i; k < j; k += 1) {
          if (dp[i][j] === dp[i][k] + dp[k + 1][j]) {
            trace(i, k);
            trace(k + 1, j);
            break;
          }
        }
      }
    };
    trace(0, n - 1);
  } else {
    // Corrected traceback: recompute every decision from the table values.
    const trace = (i: number, j: number) => {
      if (i >= j) return;
      if (dp[i][j] === dp[i][j - 1]) {
        trace(i, j - 1);
        return;
      }
      if (j - i >= minDistance) {
        const s = pairScore(sequence[i], sequence[j]);
        const inner = i + 1 <= j - 1 ? dp[i + 1][j - 1] : 0;
        if (s > 0 && dp[i][j] === s + inner) {
          pairs.push([i, j]);
          trace(i + 1, j - 1);
          return;
        }
      }
      for (let k = i; k < j; k += 1) {
        if (dp[i][j] === dp[i][k] + dp[k + 1][j]) {
          trace(i, k);
          trace(k + 1, j);
          return;
        }
      }
    };
    trace(0, n - 1);
  }

  const chars = new Array<string>(n).fill(".");
  let structureScore = 0;
  for (const [i, j] of pairs) {
    chars[i] = "(";
    chars[j] = ")";
    structureScore += pairScore(sequence[i], sequence[j]);
  }

  return {
    sequence,
    minDistance,
    dp,
    order,
    structure: chars.join(""),
    pairs: pairs.sort((a, b) => a[0] - b[0]),
    tableScore: n > 1 ? dp[0][n - 1] : 0,
    structureScore,
    mode,
  };
}

export function cleanRna(input: string): string {
  return input.toUpperCase().replace(/T/g, "U").replace(/[^ACGU]/g, "");
}

/** Searches seeded random sequences for one where the original traceback disagrees with the table. */
export function findOriginalMismatch(rng: () => number, minDistance: number, tries = 4000): string | undefined {
  const letters = ["A", "C", "G", "U"];
  for (let attempt = 0; attempt < tries; attempt += 1) {
    const length = 14 + Math.floor(rng() * 12);
    let sequence = "";
    for (let i = 0; i < length; i += 1) sequence += letters[Math.floor(rng() * 4)];
    const original = fold(sequence, minDistance, "original");
    if (original.structureScore !== original.tableScore) return sequence;
  }
  return undefined;
}
