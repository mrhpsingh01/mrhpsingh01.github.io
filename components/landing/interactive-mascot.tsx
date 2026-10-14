"use client";

import React, { useEffect, useRef, useState } from "react";

const Lo = ["up-left", "up", "up-right", "left", "center", "right", "down-left", "down", "down-right"];
const Ro = ["blink", "heart", "sparkle", "surprised", "wink", "bashful", "sleepy", "dizzy", "delighted"];
const zo = ["right", "down-right", "down", "down-left", "left", "up-left", "up", "up-right"];
const Bo = (Math.PI * 2) / zo.length;
const Vo = 0.12;
const Ho = 70;
const Uo = ["heart", "sparkle", "delighted"];
const Wo = 120;
const Go = 560;
const Ko = 420;
const qo = 4;
const Jo = 1600;
const Yo = 1100;
const Xo: Keyframe[] = [
  { transform: "scale(1, 1)", easing: "ease-in" },
  { transform: "scale(1.10, 0.86)", offset: 0.18, easing: "ease-out" },
  { transform: "scale(0.95, 1.08)", offset: 0.45, easing: "ease-in-out" },
  { transform: "scale(1.03, 0.97)", offset: 0.72, easing: "ease-in-out" },
  { transform: "scale(1, 1)" },
];

function Zo(idx: number) {
  return { backgroundPosition: `${(idx % 3) * 50}% ${Math.floor(idx / 3) * 50}%` };
}

function Qo(diff: number) {
  return Math.atan2(Math.sin(diff), Math.cos(diff));
}

const spriteBase: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundSize: "300% 300%",
  backgroundRepeat: "no-repeat",
};

interface InteractiveMascotProps {
  directions: string;
  reactions: string;
  size?: number | string;
  className?: string;
  label?: string;
}

export function InteractiveMascot({
  directions,
  reactions,
  size,
  className,
  label = "Harmanpreet",
}: InteractiveMascotProps) {
  const containerRef = useRef<HTMLButtonElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const timersRef = useRef<number[]>([]);
  const clickTracker = useRef({ count: 0, at: 0 });
  const [direction, setDirection] = useState("center");
  const [reaction, setReaction] = useState<string | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let prevDirIdx = -1;
    let pointerPos: { x: number; y: number } | null = null;

    const handlePointer = () => {
      const el = containerRef.current;
      if (!el || !pointerPos) return;
      const rect = el.getBoundingClientRect();
      const dx = pointerPos.x - (rect.left + rect.width / 2);
      const dy = pointerPos.y - (rect.top + rect.height / 2);

      if (Math.hypot(dx, dy) < Ho) {
        prevDirIdx = -1;
        setDirection("center");
        return;
      }

      const angle = Math.atan2(dy, dx);
      if (prevDirIdx === -1 || Math.abs(Qo(angle - prevDirIdx * Bo)) >= Bo / 2 + Vo) {
        prevDirIdx = (Math.round(angle / Bo) + zo.length) % zo.length;
        setDirection(zo[prevDirIdx]);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      pointerPos = { x: e.clientX, y: e.clientY };
      handlePointer();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", handlePointer, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", handlePointer);
    };
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(window.clearTimeout);
    };
  }, []);

function playPopSound() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(420, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  } catch {}
}

  const handleClick = () => {
    playPopSound();
    timersRef.current.forEach(window.clearTimeout);
    timersRef.current = [];

    const queueTimer = (delay: number, val: string | null) => {
      timersRef.current.push(window.setTimeout(() => setReaction(val), delay));
    };

    const now = Date.now();
    const tracker = clickTracker.current;
    tracker.count = now - tracker.at < Jo ? tracker.count + 1 : 1;
    tracker.at = now;

    if (tracker.count >= qo) {
      tracker.count = 0;
      setReaction("dizzy");
      queueTimer(Yo, null);
    } else {
      setReaction("blink");
      queueTimer(Wo, Uo[(tracker.count - 1) % Uo.length]);
      queueTimer(Go, null);
    }

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      spanRef.current?.animate(Xo, { duration: Ko, easing: "linear" });
    }
  };

  const dirIndex = Lo.indexOf(direction);
  const reactIndex = Ro.indexOf(reaction ?? "blink");

  return (
    <button
      ref={containerRef}
      type="button"
      onClick={handleClick}
      aria-label={`Boop ${label}`}
      className={className}
      style={{
        position: "relative",
        display: "block",
        flexShrink: 0,
        width: typeof size === "number" ? `${size}px` : (size ?? "100%"),
        height: typeof size === "number" ? `${size}px` : (size ?? "100%"),
        padding: 0,
        border: 0,
        background: "transparent",
        appearance: "none",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <span
        ref={spanRef}
        style={{
          position: "relative",
          display: "block",
          width: "100%",
          height: "100%",
          transformOrigin: "50% 78%",
        }}
      >
        <span
          style={{
            ...spriteBase,
            backgroundImage: `url(${directions})`,
            ...Zo(dirIndex >= 0 ? dirIndex : 4),
            opacity: reaction ? 0 : 1,
          }}
        />
        <span
          style={{
            ...spriteBase,
            backgroundImage: `url(${reactions})`,
            ...Zo(reactIndex >= 0 ? reactIndex : 0),
            opacity: reaction ? 1 : 0,
          }}
        />
      </span>
    </button>
  );
}
