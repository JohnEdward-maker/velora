---
description: "Motion graphics that sit behind the product during the scroll. Read with the scroll contract."
connections: [scroll-contract, imagery, wall-annotations]
---

# Motion field

The pin feels empty when the only moving thing is the product. The field is always on, behind the stills (`z-index: 0`), `pointer-events: none`, `overflow: hidden`. It reads `--p` from the [[scroll-contract]]. Infinite loops are seasoning. Scroll position does the real move.

## Required layers

| Layer | Behavior |
|---|---|
| Ghost word A | Outline type, ~23vw, `color: transparent`, 1px stroke at 16% cream. `translateX((0.5 - p) * 18vw)`. |
| Ghost word B | Second word, ~12vw, opposite drift `(p - 0.5) * 24vw`. |
| Ripples | Three ellipses centered on the product. Scale `0.7 + p * 0.62`. One ring is copper `rgba(184, 132, 74, 0.45)`. Opacity breathes 8s. |
| Orbit | Dashed circle, `rotate(p * 260deg)`. |
| Top marquee | 0.68rem, tracking `0.32em`, uppercase, 36s linear. Product words, duplicated so the loop is seamless. |
| Bottom marquee | Same, reverse, 42s, facts (hours, weight), not the same words as the top. |
| Spine | Vertical small type on the left, `translateY((p - 0.5) * 16vh)`. |
| Rail | 1px line on the right, child `scaleY(p)` from the top. |
| Index | `01`–`07` from `floor(p * beats)`, beside the rail. |
| Motes | Four 5px dots. Two copper, two cream. Ease up and down 9s. Hide if they cross a headline. |

Ghost words go behind the product. After [[imagery]] knockout they show through the old black plate. Do not put a filled word on top of the product.

## Stage tokens

| Token | Value |
|---|---|
| Stage | `#070707` |
| Type | `#f4f1ea` |
| Copper | `#c4a574` |
| Muted type | `rgba(244, 241, 234, 0.5)` |
| Buy on the pin | Background `#f4f1ea`, text `#141311` |
| Ghost outline | `#f4f1ea` at 16%, fill transparent |

Do not switch the story stage to white or paper. A product shot made for black looks like a sticker on white.

## Buttons

Pointer-follow only. A soft radial under the cursor, plus three or four low-opacity bubbles that lag the pointer at different rates. Click is a short compress, not a splash. Cream buttons use the same treatment at lower brightness. No cartoon ripples, no drop shadows, no bounce.

## Mobile, under 800px

Hide the right-hand copy, the spine, the rail, the index, the bottom marquee, and part callouts. Keep the top marquee, one ripple, and the left column. Headline drops to `2.2rem`.

## Reduced motion

Stop marquee, ripple, mote, dash, and ping. The `--p` drift may remain, because it is tied to scroll position the user controls.
