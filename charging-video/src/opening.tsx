import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { Bg, Card, Words, useSpring } from "./components";
import { BrandLogo } from "./brand";
import { Phone, Pin } from "./icons";
import { Marks, Person, PersonG, Expr, Arm } from "./people";
import { EasyBike } from "./vehicles";
import { BatteryBubble, Camera, Charger, Note, Station, Street } from "./world";
import { at, C, FONT } from "./theme";

/* Nirapod Auto Charging Station — opening (উদ্বোধন) promo. Voice: public/vo2/sNN.mp3 */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ROAD = 900;

const Bike: React.FC<{
  x: number;
  w: number;
  ground?: number;
  speed?: number;
  hazard?: boolean;
  jerk?: number;
  driver?: { expr: Expr; arm?: Arm; look?: number; marks?: "?" | "!" | "z"; marksDelay?: number } | null;
  passengers?: Expr | null;
}> = ({ x, w, ground = ROAD, speed = 0, hazard, jerk, driver, passengers }) => (
  <div style={{ position: "absolute", left: x, top: ground - 0.653 * w }}>
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
const face = (x: number, w: number, ground = ROAD) => ({ x: x + 0.745 * w, y: ground - 0.653 * w + 0.135 * w });

/* Sky clock: a sun (or moon) travelling on an arc, t = 0..1 */
/* low = compact arc that stays above a station sign (sign top at y=200) */
const SkyBody: React.FC<{ t: number; moon?: boolean; low?: boolean }> = ({ t, moon, low }) => {
  const x = 150 + t * 1620;
  const y = low ? 125 - Math.sin(t * Math.PI) * 55 : 420 - Math.sin(t * Math.PI) * 320;
  const r = low ? 45 : 70;
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        background: moon ? "#E9EEF7" : t > 0.75 ? "#FFB36B" : "#FFE27A",
        boxShadow: moon ? "0 0 60px #9fb6ff88" : `0 0 120px ${t > 0.75 ? "#FF8A3D" : "#FFD23F"}`,
      }}
    />
  );
};

/* Festive bunting + opening ribbon for the station */
const Bunting: React.FC<{ y?: number }> = ({ y = 120 }) => {
  const f = useCurrentFrame();
  const cols = ["#E53935", "#FFC21A", "#0C7A4A", "#1E88E5", "#F4F4F4"];
  return (
    <svg width={1920} height={140} style={{ position: "absolute", left: 0, top: y }}>
      <path d="M0 10 Q960 70 1920 10" stroke="#5b4630" strokeWidth={3} fill="none" />
      {new Array(30).fill(0).map((_, i) => {
        const x = 20 + i * 64;
        const t = x / 1920;
        const yy = 10 + 4 * 60 * t * (1 - t);
        const sw = Math.sin(f / 8 + i) * 4;
        return <path key={i} d={`M${x} ${yy} L${x + 44} ${yy} L${x + 22 + sw} ${yy + 52} Z`} fill={cols[i % cols.length]} />;
      })}
    </svg>
  );
};

const Ribbon: React.FC<{ cut?: number }> = ({ cut = 0 }) => {
  const drop = interpolate(cut, [0, 1], [0, 1], clamp);
  return (
    <svg width={1920} height={400} style={{ position: "absolute", left: 0, top: 520 }}>
      <g transform={`rotate(${drop * 35} 260 60)`} opacity={1 - drop * 0.3}>
        <rect x={260} y={50} width={700} height={26} fill="#D32F2F" />
      </g>
      <g transform={`rotate(${-drop * 35} 1660 60)`} opacity={1 - drop * 0.3}>
        <rect x={960} y={50} width={700} height={26} fill="#D32F2F" />
      </g>
      {drop < 0.05 ? (
        <g transform="translate(960 63)">
          <path d="M0 0 L-70 -40 L-70 40 Z M0 0 L70 -40 L70 40 Z" fill="#B71C1C" />
          <circle r={18} fill="#FFC21A" />
        </g>
      ) : null}
      <rect x={240} y={20} width={20} height={380} fill="#8a8f96" />
      <rect x={1660} y={20} width={20} height={380} fill="#8a8f96" />
    </svg>
  );
};

