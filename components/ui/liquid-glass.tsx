import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Intensity = "sm" | "md" | "lg";

const blurMap: Record<Intensity, string> = {
  sm: "18px",
  md: "28px",
  lg: "38px",
};

export function LiquidGlassCard({
  children,
  className,
  contentClassName,
  style,
  glowIntensity: _glowIntensity = "md",
  shadowIntensity: _shadowIntensity = "md",
  blurIntensity = "md",
  borderRadius = "16px",
  draggable = false,
}: {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  style?: CSSProperties;
  glowIntensity?: Intensity;
  shadowIntensity?: Intensity;
  blurIntensity?: Intensity;
  borderRadius?: string;
  draggable?: boolean;
}) {
  void _glowIntensity;
  void _shadowIntensity;

  return (
    <div
      draggable={draggable}
      className={cn(
        "relative overflow-hidden border border-black/[0.08] bg-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] backdrop-blur-md ring-1 ring-white/80",
        className,
      )}
      style={{
        borderRadius,
        backdropFilter: `blur(${blurMap[blurIntensity]})`,
        WebkitBackdropFilter: `blur(${blurMap[blurIntensity]})`,
        ...style,
      }}
    >
      {/* Subtle top inner light highlight for luminous / lit-up glass effect */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90"
        aria-hidden="true"
      />
      <div className={cn("relative z-10 flex h-full flex-col", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
