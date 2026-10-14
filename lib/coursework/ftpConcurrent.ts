/**
 * Discrete-event model of my concurrent FTP server's locking rules (Distributed Computing project 2).
 *
 *  - get takes a read lock on the file, put takes a write lock, one lock per file name
 *  - a trailing & runs the command in the background; without it the client waits for it to finish
 *  - terminate <id> sets a flag that the transfer checks every 1000 bytes
 *  - a terminated put deletes the partial file
 *
 * New readers queue behind a waiting writer, which is how Java's default ReentrantReadWriteLock behaves.
 * This models the lock rules on a virtual clock; it is not Java's thread scheduler.
 */

export const CHUNK = 1000;
const TICK = 10;

export type ClientId = "A" | "B" | "C";

export interface ScriptEntry {
  at: number;
  client: ClientId;
  command: string;
}

export interface SimConfig {
  /** Bytes per millisecond each transfer moves. */
  rate: number;
  serverFiles: Record<string, number>;
  /** Files in each client's local directory, by name. */
  localFiles: Record<string, number>;
}

export type Outcome = "waiting" | "running" | "done" | "terminated" | "error" | "ignored";

export interface CommandRecord {
  /** Server-assigned command ID for get and put. 0 for other commands. */
  id: number;
  client: ClientId;
  line: string;
  kind: "get" | "put" | "terminate" | "other";
  file: string;
  background: boolean;
  issuedAt: number;
  grantedAt: number | null;
  endedAt: number | null;
  outcome: Outcome;
  bytes: number;
  size: number;
  terminateRequestedAt: number | null;
  note: string;
}

export interface SimResult {
  records: CommandRecord[];
  endTime: number;
  /** Server files after everything has finished. */
  finalFiles: Record<string, number>;
}

interface LockState {
  readers: Set<number>;
  writer: number | null;
  queue: { id: number; mode: "read" | "write" }[];
}

export function parseCommand(line: string): { kind: CommandRecord["kind"]; file: string; background: boolean; arg: string } {
  const trimmed = line.trim();
  const background = /&\s*$/.test(trimmed);
  const body = trimmed.replace(/&\s*$/, "").trim();
  const [word, ...rest] = body.split(/\s+/);
  const arg = rest.join(" ");
  if (word === "get") return { kind: "get", file: arg, background, arg };
  if (word === "put") return { kind: "put", file: arg, background, arg };
  if (word === "terminate") return { kind: "terminate", file: "", background: false, arg };
  return { kind: "other", file: "", background, arg };
}

