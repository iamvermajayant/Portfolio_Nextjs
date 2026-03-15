"use client";

import React from "react";

export interface Planet {
  icon: React.ReactNode;
  color: string;       // base sphere color
  label: string;
  size?: number;       // sphere diameter in px, default 52
}

interface PlanetBallProps {
  planet: Planet;
  /** counter-rotate so the icon stays upright while the orbit spins */
  counterRotateDeg: number;
}

function PlanetBall({ planet, counterRotateDeg }: PlanetBallProps) {
  const size = planet.size ?? 52;

  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `rotate(${counterRotateDeg}deg)`,
        position: "relative",
      }}
    >
      {/* Sphere shell */}
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 35%, ${lighten(planet.color, 0.55)} 0%, ${planet.color} 45%, ${darken(planet.color, 0.45)} 100%)`,
          boxShadow: `
            inset -4px -4px 10px rgba(0,0,0,0.5),
            inset 3px 3px 8px rgba(255,255,255,0.18),
            0 0 18px 3px ${planet.color}55,
            0 4px 20px rgba(0,0,0,0.4)
          `,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Specular highlight */}
        <div
          style={{
            position: "absolute",
            top: "14%",
            left: "18%",
            width: "30%",
            height: "22%",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.28)",
            filter: "blur(3px)",
            pointerEvents: "none",
          }}
        />

        {/* Icon */}
        <div
          style={{
            fontSize: size * 0.42,
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.6))",
            zIndex: 1,
          }}
        >
          {planet.icon}
        </div>
      </div>

      {/* Label tooltip on hover */}
      <div
        style={{
          position: "absolute",
          bottom: -22,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 10,
          fontWeight: 600,
          color: planet.color,
          whiteSpace: "nowrap",
          opacity: 0.85,
          letterSpacing: "0.04em",
          pointerEvents: "none",
        }}
      >
        {planet.label}
      </div>
    </div>
  );
}

// ─── Colour helpers ───────────────────────────────────────────────────────────

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((v) => Math.min(255, Math.max(0, Math.round(v))).toString(16).padStart(2, "0")).join("");
}

function lighten(hex: string, amount: number) {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}

function darken(hex: string, amount: number) {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

// ─── Orbit ring ───────────────────────────────────────────────────────────────

interface OrbitRingProps {
  radius: number;
  duration: number;
  reverse?: boolean;
  planets: Planet[];
  /** stagger delay multiplier */
  delayBase?: number;
}

export function OrbitRing({
  radius,
  duration,
  reverse = false,
  planets,
  delayBase = 0,
}: OrbitRingProps) {
  const count = planets.length;
  const angleStep = 360 / count;

  return (
    <>
      {/* Orbit path */}
      <div
        style={{
          position: "absolute",
          width: radius * 2,
          height: radius * 2,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.07)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />

      {planets.map((planet, i) => {
        const initialAngle = angleStep * i;
        const animName = reverse ? "orbit-reverse" : "orbit";
        const stagger = -(duration / count) * i + delayBase;

        return (
          <div
            key={planet.label}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 0,
              height: 0,
            }}
          >
            {/* Spinning arm */}
            <div
              style={{
                position: "absolute",
                width: 0,
                height: 0,
                animation: `${animName} ${duration}s linear infinite`,
                animationDelay: `${stagger}s`,
                transform: `rotate(${initialAngle}deg)`,
                ["--duration" as string]: `${duration}s`,
              }}
            >
              {/* Arm extends to radius */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `translateX(${radius}px) translateY(-50%)`,
                }}
              >
                <PlanetBall
                  planet={planet}
                  counterRotateDeg={reverse ? 0 : 0}
                />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