const Confetti: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame() - from;
  if (f < 0) return null;
  const cols = ["#E53935", "#FFC21A", "#2BF59A", "#35C9FF", "#ffffff"];
  return (
    <>
      {new Array(70).fill(0).map((_, i) => {
        const vx = Math.sin(i * 12.9898) * 14;
        const vy = -18 - (i % 7) * 3;
        const t = f / 30;
        const x = 960 + vx * f;
        const y = 560 + vy * f + 0.5 * 32 * f * f * 0.06;
        return (
          <div
            key={i}
            style={{ position: "absolute", left: x, top: y, width: 14, height: 22, background: cols[i % 5], transform: `rotate(${f * (8 + (i % 5) * 3)}deg)`, opacity: interpolate(t, [0, 2.5, 3.2], [1, 1, 0], clamp) }}
          />
        );
      })}
    </>
  );
};

/* ── 1 · Full charge in the morning… dead before evening ── */
export const O1: React.FC = () => {
  const f = useCurrentFrame();
  const DRAIN0 = at(2.2);
  const STOP = at(4.3);
  const W = 700;
  const BX = 560;
  const fc = face(BX, W);
  const lvl = interpolate(f, [DRAIN0, STOP - 6], [1, 0.03], { ...clamp, easing: Easing.in(Easing.quad) });
  const dusk = interpolate(f, [DRAIN0, STOP], [0, 1], clamp);
  const spd = f < STOP - 20 ? 3 : interpolate(f, [STOP - 20, STOP], [3, 0], clamp);
  // integrate road offset
  const off = f < STOP - 20 ? f * 14 : (STOP - 20) * 14 + interpolate(f, [STOP - 20, STOP], [0, 140], clamp);
  const expr: Expr = f < DRAIN0 + 20 ? "happy" : f < STOP - 10 ? "worried" : "confused";
  return (
    <Camera keys={[[0, 960, 540, 1], [STOP, 960, 540, 1], [STOP + 22, fc.x, fc.y - 10, 2.7], [STOP + 60, fc.x, fc.y - 14, 2.9]]}>
      <Street offset={off} time="day" noSun />
      <AbsoluteFill style={{ opacity: dusk }}>
        <Street offset={off} time="dusk" noSun />
      </AbsoluteFill>
      <SkyBody t={0.2 + dusk * 0.7} />
      <Bike x={BX} w={W} speed={spd} jerk={f > STOP - 20 && f < STOP ? Math.sin(f * 1.8) * 1.2 : 0} driver={{ expr, marks: f > STOP + 8 ? "?" : undefined, marksDelay: STOP + 8 }} />
      {f < STOP + 6 ? <BatteryBubble x={BX + 520} y={ROAD - 0.653 * W - 20} level={lvl} blink scale={1.1} /> : null}
    </Camera>
  );
};

/* ── 2 · Work stops, income stops ── */
export const O2: React.FC = () => {
  const f = useCurrentFrame();
  const K = at(2.75); // "কাজ বন্ধ"
  const A = at(3.8); // "আয় বন্ধ"
  const px = f < 30 ? interpolate(f, [0, 30], [-200, 400]) : f < 50 ? 400 : interpolate(f, [50, 110], [400, -320], clamp);
  const leaving = f >= 50;
  const stop = useSpring(K, 10);
  return (
    <Camera keys={[[0, 960, 560, 1.05], [A - 6, 960, 560, 1.05], [A + 18, 820, 480, 1.8]]}>
      <Street offset={900} time="dusk" noSun />
      <SkyBody t={0.9} />
      <Bike x={980} w={640} hazard />
      <Person x={px} y={ROAD - 168} pose={f < 30 || leaving ? "walk" : "stand"} facing={leaving ? -1 : 1} shirt="#8B5E3C" lungi="#44464d" gamchha={false} seed={7} arm={f >= 30 && f < 50 ? "wave" : "down"} />
      <Person x={820} y={ROAD - 168} expr={f < K ? "worried" : "sad"} arm={f < A ? "scratch" : "down"} facing={-1} />
      {/* "work stopped": big red stop sign over the dead bike */}
      <svg width={260} height={260} viewBox="-130 -130 260 260" style={{ position: "absolute", left: 1170, top: 330, transform: `scale(${stop})`, opacity: Math.min(1, stop * 2) }}>
        <circle r={110} fill="rgba(255,77,94,0.15)" stroke="#FF4D5E" strokeWidth={22} />
        <path d="M-78 -78 L78 78" stroke="#FF4D5E" strokeWidth={22} strokeLinecap="round" />
      </svg>
      {/* "income stopped": notes fly away from his pocket */}
      {new Array(7).fill(0).map((_, i) => {
        const t = (f - A - i * 5) / 60;
        if (t < 0 || t > 1) return null;
        return <Note key={i} x={820 + t * (480 + i * 60)} y={560 - t * 360 + Math.sin(t * 9 + i) * 40} rot={t * 360 * (i % 2 ? 1 : -1)} o={interpolate(t, [0, 0.1, 0.8, 1], [0, 1, 1, 0])} s={0.8} />;
      })}
    </Camera>
  );
};

