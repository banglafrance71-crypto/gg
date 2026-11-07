import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "./theme";

/* Cinematic-silhouette kit — the "documentary story" look:
   faceless flat silhouettes, one mood colour per scene, pools of light, haze,
   narration typography with ONE highlighted keyword, symbolic props. */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* Mood palettes: [background top, background bottom, silhouette, accent] */
export const MOOD = {
  grief: ["#2b3a4e", "#0e1620", "#0b0f15", "#e8eef5"], // cold blue night
  village: ["#d9cdb4", "#b9a582", "#2b241c", "#7a5a2a"], // dusty beige day
  warm: ["#6b4a2e", "#2a1c12", "#1a120c", "#f2b45a"], // lamp-lit interior
  shame: ["#8a1c1c", "#3a0a0a", "#160505", "#ff5a5a"], // red climax
  festive: ["#7a2f1c", "#3b150c", "#1b0d08", "#ffd27a"], // pandal / feast
  void: ["#121212", "#000000", "#000000", "#ffffff"], // title cards
} as const;
export type Mood = keyof typeof MOOD;

export const Backdrop: React.FC<{ mood: Mood; light?: { x: number; y: number; r?: number } }> = ({ mood, light }) => {
  const [a, b] = MOOD[mood];
  return (
    <AbsoluteFill style={{ background: `linear-gradient(${a}, ${b})` }}>
      {light ? (
        <AbsoluteFill
          style={{ background: `radial-gradient(circle at ${light.x}% ${light.y}%, rgba(255,230,180,0.28) 0%, transparent ${light.r ?? 35}%)` }}
        />
      ) : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

/* Drifting fog band */
export const Haze: React.FC<{ y?: number; opacity?: number }> = ({ y = 700, opacity = 0.35 }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: -400 + Math.sin(f / 90) * 120,
        top: y,
        width: 2700,
        height: 260,
        background: "radial-gradient(ellipse at center, rgba(255,255,255,0.5), transparent 70%)",
        filter: "blur(30px)",
        opacity,
      }}
    />
  );
};

/* Spotlight pool on the floor under a figure */
export const Spot: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 320 }) => (
  <div
    style={{
      position: "absolute",
      left: x - w / 2,
      top: y - w * 0.09,
      width: w,
      height: w * 0.18,
      borderRadius: "50%",
      background: "radial-gradient(ellipse, rgba(255,255,255,0.35), transparent 70%)",
    }}
  />
);

/* Faceless silhouette figure. (x,y) = feet centre. */
export const Figure: React.FC<{
  x: number;
  y: number;
  h?: number;
  color?: string;
  tupi?: boolean; // white prayer cap
  cane?: boolean;
  shawl?: boolean; // seated mother / woman in shawl
  sway?: boolean;
  label?: React.ReactNode; // chest label (identity card / tag)
}> = ({ x, y, h = 520, color = "#0b0f15", tupi, cane, shawl, sway = true, label }) => {
  const f = useCurrentFrame();
  const s = h / 520;
  const r = sway ? Math.sin(f / 40) * 0.6 : 0;
  return (
    <div style={{ position: "absolute", left: x - 130 * s, top: y - h, width: 260 * s, height: h, transform: `rotate(${r}deg)`, transformOrigin: "50% 100%" }}>
      <svg width={260 * s} height={h} viewBox="0 0 260 520">
        {shawl ? (
          <path d="M130 120 C60 130 40 300 30 520 H230 C220 300 200 130 130 120 Z M130 40 a40 44 0 1 1 0.1 0" fill={color} />
        ) : (
          <g fill={color}>
            <ellipse cx={130} cy={62} rx={38} ry={44} />
            <rect x={116} y={98} width={28} height={26} />
            <path d="M70 130 Q130 110 190 130 L200 330 L60 330 Z" />
            <path d="M60 300 L200 300 L190 360 L70 360 Z" />
            <rect x={82} y={340} width={38} height={180} rx={10} />
            <rect x={140} y={340} width={38} height={180} rx={10} />
            <rect x={42} y={138} width={30} height={190} rx={14} transform="rotate(4 57 138)" />
            <rect x={188} y={138} width={30} height={190} rx={14} transform="rotate(-4 203 138)" />
          </g>
        )}
        {tupi ? <ellipse cx={130} cy={26} rx={30} ry={10} fill="#f1efe8" /> : null}
        {cane ? <path d="M210 320 L232 520" stroke="#5a4630" strokeWidth={8} strokeLinecap="round" /> : null}
      </svg>
      {label ? <div style={{ position: "absolute", left: "50%", top: h * 0.34, transform: "translateX(-50%)" }}>{label}</div> : null}
    </div>
  );
};

