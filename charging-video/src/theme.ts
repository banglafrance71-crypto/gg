import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Anek Bangla (variable font, OFL) bundled locally so renders work offline
export const FONT = "Anek Bangla";
loadFont({
  family: FONT,
  url: staticFile("fonts/anek-bengali.woff2"),
  weight: "100 800",
  unicodeRange:
    "U+0951-0952, U+0964-0965, U+0980-09FE, U+1CD0, U+1CD2, U+1CD5-1CD6, U+1CD8, U+1CE1, U+1CEA, U+1CED, U+1CF2, U+1CF5-1CF7, U+200C-200D, U+20B9, U+25CC, U+A8F1",
});
loadFont({
  family: FONT,
  url: staticFile("fonts/anek-latin.woff2"),
  weight: "100 800",
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
});

export const C = {
  bg: "#050E1A",
  bg2: "#0A1B2E",
  green: "#2BF59A",
  greenDeep: "#0FB872",
  cyan: "#35C9FF",
  yellow: "#FFD23F",
  orange: "#FF8A3D",
  red: "#FF4D5E",
  text: "#F3F8FC",
  muted: "#9DB2C8",
  card: "rgba(255,255,255,0.06)",
  cardBorder: "rgba(255,255,255,0.12)",
};

export const FPS = 30;

const BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
export const bn = (n: number | string) =>
  String(n).replace(/[0-9]/g, (d) => BN[Number(d)]);

/* Voiceover timing: each scene's clip starts LEAD frames in. `at(sec)` turns a
   time inside that clip into a scene-local frame. */
export const LEAD = 12;
export const at = (sec: number) => Math.round(LEAD + sec * FPS);
