"use client";

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";

export const SPEEDS = [0.5, 1, 2, 4] as const;
export type Speed = (typeof SPEEDS)[number];

interface PlaybackControlsProps {
  playing: boolean;
  speed: Speed;
  atStart: boolean;
  atEnd: boolean;
  onTogglePlay: () => void;
  onRestart: () => void;
  onStep: (delta: 1 | -1) => void;
  onSpeed: (speed: Speed) => void;
}

const button =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 text-xs sm:text-sm font-semibold text-foreground transition-colors hover:bg-slate-100 dark:hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 shadow-2xs";

export function PlaybackControls({
  playing,
  speed,
  atStart,
  atEnd,
  onTogglePlay,
  onRestart,
  onStep,
  onSpeed,
}: PlaybackControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        type="button"
        onClick={onTogglePlay}
        className="inline-flex min-h-10 min-w-28 items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 text-xs sm:text-sm font-semibold text-white shadow-xs transition-colors"
      >
        {playing ? <Pause aria-hidden="true" size={16} /> : <Play aria-hidden="true" size={16} />}
        {playing ? "Pause" : atEnd ? "Replay" : "Play"}
      </button>
      <button type="button" onClick={onRestart} className={button}>
        <RotateCcw aria-hidden="true" size={15} />
        Restart
      </button>
      <button
        type="button"
        onClick={() => onStep(-1)}
        disabled={atStart}
        className={button}
        aria-label="Previous event"
      >
        <SkipBack aria-hidden="true" size={15} />
      </button>
      <button type="button" onClick={() => onStep(1)} disabled={atEnd} className={button} aria-label="Next event">
        <SkipForward aria-hidden="true" size={15} />
      </button>

      <fieldset className="flex items-center gap-1 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/70 p-1">
        <legend className="sr-only">Playback speed</legend>
        {SPEEDS.map((value) => (
          <label key={value} className="relative">
            <input
              type="radio"
              name="playback-speed"
              value={value}
              checked={speed === value}
              onChange={() => onSpeed(value)}
              className="peer sr-only"
            />
            <span className="inline-flex min-h-8 min-w-10 cursor-pointer items-center justify-center rounded-md px-2 font-mono text-xs font-semibold text-secondary transition-colors hover:text-foreground peer-checked:bg-indigo-600 peer-checked:text-white">
              {value}x
            </span>
          </label>
        ))}
      </fieldset>
    </div>
  );
}
