import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "./theme";

/* Original flat-vector artwork of the two local vehicle types:
   - EasyBike: battery auto-rickshaw (open frame, motorbike-style front fork)
   - CycleRickshaw: hooded rickshaw (bicycle front, passenger seat with hood)
   Both face right. */

const Wheel: React.FC<{
  cx: number;
  cy: number;
  r: number;
  rot: number;
  spokes?: number;
  rim?: string;
  thin?: boolean;
}> = ({ cx, cy, r, rot, spokes = 5, rim = "#9aa3ad", thin }) => (
  <g transform={`translate(${cx} ${cy})`}>
    <circle r={r} fill="#16181c" />
    <circle r={r * 0.78} fill={thin ? "none" : rim} stroke={thin ? rim : "none"} strokeWidth={thin ? 6 : 0} />
    <g transform={`rotate(${rot})`}>
      {new Array(spokes).fill(0).map((_, i) => (
        <rect
          key={i}
          x={-(thin ? 1.5 : r * 0.07)}
          y={-r * 0.76}
          width={thin ? 3 : r * 0.14}
          height={r * 0.76}
          fill={thin ? rim : "#6d7680"}
          transform={`rotate(${(360 / spokes) * i})`}
        />
      ))}
    </g>
    <circle r={r * (thin ? 0.12 : 0.3)} fill="#e9edf1" />
    <circle r={r * 0.1} fill="#3a3f46" />
  </g>
);

export const EasyBike: React.FC<{
  width?: number;
  speed?: number;
  hazard?: boolean;
  body?: string;
}> = ({ width = 700, speed = 0, hazard, body = "#D42A2A" }) => {
  const f = useCurrentFrame();
  const rot = f * speed * 6;
  const bob = speed > 0 ? Math.sin(f / 3) * 2.5 : 0;
  const hz = hazard ? (Math.floor(f / 10) % 2 === 0 ? 1 : 0.2) : 0.85;
  const dark = "#7d1414";
  return (
    <svg width={width} height={width * 0.68} viewBox="0 0 1000 680">
      <ellipse cx={530} cy={650} rx={480} ry={18} fill="rgba(0,0,0,0.45)" />
      <g transform={`translate(0 ${bob})`}>
        {/* front canopy arc */}
        <path d="M690 40 Q880 60 945 330 L925 335 Q860 95 690 70 Z" fill="#8b9097" />
        <path d="M920 300 L960 330 L955 400 L930 395 Z" fill="none" stroke="#aeb4bb" strokeWidth={8} strokeLinejoin="round" />
        {/* roof */}
        <path d="M20 40 Q30 10 70 10 H700 Q790 14 800 50 L790 62 H20 Z" fill={body} />
        <rect x={20} y={52} width={780} height={14} fill="#2a2d33" />
        {/* rear frame & pillars */}
        <rect x={42} y={60} width={24} height={330} fill="#1d1f24" />
        <rect x={536} y={66} width={20} height={320} fill="#1d1f24" />
        <path d="M110 90 Q230 160 240 330" stroke="#1d1f24" strokeWidth={8} fill="none" />
        <path d="M120 140 Q200 200 205 330" stroke="#1d1f24" strokeWidth={6} fill="none" />
        {/* rear seat backrest */}
        <rect x={62} y={170} width={50} height={100} rx={14} fill={body} />
        {/* passenger seat */}
        <path d="M420 300 Q420 285 440 285 H670 Q690 285 690 305 V385 H420 Z" fill="#1d1f24" />
        <rect x={432} y={298} width={246} height={74} rx={10} fill="#6e737b" />
        <rect x={432} y={340} width={246} height={32} fill="#4a4e55" />
        {/* rear body */}
        <path d="M30 375 H430 V505 H300 Q290 430 175 430 Q70 430 55 505 H30 Z" fill={body} />
        <path d="M60 505 Q75 445 175 445 Q280 445 292 505" fill="none" stroke="#9aa3ad" strokeWidth={16} />
        {/* side rail */}
        <path d="M230 380 H425 V490 H285" fill="none" stroke="#1d1f24" strokeWidth={8} />
        <path d="M245 420 H425 M260 455 H425" stroke="#1d1f24" strokeWidth={5} />
        {/* middle step box */}
        <rect x={430} y={385} width={120} height={120} fill={body} />
        <rect x={445} y={400} width={90} height={90} fill={dark} />
        <rect x={548} y={385} width={112} height={140} fill={body} />
        <rect x={560} y={415} width={90} height={12} fill={dark} />
        <rect x={560} y={450} width={90} height={12} fill={dark} />
        {/* floor to front */}
        <path d="M430 505 H660 L820 545 L815 560 L640 545 H430 Z" fill="#1d1f24" />
        <path d="M300 520 L560 545" stroke="#9aa3ad" strokeWidth={5} />
        {/* driver seat & front column */}
        <path d="M740 310 L775 300 L790 330 L760 515 L735 515 Z" fill="#3a1010" />
        <path d="M765 312 L795 305 L812 335 L790 400 L770 380 Z" fill="#a01d1d" />
        <path d="M790 300 L905 590" stroke="#2a2d33" strokeWidth={16} strokeLinecap="round" />
        <path d="M805 300 L920 590" stroke="#8b9097" strokeWidth={6} strokeLinecap="round" />
        <path d="M790 285 L840 270 L875 300 L850 330 Z" fill="#1d1f24" />
        <path d="M735 268 Q770 250 815 262" stroke="#1d1f24" strokeWidth={10} strokeLinecap="round" fill="none" />
        <path d="M865 380 H955" stroke="#aeb4bb" strokeWidth={6} />
        {/* headlight */}
        <circle cx={872} cy={300} r={12} fill={C.yellow} style={{ filter: `drop-shadow(0 0 14px ${C.yellow})` }} />
        {/* front mudguard */}
        <path d="M835 525 Q905 470 975 520" fill="none" stroke="#8b9097" strokeWidth={18} strokeLinecap="round" />
        {/* tail lights */}
        {[400, 440, 480].map((y) => (
          <circle key={y} cx={28} cy={y} r={9} fill="#ff3b3b" opacity={hz} style={{ filter: hazard ? "drop-shadow(0 0 10px #ff7a2a)" : undefined }} />
        ))}
        <rect x={45} y={510} width={22} height={70} fill="#9aa3ad" />
        <Wheel cx={175} cy={565} r={88} rot={rot} />
        <Wheel cx={905} cy={565} r={72} rot={rot * 1.2} />
      </g>
    </svg>
  );
};

