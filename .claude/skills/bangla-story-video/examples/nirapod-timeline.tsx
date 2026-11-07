/* EXAMPLE (approved by the user): Nirapod Auto Charging Station promo.
   Imports refer to the kit files in assets/kit/src. Copy patterns, not content. */
import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { S12Location } from "./scenes";
import { T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T13 } from "./story";
import { BrandLogo } from "./brand";
import { C, FPS, LEAD } from "./theme";

const T = 18;
/* Voiceover clip length (seconds) per scene, from public/vo/sNN.mp3 */
const VO = [8.44, 5.56, 11.08, 10.11, 4.05, 8.28, 7.16, 17.79, 11.39, 10.11, 11.31, 7.71, 13.79];
const COMPS: React.FC[] = [T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, S12Location, T13];
// clip starts LEAD frames in, plus a breath and the outgoing transition
const SCENES = COMPS.map((C, i) => ({
  C,
  d: LEAD + Math.ceil(VO[i] * FPS) + 22 + T + (i === COMPS.length - 1 ? 60 : 0),
}));
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
      <BrandLogo width={250} static />
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
              <Sequence from={LEAD} layout="none">
                <Audio src={staticFile(`vo/s${String(i + 1).padStart(2, "0")}.mp3`)} />
              </Sequence>
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