/* Chest identity card, e.g. name: "বড় ছেলে" / role: "সন্তান" (can be struck through) */
export const IdCard: React.FC<{ top: string; main: string; strike?: number; stamp?: string; stampDelay?: number }> = ({
  top,
  main,
  strike = 0,
  stamp,
  stampDelay = 0,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const st = stamp ? spring({ frame: f - stampDelay, fps, config: { damping: 9 } }) : 0;
  return (
    <div style={{ position: "relative", width: 200, background: "#f4efe4", borderTop: "8px solid #2f6fb0", borderRadius: 6, padding: "10px 14px", fontFamily: FONT }}>
      <div style={{ fontSize: 16, color: "#555" }}>{top}</div>
      <div style={{ position: "relative", fontSize: 30, fontWeight: 700, color: "#1a1a1a" }}>
        {main}
        <div style={{ position: "absolute", left: 0, top: "52%", height: 4, width: `${strike * 100}%`, background: "#c62828" }} />
      </div>
      {stamp ? (
        <div
          style={{
            position: "absolute",
            left: -40,
            top: 40,
            padding: "4px 14px",
            border: "4px solid #c62828",
            color: "#c62828",
            background: "rgba(255,255,255,0.85)",
            fontSize: 30,
            fontWeight: 800,
            transform: `rotate(-8deg) scale(${2 - st})`,
            opacity: Math.min(1, st * 2),
            whiteSpace: "nowrap",
          }}
        >
          {stamp}
        </div>
      ) : null}
    </div>
  );
};

/* Narration line: short, white, one keyword in accent colour. Fades in softly, no bounce. */
export const Narration: React.FC<{
  text: string;
  hl?: string[];
  accent?: string;
  size?: number;
  delay?: number;
  pos?: "top-left" | "top" | "bottom" | "center";
  sub?: string; // smaller second line
}> = ({ text, hl = [], accent = "#f2b45a", size = 54, delay = 0, pos = "top-left", sub }) => {
  const f = useCurrentFrame() - delay;
  const o = interpolate(f, [0, 14], [0, 1], clamp);
  const y = interpolate(f, [0, 14], [12, 0], clamp);
  const place: React.CSSProperties =
    pos === "top-left"
      ? { left: 110, top: 90, textAlign: "left" }
      : pos === "top"
        ? { left: 0, right: 0, top: 80, textAlign: "center" }
        : pos === "bottom"
          ? { left: 0, right: 0, bottom: 90, textAlign: "center" }
          : { left: 0, right: 0, top: 470, textAlign: "center" };
  return (
    <div style={{ position: "absolute", ...place, opacity: o, transform: `translateY(${y}px)`, fontFamily: FONT, color: "#fff", textShadow: "0 2px 14px rgba(0,0,0,0.6)" }}>
      <div style={{ fontSize: size, fontWeight: 700 }}>
        {text.split(" ").map((w, i) => (
          <span key={i} style={{ color: hl.some((h) => w.includes(h)) ? accent : undefined }}>
            {w}{" "}
          </span>
        ))}
      </div>
      {sub ? <div style={{ fontSize: size * 0.55, fontWeight: 500, opacity: 0.85, marginTop: 8 }}>{sub}</div> : null}
    </div>
  );
};

/* Big single-word emotional stamp (e.g. "ছিঃ") with glow */
export const Stamp: React.FC<{ word: string; color?: string; x?: number; y?: number; size?: number; delay?: number }> = ({
  word,
  color = "#ff4d4d",
  x = 1300,
  y = 180,
  size = 200,
  delay = 0,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 10 } });
  return (
    <div style={{ position: "absolute", left: x, top: y, fontFamily: FONT, fontWeight: 800, fontSize: size, color, textShadow: `0 0 40px ${color}`, transform: `scale(${1.6 - 0.6 * s})`, opacity: s }}>
      {word}
    </div>
  );
};

