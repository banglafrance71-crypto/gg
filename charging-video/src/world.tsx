import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ---------- Camera: keyframes [frame, x, y, zoom] — (x,y) world point centred on screen ---------- */
export type Key = [number, number, number, number];
export const Camera: React.FC<{ keys: Key[]; children: React.ReactNode; shake?: number }> = ({
  keys,
  children,
  shake = 0,
}) => {
  const f = useCurrentFrame();
  const fr = keys.map((k) => k[0]);
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const val = (i: 1 | 2 | 3) => {
    if (keys.length === 1) return keys[0][i];
    for (let k = 0; k < keys.length - 1; k++) {
      if (f <= fr[k + 1]) {
        const t = Math.max(0, Math.min(1, (f - fr[k]) / Math.max(1, fr[k + 1] - fr[k])));
        return keys[k][i] + (keys[k + 1][i] - keys[k][i]) * ease(t);
      }
    }
    return keys[keys.length - 1][i];
  };
  const x = val(1);
  const y = val(2);
  const z = val(3);
  const sx = shake ? Math.sin(f * 2.3) * shake : 0;
  const sy = shake ? Math.cos(f * 1.7) * shake : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transformOrigin: "0 0",
          transform: `translate(${960 - x * z + sx}px, ${540 - y * z + sy}px) scale(${z})`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* Fade-in cut for vignettes inside a scene */
export const FadeIn: React.FC<{ children: React.ReactNode; dur?: number }> = ({ children, dur = 8 }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: interpolate(f, [0, dur], [0, 1], clamp) }}>{children}</AbsoluteFill>;
};

/* ---------- Street with parallax ---------- */
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1) * 43758.5453;
  return x - Math.floor(x);
};
const BLD = new Array(14).fill(0).map((_, i) => ({
  w: 150 + rnd(i) * 170,
  h: 220 + rnd(i + 9) * 260,
  c: ["#3b4a63", "#4a3f5c", "#33506a", "#56485e", "#3f5a5a"][i % 5],
}));

export type TimeOfDay = "day" | "dusk" | "night";
const SKY: Record<TimeOfDay, [string, string, string]> = {
  day: ["#7EC8F2", "#CDEBFA", "#FFE7A8"],
  dusk: ["#3B3570", "#C2607A", "#FFB36B"],
  night: ["#07101F", "#13233E", "#1E2D47"],
};

