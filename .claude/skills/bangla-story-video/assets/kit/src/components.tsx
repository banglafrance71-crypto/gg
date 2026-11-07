import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT } from "./theme";

export type Tint = "danger" | "brand" | "neutral";

const TINTS: Record<Tint, [string, string, string]> = {
  danger: ["#FF4D5E", "#FF8A3D", "#3A1020"],
  brand: ["#2BF59A", "#FFC21A", "#0B3A26"],
  neutral: ["#35C9FF", "#6A5CFF", "#0D2240"],
};

/* ---------- Animated background ---------- */
export const Bg: React.FC<{ tint?: Tint }> = ({ tint = "brand" }) => {
  const f = useCurrentFrame();
  const [a, b, base] = TINTS[tint];
  const o1x = 25 + Math.sin(f / 90) * 8;
  const o1y = 30 + Math.cos(f / 110) * 8;
  const o2x = 75 + Math.cos(f / 100) * 8;
  const o2y = 70 + Math.sin(f / 80) * 8;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 120%, ${base} 0%, ${C.bg} 65%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${o1x}% ${o1y}%, ${a}2E 0%, transparent 38%), radial-gradient(circle at ${o2x}% ${o2y}%, ${b}26 0%, transparent 40%)`,
        }}
      />
      {/* perspective grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${a}14 1px, transparent 1px), linear-gradient(90deg, ${a}14 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          backgroundPosition: `0px ${(f * 0.6) % 80}px`,
          maskImage:
            "radial-gradient(ellipse at 50% 50%, black 10%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, black 10%, transparent 70%)",
        }}
      />
      <Particles color={a} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const PARTS = new Array(28).fill(0).map((_, i) => ({
  x: (i * 137.5) % 100,
  y: (i * 61.8) % 100,
  s: 2 + (i % 4),
  sp: 0.15 + ((i * 7) % 10) / 25,
}));

const Particles: React.FC<{ color: string }> = ({ color }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {PARTS.map((p, i) => {
        const y = (p.y - f * p.sp * 0.25 + 1000) % 100;
        const op = 0.15 + 0.35 * (0.5 + 0.5 * Math.sin(f / 20 + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${y}%`,
              width: p.s,
              height: p.s,
              borderRadius: "50%",
              background: color,
              opacity: op,
              boxShadow: `0 0 ${p.s * 4}px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- Kinetic word reveal ---------- */
export const Words: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  weight?: number;
  stagger?: number;
  hl?: string[];
  hlColor?: string;
  align?: "left" | "center" | "right";
  lineHeight?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  delay = 0,
  size = 64,
  color = C.text,
  weight = 600,
  stagger = 3,
  hl = [],
  hlColor = C.green,
  align = "left",
  lineHeight = 1.4,
  style,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        color,
        lineHeight,
        textAlign: align,
        display: "flex",
        flexWrap: "wrap",
        justifyContent:
          align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        columnGap: size * 0.28,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const s = spring({
          frame: f - delay - i * stagger,
          fps,
          config: { damping: 200 },
          durationInFrames: 22,
        });
        const isHl = hl.some((h) => w.includes(h));
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: s,
              transform: `translateY(${(1 - s) * size * 0.6}px)`,
              filter: `blur(${(1 - s) * 8}px)`,
              color: isHl ? hlColor : undefined,
              textShadow: isHl ? `0 0 30px ${hlColor}66` : undefined,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/* Fades its children out at the end of its own window */
export const Exit: React.FC<{
  dur: number;
  out?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ dur, out = 14, children, style }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [dur - out, dur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(f, [dur - out, dur], [0, -30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  return (
    <div style={{ opacity: o, transform: `translateY(${y}px)`, ...style }}>
      {children}
    </div>
  );
};

/* A timed line: appears at `from`, leaves at from+dur */
export const Line: React.FC<{
  from: number;
  dur: number;
  last?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ from, dur, last, style, children }) => (
  <Sequence from={from} durationInFrames={dur} layout="none">
    <Exit dur={last ? dur + 100 : dur} style={style}>
      {children}
    </Exit>
  </Sequence>
);

export const useSpring = (delay = 0, damping = 14, dur?: number) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: f - delay,
    fps,
    config: { damping, mass: 0.8 },
    durationInFrames: dur,
  });
};

export const Pill: React.FC<{
  children: React.ReactNode;
  color?: string;
  delay?: number;
  size?: number;
}> = ({ children, color = C.green, delay = 0, size = 40 }) => {
  const s = useSpring(delay, 12);
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: size,
        color: C.text,
        padding: `${size * 0.35}px ${size * 0.8}px`,
        borderRadius: 999,
        background: `linear-gradient(135deg, ${color}33, ${color}11)`,
        border: `2px solid ${color}88`,
        boxShadow: `0 0 40px ${color}33`,
        transform: `scale(${0.6 + 0.4 * s})`,
        opacity: Math.min(1, s * 1.5),
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      {children}
    </div>
  );
};

export const Card: React.FC<{
  children: React.ReactNode;
  delay?: number;
  accent?: string;
  style?: React.CSSProperties;
  from?: "bottom" | "left" | "right";
}> = ({ children, delay = 0, accent = C.green, style, from = "bottom" }) => {
  const s = useSpring(delay, 16);
  const off = (1 - s) * 120;
  const t =
    from === "bottom"
      ? `translateY(${off}px)`
      : from === "left"
        ? `translateX(${-off}px)`
        : `translateX(${off}px)`;
  return (
    <div
      style={{
        background: C.card,
        border: `1.5px solid ${C.cardBorder}`,
        borderTop: `3px solid ${accent}`,
        borderRadius: 28,
        padding: 44,
        backdropFilter: "blur(12px)",
        boxShadow: `0 30px 80px rgba(0,0,0,0.45), 0 0 60px ${accent}18`,
        transform: t,
        opacity: Math.min(1, s * 1.4),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* Scene wrapper with gentle global push-in */
export const Scene: React.FC<{ tint?: Tint; children: React.ReactNode }> = ({
  tint,
  children,
}) => {
  const f = useCurrentFrame();
  const sc = 1 + f * 0.00012;
  return (
    <AbsoluteFill>
      <Bg tint={tint} />
      <AbsoluteFill style={{ transform: `scale(${sc})` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
