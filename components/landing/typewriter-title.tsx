"use client";

import { useEffect, useState } from "react";

const roles = [
  "Full-Stack Developer",
  "Software Engineer",
  "ML/AI Researcher",
];

export function TypewriterTitle() {
  const [index, setIndex] = useState(0);
  const [subText, setSubText] = useState("");
  const [state, setState] = useState<"typing" | "pausing" | "deleting">("typing");

  useEffect(() => {
    const current = roles[index];
    let timer: NodeJS.Timeout;

    if (state === "typing") {
      if (subText.length < current.length) {
        timer = setTimeout(() => setSubText(current.slice(0, subText.length + 1)), 80);
      } else {
        timer = setTimeout(() => setState("pausing"), 1500);
      }
    } else if (state === "pausing") {
      timer = setTimeout(() => setState("deleting"), 800);
    } else if (state === "deleting") {
      if (subText.length > 0) {
        timer = setTimeout(() => setSubText(current.slice(0, subText.length - 1)), 40);
      } else {
        setIndex((prev) => (prev + 1) % roles.length);
        setState("typing");
      }
    }

    return () => clearTimeout(timer);
  }, [subText, state, index]);

  return (
    <div className="flex items-center min-h-[36px] sm:min-h-[42px]">
      <span className="inline-flex items-center font-sans font-semibold text-2xl sm:text-3xl text-red-600 tracking-tight">
        {subText}
        <span className="ml-1 w-[2.5px] h-[0.9em] bg-red-600 animate-pulse" />
      </span>
    </div>
  );
}
