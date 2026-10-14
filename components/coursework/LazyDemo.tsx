"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentType } from "react";
import type { DemoId } from "@/content/coursework/types";

function DemoSkeleton() {
  return (
    <div className="grid grid-cols-1 min-h-64 place-items-center rounded-xl border border-dashed border-border p-8 text-center text-secondary">
      <div className="flex flex-col items-center gap-2">
        <div className="size-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="font-mono text-xs">Loading simulation engine...</p>
      </div>
    </div>
  );
}

/** Each demo is its own chunk, fetched only when its section scrolls near the viewport. */
const demos: Record<DemoId, ComponentType> = {
  "hmm-gene-finder": dynamic(() => import("./demos/HmmGeneFinder"), { ssr: false, loading: DemoSkeleton }),
  "rna-folding": dynamic(() => import("./demos/RnaFolding"), { ssr: false, loading: DemoSkeleton }),
  "dns-forwarder": dynamic(() => import("./demos/DnsForwarder"), { ssr: false, loading: DemoSkeleton }),
  "https-downloader": dynamic(() => import("./demos/HttpsDownloader"), { ssr: false, loading: DemoSkeleton }),
  "latency-stats": dynamic(() => import("./demos/LatencyStats"), { ssr: false, loading: DemoSkeleton }),
  "ftp-session": dynamic(() => import("./demos/FtpSession"), { ssr: false, loading: DemoSkeleton }),
  "ftp-concurrent": dynamic(() => import("./demos/FtpConcurrent"), { ssr: false, loading: DemoSkeleton }),
  multicast: dynamic(() => import("./demos/Multicast"), { ssr: false, loading: DemoSkeleton }),
  "kv-ring": dynamic(() => import("./demos/KvRing"), { ssr: false, loading: DemoSkeleton }),
  "property-management": dynamic(() => import("./demos/PropertyManagement"), { ssr: false, loading: DemoSkeleton }),
  "sql-lab": dynamic(() => import("./demos/SqlLab"), { ssr: false, loading: DemoSkeleton }),
};

export function LazyDemo({ id, eager = false }: { id: DemoId; eager?: boolean }) {
  const holder = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(eager);

  useEffect(() => {
    if (eager) {
      setNear(true);
      return;
    }
    const element = holder.current;
    if (!element) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(element);
    return () => io.disconnect();
  }, [eager]);

  const Demo = demos[id];
  return (
    <div ref={holder} data-demo={id}>
      {near && Demo ? <Demo /> : <DemoSkeleton />}
    </div>
  );
}
