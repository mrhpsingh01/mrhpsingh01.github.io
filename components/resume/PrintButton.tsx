"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-accent px-5 py-2.5 text-[0.9375rem] font-medium text-accent-fg transition-colors duration-150 hover:bg-accent-strong active:translate-y-px cursor-pointer"
    >
      <Printer aria-hidden="true" size={16} />
      Print or save as PDF
    </button>
  );
}
