"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { MAX_ATTEMPTS, sampleAt, simulate, type PartState, type SimParams } from "@/lib/coursework/downloader";
import { Btn, Panel, RangeField, Segmented, Stat } from "../ui";

const MB = 1_000_000;

function formatMs(ms: number) {
  return `${(ms / 1000).toFixed(1)} s`;
}

const stateLabel: Record<PartState, string> = {
  waiting: "waiting",
  connecting: "connecting (TCP + TLS)",
  retrying: "retrying",
  downloading: "downloading",
  done: "done",
  failed: "failed",
};

export default function HttpsDownloader() {
  const [sizeMb, setSizeMb] = useState(48);
  const [parts, setParts] = useState(6);
  const [perConn, setPerConn] = useState(2);
  const [cap, setCap] = useState(12);
  const [failure, setFailure] = useState(0);
  const [seed, setSeed] = useState(7);
  const [speed, setSpeed] = useState<"1" | "4" | "16">("4");
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);

  const params: SimParams = useMemo(
    () => ({
      fileSize: sizeMb * MB,
      parts,
      perConnection: perConn * MB,
      serverCap: cap * MB,
      failureRate: failure / 100,
      seed,
    }),
    [sizeMb, parts, perConn, cap, failure, seed],
  );
  const result = useMemo(() => simulate(params), [params]);
  const single = useMemo(() => simulate({ ...params, parts: 1 }), [params]);

  const end = result.reassembledAt ?? result.transfersDoneAt;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setTime((t) => {
        const next = t + 40 * Number(speed);
        if (next >= end) {
          setPlaying(false);
          return end;
        }
        return next;
      });
    }, 40);
    return () => window.clearInterval(timer);
  }, [playing, speed, end]);

  function restart() {
    setTime(0);
    setPlaying(true);
  }

  const events = result.events.filter((e) => e.t <= time);
  const downloaded = result.parts.reduce((sum, _, i) => sum + sampleAt(result, i, time).downloaded, 0);
  const speedup = result.failedParts.length === 0 && single.failedParts.length === 0 ? single.transfersDoneAt / result.transfersDoneAt : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <RangeField label="File size" value={sizeMb} min={8} max={200} step={4} onChange={(v) => { setSizeMb(v); setTime(0); }} format={(v) => `${v} MB`} />
        <RangeField label="Parts (threads)" value={parts} min={1} max={16} onChange={(v) => { setParts(v); setTime(0); }} />
        <RangeField
          label="Connection failure rate"
          value={failure}
          min={0}
          max={90}
          step={5}
          onChange={(v) => { setFailure(v); setTime(0); }}
          format={(v) => `${v}%`}
          hint={`Each part gets ${MAX_ATTEMPTS} attempts, like MAX_RETRIES in my C code.`}
        />
        <RangeField label="Speed of one connection" value={perConn} min={1} max={6} onChange={(v) => { setPerConn(v); setTime(0); }} format={(v) => `${v} MB/s`} />
        <RangeField label="Server's total limit" value={cap} min={2} max={40} onChange={(v) => { setCap(v); setTime(0); }} format={(v) => `${v} MB/s`} />
        <RangeField label="Seed" value={seed} min={1} max={50} onChange={(v) => { setSeed(v); setTime(0); }} hint="Changes which attempts fail and how fast each thread is." />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Btn variant="primary" onClick={() => (playing ? setPlaying(false) : time >= end ? restart() : setPlaying(true))}>
          {playing ? <Pause aria-hidden="true" size={16} /> : <Play aria-hidden="true" size={16} />}
          {playing ? "Pause" : time >= end ? "Replay" : time > 0 ? "Resume" : "Start download"}
        </Btn>
        <Btn onClick={() => { setPlaying(false); setTime(0); }}>
          <RotateCcw aria-hidden="true" size={16} />
          Reset
        </Btn>
        <div className="min-w-44">
          <Segmented
            label="Playback speed"
            value={speed}
            onChange={setSpeed}
            options={[
              { value: "1", label: "1x" },
              { value: "4", label: "4x" },
              { value: "16", label: "16x" },
            ]}
          />
        </div>
        <p className="font-mono text-[0.8125rem] text-black font-semibold" role="status">
          virtual time {formatMs(time)} of {formatMs(end)}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Downloaded so far" value={`${(downloaded / MB).toFixed(1)} of ${sizeMb} MB`} />
        <Stat label={`${parts} ${parts === 1 ? "thread" : "threads"}`} value={formatMs(result.transfersDoneAt)} note="until the last part finishes" />
        <Stat label="One connection" value={formatMs(single.transfersDoneAt)} note={single.failedParts.length ? "its one part failed" : "same simulated server"} />
        <Stat
          label="Result"
          value={result.failedParts.length ? "gap" : speedup ? `${speedup.toFixed(1)}x faster` : "n/a"}
          note={result.failedParts.length ? `part ${result.failedParts.join(", ")} failed, reassembly stops` : time >= end ? `${result.assembledBytes} bytes reassembled` : "illustrative, simulated"}
        />
      </div>

      <Panel title="Threads and the Range header each one sends">
        <ul className="space-y-2.5">
          {result.parts.map((part, i) => {
            const s = sampleAt(result, i, time);
            const fraction = s.downloaded / part.bytes;
            const label =
              s.state === "connecting" && s.attempt > 1 ? `retrying (attempt ${s.attempt} of ${MAX_ATTEMPTS})` : stateLabel[s.state];
            return (
              <li key={part.part} className="grid grid-cols-1 items-center gap-x-4 gap-y-1 sm:grid-cols-[4.5rem_minmax(0,1fr)_12rem]">
                <span className="font-mono text-[0.8125rem]">thread {part.part}</span>
                <div
                  role="progressbar"
                  aria-label={`Thread ${part.part}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(fraction * 100)}
                  className="h-3 overflow-hidden rounded-sm bg-line"
                >
                  <div
                    className={`h-full ${s.state === "failed" ? "bg-fg" : "bg-accent"}`}
                    style={{ width: `${Math.round(fraction * 100)}%` }}
                  />
                </div>
                <span className="text-[0.8125rem] text-black font-medium">
                  {label}
                  {s.state === "downloading" ? ` ${Math.round(fraction * 100)}%` : ""}
                </span>
                <span className="font-mono text-[0.6875rem] text-black font-semibold sm:col-start-2 sm:col-span-2">{part.rangeHeader}</span>
              </li>
            );
          })}
        </ul>
      </Panel>

      <Panel title="Event log">
        <ol aria-label="Download events" className="max-h-56 space-y-1 overflow-y-auto font-mono text-[0.75rem]">
          {events.length === 0 ? <li className="text-black font-medium">Press Start download.</li> : null}
          {events.map((event, i) => (
            <li key={i} className={event.text.includes("failed") || event.text.includes("stops") ? "text-red-600 font-semibold" : "text-black font-medium"}>
              <span className="mr-3 text-black font-semibold">{formatMs(event.t)}</span>
              {event.text}
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  );
}
