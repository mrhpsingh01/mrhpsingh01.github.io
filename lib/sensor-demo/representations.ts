import {
  DEMO_WINDOW_SIZE,
  FLOORPLAN,
  events,
  isActivation,
  sensorById,
  sensors,
  zoneById,
  type SensorEvent,
} from "./dataset";

/**
 * Educational versions of the four representations used in the thesis.
 * They are deterministic functions of the synthetic event window: no learned
 * parameters, no model output. They are simplified on purpose (see the lab page).
 */

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((value) => String(value).padStart(2, "0")).join(":");
}

/** The window ends at `index` and contains up to `size` events. */
export function getWindow(index: number, size: number = DEMO_WINDOW_SIZE, source: SensorEvent[] = events) {
  const end = Math.min(Math.max(index, 0), source.length - 1);
  const start = Math.max(0, end - size + 1);
  return source.slice(start, end + 1).map((event, i) => ({ ...event, index: start + i }));
}

export type WindowEvent = ReturnType<typeof getWindow>[number];

/** Latest known state of every sensor after replaying events 0..index. */
export function sensorStatesAt(index: number, source: SensorEvent[] = events): Record<string, boolean> {
  const states: Record<string, boolean> = Object.fromEntries(sensors.map((sensor) => [sensor.id, false]));
  for (let i = 0; i <= Math.min(index, source.length - 1); i += 1) {
    states[source[i].sensor] = isActivation(source[i].state);
  }
  return states;
}

/* ---------------------------------------------------------------- sequence */

export interface SequenceRow {
  index: number;
  sensor: string;
  state: 0 | 1;
  /** Position inside the window, 0 at the first event and 1 at the last. */
  timeNorm: number;
  /** log(1 + seconds since the previous event in the window). */
  logGap: number;
  hourSin: number;
  hourCos: number;
}

export function sequenceView(window: WindowEvent[]): SequenceRow[] {
  const first = window[0]?.time ?? 0;
  const last = window[window.length - 1]?.time ?? 0;
  const span = last - first;
  return window.map((event, i) => {
    const gap = i === 0 ? 0 : event.time - window[i - 1].time;
    const hour = (event.time / 3600) % 24;
    const angle = (hour / 24) * 2 * Math.PI;
    return {
      index: event.index,
      sensor: event.sensor,
      state: isActivation(event.state) ? 1 : 0,
      timeNorm: span === 0 ? 0 : (event.time - first) / span,
      logGap: Math.log1p(gap),
      hourSin: Math.sin(angle),
      hourCos: Math.cos(angle),
    };
  });
}

/* -------------------------------------------------------------------- text */

export interface TextToken {
  kind: string;
  value: string;
}

function timeOfDay(seconds: number): string {
  const hour = Math.floor(seconds / 3600) % 24;
  if (hour < 5) return "night";
  if (hour < 8) return "early_morning";
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
}

/** The synthetic day is a weekday. Real data would derive this from the date. */
const DAY_TYPE = "weekday";

export function textView(window: WindowEvent[]): { tokens: TextToken[]; text: string } {
  if (window.length === 0) return { tokens: [], text: "" };
  const activations = window.filter((event) => isActivation(event.state));
  const zoneCounts = new Map<string, number>();
  const sensorCounts = new Map<string, number>();
  const zonePath: string[] = [];

  for (const event of activations) {
    const sensor = sensorById.get(event.sensor);
    if (!sensor) continue;
    zoneCounts.set(sensor.zone, (zoneCounts.get(sensor.zone) ?? 0) + 1);
    sensorCounts.set(sensor.id, (sensorCounts.get(sensor.id) ?? 0) + 1);
    if (zonePath[zonePath.length - 1] !== sensor.zone) zonePath.push(sensor.zone);
  }

  // Ties go to the zone seen first, so the result is deterministic.
  let dominantZone = "none";
  let best = 0;
  for (const [zone, count] of zoneCounts) {
    if (count > best) {
      best = count;
      dominantZone = zone;
    }
  }

  const duration = window[window.length - 1].time - window[0].time;
  const meanGap = window.length > 1 ? duration / (window.length - 1) : 0;
  const pace = meanGap < 10 ? "fast" : meanGap < 60 ? "steady" : "slow";
  const durationClass = duration < 60 ? "short" : duration < 600 ? "medium" : "long";

  const topSensors = [...sensorCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 3)
    .map(([id, count]) => `${id}x${count}`);

  const tokens: TextToken[] = [
    { kind: "time of day", value: timeOfDay(window[0].time) },
    { kind: "day type", value: DAY_TYPE },
    { kind: "dominant zone", value: dominantZone },
    { kind: "zone path", value: zonePath.length > 0 ? zonePath.slice(-4).join(">") : "none" },
    { kind: "pace", value: pace },
    { kind: "duration", value: durationClass },
    ...topSensors.map((value) => ({ kind: "sensor count", value })),
  ];
  return { tokens, text: tokens.map((token) => token.value).join(" ") };
}

