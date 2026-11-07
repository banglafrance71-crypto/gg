import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C } from "./theme";

const BOLT = "M58 6 L22 62 H46 L38 106 L78 44 H54 Z";

export const Bolt: React.FC<{ size?: number; color?: string; glow?: boolean }> = ({
  size = 100,
  color = C.yellow,
  glow = true,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 112">
    <path
      d={BOLT}
      fill={color}
      style={{ filter: glow ? `drop-shadow(0 0 14px ${color})` : undefined }}
    />
  </svg>
);

/* Battery: level 0..1 */
export const Battery: React.FC<{
  level: number;
  color: string;
  width?: number;
  blink?: boolean;
  bolt?: boolean;
}> = ({ level, color, width = 420, blink, bolt }) => {
  const f = useCurrentFrame();
  const h = width * 0.52;
  const op = blink ? 0.45 + 0.55 * Math.abs(Math.sin(f / 7)) : 1;
  const innerW = (width - 70) * Math.max(0, Math.min(1, level));
  return (
    <svg width={width + 40} height={h + 20} viewBox={`0 0 ${width + 40} ${h + 20}`}>
      <defs>
        <linearGradient id={`bf${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="1" />
          <stop offset="1" stopColor={color} stopOpacity="0.65" />
        </linearGradient>
      </defs>
      <rect
        x={10}
        y={10}
        width={width - 20}
        height={h}
        rx={h * 0.18}
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth={8}
      />
      <rect
        x={width - 6}
        y={10 + h * 0.3}
        width={30}
        height={h * 0.4}
        rx={8}
        fill="rgba(255,255,255,0.75)"
      />
      <rect
        x={35}
        y={35}
        width={innerW}
        height={h - 50}
        rx={h * 0.1}
        fill={`url(#bf${color})`}
        opacity={op}
        style={{ filter: `drop-shadow(0 0 18px ${color})` }}
      />
      {bolt ? (
        <g transform={`translate(${width / 2 - 45}, ${h / 2 - 40}) scale(0.8)`}>
          <path d={BOLT} fill="#fff" opacity={0.95} />
        </g>
      ) : null}
    </svg>
  );
};

/* Original stylised auto-rickshaw (easy-bike) side view */
export const Rickshaw: React.FC<{
  width?: number;
  speed?: number;
  hazard?: boolean;
  glow?: string;
}> = ({ width = 640, speed = 0, hazard, glow = C.green }) => {
  const f = useCurrentFrame();
  const rot = f * speed * 6;
  const bob = speed > 0 ? Math.sin(f / 3) * 2 : 0;
  const hz = hazard ? (Math.floor(f / 10) % 2 === 0 ? 1 : 0.15) : 0;
  const Wheel = ({ cx, r }: { cx: number; r: number }) => (
    <g transform={`translate(${cx} 300)`}>
      <circle r={r} fill="#111" stroke="#2a2f36" strokeWidth={6} />
      <circle r={r * 0.55} fill="#3b4450" />
      <g transform={`rotate(${rot})`}>
        {[0, 60, 120].map((a) => (
          <rect key={a} x={-r * 0.5} y={-3} width={r} height={6} fill="#9aa6b2" transform={`rotate(${a})`} />
        ))}
      </g>
      <circle r={r * 0.15} fill="#cfd8e0" />
    </g>
  );
  return (
    <svg width={width} height={width * 0.62} viewBox="0 0 640 400">
      <g transform={`translate(0 ${bob})`}>
        {/* shadow */}
        <ellipse cx={320} cy={352} rx={260} ry={14} fill="rgba(0,0,0,0.45)" />
        {/* roof */}
        <path d="M120 70 Q130 40 170 40 H500 Q540 40 545 70 L548 90 H118 Z" fill="#1d2a38" stroke={glow} strokeWidth={3} />
        {/* pillars */}
        <rect x={140} y={88} width={14} height={140} fill="#2a3a4c" />
        <rect x={330} y={88} width={12} height={130} fill="#2a3a4c" />
        <rect x={520} y={88} width={14} height={140} fill="#2a3a4c" />
        {/* windows */}
        <path d="M156 92 H328 V210 H156 Z" fill="rgba(53,201,255,0.18)" />
        <path d="M344 92 H518 V210 H344 Z" fill="rgba(53,201,255,0.12)" />
        {/* body */}
        <path
          d="M70 300 Q60 230 120 220 H560 Q600 222 606 260 L612 300 Z"
          fill={glow}
        />
        <path d="M70 300 Q60 230 120 220 H560 Q600 222 606 260 L612 300 Z" fill="url(#rkShade)" />
        <defs>
          <linearGradient id="rkShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.25" />
            <stop offset="1" stopColor="#000" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        {/* stripe + seat */}
        <rect x={110} y={250} width={480} height={10} rx={5} fill="rgba(255,255,255,0.55)" />
        <rect x={360} y={190} width={140} height={30} rx={10} fill="#5b2a2a" />
        {/* front + headlight */}
        <path d="M60 300 Q40 250 90 225 L110 222 L118 300 Z" fill="#14202c" />
        <circle cx={72} cy={262} r={12} fill={C.yellow} style={{ filter: `drop-shadow(0 0 12px ${C.yellow})` }} />
        {/* hazard / tail lights */}
        <rect x={600} y={240} width={14} height={26} rx={4} fill={C.orange} opacity={hazard ? hz : 0.6} style={{ filter: hazard ? `drop-shadow(0 0 16px ${C.orange})` : undefined }} />
        <rect x={84} y={232} width={14} height={14} rx={4} fill={C.orange} opacity={hazard ? hz : 0} />
        <Wheel cx={150} r={48} />
        <Wheel cx={500} r={52} />
      </g>
    </svg>
  );
};

export const Clock: React.FC<{ size?: number; speed?: number; color?: string }> = ({
  size = 360,
  speed = 3,
  color = C.cyan,
}) => {
  const f = useCurrentFrame();
  const m = f * speed;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <circle cx={100} cy={100} r={88} fill="rgba(255,255,255,0.04)" stroke={color} strokeWidth={6} style={{ filter: `drop-shadow(0 0 16px ${color})` }} />
      {new Array(12).fill(0).map((_, i) => (
        <rect key={i} x={98} y={20} width={4} height={i % 3 === 0 ? 16 : 9} fill={C.text} opacity={0.8} transform={`rotate(${i * 30} 100 100)`} />
      ))}
      <rect x={96} y={50} width={8} height={56} rx={4} fill={C.text} transform={`rotate(${m / 12} 100 100)`} />
      <rect x={98} y={30} width={4} height={76} rx={2} fill={color} transform={`rotate(${m} 100 100)`} />
      <circle cx={100} cy={100} r={8} fill={color} />
    </svg>
  );
};

export const Shield: React.FC<{ size?: number; progress?: number }> = ({
  size = 380,
  progress = 1,
}) => {
  const len = 620;
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 200 230">
      <path
        d="M100 10 L180 40 V110 C180 165 140 200 100 218 C60 200 20 165 20 110 V40 Z"
        fill="rgba(43,245,154,0.10)"
        stroke={C.green}
        strokeWidth={7}
        strokeDasharray={len}
        strokeDashoffset={len * (1 - progress)}
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 18px ${C.green})` }}
      />
      <path
        d="M62 115 L90 143 L142 88"
        fill="none"
        stroke={C.text}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={140}
        strokeDashoffset={140 * (1 - interpolate(progress, [0.6, 1], [0, 1], { extrapolateLeft: "clamp" }))}
      />
    </svg>
  );
};

export const Check: React.FC<{ size?: number; p: number }> = ({ size = 56, p }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    <circle cx={30} cy={30} r={27} fill={C.green} opacity={0.18 + 0.82 * p} />
    <path
      d="M17 31 L26 40 L44 21"
      fill="none"
      stroke={C.bg}
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={50}
      strokeDashoffset={50 * (1 - p)}
    />
  </svg>
);

export const Pin: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 100 130">
    <path
      d="M50 4 C25 4 8 22 8 46 C8 78 50 124 50 124 C50 124 92 78 92 46 C92 22 75 4 50 4 Z"
      fill={C.red}
      style={{ filter: `drop-shadow(0 10px 20px rgba(0,0,0,0.5))` }}
    />
    <circle cx={50} cy={45} r={18} fill="#fff" />
  </svg>
);

export const Phone: React.FC<{ size?: number; color?: string }> = ({ size = 48, color = C.bg }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"
      fill={color}
    />
  </svg>
);

export const Gauge: React.FC<{ size?: number; value: number; color?: string }> = ({
  size = 140,
  value,
  color = C.red,
}) => {
  const a = -120 + 240 * value;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <path d="M20 85 A45 45 0 1 1 100 85" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={10} strokeLinecap="round" />
      <path d="M20 85 A45 45 0 0 1 32 34" fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" />
      <rect x={58} y={24} width={4} height={40} rx={2} fill={C.text} transform={`rotate(${a} 60 64)`} />
      <circle cx={60} cy={64} r={7} fill={C.text} />
    </svg>
  );
};

export const Warning: React.FC<{ size?: number }> = ({ size = 160 }) => {
  const f = useCurrentFrame();
  const g = 0.6 + 0.4 * Math.abs(Math.sin(f / 8));
  return (
    <svg width={size} height={size} viewBox="0 0 100 92">
      <path
        d="M50 4 L96 86 H4 Z"
        fill={C.yellow}
        stroke={C.yellow}
        strokeWidth={6}
        strokeLinejoin="round"
        opacity={g}
        style={{ filter: `drop-shadow(0 0 20px ${C.orange})` }}
      />
      <rect x={46} y={30} width={8} height={32} rx={4} fill={C.bg} />
      <circle cx={50} cy={72} r={5} fill={C.bg} />
    </svg>
  );
};

/* Logo: ring + bolt + plug */
export const Logo: React.FC<{ size?: number; progress?: number }> = ({
  size = 260,
  progress = 1,
}) => {
  const f = useCurrentFrame();
  const circ = 2 * Math.PI * 88;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.green} />
          <stop offset="1" stopColor={C.cyan} />
        </linearGradient>
      </defs>
      <circle cx={100} cy={100} r={88} fill="rgba(43,245,154,0.08)" />
      <circle
        cx={100}
        cy={100}
        r={88}
        fill="none"
        stroke="url(#lg)"
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - progress)}
        transform="rotate(-90 100 100)"
        style={{ filter: `drop-shadow(0 0 12px ${C.green})` }}
      />
      <circle
        cx={100}
        cy={100}
        r={74}
        fill="none"
        stroke={C.cyan}
        strokeOpacity={0.35}
        strokeWidth={2}
        strokeDasharray="6 10"
        transform={`rotate(${f * 0.8} 100 100)`}
      />
      <g
        transform={`translate(100 104) scale(${1.15 * interpolate(progress, [0.4, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}) translate(-50 -56)`}
      >
        <path d={BOLT} fill={C.yellow} style={{ filter: `drop-shadow(0 0 10px ${C.yellow})` }} />
      </g>
    </svg>
  );
};
