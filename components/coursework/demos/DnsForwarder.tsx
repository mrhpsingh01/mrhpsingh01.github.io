"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import {
  QTYPES,
  forward,
  hexDump,
  qtypeName,
  type ForwarderConfig,
  type ParsedMessage,
  type QueryTrace,
} from "@/lib/coursework/dns";
import { Btn, Panel, Pre, Segmented, TextAreaField, TextField, Toggle } from "../ui";

const ORIGINAL_LOG = [
  "1.0.0.127.in-addr.arpa 12 ALLOW",
  "yahoo.co.jp.lan 1 ALLOW",
  "yahoo.co.jp.lan 28 ALLOW",
  "yahoo.co.jp 1 DENY",
  "yahoo.co.jp 28 DENY",
  "www.google.com.lan 1 ALLOW",
  "www.google.com 1 ALLOW",
];

const QUICK = ["yahoo.co.jp", "www.yahoo.co.jp", "www.example.org", "service.invalid"];
const STAGES = ["Client sends a query", "Forwarder decides", "Upstream is asked", "Response goes back"] as const;

function describe(message: ParsedMessage): string {
  const q = message.questions[0];
  const rcode = ["NOERROR", "FORMERR", "SERVFAIL", "NXDOMAIN"][message.rcode] ?? String(message.rcode);
  const flags = [message.isResponse ? "QR" : "query", message.recursionDesired ? "RD" : "", message.recursionAvailable ? "RA" : ""]
    .filter(Boolean)
    .join(" ");
  const answers = message.answers.length ? message.answers.map((a) => `${qtypeName(a.type)} ${a.data} (ttl ${a.ttl})`).join(", ") : "no answers";
  return `id 0x${message.id.toString(16).padStart(4, "0")}  flags ${flags}  rcode ${rcode}\nquestion ${q.name} ${qtypeName(q.type)}\n${message.isResponse ? answers : ""}`.trimEnd();
}