/* Count visualised as a grid of glowing dots (e.g. "৩০০ জন") */
export const DotCrowd: React.FC<{ count: number; cols?: number; x?: number; y?: number; gap?: number; color?: string; delay?: number }> = ({
  count,
  cols = 25,
  x = 460,
  y = 330,
  gap = 40,
  color = "#f2b45a",
  delay = 0,
}) => {
  const f = useCurrentFrame() - delay;
  return (
    <>
      {new Array(count).fill(0).map((_, i) => {
        const o = interpolate(f - i * 0.25, [0, 6], [0, 1], clamp);
        const tw = 0.6 + 0.4 * Math.sin(f / 9 + i);
        return (
          <div
            key={i}
            style={{ position: "absolute", left: x + (i % cols) * gap, top: y + Math.floor(i / cols) * gap, width: 10, height: 10, borderRadius: 5, background: color, boxShadow: `0 0 12px ${color}`, opacity: o * tw }}
          />
        );
      })}
    </>
  );
};

/* Framed portrait of the deceased / absent person, with black mourning ribbon */
export const Portrait: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 220 }) => (
  <svg width={w} height={w * 1.25} viewBox="0 0 200 250" style={{ position: "absolute", left: x, top: y }}>
    <rect x={4} y={4} width={192} height={242} fill="#2a1d12" />
    <rect x={18} y={18} width={164} height={214} fill="#c8b9a0" />
    <ellipse cx={100} cy={100} rx={36} ry={42} fill="#2b241c" />
    <path d="M40 232 Q100 140 160 232 Z" fill="#2b241c" />
    <path d="M160 4 L196 4 L196 40 Z" fill="#000" />
  </svg>
);

/* Ruled notebook page for lists / "accounts" (ওদের হিসাব / আমার হিসাব) */
export const PaperNote: React.FC<{ title?: string; lines: { t: string; color?: string; delay: number }[]; x?: number; y?: number; w?: number; h?: number }> = ({
  title,
  lines,
  x = 560,
  y = 120,
  w = 800,
  h = 840,
}) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        background: "#f6f1e6",
        backgroundImage: "linear-gradient(rgba(70,110,190,0.18) 2px, transparent 2px)",
        backgroundSize: "100% 46px",
        boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        fontFamily: FONT,
        padding: "60px 60px 0 110px",
      }}
    >
      <div style={{ position: "absolute", left: 80, top: 0, bottom: 0, width: 3, background: "rgba(200,60,60,0.55)" }} />
      {title ? <div style={{ fontSize: 48, fontWeight: 700, color: "#b0302a", marginBottom: 20 }}>{title}</div> : null}
      {lines.map((l, i) => (
        <div key={i} style={{ fontSize: 36, color: l.color ?? "#23324d", lineHeight: "46px", clipPath: `inset(0 ${100 - interpolate(f - l.delay, [0, 24], [0, 100], clamp)}% 0 0)` }}>
          {l.t}
        </div>
      ))}
    </div>
  );
};

/* Creator / brand credit, bottom-right, small and quiet — present in every shot */
export const Credit: React.FC<{ name: string }> = ({ name }) => (
  <div style={{ position: "absolute", right: 40, bottom: 26, fontFamily: FONT, fontSize: 22, color: "rgba(255,255,255,0.45)" }}>{name}</div>
);

/* Title card on black (opening / closing) */
export const TitleCard: React.FC<{ title: string; by?: string }> = ({ title, by }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 30], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "#000", alignItems: "center", justifyContent: "center", flexDirection: "column", opacity: o }}>
      <div style={{ fontFamily: FONT, fontSize: 140, fontWeight: 800, color: "#e9e3d6" }}>{title}</div>
      <div style={{ width: 600, height: 2, background: "rgba(255,255,255,0.25)", margin: "20px 0" }} />
      {by ? <div style={{ fontFamily: FONT, fontSize: 30, color: "rgba(255,255,255,0.55)" }}>{by}</div> : null}
    </AbsoluteFill>
  );
};
