import React from "react";
import { useCurrentFrame } from "remotion";

/* Cartoon characters drawn in SVG.
   Local coordinates: hip at (0,0), head centre at (0,-205). Standing feet at y≈168. */

export type Expr =
  | "happy"
  | "neutral"
  | "sad"
  | "worried"
  | "confused"
  | "shocked"
  | "tired"
  | "sleep"
  | "hopeful"
  | "proud";
export type Pose = "stand" | "sit" | "walk";
export type Arm =
  | "down"
  | "handle"
  | "wave"
  | "thumb"
  | "tea"
  | "scratch"
  | "cross"
  | "watch"
  | "plug";

export type PersonProps = {
  expr?: Expr;
  pose?: Pose;
  arm?: Arm;
  shirt?: string;
  lungi?: string;
  gamchha?: boolean;
  cap?: string;
  skin?: string;
  facing?: 1 | -1;
  look?: number; // pupil offset -1..1
  seed?: number;
  walkSpeed?: number;
  shin?: number; // sitting shin length
  hideLegs?: boolean;
};

const SKIN = "#C68A5E";
const INK = "#1b1410";

const Limb: React.FC<{ pts: [number, number][]; sleeve: string; skin: string; hand?: boolean }> = ({
  pts,
  sleeve,
  skin,
  hand = true,
}) => {
  const [s, e, h] = pts;
  const mx = s[0] + (e[0] - s[0]) * 0.55;
  const my = s[1] + (e[1] - s[1]) * 0.55;
  return (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d={`M${s[0]} ${s[1]} L${e[0]} ${e[1]} L${h[0]} ${h[1]}`} stroke={skin} strokeWidth={19} />
      <path d={`M${s[0]} ${s[1]} L${mx} ${my}`} stroke={sleeve} strokeWidth={28} />
      {hand ? <circle cx={h[0]} cy={h[1]} r={13} fill={skin} /> : null}
    </g>
  );
};

const ARMS: Record<Arm, { l: [number, number][]; r: [number, number][] }> = {
  down: { l: [[-46, -128], [-58, -68], [-60, -8]], r: [[46, -128], [58, -68], [60, -8]] },
  handle: { l: [[-46, -128], [5, -92], [42, -70]], r: [[46, -128], [72, -96], [64, -66]] },
  wave: { l: [[-46, -128], [-58, -68], [-60, -8]], r: [[46, -128], [100, -170], [96, -250]] },
  thumb: { l: [[-46, -128], [-58, -68], [-60, -8]], r: [[46, -128], [86, -78], [70, -128]] },
  tea: { l: [[-46, -128], [-58, -68], [-50, -10]], r: [[46, -128], [70, -88], [30, -168]] },
  scratch: { l: [[-46, -128], [-58, -68], [-60, -8]], r: [[46, -128], [92, -196], [40, -248]] },
  cross: { l: [[-46, -128], [-50, -78], [28, -92]], r: [[46, -128], [50, -76], [-26, -84]] },
  watch: { l: [[-46, -128], [-30, -84], [34, -118]], r: [[46, -128], [58, -68], [60, -8]] },
  plug: { l: [[-46, -128], [-58, -68], [-60, -8]], r: [[46, -128], [100, -100], [150, -96]] },
};

