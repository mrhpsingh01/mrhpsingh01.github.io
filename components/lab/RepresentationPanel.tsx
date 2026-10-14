"use client";

import { useId, useMemo, useRef, useState } from "react";
import { FLOORPLAN, zones } from "@/lib/sensor-demo/dataset";
import {
  GRID,
  RASTER_CHANNELS,
  getWindow,
  graphView,
  rasterView,
  sequenceView,
  textView,
  type RasterChannel,
} from "@/lib/sensor-demo/representations";

const TABS = [
  {
    id: "sequence",
    label: "Sequence",
    blurb:
      "Each event in the window becomes a row of numbers, in time order. A transformer reads this to see order and timing.",
  },
  {
    id: "text",
    label: "Text",
    blurb:
      "Fixed rules turn the window into a short summary of when, where and how fast. The same window always gives the same text.",
  },
  {
    id: "raster",
    label: "Raster",
    blurb:
      "Activations are blurred onto a grid over the floor plan, like a heat map, which shows where activity happened.",
  },
  {
    id: "graph",
    label: "Graph",
    blurb:
      "Events are nodes linked in time order, to later events from the same sensor, and to the physical sensor they came from.",
  },
] as const;
type TabId = (typeof TABS)[number]["id"];

function fixed(value: number, digits = 2) {
  return value.toFixed(digits);
}

