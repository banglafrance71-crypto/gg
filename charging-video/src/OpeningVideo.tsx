import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { O1, O2, O3, O4, O5, O6, O7, O8 } from "./opening";
import { FPS, LEAD } from "./theme";

const T = 18;
const VO = [5.15, 5.25, 3.97, 10.27, 5.56, 4.36, 7.63, 11.08];
// extra frames of picture after the voice (zoom holds, ribbon cutting, etc.)
const PAD = [55, 30, 45, 40, 25, 30, 45, 60];
const COMPS: React.FC[] = [O1, O2, O3, O4, O5, O6, O7, O8];
const SCENES = COMPS.map((C, i) => ({ C, d: LEAD + Math.ceil(VO[i] * FPS) + 22 + T + PAD[i] }));
export const OPENING_TOTAL = SCENES.reduce((a, s) => a + s.d, 0) - T * (SCENES.length - 1);

export const OpeningVideo: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <TransitionSeries>
      {SCENES.flatMap((s, i) => {
        const els = [
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={s.d}>
            <s.C />
            <Sequence from={LEAD} layout="none">
              <Audio src={staticFile(`vo2/s${String(i + 1).padStart(2, "0")}.mp3`)} />
            </Sequence>
          </TransitionSeries.Sequence>,
        ];
        if (i < SCENES.length - 1)
          els.push(<TransitionSeries.Transition key={`t${i}`} presentation={fade()} timing={linearTiming({ durationInFrames: T })} />);
        return els;
      })}
    </TransitionSeries>
  </AbsoluteFill>
);