export const PersonG: React.FC<PersonProps> = ({
  expr = "neutral",
  pose = "stand",
  arm = "down",
  shirt = "#3E6FB0",
  lungi = "#2F6B4F",
  gamchha = true,
  cap,
  skin = SKIN,
  facing = 1,
  look = 0,
  seed = 0,
  walkSpeed = 1,
  shin = 190,
  hideLegs,
}) => {
  const f = useCurrentFrame();
  const blink = (f + seed * 37) % 96 < 4;
  const breathe = Math.sin((f + seed * 11) / 14) * 2;
  const closed = expr === "sleep";
  const eyeRy = closed || blink ? 1.5 : expr === "tired" ? 4.5 : expr === "shocked" ? 12 : 10;
  const eyeRx = expr === "shocked" ? 11 : 9;
  const px = look * 4;
  const step = Math.sin((f * walkSpeed) / 4);

  /* brows: [outer-y, inner-y] per side (left side mirrored) */
  const brow: Record<Expr, [number, number, number, number]> = {
    happy: [-228, -231, -228, -231],
    proud: [-230, -229, -230, -229],
    neutral: [-227, -227, -227, -227],
    sad: [-222, -233, -222, -233],
    worried: [-224, -234, -224, -234],
    confused: [-226, -225, -240, -232],
    shocked: [-236, -238, -236, -238],
    tired: [-224, -226, -224, -226],
    sleep: [-224, -224, -224, -224],
    hopeful: [-232, -236, -232, -236],
  };
  const [lo, li, ro, ri] = brow[expr];

  const mouth = () => {
    switch (expr) {
      case "happy":
      case "proud":
        return (
          <path d="M-16 -176 Q0 -154 16 -176 Z" fill="#7a2b22" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        );
      case "hopeful":
        return <path d="M-12 -172 Q0 -162 12 -172" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />;
      case "sad":
      case "tired":
        return <path d="M-12 -164 Q0 -176 12 -164" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />;
      case "worried":
        return <path d="M-13 -166 Q-6 -172 0 -167 Q6 -162 13 -168" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />;
      case "confused":
        return <path d="M-12 -168 Q-2 -172 4 -168 Q10 -165 14 -172" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />;
      case "shocked":
        return <ellipse cx={0} cy={-168} rx={8} ry={11} fill="#5a1d17" stroke={INK} strokeWidth={3} />;
      case "sleep":
        return <ellipse cx={0} cy={-168} rx={5} ry={6} fill="#5a1d17" />;
      default:
        return <path d="M-10 -169 L10 -169" stroke={INK} strokeWidth={4} strokeLinecap="round" />;
    }
  };

  const arms = ARMS[arm];
  const lungiFill = `url(#chk-${lungi.slice(1)})`;

  return (
    <g transform={`scale(${facing} 1)`}>
      <defs>
        <pattern id={`chk-${lungi.slice(1)}`} width={22} height={22} patternUnits="userSpaceOnUse">
          <rect width={22} height={22} fill={lungi} />
          <rect width={22} height={6} fill="rgba(255,255,255,0.18)" />
          <rect width={6} height={22} fill="rgba(0,0,0,0.18)" />
        </pattern>
        <pattern id="gam" width={14} height={14} patternUnits="userSpaceOnUse">
          <rect width={14} height={14} fill="#C9302C" />
          <rect width={14} height={4} fill="#F4E9DA" />
          <rect width={4} height={14} fill="#F4E9DA" opacity={0.7} />
        </pattern>
      </defs>
      {/* legs */}
      {hideLegs ? null : pose === "sit" ? (
        <g>
          <path d={`M-42 -6 L46 -8 L120 4 L120 44 L-42 40 Z`} fill={lungiFill} />
          <path d={`M84 30 L126 30 L124 ${shin - 20} L86 ${shin - 20} Z`} fill={lungiFill} />
          <rect x={92} y={shin - 22} width={26} height={22} fill={skin} />
          <ellipse cx={112} cy={shin + 2} rx={26} ry={9} fill="#3b2a1e" />
        </g>
      ) : (
        <g>
          <path
            d={`M-42 -6 L42 -6 L${46 + (pose === "walk" ? step * 10 : 0)} 148 L${-46 + (pose === "walk" ? step * 10 : 0)} 148 Z`}
            fill={lungiFill}
          />
          <rect x={-30 + (pose === "walk" ? step * 22 : 0)} y={146} width={18} height={18} fill={skin} />
          <rect x={12 - (pose === "walk" ? step * 22 : 0)} y={146} width={18} height={18} fill={skin} />
          <ellipse cx={-18 + (pose === "walk" ? step * 22 : 0)} cy={167} rx={20} ry={7} fill="#3b2a1e" />
          <ellipse cx={24 - (pose === "walk" ? step * 22 : 0)} cy={167} rx={20} ry={7} fill="#3b2a1e" />
        </g>
      )}
      <g transform={`translate(0 ${breathe * 0.4})`}>
        {/* back arm (left) for poses where it is behind */}
        {/* torso */}
        <path d="M-48 -140 Q-54 -60 -44 0 L44 0 Q54 -60 48 -140 Q0 -158 -48 -140 Z" fill={shirt} />
        <path d="M0 -146 L0 -4" stroke="rgba(0,0,0,0.18)" strokeWidth={3} />
        {[-120, -90, -60, -30].map((y) => (
          <circle key={y} cx={4} cy={y} r={3} fill="rgba(255,255,255,0.55)" />
        ))}
        <rect x={14} y={-118} width={22} height={20} rx={3} fill="rgba(0,0,0,0.12)" />
        <path d="M-44 -6 L44 -6" stroke="rgba(0,0,0,0.25)" strokeWidth={6} />
        {/* neck */}
        <rect x={-12} y={-172} width={24} height={30} fill={skin} />
        {gamchha ? (
          <g>
            <path d="M-38 -146 Q0 -124 38 -146 L42 -132 Q0 -106 -42 -132 Z" fill="url(#gam)" />
            <path d="M24 -140 L44 -140 L40 -58 L22 -62 Z" fill="url(#gam)" />
          </g>
        ) : (
          <path d="M-20 -146 L0 -126 L20 -146" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={5} />
        )}
        {/* arms */}
        <Limb pts={arms.l} sleeve={shirt} skin={skin} />
        <Limb pts={arms.r} sleeve={shirt} skin={skin} />
        {arm === "thumb" ? <rect x={64} y={-158} width={11} height={24} rx={5} fill={skin} /> : null}
        {arm === "tea" ? (
          <g>
            <path d="M14 -178 L46 -178 L42 -150 L18 -150 Z" fill="#f3efe6" stroke="#b8ab98" strokeWidth={2} />
            <path d="M46 -172 Q56 -166 46 -158" stroke="#b8ab98" strokeWidth={3} fill="none" />
            <path d={`M24 -186 Q30 -${196 + (f % 20)} 26 -206 M36 -186 Q42 -${198 + ((f + 10) % 20)} 38 -208`} stroke="rgba(255,255,255,0.55)" strokeWidth={3} fill="none" />
          </g>
        ) : null}
        {arm === "watch" ? <rect x={20} y={-126} width={16} height={14} rx={3} fill="#e8d9a8" stroke="#6d5a2c" strokeWidth={2} /> : null}
        {arm === "plug" ? (
          <g>
            <rect x={146} y={-110} width={40} height={28} rx={6} fill="#24282e" />
            <rect x={184} y={-104} width={14} height={5} fill="#c9ced4" />
            <rect x={184} y={-92} width={14} height={5} fill="#c9ced4" />
          </g>
        ) : null}
        {/* head */}
        <g transform={`translate(0 ${expr === "sad" || expr === "tired" || expr === "sleep" ? 4 : 0}) rotate(${expr === "confused" ? -6 : expr === "sleep" ? 10 : 0} 0 -190)`}>
          <circle cx={-44} cy={-204} r={10} fill={skin} />
          <circle cx={44} cy={-204} r={10} fill={skin} />
          <ellipse cx={0} cy={-205} rx={43} ry={48} fill={skin} />
          <ellipse cx={0} cy={-180} rx={34} ry={20} fill="rgba(0,0,0,0.06)" />
          {cap ? (
            <g>
              <path d="M-46 -218 Q-46 -266 0 -266 Q46 -266 46 -218 Z" fill={cap} />
              <path d="M10 -222 Q50 -228 72 -216 L70 -208 Q40 -214 10 -212 Z" fill={cap} />
              <circle cx={0} cy={-246} r={9} fill="#FFC21A" />
            </g>
          ) : (
            <path d="M-45 -212 Q-50 -262 0 -258 Q50 -262 45 -212 Q36 -240 0 -238 Q-36 -240 -45 -212 Z" fill={INK} />
          )}
          {/* eyes */}
          {[-16, 16].map((x) => (
            <g key={x}>
              <ellipse cx={x} cy={-208} rx={eyeRx} ry={eyeRy} fill="#fff" />
              {eyeRy > 3 ? <circle cx={x + px} cy={-207 + (expr === "sad" ? 2 : 0)} r={expr === "shocked" ? 4 : 5.5} fill={INK} /> : null}
            </g>
          ))}
          {expr === "tired" ? (
            <g fill={skin}>
              <rect x={-26} y={-220} width={20} height={9} />
              <rect x={6} y={-220} width={20} height={9} />
            </g>
          ) : null}
          {/* brows */}
          <path d={`M-28 ${lo} L-6 ${li}`} stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <path d={`M28 ${ro} L6 ${ri}`} stroke={INK} strokeWidth={5} strokeLinecap="round" />
          {/* nose + moustache */}
          <path d="M-2 -204 L-6 -190 Q0 -186 6 -189" stroke="rgba(80,40,20,0.55)" strokeWidth={3} fill="none" strokeLinecap="round" />
          <path d="M-20 -181 Q0 -192 20 -181 Q10 -176 0 -180 Q-10 -176 -20 -181 Z" fill={INK} />
          {mouth()}
          {expr === "happy" || expr === "proud" ? (
            <g fill="rgba(220,90,80,0.28)">
              <circle cx={-26} cy={-188} r={7} />
              <circle cx={26} cy={-188} r={7} />
            </g>
          ) : null}
          {expr === "sad" ? <path d={`M22 ${-198 + ((f / 2) % 26)} q4 8 0 10 q-4 -2 0 -10`} fill="#7fd0ff" opacity={0.85} /> : null}
          {expr === "worried" || expr === "shocked" ? (
            <path d="M40 -238 q8 12 0 18 q-8 -6 0 -18" fill="#7fd0ff" opacity={0.9} />
          ) : null}
        </g>
      </g>
    </g>
  );
};

