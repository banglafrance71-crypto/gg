import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { Bg, Pill, Words, useSpring } from "./components";
import { BrandLogo } from "./brand";
import { Battery, Clock, Gauge, Phone, Shield, Warning } from "./icons";
import { Marks, Person, PersonG, Expr, Arm } from "./people";
import { EasyBike } from "./vehicles";
import { BatteryBubble, Camera, Charger, FadeIn, Note, Shed, Smoke, Sparks, Station, Street } from "./world";
import { at, C, FONT } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ROAD = 900; // wheels touch here

/* Easy-bike placed in world space with optional seated driver / passengers */
const Bike: React.FC<{
  x: number;
  w: number;
  ground?: number;
  speed?: number;
  hazard?: boolean;
  driver?: { expr: Expr; arm?: Arm; look?: number; marks?: "?" | "!" | "z"; marksDelay?: number } | null;
  passengers?: Expr | null;
  jerk?: number;
}> = ({ x, w, ground = ROAD, speed = 0, hazard, driver, passengers, jerk }) => {
  const y = ground - 0.653 * w;
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      <EasyBike
        width={w}
        speed={speed}
        hazard={hazard}
        jerk={jerk}
        passengers={
          passengers ? (
            <>
              <g transform="translate(200 395) scale(0.85)">
                <PersonG pose="sit" hideLegs expr={passengers} shirt="#B0476B" gamchha={false} seed={3} facing={-1} />
              </g>
              <g transform="translate(340 395) scale(0.85)">
                <PersonG pose="sit" hideLegs expr={passengers} shirt="#E0A93B" gamchha={false} seed={5} facing={-1} />
              </g>
            </>
          ) : null
        }
        driver={
          driver ? (
            <g transform="translate(745 330) scale(0.95)">
              <PersonG pose="sit" arm={driver.arm ?? "handle"} expr={driver.expr} look={driver.look} />
              {driver.marks ? <Marks kind={driver.marks} delay={driver.marksDelay} x={40} y={-280} /> : null}
            </g>
          ) : null
        }
      />
    </div>
  );
};
/* world position of a seated driver's face */
const face = (x: number, w: number, ground = ROAD) => ({
  x: x + 0.745 * w,
  y: ground - 0.653 * w + 0.135 * w,
});

/* ───────────── 1 · Battery dies on the road, then slow charging ───────────── */
export const T1: React.FC = () => {
  const f = useCurrentFrame();
  const SPLIT = at(3.2);
  const STOP = 72;
  const off = f < 30 ? 14 * f : f < STOP ? 420 + 14 * (f - 30) - (7 * (f - 30) ** 2) / (STOP - 30) : 420 + 7 * (STOP - 30);
  const spd = f < 30 ? 3 : f < STOP ? 3 * (1 - (f - 30) / (STOP - 30)) : 0;
  const W = 700;
  const BX = 560;
  const fc = face(BX, W);
  const expr: Expr = f < 28 ? "happy" : f < 60 ? "worried" : "confused";
  const jerk = f > 50 && f < STOP ? Math.sin(f * 1.8) * 1.2 : 0;
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={SPLIT} layout="none">
        <Camera keys={[[0, 960, 540, 1], [STOP - 4, 960, 540, 1], [STOP + 22, fc.x, fc.y - 10, 2.7], [SPLIT, fc.x, fc.y - 14, 2.9]]}>
          <Street offset={off} time="day" />
          {f > 28 && f < STOP + 10 ? <Smoke x={BX - 20} y={ROAD - 140} n={5} /> : null}
          <Bike x={BX} w={W} speed={spd} jerk={jerk} driver={{ expr, marks: f > STOP + 10 ? "?" : undefined, marksDelay: STOP + 10 }} />
          {f < STOP + 8 ? (
            <BatteryBubble x={BX + 520} y={ROAD - 0.653 * W - 20} level={interpolate(f, [0, 42], [0.22, 0.03], clamp)} blink scale={1.1} />
          ) : null}
        </Camera>
      </Sequence>
      <Sequence from={SPLIT} layout="none">
        <ShedWait />
      </Sequence>
    </AbsoluteFill>
  );
};

