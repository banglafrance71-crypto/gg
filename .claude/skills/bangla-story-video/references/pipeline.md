# Production pipeline (Remotion)

## Contents
1. Project setup
2. Fonts
3. Voiceover (ElevenLabs) and timing
4. Logo prep
5. Building scenes
6. Stills QA
7. Render and deliver
8. Pitfalls already hit (don't repeat them)

---

## 1. Project setup

```bash
npx create-video@latest --yes --blank --no-tailwind my-video   # use a subfolder if the repo isn't empty
cd my-video && npm i
V=$(node -p "require('./package.json').dependencies.remotion")
npm i @remotion/transitions@$V @remotion/media@$V @remotion/fonts@$V
cp -r <skill>/assets/kit/src/* src/          # overwrite the blank scaffold's src (index/Root are replaced)
cp -r <skill>/assets/kit/public/* public/
```

Pin every `@remotion/*` package to the same version as `remotion`. Run `npx tsc --noEmit` after every batch of edits.

## 2. Fonts

Headless Chromium in cloud sessions **can't fetch Google Fonts** (render times out on `delayRender`). The kit's `theme.ts` loads Anek Bangla from `public/fonts/` with `@remotion/fonts`. It's a variable font, so weights 100–800 come from one file. To use another Bengali font, download the woff2 with curl into `public/fonts/` and register it the same way, with Bengali and Latin `unicodeRange`s.

## 3. Voiceover and timing

1. `creative_list_voices` with `languages: ["bn"]`; pick by tone (see style-guide §6). Say which voice you picked.
2. `creative_create_flow` once, then one `creative_generate_speech` **per scene** (model `eleven_v4`, same `voice_id`, same `flow_id`). Fire them in parallel. Leave `generations_count` at the default.
   - Keep the user's script words exactly. Add only tags like `[curious]`, `[serious]`, `[warmly]`, `[excited]` and `[pause]` between sentences.
   - Keep phone numbers in the user's digits (Bengali digits are fine on v4).
3. Poll `creative_get_flow_run_status` with the first session id of each scene; download take 1 of each to `public/vo_raw/sNN.mp3` with curl.
4. **Always tighten the clips**: `scripts/tighten_vo.sh public/vo_raw public/vo`. This trims lead/tail silence, shortens inner pauses and speeds up 7%. The user found the untightened pacing too slow.
5. Run `scripts/vo_timing.sh public/vo/*.mp3` on the tightened clips and paste the durations into `VO` in `Video.tsx`.
6. Inside scenes, place beats with `at(sec)`, which is `LEAD + sec*30` (the clip starts `LEAD` = 6 frames into its scene). Pick a cue just after the pause that ends the previous sentence.

Scene length is `LEAD (6) + ceil(VO*30) + 4 (breath) + T (12-frame transition) + PAD[i]`. `PAD` is 0 by default; give 10–20 frames only where the picture needs to land (a face zoom, a ribbon cut), and about 45 on the end card. **Target: under 0.8 s of silence between voice lines.** Check with `ffmpeg -i out.mp4 -af silencedetect=n=-40dB:d=0.6 -f null -`.

## 4. Logo prep

```bash
python3 <skill>/scripts/key_logo.py logo.png public/logo/full.png \
  --crop 150,280,620,840 public/logo/shield.png \
  --crop 680,270,1880,600 public/logo/bn.png \
  --crop 690,700,1880,790 public/logo/en.png
```

Find the crop boxes by looking at the logo (icon, main wordmark, small tagline). Then update the `P` part boxes in `brand.tsx` with each part's position, measured from the logo's top-left. Composite the keyed result on a coloured background and look at it before using it.

On signage inside a scene (shop fascia), put the logo at the **left end** of the sign so characters in close-ups don't cover it.

## 5. Building scenes

- Each scene is a component filling 1920×1080 world space, usually wrapped in `<Camera keys={…}>`.
- Ground lines: road `ROAD = 900` (wheels touch), shed floor about 880, station floor 900. A standing `Person` hip is `y = floor - 168*scale`.
- Easy-bike: wheels bottom = `top + 0.653*w`. A seated driver's face is at `x + 0.745w`, `top + 0.135w` (use `face()` from the example).
- Vignettes inside a scene: `<Sequence from={at(cue)}>` plus `<FadeIn dur={6}>`.
- Expression changes: compute `expr` from the frame relative to `at(cue)`.
- Keep the logo, address and phone on end cards large and on screen long enough (at least 3 seconds after the voice says them).
- Hooks such as `useSpring` must be called in the scene component (scene-frame time), not inside a nested `Sequence`, when the cue is given in scene time.

## 6. Stills QA (always before a full render)

```bash
cp <skill>/scripts/stills.mjs ./_stills.mjs     # so it resolves this project's node_modules
node _stills.mjs . Story /path/to/scratch/st 30 120 300 … ; rm _stills.mjs
bash <skill>/scripts/contact_sheet.sh /path/to/scratch/st
```

Pick 1–2 frames per scene, including the moment of each zoom and each badge. Check for:
- anything overlapping the logo or brand sign (badges, bubbles, sparkles, heads)
- characters or vehicles floating above, or sunk below, the ground line
- frames that are empty or too dark (often a fade just starting; check one frame later)
- text clipped at the frame edge on mobile-safe margins (keep 80px from the edges)

## 7. Render and deliver

```bash
npx remotion render <CompId> out/<name>.mp4 --codec h264 --crf 18 --audio-bitrate 192k --concurrency 4 --log error
```

Run it in the background; a 2–3 minute video takes several minutes. Verify with `ffprobe` (1920×1080, an audio stream present, the expected duration), grab 1–2 frames to confirm, then send the file to the user. In a git repo, keep `out/` ignored except the final video (`git add -f`), commit and push.

## 8. Pitfalls already hit

- **Gradient text with `background-clip: text` renders as a solid bar or blank** in the final video (though stills looked fine). Use solid colours or the logo image.
- **Google Fonts timeout** in headless render: bundle the fonts locally.
- **Overlays on the logo** (labels at the top of a station shot, a battery bubble over the sign, sparkles on the fascia, a head in a zoomed close-up): the user noticed straight away.
- **Too much text**: the first version used kinetic text for every sentence; the user rejected it in favour of visual storytelling with characters.
- **Watermarked stock reference images**: don't embed them; draw original vector art of the same vehicle or object type.
- **`concurrency` higher than the CPU count fails validation**; check `nproc`.
- A mixed `TransitionPresentation` array needs an `any[]` type annotation in TypeScript.
- **Two suns**: `Street` draws its own sun; pass `noSun` when you animate a custom sun or moon (time-lapse).
- **Sun or moon crossing the station sign**: in station scenes keep sky bodies on a compact arc above y=200 (the `low` arc in the opening example).
- Short voice clips leave no room for the picture to land; add per-scene `PAD` frames after the voice for zoom holds, ribbon cuts and confetti.
