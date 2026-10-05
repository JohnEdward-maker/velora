---
description: "Sticky pin, beat holds, and copy windows for John-WebsiteScrollAnima-Ver1."
connections: [motion-field, wall-annotations, imagery]
---

# Scroll contract

The story is one sticky stage. Scroll only changes a number. The stage does not translate.

## Track

| Piece | Rule |
|---|---|
| Track | `position: relative`, height `1280vh` for 7 beats. Add `160vh` per extra beat. Background `#070707`. |
| Pin | `position: sticky; top: 0; height: 100dvh; overflow: hidden`. |
| Progress | `p = clamp(-track.top / (trackHeight - innerHeight), 0, 1)`. |
| Smoothing | rAF. `shown += (target - shown) * 0.18`. Snap when the gap is under `0.001`. Never write styles inside the scroll listener. |
| Drive | Set `--p` on the pin every frame. Crossfades, copy, counts, and the [[motion-field]] all read `p` or `--p`. |

## Beat holds

A linear map from `p` to a clip is a fail. Each beat has a plateau, then a short ramp into the next.

Default 7-beat holds, as `[fade-in done, fade-out start]`:

| Beat | Hold |
|---|---|
| 0 assembled | 0.00–0.12 |
| 1 mouth | 0.18–0.26 |
| 2 detail | 0.32–0.40 |
| 3 exploded | 0.48–0.60 |
| 4 deeper | 0.66–0.74 |
| 5 side | 0.80–0.88 |
| 6 close / buy | 0.94–1.00 |

Opacity of beat `i`: fade in across `[previous hold end → this hold start]`, hold, fade out across `[this hold end → next hold start]`. Use smoothstep `t*t*(3-2*t)`. Beat 0 starts at 1. Last beat stays at 1.

Copy windows are a little wider than the holds so type is readable through the fade:

| Copy | Window |
|---|---|
| 0 | 0.00–0.16 |
| 1 | 0.16–0.30 |
| 2 | 0.30–0.44 |
| 3 | 0.46–0.62 |
| 4 | 0.64–0.76 |
| 5 | 0.78–0.90 |
| 6 | 0.92–1.05 |

Opacity: fade in over the first `0.03` of the window, fade out over the last `0.04`. One window visible at a time.

Parallax on a copy node: `local = (p - start) / (end - start)`, `shift = (local - 0.5) * depth * 18` px. Left copy uses a negative depth, right copy a positive depth, so they drift apart. Set `pointer-events: none` when opacity is `0.5` or below.

## Chapter grammar

| Slot | Left | Right |
|---|---|---|
| Open | Kicker, one headline, one sentence, price, buy | Price echo only if the left column is already full |
| Detail | Kicker, headline, one sentence | One sentence. No second headline. |
| Exploded | Kicker, headline, one sentence. No part list. | No paragraph. [[wall-annotations]] own this side. |
| Proof | Short list of three steps that light in sequence | Three counting figures, centered, bottom |
| Buy | Measure choices, one price button | One shipping line |

Kicker format: `02 — The wall`. Headline is one clause. Deck is one sentence, under 18 words.

## Reduced motion

`prefers-reduced-motion: reduce`: track height `auto`, pin `position: relative`, a visible button toggles the exploded hold (`p = 0.4`) and the assembled hold (`p = 0`). No rAF chase. No infinite CSS animation.

## Video, only if a real film exists

Do not invent a film from CSS crops. If a generated clip exists and the user asked for a film:

- Strip audio. Poster is frame 0.
- Map `p` through the holds, not `currentTime = p * duration`.
- Open on the way to the exploded hold, close on the way back: `play = open * (1 - shut)`.
- Seek only when the time gap is above `0.03`. Prefer `fastSeek`.
- Keep the still crossfade as the fallback when the file is missing.