export const Street: React.FC<{ offset?: number; time?: TimeOfDay; width?: number; noSun?: boolean }> = ({
  offset = 0,
  time = "day",
  width = 1920,
  noSun,
}) => {
  const f = useCurrentFrame();
  const [a, b, c] = SKY[time];
  const night = time === "night";
  const layer = (speed: number, tile: number) => -((offset * speed) % tile);
  const bTile = BLD.reduce((s, x) => s + x.w + 20, 0);
  const bx = layer(0.25, bTile);
  const tx = layer(0.55, 640);
  const px = layer(0.9, 900);
  const lx = layer(1, 240);
  return (
    <AbsoluteFill style={{ width, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `linear-gradient(${a} 0%, ${b} 55%, ${c} 75%)` }} />
      {/* sun / moon */}
      {noSun ? null : <div
        style={{
          position: "absolute",
          left: 1450,
          top: night ? 120 : 140,
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: night ? "#E9EEF7" : "#FFE27A",
          boxShadow: night ? "0 0 60px #9fb6ff88" : "0 0 120px #FFD23F",
        }}
      />}
      {/* buildings */}
      <svg width={width + bTile * 2} height={1080} style={{ position: "absolute", left: bx, top: 0 }}>
        {[0, 1, 2].map((rep) => {
          let x = rep * bTile;
          return BLD.map((bd, i) => {
            const el = (
              <g key={`${rep}-${i}`}>
                <rect x={x} y={760 - bd.h} width={bd.w} height={bd.h} fill={night ? "#16213a" : bd.c} opacity={night ? 1 : 0.55} />
                {new Array(Math.floor(bd.h / 60)).fill(0).map((_, r) =>
                  new Array(Math.floor(bd.w / 50)).fill(0).map((__, cIdx) => (
                    <rect
                      key={`${r}-${cIdx}`}
                      x={x + 16 + cIdx * 50}
                      y={760 - bd.h + 20 + r * 60}
                      width={22}
                      height={28}
                      fill={night ? (rnd(i * 31 + r * 7 + cIdx) > 0.55 ? "#FFD98A" : "#1f2c48") : "rgba(255,255,255,0.35)"}
                    />
                  )),
                )}
              </g>
            );
            x += bd.w + 20;
            return el;
          });
        })}
      </svg>
      {/* trees */}
      <svg width={width + 1280} height={1080} style={{ position: "absolute", left: tx, top: 0 }}>
        {new Array(6).fill(0).map((_, i) => (
          <g key={i} transform={`translate(${i * 640 + 120} 0)`}>
            <rect x={-10} y={640} width={20} height={130} fill={night ? "#1c1a16" : "#5b3b22"} />
            <circle cx={0} cy={610} r={80} fill={night ? "#0f2a1e" : "#2f8f4e"} />
            <circle cx={-55} cy={650} r={55} fill={night ? "#0f2a1e" : "#278344"} />
            <circle cx={55} cy={650} r={55} fill={night ? "#0f2a1e" : "#36a25a"} />
          </g>
        ))}
      </svg>
      {/* electric poles + sagging wires */}
      <svg width={width + 1800} height={1080} style={{ position: "absolute", left: px, top: 0 }}>
        {new Array(4).fill(0).map((_, i) => (
          <g key={i} transform={`translate(${i * 900 + 300} 0)`}>
            <rect x={-8} y={330} width={16} height={450} fill={night ? "#2a2e36" : "#6b6f77"} />
            <rect x={-60} y={350} width={120} height={10} fill={night ? "#2a2e36" : "#6b6f77"} />
            <path d="M-55 355 Q395 440 845 355 M-20 355 Q430 470 880 355 M55 355 Q505 430 955 355" stroke="#1d2026" strokeWidth={3} fill="none" />
          </g>
        ))}
      </svg>
      {/* sidewalk + road */}
      <div style={{ position: "absolute", left: 0, top: 770, width, height: 40, background: night ? "#2b2f36" : "#b9b2a5" }} />
      <div style={{ position: "absolute", left: 0, top: 806, width, height: 274, background: night ? "#15191f" : "#3a3f47" }} />
      <div
        style={{
          position: "absolute",
          left: lx,
          top: 960,
          width: width + 480,
          height: 12,
          backgroundImage: `repeating-linear-gradient(90deg, ${C.yellow} 0 120px, transparent 120px 240px)`,
          opacity: night ? 0.5 : 0.85,
        }}
      />
      {night ? (
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 80%, transparent 30%, rgba(0,0,0,0.5) 100%)" }} />
      ) : null}
      <div style={{ display: "none" }}>{f}</div>
    </AbsoluteFill>
  );
};

/* ---------- Old, unsafe charging shed ---------- */
export const Shed: React.FC<{ crowded?: boolean }> = () => {
  const f = useCurrentFrame();
  const flick = 0.35 + 0.35 * Math.abs(Math.sin(f / 3.1) * Math.sin(f / 7.3)) + (Math.floor(f / 5) % 7 === 0 ? -0.25 : 0);
  return (
    <AbsoluteFill style={{ background: "#2a1e16" }}>
      {/* wall */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.25) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,0.2) 2px, transparent 2px)",
          backgroundSize: "120px 50px, 240px 50px",
          background: undefined,
        }}
      />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <defs>
          <radialGradient id="bulb" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#FFD98A" stopOpacity={0.55 * flick} />
            <stop offset="1" stopColor="#FFD98A" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={1920} height={1080} fill="#3a2a1f" />
        {new Array(22).fill(0).map((_, r) =>
          new Array(9).fill(0).map((__, c) => (
            <rect key={`${r}-${c}`} x={c * 240 + (r % 2) * 120 - 60} y={r * 50} width={232} height={44} fill="#4a3426" opacity={0.6 + rnd(r * 9 + c) * 0.4} />
          )),
        )}
        {/* tin roof */}
        <path d={`M0 0 H1920 V120 ${new Array(25).fill(0).map((_, i) => `L${1920 - i * 80} ${i % 2 ? 150 : 120}`).join(" ")} L0 120 Z`} fill="#6c6f73" />
        <rect y={118} width={1920} height={10} fill="#4c4f53" />
        {/* floor */}
        <rect y={820} width={1920} height={260} fill="#2b221b" />
        <rect y={820} width={1920} height={8} fill="#1c1611" />
        {/* messy wires on wall */}
        <path d="M200 160 C400 260 360 360 600 300 S880 180 1000 340 S1260 420 1400 260 S1700 180 1820 360" stroke="#121212" strokeWidth={6} fill="none" />
        <path d="M260 150 C380 330 520 200 700 380 S980 260 1140 420" stroke="#8a2b2b" strokeWidth={5} fill="none" />
        <path d="M900 150 C960 260 1040 200 1100 300 S1300 340 1360 460" stroke="#2d4f8a" strokeWidth={5} fill="none" />
        {/* old socket board */}
        <rect x={1060} y={420} width={170} height={120} rx={8} fill="#cfc6b4" stroke="#8a7f6c" strokeWidth={4} />
        <circle cx={1110} cy={480} r={18} fill="#3b3631" />
        <circle cx={1180} cy={480} r={18} fill="#3b3631" />
        {/* bulb */}
        <path d="M960 128 L960 230" stroke="#111" strokeWidth={4} />
        <circle cx={960} cy={300} r={420} fill="url(#bulb)" />
        <circle cx={960} cy={250} r={26} fill={`rgba(255,217,138,${0.4 + flick})`} />
      </svg>
      <AbsoluteFill style={{ background: `rgba(0,0,0,${0.45 - flick * 0.3})` }} />
    </AbsoluteFill>
  );
};

