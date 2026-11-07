# নিরাপদ অটো চার্জিং স্টেশন — Promo Video

A 1920×1080 (16:9), 30 fps, ~114 s animated promo built with [Remotion](https://remotion.dev).

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
