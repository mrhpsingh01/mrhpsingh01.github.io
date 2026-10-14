"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Database, Play } from "lucide-react";
import { sqlExercises, sqlTopics, type SqlExercise } from "@/content/coursework/sqlExercises";
import { SCHEMA_SQL, TABLES, dataSql } from "@/lib/coursework/sqlDataset";
import { Btn, Segmented, TextField } from "../ui";

type Phase = "idle" | "loading" | "ready" | "error";
type Variant = "original" | "adapted" | "fixed";

interface Outcome {
  kind: "rows" | "ok" | "error";
  fields: string[];
  rows: Record<string, unknown>[];
  total: number;
  ms: number;
  message?: string;
}

// Minimal view of the parts of PGlite this demo uses, so the component does not depend on its types at load time.
interface Db {
  exec: (sql: string) => Promise<{ rows: Record<string, unknown>[]; fields: { name: string }[] }[]>;
  query: (sql: string) => Promise<{ rows: Record<string, unknown>[]; fields: { name: string }[] }>;
  close: () => Promise<void>;
}

const MAX_SHOWN = 100;

function cell(value: unknown): { text: string; muted: boolean } {
  if (value === null || value === undefined) return { text: "NULL", muted: true };
  if (value instanceof Date) return { text: value.toISOString().replace("T", " ").slice(0, 19), muted: false };
  if (typeof value === "boolean") return { text: value ? "true" : "false", muted: false };
  if (typeof value === "bigint") return { text: value.toString(), muted: false };
  return { text: String(value), muted: false };
}

