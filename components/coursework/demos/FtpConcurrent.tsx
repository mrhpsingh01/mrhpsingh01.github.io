"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import {
  DEFAULT_CONFIG,
  SCENARIOS,
  locksAt,
  simulate,
  type ClientId,
  type CommandRecord,
  type ScriptEntry,
} from "@/lib/coursework/ftpConcurrent";
import { Btn, Panel, RangeField, Segmented, TextField } from "../ui";

function seconds(ms: number) {
  return `${(ms / 1000).toFixed(1)}s`;
}

function bytesAt(r: CommandRecord, t: number, rate: number): number {
  if (r.grantedAt === null || t <= r.grantedAt) return 0;
  if (r.endedAt !== null && t >= r.endedAt) return r.bytes;
  return Math.min(r.bytes || r.size, (t - r.grantedAt) * rate);
}

export default function FtpConcurrent() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [script, setScript] = useState<ScriptEntry[]>(SCENARIOS[0].script);
  const [kbps, setKbps] = useState(40);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<"1" | "2" | "4">("2");
  const [client, setClient] = useState<ClientId>("A");
  const [command, setCommand] = useState("get report.pdf &");

  const config = useMemo(() => ({ ...DEFAULT_CONFIG, rate: kbps }), [kbps]);
  const result = useMemo(() => simulate(script, config), [script, config]);
  const horizon = Math.max(result.endTime, time + 1000, 4000);
  const scenario = SCENARIOS.find((s) => s.id === scenarioId);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setTime((t) => {
        const next = t + 40 * Number(speed);
        if (next >= result.endTime) {
          setPlaying(false);
          return result.endTime;
        }
        return next;
      });
    }, 40);
    return () => window.clearInterval(timer);
  }, [playing, speed, result.endTime]);

  function pick(id: string) {
    const s = SCENARIOS.find((x) => x.id === id);
    if (!s) return;
    setScenarioId(id);
    setScript(s.script);
    setTime(0);
    setPlaying(true);
  }

  function addCommand() {
    if (!command.trim()) return;
    setScript((s) => [...s, { at: Math.round(time), client, command }]);
    setScenarioId("custom");
    setPlaying(true);
  }

  const locks = locksAt(result, time);
  const x = (ms: number) => `${Math.min(100, (ms / horizon) * 100)}%`;
  const w = (a: number, b: number) => `${Math.max(0.4, ((b - a) / horizon) * 100)}%`;

  // Server files at the current time.
  const files: Record<string, number> = { ...DEFAULT_CONFIG.serverFiles };
  for (const r of result.records) {
    if (r.kind !== "put" || r.endedAt === null || r.endedAt > time) continue;
    if (r.outcome === "done") files[r.file] = r.size;
    if (r.outcome === "terminated") delete files[r.file];
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[0.8125rem] font-medium">Scenario</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {SCENARIOS.map((s) => (
            <Btn
              key={s.id}
              onClick={() => pick(s.id)}
              className={scenarioId === s.id ? "border-accent text-accent" : ""}
            >
              {s.label}
            </Btn>
          ))}
        </div>
        <p className="mt-3 max-w-[70ch] text-[0.9375rem] text-black font-medium">
          {scenario ? scenario.description : "Your own commands, added at the clock's current time."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <RangeField
          label="Transfer speed per connection"
          value={kbps}
          min={10}
          max={120}
          step={10}
          onChange={setKbps}
          format={(v) => `${v} KB/s`}
        />
        <div className="md:col-span-2">
          <form
            className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[auto_1fr_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              addCommand();
            }}
          >
            <Segmented
              label="Client"
              value={client}
              onChange={setClient}
              options={[
                { value: "A", label: "A" },
                { value: "B", label: "B" },
                { value: "C", label: "C" },
              ]}
            />
            <TextField label="Command at the current time (get, put, terminate)" value={command} onChange={setCommand} />
            <Btn type="submit">Send</Btn>
          </form>
          <p className="mt-1 text-[0.75rem] text-black font-medium">
            Files on the server: report.pdf, notes.txt, data.csv. Client files: backup.tar, report.pdf, notes.txt. End a
            command with &amp; to run it in the background.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Btn variant="primary" onClick={() => (playing ? setPlaying(false) : time >= result.endTime ? (setTime(0), setPlaying(true)) : setPlaying(true))}>
          {playing ? <Pause aria-hidden="true" size={16} /> : <Play aria-hidden="true" size={16} />}
          {playing ? "Pause" : time >= result.endTime ? "Replay" : "Play"}
        </Btn>
        <Btn onClick={() => { setPlaying(false); setTime(0); }}>
          <RotateCcw aria-hidden="true" size={16} />
          Reset clock
        </Btn>
        <Btn
          onClick={() => {
            setScript([]);
            setScenarioId("custom");
            setTime(0);
            setPlaying(false);
          }}
        >
          Clear commands
        </Btn>
        <div className="min-w-40">
          <Segmented
            label="Speed"
            value={speed}
            onChange={setSpeed}
            options={[
              { value: "1", label: "1x" },
              { value: "2", label: "2x" },
              { value: "4", label: "4x" },
            ]}
          />
        </div>
        <p className="font-mono text-[0.8125rem] text-black font-semibold" role="status">
          virtual time {seconds(time)}
        </p>
      </div>
      <div>
        <RangeField label="Clock" value={Math.round(time)} min={0} max={Math.round(horizon)} step={20} onChange={(v) => { setPlaying(false); setTime(v); }} format={(v) => seconds(v)} />
      </div>

      <Panel title="Timeline: one row per command">
        {result.records.length === 0 ? (
          <p className="text-black font-medium">No commands yet. Choose a scenario or send one.</p>
        ) : (
          <ol aria-label="Command timeline" className="space-y-2.5">
            {result.records.map((r, i) => {
              const started = r.issuedAt <= time;
              const isTransfer = r.kind === "get" || r.kind === "put";
              const waitStop =
                r.grantedAt !== null ? Math.min(r.grantedAt, time) : r.endedAt !== null ? Math.min(r.endedAt, time) : time;
              const label = `${r.id ? `#${r.id}` : "-"} ${r.client}: ${r.line}`;
              const state =
                !started ? "not sent yet" : r.endedAt !== null && r.endedAt <= time ? r.outcome : r.grantedAt !== null && r.grantedAt <= time ? "transferring" : r.kind === "get" || r.kind === "put" ? "waiting for lock" : r.outcome;
              const progress = r.size ? Math.round((bytesAt(r, time, kbps) / r.size) * 100) : 0;
              return (
                <li key={i} className="grid grid-cols-1 items-center gap-x-3 gap-y-1 md:grid-cols-[13rem_minmax(0,1fr)_9rem]">
                  <span className="truncate font-mono text-[0.75rem]" title={label}>
                    {label}
                  </span>
                  <div className="relative h-5 overflow-hidden rounded-sm bg-line/40">
                    {started && isTransfer && waitStop > r.issuedAt + 1 ? (
                      <div
                        className="absolute inset-y-0 border-y border-dashed border-line-strong bg-line"
                        style={{ left: x(r.issuedAt), width: w(r.issuedAt, waitStop) }}
                        aria-hidden="true"
                      />
                    ) : null}
                    {started && !isTransfer ? (
                      <div className="absolute inset-y-0 w-1 bg-fg" style={{ left: x(r.issuedAt) }} aria-hidden="true" />
                    ) : null}
                    {started && r.grantedAt !== null && r.grantedAt <= time ? (
                      <div
                        className={`absolute inset-y-0 ${r.outcome === "terminated" && r.endedAt !== null && r.endedAt <= time ? "bg-fg" : "bg-accent"}`}
                        style={{ left: x(r.grantedAt), width: w(r.grantedAt, Math.max(r.grantedAt + 1, Math.min(r.endedAt ?? time, time))) }}
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="absolute inset-y-0 w-px bg-fg" style={{ left: x(time) }} aria-hidden="true" />
                  </div>
                  <span className="text-[0.8125rem] text-black font-medium">
                    {state}
                    {state === "transferring" ? ` ${progress}%` : ""}
                  </span>
                  {r.note && r.endedAt !== null && r.endedAt <= time ? (
                    <span className="text-[0.75rem] text-black font-medium md:col-start-2 md:col-span-2">{r.note}</span>
                  ) : null}
                </li>
              );
            })}
          </ol>
        )}
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[0.8125rem] text-black font-medium">
          <li><span className="mr-1.5 inline-block h-2.5 w-5 border-y border-dashed border-line-strong bg-line align-middle" />waiting for the lock</li>
          <li><span className="mr-1.5 inline-block h-2.5 w-5 bg-accent align-middle" />transferring</li>
          <li><span className="mr-1.5 inline-block h-2.5 w-5 bg-fg align-middle" />terminated</li>
        </ul>
      </Panel>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Panel title="Lock table at this moment">
          {locks.length === 0 ? (
            <p className="text-[0.875rem] text-black font-medium">No locks held or waited for.</p>
          ) : (
            <ul className="space-y-3 font-mono text-[0.8125rem]">
              {locks.map((l) => (
                <li key={l.file}>
                  <p className="font-semibold">{l.file}</p>
                  <p className="text-black">
                    read lock: {l.readers.length ? l.readers.map((id) => `#${id}`).join(", ") : "none"}
                  </p>
                  <p className="text-black">write lock: {l.writer ? `#${l.writer}` : "none"}</p>
                  <p className="text-black">
                    waiting: {l.waiting.length ? l.waiting.map((q) => `#${q.id} (${q.mode})`).join(", ") : "nobody"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Files on the server now">
          <ul className="space-y-1 font-mono text-[0.8125rem]">
            {Object.entries(files).map(([name, size]) => (
              <li key={name}>
                {name} <span className="text-black font-semibold">{size.toLocaleString("en-US")} B</span>
              </li>
            ))}
            {Object.keys(files).length === 0 ? <li className="text-black">(empty)</li> : null}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