/* ---------- Charger pillar (station) ---------- */
export const Charger: React.FC<{ x: number; y: number; scale?: number; active?: boolean }> = ({
  x,
  y,
  scale = 1,
  active = true,
}) => {
  const f = useCurrentFrame();
  const pts = new Array(24)
    .fill(0)
    .map((_, i) => `${i === 0 ? "M" : "L"}${10 + i * 4} ${40 + Math.sin(i / 2 + f / 5) * 10}`)
    .join(" ");
  return (
    <svg width={140 * scale} height={330 * scale} viewBox="0 0 140 330" style={{ position: "absolute", left: x, top: y }}>
      <rect x={10} y={0} width={120} height={310} rx={22} fill="#0C7A4A" />
      <rect x={10} y={0} width={120} height={60} rx={22} fill="#0A5F3A" />
      <rect x={26} y={70} width={88} height={80} rx={10} fill="#06251a" />
      <g transform="translate(16 70)">
        <path d={pts} stroke={active ? C.green : "#3a5"} strokeWidth={3} fill="none" />
      </g>
      <path d="M78 176 L58 210 H72 L64 240 L90 202 H76 Z" fill="#FFC21A" />
      <circle cx={70} cy={30} r={8} fill={active ? C.green : "#555"} style={{ filter: active ? `drop-shadow(0 0 8px ${C.green})` : undefined }} />
      <rect x={0} y={300} width={140} height={30} rx={6} fill="#5c6670" />
    </svg>
  );
};

