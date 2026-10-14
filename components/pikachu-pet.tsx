"use client";

import React, { useEffect, useRef, useState } from "react";
import { HandwrittenArrow } from "@/components/landing/handwritten-note";

interface SparkParticle {
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

interface ThunderboltBeam {
  points: { x: number; y: number }[];
  alpha: number;
  width: number;
}

export function PikachuPet() {
  const [mounted, setMounted] = useState(false);
  const [isParked, setIsParked] = useState(true);
  const isParkedRef = useRef(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wakeUpRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Start parked in top-left corner
    isParkedRef.current = true;

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

    // Pikachu Physics & State: Starts parked in top-left corner below navbar (navbar is h-16 = 64px)
    const PARK_X = 52;
    const PARK_Y = 112;

    let pikaX = PARK_X;
    let pikaY = PARK_Y;
    let targetX = PARK_X;
    let targetY = PARK_Y;
    let currentMouseX = PARK_X;
    let currentMouseY = PARK_Y;
    let vx = 0;
    let vy = 0;
    let facingLeft = false;
    let stepCount = 0;
    let idleCounter = 0;
    let isSleeping = true;
    let isHovering = false;
    let attackCooldown = 0;
    let isAttacking = false;
    let attackDuration = 0;

    const particles: SparkParticle[] = [];
    let activeBolts: ThunderboltBeam[] = [];

    function playPikaSound(wake: boolean) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        const audioCtx = new AudioCtx();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        if (wake) {
          osc.frequency.setValueAtTime(440, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08);
        } else {
          osc.frequency.setValueAtTime(660, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(380, audioCtx.currentTime + 0.1);
        }
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } catch {}
    }

    const togglePark = () => {
      const next = !isParkedRef.current;
      isParkedRef.current = next;
      setIsParked(next);

      playPikaSound(!next);

      if (next) {
        // Park on side: burst of calm yellow sparks
        for (let i = 0; i < 8; i++) {
          spawnElectricSpark(pikaX, pikaY, 3);
        }
      } else {
        // Wake up: immediately target current cursor position and start following!
        isSleeping = false;
        idleCounter = 0;
        targetX = currentMouseX;
        targetY = Math.max(92, currentMouseY);
        for (let i = 0; i < 12; i++) {
          spawnElectricSpark(pikaX, pikaY, 4.5);
        }
        triggerAttack();
      }
    };

    wakeUpRef.current = () => {
      if (isParkedRef.current) {
        togglePark();
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      currentMouseX = e.clientX;
      currentMouseY = Math.max(92, e.clientY);

      const dist = Math.hypot(e.clientX - pikaX, e.clientY - pikaY);
      const hovering = dist < 42;
      if (hovering !== isHovering) {
        isHovering = hovering;
        document.body.style.cursor = hovering ? "pointer" : "";
      }

      if (isParkedRef.current) return;

      targetX = e.clientX;
      targetY = Math.max(92, e.clientY);
      idleCounter = 0;
      if (isSleeping) {
        isSleeping = false;
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    // Clicking directly on Pikachu toggles parking; clicking anywhere else fires lightning
    let lastToggleTime = 0;
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // left click only

      const distToPika = Math.hypot(e.clientX - pikaX, e.clientY - pikaY);
      if (distToPika < 42) {
        const now = Date.now();
        if (now - lastToggleTime < 300) return; // debounce
        lastToggleTime = now;
        togglePark();
        return;
      }

      if (isParkedRef.current) return;

      targetX = e.clientX;
      targetY = e.clientY;
      idleCounter = 0;
      isSleeping = false;
      triggerAttack();
    };
    window.addEventListener("mousedown", onMouseDown);

    function triggerAttack() {
      if (attackDuration > 0) return;
      isAttacking = true;
      attackDuration = 6; // quick, subtle ~100ms zap
      attackCooldown = 30;
    }

    // True fractal thunderbolt algorithm (recursive perpendicular midpoint displacement)
    function createThunderbolt(
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      displace: number,
      minSeg = 12
    ): { x: number; y: number }[] {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dist = Math.hypot(dx, dy);

      if (dist < minSeg) {
        return [{ x: x1, y: y1 }, { x: x2, y: y2 }];
      }

      // Perpendicular normal vector
      const nx = -dy / dist;
      const ny = dx / dist;

      // Displace sharply perpendicular to the path direction
      const offset = (Math.random() - 0.5) * displace;
      const mx = (x1 + x2) / 2 + nx * offset;
      const my = (y1 + y2) / 2 + ny * offset;

      const left = createThunderbolt(x1, y1, mx, my, displace * 0.54, minSeg);
      const right = createThunderbolt(mx, my, x2, y2, displace * 0.54, minSeg);

      return left.concat(right.slice(1));
    }

    function spawnElectricSpark(x: number, y: number, spread = 3) {
      const colors = ["#FFEE58", "#FFD600", "#FFF9C4", "#00E5FF", "#FFFFFF"];
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * spread * 2,
        vy: (Math.random() - 0.5) * spread * 2,
        radius: 1.5 + Math.random() * 2.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0,
        maxLife: 14 + Math.random() * 12,
      });
    }

    // Render high-fidelity anime Pikachu with crisp outlines, iconic anatomy & cel-shading
    const drawPikachu = (
      x: number,
      y: number,
      isLeft: boolean,
      walkStep: number,
      attacking: boolean,
      sleeping: boolean
    ) => {
      ctx.save();
      ctx.translate(x, y);

      // Scaled to a compact, cute desktop companion size (~38px tall)
      const scale = 1.05;
      ctx.scale(scale * (isLeft ? -1 : 1), scale);

      // Bounce & lean physics
      const isMoving = Math.abs(vx) > 0.4 || Math.abs(vy) > 0.4;
      const bounce = sleeping ? Math.sin(walkStep * 0.5) * 0.6 : Math.sin(walkStep * 2) * (isMoving ? 2.6 : 0.8);
      const lean = isMoving ? 0.08 : 0;

      // --- 1. Soft Ground Drop Shadow ---
      ctx.save();
      const shadowScale = sleeping ? 1 : 1 - bounce * 0.08;
      ctx.scale(shadowScale, shadowScale);
      ctx.beginPath();
      ctx.ellipse(0, 21, 15, 4.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(42, 29, 18, 0.16)";
      ctx.fill();
      ctx.restore();

      ctx.translate(0, -bounce);
      ctx.rotate(lean);

      // Palette
      const yellowBase = "#FEDB00";
      const yellowShade = "#E8A700";
      const yellowHighlight = "#FFF478";
      const outlineColor = "#26190E";
      const outlineWidth = 1.8;
      const brownStripe = "#823A14";
      const redCheek = "#FF1F2E";

      // --- 2. Iconic Lightning Bolt Tail (behind torso) ---
      ctx.save();
      ctx.translate(-10, 5);
      const tailWiggle = sleeping ? Math.sin(walkStep * 0.6) * 0.06 : Math.sin(walkStep * 2.8) * 0.26 - (isMoving ? 0.35 : 0.1);
      ctx.rotate(tailWiggle);

      // Tail zigzag path
      const tailPath = new Path2D();
      tailPath.moveTo(0, 0);
      tailPath.lineTo(-4, -4);
      tailPath.lineTo(-2, -9);
      tailPath.lineTo(-8, -13);
      tailPath.lineTo(-5, -20);
      tailPath.lineTo(-13, -24);
      tailPath.lineTo(-10, -33);
      tailPath.lineTo(3, -26);
      tailPath.lineTo(0, -18);
      tailPath.lineTo(4, -19);
      tailPath.lineTo(1, -11);
      tailPath.lineTo(5, -12);
      tailPath.lineTo(2, -4);
      tailPath.closePath();

      // Tail yellow fill
      ctx.fillStyle = yellowBase;
      ctx.fill(tailPath);

      // Brown base on tail (clipped cleanly without creating stray stroke paths)
      ctx.save();
      ctx.clip(tailPath);
      ctx.fillStyle = brownStripe;
      ctx.fillRect(-15, -7, 24, 15);
      ctx.restore();

      // Tail outline ONLY on tailPath
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = outlineWidth;
      ctx.lineJoin = "round";
      ctx.stroke(tailPath);
      ctx.restore();

      // --- 3. Left Ear (behind head) ---
      ctx.save();
      ctx.translate(-8, -14);
      const leftEarAngle = sleeping ? -0.85 : -0.55 + Math.sin(walkStep * 2 + 0.5) * 0.12 - (isMoving ? 0.25 : 0);
      ctx.rotate(leftEarAngle);

      // Ear leaf curve
      const leftEarPath = new Path2D();
      leftEarPath.moveTo(0, 0);
      leftEarPath.quadraticCurveTo(-7, -12, -4, -28);
      leftEarPath.quadraticCurveTo(0, -32, 2, -28);
      leftEarPath.quadraticCurveTo(6, -12, 0, 0);
      leftEarPath.closePath();

      ctx.fillStyle = yellowBase;
      ctx.fill(leftEarPath);

      // Black tip with clean diagonal cut (clipped to ear)
      ctx.save();
      ctx.clip(leftEarPath);
      ctx.beginPath();
      ctx.moveTo(-10, -19);
      ctx.lineTo(10, -23);
      ctx.lineTo(10, -36);
      ctx.lineTo(-10, -36);
      ctx.closePath();
      ctx.fillStyle = "#1E1A17";
      ctx.fill();
      ctx.restore();

      // Stroke ear outline ONLY
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = outlineWidth;
      ctx.lineJoin = "round";
      ctx.stroke(leftEarPath);
      ctx.restore();

      // --- 4. Chubby Pear Body ---
      ctx.save();
      const bodyPath = new Path2D();
      bodyPath.moveTo(-13, 15);
      bodyPath.bezierCurveTo(-16, 8, -13, -2, -6, -6);
      bodyPath.lineTo(6, -6);
      bodyPath.bezierCurveTo(13, -2, 16, 8, 13, 15);
      bodyPath.bezierCurveTo(9, 21, -9, 21, -13, 15);
      bodyPath.closePath();

      // Body yellow
      ctx.fillStyle = yellowBase;
      ctx.fill(bodyPath);

      // Underbody shadow & back stripes (clipped to body)
      ctx.save();
      ctx.clip(bodyPath);
      ctx.beginPath();
      ctx.ellipse(0, 18, 14, 5.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = yellowShade;
      ctx.fill();

      // Back Brown Stripes
      ctx.fillStyle = brownStripe;
      // Upper stripe
      ctx.beginPath();
      ctx.moveTo(-15, 0);
      ctx.quadraticCurveTo(-6, 2, -3, 0);
      ctx.quadraticCurveTo(-6, -3, -15, -3);
      ctx.closePath();
      ctx.fill();
      // Lower stripe
      ctx.beginPath();
      ctx.moveTo(-15, 8);
      ctx.quadraticCurveTo(-6, 10, -3, 8);
      ctx.quadraticCurveTo(-6, 5, -15, 5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Stroke body outline ONLY
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = outlineWidth;
      ctx.lineJoin = "round";
      ctx.stroke(bodyPath);
      ctx.restore();

      // --- 5. Hind Feet ---
      const footCycle = Math.sin(walkStep * 2);
      const leftFootX = -7 + (isMoving ? footCycle * 2.5 : 0);
      const rightFootX = 7 - (isMoving ? footCycle * 2.5 : 0);

      const drawFoot = (fx: number, fy: number) => {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(fx, fy, 4.5, 3.2, 0, 0, Math.PI * 2);
        ctx.fillStyle = yellowBase;
        ctx.fill();
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // 2 tiny toe notches
        ctx.beginPath();
        ctx.moveTo(fx - 1.2, fy + 2.5);
        ctx.lineTo(fx - 1.2, fy + 1);
        ctx.moveTo(fx + 1.2, fy + 2.5);
        ctx.lineTo(fx + 1.2, fy + 1);
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      };
      drawFoot(leftFootX, 19.5);
      drawFoot(rightFootX, 19.5);

      // --- 6. Head & Chubby Cheeks ---
      ctx.save();
      ctx.translate(1, -9);

      // Head shape with cute rounded chubby cheeks
      const headPath = new Path2D();
      headPath.moveTo(-13, 0);
      headPath.bezierCurveTo(-16, 5, -12, 13, 0, 13);
      headPath.bezierCurveTo(12, 13, 16, 5, 13, 0);
      headPath.bezierCurveTo(15, -9, 8, -15, 0, -15);
      headPath.bezierCurveTo(-8, -15, -15, -9, -13, 0);
      headPath.closePath();

      ctx.fillStyle = yellowBase;
      ctx.fill(headPath);

      // Chin shade and forehead highlight clipped to head
      ctx.save();
      ctx.clip(headPath);
      ctx.beginPath();
      ctx.ellipse(0, 12, 12, 3.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = yellowShade;
      ctx.fill();

      // Soft forehead highlight
      ctx.beginPath();
      ctx.ellipse(-2, -9, 6, 2.5, -0.2, 0, Math.PI * 2);
      ctx.fillStyle = yellowHighlight;
      ctx.globalAlpha = 0.55;
      ctx.fill();
      ctx.restore();

      // Stroke head outline ONLY
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = outlineWidth;
      ctx.lineJoin = "round";
      ctx.stroke(headPath);

      // --- 7. Right Ear (in front of head) ---
      ctx.save();
      ctx.translate(7, -12);
      const rightEarAngle = sleeping ? 0.75 : 0.42 + Math.sin(walkStep * 2) * 0.1 - (isMoving ? 0.2 : 0);
      ctx.rotate(rightEarAngle);

      const rightEarPath = new Path2D();
      rightEarPath.moveTo(0, 0);
      rightEarPath.quadraticCurveTo(7, -12, 4, -28);
      rightEarPath.quadraticCurveTo(0, -32, -2, -28);
      rightEarPath.quadraticCurveTo(-6, -12, 0, 0);
      rightEarPath.closePath();

      ctx.fillStyle = yellowBase;
      ctx.fill(rightEarPath);

      // Black tip
      ctx.save();
      ctx.clip(rightEarPath);
      ctx.beginPath();
      ctx.moveTo(-10, -23);
      ctx.lineTo(10, -19);
      ctx.lineTo(10, -36);
      ctx.lineTo(-10, -36);
      ctx.closePath();
      ctx.fillStyle = "#1E1A17";
      ctx.fill();
      ctx.restore();

      // Stroke ear outline ONLY
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = outlineWidth;
      ctx.lineJoin = "round";
      ctx.stroke(rightEarPath);
      ctx.restore();

      // --- 8. Bold Red Electric Cheeks ---
      const drawCheek = (cx: number, cy: number) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 4.4, 0, Math.PI * 2);
        ctx.fillStyle = redCheek;
        ctx.fill();
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Little gloss reflection on cheeks
        ctx.beginPath();
        ctx.arc(cx - 1.2, cy - 1.4, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
        ctx.fill();

        // Electric glow when attacking
        if (attacking) {
          ctx.beginPath();
          ctx.arc(cx, cy, 7, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 245, 100, 0.45)";
          ctx.fill();
        }
      };
      drawCheek(-8, 3.5);
      drawCheek(8, 3.5);

      // --- 9. Front Paws (Clutched cutely in front) ---
      const drawPaw = (px: number, py: number, rot: number) => {
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, 3.6, 2.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = yellowBase;
        ctx.fill();
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // 2 tiny finger lines
        ctx.beginPath();
        ctx.moveTo(-1, 1.8);
        ctx.lineTo(-1, 0.5);
        ctx.moveTo(1, 1.8);
        ctx.lineTo(1, 0.5);
        ctx.stroke();
        ctx.restore();
      };
      drawPaw(-4, 12, 0.35);
      drawPaw(4, 12, -0.35);

      // --- 10. Expressive Eyes ---
      if (sleeping) {
        // Closed happy curved anime eyes (^  ^)
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = outlineColor;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(-4.5, -2, 2.8, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(4.5, -2, 2.8, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();
      } else if (attacking) {
        // Determined, concentrated battle slant eyes (>  <)
        const drawAttackEye = (ex: number, flip: boolean) => {
          ctx.save();
          ctx.translate(ex, -2);
          if (flip) ctx.scale(-1, 1);
          ctx.beginPath();
          ctx.ellipse(0, 0, 3.4, 4, 0.2, 0, Math.PI * 2);
          ctx.fillStyle = outlineColor;
          ctx.fill();
          // White reflection
          ctx.beginPath();
          ctx.arc(-1, -1.5, 1.3, 0, Math.PI * 2);
          ctx.fillStyle = "#FFFFFF";
          ctx.fill();
          ctx.restore();
        };
        drawAttackEye(-4.5, false);
        drawAttackEye(4.5, true);
      } else {
        // Big cute sparkling eyes with double catchlights
        const drawEye = (ex: number) => {
          ctx.beginPath();
          ctx.ellipse(ex, -2, 3.5, 4.3, 0, 0, Math.PI * 2);
          ctx.fillStyle = outlineColor;
          ctx.fill();

          // Main upper-left gleam
          ctx.beginPath();
          ctx.arc(ex - 1, -3.2, 1.6, 0, Math.PI * 2);
          ctx.fillStyle = "#FFFFFF";
          ctx.fill();

          // Secondary lower-right subtle gleam
          ctx.beginPath();
          ctx.arc(ex + 1.2, -0.5, 0.8, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
          ctx.fill();
        };
        drawEye(-4.5);
        drawEye(4.5);
      }

      // --- 11. Tiny Nose ---
      ctx.beginPath();
      ctx.ellipse(0, 1.2, 0.9, 0.7, 0, 0, Math.PI * 2);
      ctx.fillStyle = outlineColor;
      ctx.fill();

      // --- 12. Iconic Pikachu Mouth ---
      if (attacking) {
        // Open wide battle cry ("Pikaaa!")
        ctx.beginPath();
        ctx.ellipse(0, 5.2, 3.2, 3.8, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#9C1645";
        ctx.fill();
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Cute pink tongue
        ctx.beginPath();
        ctx.ellipse(0, 6.4, 2.2, 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#FF7DA7";
        ctx.fill();
      } else if (isMoving) {
        // Joyful open smile
        ctx.beginPath();
        ctx.arc(0, 3.2, 2.4, 0.1, Math.PI * 0.9);
        ctx.fillStyle = "#C2185B";
        ctx.fill();
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      } else {
        // Signature cat-like ":3" curved mouth
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = outlineColor;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(-1.6, 3.6, 1.6, 0.1, Math.PI * 0.95);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(1.6, 3.6, 1.6, 0.05, Math.PI * 0.9);
        ctx.stroke();
      }

      ctx.restore(); // end head
      ctx.restore(); // end pikachu
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isParkedRef.current) {
        targetX = PARK_X;
        targetY = PARK_Y;

        const distToPark = Math.hypot(PARK_X - pikaX, PARK_Y - pikaY);
        if (distToPark < 14) {
          isSleeping = true;
          facingLeft = false;
        }
      } else {
        idleCounter += 1;
        if (idleCounter > 650) {
          isSleeping = true;
        }
      }

      const dx = targetX - pikaX;
      const dy = targetY - pikaY;
      const dist = Math.hypot(dx, dy);

      // Facing orientation
      if (!isParkedRef.current && Math.abs(dx) > 10) {
        facingLeft = dx < 0;
      }

      // Run towards target with a calmer, smoother speed
      const stopDistance = isParkedRef.current ? 8 : 55;
      if (!isSleeping && dist > stopDistance) {
        stepCount += 0.14; // slower, cuter step animation
        const speed = Math.min(dist * 0.04, 4.2);
        vx = (dx / dist) * speed;
        vy = (dy / dist) * speed;
        pikaX += vx;
        pikaY += vy;
      } else {
        vx *= 0.85;
        vy *= 0.85;
        pikaX += vx;
        pikaY += vy;
        stepCount += 0.03;
      }

      // Viewport safety (keeps pet below navbar at top)
      pikaX = Math.max(30, Math.min(canvas.width - 30, pikaX));
      pikaY = Math.max(92, Math.min(canvas.height - 30, pikaY));



      // Only attack when user explicitly clicks (handled in onMouseDown); cooldown counts down
      if (attackCooldown > 0) {
        attackCooldown -= 1;
      }

      // --- Execute Subtle Attack Animation (quick ~100ms zap) ---
      if (attackDuration > 0) {
        attackDuration -= 1;
        isAttacking = true;

        // Origin of attack: Pikachu's electric red cheek
        const cheekX = pikaX + (facingLeft ? -8 : 8);
        const cheekY = pikaY - 5;

        // Subtle cheek crackle sparks
        spawnElectricSpark(cheekX, cheekY, 2.5);

        // Generate clean, sharp fractal thunderbolt towards target
        activeBolts = [];
        const totalDist = Math.hypot(targetX - cheekX, targetY - cheekY);
        const mainDisplacement = Math.min(Math.max(totalDist * 0.16, 14), 36);

        // Main electric bolt (subtle, sharp zigzag)
        const mainBranch = createThunderbolt(cheekX, cheekY, targetX, targetY, mainDisplacement, 10);
        activeBolts.push({ points: mainBranch, alpha: 1, width: 2.2 });

        // Single delicate fork
        const branchIdx = Math.floor(mainBranch.length * 0.5);
        const originPt = mainBranch[branchIdx];
        if (originPt && totalDist > 60) {
          const baseAngle = Math.atan2(targetY - originPt.y, targetX - originPt.x);
          const deflectAngle = baseAngle + (Math.random() < 0.5 ? 0.35 : -0.35);
          const forkLen = totalDist * 0.25;
          const forkTargetX = originPt.x + Math.cos(deflectAngle) * forkLen;
          const forkTargetY = originPt.y + Math.sin(deflectAngle) * forkLen;
          const forkBranch = createThunderbolt(originPt.x, originPt.y, forkTargetX, forkTargetY, mainDisplacement * 0.4, 10);
          activeBolts.push({ points: forkBranch, alpha: 0.75, width: 1.2 });
        }

        // Just 1-2 small sparks at cursor impact
        spawnElectricSpark(targetX, targetY, 3);
      } else {
        isAttacking = false;
        activeBolts = [];
      }

      // Draw subtle active lightning bolts with soft glow & white core
      for (const bolt of activeBolts) {
        if (bolt.points.length < 2) continue;

        // Soft electric glow
        ctx.save();
        ctx.globalAlpha = bolt.alpha * 0.9;
        ctx.strokeStyle = "#FFEE58";
        ctx.lineWidth = bolt.width * 1.8;
        ctx.lineCap = "round";
        ctx.lineJoin = "miter";
        ctx.shadowColor = "#FFD600";
        ctx.shadowBlur = 8;

        ctx.beginPath();
        for (let i = 0; i < bolt.points.length; i++) {
          const pt = bolt.points[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();

        // Thin white core
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = Math.max(1, bolt.width * 0.5);
        ctx.shadowBlur = 2;
        ctx.stroke();
        ctx.restore();
      }

      // Render sparks
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      // Draw Pikachu
      drawPikachu(pikaX, pikaY, facingLeft, stepCount, isAttacking, isSleeping);

      // Sleep animation
      if (isSleeping) {
        ctx.save();
        ctx.font = "bold 14px monospace";
        ctx.fillStyle = "#FFD600";
        const floatY = (stepCount * 12) % 20;
        ctx.globalAlpha = Math.max(0, 1 - floatY / 20);
        const zOffset = facingLeft ? -14 : 14;
        ctx.fillText("z", pikaX + zOffset, pikaY - 22 - floatY * 0.6);
        ctx.font = "bold 18px monospace";
        ctx.fillText("Z", pikaX + zOffset * 1.3, pikaY - 32 - floatY);
        ctx.restore();
      }

      // Hover tooltip badge directly on canvas
      if (isHovering) {
        const label = isParkedRef.current ? "Click to follow ⚡" : "Click to park 💤";
        ctx.save();
        ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
        const tw = ctx.measureText(label).width;
        const bx = Math.max((tw + 24) / 2 + 10, Math.min(canvas.width - (tw + 24) / 2 - 10, pikaX));
        const by = pikaY < 125 ? pikaY + 36 : pikaY - 42;

        ctx.fillStyle = "rgba(18, 18, 22, 0.94)";
        ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(bx - (tw + 20) / 2, by - 12, tw + 20, 22, 11);
        ctx.fill();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.fillStyle = isParkedRef.current ? "#FFEE58" : "#FFFFFF";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, bx, by - 1);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      wakeUpRef.current = null;
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      document.body.style.cursor = "";
      cancelAnimationFrame(animId);
    };
  }, [mounted]);

  if (!mounted) {
    return (
      <div
        className="fixed top-[92px] left-[84px] z-50 hidden sm:flex items-start gap-1 select-none pointer-events-none"
        aria-hidden="true"
      >
        <HandwrittenArrow className="-rotate-6 size-6 sm:size-7 text-muted-foreground/80 shrink-0" />
        <span className="font-handwritten text-base sm:text-lg text-muted-foreground leading-snug -rotate-3">
          click for pet
          <span className="block text-amber-600 dark:text-amber-400 font-medium text-xs sm:text-sm">
            which follows cursor ⚡
          </span>
        </span>
      </div>
    );
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-40 select-none"
        aria-hidden="true"
      />

      {isParked && (
        <div
          onClick={() => wakeUpRef.current?.()}
          className="fixed top-[92px] left-[84px] z-50 hidden sm:flex items-start gap-1 cursor-pointer select-none group transition-opacity duration-300"
          title="Click for pet which follows cursor"
        >
          <HandwrittenArrow className="-rotate-6 size-6 sm:size-7 text-muted-foreground/80 group-hover:text-amber-500 transition-colors shrink-0" />
          <span className="font-handwritten text-base sm:text-lg text-muted-foreground leading-snug -rotate-3 group-hover:text-foreground transition-colors">
            click for pet
            <span className="block text-amber-600 dark:text-amber-400 font-medium text-xs sm:text-sm">
              which follows cursor ⚡
            </span>
          </span>
        </div>
      )}
    </>
  );
}

export default PikachuPet;
