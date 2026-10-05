---
name: john-websitescrollanima-ver1
description: "Build or revise a premium product-scroll site in the John-WebsiteScrollAnima-Ver1 style: sticky chapter pin, beat holds, knocked-out stills, motion field, and part callouts. Use when the user names this skill, asks for a cinematic product scroll, exploded wall labels, or scroll-synced motion graphics. Not for dashboards, games, or hero-only pages."
type: workflow
lifecycle: active
user-invocable: true
when-to-use: "John-WebsiteScrollAnima-Ver1, product scroll, exploded wall labels, knocked-out stills, cinematic chapter pin"
metadata:
  author: JohnEdward-maker
  short-description: "John-WebsiteScrollAnima-Ver1 product scroll"
---

# John-WebsiteScrollAnima-Ver1

One sticky stage. Scroll only changes `p`. The product holds. Type and lines move around it.

Leave the hero alone unless the user asks to change it. This skill owns the story that follows the hero.

## Hard bans

Break any of these and the page is wrong. Fix it before adding more.

| Ban | Do this instead |
|---|---|
| Linear scrub, no stops | Beat holds in `references/scroll-contract.md` |
| CSS slices sliding apart to fake an explode | One still per beat, crossfaded |
| Opaque black rectangle around the product | `scripts/knockout_black.py`, same canvas size |
| Cropping a still to its alpha | Keep the source pixel size so scale does not jump |
| Part labels on the headline side | Right column only, one label per piece. See `references/wall-annotations.md` |
| White or paper stage behind a black-shot product | Stage `#070707` |
| A second paragraph that repeats the part names | Labels replace that paragraph |
| Cartoon water splash on a button | Pointer-follow glow and lagging bubbles only |
| Restyling the hero while fixing the story | Edit the story pin only |

## Read before coding

| Task | File |
|---|---|
| Any scroll work | `references/INDEX.md`, then `references/scroll-contract.md` |
| Empty black around the product | `references/motion-field.md` |
| Product photos | `references/imagery.md` |
| Exploded chapter labels | `references/wall-annotations.md` |

Do not load the wall file for a page that never separates the product.

## Build

1. Pin a `100dvh` stage inside a tall track. Measure `p` on scroll. Ease it in rAF at `0.18`. Set `--p` on the pin.
2. Place 5 to 7 stills in one centered stack. Crossfade them on the holds. Run the knockout script on each still first.
3. Add the motion field behind the stills: two ghost words, three ripples, orbit, both marquees, spine, rail, index.
4. Add one copy window per beat. Left column is kicker, headline, one sentence. Right column is one sentence, or the buy.
5. On the exploded beat only, delete the right paragraph and place the part callouts.
6. Add price and a buy on the first beat and the last beat. The buy adds to the bag. It does not charge a card.
7. Honor `prefers-reduced-motion`.

## Stage

`#070707` ground. Cream type `#f4f1ea`. Copper `#c4a574`. Buy button cream with `#141311` text. Display headlines use the site display face, tight leading (`0.95`). Kickers are small, tracked, uppercase.

## Done when

- Holding still on a beat, the picture does not drift.
- Between beats, the change takes a short ramp, then stops.
- Rings and the ghost word are visible in the area that used to be the photo's black plate.
- No label crosses a paragraph or points at empty space.
- At under 800px the side labels are gone and the headline still fits.
- Reduced motion shows a button instead of a 1000vh chase.
