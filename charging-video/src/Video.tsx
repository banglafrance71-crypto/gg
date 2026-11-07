import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import {
  S10Goals, S11Income, S12Location, S13Outro, S1Hook, S2Loss, S3Problems,
  S4Wiring, S5Bridge, S6Brand, S7Power, S8Time, S9Safety,
} from "./scenes";
import { Logo } from "./icons";
import { C, FONT } from "./theme";

const T = 18;
const SCENES: { C: React.FC; d: number }[] = [
  { C: S1Hook, d: 280 },
  { C: S2Loss, d: 180 },
  { C: S3Problems, d: 300 },
  { C: S4Wiring, d: 310 },
  { C: S5Bridge, d: 130 },
  { C: S6Brand, d: 240 },
  { C: S7Power, d: 220 },
  { C: S8Time, d: 440 },
  { C: S9Safety, d: 340 },
  { C: S10Goals, d: 280 },
  { C: S11Income, d: 340 },
  { C: S12Location, d: 260 },
  { C: S13Outro, d: 330 },
];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PRES: any[] = [
  fade(), slide({ direction: "from-right" }), fade(), fade(), fade(),
  fade(), slide({ direction: "from-bottom" }), wipe({ direction: "from-left" }),
  fade(), slide({ direction: "from-right" }), fade(), fade(),
];

export const TOTAL = SCENES.reduce((a, s) => a + s.d, 0) - T * (SCENES.length - 1);
const start = (i: number) =>
  SCENES.slice(0, i).reduce((a, s) => a + s.d, 0) - T * i;

const Bug: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: 44, left: 56, display: "flex", alignItems: "center", gap: 14, opacity: o * 0.9 }}>
      <Logo size={64} />
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.text }}>নিরাপদ অটো চার্জিং স্টেশন</div>
    </div>
  );
};

export const Video: React.FC = () => {
  const bugFrom = start(6) + T;
  const bugTo = start(12);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <TransitionSeries>
        {SCENES.flatMap((s, i) => {
          const els = [
            <TransitionSeries.Sequence key={`s${i}`} durationInFrames={s.d}>
              <s.C />
            </TransitionSeries.Sequence>,
          ];
          if (i < PRES.length)
            els.push(
              <TransitionSeries.Transition key={`t${i}`} presentation={PRES[i]} timing={linearTiming({ durationInFrames: T })} />,
            );
          return els;
        })}
      </TransitionSeries>
      <Sequence from={bugFrom} durationInFrames={bugTo - bugFrom} layout="none">
        <Bug />
      </Sequence>
    </AbsoluteFill>
  );
};