const ShedWait: React.FC = () => {
  const g = useCurrentFrame();
  const W = 760;
  const BX = 130;
  const lvl = interpolate(g, [0, 90], [0.15, 0.58], { ...clamp, easing: Easing.out(Easing.quad) }) + (g > 90 ? Math.sin(g / 4) * 0.01 : 0);
  const expr: Expr = g < 55 ? "neutral" : g < 110 ? "tired" : "sad";
  return (
    <FadeIn>
      <Camera keys={[[0, 960, 540, 1], [200, 1250, 470, 1.25]]}>
        <Shed />
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <path d={`M1110 500 C1100 700 900 640 ${BX + 430} ${ROAD - 120}`} stroke="#151515" strokeWidth={10} fill="none" />
        </svg>
        <Bike x={BX} w={W} />
        <BatteryBubble x={BX + 420} y={ROAD - 0.653 * W + 10} level={lvl} scale={1.7} />
        <div style={{ position: "absolute", left: 1290, top: 140 }}>
          <Clock size={230} speed={40} color={C.orange} />
        </div>
        <Person x={1440} y={ROAD - 168 * 1.25 + 10} scale={1.25} expr={expr} arm={g < 70 ? "cross" : "watch"} look={g >= 70 ? 1 : 0} marks={g > 120 ? "?" : undefined} marksDelay={120} />
      </Camera>
    </FadeIn>
  );
};

/* ───────────── 2 · Lost passengers = lost income ───────────── */
export const T2: React.FC = () => {
  const f = useCurrentFrame();
  const M = at(3.2);
  const px = f < 40 ? interpolate(f, [0, 40], [-200, 430]) : f < 70 ? 430 : interpolate(f, [70, 140], [430, -320], clamp);
  const leaving = f >= 70;
  return (
    <Camera keys={[[0, 920, 560, 1.05], [M - 10, 920, 560, 1.05], [M + 20, 820, 500, 1.6]]}>
      <Street offset={700} time="day" />
      <Bike x={980} w={640} hazard />
      <Person x={px} y={ROAD - 168} expr={leaving ? "neutral" : "neutral"} pose={f < 40 || leaving ? "walk" : "stand"} facing={leaving ? -1 : 1} shirt="#8B5E3C" lungi="#44464d" gamchha={false} seed={7} arm={f >= 50 && f < 70 ? "wave" : "down"} />
      <Person x={820} y={ROAD - 168} expr={f < M ? "worried" : "sad"} arm={f < M - 20 ? "scratch" : "down"} facing={-1} />
      {new Array(7).fill(0).map((_, i) => {
        const t = (f - M - i * 6) / 70;
        if (t < 0 || t > 1) return null;
        return (
          <Note
            key={i}
            x={820 + t * (500 + i * 60)}
            y={560 - t * 380 + Math.sin(t * 9 + i) * 40}
            rot={t * 360 * (i % 2 ? 1 : -1)}
            o={interpolate(t, [0, 0.1, 0.8, 1], [0, 1, 1, 0])}
            s={0.8}
          />
        );
      })}
    </Camera>
  );
};

/* ───────────── 3 · Problems at ordinary charging points ───────────── */
export const T3: React.FC = () => {
  const A1 = at(3.2);
  const A2 = at(4.6);
  const A3 = at(6.8);
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={A1} layout="none">
        <Camera keys={[[0, 960, 540, 1], [A1, 1100, 520, 1.12]]}>
          <Shed />
          {[60, 520, 980].map((x, i) => (
            <Bike key={i} x={x} w={430} ground={880} />
          ))}
          <Person x={1650} y={880 - 168 * 1.15} scale={1.15} expr="worried" arm="scratch" facing={-1} marks="!" />
        </Camera>
      </Sequence>
      <Sequence from={A1} durationInFrames={A2 - A1} layout="none">
        <FadeIn dur={6}>
          <LowVoltage />
        </FadeIn>
      </Sequence>
      <Sequence from={A2} durationInFrames={A3 - A2} layout="none">
        <FadeIn dur={6}>
          <Camera keys={[[0, 960, 540, 1.05], [80, 900, 540, 1.15]]}>
            <Shed />
            <Bike x={80} w={560} ground={880} />
            <BatteryBubble x={390} y={880 - 0.653 * 560} level={0.3} scale={1.3} />
            <div style={{ position: "absolute", left: 640, top: 760, width: 520, height: 30, background: "#6b4a30", borderRadius: 6 }} />
            <Person x={880} y={760} expr="sleep" pose="sit" arm="down" marks="z" shin={120} />
            <div style={{ position: "absolute", left: 1300, top: 220 }}>
              <Clock size={420} speed={60} color={C.orange} />
            </div>
          </Camera>
        </FadeIn>
      </Sequence>
      <Sequence from={A3} layout="none">
        <FadeIn dur={6}>
          <LeaveHalf />
        </FadeIn>
      </Sequence>
    </AbsoluteFill>
  );
};

