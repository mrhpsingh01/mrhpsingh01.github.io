import { FLOORPLAN, sensors, zones, type SensorEvent } from "@/lib/sensor-demo/dataset";

interface FloorplanViewProps {
  states: Record<string, boolean>;
  current: SensorEvent & { index: number };
  path: { x: number; y: number; sensor: string }[];
  showPath: boolean;
}

/** Plain SVG floor plan. Sensor state is also announced as text, never by color alone. */
export function FloorplanView({ states, current, path, showPath }: FloorplanViewProps) {
  return (
    <svg
      viewBox={`0 0 ${FLOORPLAN.width} ${FLOORPLAN.height}`}
      role="img"
      aria-label={`Synthetic apartment floor plan with ${sensors.length} sensors. Current event: ${current.sensor} ${current.state}.`}
      className="h-auto w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs"
    >
      {zones.map((zone) => (
        <g key={zone.id}>
          <rect
            x={zone.x}
            y={zone.y}
            width={zone.width}
            height={zone.height}
            className="fill-slate-50/60 dark:fill-zinc-800/30 stroke-slate-300 dark:stroke-zinc-700"
            strokeWidth={2}
          />
          <text x={zone.x + 10} y={zone.y + 26} fontSize={18} className="fill-slate-600 dark:fill-slate-300 font-mono font-semibold">
            {zone.name}
          </text>
        </g>
      ))}

      {showPath && path.length > 1 ? (
        <polyline
          points={path.map((point) => `${point.x},${point.y}`).join(" ")}
          fill="none"
          className="stroke-indigo-600 dark:stroke-indigo-400"
          strokeWidth={3}
          strokeDasharray="8 6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}

      {sensors.map((sensor) => {
        const active = states[sensor.id];
        const isCurrent = sensor.id === current.sensor;
        return (
          <g key={sensor.id}>
            {isCurrent ? (
              <circle cx={sensor.x} cy={sensor.y} r={26} fill="none" className="stroke-indigo-600 dark:stroke-indigo-400" strokeWidth={2.5} />
            ) : null}
            {sensor.kind === "motion" ? (
              <circle
                cx={sensor.x}
                cy={sensor.y}
                r={16}
                className={active ? "fill-indigo-600 stroke-indigo-600" : "fill-white dark:fill-zinc-800 stroke-slate-700 dark:stroke-slate-300"}
                strokeWidth={2}
              />
            ) : (
              <rect
                x={sensor.x - 6}
                y={sensor.y - 16}
                width={12}
                height={32}
                className={active ? "fill-indigo-600 stroke-indigo-600" : "fill-white dark:fill-zinc-800 stroke-slate-700 dark:stroke-slate-300"}
                strokeWidth={2}
              />
            )}
            <text
              x={sensor.x}
              y={sensor.y + 5}
              textAnchor="middle"
              fontSize={14}
              fontWeight={700}
              className={active && sensor.kind === "motion" ? "fill-white" : "fill-slate-800 dark:fill-white"}
              style={sensor.kind === "door" ? { display: "none" } : undefined}
            >
              {sensor.id.slice(1)}
            </text>
            <text
              x={sensor.kind === "door" ? sensor.x + 12 : sensor.x}
              y={sensor.kind === "door" ? sensor.y - 26 : sensor.y + 36}
              textAnchor={sensor.kind === "door" ? "start" : "middle"}
              fontSize={15}
              fontWeight={600}
              className="fill-slate-700 dark:fill-slate-300 font-mono"
            >
              {sensor.kind === "door" ? `${sensor.id} ${active ? "open" : "closed"}` : sensor.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
