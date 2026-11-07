import React from "react";
import { Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* The client's logo, animated part by part. Coordinates come from the
   original 2000×1120 artwork (origin shifted to the logo's top-left). */
const W = 1634;
const H = 512;
const P = {
  shield: { x: 0, y: 36, w: 387, h: 474 },
  bn: { x: 505, y: 0, w: 847, h: 291 },
  line: { x: 519, y: 363, w: 240, h: 13 },
  en: { x: 520, y: 429, w: 1113, h: 48 },
};

export const BrandLogo: React.FC<{ width?: number; delay?: number; static?: boolean }> = ({
  width = 1300,
  delay = 0,
  static: isStatic,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = isStatic ? 1000 : frame - delay;
  const k = width / W;
  const shield = spring({ frame: f, fps, config: { damping: 11, mass: 0.9 } });
  const bnP = interpolate(f, [10, 34], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const lineP = interpolate(f, [26, 46], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const enP = interpolate(f, [34, 56], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const glow = isStatic ? 0.6 : 0.6 + 0.4 * Math.sin(frame / 12);
  const box = (p: { x: number; y: number; w: number; h: number }): React.CSSProperties => ({
    position: "absolute",
    left: p.x * k,
    top: p.y * k,
    width: p.w * k,
    height: p.h * k,
  });
  return (
    <div style={{ position: "relative", width, height: H * k }}>
      <div
        style={{
          ...box(P.shield),
          transform: `scale(${shield}) rotate(${(1 - shield) * -25}deg)`,
          filter: `drop-shadow(0 0 ${30 * k * 2 * glow}px rgba(43,245,154,${0.45 * glow}))`,
        }}
      >
        <Img src={staticFile("logo/shield.png")} style={{ width: "100%", height: "100%" }} />
      </div>
      <div
        style={{
          ...box(P.bn),
          clipPath: `inset(0 ${(1 - bnP) * 100}% 0 0)`,
          transform: `translateX(${(1 - bnP) * -40 * k}px)`,
        }}
      >
        <Img src={staticFile("logo/bn.png")} style={{ width: "100%", height: "100%" }} />
      </div>
      <div
        style={{
          ...box(P.line),
          width: P.line.w * k * lineP,
          borderRadius: 99,
          background: "#FFC21A",
          boxShadow: "0 0 18px rgba(255,194,26,0.6)",
        }}
      />
      <div
        style={{
          ...box(P.en),
          opacity: enP,
          clipPath: `inset(0 ${(1 - enP) * 100}% 0 0)`,
        }}
      >
        <Img src={staticFile("logo/en.png")} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
};
