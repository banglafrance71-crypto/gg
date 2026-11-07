import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { FPS, LEAD } from "./theme";
// import your scenes: import { S1, S2, ... } from "./scenes";

/* Timeline template: one voiceover clip per scene, scene length derived from the clip.
   1. Put clips in public/vo/s01.mp3, s02.mp3 …
   2. Run scripts/vo_timing.sh public/vo/*.mp3 and paste durations into VO.
   3. Inside scenes, place beats with at(seconds) from theme.ts. */
const T = 12; // transition frames (keep it brisk)
const VO: number[] = [/* seconds per clip, e.g. 8.44, 5.56 */];
const COMPS: React.FC[] = [/* S1, S2, … in the same order as VO */];
const MUSIC: string | null = null; // e.g. "music/bed.mp3" (ducked under narration)
// Extra picture frames after a scene's voice — only where the picture needs to land (face zoom, end card).
const PAD: number[] = [];

const SCENES = COMPS.map((C, i) => ({
  C,
  d: LEAD + Math.ceil((VO[i] ?? 3) * FPS) + 4 + T + (PAD[i] ?? 0) + (i === COMPS.length - 1 ? 45 : 0),
}));
export const TOTAL = Math.max(1, SCENES.reduce((a, s) => a + s.d, 0) - T * Math.max(0, SCENES.length - 1));

export const Video: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
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
        if (i < SCENES.length - 1)
          els.push(<TransitionSeries.Transition key={`t${i}`} presentation={fade()} timing={linearTiming({ durationInFrames: T })} />);
        return els;
      })}
    </TransitionSeries>
    {MUSIC ? <Audio src={staticFile(MUSIC)} volume={0.12} loop /> : null}
  </AbsoluteFill>
);