/* ---------- Modern station exterior ---------- */
export const Station: React.FC<{ lights?: number }> = ({ lights = 1 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(#7EC8F2 0%, #CDEBFA 60%, #FFE7A8 80%)" }} />
      {/* back building */}
      <div style={{ position: "absolute", left: 160, top: 250, width: 1600, height: 560, background: "#E8ECEF", borderRadius: 12 }} />
      {/* fascia with logo */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 200,
          width: 1680,
          height: 170,
          background: "#0A2318",
          borderRadius: 16,
          boxShadow: `0 0 ${60 * lights}px rgba(43,245,154,${0.5 * lights})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: 80,
        }}
      >
        <Img src={staticFile("logo/full.png")} style={{ height: 130, opacity: 0.3 + 0.7 * lights }} />
      </div>
      {/* canopy lights */}
      {new Array(6).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 260 + i * 270,
            top: 380,
            width: 140,
            height: 12,
            borderRadius: 6,
            background: "#fff",
            opacity: 0.4 + 0.6 * lights,
            boxShadow: `0 0 ${30 * lights}px #fff`,
          }}
        />
      ))}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 30%, rgba(255,255,255,${0.12 * lights}) 0%, transparent 60%)` }} />
      {/* floor */}
      <div style={{ position: "absolute", left: 0, top: 810, width: 1920, height: 270, background: "#cfd5da" }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 810,
          width: 1920,
          height: 270,
          backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.08) 2px, transparent 2px)",
          backgroundSize: "160px 100%",
        }}
      />
      {/* bay markings */}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: 220 + i * 560, top: 900, width: 420, height: 8, background: "#0C7A4A", opacity: 0.7 }} />
      ))}
      {/* plants */}
      {[90, 1780].map((x) => (
        <svg key={x} width={120} height={200} style={{ position: "absolute", left: x, top: 640 }}>
          <rect x={30} y={130} width={60} height={60} rx={8} fill="#8a6a4a" />
          <circle cx={60} cy={100} r={45} fill="#2f8f4e" />
          <circle cx={35} cy={80} r={30} fill="#36a25a" />
          <circle cx={85} cy={75} r={30} fill="#278344" />
        </svg>
      ))}
      <div style={{ display: "none" }}>{f}</div>
    </AbsoluteFill>
  );
};

/* ---------- Battery bubble that floats over a vehicle ---------- */
export const BatteryBubble: React.FC<{ x: number; y: number; level: number; scale?: number; blink?: boolean }> = ({
  x,
  y,
  level,
  scale = 1,
  blink,
}) => {
  const f = useCurrentFrame();
  const col = level < 0.2 ? C.red : level < 0.75 ? C.yellow : C.green;
  const op = blink && level < 0.2 ? 0.35 + 0.65 * Math.abs(Math.sin(f / 5)) : 1;
  const w = 150;
  return (
    <svg width={190 * scale} height={130 * scale} viewBox="0 0 190 130" style={{ position: "absolute", left: x - 95 * scale, top: y - 130 * scale }}>
      <rect x={4} y={4} width={182} height={100} rx={26} fill="rgba(10,20,30,0.85)" stroke={col} strokeWidth={4} />
      <path d="M80 104 L95 126 L110 104 Z" fill="rgba(10,20,30,0.85)" />
      <rect x={24} y={28} width={128} height={54} rx={10} fill="none" stroke="#fff" strokeWidth={5} />
      <rect x={154} y={44} width={10} height={22} rx={3} fill="#fff" />
      <rect x={32} y={36} width={Math.max(4, (w - 38) * level)} height={38} rx={6} fill={col} opacity={op} style={{ filter: `drop-shadow(0 0 8px ${col})` }} />
    </svg>
  );
};

/* ---------- Taka note ---------- */
export const Note: React.FC<{ x: number; y: number; rot?: number; o?: number; s?: number }> = ({ x, y, rot = 0, o = 1, s = 1 }) => (
  <svg width={120 * s} height={60 * s} viewBox="0 0 120 60" style={{ position: "absolute", left: x, top: y, opacity: o, transform: `rotate(${rot}deg)` }}>
    <rect x={2} y={2} width={116} height={56} rx={6} fill="#5fae6e" stroke="#2e6b3a" strokeWidth={3} />
    <circle cx={60} cy={30} r={17} fill="#3f8a4f" />
    <text x={60} y={41} textAnchor="middle" fontSize={30} fontWeight={800} fill="#e9ffe9" fontFamily="Anek Bangla">
      ৳
    </text>
  </svg>
);

export const Smoke: React.FC<{ x: number; y: number; n?: number; color?: string }> = ({ x, y, n = 6, color = "rgba(120,120,120,0.55)" }) => {
  const f = useCurrentFrame();
  return (
    <>
      {new Array(n).fill(0).map((_, i) => {
        const t = ((f + i * 9) % 54) / 54;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.sin(i * 2 + f / 10) * 30 - 30 * t,
              top: y - t * 220,
              width: 60 + t * 90,
              height: 60 + t * 90,
              borderRadius: "50%",
              background: color,
              opacity: 1 - t,
              filter: "blur(6px)",
            }}
          />
        );
      })}
    </>
  );
};

export const Sparks: React.FC<{ x: number; y: number; size?: number }> = ({ x, y, size = 1 }) => {
  const f = useCurrentFrame();
  if (Math.floor(f / 3) % 4 === 0) return null;
  return (
    <svg width={240 * size} height={240 * size} viewBox="-120 -120 240 240" style={{ position: "absolute", left: x - 120 * size, top: y - 120 * size }}>
      {new Array(9).fill(0).map((_, i) => {
        const a = (i / 9) * Math.PI * 2 + f * 0.7;
        const r = 40 + ((f * 7 + i * 13) % 60);
        return <line key={i} x1={Math.cos(a) * 18} y1={Math.sin(a) * 18} x2={Math.cos(a) * r} y2={Math.sin(a) * r} stroke={i % 2 ? "#FFD23F" : "#fff"} strokeWidth={5} strokeLinecap="round" />;
      })}
      <circle r={22} fill="#fff" style={{ filter: "drop-shadow(0 0 20px #FFD23F)" }} />
    </svg>
  );
};
