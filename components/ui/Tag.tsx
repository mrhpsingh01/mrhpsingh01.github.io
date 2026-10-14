import type { ReactNode } from "react";

/** Small monospace label for technologies and context. Plain text, no color-only meaning. */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full border-[1.5px] border-line-strong bg-surface px-2.5 py-0.5 font-mono text-[0.75rem] leading-5 text-fg">
      {children}
    </span>
  );
}

export function TagList({ items, label }: { items: string[]; label: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item}>
          <Tag>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}
