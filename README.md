# নিরাপদ অটো চার্জিং স্টেশন — Promo Video

A 1920×1080 (16:9), 30 fps, ~2.5 min animated promo with Bengali voiceover, built with [Remotion](https://remotion.dev).

- Rendered video: `charging-video/out/nirapod-auto-charging-station.mp4`
- Source: `charging-video/src` (`scenes.tsx` holds the 13 scenes, `Video.tsx` the timeline/transitions)

## Edit / re-render

```bash
cd charging-video
npm i
npx remotion studio          # live preview & edit
npx remotion render NirapodAutoCharging out/nirapod-auto-charging-station.mp4 --crf 18
```

Font: Anek Bangla (SIL OFL), bundled in `public/fonts` so rendering works offline.

## Assets

- `public/logo/` — the station's logo, background removed and split (shield, Bengali wordmark, English line) so each part animates.
- `public/vo/sNN.mp3` — one ElevenLabs voiceover clip per scene (voice: Rayhan, model eleven_v4). Scene lengths are computed from these in `src/Video.tsx` (`VO` array); on-screen text cues use `at(seconds)` from `src/theme.ts`.
- `src/vehicles.tsx` — original vector art of an easy-bike (battery auto-rickshaw) and a hooded cycle rickshaw.
