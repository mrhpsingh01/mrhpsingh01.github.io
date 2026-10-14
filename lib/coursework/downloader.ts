/**
 * Simulation of my multi-threaded HTTPS downloader (Computer Networks).
 * The part planning and retry rules follow the C program: parts are byte ranges, the last part takes the
 * remainder, and each part is tried at most 3 times. Everything else (bandwidth, failures) is simulated.
 */
import { mulberry32 } from "./hmm";

export const MAX_ATTEMPTS = 3;
const HANDSHAKE_MS = 140;
const TICK_MS = 50;
const REASSEMBLE_MS_PER_MB = 6;

export interface Part {
  part: number;
  start: number;
  end: number;
  bytes: number;
  rangeHeader: string;
}

export function planParts(fileSize: number, numParts: number): Part[] {
  const partSize = Math.floor(fileSize / numParts);
  return Array.from({ length: numParts }, (_, i) => {
    const start = i * partSize;
    const end = i === numParts - 1 ? fileSize - 1 : (i + 1) * partSize - 1;
    return { part: i + 1, start, end, bytes: end - start + 1, rangeHeader: `Range: bytes=${start}-${end}` };
  });
}

export interface SimParams {
  fileSize: number;
  parts: number;
  /** Bytes per second one connection can pull. */
  perConnection: number;
  /** Bytes per second the server can deliver in total. */
  serverCap: number;
  /** Chance that one connection attempt fails during connect or the TLS handshake. */
  failureRate: number;
  seed: number;
}

export type PartState = "connecting" | "retrying" | "downloading" | "done" | "failed" | "waiting";

export interface Sample {
  t: number;
  state: PartState;
  attempt: number;
  downloaded: number;
}

export interface SimEvent {
  t: number;
  part: number;
  text: string;
}

export interface SimResult {
  params: SimParams;
  parts: Part[];
  samples: Sample[][];
  events: SimEvent[];
  /** When the last thread finished. */
  transfersDoneAt: number;
  reassembledAt: number | null;
  failedParts: number[];
  totalBytes: number;
  assembledBytes: number;
}

export function simulate(params: SimParams): SimResult {
  const rng = mulberry32(params.seed);
  const parts = planParts(params.fileSize, params.parts);
  const jitter = parts.map(() => 0.75 + rng() * 0.5);
  // Pre-roll which attempts fail, so changing nothing but the seed changes the story.
  const attemptFails = parts.map(() => Array.from({ length: MAX_ATTEMPTS }, () => rng() < params.failureRate));

  type Runtime = {
    state: PartState;
    attempt: number;
    until: number;
    downloaded: number;
  };
  const runtime: Runtime[] = parts.map(() => ({ state: "connecting", attempt: 1, until: HANDSHAKE_MS, downloaded: 0 }));
  const samples: Sample[][] = parts.map(() => []);
  const events: SimEvent[] = [];
  parts.forEach((p) => events.push({ t: 0, part: p.part, text: `thread ${p.part} starts, attempt 1, ${p.rangeHeader}` }));

  let t = 0;
  const finished = () => runtime.every((r) => r.state === "done" || r.state === "failed");
  while (!finished() && t < 10 * 60 * 1000) {
    const active = runtime.filter((r) => r.state === "downloading").length;
    for (let i = 0; i < parts.length; i += 1) {
      const r = runtime[i];
      if (r.state === "connecting" && t >= r.until) {
        if (attemptFails[i][r.attempt - 1]) {
          if (r.attempt >= MAX_ATTEMPTS) {
            r.state = "failed";
            events.push({ t, part: parts[i].part, text: `part ${parts[i].part} failed after ${MAX_ATTEMPTS} attempts` });
          } else {
            events.push({ t, part: parts[i].part, text: `part ${parts[i].part}: connect failed, retrying (attempt ${r.attempt + 1})` });
            r.attempt += 1;
            r.until = t + HANDSHAKE_MS;
          }
        } else {
          r.state = "downloading";
          events.push({ t, part: parts[i].part, text: `part ${parts[i].part}: connected, downloading ${parts[i].bytes} bytes` });
        }
      } else if (r.state === "downloading") {
        const rate = Math.min(params.perConnection * jitter[i], params.serverCap / Math.max(1, active));
        r.downloaded = Math.min(parts[i].bytes, r.downloaded + (rate * TICK_MS) / 1000);
        if (r.downloaded >= parts[i].bytes) {
          r.state = "done";
          events.push({ t, part: parts[i].part, text: `part ${parts[i].part} downloaded` });
        }
      }
      samples[i].push({ t, state: r.state, attempt: r.attempt, downloaded: r.downloaded });
    }
    t += TICK_MS;
  }

  const failedParts = runtime.map((r, i) => (r.state === "failed" ? parts[i].part : 0)).filter(Boolean);
  const transfersDoneAt = t;
  let reassembledAt: number | null = null;
  let assembledBytes = 0;
  if (failedParts.length === 0) {
    reassembledAt = t + Math.round((params.fileSize / 1_000_000) * REASSEMBLE_MS_PER_MB);
    assembledBytes = parts.reduce((sum, p) => sum + p.bytes, 0);
    events.push({ t: transfersDoneAt, part: 0, text: "all parts downloaded, reassembling" });
    events.push({ t: reassembledAt, part: 0, text: `reassembled ${assembledBytes} bytes` });
  } else {
    events.push({
      t: transfersDoneAt,
      part: 0,
      text: `reassembly stops: part_${failedParts[0]} is missing (the original program exits here)`,
    });
  }

  return {
    params,
    parts,
    samples,
    events,
    transfersDoneAt,
    reassembledAt,
    failedParts,
    totalBytes: params.fileSize,
    assembledBytes,
  };
}

/** The state of one part at virtual time t. */
export function sampleAt(result: SimResult, partIndex: number, t: number): Sample {
  const list = result.samples[partIndex];
  if (list.length === 0) return { t: 0, state: "connecting", attempt: 1, downloaded: 0 };
  const index = Math.min(list.length - 1, Math.max(0, Math.floor(t / TICK_MS)));
  return list[index];
}
