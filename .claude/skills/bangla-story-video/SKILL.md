---
name: bangla-story-video
description: House style and full pipeline for the user's animated storytelling videos — Bengali-language promos, ads and short documentary-style stories told with flat-vector characters, expressive faces or faceless silhouettes, camera moves, symbolic props and an ElevenLabs Bengali voiceover, built and rendered with Remotion at 1920×1080. Use this skill whenever the user asks for a video, ad, promo, reel, explainer or "story" for a local business, product, service, cause or personal story (especially in Bengali / for Bangladesh), sends a script or voiceover text to animate, asks to "make it like the last one", or shares a reference video to match — even if they don't name the skill or say "animation".
---

# Bangla story video

The user makes animated story videos in Bengali. Two of them define the style:

- **Nirapod Auto Charging Station promo**: bright flat-cartoon characters with expressive faces, local vehicles, a problem → hope → solution arc and a call to action.
- **"ফর্দ" reference story**: cinematic, faceless silhouettes, one mood colour per scene, symbolic props and quiet narration typography.

Both share the core belief this skill exists to protect: **the story is told by pictures, not by text.** The audience often includes people who read little or not at all (drivers, villagers, workers). A viewer with the sound off and no reading ability should still understand who is suffering, why, and what changes. Text is seasoning: brand, numbers, address, phone, and a few keywords.

The user explicitly said they don't want to explain their style every time. So make the decisions yourself following this guide, show the result, and iterate on feedback. Ask only what you truly can't infer (for example the phone number or the logo file).

## Workflow

1. **Read the brief and pick the look** (see `references/style-guide.md`):
   - *Promo cartoon*: businesses, services, products, ads, anything with a call to action. Bright, hopeful, characters with faces.
   - *Cinematic silhouette*: personal, social or emotional stories, documentary tone, grief, injustice.
   - Mixing is fine: a promo can open in silhouette darkness for the pain, then burst into colour for the solution.
2. **Break the script into beats.** For every sentence of voiceover, write one line saying what the viewer *sees*. Use `references/story-structure.md` for the arcs and the visual metaphors that worked. If a beat only works as text, find the image: a dying battery bubble, money flying away, a clock spinning, a crowd of dots, an ID card struck through.
3. **Voiceover first, then timing.** Generate one ElevenLabs clip per scene (Bengali voice, `eleven_v4`, light emotion tags) and measure its pauses. Scene length comes from the clip and beats sit on pause cues. See `references/pipeline.md`.
4. **Build in Remotion with the kit.** Copy `assets/kit/` into the new project. It has the camera, characters, worlds, cinematic components and the timeline template. The Nirapod scenes in `examples/` show the patterns in use.
5. **Check stills before any full render.** Render 15–25 stills across the timeline with `scripts/stills.mjs` and tile them with `scripts/contact_sheet.sh`. Look for overlaps (text or bubbles over the logo, heads covering signs), dark or empty frames, and things floating above the ground. Fix them, then render.
6. **Deliver**: send the MP4 with a short scene-by-scene summary, then offer specific next tweaks. Commit and push if working in a repo.

## Non-negotiables (learned from the user's corrections)

- **Visual storytelling over kinetic text.** Never fill a scene with sentence-long animated text. Pain points get a character in trouble, a camera push into the face, and an expression change.
- **Zoom into the face at the emotional moment** (shock, confusion, sadness, relief). This is the user's favourite device.
- **Never cover the client's logo.** Badges, bubbles, labels, sparkles and heads must clear the brand mark, both in the wide shot and in zoomed shots. Check this in the stills.
- **Use the client's real logo**, background removed with `scripts/key_logo.py` and split into parts (icon, wordmark, tagline) so it can animate. Don't redraw or restyle it.
- **Original artwork only.** If the user sends stock images with a watermark (VectorStock, Freepik and so on), draw your own vector version of the *type* of thing shown. Say why in one line.
- **Local authenticity**: lungi with check pattern, gamchha scarf, moustache, tupi cap, tin-roof sheds, tangled street wires, easy-bikes and rickshaws, Bengali digits (০১২…), ৳ for money.
- **Format**: 1920×1080, 16:9, 30 fps, H.264 CRF 18, AAC 192k, unless asked otherwise.
- **Bengali text** is always set in a properly shaping Bengali font bundled locally (Anek Bangla is in the kit). Never use `background-clip:text` gradients on Bengali: they render blank in the final video.

## Reference files

- `references/style-guide.md`: the two looks in detail (palettes, characters, light, typography, camera, transitions, sound).
- `references/story-structure.md`: arcs for promos and stories, a beat-sheet template, and a library of visual metaphors.
- `references/pipeline.md`: Remotion setup, fonts, ElevenLabs voiceover and timing, logo prep, stills QA, rendering, and known pitfalls.
- `examples/nirapod-story-scenes.tsx` and `examples/nirapod-timeline.tsx`: a complete, approved promo built with the kit (13 scenes, voice-synced).

## Kit contents (`assets/kit/`)

| File | What it gives you |
|---|---|
| `src/theme.ts` | Local font loading, palette `C`, Bengali digits `bn()`, `LEAD` and `at(sec)` voice-cue helper |
| `src/components.tsx` | `Words` (keyword reveal), `Pill`, `Card`, `Bg`, `useSpring` |
| `src/people.tsx` | `Person` / `PersonG`: cartoon man with 10 expressions (happy, sad, worried, confused, shocked, tired, sleep, hopeful, proud, neutral), poses (stand, sit, walk), arm poses (handle, wave, thumb, tea, scratch, cross, watch, plug), floating `Marks` (? ! z) |
| `src/world.tsx` | `Camera` (keyframed pan/zoom), `Street` (parallax day/dusk/night), `Shed`, `Station`, `Charger`, `BatteryBubble`, `Note` (৳), `Smoke`, `Sparks`, `FadeIn` |
| `src/vehicles.tsx` | `EasyBike` (with driver/passenger slots) and `CycleRickshaw` |
| `src/cinema.tsx` | Silhouette look: `Backdrop` moods, `Figure`, `Haze`, `Spot`, `IdCard` (strike/stamp), `Narration`, `Stamp`, `DotCrowd`, `Portrait`, `PaperNote`, `Credit`, `TitleCard` |
| `src/brand.tsx` | `BrandLogo`: animates a split logo (expects `public/logo/shield.png`, `bn.png`, `en.png`; adjust the part boxes for a new logo) |
| `src/Video.tsx`, `Root.tsx`, `index.ts` | Voice-driven timeline template |
| `public/fonts/` | Anek Bangla (OFL), Bengali and Latin subsets |
