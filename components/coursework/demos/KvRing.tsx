"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  KEY_SPACE,
  exit,
  initialRing,
  join,
  keyPlacement,
  rangeOf,
  request,
  ringIds,
  type OpResult,
  type RingMode,
  type RingState,
} from "@/lib/coursework/ring";
import { Btn, Panel, Segmented, Stat, TextField } from "../ui";

const SIZE = 420;
const C = SIZE / 2;
const R = 150;

function polar(position: number, radius = R) {
  const angle = (position / KEY_SPACE) * 2 * Math.PI - Math.PI / 2;
  return { x: C + radius * Math.cos(angle), y: C + radius * Math.sin(angle) };
}

export default function KvRing() {
  const [state, setState] = useState<RingState>(() => initialRing("original"));
  const [last, setLast] = useState<OpResult | null>(null);
  const [flash, setFlash] = useState<Set<number>>(new Set());
  const [nodeId, setNodeId] = useState("434");
  const [key, setKey] = useState("500");
  const [value, setValue] = useState("Dragonfruit");
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  function commit(result: OpResult) {
    setState(result.state);
    setLast(result);
    setFlash(new Set(result.moved.map((m) => m.key)));
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setFlash(new Set()), 2200);
  }

  const ids = ringIds(state);
  const placement = useMemo(() => keyPlacement(state), [state]);
  const misplaced = placement.filter((p) => p.misplaced).length;
  const removable = ids.filter((id) => id !== 0 && !state.dead.includes(id));

  function changeMode(mode: RingMode) {
    setState(initialRing(mode));
    setLast(null);
    setFlash(new Set());
  }

  const pathNodes = last?.path ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <Segmented
          label="Behaviour"
          value={state.mode}
          onChange={changeMode}
          options={[
            { value: "original", label: "My original code" },
            { value: "corrected", label: "Corrected" },
          ]}
        />
        <Btn onClick={() => changeMode(state.mode)}>Reset ring</Btn>
        <p className="max-w-[56ch] text-[0.8125rem] text-black font-medium">
          Switching behaviour resets the ring. The original takes keys on a join only from the bootstrap server and
          hands keys to the successor remembered from join time.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
        <div>
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            role="img"
            aria-label={`Hash ring of ${KEY_SPACE} positions with nodes ${ids.join(", ")} and ${placement.length} keys. ${misplaced} keys are on the wrong node.`}
            className="mx-auto h-auto w-full max-w-[420px]"
          >
            <circle cx={C} cy={C} r={R} fill="none" className="stroke-line-strong" strokeWidth={2} />
            {pathNodes.length > 1 ? (
              <line
                x1={polar(pathNodes[0]).x}
                y1={polar(pathNodes[0]).y}
                x2={polar(pathNodes[pathNodes.length - 1]).x}
                y2={polar(pathNodes[pathNodes.length - 1]).y}
                className="stroke-accent"
                strokeWidth={2.5}
                strokeDasharray="6 5"
              />
            ) : null}
            {placement.map((p) => {
              const pos = polar(p.key);
              const moved = flash.has(p.key);
              return (
                <g key={p.key}>
                  {moved ? <circle cx={pos.x} cy={pos.y} r={9} fill="none" className="stroke-accent" strokeWidth={2} /> : null}
                  {p.misplaced ? (
                    <circle cx={pos.x} cy={pos.y} r={4.5} className="fill-bg stroke-fg" strokeWidth={2} />
                  ) : (
                    <circle cx={pos.x} cy={pos.y} r={3.5} className="fill-accent" />
                  )}
                </g>
              );
            })}
            {ids.map((id) => {
              const pos = polar(id);
              const label = polar(id, R + 28);
              const dead = state.dead.includes(id);
              return (
                <g key={id}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={id === 0 ? 11 : 9}
                    className={id === 0 ? "fill-fg stroke-fg" : dead ? "fill-bg stroke-fg" : "fill-surface stroke-fg"}
                    strokeWidth={2}
                    strokeDasharray={dead ? "3 2" : undefined}
                  />
                  <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle" fontSize={13} fontWeight={600} className="fill-fg font-mono">
                    {id}
                  </text>
                </g>
              );
            })}
            <text x={C} y={C - 6} textAnchor="middle" fontSize={12} className="fill-black font-mono font-bold">
              key space 0-{KEY_SPACE - 1}
            </text>
            <text x={C} y={C + 12} textAnchor="middle" fontSize={12} className="fill-black font-mono font-bold">
              {placement.length} keys
            </text>
          </svg>
          <ul className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-1 text-[0.8125rem] text-black font-medium">
            <li><span className="mr-1.5 inline-block size-2.5 rounded-full bg-accent align-middle" />key on its owner</li>
            <li><span className="mr-1.5 inline-block size-2.5 rounded-full border-2 border-fg align-middle" />key on the wrong node</li>
            <li><span className="mr-1.5 inline-block size-2.5 rounded-full bg-fg align-middle" />bootstrap (node 0)</li>
          </ul>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Panel title="Name servers">
              <TextField label="Node id (1 to 1023)" value={nodeId} onChange={setNodeId} />
              <div className="mt-3 flex flex-wrap gap-2">
                <Btn variant="primary" onClick={() => commit(join(state, Number(nodeId)))}>enter</Btn>
                <Btn onClick={() => setNodeId("434")} className="min-h-8 px-2.5 text-[0.8125rem]">434</Btn>
                <Btn onClick={() => setNodeId("650")} className="min-h-8 px-2.5 text-[0.8125rem]">650</Btn>
                <Btn onClick={() => setNodeId("300")} className="min-h-8 px-2.5 text-[0.8125rem]">300</Btn>
              </div>
              <p className="label-mono mt-4">exit a node</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {removable.length === 0 ? <span className="text-[0.8125rem] text-black font-medium">No name servers have joined.</span> : null}
                {removable.map((id) => (
                  <Btn key={id} className="min-h-8 px-2.5 text-[0.8125rem]" onClick={() => commit(exit(state, id))}>
                    exit {id}
                  </Btn>
                ))}
              </div>
            </Panel>
            <Panel title="Bootstrap commands">
              <TextField label="Key (0 to 1023)" value={key} onChange={setKey} />
              <TextField label="Value (for insert)" value={value} onChange={setValue} className="mt-2" mono={false} />
              <div className="mt-3 flex flex-wrap gap-2">
                <Btn variant="primary" onClick={() => commit(request(state, { type: "lookup", key: Number(key) }))}>lookup</Btn>
                <Btn onClick={() => commit(request(state, { type: "insert", key: Number(key), value }))}>insert</Btn>
                <Btn onClick={() => commit(request(state, { type: "delete", key: Number(key) }))}>delete</Btn>
              </div>
            </Panel>
          </div>

          <div role="status" aria-live="polite" className="min-h-14 rounded-lg border border-line bg-bg p-3 font-mono text-[0.8125rem] text-black">
            {last ? last.message : "Enter a name server, then run a lookup."}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Ring members" value={ids.length} note={ids.join(", ")} />
            <Stat label="Keys" value={placement.length} />
            <Stat label="On the wrong node" value={misplaced} note={misplaced ? "lookups for these fail" : "all reachable"} />
          </div>
        </div>
      </div>

      <Panel title="Nodes">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left font-mono text-[0.75rem]">
            <caption className="sr-only">Ring members, their ranges and keys</caption>
            <thead>
              <tr className="text-black font-bold">
                <th scope="col" className="py-1 pr-3 font-bold">node</th>
                <th scope="col" className="py-1 pr-3 font-bold">range (pred, id]</th>
                <th scope="col" className="py-1 pr-3 font-bold">keys held</th>
                <th scope="col" className="py-1 pr-3 font-bold">remembered pred / succ</th>
                <th scope="col" className="py-1 font-bold">status</th>
              </tr>
            </thead>
            <tbody>
              {ids.map((id) => {
                const [pred, to] = rangeOf(state, id);
                const held = Object.keys(state.nodes[id].data).length;
                const dead = state.dead.includes(id);
                return (
                  <tr key={id} className="border-t border-line">
                    <th scope="row" className="py-1 pr-3 font-medium text-black">{id === 0 ? "0 (bootstrap)" : id}</th>
                    <td className="py-1 pr-3 text-black">({pred}, {to}]</td>
                    <td className="py-1 pr-3 text-black">{held}</td>
                    <td className="py-1 pr-3 text-black">{id === 0 ? "n/a" : `${state.nodes[id].predAtJoin} / ${state.nodes[id].succAtJoin}`}</td>
                    <td className="py-1 text-black">{dead ? "stopped, still in ring" : "up"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <ul aria-label="Ring log" className="mt-4 space-y-0.5 font-mono text-[0.6875rem] text-black font-medium">
          {state.log.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
