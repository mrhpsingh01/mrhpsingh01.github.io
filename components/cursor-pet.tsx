"use client";

import Script from "next/script";
import { petConfig } from "@/config/pet";
import { PikachuPet } from "@/components/pikachu-pet";
import { CuteDragonPet } from "@/components/cute-dragon-pet";

export function CursorPet() {
  if (petConfig.mode === "none") return null;

  if (petConfig.mode === "pikachu") {
    return <PikachuPet />;
  }

  if (petConfig.mode === "dragon") {
    return <CuteDragonPet />;
  }

  return (
    <Script
      src="/oneko/oneko.js"
      data-cat="/oneko/puppy.png"
      data-sleep="/oneko/mowgli-sleep.png"
      data-name={petConfig.name}
      data-wake-text={petConfig.wakeText}
      data-spawn-x={String(petConfig.spawn.x)}
      data-spawn-y={String(petConfig.spawn.y)}
      data-persist-position={String(petConfig.persistPosition)}
      strategy="afterInteractive"
    />
  );
}
