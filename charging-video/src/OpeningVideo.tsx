import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { O1, O2, O3, O4, O5, O6, O7, O8 } from "./opening";
import { FPS, LEAD } from "./theme";

const T = 12;
const VO = [4.57, 4.57, 3.53, 9.33, 5.07, 3.92, 7.03, 10.08]; // tightened clips in public/vo2f
// extra frames of picture after the voice (zoom holds, ribbon cutting, etc.)
const PAD = [18, 6, 10, 10, 0, 6, 15, 45];
const COMPS: React.FC[] = [O1, O2, O3, O4, O5, O6, O7, O8];
const SCENES = COMPS.map((C, i) => ({ C, d: LEAD + Math.ceil(VO[i] * FPS) + 4 + T + PAD[i] }));
export const OPENING_TOTAL = SCENES.reduce((a, s) => a + s.d, 0) - T * (SCENES.length - 1);

export const OpeningVideo: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <TransitionSeries>
      {SCENES.flatMap((s, i) => {
        const els = [
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={s.d}>
            <s.C />
            <Sequence from={LEAD} layout="none">
              <Audio src={staticFile(`vo2f/s${String(i + 1).padStart(2, "0")}.mp3`)} />
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