function SequenceTable({ index }: { index: number }) {
  const rows = useMemo(() => sequenceView(getWindow(index)), [index]);
  return (
    <div
      role="region"
      aria-label="Sequence features (scrollable table)"
      tabIndex={0}
      className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs"
    >
      <table className="w-full min-w-[34rem] border-collapse text-left font-mono text-xs">
        <caption className="sr-only">Per-event features for the current window</caption>
        <thead>
          <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/80 text-secondary">
            <th scope="col" className="px-3 py-2.5 font-semibold">
              event
            </th>
            <th scope="col" className="px-3 py-2.5 font-semibold">
              sensor
            </th>
            <th scope="col" className="px-3 py-2.5 font-semibold">
              state
            </th>
            <th scope="col" className="px-3 py-2.5 font-semibold">
              time in window
            </th>
            <th scope="col" className="px-3 py-2.5 font-semibold">
              log gap
            </th>
            <th scope="col" className="px-3 py-2.5 font-semibold">
              hour sin / cos
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
          {rows.map((row) => (
            <tr
              key={row.index}
              className={`transition-colors ${row.index === index ? "bg-indigo-50/80 dark:bg-indigo-950/60 font-semibold text-indigo-700 dark:text-indigo-300" : "text-foreground"}`}
            >
              <td className="px-3 py-2">{row.index + 1}</td>
              <td className="px-3 py-2">{row.sensor}</td>
              <td className="px-3 py-2">{row.state}</td>
              <td className="px-3 py-2">{fixed(row.timeNorm)}</td>
              <td className="px-3 py-2">{fixed(row.logGap)}</td>
              <td className="px-3 py-2">
                {fixed(row.hourSin)} / {fixed(row.hourCos)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TextSummary({ index }: { index: number }) {
  const view = useMemo(() => textView(getWindow(index)), [index]);
  return (
    <div className="space-y-4">
      <ul aria-label="Summary tokens" className="flex flex-wrap gap-2">
        {view.tokens.map((token, i) => (
          <li
            key={`${token.kind}-${token.value}-${i}`}
            className="rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 shadow-2xs"
          >
            <span className="block font-mono text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400">{token.kind}</span>
            <span className="font-mono text-xs sm:text-sm font-semibold text-foreground">{token.value}</span>
          </li>
        ))}
      </ul>
      <div>
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary">Text passed to the text encoder</p>
        <p className="mt-1.5 break-words rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/70 p-3.5 font-mono text-xs sm:text-sm text-foreground">
          {view.text}
        </p>
      </div>
    </div>
  );
}

function RasterGrid({ index }: { index: number }) {
  const [channel, setChannel] = useState<RasterChannel>("activation");
  const view = useMemo(() => rasterView(getWindow(index)), [index]);
  const name = useId();
  const { cells, max } = view[channel];
  const cellW = FLOORPLAN.width / GRID.columns;
  const cellH = FLOORPLAN.height / GRID.rows;

  return (
    <div>
      <fieldset className="mb-4 flex flex-wrap items-center gap-1.5">
        <legend className="sr-only">Raster channel</legend>
        {RASTER_CHANNELS.map((value) => (
          <label key={value} className="relative">
            <input
              type="radio"
              name={`raster-${name}`}
              checked={channel === value}
              onChange={() => setChannel(value)}
              className="peer sr-only"
            />
            <span className="inline-flex min-h-8 cursor-pointer items-center rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 font-mono text-xs font-semibold text-secondary transition-colors hover:text-foreground peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white shadow-2xs">
              {value}
            </span>
          </label>
        ))}
      </fieldset>
      <svg
        viewBox={`0 0 ${FLOORPLAN.width} ${FLOORPLAN.height}`}
        role="img"
        aria-label={`Raster of the ${channel} channel: ${GRID.columns} by ${GRID.rows} grid, darker cells are closer to recent sensor activations`}
        className="h-auto w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs"
      >
        {zones.map((zone) => (
          <rect
            key={zone.id}
            x={zone.x}
            y={zone.y}
            width={zone.width}
            height={zone.height}
            className="fill-slate-50/40 dark:fill-zinc-800/20 stroke-slate-300 dark:stroke-zinc-700"
            strokeWidth={2}
          />
        ))}
        {cells.flatMap((row, r) =>
          row.map((value, c) =>
            max > 0 && value / max > 0.02 ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellW}
                y={r * cellH}
                width={cellW}
                height={cellH}
                className="fill-indigo-600"
                fillOpacity={Math.min(1, value / max) * 0.9}
              />
            ) : null,
          ),
        )}
      </svg>
      <p className="mt-2 text-xs sm:text-sm text-secondary">
        {max === 0
          ? "No activations in this channel for the current window."
          : "Only ON and OPEN events add to the raster."}
      </p>
    </div>
  );
}

function GraphDiagram({ index }: { index: number }) {
  const graph = useMemo(() => graphView(getWindow(index)), [index]);
  const width = 640;
  const eventY = 150;
  const sensorY = 280;
  const n = graph.eventNodes.length;
  const eventX = (i: number) => (n <= 1 ? width / 2 : 40 + (i * (width - 80)) / (n - 1));
  const sensorX = new Map(
    graph.sensorNodes.map((node, i) => [node.id, 50 + (i * (width - 100)) / Math.max(1, graph.sensorNodes.length - 1)]),
  );
  const eventPos = new Map(graph.eventNodes.map((node, i) => [node.id, eventX(i)]));
  const counts = {
    sequential: graph.edges.filter((edge) => edge.kind === "sequential").length,
    same: graph.edges.filter((edge) => edge.kind === "same sensor").length,
    link: graph.edges.filter((edge) => edge.kind === "event to sensor").length,
  };

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} 330`}
        role="img"
        aria-label={`Event graph with ${graph.eventNodes.length} event nodes, ${graph.sensorNodes.length} sensor nodes, ${counts.sequential} sequential edges, ${counts.same} same-sensor edges and ${counts.link} event-to-sensor edges`}
        className="h-auto w-full rounded-lg border border-line bg-surface"
      >
        {graph.edges
          .filter((edge) => edge.kind === "event to sensor")
          .map((edge) => (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={eventPos.get(edge.from)}
              y1={eventY + 16}
              x2={sensorX.get(edge.to)}
              y2={sensorY - 18}
              className="stroke-line-strong"
              strokeWidth={1}
            />
          ))}
        {graph.edges
          .filter((edge) => edge.kind === "same sensor")
          .map((edge) => {
            const x1 = eventPos.get(edge.from) ?? 0;
            const x2 = eventPos.get(edge.to) ?? 0;
            const mid = (x1 + x2) / 2;
            const lift = Math.min(80, 24 + Math.abs(x2 - x1) / 3);
            return (
              <path
                key={`${edge.from}-${edge.to}`}
                d={`M ${x1} ${eventY - 16} Q ${mid} ${eventY - 16 - lift * 1.6} ${x2} ${eventY - 16}`}
                fill="none"
                className="stroke-accent"
                strokeWidth={2}
                strokeDasharray="6 4"
              />
            );
          })}
        {graph.edges
          .filter((edge) => edge.kind === "sequential")
          .map((edge) => (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={(eventPos.get(edge.from) ?? 0) + 16}
              y1={eventY}
              x2={(eventPos.get(edge.to) ?? 0) - 16}
              y2={eventY}
              className="stroke-fg"
              strokeWidth={2}
            />
          ))}
        {graph.eventNodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={eventPos.get(node.id)}
              cy={eventY}
              r={18}
              className={node.index === index ? "fill-indigo-600 stroke-indigo-600" : "fill-white dark:fill-zinc-800 stroke-slate-700 dark:stroke-slate-300"}
              strokeWidth={2}
            />
            <text
              x={eventPos.get(node.id)}
              y={eventY + 4}
              textAnchor="middle"
              fontSize={15}
              fontWeight={700}
              className={node.index === index ? "fill-white" : "fill-slate-800 dark:fill-white"}
            >
              {node.index + 1}
            </text>
          </g>
        ))}
        {graph.sensorNodes.map((node) => (
          <g key={node.id}>
            <rect
              x={(sensorX.get(node.id) ?? 0) - 24}
              y={sensorY - 18}
              width={48}
              height={36}
              rx={6}
              className="fill-slate-100 dark:fill-zinc-800 stroke-slate-300 dark:stroke-zinc-700"
              strokeWidth={1.5}
            />
            <text
              x={sensorX.get(node.id)}
              y={sensorY + 5}
              textAnchor="middle"
              fontSize={15}
              fontWeight={600}
              className="fill-slate-800 dark:fill-slate-200 font-mono"
            >
              {node.id}
            </text>
          </g>
        ))}
        <text x={12} y={26} fontSize={14} className="fill-slate-600 dark:fill-slate-400 font-mono font-medium">
          event nodes (numbered as in the event list)
        </text>
        <text x={12} y={322} fontSize={14} className="fill-slate-600 dark:fill-slate-400 font-mono font-medium">
          sensor nodes
        </text>
      </svg>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-secondary font-medium">
        <li>Solid line: next event in time ({counts.sequential})</li>
        <li>Dashed curve: later event from the same sensor ({counts.same})</li>
        <li>Thin line: event came from this sensor ({counts.link})</li>
      </ul>
    </div>
  );
}

export function RepresentationPanel({ index }: { index: number }) {
  const [active, setActive] = useState<TabId>("sequence");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const baseId = useId();

  function onKeyDown(event: React.KeyboardEvent, position: number) {
    let next = position;
    if (event.key === "ArrowRight") next = (position + 1) % TABS.length;
    else if (event.key === "ArrowLeft") next = (position - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = TABS.length - 1;
    else return;
    event.preventDefault();
    setActive(TABS[next].id);
    tabRefs.current[TABS[next].id]?.focus();
  }

  const current = TABS.find((tab) => tab.id === active) ?? TABS[0];
  const windowSize = getWindow(index).length;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Representations of the current window"
        className="flex flex-wrap gap-1 border-b border-slate-200 dark:border-zinc-800"
      >
        {TABS.map((tab, position) => (
          <button
            key={tab.id}
            ref={(node) => {
              tabRefs.current[tab.id] = node;
            }}
            role="tab"
            type="button"
            id={`${baseId}-tab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls={`${baseId}-panel-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => setActive(tab.id)}
            onKeyDown={(event) => onKeyDown(event, position)}
            className={`-mb-px min-h-10 border-b-2 px-4 text-xs sm:text-sm font-semibold transition-colors duration-150 cursor-pointer ${
              active === tab.id ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold" : "border-transparent text-secondary hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${baseId}-panel-${current.id}`}
        aria-labelledby={`${baseId}-tab-${current.id}`}
        tabIndex={0}
        className="pt-4"
      >
        <p className="max-w-[62ch] text-xs sm:text-sm text-secondary leading-relaxed">
          {current.blurb} The current window holds {windowSize} {windowSize === 1 ? "event" : "events"}.
        </p>
        <div className="mt-5">
          {current.id === "sequence" ? <SequenceTable index={index} /> : null}
          {current.id === "text" ? <TextSummary index={index} /> : null}
          {current.id === "raster" ? <RasterGrid index={index} /> : null}
          {current.id === "graph" ? <GraphDiagram index={index} /> : null}
        </div>
      </div>
    </div>
  );
}
