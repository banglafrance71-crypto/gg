import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { Card, Line, Pill, Scene, useSpring, Words } from "./components";
import {
  Battery,
  Bolt,
  Check,
  Clock,
  Gauge,
  Phone,
  Pin,
  Shield,
  Warning,
} from "./icons";
import { at, bn, C, FONT } from "./theme";
import { BrandLogo } from "./brand";
import { CycleRickshaw, EasyBike } from "./vehicles";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const center: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};

/* 1 ─ Hook: dead battery / slow charge */
export const S1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const SPLIT = at(3.2);
  const phase2 = f >= SPLIT;
  const lvl = phase2
    ? interpolate(f, [SPLIT + 5, SPLIT + 95], [0.08, 0.68], {
        ...clamp,
        easing: Easing.out(Easing.cubic),
      }) + (f > SPLIT + 95 ? Math.sin(f / 6) * 0.004 : 0)
    : interpolate(f, [0, SPLIT - 30], [0.4, 0.04], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const col = phase2 ? C.yellow : lvl < 0.15 ? C.red : C.orange;
  const s = useSpring(0, 14);
  const shake = !phase2 && f > SPLIT - 35 && f < SPLIT - 5 ? Math.sin(f * 2.2) * 6 : 0;
  return (
    <Scene tint="danger">
      <AbsoluteFill style={{ flexDirection: "row", ...center, gap: 110, padding: "0 140px" }}>
        <div
          style={{
            transform: `scale(${0.7 + 0.3 * s}) translateX(${shake}px)`,
            opacity: s,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <Battery level={lvl} color={col} width={460} blink={!phase2 && lvl < 0.15} />
          <div style={{ fontFamily: FONT, fontSize: 88, fontWeight: 800, color: col, textShadow: `0 0 30px ${col}` }}>
            {bn(Math.round(lvl * 100))}%
          </div>
        </div>
        <div style={{ width: 980, position: "relative", height: 400 }}>
          <Line from={0} dur={SPLIT} style={{ position: "absolute", top: 60 }}>
            <Words text="চার্জ শেষ হয়ে রাস্তায় আটকে গেছেন কখনো?" size={92} weight={700} hl={["আটকে", "গেছেন"]} hlColor={C.red} />
          </Line>
          <Line from={SPLIT} dur={200} last style={{ position: "absolute", top: 20 }}>
            <Words text="অথবা ঘণ্টার পর ঘণ্টা চার্জ দিয়েও দেখেছেন—" size={66} weight={600} color={C.muted} />
            <Words text="ব্যাটারি ঠিকমতো ফুল হচ্ছে না?" size={92} weight={700} delay={36} hl={["ফুল", "না?"]} hlColor={C.yellow} style={{ marginTop: 14 }} />
          </Line>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 2 ─ Driver's income loss */
export const S2Loss: React.FC = () => {
  const f = useCurrentFrame();
  const big = useSpring(at(3.2), 10);
  return (
    <Scene tint="danger">
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 110 }}>
        <Words text="একজন অটোরিকশা চালকের জন্য এটা শুধু ঝামেলা নয়," size={64} align="center" color={C.muted} />
        <div
          style={{
            marginTop: 26,
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 120,
            color: C.red,
            transform: `scale(${0.4 + 0.6 * big})`,
            opacity: Math.min(1, big * 1.5),
            textShadow: `0 0 50px ${C.red}88`,
          }}
        >
          এটা সরাসরি আয়ের ক্ষতি।
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ top: 560, alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <EasyBike width={600} hazard />
          {[0, 1, 2, 3, 4].map((i) => {
            const t = (f - at(3.3) - i * 14) / 60;
            if (t < 0) return null;
            const y = interpolate(t, [0, 1], [0, 260], clamp);
            const o = interpolate(t, [0, 0.2, 0.8, 1], [0, 1, 1, 0], clamp);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 640 + i * 70,
                  top: -40 + y,
                  fontFamily: FONT,
                  fontSize: 70,
                  fontWeight: 800,
                  color: C.red,
                  opacity: o,
                  transform: `rotate(${t * 40 * (i % 2 ? 1 : -1)}deg)`,
                }}
              >
                ৳
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 3 ─ Problems at charging points */
export const S3Problems: React.FC = () => {
  const f = useCurrentFrame();
  const items = [
    { t: "ভোল্টেজ কম", icon: <Gauge value={0.12 + Math.sin(f / 9) * 0.04} size={150} />, c: C.red },
    { t: "চার্জ হতে অনেক সময়", icon: <Clock size={150} speed={14} color={C.orange} />, c: C.orange },
    {
      t: "পুরো চার্জের আগেই বের হওয়া",
      icon: <Battery level={0.45} color={C.yellow} width={190} />,
      c: C.yellow,
    },
  ];
  return (
    <Scene tint="danger">
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 120 }}>
        <Words text="অনেক জায়গায় চার্জ দিতে গিয়ে সমস্যার শেষ নেই।" size={80} weight={700} align="center" hl={["সমস্যার"]} hlColor={C.orange} />
        <div style={{ display: "flex", gap: 50, marginTop: 90 }}>
          {items.map((it, i) => (
            <Card key={i} delay={[at(3.2), at(4.6), at(6.8)][i]} accent={it.c} style={{ width: 470, height: 380, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 34 }}>
              <div style={{ height: 160, display: "flex", alignItems: "center" }}>{it.icon}</div>
              <div style={{ fontFamily: FONT, fontSize: 46, fontWeight: 700, color: C.text, textAlign: "center", lineHeight: 1.3 }}>{it.t}</div>
            </Card>
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 90, width: 1500 }}>
          <Words
            text="কখনো ভোল্টেজ কম, কখনো চার্জ হতে অনেক সময় লাগে। আবার কখনো ব্যাটারি পুরো চার্জ হওয়ার আগেই গাড়ি নিয়ে বের হতে হয়।"
            size={38}
            weight={500}
            color={C.muted}
            align="center"
            delay={at(3.3)}
            stagger={4}
          />
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 4 ─ Messy wiring, unsafe setup */
const WIRE =
  "M80 300 C200 120 300 480 420 300 S620 120 700 320 S560 520 460 420 S300 220 380 160 S640 140 760 260 S900 460 980 300";
export const S4Wiring: React.FC = () => {
  const f = useCurrentFrame();
  const draw = interpolate(f, [0, 90], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const spark = f > 60 && Math.floor(f / 4) % 3 !== 0;
  return (
    <Scene tint="danger">
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 120px", gap: 60 }}>
        <div style={{ position: "relative", width: 820, height: 600 }}>
          <svg width={820} height={600} viewBox="0 0 1060 600">
            <path d={WIRE} fill="none" stroke="#1a1a1a" strokeWidth={26} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
            <path d={WIRE} fill="none" stroke={C.orange} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} opacity={0.9} />
            {spark
              ? [0, 1, 2, 3, 4, 5].map((i) => {
                  const a = (i / 6) * Math.PI * 2 + f;
                  return (
                    <line key={i} x1={700} y1={320} x2={700 + Math.cos(a) * 60} y2={320 + Math.sin(a) * 60} stroke={C.yellow} strokeWidth={5} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${C.yellow})` }} />
                  );
                })
              : null}
            {spark ? <circle cx={700} cy={320} r={22} fill="#fff" opacity={0.9} style={{ filter: `drop-shadow(0 0 30px ${C.yellow})` }} /> : null}
          </svg>
          <div style={{ position: "absolute", right: 0, top: 0 }}>
            <Warning size={170} />
          </div>
        </div>
        <div style={{ flex: 1, position: "relative", height: 520 }}>
          <Line from={0} dur={at(5.6)} style={{ position: "absolute", top: 40 }}>
            <Words text="তার ওপর অপরিকল্পিত তার, দুর্বল সংযোগ আর নিরাপত্তাহীন চার্জিং ব্যবস্থা—" size={72} weight={700} hl={["অপরিকল্পিত", "দুর্বল", "নিরাপত্তাহীন"]} hlColor={C.orange} />
          </Line>
          <Line from={at(5.6)} dur={200} last style={{ position: "absolute", top: 60 }}>
            <Words text="সব মিলিয়ে সময় নষ্ট হয়," size={72} weight={700} hl={["নষ্ট"]} hlColor={C.red} />
            <Words text="ব্যাটারির ওপরও পড়ে বাড়তি চাপ।" size={72} weight={700} delay={45} hl={["বাড়তি", "চাপ।"]} hlColor={C.red} style={{ marginTop: 10 }} />
          </Line>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 5 ─ Bridge into the solution */
export const S5Bridge: React.FC = () => {
  const f = useCurrentFrame();
  const line = interpolate(f, [50, 120], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <Scene tint="neutral">
      <AbsoluteFill style={{ ...center, flexDirection: "column", gap: 60 }}>
        <Words text="এই সমস্যাগুলোর সহজ ও নির্ভরযোগ্য সমাধান নিয়েই এসেছে—" size={80} weight={700} align="center" hl={["সহজ", "নির্ভরযোগ্য", "সমাধান"]} hlColor={C.green} style={{ width: 1500 }} />
        <div style={{ width: 1200 * line, height: 6, borderRadius: 3, background: `linear-gradient(90deg, transparent, ${C.green}, ${C.cyan}, transparent)`, boxShadow: `0 0 30px ${C.green}` }} />
      </AbsoluteFill>
    </Scene>
  );
};

/* 6 ─ Brand reveal */
export const S6Brand: React.FC = () => {
  const f = useCurrentFrame();
  const flash = interpolate(f, [0, 4, 22], [0, 0.85, 0], clamp);
  const ring = interpolate(f, [4, 60], [0, 1], clamp);
  return (
    <Scene tint="brand">
      <AbsoluteFill style={{ ...center }}>
        <div style={{ position: "absolute", width: 300 + ring * 1400, height: 300 + ring * 1400, borderRadius: "50%", border: `3px solid ${C.green}`, opacity: 1 - ring }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ ...center, flexDirection: "column", gap: 30 }}>
        <BrandLogo width={1250} delay={2} />
        <div style={{ marginTop: 50, width: 1500 }}>
          <Words text="আপনার অটোরিকশার জন্য নিরাপদ, দ্রুত এবং নির্ভরযোগ্য চার্জিং সেবা।" size={54} weight={500} color={C.text} align="center" delay={at(2.8)} hl={["নিরাপদ,", "দ্রুত", "নির্ভরযোগ্য"]} hlColor={C.green} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </Scene>
  );
};

/* 7 ─ High capacity, stable power */
export const S7Power: React.FC = () => {
  const f = useCurrentFrame();
  const lvl = interpolate(f, [20, 150], [0.1, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const pts = new Array(60)
    .fill(0)
    .map((_, i) => {
      const x = i * 10;
      const y = 60 + Math.sin(i / 3 + f / 6) * 26;
      return `${i === 0 ? "M" : "L"}${x} ${y}`;
    })
    .join(" ");
  const wave = interpolate(f, [30, 80], [0, 1], clamp);
  return (
    <Scene tint="brand">
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 110 }}>
        <div style={{ width: 1600 }}>
          <Words text="এখানে রয়েছে উচ্চ ক্ষমতার এবং স্থিতিশীল বিদ্যুৎ সরবরাহ," size={74} weight={700} align="center" hl={["উচ্চ", "ক্ষমতার", "স্থিতিশীল"]} />
          <Words text="যাতে আপনার গাড়ি নির্ভরযোগ্যভাবে চার্জ নিতে পারে।" size={56} weight={500} color={C.muted} align="center" delay={30} style={{ marginTop: 10 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 120, marginTop: 90 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <Battery level={lvl} color={C.green} width={440} bolt />
            <div style={{ fontFamily: FONT, fontSize: 80, fontWeight: 800, color: C.green, textShadow: `0 0 30px ${C.green}` }}>{bn(Math.round(lvl * 100))}%</div>
          </div>
          <Card delay={40} accent={C.cyan} style={{ width: 640, padding: 40 }}>
            <div style={{ fontFamily: FONT, fontSize: 40, fontWeight: 600, color: C.cyan, marginBottom: 14 }}>স্থিতিশীল বিদ্যুৎ সরবরাহ</div>
            <svg width={560} height={120} viewBox="0 0 590 120">
              <path d={pts} fill="none" stroke={C.cyan} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - wave} style={{ filter: `drop-shadow(0 0 10px ${C.cyan})` }} />
            </svg>
            <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
              <Pill delay={90} size={34} color={C.green}><Bolt size={36} /> উচ্চ ক্ষমতা</Pill>
              <Pill delay={104} size={34} color={C.cyan}>✓ স্থিতিশীল</Pill>
            </div>
          </Card>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 8 ─ Time matters */
export const S8Time: React.FC = () => {
  const s = useSpring(0, 14);
  return (
    <Scene tint="neutral">
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 150px", gap: 110 }}>
        <div style={{ transform: `scale(${0.6 + 0.4 * s})`, opacity: s }}>
          <Clock size={460} speed={4} color={C.cyan} />
        </div>
        <div style={{ flex: 1, position: "relative", height: 560 }}>
          <Line from={0} dur={at(4.5)} style={{ position: "absolute", top: 150 }}>
            <Words text="আমরা বুঝি, একজন চালকের কাছে সময় কতটা গুরুত্বপূর্ণ।" size={80} weight={700} hl={["সময়"]} hlColor={C.cyan} />
          </Line>
          <Line from={at(4.5)} dur={at(10.6) - at(4.5)} style={{ position: "absolute", top: 110 }}>
            <Words text="কারণ চার্জের জন্য যত বেশি সময় অপেক্ষা করবেন," size={70} weight={600} color={C.muted} />
            <Words text="রাস্তায় কাজ করার সময় তত কমে যাবে।" size={78} weight={700} delay={80} hl={["কমে"]} hlColor={C.orange} style={{ marginTop: 14 }} />
          </Line>
          <Line from={at(10.6)} dur={260} last style={{ position: "absolute", top: 70 }}>
            <Words text="তাই আমাদের লক্ষ্য—" size={64} weight={600} color={C.green} />
            <Words text="অপ্রয়োজনীয় অপেক্ষা কমিয়ে যতটা সম্ভব কার্যকর ও সুবিধাজনক চার্জিং সেবা দেওয়া।" size={72} weight={700} delay={30} hl={["কার্যকর", "সুবিধাজনক"]} style={{ marginTop: 14 }} />
          </Line>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 9 ─ Safety first */
export const S9Safety: React.FC = () => {
  const f = useCurrentFrame();
  const S2 = at(3.8) - 5;
  const shieldP = interpolate(f, [S2 + 10, S2 + 75], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const items = ["সঠিক সংযোগ", "সুশৃঙ্খল চার্জিং ব্যবস্থা", "নিরাপত্তা"];
  return (
    <Scene tint="brand">
      <Sequence durationInFrames={S2 + 5} layout="none">
        <AbsoluteFill style={{ ...center }}>
          <Line from={0} dur={S2 + 5}>
            <div style={{ width: 1500 }}>
              <Words text="চার্জিং শুধু দ্রুত হলেই হবে না," size={84} weight={700} align="center" />
              <Words text="সেটি নিরাপদও হতে হবে।" size={110} weight={800} align="center" delay={24} hl={["নিরাপদও"]} style={{ marginTop: 10 }} />
            </div>
          </Line>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={S2} layout="none">
        <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 170px", gap: 120 }}>
          <Shield size={400} progress={shieldP} />
          <div style={{ flex: 1 }}>
            <Words text="তাই নিরাপদ অটো চার্জিং স্টেশনে গুরুত্ব দেওয়া হয়েছে—" size={58} weight={600} color={C.muted} delay={10} />
            <div style={{ display: "flex", flexDirection: "column", gap: 28, marginTop: 44 }}>
              {items.map((t, i) => (
                <CheckRow key={i} text={t} delay={[at(7.3), at(8.5), at(9.9)][i] - S2} />
              ))}
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </Scene>
  );
};

const CheckRow: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const s = useSpring(delay, 16);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 30, opacity: Math.min(1, s * 1.4), transform: `translateX(${(1 - s) * 80}px)`, background: C.card, border: `1.5px solid ${C.cardBorder}`, borderRadius: 24, padding: "22px 36px" }}>
      <Check size={72} p={s} />
      <div style={{ fontFamily: FONT, fontSize: 64, fontWeight: 700, color: C.text }}>{text}</div>
    </div>
  );
};

/* 10 ─ Your goal / our goal */
export const S10Goals: React.FC = () => (
  <Scene tint="brand">
    <AbsoluteFill style={{ flexDirection: "row", ...center, gap: 70 }}>
      <Card delay={8} from="left" accent={C.cyan} style={{ width: 780, height: 520 }}>
        <div style={{ fontFamily: FONT, fontSize: 44, fontWeight: 600, color: C.cyan }}>আপনার লক্ষ্য একটাই—</div>
        <div style={{ marginTop: 34 }}>
          <Words text="গাড়ি ভালোভাবে চার্জ করে আবার দ্রুত রাস্তায় ফেরা।" size={70} weight={700} delay={24} hl={["দ্রুত", "রাস্তায়"]} hlColor={C.cyan} />
        </div>
      </Card>
      <Card delay={at(5.2)} from="right" accent={C.green} style={{ width: 780, height: 520 }}>
        <div style={{ fontFamily: FONT, fontSize: 44, fontWeight: 600, color: C.green }}>আর আমাদের লক্ষ্য—</div>
        <div style={{ marginTop: 34 }}>
          <Words text="আপনাকে একটি নির্ভরযোগ্য চার্জিং অভিজ্ঞতা দেওয়া।" size={70} weight={700} delay={at(5.2) + 16} hl={["নির্ভরযোগ্য"]} />
        </div>
      </Card>
    </AbsoluteFill>
  </Scene>
);

/* 11 ─ More time on the road = more income */
export const S11Income: React.FC = () => {
  const f = useCurrentFrame();
  const bars = [0.3, 0.45, 0.6, 0.78, 1];
  return (
    <Scene tint="brand">
      {/* road */}
      <AbsoluteFill style={{ top: 860, height: 220, background: "linear-gradient(#1b2633, #0c131c)" }}>
        <div style={{ position: "absolute", top: 100, left: 0, right: 0, height: 10, backgroundImage: `repeating-linear-gradient(90deg, ${C.yellow} 0 80px, transparent 80px 160px)`, backgroundPosition: `${-f * 18}px 0`, opacity: 0.8 }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ top: 642, left: interpolate(f, [0, 70], [-900, 60], { ...clamp, easing: Easing.out(Easing.cubic) }) }}>
        <CycleRickshaw width={330} speed={3} />
      </AbsoluteFill>
      <AbsoluteFill style={{ top: 572, left: interpolate(f, [0, 60], [-700, 430], { ...clamp, easing: Easing.out(Easing.cubic) }) }}>
        <EasyBike width={460} speed={3} />
      </AbsoluteFill>
      {/* chart */}
      <div style={{ position: "absolute", right: 170, top: 470, display: "flex", alignItems: "flex-end", gap: 26, height: 330 }}>
        {bars.map((b, i) => {
          const h = interpolate(f, [30 + i * 10, 70 + i * 10], [0, b], { ...clamp, easing: Easing.out(Easing.cubic) });
          return <div key={i} style={{ width: 70, height: 320 * h, borderRadius: 14, background: `linear-gradient(${C.green}, ${C.greenDeep}55)`, boxShadow: `0 0 30px ${C.green}44` }} />;
        })}
        <div style={{ position: "absolute", top: -90, right: 0, fontFamily: FONT, fontSize: 64, fontWeight: 800, color: C.green, opacity: interpolate(f, [90, 110], [0, 1], clamp) }}>৳ ↑</div>
      </div>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 110 }}>
        <div style={{ width: 1600, position: "relative", height: 330 }}>
          <Line from={0} dur={at(5.6)} style={{ position: "absolute", width: "100%" }}>
            <Words text="কারণ গাড়ি যত বেশি সময় রাস্তায় থাকবে," size={72} weight={700} align="center" />
            <Words text="আপনার আয়ের সুযোগও তত বেশি থাকবে।" size={84} weight={800} align="center" delay={24} hl={["আয়ের", "বেশি"]} style={{ marginTop: 10 }} />
          </Line>
          <Line from={at(5.6)} dur={240} last style={{ position: "absolute", width: "100%" }}>
            <Words text="ভালো চার্জিং মানে—" size={70} weight={700} align="center" color={C.green} />
            <div style={{ display: "flex", gap: 30, justifyContent: "center", marginTop: 36 }}>
              <Pill delay={at(7.4) - at(5.6)} size={48} color={C.green}>কম ঝামেলা</Pill>
              <Pill delay={at(8.5) - at(5.6)} size={48} color={C.cyan}>কম অপেক্ষা</Pill>
              <Pill delay={at(9.6) - at(5.6)} size={48} color={C.yellow}>কাজের জন্য বেশি সময়</Pill>
            </div>
          </Line>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 12 ─ Location */
export const S12Location: React.FC = () => {
  const f = useCurrentFrame();
  const drop = useSpring(15, 9);
  const rip = ((f - 35) % 50) / 50;
  const mapS = useSpring(0, 200, 30);
  return (
    <Scene tint="neutral">
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 140px", gap: 90 }}>
        <div style={{ position: "relative", width: 700, height: 700, borderRadius: 40, overflow: "hidden", background: "#0d1e30", border: `2px solid ${C.cardBorder}`, opacity: mapS, transform: `scale(${0.9 + 0.1 * mapS}) rotate(-2deg)`, boxShadow: "0 40px 100px rgba(0,0,0,0.5)" }}>
          <svg width={700} height={700} viewBox="0 0 700 700" style={{ position: "absolute" }}>
            <path d="M0 420 C200 400 400 460 700 380" stroke="#2c4a66" strokeWidth={44} fill="none" />
            <path d="M330 0 C320 250 360 450 340 700" stroke="#2c4a66" strokeWidth={36} fill="none" />
            <path d="M0 160 L700 240" stroke="#22394f" strokeWidth={20} fill="none" />
            <path d="M560 0 L520 700" stroke="#22394f" strokeWidth={18} fill="none" />
            <path d="M0 600 L700 560" stroke="#22394f" strokeWidth={16} fill="none" />
            <path d="M0 420 C200 400 400 460 700 380" stroke={C.yellow} strokeOpacity={0.35} strokeWidth={3} strokeDasharray="18 18" fill="none" />
            <rect x={380} y={250} width={130} height={100} rx={12} fill="#173048" />
            <text x={445} y={308} textAnchor="middle" fontSize={44} fill={C.red} fontWeight={800}>+</text>
            <rect x={90} y={210} width={160} height={150} rx={12} fill="#14283c" />
            <rect x={90} y={460} width={180} height={110} rx={12} fill="#14283c" />
            <rect x={400} y={470} width={100} height={70} rx={12} fill="#14283c" />
          </svg>
          {f > 35 ? (
            <div style={{ position: "absolute", left: 340 - 90 * rip * 2, top: 425 - 30 * rip * 2, width: 180 * rip * 2, height: 60 * rip * 2, borderRadius: "50%", border: `4px solid ${C.red}`, opacity: 1 - rip }} />
          ) : null}
          <div style={{ position: "absolute", left: 270, top: 250 + (1 - drop) * -350, opacity: Math.min(1, drop * 2) }}>
            <Pin size={140} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <Words text="আমাদের খুঁজে পাবেন—" size={66} weight={700} color={C.cyan} delay={20} />
          <Card delay={at(1.2)} accent={C.red} style={{ marginTop: 40, padding: "44px 50px" }}>
            <Words text="সরকারি হাসপাতালের পাশে," size={62} weight={700} delay={at(1.4)} />
            <Words text="কুসুমবাগ, হাসপাতাল রোড," size={58} weight={600} delay={at(3.2)} style={{ marginTop: 10 }} />
            <Words text="দিরাই পৌরসভা, দিরাই, সুনামগঞ্জ।" size={58} weight={600} delay={at(5.0)} color={C.muted} style={{ marginTop: 10 }} />
          </Card>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 13 ─ Outro */
export const S13Outro: React.FC = () => {
  const f = useCurrentFrame();
  const O = at(3.3);
  const phone = useSpring(at(9.4), 12);
  const glow = 0.5 + 0.5 * Math.sin(f / 10);
  return (
    <Scene tint="brand">
      <Sequence durationInFrames={O + 5} layout="none">
        <AbsoluteFill style={{ ...center }}>
          <Line from={0} dur={O + 5}>
            <Words text="চার্জ নিয়ে দুশ্চিন্তা নয়—" size={96} weight={700} align="center" color={C.muted} />
            <Words text="আত্মবিশ্বাস নিয়ে চলুন।" size={130} weight={800} align="center" delay={28} hl={["আত্মবিশ্বাস"]} style={{ marginTop: 16 }} />
          </Line>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={O} layout="none">
        <AbsoluteFill style={{ ...center, flexDirection: "column", gap: 18 }}>
          <BrandLogo width={1050} delay={at(3.6) - O} />
          <Words text="আপনার গাড়ির শক্তির নির্ভরযোগ্য ঠিকানা।" size={60} weight={600} align="center" delay={at(5.8) - O} style={{ marginTop: 40 }} />
          <div
            style={{
              marginTop: 40,
              display: "flex",
              alignItems: "center",
              gap: 24,
              fontFamily: FONT,
              fontSize: 60,
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
            <Phone size={56} />
            যোগাযোগ: ০১৬১৬১৫৫০০২
          </div>
        </AbsoluteFill>
      </Sequence>
    </Scene>
  );
};