export default function DnsForwarder() {
  const [domain, setDomain] = useState("yahoo.co.jp");
  const [qtype, setQtype] = useState<"A" | "AAAA" | "PTR">("A");
  const [mode, setMode] = useState<ForwarderConfig["mode"]>("udp");
  const [matchSubdomains, setMatchSubdomains] = useState(false);
  const [deny, setDeny] = useState("cobweb.cs.uga.edu\nyahoo.co.jp\nfacebook.com");
  // Start with one query already run, so the pipeline is not empty on first view.
  const [trace, setTrace] = useState<QueryTrace | null>(() =>
    forward(0x2a10, "yahoo.co.jp", QTYPES.A, {
      denyList: ["cobweb.cs.uga.edu", "yahoo.co.jp", "facebook.com"],
      matchSubdomains: false,
      mode: "udp",
      dohServer: "dns.example.net",
      upstreamIp: "198.51.100.53",
    }),
  );
  const [shown, setShown] = useState(4);
  const [log, setLog] = useState<string[]>(["yahoo.co.jp 1 DENY"]);
  const nextId = useRef(0x2a10);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  function send(name = domain) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const config: ForwarderConfig = {
      denyList: deny.split("\n").map((line) => line.trim()).filter(Boolean),
      matchSubdomains,
      mode,
      dohServer: "dns.example.net",
      upstreamIp: "198.51.100.53",
    };
    nextId.current += 1;
    const result = forward(nextId.current, trimmed, QTYPES[qtype], config);
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setTrace(result);
    setShown(1);
    const lastStage = result.action === "DENY" ? 3 : 4;
    for (let stage = 2; stage <= lastStage; stage += 1) {
      timers.current.push(window.setTimeout(() => setShown(stage), (stage - 1) * 450));
    }
    timers.current.push(
      window.setTimeout(() => setLog((lines) => [...lines, result.logLine]), 450),
    );
  }

  const denied = trace?.action === "DENY";
  const stageVisible = (index: number) => trace !== null && shown > index;
  const skipped = denied ? 2 : -1;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <TextField label="Domain to look up" value={domain} onChange={setDomain} onEnter={() => send()} />
          <div className="flex flex-wrap gap-2">
            {QUICK.map((name) => (
              <Btn
                key={name}
                className="min-h-8 px-2.5 text-[0.8125rem]"
                onClick={() => {
                  setDomain(name);
                  send(name);
                }}
              >
                {name}
              </Btn>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Segmented
              label="Record type"
              value={qtype}
              onChange={setQtype}
              options={[
                { value: "A", label: "A" },
                { value: "AAAA", label: "AAAA" },
                { value: "PTR", label: "PTR" },
              ]}
            />
            <Segmented
              label="Upstream transport"
              value={mode}
              onChange={setMode}
              options={[
                { value: "udp", label: "UDP :53" },
                { value: "doh", label: "DNS-over-HTTPS" },
              ]}
            />
          </div>
          <Toggle
            label="Also block subdomains of listed names"
            checked={matchSubdomains}
            onChange={setMatchSubdomains}
            hint="My original matched the exact name only, so www.yahoo.co.jp gets through while yahoo.co.jp is blocked."
          />
          <Btn variant="primary" onClick={() => send()}>
            <Send aria-hidden="true" size={16} />
            Send query
          </Btn>
        </div>
        <TextAreaField label="Deny list (one domain per line)" value={deny} onChange={setDeny} rows={6} />
      </div>

      <ol aria-label="Query pipeline" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {STAGES.map((title, index) => {
          const visible = stageVisible(index);
          const isSkipped = index === skipped;
          return (
            <li
              key={title}
              className={`rounded-lg border p-4 transition-opacity duration-300 ${
                visible && !isSkipped ? "border-accent bg-bg" : "border-line bg-bg opacity-60"
              }`}
            >
              <p className="label-mono">
                {index + 1}. {title}
              </p>
              {!trace || !visible ? (
                <p className="mt-2 text-[0.875rem] text-black font-medium">Send a query to see this step.</p>
              ) : index === 0 ? (
                <>
                  <p className="mt-2 whitespace-pre-line font-mono text-[0.75rem]">{describe(trace.queryParsed)}</p>
                  <Pre className="mt-2" label="Query bytes">
                    {hexDump(trace.query)}
                  </Pre>
                </>
              ) : index === 1 ? (
                <>
                  <p className="mt-2 text-[0.9375rem]">
                    <span className={`rounded-sm px-1.5 py-0.5 font-mono text-[0.8125rem] font-semibold ${denied ? "bg-fg text-bg" : "bg-accent text-accent-fg"}`}>
                      {trace.action}
                    </span>{" "}
                    {denied ? "The name is on the deny list. The forwarder answers itself." : "Not on the deny list. The forwarder passes it on."}
                  </p>
                  <p className="mt-2 label-mono">Log line written</p>
                  <Pre className="mt-1">{trace.logLine}</Pre>
                </>
              ) : index === 2 ? (
                isSkipped ? (
                  <p className="mt-2 text-[0.875rem] text-black font-medium">Skipped: a blocked query never leaves the forwarder.</p>
                ) : (
                  <Pre className="mt-2" label="Upstream request">
                    {trace.upstreamRequest}
                  </Pre>
                )
              ) : (
                <>
                  <p className="mt-2 whitespace-pre-line font-mono text-[0.75rem]">{describe(trace.responseParsed)}</p>
                  <Pre className="mt-2" label="Response bytes">
                    {hexDump(trace.response)}
                  </Pre>
                </>
              )}
            </li>
          );
        })}
      </ol>

      <Panel title="queries.log (same format as my original: domain, query type number, action)">
        <Pre label="Query log" className="min-h-16">
          {log.length ? log.join("\n") : "(empty)"}
        </Pre>
        <div className="mt-3 flex flex-wrap gap-2">
          <Btn onClick={() => setLog([...ORIGINAL_LOG])}>Load lines from my original run</Btn>
          <Btn onClick={() => setLog([])}>Clear</Btn>
        </div>
      </Panel>
    </div>
  );
}
