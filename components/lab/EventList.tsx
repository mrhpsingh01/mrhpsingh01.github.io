"use client";

import { useEffect, useRef } from "react";
import { events } from "@/lib/sensor-demo/dataset";
import { formatTime } from "@/lib/sensor-demo/representations";

/** Selectable event log. The current row is marked with aria-current and kept in view inside the list only. */
export function EventList({ index, onSelect }: { index: number; onSelect: (index: number) => void }) {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const row = list?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!list || !row) return;
    // Scroll only the list container, never the page.
    const top = row.offsetTop - list.offsetTop - list.clientHeight / 2 + row.clientHeight / 2;
    list.scrollTo({ top: Math.max(0, top), behavior: "auto" });
  }, [index]);

  return (
    <ol
      ref={listRef}
      aria-label="Synthetic sensor events"
      className="max-h-[22rem] overflow-y-auto rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs divide-y divide-slate-100 dark:divide-zinc-800"
    >
      {events.map((event, i) => {
        const current = i === index;
        return (
          <li key={`${event.time}-${event.sensor}-${event.state}`}>
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-current={current ? "true" : undefined}
              className={`grid min-h-10 w-full grid-cols-[2rem_5.5rem_1fr] items-center gap-2 px-3 py-2 text-left font-mono text-xs transition-colors duration-150 cursor-pointer ${
                current
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border-l-3 border-indigo-600"
                  : "text-secondary hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-foreground"
              }`}
            >
              <span className="text-secondary/70">{String(i + 1).padStart(2, "0")}</span>
              <span>{formatTime(event.time)}</span>
              <span className={current ? "font-bold text-foreground" : ""}>
                {event.sensor} {event.state}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