export const CycleRickshaw: React.FC<{ width?: number; speed?: number }> = ({
  width = 600,
  speed = 0,
}) => {
  const f = useCurrentFrame();
  const rot = f * speed * 5;
  const bob = speed > 0 ? Math.sin(f / 3.5) * 2 : 0;
  const frame = "#E0482B";
  return (
    <svg width={width} height={width * 0.75} viewBox="0 0 1000 750">
      <ellipse cx={520} cy={722} rx={440} ry={16} fill="rgba(0,0,0,0.45)" />
      <g transform={`translate(0 ${bob})`}>
        {/* hood */}
        <path d="M110 440 Q90 90 470 80 L500 120 Q170 140 175 440 Z" fill="#B8231F" />
        <path d="M175 440 Q170 140 500 120 L470 150 Q215 175 230 440 Z" fill="#E6A93A" />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const t = i / 5;
          const x = 180 + t * 280;
          return <path key={i} d={`M${200 + t * 40} 430 Q${x - 40} ${260 - t * 60} ${x + 20} ${150 - t * 10}`} stroke="#B07A1E" strokeWidth={5} fill="none" opacity={0.7} />;
        })}
        <path d="M470 80 Q520 82 520 100 L500 125 Z" fill="#F2C14E" />
        {/* hood stays */}
        <path d="M460 120 L440 395" stroke={frame} strokeWidth={8} />
        <path d="M330 140 L330 395" stroke={frame} strokeWidth={6} />
        {/* seat */}
        <path d="M190 330 Q190 300 220 300 H360 Q380 300 380 330 V400 H190 Z" fill="#2E8C7A" />
        <path d="M150 400 Q150 375 175 375 H440 Q460 375 460 400 V420 H150 Z" fill="#F07A3A" />
        {[0, 1, 2].map((i) => <rect key={i} x={230 + i * 50} y={305} width={12} height={92} fill="#F6B54A" opacity={0.8} />)}
        {/* seat box with battery */}
        <rect x={150} y={420} width={300} height={130} rx={8} fill="#1F7A6A" />
        <rect x={180} y={450} width={120} height={70} rx={8} fill="#11443b" />
        <path d="M245 458 L225 488 H240 L232 512 L258 480 H243 Z" fill={C.yellow} />
        <rect x={120} y={420} width={40} height={130} fill="#9a2a1c" />
        {/* rear mudguard */}
        <path d="M100 600 Q120 470 260 465 Q370 470 400 560" fill="none" stroke="#E7A6A0" strokeWidth={18} strokeLinecap="round" />
        {/* chassis + bicycle frame */}
        <path d="M440 540 L600 600" stroke="#2a2d33" strokeWidth={12} />
        <path d="M450 500 L600 600 L760 360 L590 390 Z" fill="none" stroke={frame} strokeWidth={14} strokeLinejoin="round" />
        <path d="M590 390 L600 600" stroke={frame} strokeWidth={12} />
        <circle cx={600} cy={600} r={26} fill="#5b2a1c" />
        {/* saddle + handlebar + fork */}
        <path d="M555 360 Q590 340 630 360 L620 378 H565 Z" fill="#E6A93A" />
        <path d="M590 378 L590 395" stroke="#2a2d33" strokeWidth={8} />
        <path d="M760 360 L820 610" stroke={frame} strokeWidth={14} strokeLinecap="round" />
        <path d="M760 360 L748 320" stroke="#9aa3ad" strokeWidth={10} />
        <path d="M700 330 Q745 305 800 318" stroke="#9aa3ad" strokeWidth={9} strokeLinecap="round" fill="none" />
        <rect x={792} y={306} width={34} height={18} rx={8} fill="#D9E14A" />
        <rect x={684} y={322} width={30} height={16} rx={8} fill="#F07A3A" />
        {/* front mudguard */}
        <path d="M720 590 Q760 490 870 505" fill="none" stroke="#E7A6A0" strokeWidth={16} strokeLinecap="round" />
        <Wheel cx={250} cy={600} r={115} rot={rot} spokes={18} rim="#c98a7a" thin />
        <Wheel cx={820} cy={620} r={100} rot={rot * 1.15} spokes={18} rim="#c98a7a" thin />
      </g>
    </svg>
  );
};
