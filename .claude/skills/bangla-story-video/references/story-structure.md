# Story structure

## Promo arc (problem → solution), as in Nirapod

| Part | Share | What the viewer sees |
|---|---|---|
| 1. Hook: the pain happens | ~10% | Hero doing his everyday thing, then failure (battery dies, shop empty, crop fails). **Push into his face**: confused, "??" |
| 2. Cost of the pain | ~5% | What it costs him: passenger walks away, ৳ notes fly from his pocket |
| 3. Why it happens | ~15% | Quick vignettes of each cause, one object each: flickering bulb with low gauge, spinning clock with sleeping hero, leaving half-charged |
| 4. Danger / stakes | ~10% | Sparks, smoke, a shocked face, a swelling battery |
| 5. Turn: hope | ~4% | Darkness, a light appears, the face lifts (sad → hopeful), the camera pans to the light |
| 6. Brand reveal | ~7% | The location lights up, the logo animates in, a one-line tagline |
| 7. Proof: features as actions | ~25% | Each claim becomes a visible action: steady power = energy flowing and the battery filling; less waiting = tea break while it charges fast; safety = plug clicks and a shield appears |
| 8. Outcome | ~12% | Hero back on the road with passengers, "+৳" popping, staff waving |
| 9. Where + CTA | ~12% | Map with a pin drop and the address card; the hero proud with a thumbs-up; end card with logo, tagline and phone |

## Story arc (documentary / emotional), as in ফর্দ

1. **Cold open**: a quiet establishing image tied to the theme (grave fence, empty road) with a first narration line.
2. **Inciting event**: a death, a loss or a demand (an elder's hand on the shoulder).
3. **Pressure builds**: society, rules, lists ("ফর্দ"), debt. Use top-down councils, notebooks and portraits.
4. **Climax**: a red full-frame shame or anger moment with a stamp word; the identity card struck through.
5. **Consequence**: the long cost, shown as a shrinking figure, a debt tag and an empty plate.
6. **Reflection**: a lone figure at night, the burden visible, a final statement.
7. **Title card**: title on black, creator credit.

## Beat sheet template

Write this before coding. One row per voiceover sentence:

```
Scene | VO line (Bengali)                         | cue (s) | VISUAL (what we see)                                   | camera        | text on screen
1a    | চার্জ শেষ হয়ে রাস্তায় আটকে গেছেন কখনো?     | 0.0     | driver drives happily → battery bubble red → stops     | wide → face   | none
1b    | অথবা ঘণ্টার পর ঘণ্টা চার্জ দিয়েও…           | 3.2     | old shed, clock spinning, battery stuck 58%, sad face   | slow push     | none
```

Cue seconds come from `scripts/vo_timing.sh` (pause midpoints). Each row becomes a `Sequence` or an expression switch at `at(cue)`.

## Visual metaphor library

| Idea | Image |
|---|---|
| Battery low / power problem | Battery bubble over the vehicle, red blink; sputter smoke; bike jerks and stops |
| Wasted time | Clock hands spinning fast; hourglass; hero asleep with floating "z" |
| Low voltage | Dim flickering bulb plus gauge needle near zero |
| Danger / unsafe | Tangled wires, sparks at the socket, warning triangle, shocked face with "!" |
| Damage / stress | Battery swelling, turning red, smoking |
| Money lost | ৳ notes flying out of the pocket; money stack shrinking |
| Money earned | "+৳" popping up above a moving vehicle; rising bars |
| Customers lost | Passenger walks up, waits, walks away |
| Hope | Night, a green or gold glow from the side, rays, the face lifts |
| Reliability / steady | Stable wave on a charger screen; energy dashes along a cable |
| Safety | Plug clicks in, a ring pulse, a shield with a check mark |
| Order / organisation | Identical bays in a row, neat cables, floor markings |
| Trust / service | A staff character in brand colours with a thumbs-up or wave |
| Social pressure | Top-down circle of capped elders around a plate; a towering crowd versus a tiny figure |
| Loss of identity | ID card with the role struck through and re-stamped |
| Burden / debt | A red tag on the back that grows bigger |
| Large count | Dot grid that fills in |
| Deceased / absence | Framed portrait with a black corner ribbon |
| Expectation vs reality | Split screen with two labels |
