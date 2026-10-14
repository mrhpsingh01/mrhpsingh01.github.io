"use client";

import { useEffect, useRef, useState } from "react";
import { File, Folder } from "lucide-react";
import { initialState, listTree, pathString, runCommand, type FtpState, type TraceLine } from "@/lib/coursework/ftp";
import { Btn, Panel } from "../ui";

const QUICK = ["ls", "pwd", "get notes.txt", "put todo.txt", "mkdir uploads", "cd uploads", "cd ..", "delete notes.txt", "quit"];

interface Line {
  kind: "input" | "output";
  text: string;
}

const WELCOME: Line[] = [
  { kind: "output", text: "Connected to myftpserver on port 6600 (simulated)." },
  { kind: "output", text: "Commands: get put delete ls cd mkdir pwd quit" },
];

export default function FtpSession() {
  const [state, setState] = useState<FtpState>(() => initialState());
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [trace, setTrace] = useState<TraceLine[]>([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const screen = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = screen.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  function submit(command: string) {
    const text = command.trim();
    if (!text) return;
    if (!state.connected) {
      setLines((l) => [...l, { kind: "input", text }, { kind: "output", text: "Not connected. Press Reset to start a new session." }]);
      setValue("");
      return;
    }
    const result = runCommand(state, text);
    setState(result.state);
    setLines((l) => [...l, { kind: "input", text }, ...result.output.map((o) => ({ kind: "output" as const, text: o }))]);
    setTrace((t) => [...t, ...result.trace].slice(-40));
    setHistory((h) => [...h, text]);
    setCursor(null);
    setValue("");
  }

  function reset() {
    setState(initialState());
    setLines(WELCOME);
    setTrace([]);
    setValue("");
    setHistory([]);
  }

  const tree = listTree(state.root);
  const cwdPath = pathString(state.cwd);
  const localNames = Object.entries(state.local);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_1fr]">
      <div className="space-y-4">
        <div
          ref={screen}
          role="log"
          aria-label="FTP terminal output"
          className="h-72 overflow-y-auto rounded-lg border border-line bg-fg p-3 font-mono text-[0.8125rem] leading-relaxed text-bg"
        >
          {lines.map((line, i) => (
            <p key={i} className={line.kind === "input" ? "text-[#b4baff]" : "opacity-90"}>
              {line.kind === "input" ? `myftp> ${line.text}` : line.text}
            </p>
          ))}
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit(value);
          }}
          className="flex items-center gap-2"
        >
          <label htmlFor="ftp-input" className="font-mono text-[0.875rem] text-accent-strong">
            myftp&gt;
          </label>
          <input
            id="ftp-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowUp" && history.length) {
                event.preventDefault();
                const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
                setCursor(next);
                setValue(history[next]);
              } else if (event.key === "ArrowDown" && cursor !== null) {
                event.preventDefault();
                const next = cursor + 1;
                if (next >= history.length) {
                  setCursor(null);
                  setValue("");
                } else {
                  setCursor(next);
                  setValue(history[next]);
                }
              }
            }}
            spellCheck={false}
            autoComplete="off"
            placeholder="type a command, for example: ls"
            className="min-h-10 min-w-0 flex-1 rounded-lg border border-line-strong bg-bg px-3 font-mono text-[0.875rem] outline-none focus-visible:border-accent"
          />
          <Btn type="submit" variant="primary">
            Run
          </Btn>
        </form>
        <div className="flex flex-wrap gap-2">
          {QUICK.map((c) => (
            <Btn key={c} className="min-h-8 px-2.5 font-mono text-[0.75rem]" onClick={() => submit(c)}>
              {c}
            </Btn>
          ))}
          <Btn className="min-h-8 px-2.5 text-[0.75rem]" onClick={reset}>
            Reset session
          </Btn>
        </div>
      </div>

      <div className="space-y-4">
        <Panel title={`Remote directory, working in ${cwdPath}`}>
          <ul aria-label="Server files" className="max-h-56 space-y-0.5 overflow-y-auto font-mono text-[0.75rem]">
            {tree.map(({ path, node, depth }) => {
              const current = pathString([...path]) === cwdPath;
              return (
                <li key={path.join("/")} style={{ paddingLeft: depth * 14 }} className={`flex items-center gap-1.5 ${current ? "font-semibold text-accent-strong" : ""}`}>
                  {node.type === "dir" ? <Folder aria-hidden="true" size={13} /> : <File aria-hidden="true" size={13} className="text-black" />}
                  {path[path.length - 1]}
                  {node.type === "file" ? <span className="text-black font-semibold">{node.size} B</span> : null}
                </li>
              );
            })}
          </ul>
        </Panel>
        <Panel title="Local directory (your computer)">
          <ul aria-label="Local files" className="space-y-0.5 font-mono text-[0.75rem]">
            {localNames.map(([name, size]) => (
              <li key={name} className="flex items-center gap-1.5">
                <File aria-hidden="true" size={13} className="text-black" />
                {name} <span className="text-black font-semibold">{size} B</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Protocol trace">
          <ol aria-label="Protocol trace" className="max-h-44 space-y-0.5 overflow-y-auto font-mono text-[0.6875rem]">
            {trace.length === 0 ? <li className="text-black font-medium">Run a command to see the messages.</li> : null}
            {trace.map((t, i) => (
              <li key={i} className={t.direction === "client" ? "text-fg" : "text-accent-strong"}>
                {t.direction === "client" ? "client > " : "server > "}
                {t.text}
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </div>
  );
}