export function simulate(script: ScriptEntry[], config: SimConfig, horizon = 120_000): SimResult {
  const entries = [...script].sort((a, b) => a.at - b.at);
  let nextEntry = 0;
  const records: CommandRecord[] = [];
  const byId = new Map<number, CommandRecord>();
  const locks = new Map<string, LockState>();
  const files: Record<string, number> = { ...config.serverFiles };
  const blockedUntilDone = new Map<ClientId, number>(); // client -> record id it is waiting for
  const pendingByClient = new Map<ClientId, ScriptEntry[]>();
  let nextId = 0;

  const lockFor = (file: string): LockState => {
    let lock = locks.get(file);
    if (!lock) {
      lock = { readers: new Set(), writer: null, queue: [] };
      locks.set(file, lock);
    }
    return lock;
  };

  const startTransfer = (record: CommandRecord, t: number) => {
    record.grantedAt = t;
    record.outcome = "running";
  };

  const grantFromQueue = (file: string, t: number) => {
    const lock = lockFor(file);
    while (lock.queue.length) {
      const head = lock.queue[0];
      const record = byId.get(head.id) as CommandRecord;
      if (head.mode === "write") {
        if (lock.readers.size === 0 && lock.writer === null) {
          lock.writer = head.id;
          lock.queue.shift();
          startTransfer(record, t);
        }
        break;
      }
      if (lock.writer !== null) break;
      lock.readers.add(head.id);
      lock.queue.shift();
      startTransfer(record, t);
    }
  };

  const release = (record: CommandRecord, t: number) => {
    const lock = lockFor(record.file);
    lock.readers.delete(record.id);
    if (lock.writer === record.id) lock.writer = null;
    grantFromQueue(record.file, t);
  };

  const issue = (entry: ScriptEntry, t: number) => {
    const parsed = parseCommand(entry.command);
    const base: CommandRecord = {
      id: 0,
      client: entry.client,
      line: entry.command.trim(),
      kind: parsed.kind,
      file: parsed.file,
      background: parsed.background,
      issuedAt: t,
      grantedAt: null,
      endedAt: null,
      outcome: "waiting",
      bytes: 0,
      size: 0,
      terminateRequestedAt: null,
      note: "",
    };

    if (parsed.kind === "terminate") {
      const target = byId.get(Number(parsed.arg));
      base.endedAt = t;
      if (!target || target.endedAt !== null) {
        base.outcome = "ignored";
        base.note = target ? `command ${parsed.arg} already finished` : `no command ${parsed.arg}`;
      } else {
        target.terminateRequestedAt = t;
        base.outcome = "done";
        base.note = `terminate sent for command ${parsed.arg}`;
      }
      records.push(base);
      return;
    }
    if (parsed.kind === "other") {
      base.outcome = "error";
      base.endedAt = t;
      base.note = "only get, put and terminate are modelled here";
      records.push(base);
      return;
    }

    nextId += 1;
    base.id = nextId;
    byId.set(base.id, base);
    records.push(base);

    if (parsed.kind === "get") {
      if (files[parsed.file] === undefined) {
        base.outcome = "error";
        base.endedAt = t;
        base.note = "ERROR File not found";
        return;
      }
      base.size = files[parsed.file];
    } else {
      const size = config.localFiles[parsed.file];
      if (size === undefined) {
        base.outcome = "error";
        base.endedAt = t;
        base.note = "local file not found";
        return;
      }
      base.size = size;
    }

    const lock = lockFor(base.file);
    const mode = parsed.kind === "get" ? "read" : "write";
    const frontIsWriter = lock.queue.length > 0 && lock.queue[0].mode === "write";
    const free = mode === "read" ? lock.writer === null && !frontIsWriter : lock.writer === null && lock.readers.size === 0 && lock.queue.length === 0;
    if (free) {
      if (mode === "read") lock.readers.add(base.id);
      else lock.writer = base.id;
      startTransfer(base, t);
    } else {
      lock.queue.push({ id: base.id, mode });
    }
    if (!base.background) blockedUntilDone.set(entry.client, base.id);
  };

  let t = 0;
  while (t <= horizon) {
    // Release clients whose foreground command has finished.
    for (const [client, id] of [...blockedUntilDone]) {
      if ((byId.get(id) as CommandRecord).endedAt !== null) blockedUntilDone.delete(client);
    }
    // Move newly due script entries to per-client queues, then issue the head of each unblocked client.
    while (nextEntry < entries.length && entries[nextEntry].at <= t) {
      const entry = entries[nextEntry];
      const list = pendingByClient.get(entry.client) ?? [];
      list.push(entry);
      pendingByClient.set(entry.client, list);
      nextEntry += 1;
    }
    for (const [client, list] of pendingByClient) {
      while (list.length && !blockedUntilDone.has(client)) {
        issue(list.shift() as ScriptEntry, t);
      }
    }

    // Advance running transfers.
    for (const record of records) {
      if (record.outcome !== "running") continue;
      const step = config.rate * TICK;
      const flagged = record.terminateRequestedAt !== null;
      const nextBoundary = Math.min(record.size, (Math.floor(record.bytes / CHUNK) + 1) * CHUNK);
      let target = Math.min(record.size, record.bytes + step);
      if (flagged && target >= nextBoundary) target = nextBoundary;
      record.bytes = target;
      if (flagged && record.bytes % CHUNK === 0 && record.bytes < record.size) {
        record.outcome = "terminated";
        record.endedAt = t + TICK;
        record.note = record.kind === "put" ? "terminated, partial file deleted" : "terminated";
        if (record.kind === "put") delete files[record.file];
        release(record, t + TICK);
      } else if (record.bytes >= record.size) {
        record.outcome = "done";
        record.endedAt = t + TICK;
        if (record.kind === "put") files[record.file] = record.size;
        release(record, t + TICK);
      }
    }

    const busy = records.some((r) => r.outcome === "waiting" || r.outcome === "running");
    const morePending = nextEntry < entries.length || [...pendingByClient.values()].some((l) => l.length > 0);
    if (!busy && !morePending) break;
    t += TICK;
  }

  const endTime = Math.max(0, ...records.map((r) => r.endedAt ?? r.issuedAt)) + 500;
  return { records, endTime, finalFiles: files };
}

