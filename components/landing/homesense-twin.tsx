"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";
import {
  FLOORPLAN,
  events,
  isActivation,
  sensorById,
  sensors,
  zones,
} from "@/lib/sensor-demo/dataset";
import { formatTime, sensorStatesAt, zoneName } from "@/lib/sensor-demo/representations";
import { cn } from "@/lib/utils";

const STEP_MS = 1150;
const STATIC_FRAME = 12;

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
function subscribeReduced(callback: () => void) {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function residentPosition(index: number) {
  for (let i = index; i >= 0; i -= 1) {
    if (isActivation(events[i].state)) {
      const sensor = sensorById.get(events[i].sensor);
      if (sensor) return { x: sensor.kind === "door" ? sensor.x + 24 : sensor.x, y: sensor.y };
    }
  }
  const first = sensors[0];
  return { x: first.x, y: first.y };
}

export function HomeSenseTwin() {
  const reduced = useSyncExternalStore(
    subscribeReduced,
    () => (typeof window !== "undefined" ? window.matchMedia(reducedMotionQuery).matches : false),
    () => false,
  );
  const [index, setIndex] = useState(STATIC_FRAME);
  const [userPaused, setUserPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  const running = !reduced && !userPaused && visible;

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(element);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % events.length);
    }, STEP_MS);
    return () => window.clearInterval(timer);
  }, [running]);

  const states = sensorStatesAt(index);
  const resident = residentPosition(index);
  const current = events[index];
  const recent = Array.from({ length: 4 }, (_, k) => index - k)
    .filter((i) => i >= 0)
    .map((i) => ({ i, event: events[i] }));

  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      {/* Outer Card with modern glassmorphism matching the portfolio */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/85 shadow-sm backdrop-blur-md ring-1 ring-border/40"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
            </span>
            <p className="font-mono text-xs font-semibold text-foreground">
              Synthetic Day &middot; Digital Twin
            </p>
          </div>
          <button
            type="button"
            onClick={() => setUserPaused((value) => !value)}
            aria-pressed={!running}
            aria-label={running ? "Pause animation" : "Play animation"}
            className="inline-flex size-7 items-center justify-center rounded-lg border border-border bg-background/80 text-secondary transition-all hover:bg-muted hover:text-foreground active:scale-95"
          >
            {running ? (
              <Pause className="size-3.5 fill-current" />
            ) : (
              <Play className="size-3.5 fill-current ml-0.5" />
            )}
          </button>
        </div>

        {/* Floor plan SVG */}
        <div className="p-3 sm:p-4">
          <svg
            viewBox={`0 0 ${FLOORPLAN.width} ${FLOORPLAN.height}`}
            role="img"
            aria-label="Apartment floor plan simulation where resident navigates between rooms"
            className="block h-auto w-full rounded-xl overflow-hidden border border-border/40 bg-background/50 shadow-inner"
          >
            {/* Zones */}
            {zones.map((zone, i) => (
              <g key={zone.id}>
                <rect
                  x={zone.x}
                  y={zone.y}
                  width={zone.width}
                  height={zone.height}
                  fill={i % 2 === 0 ? "color-mix(in srgb, var(--accent) 3%, var(--card))" : "var(--card)"}
                  stroke="var(--border)"
                  strokeWidth={1.5}
                />
                <text
                  x={zone.x + 12}
                  y={zone.y + 24}
                  fontSize={13}
                  fontFamily="var(--font-sans), system-ui, sans-serif"
                  fontWeight={600}
                  fill="var(--secondary)"
                  className="select-none tracking-wide"
                >
                  {zone.name}
                </text>
              </g>
            ))}

            {/* Sensors */}
            {sensors.map((sensor) => {
              const active = states[sensor.id];
              return (
                <g key={sensor.id}>
                  {active && (
                    <circle
                      cx={sensor.x}
                      cy={sensor.y}
                      r={14}
                      fill="var(--accent)"
                      fillOpacity={0.25}
                      className="animate-pulse"
                    />
                  )}
                  {sensor.kind === "motion" ? (
                    <circle
                      cx={sensor.x}
                      cy={sensor.y}
                      r={8}
                      fill={active ? "var(--accent)" : "var(--card)"}
                      stroke={active ? "var(--accent)" : "var(--border)"}
                      strokeWidth={1.5}
                      className="transition-colors duration-300"
                    />
                  ) : (
                    <rect
                      x={sensor.x - 4}
                      y={sensor.y - 16}
                      width={8}
                      height={32}
                      rx={3}
                      fill={active ? "var(--accent)" : "var(--card)"}
                      stroke={active ? "var(--accent)" : "var(--border)"}
                      strokeWidth={1.5}
                      className="transition-colors duration-300"
                    />
                  )}
                </g>
              );
            })}

            {/* Resident Marker with smooth CSS movement */}
            <g
              style={{
                transform: `translate(${resident.x}px, ${resident.y}px)`,
                transition: reduced ? "none" : "transform 0.95s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <circle r={20} fill="var(--accent)" fillOpacity={0.2} className="animate-pulse" />
              <circle
                r={8}
                fill="var(--accent)"
                stroke="var(--card)"
                strokeWidth={2.5}
              />
            </g>
          </svg>
        </div>

        {/* Live Telemetry Feed */}
        <div className="border-t border-border/60 bg-muted/20 px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
              Telemetry Stream
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Kafka Live
            </span>
          </div>

          <ul aria-label="Recent events" className="space-y-1">
            {recent.map(({ i, event }, row) => (
              <li
                key={i}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2 py-1 font-mono text-xs transition-colors",
                  row === 0
                    ? "bg-accent/10 text-foreground font-semibold"
                    : "text-secondary hover:bg-muted/40"
                )}
              >
                <span className="text-secondary/80">{formatTime(event.time)}</span>
                <span className="rounded bg-background px-1.5 py-0.5 text-[11px] font-bold text-foreground border border-border/60">
                  {event.sensor}
                </span>
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                    event.state === "ON" || event.state === "OPEN"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-muted text-secondary border border-border/40"
                  )}
                >
                  {event.state}
                </span>
                <span className="truncate font-sans text-xs font-medium text-secondary ml-auto">
                  {zoneName(sensorById.get(event.sensor)?.zone ?? "")}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2.5 font-mono text-[11px] text-secondary/80">
            Synthetic illustration &middot; Current timestamp: {formatTime(current.time)}.
          </p>
        </div>
      </div>

      {/* Floating Status Pill matching portfolio tokens */}
      <div className="absolute -bottom-3 right-4 z-20 flex items-center gap-2 rounded-full border border-border/80 bg-background/95 px-3.5 py-1.5 shadow-md backdrop-blur-md ring-1 ring-border/40 select-none">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex size-2 rounded-full bg-accent"></span>
        </span>
        <span className="font-mono text-[11px] text-secondary">Interactive:</span>
        <span className="text-xs font-semibold text-foreground">Digital Twin</span>
      </div>
    </div>
  );
}