/* ------------------------------------------------------------------ raster */

export const GRID = { columns: 32, rows: 20 } as const;
export const RASTER_CHANNELS = ["activation", "early half", "late half"] as const;
export type RasterChannel = (typeof RASTER_CHANNELS)[number];

const SIGMA = 1.4;

function splat(grid: number[][], x: number, y: number) {
  const cx = (x / FLOORPLAN.width) * GRID.columns;
  const cy = (y / FLOORPLAN.height) * GRID.rows;
  for (let row = 0; row < GRID.rows; row += 1) {
    for (let col = 0; col < GRID.columns; col += 1) {
      const dx = col + 0.5 - cx;
      const dy = row + 0.5 - cy;
      grid[row][col] += Math.exp(-(dx * dx + dy * dy) / (2 * SIGMA * SIGMA));
    }
  }
}

/**
 * Sparse activations blurred with a Gaussian onto a floor-plan grid, split into
 * three channels: all activations, the first half of the window and the second half.
 */
export function rasterView(window: WindowEvent[]): Record<RasterChannel, { cells: number[][]; max: number }> {
  const blank = () => Array.from({ length: GRID.rows }, () => Array<number>(GRID.columns).fill(0));
  const channels = { activation: blank(), "early half": blank(), "late half": blank() };
  const half = Math.ceil(window.length / 2);

  window.forEach((event, i) => {
    if (!isActivation(event.state)) return;
    const sensor = sensorById.get(event.sensor);
    if (!sensor) return;
    splat(channels.activation, sensor.x, sensor.y);
    splat(i < half ? channels["early half"] : channels["late half"], sensor.x, sensor.y);
  });

  const finish = (cells: number[][]) => ({ cells, max: Math.max(0, ...cells.flat()) });
  return {
    activation: finish(channels.activation),
    "early half": finish(channels["early half"]),
    "late half": finish(channels["late half"]),
  };
}

/* ------------------------------------------------------------------- graph */

export type GraphEdgeKind = "sequential" | "same sensor" | "event to sensor";

export interface GraphView {
  eventNodes: { id: string; index: number; sensor: string; state: string }[];
  sensorNodes: { id: string }[];
  edges: { kind: GraphEdgeKind; from: string; to: string }[];
}

export function graphView(window: WindowEvent[]): GraphView {
  const eventNodes = window.map((event) => ({
    id: `e${event.index}`,
    index: event.index,
    sensor: event.sensor,
    state: event.state,
  }));
  const usedSensors = [...new Set(window.map((event) => event.sensor))];
  const sensorNodes = sensors.filter((sensor) => usedSensors.includes(sensor.id)).map((sensor) => ({ id: sensor.id }));

  const edges: GraphView["edges"] = [];
  for (let i = 0; i < eventNodes.length; i += 1) {
    if (i > 0) edges.push({ kind: "sequential", from: eventNodes[i - 1].id, to: eventNodes[i].id });
    // Same-sensor skip edge to the next event of that sensor, unless it is already the next event.
    const next = eventNodes.findIndex((node, j) => j > i && node.sensor === eventNodes[i].sensor);
    if (next > i + 1) {
      edges.push({ kind: "same sensor", from: eventNodes[i].id, to: eventNodes[next].id });
    }
    edges.push({ kind: "event to sensor", from: eventNodes[i].id, to: eventNodes[i].sensor });
  }
  return { eventNodes, sensorNodes, edges };
}

/* ------------------------------------------------------------ inferred path */

/**
 * Straight segments between the most recent motion activations. This is an
 * INFERRED path for illustration only: sparse binary sensors cannot give
 * exact continuous tracking.
 */
export function inferredPath(index: number, count = 4): { x: number; y: number; sensor: string }[] {
  const points: { x: number; y: number; sensor: string }[] = [];
  for (let i = Math.min(index, events.length - 1); i >= 0 && points.length < count; i -= 1) {
    const event = events[i];
    if (!isActivation(event.state)) continue;
    const sensor = sensorById.get(event.sensor);
    if (!sensor) continue;
    if (points[0]?.sensor === sensor.id) continue;
    points.unshift({ x: sensor.x, y: sensor.y, sensor: sensor.id });
  }
  return points;
}

export function zoneName(id: string): string {
  return zoneById.get(id)?.name ?? id;
}