const LowVoltage: React.FC = () => {
  const f = useCurrentFrame();
  const flick = 0.25 + 0.3 * Math.abs(Math.sin(f / 2.3) * Math.sin(f / 5.1));
  return (
    <AbsoluteFill style={{ background: "#120c08" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 35% 40%, rgba(255,217,138,${flick * 0.5}) 0%, transparent 45%)` }} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <path d="M670 0 L670 280" stroke="#111" strokeWidth={8} />
        <path d="M630 280 H710 V330 H630 Z" fill="#555" />
        <path d="M600 330 Q600 470 670 520 Q740 470 740 330 Z" fill={`rgba(255,217,138,${flick + 0.1})`} stroke="#d8c08a" strokeWidth={4} />
        <path d="M650 360 Q670 420 690 360" stroke="#7a5a2a" strokeWidth={4} fill="none" />
      </svg>
      <div style={{ position: "absolute", left: 1080, top: 260 }}>
        <Gauge size={560} value={0.1 + Math.sin(f / 4) * 0.04} />
      </div>
    </AbsoluteFill>
  );
};

const LeaveHalf: React.FC = () => {
  const g = useCurrentFrame();
  const W = 700;
  const BX = 560;
  const fc = face(BX, W);
  return (
    <Camera keys={[[0, 960, 540, 1], [60, 960, 540, 1], [110, fc.x, fc.y, 1.9]]}>
      <Street offset={g * 12} time="dusk" />
      <Bike x={BX} w={W} speed={3} driver={{ expr: "worried", look: -1 }} />
      <BatteryBubble x={BX + 520} y={ROAD - 0.653 * W - 20} level={0.48} scale={1.1} />
    </Camera>
  );
};

/* ───────────── 4 · Messy wiring, battery under stress ───────────── */
export const T4: React.FC = () => {
  const M = at(5.6);
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={M} layout="none">
        <Camera keys={[[0, 1140, 420, 1.5], [M, 1140, 440, 1.9]]} shake={1.5}>
          <Shed />
          <svg width={1920} height={1080} style={{ position: "absolute" }}>
            <path d="M1110 480 C1180 560 1060 640 1180 700 S1120 820 1240 860" stroke="#111" strokeWidth={10} fill="none" />
            <path d="M1180 480 C1260 520 1300 600 1260 660" stroke="#8a2b2b" strokeWidth={8} fill="none" />
            <rect x={1222} y={650} width={60} height={44} rx={8} fill="#2a2a2a" transform="rotate(25 1252 672)" />
            <path d="M960 380 C1010 420 1050 380 1100 430 C1150 470 1190 400 1240 440" stroke="#2d4f8a" strokeWidth={6} fill="none" />
          </svg>
          <Sparks x={1180} y={480} />
          <Sparks x={1262} y={660} size={0.7} />
          <div style={{ position: "absolute", left: 900, top: 200, transform: "scale(0.8)" }}>
            <Warning size={200} />
          </div>
        </Camera>
        <Person x={1680} y={1060} scale={1.7} expr="shocked" arm="down" facing={-1} marks="!" />
      </Sequence>
      <Sequence from={M} layout="none">
        <FadeIn>
          <BatteryStress />
        </FadeIn>
      </Sequence>
    </AbsoluteFill>
  );
};

const BatteryStress: React.FC = () => {
  const f = useCurrentFrame();
  const swell = 1 + 0.04 * Math.abs(Math.sin(f / 6));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #3a0f14 0%, #12060a 70%)" }}>
      <Smoke x={860} y={330} n={8} color="rgba(90,90,90,0.6)" />
      <div style={{ position: "absolute", left: 620, top: 360, transform: `scale(${swell}) rotate(${Math.sin(f / 3) * 1.5}deg)` }}>
        <Battery level={0.3} color={C.red} width={620} blink />
      </div>
      <div style={{ position: "absolute", left: 1460, top: 140 }}>
        <Clock size={300} speed={50} color={C.orange} />
      </div>
      <Person x={300} y={1040} scale={1.5} expr="sad" arm="scratch" />
    </AbsoluteFill>
  );
};

/* ───────────── 5 · A light of hope ───────────── */
export const T5: React.FC = () => {
  const f = useCurrentFrame();
  const W = 700;
  const BX = 420;
  const fc = face(BX, W);
  const glow = interpolate(f, [35, 90], [0, 1], clamp);
  const hope = f > 55;
  return (
    <Camera keys={[[0, fc.x, fc.y, 2.2], [45, fc.x, fc.y, 2.2], [100, 1150, 560, 1.05], [160, 1250, 560, 1.0]]}>
      <Street offset={700} time="night" />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 100% 55%, rgba(43,245,154,${0.75 * glow}) 0%, rgba(255,194,26,${0.25 * glow}) 25%, transparent 55%)` }} />
      {new Array(7).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 1920,
            top: 600,
            width: 1400,
            height: 30,
            transformOrigin: "0 50%",
            transform: `rotate(${150 + i * 10 + Math.sin(f / 20 + i) * 2}deg)`,
            background: `linear-gradient(90deg, rgba(43,245,154,${0.35 * glow}), transparent)`,
            filter: "blur(10px)",
          }}
        />
      ))}
      <Bike x={BX} w={W} driver={{ expr: hope ? "hopeful" : "sad", look: hope ? 1 : 0, arm: "down" }} />
    </Camera>
  );
};