export interface LockView {
  file: string;
  readers: number[];
  writer: number | null;
  waiting: { id: number; mode: "read" | "write" }[];
}

/** The lock table at virtual time t, derived from the command records. */
export function locksAt(result: SimResult, t: number): LockView[] {
  const byFile = new Map<string, LockView>();
  const view = (file: string) => {
    let v = byFile.get(file);
    if (!v) {
      v = { file, readers: [], writer: null, waiting: [] };
      byFile.set(file, v);
    }
    return v;
  };
  for (const r of result.records) {
    if (r.kind !== "get" && r.kind !== "put") continue;
    if (r.issuedAt > t || r.outcome === "error") continue;
    const mode = r.kind === "get" ? "read" : "write";
    const granted = r.grantedAt !== null && r.grantedAt <= t;
    const ended = r.endedAt !== null && r.endedAt <= t;
    if (ended) continue;
    if (granted) {
      if (mode === "read") view(r.file).readers.push(r.id);
      else view(r.file).writer = r.id;
    } else {
      view(r.file).waiting.push({ id: r.id, mode });
    }
  }
  return [...byFile.values()].sort((a, b) => a.file.localeCompare(b.file));
}

export const SCENARIOS: { id: string; label: string; description: string; script: ScriptEntry[] }[] = [
  {
    id: "readers-writer",
    label: "Two readers and a writer",
    description: "A and B read report.pdf together. C's put has to wait for both, then runs alone.",
    script: [
      { at: 0, client: "A", command: "get report.pdf &" },
      { at: 300, client: "B", command: "get report.pdf &" },
      { at: 600, client: "C", command: "put report.pdf &" },
    ],
  },
  {
    id: "writer-blocks-readers",
    label: "A waiting writer blocks new readers",
    description: "B's put waits for A. C's later get queues behind the writer instead of overtaking it.",
    script: [
      { at: 0, client: "A", command: "get report.pdf &" },
      { at: 300, client: "B", command: "put report.pdf &" },
      { at: 700, client: "C", command: "get report.pdf &" },
    ],
  },
  {
    id: "terminate-put",
    label: "Terminate a long upload",
    description: "A starts a large upload in the background, then terminates it. The transfer stops at the next 1000-byte check and the partial file is deleted.",
    script: [
      { at: 0, client: "A", command: "put backup.tar &" },
      { at: 2200, client: "A", command: "terminate 1" },
    ],
  },
  {
    id: "independent-files",
    label: "Different files do not wait",
    description: "A reads one file while B writes another. There is one lock per file name, so nothing waits.",
    script: [
      { at: 0, client: "A", command: "get report.pdf &" },
      { at: 100, client: "B", command: "put notes.txt &" },
    ],
  },
  {
    id: "foreground",
    label: "Foreground blocks the client",
    description: "A's second command has no &, so A cannot start its next one until the first finishes.",
    script: [
      { at: 0, client: "A", command: "get report.pdf" },
      { at: 100, client: "A", command: "get notes.txt" },
      { at: 100, client: "B", command: "get notes.txt &" },
    ],
  },
];

export const DEFAULT_CONFIG: SimConfig = {
  rate: 40,
  serverFiles: { "report.pdf": 60_000, "notes.txt": 12_000, "data.csv": 30_000 },
  localFiles: { "backup.tar": 120_000, "report.pdf": 64_000, "notes.txt": 14_000 },
};