/* ── 3 · Opening in Dirai ── */
export const O3: React.FC = () => {
  const f = useCurrentFrame();
  const lights = interpolate(f, [6, 20], [0.15, 1], clamp);
  const band = interpolate(f, [at(1.45), at(1.45) + 16], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Camera keys={[[0, 960, 600, 1.2], [200, 960, 560, 1.0]]}>
        <Station lights={lights} />
        <Bunting />
        <Charger x={360} y={560} />
        <Charger x={900} y={560} />
        <Charger x={1440} y={560} />
        <Ribbon />
      </Camera>
      <AbsoluteFill style={{ background: `linear-gradient(transparent 35%, rgba(5,14,26,${0.9 * band}) 65%)` }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 120 }}>
        {f >= at(1.45) ? (
          <Sequence from={at(1.45)} layout="none">
            <BrandLogo width={1050} delay={0} />
          </Sequence>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ── 4 · All night charging → full in the morning ── */
export const O4: React.FC = () => {
  const f = useCurrentFrame();
  const DAWN = at(5.0);
  const night = interpolate(f, [0, 10, DAWN - 15, DAWN + 15], [0.5, 1, 1, 0], clamp);
  const lvl = interpolate(f, [10, DAWN - 10], [0.1, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const go = DAWN + 40;
  const bx = f < go ? 160 : 160 + (f - go) ** 2 * 0.5;
  return (
    <Camera keys={[[0, 960, 540, 1], [DAWN, 960, 540, 1.05], [DAWN + 30, 960, 540, 1]]}>
      <Station />
      {/* row of bikes charging overnight */}
      {[0, 1].map((i) => (
        <React.Fragment key={i}>
          <Bike x={900 + i * 500} w={400} ground={880} />
          <Charger x={900 + i * 500 + 390} y={620} scale={0.8} />
          <BatteryBubble x={900 + i * 500 + 240} y={880 - 0.653 * 400 + 140} level={lvl} scale={0.85} />
        </React.Fragment>
      ))}
      <Charger x={740} y={600} scale={0.85} />
      <AbsoluteFill style={{ background: `rgba(6,12,32,${0.62 * night})` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, rgba(255,240,200,${0.18 * night}) 0%, transparent 55%)` }} />
      <div style={{ opacity: night }}>
        <SkyBody t={0.1 + interpolate(f, [0, DAWN], [0, 0.85], clamp)} moon low />
      </div>
      {/* dawn sun */}
      {f > DAWN - 20 ? <SkyBody t={interpolate(f, [DAWN - 20, DAWN + 120], [0.02, 0.22], clamp)} low /> : null}
      {/* hero's bike: charged overnight, he leaves happily in the morning */}
      <Bike x={bx} w={560} ground={ROAD} speed={f < go ? 0 : 4} driver={f > DAWN ? { expr: "happy", arm: f < go ? "thumb" : "handle" } : null} />
      <BatteryBubble x={bx + 330} y={ROAD - 0.653 * 560 - 10} level={lvl} scale={1.1} />
    </Camera>
  );
};

/* ── 5 · Income never stops halfway ── */
export const O5: React.FC = () => {
  const f = useCurrentFrame();
  const W = 760;
  const BX = 520;
  const fc = face(BX, W);
  const t = interpolate(f, [0, 220], [0.15, 0.85], clamp);
  return (
    <Camera keys={[[0, 960, 560, 1], [140, 960, 560, 1], [200, fc.x, fc.y, 1.9]]}>
      <Street offset={f * 13} time="day" noSun />
      <SkyBody t={t} />
      <Bike x={BX} w={W} speed={4} driver={{ expr: f > 140 ? "proud" : "happy" }} passengers="happy" />
      <BatteryBubble x={BX + 560} y={ROAD - 0.653 * W - 20} level={interpolate(f, [0, 220], [1, 0.8], clamp)} scale={1.1} />
      {new Array(6).fill(0).map((_, i) => {
        const tt = (f - 15 - i * 22) / 45;
        if (tt < 0 || tt > 1) return null;
        return (
          <div key={i} style={{ position: "absolute", left: BX + 180 + (i % 3) * 150, top: ROAD - 0.653 * W - 40 - tt * 200, opacity: interpolate(tt, [0, 0.15, 0.75, 1], [0, 1, 1, 0]) }}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.green, textShadow: "0 3px 0 #0a2318, 0 0 20px rgba(43,245,154,0.6)" }}>+৳</div>
          </div>
        );
      })}
    </Camera>
  );
};

/* ── 6 · Address ── */
export const O6: React.FC = () => {
  const f = useCurrentFrame();
  const drop = useSpring(8, 9);
  const rip = ((f - 25) % 50) / 50;
  return (
    <AbsoluteFill>
      <Bg tint="neutral" />
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 140px", gap: 90 }}>
        <div style={{ position: "relative", width: 700, height: 700, borderRadius: 40, overflow: "hidden", background: "#0d1e30", border: "2px solid rgba(255,255,255,0.12)", boxShadow: "0 40px 100px rgba(0,0,0,0.5)", transform: "rotate(-2deg)" }}>
          <svg width={700} height={700} style={{ position: "absolute" }}>
            <path d="M0 420 C200 400 400 460 700 380" stroke="#2c4a66" strokeWidth={44} fill="none" />
            <path d="M330 0 C320 250 360 450 340 700" stroke="#2c4a66" strokeWidth={36} fill="none" />
            <path d="M0 160 L700 240" stroke="#22394f" strokeWidth={20} fill="none" />
            <path d="M560 0 L520 700" stroke="#22394f" strokeWidth={18} fill="none" />
            {/* hospital */}
            <rect x={380} y={250} width={130} height={100} rx={12} fill="#e8edf2" />
            <rect x={436} y={268} width={18} height={64} fill="#E53935" />
            <rect x={413} y={291} width={64} height={18} fill="#E53935" />
            {/* station */}
            <rect x={160} y={250} width={120} height={100} rx={12} fill="#0C7A4A" />
            <path d="M228 268 L204 302 H220 L212 332 L240 294 H224 Z" fill="#FFC21A" />
          </svg>
          {f > 25 ? <div style={{ position: "absolute", left: 220 - 90 * rip * 2, top: 365 - 30 * rip * 2, width: 180 * rip * 2, height: 60 * rip * 2, borderRadius: "50%", border: `4px solid ${C.red}`, opacity: 1 - rip }} /> : null}
          <div style={{ position: "absolute", left: 150, top: 185 + (1 - drop) * -350, opacity: Math.min(1, drop * 2) }}>
            <Pin size={140} />
          </div>
        </div>
        <Card delay={at(0)} accent={C.red} style={{ flex: 1, padding: "50px 56px" }}>
          <Words text="সরকারি হাসপাতালের পাশে," size={56} weight={700} delay={at(0)} />
          <Words text="কুসুমবাগ, হাসপাতাল রোড," size={56} weight={600} delay={at(1.55)} style={{ marginTop: 12 }} />
          <Words text="দিরাই।" size={56} weight={600} delay={at(2.9)} color={C.muted} style={{ marginTop: 12 }} />
        </Card>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ── 7 · Invitation: everyone arrives, ribbon is cut ── */
const GUESTS: { x: number; shirt: string; lungi: string; gam?: boolean; expr: Expr; arm: Arm; seed: number; s: number; cap?: string }[] = [
  { x: 330, shirt: "#3E6FB0", lungi: "#2F6B4F", gam: true, expr: "happy", arm: "wave", seed: 1, s: 1 }, // driver
  { x: 560, shirt: "#EDEDE6", lungi: "#4a4f57", expr: "happy", arm: "down", seed: 2, s: 1.02 }, // owner
  { x: 1380, shirt: "#2d4f8a", lungi: "#30343b", expr: "happy", arm: "thumb", seed: 4, s: 1 }, // mechanic
  { x: 1600, shirt: "#F2F0E8", lungi: "#5a5a5a", expr: "proud", arm: "down", seed: 6, s: 0.98 }, // elder
];
export const O7: React.FC = () => {
  const f = useCurrentFrame();
  const CUT = at(5.4);
  const cut = interpolate(f, [CUT, CUT + 14], [0, 1], clamp);
  const sc = interpolate(f, [CUT - 30, CUT], [-160, 0], clamp);
  return (
    <Camera keys={[[0, 960, 560, 1.12], [CUT, 960, 560, 1.0], [CUT + 80, 960, 520, 1.05]]}>
      <Station />
      <Bunting />
      <Charger x={700} y={560} />
      <Charger x={1120} y={560} />
      <Ribbon cut={cut} />
      {GUESTS.map((g, i) => {
        const arrive = interpolate(f, [i * 18, i * 18 + 50], [g.x < 960 ? -300 : 2200, g.x], { ...clamp, easing: Easing.out(Easing.cubic) });
        const walking = f < i * 18 + 50;
        return (
          <Person key={i} x={arrive} y={ROAD - 168 * g.s} scale={g.s} pose={walking ? "walk" : "stand"} facing={g.x < 960 ? 1 : -1} shirt={g.shirt} lungi={g.lungi} gamchha={!!g.gam} cap={g.cap} expr={f > CUT ? "happy" : g.expr} arm={f > CUT ? "wave" : g.arm} seed={g.seed} />
        );
      })}
      {/* attendant with scissors at the ribbon */}
      <Person x={960} y={ROAD - 168 * 1.05} scale={1.05} expr="happy" arm={f > CUT ? "wave" : "plug"} shirt="#0C7A4A" lungi="#26313b" gamchha={false} cap="#0A5F3A" seed={9} />
      {f < CUT + 4 ? (
        <svg width={120} height={80} viewBox="0 0 120 80" style={{ position: "absolute", left: 1090 + sc * 0, top: 590, transform: `translateX(${sc}px)` }}>
          <circle cx={20} cy={20} r={14} fill="none" stroke="#FFC21A" strokeWidth={6} />
          <circle cx={20} cy={60} r={14} fill="none" stroke="#FFC21A" strokeWidth={6} />
          <path d="M32 26 L110 50 M32 54 L110 30" stroke="#c9ced4" strokeWidth={6} strokeLinecap="round" />
        </svg>
      ) : null}
      <Confetti from={CUT} />
    </Camera>
  );
};

/* ── 8 · End card ── */
export const O8: React.FC = () => {
  const f = useCurrentFrame();
  const phone = useSpring(at(6.4), 12);
  const glow = 0.5 + 0.5 * Math.sin(f / 10);
  return (
    <AbsoluteFill>
      <Bg tint="brand" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 18 }}>
        <BrandLogo width={1050} delay={4} />
        <Words text="ভালো চার্জ, দীর্ঘ পথ, নিরবচ্ছিন্ন আয়।" size={64} weight={700} align="center" delay={at(2.15)} hl={["চার্জ,", "পথ,", "আয়।"]} hlColor={C.yellow} style={{ marginTop: 40 }} />
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
    </AbsoluteFill>
  );
};