export default function SqlLab() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [status, setStatus] = useState("");
  const [loadMs, setLoadMs] = useState(0);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<SqlExercise>(sqlExercises[0]);
  const [variant, setVariant] = useState<Variant>("original");
  const [sql, setSql] = useState(sqlExercises[0].sql);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [filter, setFilter] = useState("");
  const [running, setRunning] = useState(false);
  const db = useRef<Db | null>(null);

  useEffect(() => {
    const instance = db;
    return () => {
      void instance.current?.close();
      instance.current = null;
    };
  }, []);

  const load = useCallback(async () => {
    setPhase("loading");
    const started = performance.now();
    try {
      if (db.current) {
        await db.current.close();
        db.current = null;
      }
      setStatus("Downloading PostgreSQL (WebAssembly)...");
      // Import the prebuilt module by URL so the bundler leaves it alone.
      const moduleUrl = "/pglite/index.js";
      const { PGlite } = (await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ moduleUrl)) as {
        PGlite: new (options: Record<string, unknown>) => unknown;
      };
      // Fetch the engine files from public/pglite (see scripts/copy-pglite.mjs). Passing them in
      // explicitly avoids relying on the bundler to resolve the wasm URLs inside the library.
      const [pgliteWasmModule, initdbWasmModule, dataResponse] = await Promise.all([
        WebAssembly.compileStreaming(fetch("/pglite/pglite.wasm")),
        WebAssembly.compileStreaming(fetch("/pglite/initdb.wasm")),
        fetch("/pglite/pglite.data"),
      ]);
      const fsBundle = await dataResponse.blob();
      const instance = new PGlite({ pgliteWasmModule, initdbWasmModule, fsBundle }) as unknown as Db;
      db.current = instance;
      setStatus("Creating tables...");
      await instance.exec(SCHEMA_SQL);
      setStatus("Generating the synthetic dataset...");
      const statements = dataSql();
      for (let i = 0; i < statements.length; i += 1) {
        await instance.exec(statements[i]);
        if (i % 4 === 0) setStatus(`Loading rows... (${i + 1} of ${statements.length} batches)`);
      }
      const tally: Record<string, number> = {};
      for (const table of TABLES) {
        const result = await instance.query(`SELECT COUNT(*)::int AS count FROM ${table}`);
        tally[table] = Number(result.rows[0].count);
      }
      setCounts(tally);
      setLoadMs(Math.round(performance.now() - started));
      // Run the first exercise so the results panel is not empty on first view.
      const first = sqlExercises[0];
      setSelected(first);
      setVariant("original");
      setSql(first.sql);
      const firstStarted = performance.now();
      const firstResults = await instance.exec(first.sql);
      const firstLast = firstResults[firstResults.length - 1];
      if (firstLast && firstLast.fields.length > 0) {
        setOutcome({
          kind: "rows",
          fields: firstLast.fields.map((f) => f.name),
          rows: firstLast.rows.slice(0, MAX_SHOWN),
          total: firstLast.rows.length,
          ms: Math.round(performance.now() - firstStarted),
        });
      }
      setPhase("ready");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
      setPhase("error");
    }
  }, []);

  function choose(exercise: SqlExercise) {
    setSelected(exercise);
    setVariant("original");
    setSql(exercise.sql);
    setOutcome(null);
  }

  function chooseVariant(next: Variant) {
    setVariant(next);
    setSql(next === "original" ? selected.sql : next === "adapted" ? (selected.adapted ?? selected.sql) : (selected.fixed ?? selected.sql));
    setOutcome(null);
  }

  async function run() {
    if (!db.current || !sql.trim()) return;
    setRunning(true);
    const started = performance.now();
    try {
      const results = await db.current.exec(sql);
      const last = results[results.length - 1];
      const ms = Math.round(performance.now() - started);
      if (!last || last.fields.length === 0) {
        setOutcome({ kind: "ok", fields: [], rows: [], total: 0, ms, message: "Statement executed." });
      } else {
        setOutcome({ kind: "rows", fields: last.fields.map((f) => f.name), rows: last.rows.slice(0, MAX_SHOWN), total: last.rows.length, ms });
      }
    } catch (error) {
      setOutcome({ kind: "error", fields: [], rows: [], total: 0, ms: Math.round(performance.now() - started), message: error instanceof Error ? error.message : String(error) });
    } finally {
      setRunning(false);
    }
  }

  const visible = useMemo(() => {
    const needle = filter.trim().toLowerCase();
    return sqlExercises.filter((e) => !needle || `${e.title} ${e.topic} ${e.id}`.toLowerCase().includes(needle));
  }, [filter]);

  const variants: { value: Variant; label: string }[] = [{ value: "original", label: "My original" }];
  if (selected.adapted) variants.push({ value: "adapted", label: "Adapted for PostgreSQL" });
  if (selected.fixed) variants.push({ value: "fixed", label: "Corrected" });

  if (phase !== "ready") {
    return (
      <div className="grid grid-cols-1 min-h-72 place-items-center rounded-lg border border-dashed border-line-strong p-8 text-center">
        <div className="max-w-[52ch]">
          <Database aria-hidden="true" className="mx-auto text-accent" size={32} />
          <p className="text-subtitle mt-3">Run my SQL on a real PostgreSQL</p>
          <p className="mt-2 text-[0.9375rem] text-black">
            This loads PostgreSQL compiled to WebAssembly (about 6 MB, cached after the first time) and a synthetic
            job-postings dataset with my schema. It runs in your browser and nothing is sent anywhere.
          </p>
          <div className="mt-5">
            <Btn variant="primary" onClick={load} disabled={phase === "loading"}>
              {phase === "loading" ? "Loading..." : phase === "error" ? "Try again" : "Load the database"}
            </Btn>
          </div>
          <p role="status" className="mt-3 font-mono text-[0.8125rem] text-black font-medium">
            {status}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[19rem_1fr]">
      <div className="space-y-3">
        <TextField label="Find an exercise" value={filter} onChange={setFilter} mono={false} placeholder="join, salary, CTE..." />
        <nav aria-label="Exercises" className="max-h-[34rem] overflow-y-auto rounded-lg border border-line bg-bg">
          {sqlTopics.map((topic) => {
            const items = visible.filter((e) => e.topic === topic);
            if (items.length === 0) return null;
            return (
              <div key={topic}>
                <p className="sticky top-0 z-10 border-b border-line bg-slate-200/90 dark:bg-zinc-800 px-3 py-1.5 font-mono text-xs uppercase font-bold tracking-wider text-black dark:text-white">{topic}</p>
                <ul>
                  {items.map((e) => (
                    <li key={e.id}>
                      <button
                        type="button"
                        onClick={() => choose(e)}
                        aria-current={e.id === selected.id ? "true" : undefined}
                        className={`flex min-h-10 w-full items-center justify-between gap-2 border-b border-line px-3 py-1.5 text-left text-[0.8125rem] transition-colors text-black ${
                          e.id === selected.id ? "bg-tint font-bold" : "hover:bg-sunken font-normal"
                        }`}
                      >
                        <span className="text-black">{e.title}</span>
                        {e.note ? <span title="Has a review note" className="shrink-0 rounded-sm border border-black/40 px-1 font-mono text-[0.625rem] font-bold text-black">note</span> : null}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>
        <details className="rounded-lg border border-line bg-bg p-3">
          <summary className="cursor-pointer text-[0.8125rem] font-bold text-black">Tables loaded ({loadMs} ms)</summary>
          <ul className="mt-2 space-y-0.5 font-mono text-[0.75rem] text-black">
            {TABLES.map((t) => (
              <li key={t}>
                {t}: {counts[t]?.toLocaleString("en-US")} rows
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[0.75rem] text-black font-medium">Synthetic data, not the real dataset. invoices_fact is defined from the columns my queries use.</p>
          <Btn className="mt-2 min-h-8 px-2.5 text-[0.75rem]" onClick={load}>
            Reset database
          </Btn>
        </details>
      </div>

      <div className="min-w-0 space-y-4">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-black">
            {selected.topic} / {selected.file}
          </p>
          <h4 className="mt-1 text-xl font-bold text-black">{selected.title}</h4>
          <p className="mt-2 text-[0.9375rem] font-medium leading-relaxed text-black">{selected.statement}</p>
        </div>

        {variants.length > 1 ? <Segmented label="Query version" value={variant} options={variants} onChange={chooseVariant} /> : null}

        <div>
          <label htmlFor="sql-editor" className="text-[0.8125rem] font-bold text-black">
            Query (Ctrl or Cmd + Enter to run)
          </label>
          <textarea
            id="sql-editor"
            value={sql}
            onChange={(event) => setSql(event.target.value)}
            onKeyDown={(event) => {
              if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                event.preventDefault();
                void run();
              }
            }}
            rows={Math.min(16, Math.max(7, sql.split("\n").length + 1))}
            spellCheck={false}
            className="mt-1 w-full rounded-lg border border-line-strong bg-bg p-3 font-mono text-[0.8125rem] leading-relaxed text-black outline-none focus-visible:border-accent"
          />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Btn variant="primary" onClick={run} disabled={running}>
              <Play aria-hidden="true" size={16} />
              {running ? "Running..." : "Run query"}
            </Btn>
            <Btn onClick={() => { setSql(variant === "original" ? selected.sql : variant === "adapted" ? (selected.adapted ?? selected.sql) : (selected.fixed ?? selected.sql)); setOutcome(null); }}>Restore this version</Btn>
          </div>
        </div>

        {selected.note ? (
          <div className="rounded-lg border border-line bg-sunken p-4">
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-black">Review note</p>
            <p className="mt-1 text-[0.9375rem] font-medium text-black">{selected.note}</p>
          </div>
        ) : null}

        <div aria-live="polite">
          {outcome?.kind === "error" ? (
            <div role="alert" className="rounded-lg border border-fg bg-bg p-4">
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-black">PostgreSQL error</p>
              <p className="mt-1 font-mono text-[0.8125rem] font-semibold text-red-600">{outcome.message}</p>
              {selected.adapted && variant === "original" ? (
                <Btn className="mt-3" onClick={() => chooseVariant("adapted")}>
                  Load the adapted query
                </Btn>
              ) : null}
            </div>
          ) : null}
          {outcome?.kind === "ok" ? <p className="rounded-lg border border-accent bg-tint px-3 py-2 text-[0.875rem] font-medium text-black">{outcome.message} ({outcome.ms} ms)</p> : null}
          {outcome?.kind === "rows" ? (
            <div>
              <p className="mb-2 font-mono text-[0.75rem] font-bold text-black">
                {outcome.total.toLocaleString("en-US")} {outcome.total === 1 ? "row" : "rows"} in {outcome.ms} ms
                {outcome.total > MAX_SHOWN ? `, showing the first ${MAX_SHOWN}` : ""}
              </p>
              <div role="region" aria-label="Query results (scrollable table)" tabIndex={0} className="max-h-96 overflow-auto rounded-lg border border-line bg-surface">
                <table className="w-full border-collapse text-left font-mono text-[0.75rem]">
                  <caption className="sr-only">Query results</caption>
                  <thead className="sticky top-0 bg-sunken">
                    <tr>
                      {outcome.fields.map((f) => (
                        <th key={f} scope="col" className="whitespace-nowrap border-b border-line px-3 py-2 font-bold text-black">
                          {f}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {outcome.rows.map((row, i) => (
                      <tr key={i} className="border-b border-line last:border-b-0">
                        {outcome.fields.map((f, k) => {
                          const c = cell(row[f]);
                          return (
                            <td key={`${f}-${k}`} className={`whitespace-nowrap px-3 py-1.5 text-black ${c.muted ? "italic text-zinc-600" : "font-medium"}`}>
                              {c.text}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
