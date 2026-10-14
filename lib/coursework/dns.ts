/**
 * DNS wire format (RFC 1035) and the forwarder's decision logic, for the Computer Networks demo.
 * The messages are real DNS messages; the network and the upstream zone are simulated.
 */

export const QTYPES = { A: 1, NS: 2, CNAME: 5, PTR: 12, MX: 15, TXT: 16, AAAA: 28 } as const;
export type QTypeName = keyof typeof QTYPES;

export function qtypeName(code: number): string {
  const found = (Object.entries(QTYPES) as [QTypeName, number][]).find(([, value]) => value === code);
  return found ? found[0] : String(code);
}

export function encodeName(name: string): number[] {
  const bytes: number[] = [];
  for (const label of name.replace(/\.$/, "").split(".")) {
    if (label.length === 0) continue;
    bytes.push(label.length);
    for (const ch of label) bytes.push(ch.charCodeAt(0) & 0xff);
  }
  bytes.push(0);
  return bytes;
}

function u16(value: number): number[] {
  return [(value >> 8) & 0xff, value & 0xff];
}
function u32(value: number): number[] {
  return [(value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff];
}

export function buildQuery(id: number, name: string, qtype: number): Uint8Array {
  const flags = 0x0100; // recursion desired
  return Uint8Array.from([
    ...u16(id),
    ...u16(flags),
    ...u16(1), // QDCOUNT
    ...u16(0),
    ...u16(0),
    ...u16(0),
    ...encodeName(name),
    ...u16(qtype),
    ...u16(1), // class IN
  ]);
}

export interface Answer {
  type: number;
  ttl: number;
  /** A: dotted quad. PTR and CNAME: a name. AAAA: colon-separated groups. */
  data: string;
}

function encodeRdata(answer: Answer): number[] {
  if (answer.type === QTYPES.A) return answer.data.split(".").map(Number);
  if (answer.type === QTYPES.AAAA) {
    return answer.data.split(":").flatMap((group) => u16(parseInt(group || "0", 16)));
  }
  return encodeName(answer.data);
}

/** Copies the query's question and sets the response flags, like my forwarder's NXDOMAIN builder. */
export function buildResponse(query: Uint8Array, rcode: number, answers: Answer[]): Uint8Array {
  const id = (query[0] << 8) | query[1];
  const rd = query[2] & 0x01;
  const flags = 0x8000 | (rd << 8) | 0x0080 | rcode; // QR, RD copied, RA, rcode
  const question = Array.from(query.slice(12));
  const records = answers.flatMap((answer) => {
    const rdata = encodeRdata(answer);
    return [0xc0, 0x0c, ...u16(answer.type), ...u16(1), ...u32(answer.ttl), ...u16(rdata.length), ...rdata];
  });
  return Uint8Array.from([...u16(id), ...u16(flags), ...u16(1), ...u16(answers.length), ...u16(0), ...u16(0), ...question, ...records]);
}

export interface ParsedMessage {
  id: number;
  isResponse: boolean;
  opcode: number;
  recursionDesired: boolean;
  recursionAvailable: boolean;
  rcode: number;
  questions: { name: string; type: number }[];
  answers: { type: number; ttl: number; data: string }[];
}

function readName(bytes: Uint8Array, start: number): { name: string; next: number } {
  const labels: string[] = [];
  let pos = start;
  let next = -1;
  for (let guard = 0; guard < 64; guard += 1) {
    const length = bytes[pos];
    if (length === 0) {
      pos += 1;
      break;
    }
    if ((length & 0xc0) === 0xc0) {
      if (next < 0) next = pos + 2;
      pos = ((length & 0x3f) << 8) | bytes[pos + 1];
      continue;
    }
    labels.push(String.fromCharCode(...bytes.slice(pos + 1, pos + 1 + length)));
    pos += 1 + length;
  }
  return { name: labels.join("."), next: next >= 0 ? next : pos };
}

export function parseMessage(bytes: Uint8Array): ParsedMessage {
  const flags = (bytes[2] << 8) | bytes[3];
  const qd = (bytes[4] << 8) | bytes[5];
  const an = (bytes[6] << 8) | bytes[7];
  let pos = 12;
  const questions: ParsedMessage["questions"] = [];
  for (let i = 0; i < qd; i += 1) {
    const { name, next } = readName(bytes, pos);
    questions.push({ name, type: (bytes[next] << 8) | bytes[next + 1] });
    pos = next + 4;
  }
  const answers: ParsedMessage["answers"] = [];
  for (let i = 0; i < an; i += 1) {
    const { next } = readName(bytes, pos);
    const type = (bytes[next] << 8) | bytes[next + 1];
    const ttl = ((bytes[next + 4] << 24) | (bytes[next + 5] << 16) | (bytes[next + 6] << 8) | bytes[next + 7]) >>> 0;
    const length = (bytes[next + 8] << 8) | bytes[next + 9];
    const start = next + 10;
    let data = "";
    if (type === QTYPES.A) data = Array.from(bytes.slice(start, start + 4)).join(".");
    else if (type === QTYPES.AAAA) {
      const groups: string[] = [];
      for (let g = 0; g < 8; g += 1) groups.push(((bytes[start + g * 2] << 8) | bytes[start + g * 2 + 1]).toString(16));
      data = groups.join(":");
    } else data = readName(bytes, start).name;
    answers.push({ type, ttl, data });
    pos = start + length;
  }
  return {
    id: (bytes[0] << 8) | bytes[1],
    isResponse: (flags & 0x8000) !== 0,
    opcode: (flags >> 11) & 0xf,
    recursionDesired: (flags & 0x0100) !== 0,
    recursionAvailable: (flags & 0x0080) !== 0,
    rcode: flags & 0xf,
    questions,
    answers,
  };
}

export function hexDump(bytes: Uint8Array): string {
  const rows: string[] = [];
  for (let i = 0; i < bytes.length; i += 16) {
    const slice = Array.from(bytes.slice(i, i + 16));
    const hex = slice.map((b) => b.toString(16).padStart(2, "0")).join(" ");
    const text = slice.map((b) => (b >= 32 && b < 127 ? String.fromCharCode(b) : ".")).join("");
    rows.push(`${i.toString(16).padStart(4, "0")}  ${hex.padEnd(47, " ")}  ${text}`);
  }
  return rows.join("\n");
}

/** RFC 8484: a GET request carries the message in the `dns` parameter as unpadded base64url. */
export function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/* ---------------------------------------------------------------- forwarder */

export type Action = "ALLOW" | "DENY";

export interface ForwarderConfig {
  denyList: string[];
  /** The original matches the exact name only. Turning this on also blocks subdomains. */
  matchSubdomains: boolean;
  mode: "udp" | "doh";
  dohServer: string;
  upstreamIp: string;
}

export function isDenied(domain: string, config: Pick<ForwarderConfig, "denyList" | "matchSubdomains">): boolean {
  const name = domain.toLowerCase().replace(/\.$/, "");
  return config.denyList.some((entry) => {
    const denied = entry.trim().toLowerCase();
    if (!denied) return false;
    return name === denied || (config.matchSubdomains && name.endsWith(`.${denied}`));
  });
}

/** A tiny synthetic upstream. Addresses come from the documentation ranges, never from real DNS. */
export function upstreamAnswer(name: string, qtype: number): { rcode: number; answers: Answer[] } {
  const lower = name.toLowerCase().replace(/\.$/, "");
  if (lower.endsWith(".invalid")) return { rcode: 3, answers: [] };
  let hash = 0;
  for (const ch of lower) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const last = (hash % 250) + 2;
  if (qtype === QTYPES.A) return { rcode: 0, answers: [{ type: QTYPES.A, ttl: 300, data: `203.0.113.${last}` }] };
  if (qtype === QTYPES.AAAA) {
    return { rcode: 0, answers: [{ type: QTYPES.AAAA, ttl: 300, data: `2001:db8:0:0:0:0:0:${last.toString(16)}` }] };
  }
  if (qtype === QTYPES.PTR) return { rcode: 0, answers: [{ type: QTYPES.PTR, ttl: 300, data: "localhost" }] };
  return { rcode: 0, answers: [] };
}

export interface QueryTrace {
  action: Action;
  query: Uint8Array;
  queryParsed: ParsedMessage;
  logLine: string;
  upstreamRequest?: string;
  response: Uint8Array;
  responseParsed: ParsedMessage;
}

/** Runs one query through the forwarder exactly as the original does: log, then block or forward. */
export function forward(id: number, name: string, qtype: number, config: ForwarderConfig): QueryTrace {
  const query = buildQuery(id, name, qtype);
  const queryParsed = parseMessage(query);
  const denied = isDenied(name, config);
  const action: Action = denied ? "DENY" : "ALLOW";
  const logLine = `${name.replace(/\.$/, "")} ${qtype} ${action}`;

  if (denied) {
    const response = buildResponse(query, 3, []);
    return { action, query, queryParsed, logLine, response, responseParsed: parseMessage(response) };
  }
  const upstream = upstreamAnswer(name, qtype);
  const response = buildResponse(query, upstream.rcode, upstream.answers);
  const upstreamRequest =
    config.mode === "doh"
      ? `GET https://${config.dohServer}/dns-query?dns=${base64Url(query)}\nAccept: application/dns-message`
      : `UDP datagram of ${query.length} bytes to ${config.upstreamIp}:53`;
  return { action, query, queryParsed, logLine, upstreamRequest, response, responseParsed: parseMessage(response) };
}
