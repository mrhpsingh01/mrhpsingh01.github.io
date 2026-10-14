"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import {
  PARTICIPANTS,
  apply,
  expiresAt,
  initialState,
  type Command,
  type Mode,
  type MulticastState,
  type ParticipantId,
} from "@/lib/coursework/multicast";
import { Btn, Panel, RangeField, Segmented, TextField } from "../ui";

export default function Multicast() {
  const [state, setState] = useState<MulticastState>(() => initialState(20, "original"));
  const [console_, setConsole] = useState<string[]>(["Register a participant to begin."]);
  const [drafts, setDrafts] = useState<Record<ParticipantId, string>>({ P1: "hello group", P2: "", P3: "" });

  function run(command: Command) {
    const result = apply(state, command);
    setState(result.state);
    setConsole((lines) => [...lines.slice(-7), result.message]);
  }

  function reset(mode: Mode = state.mode, td = state.td) {
    setState(initialState(td, mode));
    setConsole(["Register a participant to begin."]);
  }

  const duplicates = PARTICIPANTS.reduce((sum, id) => sum + state.logs[id].filter((l) => l.duplicate).length, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.2fr_1fr_auto]">
        <RangeField
          label="Persistence window (td)"
          value={state.td}
          min={5}
          max={60}
          step={5}
          onChange={(v) => setState((s) => ({ ...s, td: v }))}
          format={(v) => `${v} seconds`}
          hint="How long the coordinator keeps a message for people who are offline."
        />
        <Segmented
          label="Coordinator behaviour"
          value={state.mode}
          onChange={(mode) => reset(mode)}
          options={[
            { value: "original", label: "My original" },
            { value: "once", label: "Deliver once" },
          ]}
        />
        <div className="flex items-end">
          <Btn onClick={() => reset()}>Reset</Btn>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-line bg-bg px-4 py-3">
        <p className="font-mono text-[0.9375rem]" role="status">
          clock {state.now}s
        </p>
        {[1, 5, 10, 20].map((s) => (
          <Btn key={s} className="min-h-8 px-2.5 text-[0.8125rem]" onClick={() => run({ type: "advance", seconds: s })}>
            +{s}s
          </Btn>
        ))}
        <p className="text-[0.8125rem] text-black font-medium">Messages sent now are kept until the clock passes sent time + {state.td}s.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {PARTICIPANTS.map((id) => {
          const member = state.members[id];
          const status = !member ? "not registered" : member.online ? "registered, online" : "registered, disconnected";
          return (
            <section key={id} aria-label={`Participant ${id}`} className="rounded-lg border border-line bg-bg p-4">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-mono text-[1rem] font-semibold text-black">{id}</h4>
                <span
                  className={`rounded-sm px-2 py-0.5 font-mono text-[0.6875rem] ${
                    !member ? "border border-line-strong text-black font-semibold" : member.online ? "bg-accent text-accent-fg" : "bg-fg text-bg"
                  }`}
                >
                  {status}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Btn className="min-h-8 px-2.5 text-[0.75rem]" onClick={() => run({ type: "register", id })}>register</Btn>
                <Btn className="min-h-8 px-2.5 text-[0.75rem]" onClick={() => run({ type: "disconnect", id })}>disconnect</Btn>
                <Btn className="min-h-8 px-2.5 text-[0.75rem]" onClick={() => run({ type: "reconnect", id })}>reconnect</Btn>
                <Btn className="min-h-8 px-2.5 text-[0.75rem]" onClick={() => run({ type: "deregister", id })}>deregister</Btn>
              </div>
              <form
                className="mt-3 grid grid-cols-[1fr_auto] items-end gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  const text = drafts[id].trim();
                  if (text) run({ type: "msend", id, text });
                }}
              >
                <TextField label="msend" value={drafts[id]} onChange={(v) => setDrafts((d) => ({ ...d, [id]: v }))} mono={false} placeholder="message text" />
                <Btn type="submit" className="px-3" title={`Send from ${id}`}>
                  <Send aria-hidden="true" size={14} />
                  <span className="sr-only">Send from {id}</span>
                </Btn>
              </form>
              <p className="label-mono mt-4">{id}&apos;s log file</p>
              <ul aria-label={`${id} log`} className="mt-1 min-h-14 space-y-1 font-mono text-[0.75rem]">
                {state.logs[id].length === 0 ? <li className="text-black font-medium">(empty)</li> : null}
                {state.logs[id].map((entry, i) => (
                  <li key={i} className={entry.duplicate ? "font-bold text-red-600" : "text-black font-medium"}>
                    [{entry.at}s] {entry.content}
                    {entry.duplicate ? "  (duplicate)" : ""}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel title="Coordinator: kept messages">
          {state.history.length === 0 ? (
            <p className="text-[0.875rem] text-black font-medium">No messages yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[26rem] text-left font-mono text-[0.75rem]">
                <caption className="sr-only">Messages the coordinator is keeping</caption>
                <thead>
                  <tr className="text-black font-bold">
                    <th scope="col" className="py-1 pr-3 font-bold">id</th>
                    <th scope="col" className="py-1 pr-3 font-bold">sent</th>
                    <th scope="col" className="py-1 pr-3 font-bold">recipients</th>
                    <th scope="col" className="py-1 pr-3 font-bold">text</th>
                    <th scope="col" className="py-1 font-bold">status</th>
                  </tr>
                </thead>
                <tbody>
                  {state.history.map((m) => {
                    const alive = state.now <= expiresAt(state, m);
                    return (
                      <tr key={m.id} className="border-t border-line">
                        <th scope="row" className="py-1 pr-3 font-medium text-black">{m.id}</th>
                        <td className="py-1 pr-3 text-black">{m.sentAt}s</td>
                        <td className="py-1 pr-3 text-black">{m.recipients.join(" ")}</td>
                        <td className="max-w-[8rem] truncate py-1 pr-3 text-black" title={m.content}>{m.content}</td>
                        <td className="py-1 text-black font-medium">{alive ? `kept to ${expiresAt(state, m)}s` : "expired"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {duplicates > 0 ? (
            <p className="mt-3 text-[0.8125rem]">
              <strong className="font-semibold">{duplicates}</strong> repeated {duplicates === 1 ? "delivery" : "deliveries"}: the coordinator sent a message
              again because it does not remember what it already delivered.
            </p>
          ) : null}
        </Panel>
        <Panel title="Console and coordinator log">
          <ul aria-label="Console" className="space-y-1 font-mono text-[0.75rem]">
            {console_.map((line, i) => (
              <li key={i} className={i === console_.length - 1 ? "text-fg font-bold" : "text-black font-medium"}>
                {line}
              </li>
            ))}
          </ul>
          <p className="label-mono mt-4">Coordinator</p>
          <ul aria-label="Coordinator log" className="mt-1 max-h-40 space-y-0.5 overflow-y-auto font-mono text-[0.6875rem] text-black font-medium">
            {state.coordinatorLog.length === 0 ? <li>(nothing yet)</li> : null}
            {state.coordinatorLog.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
