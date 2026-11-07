# Style guide

Two looks share one grammar: **one clear idea per shot, told with a body, a face or an object, held long enough to feel.**

## Contents
1. Shared principles
2. Look A: Promo cartoon (Nirapod style)
3. Look B: Cinematic silhouette (ফর্দ style)
4. Text rules
5. Camera and transitions
6. Sound

---

## 1. Shared principles

- **Picture first.** Before writing any scene, answer: *if the sound is off and the viewer can't read, what do they understand?* If the answer is "nothing", redesign the shot.
- **One idea per shot.** A shot shows a single action or feeling: battery dies; passenger walks away; plug clicks in. Cut or move the camera to change idea.
- **Emotion lives in faces and posture.** Cartoon: change the expression on the beat and push in. Silhouette: posture (head down, shoulders hunched), scale (a tiny figure against a huge crowd) and light (a lonely spotlight).
- **Contrast pain and relief with colour.** Pain is dark, desaturated, warm-dirty or cold-blue, with flicker. Relief is clean, bright, green and gold, with steady light.
- **Recurring motifs bookend the story**: the same place, prop or shot at the start and the end (the grave fence with its sapling; the driver at the station).
- **Local, specific, respectful.** Everyday Bangladeshi detail, never caricature.

## 2. Look A: Promo cartoon

Use for businesses, services, products and public-service messages with a call to action.

**Palette**
- Brand scenes: deep green `#0A2318` / `#0C7A4A`, electric green `#2BF59A`, gold `#FFC21A` (match the client's logo colours first).
- Problem scenes: brick brown `#3a2a1f`, tin grey, dim yellow bulb, alarm red `#FF4D5E`, orange `#FF8A3D`.
- Day street: sky `#7EC8F2` to `#FFE7A8`, buildings in muted blue-violet, green trees.

**Characters** (`people.tsx`)
- The hero is the customer (driver, worker, shopper). Give him an ordinary local look: checked lungi, button shirt, gamchha, moustache.
- A staff or brand character wears the brand colour, a cap, and no gamchha, so viewers instantly read "the company".
- Expressions change *on the voice cue*: happy → worried → confused (with "??"), sad → hopeful → proud, with a thumbs-up at the end.
- Blinking and breathing are built in. Keep characters grounded: feet on the floor line, wheels on the road line.

**Worlds** (`world.tsx`): parallax street (day/dusk/night), problem location (`Shed`: flickering bulb, messy wires), solution location (`Station`: clean, lit sign with the logo at the left end, neat bays).

**Info graphics as objects, not text**: battery bubbles over vehicles, a spinning clock, a gauge needle, an hourglass with a shrinking money stack, "+৳" popping up, sparks, smoke, shield-check.

## 3. Look B: Cinematic silhouette

Use for emotional, social or personal stories with a documentary or literary tone.

**Figures**: faceless, near-black flat silhouettes (`Figure`). Identity comes from props: tupi cap (elder or religious), cane (old age), shawl (mother), a chest label or ID card ("নাম: বড় ছেলে / সন্তান"), a tag on the back ("ঋণ" = debt as a burden).

**One mood colour per scene** (`MOOD` in `cinema.tsx`):
- grief: cold blue night, haze, sapling on a grave
- village: dusty beige day, tin houses, bamboo fence, betel-nut trees
- warm: lamp-lit brown interiors, tea steam
- shame: blood-red full frame for the emotional climax, with a giant stamp word ("ছিঃ")
- festive: striped pandal awning, rows of seated guests
- void: black, for title cards and counts

**Light**: pools of light (`Spot`), radial lamps, vignettes, drifting fog (`Haze`). Darkness is a storytelling tool.

**Shot vocabulary seen in the reference**
- Wide establishing shot of a place (village gate, house, rooftop at night)
- Top-down circle of people around a plate, for discussion or judgement
- Close-up of hands holding paper; a notebook page with two columns ("ওদের হিসাব" vs "আমার হিসাব")
- Symbolic close-up: a bowl with a bone, a framed portrait with a black ribbon, a clock
- Scale contrast: a tiny man under a spotlight against a towering crowd ("পুরো সমাজ")
- Counts as dot grids ("৩০০ জন"), fractions as big numerals ("১½")
- Split screen: "যা হওয়ার কথা" vs "যা হইল"
- Identity transformation: an ID card where "সন্তান" is struck through, then stamped "ক্যাটারিং ম্যানেজার"
- Ending: a lonely figure on a rooftop under stars, the burden tag growing, then a black title card with the creator credit

**Credit**: a small, quiet creator or brand name bottom-right on every shot (`Credit`).

## 4. Text rules

| Allowed | Avoid |
|---|---|
| Logo, phone, address, prices, dates, counts | Sentence-long kinetic text that repeats the voiceover |
| 1–3 word labels on badges ("সঠিক সংযোগ") | Text blocks over characters' faces or the logo |
| Cinematic narration lines: short, white, **one keyword** in accent colour (gold for hope, red for pain) | Multiple highlight colours in one line |
| Quoted dialogue in "…" when a character speaks | Gradient-clipped Bengali text (renders blank) |
| A single giant emotional stamp word | Text that appears before the voice says it |

In promo cartoons for low-literacy audiences, use the minimum: brand, a few labels, address, phone. In cinematic stories, narration typography is part of the art: short fragments placed top-left or centred, fading in softly with no bounce, held for at least 2 seconds.

## 5. Camera and transitions

- `Camera` keyframes `[frame, worldX, worldY, zoom]` with cubic easing. Typical moves:
  - slow push-in across a whole scene (1.0 → 1.15)
  - **snap push into a face** at the emotional beat (1.0 → 2.6–2.9 over about 20 frames)
  - pan from a sad face toward the light (hope)
  - a slight shake for danger (sparks)
- Parallax for travel: background layers at 0.25 / 0.55 / 0.9 / 1.0 of the road speed.
- **Pacing is brisk.** The voice runs almost continuously, with under 0.8 s between lines and no dead air between scenes. Motion inside a shot keeps things alive; don't hold empty frames waiting for the next line.
- Between scenes, use fades (12 frames) by default; slides only for energetic promo moments. Inside a scene, change the vignette with a quick 6–8 frame fade.
- Cinematic look: calmer moves and longer shots, but still no silent gaps between narration lines; fade through black only between chapters.

## 6. Sound

- Bengali narrator voice from ElevenLabs. For promos, an energetic young male works well (Rayhan, `vvOYlSJHf8lTWIG4tDNP`). For stories, choose a calmer, older or warmer voice through `creative_list_voices` (languages `["bn"]`).
- Tags: `[curious]` for a hook question, `[serious]` for problems, `[warmly]` / `[confident]` for the solution, `[excited]` for the brand name, `[pause]` between sentences.
- The reference story runs a continuous, quiet music and ambience bed under the narration with no silence. Add a music bed at about 10–15% volume when the user supplies one or asks for it. Don't make one up silently; offer it.