/* ───────────── 6 · Brand reveal at the station ───────────── */
export const T6: React.FC = () => {
  const f = useCurrentFrame();
  const lights = interpolate(f, [0, 14], [0.15, 1], clamp);
  const band = interpolate(f, [0, 20], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Camera keys={[[0, 960, 600, 1.15], [240, 960, 560, 1.0]]}>
        <Station lights={lights} />
        <Charger x={360} y={560} />
        <Charger x={900} y={560} />
        <Charger x={1440} y={560} />
      </Camera>
      <AbsoluteFill style={{ background: `linear-gradient(transparent 30%, rgba(5,14,26,${0.92 * band}) 62%)` }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 110, gap: 30 }}>
        <BrandLogo width={1000} delay={4} />
        <div style={{ width: 1500 }}>
          <Words text="নিরাপদ, দ্রুত এবং নির্ভরযোগ্য চার্জিং সেবা" size={52} weight={600} align="center" delay={at(2.8)} hl={["নিরাপদ,", "দ্রুত", "নির্ভরযোগ্য"]} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────────── 7 · Strong, steady power ───────────── */
export const T7: React.FC = () => {
  const f = useCurrentFrame();
  const W = 760;
  const BX = 260;
  const lvl = interpolate(f, [15, 160], [0.1, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return (
    <Camera keys={[[0, 960, 540, 1], [200, 820, 520, 1.12]]}>
      <Station />
      <Charger x={1260} y={560} scale={1.1} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <path d={`M1300 780 C1200 900 900 900 ${BX + 430} ${ROAD - 110}`} stroke="#1b1f24" strokeWidth={14} fill="none" />
        <path d={`M1300 780 C1200 900 900 900 ${BX + 430} ${ROAD - 110}`} stroke={C.green} strokeWidth={6} fill="none" strokeDasharray="18 30" strokeDashoffset={-f * 6} style={{ filter: `drop-shadow(0 0 8px ${C.green})` }} />
      </svg>
      <Bike x={BX} w={W} />
      <BatteryBubble x={BX + 430} y={ROAD - 0.653 * W + 220} level={lvl} scale={1.5} />
      {lvl > 0.98 ? <Sparks x={BX + 430} y={ROAD - 0.653 * W + 60} size={0.7} /> : null}
    </Camera>
  );
};

/* ───────────── 8 · Time matters: no more waiting ───────────── */
export const T8: React.FC = () => {
  const B = at(4.5);
  const Cc = at(10.6);
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={B} layout="none">
        <Camera keys={[[0, 960, 540, 1], [B, 960, 420, 1.5]]}>
          <Station />
          <Person x={960} y={ROAD - 168 * 1.35} scale={1.35} expr="neutral" arm="watch" look={1} />
          <div style={{ position: "absolute", left: 1160, top: 430 }}>
            <Clock size={200} speed={4} color={C.cyan} />
          </div>
        </Camera>
      </Sequence>
      <Sequence from={B} durationInFrames={Cc - B} layout="none">
        <FadeIn>
          <Hourglass />
        </FadeIn>
      </Sequence>
      <Sequence from={Cc} layout="none">
        <FadeIn>
          <TeaBreak />
        </FadeIn>
      </Sequence>
    </AbsoluteFill>
  );
};

const Hourglass: React.FC = () => {
  const f = useCurrentFrame();
  const d = at(10.6) - at(4.5);
  const t = interpolate(f, [0, d - 10], [0, 1], clamp);
  const notes = Math.round(8 * (1 - t));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #1d2a44 0%, #070d18 75%)" }}>
      <svg width={420} height={620} viewBox="0 0 420 620" style={{ position: "absolute", left: 750, top: 200 }}>
        <rect x={30} y={10} width={360} height={30} rx={10} fill="#b07a3a" />
        <rect x={30} y={580} width={360} height={30} rx={10} fill="#b07a3a" />
        <path d="M70 40 H350 Q350 200 230 310 Q350 420 350 580 H70 Q70 420 190 310 Q70 200 70 40 Z" fill="rgba(180,220,255,0.15)" stroke="#cfe6ff" strokeWidth={6} />
        <path d={`M${90 + 110 * t} ${60 + 200 * t} H${330 - 110 * t} Q300 230 210 305 Q120 230 ${90 + 110 * t} ${60 + 200 * t} Z`} fill="#FFC21A" opacity={1 - t * 0.2} />
        <rect x={207} y={300} width={6} height={260} fill="#FFC21A" opacity={0.9} />
        <path d={`M90 570 Q210 ${570 - 180 * t} 330 570 Z`} fill="#FFC21A" />
      </svg>
      {new Array(8).fill(0).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 300, top: 760 - i * 46, opacity: i < notes ? 1 : 0, transition: "none" }}>
          <Note x={0} y={0} s={1.4} />
        </div>
      ))}
      <Person x={1560} y={1000} scale={1.5} expr={t < 0.5 ? "worried" : "sad"} arm="cross" facing={-1} />
    </AbsoluteFill>
  );
};

