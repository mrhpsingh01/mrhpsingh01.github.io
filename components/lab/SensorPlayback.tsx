"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { events, sensorById } from "@/lib/sensor-demo/dataset";
import { formatTime, inferredPath, sensorStatesAt, zoneName } from "@/lib/sensor-demo/representations";
import { EventList } from "./EventList";
import { FloorplanView } from "./FloorplanView";
import { PlaybackControls, type Speed } from "./PlaybackControls";
import { RepresentationPanel } from "./RepresentationPanel";

const BASE_INTERVAL_MS = 1100;
const LAST = events.length - 1;

export function SensorPlayback() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<Speed>(1);
  const [showPath, setShowPath] = useState(true);

  // Playback stops by itself on the last event: derived, so no state is set from an effect.
  const isPlaying = playing && index < LAST;

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setIndex((value) => Math.min(LAST, value + 1));
    }, BASE_INTERVAL_MS / speed);
    return () => window.clearInterval(timer);
  }, [isPlaying, speed]);

  const select = useCallback((next: number) => {
    setIndex(Math.min(LAST, Math.max(0, next)));
  }, []);

  const current = { ...events[index], index };
  const sensor = sensorById.get(current.sensor);
  const states = useMemo(() => sensorStatesAt(index), [index]);
  const path = useMemo(() => inferredPath(index), [index]);

  const summary = `Event ${index + 1} of ${events.length}: ${formatTime(current.time)}, ${current.sensor} ${current.state}`;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-4 lg:col-span-7">
          <FloorplanView states={states} current={current} path={path} showPath={showPath} />
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-secondary">
            <ul className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Floor plan legend">
              <li className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-indigo-600 inline-block" />
                <span>Active (ON/open)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full border border-slate-700 dark:border-slate-300 inline-block" />
                <span>Inactive</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full ring-2 ring-indigo-600 inline-block" />
                <span>Current event</span>
              </li>
            </ul>
            <label className="flex cursor-pointer items-center gap-2 font-medium">
              <input
                type="checkbox"
                checked={showPath}
                onChange={(event) => setShowPath(event.target.checked)}
                className="size-4 accent-indigo-600 cursor-pointer"
              />
              Show inferred path
            </label>
          </div>
          {showPath ? (
            <p className="max-w-[62ch] text-xs text-secondary leading-relaxed">
              The dashed line is an <strong className="font-semibold text-foreground">inferred path</strong> joining the last
              few motion activations. It is a spatial trajectory estimate between sensor positions, not continuous camera tracking.
            </p>
          ) : null}
        </div>

        <div className="space-y-5 lg:col-span-5">
          <div
            role="status"
            aria-live={isPlaying ? "off" : "polite"}
            className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-2xs"
          >
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-secondary">Current event (synthetic)</p>
            <dl className="mt-3 grid grid-cols-[6.5rem_1fr] gap-x-4 gap-y-2 text-xs sm:text-sm">
              <dt className="text-secondary font-medium">Timestamp</dt>
              <dd className="font-mono font-semibold text-foreground">{formatTime(current.time)}</dd>
              <dt className="text-secondary font-medium">Sensor</dt>
              <dd className="font-mono font-semibold text-foreground">
                {current.sensor}
                {sensor ? (
                  <span className="font-sans font-normal text-secondary">
                    {" "}
                    ({sensor.label}, {zoneName(sensor.zone)})
                  </span>
                ) : null}
              </dd>
              <dt className="text-secondary font-medium">State</dt>
              <dd className="font-mono font-semibold text-foreground">{current.state}</dd>
              <dt className="text-secondary font-medium">Annotation</dt>
              <dd>
                <span className="font-semibold text-foreground">{current.annotation}</span>
                <span className="block text-[11px] text-secondary mt-0.5">
                  Hand-written label for this synthetic day (not model prediction).
                </span>
              </dd>
            </dl>
          </div>

          <PlaybackControls
            playing={isPlaying}
            speed={speed}
            atStart={index === 0}
            atEnd={index === LAST}
            onTogglePlay={() => {
              if (isPlaying) {
                setPlaying(false);
                return;
              }
              if (index === LAST) setIndex(0);
              setPlaying(true);
            }}
            onRestart={() => {
              setPlaying(false);
              setIndex(0);
            }}
            onStep={(delta) => {
              setPlaying(false);
              select(index + delta);
            }}
            onSpeed={setSpeed}
          />

          <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <label htmlFor="timeline" className="font-mono text-xs font-bold uppercase tracking-wider text-secondary block">
                Timeline Scrubber
              </label>
              <span className="font-mono text-xs font-semibold text-foreground">{summary}</span>
            </div>
            <input
              id="timeline"
              type="range"
              min={0}
              max={LAST}
              step={1}
              value={index}
              aria-valuetext={summary}
              onChange={(event) => {
                setPlaying(false);
                select(Number(event.target.value));
              }}
              className="mt-2.5 h-2 w-full accent-indigo-600 rounded-lg cursor-pointer bg-slate-200 dark:bg-zinc-700"
            />
            <div className="flex justify-between font-mono text-[11px] text-secondary mt-1.5">
              <span>{formatTime(events[0].time)}</span>
              <span>{formatTime(events[LAST].time)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8 pt-2">
        <div className="lg:col-span-4">
          <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">Events Stream</h3>
          <p className="mb-3 mt-1 text-xs text-secondary">Click any event row to jump to that timestamp.</p>
          <EventList
            index={index}
            onSelect={(next) => {
              setPlaying(false);
              select(next);
            }}
          />
        </div>
        <div className="min-w-0 lg:col-span-8">
          <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">Four Views of the Same Event Window</h3>
          <p className="mb-3 mt-1 text-xs text-secondary">
            The window is the last 8 events up to the current one. All four views are computed from it in real-time.
          </p>
          <RepresentationPanel index={index} />
        </div>
      </div>
    </div>
  );
}
