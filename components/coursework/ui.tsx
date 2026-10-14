"use client";

import { useId, type ReactNode } from "react";

/** Small shared controls so every demo looks and behaves the same. */

export function Btn({
  children,
  onClick,
  variant = "secondary",
  disabled,
  type = "button",
  className = "",
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
  title?: string;
}) {
  const styles =
    variant === "primary"
      ? "border-2 border-ink bg-accent text-accent-fg hover:bg-accent-strong"
      : "border-2 border-ink bg-surface text-fg hover:bg-p4";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-3.5 text-[0.875rem] font-semibold transition-colors duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-[0.8125rem]">
        <span className="font-bold text-black">{label}</span>
        <span className="font-mono font-semibold text-black">{format ? format(value) : value}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 h-7 w-full accent-[var(--accent)]"
      />
      {hint ? <p className="text-[0.75rem] font-medium text-black">{hint}</p> : null}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  mono = true,
  className = "",
  onEnter,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  mono?: boolean;
  className?: string;
  onEnter?: () => void;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="text-[0.8125rem] font-bold text-black">
        {label}
      </label>
      <input
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") onEnter?.();
        }}
        spellCheck={false}
        autoComplete="off"
        className={`mt-1 min-h-10 w-full rounded-lg border border-line-strong bg-bg px-3 text-[0.875rem] font-medium text-black placeholder:text-zinc-500 outline-none focus-visible:border-accent ${mono ? "font-mono" : ""}`}
      />
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 5,
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="text-[0.8125rem] font-bold text-black">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
        className="mt-1 w-full rounded-lg border border-line-strong bg-bg p-3 font-mono text-[0.8125rem] leading-relaxed text-black placeholder:text-zinc-500 outline-none focus-visible:border-accent"
      />
    </div>
  );
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const name = useId();
  return (
    <fieldset>
      <legend className="text-[0.8125rem] font-bold text-black">{label}</legend>
      <div className="mt-1 flex flex-wrap gap-1 rounded-lg border border-line-strong p-1">
        {options.map((option) => (
          <label key={option.value} className="relative">
            <input
              type="radio"
              name={name}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span className="inline-flex min-h-8 cursor-pointer items-center rounded-md px-3 text-[0.8125rem] font-medium text-black transition-colors duration-150 hover:text-black peer-checked:bg-accent peer-checked:font-semibold peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="flex min-h-9 cursor-pointer items-center gap-2 text-[0.875rem] font-medium text-black">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="size-4 accent-[var(--accent)]"
        />
        {label}
      </label>
      {hint ? <p className="pl-6 text-[0.75rem] font-medium text-black">{hint}</p> : null}
    </div>
  );
}

export function Stat({ label, value, note }: { label: string; value: ReactNode; note?: string }) {
  return (
    <div className="rounded-lg border border-line bg-bg px-4 py-3">
      <p className="font-mono text-xs font-bold uppercase tracking-wider text-black">{label}</p>
      <p className="mt-1 font-mono text-[1.25rem] font-bold leading-tight text-black">{value}</p>
      {note ? <p className="mt-0.5 text-[0.75rem] font-medium text-black">{note}</p> : null}
    </div>
  );
}

export function Pre({ children, className = "", label }: { children: ReactNode; className?: string; label?: string }) {
  return (
    <pre
      aria-label={label}
      tabIndex={0}
      className={`overflow-x-auto rounded-lg border border-line bg-bg p-3 font-mono text-[0.75rem] leading-relaxed text-black ${className}`}
    >
      {children}
    </pre>
  );
}

export function Panel({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border-2 border-line-strong bg-bg p-4 ${className}`}>
      {title ? <p className="font-mono text-xs font-bold uppercase tracking-wider text-black mb-3">{title}</p> : null}
      {children}
    </div>
  );
}