const TeaBreak: React.FC = () => {
  const f = useCurrentFrame();
  const lvl = interpolate(f, [0, 100], [0.2, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const done = f > 110;
  return (
    <Camera keys={[[0, 960, 540, 1], [180, 1050, 520, 1.15]]}>
      <Station />
      <Charger x={140} y={560} />
      <Bike x={300} w={600} />
      <BatteryBubble x={300 + 360} y={ROAD - 0.653 * 600 + 170} level={lvl} scale={1.2} />
      <div style={{ position: "absolute", left: 1080, top: 760, width: 560, height: 30, background: "#7a5a3a", borderRadius: 6 }} />
      <div style={{ position: "absolute", left: 1110, top: 790, width: 24, height: 110, background: "#5a4028" }} />
      <div style={{ position: "absolute", left: 1590, top: 790, width: 24, height: 110, background: "#5a4028" }} />
      <Person x={1330} y={760} expr={done ? "proud" : "happy"} pose="sit" arm={done ? "thumb" : "tea"} shin={130} />
    </Camera>
  );
};

/* ───────────── 9 · Safety ───────────── */
export const T9: React.FC = () => {
  const S2 = at(3.8);
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={S2} layout="none">
        <PlugIn />
      </Sequence>
      <Sequence from={S2} layout="none">
        <FadeIn>
          <SafeRow cue={S2} />
        </FadeIn>
      </Sequence>
    </AbsoluteFill>
  );
};

const PlugIn: React.FC = () => {
  const f = useCurrentFrame();
  const px = interpolate(f, [5, 55], [-200, 760], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const click = interpolate(f, [55, 75], [0, 1], clamp);
  const sh = useSpring(62, 12);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 60% 50%, #0d3a28 0%, #04120c 75%)" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <rect x={1000} y={300} width={420} height={480} rx={40} fill="#0C7A4A" />
        <rect x={1060} y={380} width={300} height={320} rx={30} fill="#0a2318" />
        <circle cx={1160} cy={540} r={34} fill="#000" />
        <circle cx={1260} cy={540} r={34} fill="#000" />
        <path d={`M0 560 H${px}`} stroke="#1b1f24" strokeWidth={40} />
        <rect x={px} y={470} width={180} height={180} rx={24} fill="#24282e" />
        <rect x={px + 180} y={515} width={90} height={20} fill="#c9ced4" />
        <rect x={px + 180} y={575} width={90} height={20} fill="#c9ced4" />
        <circle cx={1210} cy={560} r={60 + click * 500} fill="none" stroke={C.green} strokeWidth={8} opacity={click > 0 ? 1 - click : 0} />
      </svg>
      <div style={{ position: "absolute", left: 1230, top: 120, transform: `scale(${sh})`, opacity: Math.min(1, sh * 2), transformOrigin: "50% 100%" }}>
        <Shield size={260} progress={interpolate(f, [62, 100], [0, 1], clamp)} />
      </div>
    </AbsoluteFill>
  );
};

const SafeRow: React.FC<{ cue: number }> = ({ cue }) => {
  const badges: { t: string; d: number; c: string; icon: React.ReactNode }[] = [
    { t: "সঠিক সংযোগ", d: at(7.3) - cue, c: C.green, icon: <PlugIcon /> },
    { t: "সুশৃঙ্খল ব্যবস্থা", d: at(8.5) - cue, c: C.cyan, icon: <GridIcon /> },
    { t: "নিরাপত্তা", d: at(9.9) - cue, c: C.yellow, icon: <ShieldIcon /> },
  ];
  return (
    <AbsoluteFill>
      <Camera keys={[[0, 960, 560, 1], [240, 960, 600, 1.05]]}>
        <Station />
        {[0, 1, 2].map((i) => (
          <React.Fragment key={i}>
            <Bike x={60 + i * 600} w={430} />
            <Charger x={60 + i * 600 + 420} y={640} scale={0.8} />
          </React.Fragment>
        ))}
      </Camera>
      <AbsoluteFill style={{ flexDirection: "row", justifyContent: "center", alignItems: "flex-start", paddingTop: 440, gap: 30 }}>
        {badges.map((b, i) => (
          <Pill key={i} delay={b.d} size={46} color={b.c}>
            {b.icon}
            {b.t}
          </Pill>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const PlugIcon = () => (
  <svg width={50} height={50} viewBox="0 0 24 24"><path d="M7 2v5M17 2v5M5 7h14v4a7 7 0 0 1-14 0zM12 18v4" stroke={C.green} strokeWidth={2.4} fill="none" strokeLinecap="round" /></svg>
);
const GridIcon = () => (
  <svg width={50} height={50} viewBox="0 0 24 24"><path d="M3 5h18M3 12h18M3 19h18" stroke={C.cyan} strokeWidth={2.6} strokeLinecap="round" /></svg>
);
const ShieldIcon = () => (
  <svg width={50} height={50} viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" fill={C.yellow} /><path d="M8 12l3 3 5-6" stroke="#0a2318" strokeWidth={2.4} fill="none" /></svg>
);

/* ───────────── 10 · Back on the road, team waves ───────────── */
export const T10: React.FC = () => {
  const M = at(5.2);
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={M} layout="none">
        <DriveOff end={M} />
      </Sequence>
      <Sequence from={M} layout="none">
        <FadeIn>
          <Camera keys={[[0, 960, 560, 1], [140, 960, 400, 1.6]]}>
            <Station />
            <Charger x={300} y={560} />
            <Person x={960} y={ROAD - 168 * 1.4} scale={1.4} expr="happy" arm="thumb" shirt="#0C7A4A" lungi="#26313b" gamchha={false} cap="#0A5F3A" seed={9} />
            <Sparks x={1180} y={520} size={0.5} />
          </Camera>
        </FadeIn>
      </Sequence>
    </AbsoluteFill>
  );
};

const DriveOff: React.FC<{ end: number }> = ({ end }) => {
  const f = useCurrentFrame();
  const go = at(2.6);
  const x = f < go ? 260 : 260 + ((f - go) ** 2) * 0.55;
  return (
    <Camera keys={[[0, 960, 540, 1], [end, 1000, 540, 1.05]]}>
      <Station />
      <Charger x={110} y={560} />
      <Person x={1560} y={ROAD - 168} expr="happy" arm="wave" shirt="#0C7A4A" lungi="#26313b" gamchha={false} cap="#0A5F3A" seed={9} facing={-1} />
      <Bike x={x} w={680} speed={f < go ? 0 : 4} driver={{ expr: "happy", arm: "handle" }} />
    </Camera>
  );
};

/* ───────────── 11 · More time on the road = more income ───────────── */
export const T11: React.FC = () => {
  const f = useCurrentFrame();
  const M = at(5.6);
  const W = 760;
  const BX = 520;
  const cues = [at(7.4) - M, at(8.5) - M, at(9.6) - M];
  return (
    <AbsoluteFill>
      <Camera keys={[[0, 960, 560, 1], [M, 1020, 520, 1.08], [M + 200, 960, 560, 1]]}>
        <Street offset={f * 13} time="day" />
        <Bike x={BX} w={W} speed={4} driver={{ expr: "happy" }} passengers="happy" />
        {new Array(6).fill(0).map((_, i) => {
          const t = (f - 20 - i * 26) / 50;
          if (t < 0 || t > 1) return null;
          return (
            <div key={i} style={{ position: "absolute", left: BX + 200 + (i % 3) * 160, top: ROAD - 0.653 * W - 40 - t * 200, opacity: interpolate(t, [0, 0.15, 0.75, 1], [0, 1, 1, 0]) }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.green, textShadow: "0 3px 0 #0a2318, 0 0 20px rgba(43,245,154,0.6)" }}>+৳</div>
            </div>
          );
        })}
      </Camera>
      <Sequence from={M} layout="none">
        <AbsoluteFill style={{ flexDirection: "row", justifyContent: "center", alignItems: "flex-start", paddingTop: 80, gap: 30 }}>
          <Pill delay={cues[0]} size={46} color={C.green}>কম ঝামেলা</Pill>
          <Pill delay={cues[1]} size={46} color={C.cyan}>কম অপেক্ষা</Pill>
          <Pill delay={cues[2]} size={46} color={C.yellow}>বেশি কাজের সময়</Pill>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

/* ───────────── 13 · Confident driver, end card ───────────── */
export const T13: React.FC = () => {
  const f = useCurrentFrame();
  const O = at(3.3);
  const phone = useSpring(at(9.4), 12);
  const glow = 0.5 + 0.5 * Math.sin(f / 10);
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={O + 8} layout="none">
        <Camera keys={[[0, 960, 560, 1], [O, 760, 420, 1.45]]}>
          <Station />
          <Bike x={980} w={640} />
          <Person x={760} y={ROAD - 168 * 1.3} scale={1.3} expr="proud" arm="thumb" />
          <Person x={330} y={ROAD - 168 * 1.15} scale={1.15} expr="happy" arm="wave" shirt="#0C7A4A" lungi="#26313b" gamchha={false} cap="#0A5F3A" seed={9} />
          <Sparks x={900} y={500} size={0.5} />
        </Camera>
      </Sequence>
      <Sequence from={O} layout="none">
        <FadeIn dur={10}>
          <Bg tint="brand" />
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 18 }}>
            <BrandLogo width={1050} delay={at(3.6) - O} />
            <Words text="আপনার গাড়ির শক্তির নির্ভরযোগ্য ঠিকানা।" size={60} weight={600} align="center" delay={at(5.8) - O} style={{ marginTop: 40 }} />
            <div
              style={{
                marginTop: 40,
                display: "flex",
                alignItems: "center",
                gap: 24,
                fontFamily: FONT,
                fontSize: 64,
                fontWeight: 800,
                color: C.bg,
                background: `linear-gradient(135deg, ${C.green}, ${C.cyan})`,
                padding: "20px 56px",
                borderRadius: 999,
                boxShadow: `0 0 ${40 + glow * 40}px ${C.green}88`,
                transform: `scale(${0.5 + 0.5 * phone})`,
                opacity: Math.min(1, phone * 1.5),
              }}
            >
              <Phone size={60} />
              ০১৬১৬১৫৫০০২
            </div>
          </AbsoluteFill>
        </FadeIn>
      </Sequence>
    </AbsoluteFill>
  );
};