/* A floating mark next to a head: ?, !, Zz */
export const Marks: React.FC<{ kind: "?" | "!" | "z"; x?: number; y?: number; delay?: number }> = ({
  kind,
  x = 60,
  y = -270,
  delay = 0,
}) => {
  const f = useCurrentFrame() - delay;
  if (f < 0) return null;
  const items = kind === "z" ? ["z", "z", "Z"] : [kind, kind];
  return (
    <g>
      {items.map((t, i) => {
        const t2 = ((f + i * 14) % 42) / 42;
        const o = kind === "z" ? Math.sin(t2 * Math.PI) : Math.min(1, f / 8);
        const dy = kind === "z" ? -t2 * 60 : Math.sin((f + i * 10) / 6) * 5;
        return (
          <text
            key={i}
            x={x + i * 34}
            y={y - i * 26 + dy}
            fontSize={kind === "z" ? 34 + i * 8 : 58 - i * 12}
            fontWeight={900}
            fontFamily="Arial, sans-serif"
            fill={kind === "!" ? "#FF4D5E" : kind === "z" ? "#cfe6ff" : "#FFD23F"}
            stroke="#1b1410"
            strokeWidth={3}
            paintOrder="stroke"
            opacity={o}
            transform={`rotate(${i % 2 ? 12 : -10} ${x + i * 34} ${y - i * 26})`}
          >
            {t}
          </text>
        );
      })}
    </g>
  );
};

/* Standalone person placed in screen space; (x,y) is the hip. */
export const Person: React.FC<PersonProps & { x: number; y: number; scale?: number; marks?: "?" | "!" | "z"; marksDelay?: number }> = ({
  x,
  y,
  scale = 1,
  marks,
  marksDelay,
  ...p
}) => (
  <svg
    width={520 * scale}
    height={560 * scale}
    viewBox="-260 -340 520 560"
    style={{ position: "absolute", left: x - 260 * scale, top: y - 340 * scale, overflow: "visible" }}
  >
    <PersonG {...p} />
    {marks ? <Marks kind={marks} delay={marksDelay} x={(p.facing ?? 1) * 50} /> : null}
  </svg>
);
