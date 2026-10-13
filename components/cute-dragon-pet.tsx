"use client";

import React, { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export function CuteDragonPet() {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Dragon State
    let dragonX = 60;
    let dragonY = 80;
    let targetX = dragonX;
    let targetY = dragonY;
    let vx = 0;
    let vy = 0;
    let facingLeft = false;
    let wingAngle = 0;
    let wingSpeed = 0.2;
    let breathTimer = 0;
    let flameCooldown = 0;
    let isBreathingFlame = false;
    let flameBurstCount = 0;
    let isSleeping = false;
    let idleCounter = 0;

    const particles: Particle[] = [];

    // Track mouse
    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      idleCounter = 0;
      if (isSleeping) {
        isSleeping = false;
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    // Click on screen or dragon to play
    const onMouseDown = (e: MouseEvent) => {
      const dx = e.clientX - dragonX;
      const dy = e.clientY - dragonY;
      const dist = Math.hypot(dx, dy);
      if (dist < 40) {
        // Trigger celebratory flame blast!
        flameBurstCount = 35;
        isBreathingFlame = true;
      }
    };
    window.addEventListener("mousedown", onMouseDown);

    const flameColors = [
      "#FF3B00",
      "#FF6200",
      "#FFA200",
      "#FFDD00",
      "#FFF275",
      "#FF0055",
      "#8A2BE2", // occasional mythical violet spark
    ];

    const spawnFlameParticle = (x: number, y: number, dirX: number, dirY: number) => {
      const angle = Math.atan2(dirY, dirX) + (Math.random() - 0.5) * 0.75;
      const speed = 3.5 + Math.random() * 4.5;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (Math.random() * 1.2),
        radius: 3 + Math.random() * 4.5,
        color: flameColors[Math.floor(Math.random() * flameColors.length)],
        alpha: 1,
        life: 0,
        maxLife: 20 + Math.random() * 18,
      });
    };

    const spawnSparkle = (x: number, y: number) => {
      particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -0.5 - Math.random() * 1.5,
        radius: 1.5 + Math.random() * 2,
        color: "#FFE57F",
        alpha: 0.9,
        life: 0,
        maxLife: 24,
      });
    };

    // Draw cute mini chibi dragon
    const drawDragon = (x: number, y: number, isLeft: boolean, wing: number, isShooting: boolean, sleeping: boolean) => {
      ctx.save();
      ctx.translate(x, y);
      if (isLeft) {
        ctx.scale(-1, 1);
      }

      // Gentle floating bob
      const bob = Math.sin(breathTimer * 2) * 2.5;
      ctx.translate(0, bob);

      // --- Cute Tail with spiky tip ---
      ctx.beginPath();
      ctx.moveTo(-10, 4);
      ctx.quadraticCurveTo(-22, 8 + Math.sin(breathTimer * 3) * 3, -26, 0);
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#4E8752"; // soft dragon green
      ctx.lineCap = "round";
      ctx.stroke();

      // Tail spade/flame tip
      ctx.beginPath();
      ctx.fillStyle = "#FF7A00";
      ctx.arc(-26, 0, 3, 0, Math.PI * 2);
      ctx.fill();

      // --- Left Wing (behind) ---
      const wingFlap = Math.sin(wing);
      ctx.save();
      ctx.translate(-4, -4);
      ctx.scale(1, wingFlap);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-14, -18, -2, -14);
      ctx.quadraticCurveTo(8, -12, 0, 0);
      ctx.fillStyle = "#A7F3D0";
      ctx.fill();
      ctx.strokeStyle = "#059669";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      // --- Chibi Dragon Body (Round & Cute) ---
      ctx.beginPath();
      ctx.ellipse(0, 4, 11, 13, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#10B981"; // Emerald green
      ctx.fill();

      // Belly patch (pastel butter yellow)
      ctx.beginPath();
      ctx.ellipse(3, 5, 6, 9, 0.1, 0, Math.PI * 2);
      ctx.fillStyle = "#FEF08A";
      ctx.fill();

      // Little stubby feet
      ctx.beginPath();
      ctx.arc(-4, 14, 3.5, 0, Math.PI * 2);
      ctx.arc(6, 14, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#059669";
      ctx.fill();

      // --- Big Chibi Head ---
      ctx.beginPath();
      ctx.ellipse(2, -7, 13, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#10B981";
      ctx.fill();

      // Dragon Horns
      ctx.beginPath();
      ctx.moveTo(-4, -16);
      ctx.lineTo(-7, -23);
      ctx.lineTo(-1, -18);
      ctx.fillStyle = "#F59E0B"; // Gold horns
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(4, -16);
      ctx.lineTo(8, -22);
      ctx.lineTo(8, -16);
      ctx.fillStyle = "#F59E0B";
      ctx.fill();

      // Cheek blush
      ctx.beginPath();
      ctx.arc(8, -4, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 99, 132, 0.4)";
      ctx.fill();

      // Eyes
      if (sleeping) {
        // Cute sleeping closed curved eyes (^ ^)
        ctx.beginPath();
        ctx.arc(6, -8, 3.5, Math.PI, 0);
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = "#064E3B";
        ctx.stroke();
      } else {
        // Big cute sparkling dragon eyes
        ctx.beginPath();
        ctx.ellipse(7, -8, 3.8, 4.6, 0.05, 0, Math.PI * 2);
        ctx.fillStyle = "#064E3B";
        ctx.fill();

        // Eye highlights (sparkle)
        ctx.beginPath();
        ctx.arc(6, -9.5, 1.4, 0, Math.PI * 2);
        ctx.arc(8.5, -6.5, 0.8, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
      }

      // Snout / Open mouth for flame
      if (isShooting) {
        // Open wide cute mouth glowing with fire
        ctx.beginPath();
        ctx.ellipse(13, -4, 4.5, 3.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#DC2626";
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(12, -4, 2.5, 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#FEF08A";
        ctx.fill();
      } else {
        // Tiny cute smile
        ctx.beginPath();
        ctx.arc(11, -4, 2, 0.2, Math.PI * 0.85);
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = "#064E3B";
        ctx.stroke();
      }

      // --- Right Wing (front) ---
      ctx.save();
      ctx.translate(2, -2);
      ctx.scale(1, wingFlap);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(14, -20, 2, -15);
      ctx.quadraticCurveTo(-6, -12, 0, 0);
      ctx.fillStyle = "#6EE7B7";
      ctx.fill();
      ctx.strokeStyle = "#047857";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    };

    // Draw little floating "Z z z" when sleeping
    const drawSleepingZzz = (x: number, y: number) => {
      ctx.save();
      ctx.font = "bold 13px monospace";
      ctx.fillStyle = "#10B981";
      const floatY = (breathTimer * 20) % 25;
      ctx.globalAlpha = Math.max(0, 1 - floatY / 25);
      ctx.fillText("z", x - 15, y - 25 - floatY * 0.6);
      ctx.font = "bold 16px monospace";
      ctx.fillText("Z", x - 22, y - 35 - floatY);
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      breathTimer += 0.05;
      idleCounter += 1;

      // Enter sleep after ~12 seconds of no mouse movement
      if (idleCounter > 700) {
        isSleeping = true;
      }

      const dx = targetX - dragonX;
      const dy = targetY - dragonY;
      const dist = Math.hypot(dx, dy);

      // Flap wings faster when chasing, gentle glide when close
      wingSpeed = dist > 60 ? 0.35 : 0.15;
      wingAngle += wingSpeed;

      // Facing orientation
      if (Math.abs(dx) > 10) {
        facingLeft = dx < 0;
      }

      // Movement physics
      const reachThreshold = 75; // Dragon stops at a cute friendly distance from cursor
      if (!isSleeping && dist > reachThreshold) {
        const speed = Math.min(dist * 0.06, 8.5);
        vx = (dx / dist) * speed;
        vy = (dy / dist) * speed;
        dragonX += vx;
        dragonY += vy;
      } else {
        // Slow down smoothly when near cursor
        vx *= 0.85;
        vy *= 0.85;
        dragonX += vx;
        dragonY += vy;
      }

      // Keep within viewport boundaries
      dragonX = Math.max(25, Math.min(canvas.width - 25, dragonX));
      dragonY = Math.max(25, Math.min(canvas.height - 25, dragonY));

      // --- Flame throwing behavior ---
      // When the dragon gets close to the cursor, it playfully breathes a burst of flame!
      if (!isSleeping && dist <= reachThreshold + 25) {
        if (flameCooldown <= 0) {
          flameBurstCount = 18; // Burst duration
          flameCooldown = 80;   // Cooldown between breaths (~1.3s)
        }
      }

      if (flameCooldown > 0) {
        flameCooldown -= 1;
      }

      if (flameBurstCount > 0) {
        isBreathingFlame = true;
        flameBurstCount -= 1;

        // Snout emission point
        const snoutOffsetX = facingLeft ? -15 : 15;
        const snoutOffsetY = -5;
        const snoutX = dragonX + snoutOffsetX;
        const snoutY = dragonY + snoutOffsetY;

        // Direction towards cursor
        const targetDirX = targetX - snoutX;
        const targetDirY = targetY - snoutY;

        // Spawn flame fire particles
        for (let i = 0; i < 3; i++) {
          spawnFlameParticle(snoutX, snoutY, targetDirX, targetDirY);
        }

        // Occasional magic spark
        if (Math.random() < 0.3) {
          spawnSparkle(targetX, targetY);
        }
      } else {
        isBreathingFlame = false;
      }

      // Occasional cute idle sparkle when hovering
      if (!isSleeping && dist <= reachThreshold && Math.random() < 0.08) {
        spawnSparkle(dragonX + (facingLeft ? 10 : -10), dragonY - 10);
      }

      // Draw flame particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);
        p.radius *= 0.96; // expand slightly or shrink

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, p.radius), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();

        if (p.life >= p.maxLife || p.radius <= 0.5) {
          particles.splice(i, 1);
        }
      }

      // Draw the Dragon
      drawDragon(dragonX, dragonY, facingLeft, wingAngle, isBreathingFlame, isSleeping);

      if (isSleeping) {
        drawSleepingZzz(dragonX, dragonY);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      cancelAnimationFrame(animId);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-40 select-none"
      aria-hidden="true"
    />
  );
}
export default CuteDragonPet;
