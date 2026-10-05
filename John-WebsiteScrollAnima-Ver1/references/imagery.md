---
description: "How to remove the black studio plate from product stills without changing their scale."
connections: [scroll-contract, motion-field]
---

# Imagery

A still with a baked black background paints a rectangle over the [[motion-field]]. That is a fail even when the stage is also black, because the ghost type and rings stop at the photo edge.

## Rule

1. Run `scripts/knockout_black.py` on every story still. Default threshold `16`.
2. Write a PNG next to the source. Point the beat `<img>` at the PNG.
3. Keep the original pixel size. Do not crop to the alpha bounds. The pin sizes beats by height (`min(90vh, 980px)`, centered). A crop makes the product jump between beats.
4. Reject the PNG if the product itself lost a limb, or if a gray studio sweep is still a solid plate. Raise threshold only for that file, never above `40`. If the plate is gray rather than black, say so and regenerate the still on `#070707` instead of eating the metal.

```bash
python3 .grok/skills/john-websitescrollanima-ver1/scripts/knockout_black.py \
  public/media/beat-whole.jpg public/media/beat-whole.png
```

Check the result on a colored ground before shipping. On `#070707` a missed plate is invisible.

## What the stills are

One photograph per beat, same product, same metal, same proportions. Crossfade them with the holds in the [[scroll-contract]]. Do not build the explode by translating cropped slices. That reads as a diagram, and it jitters.

Order for a vessel:

1. Whole
2. Mouth open
3. One material, close
4. Parts separated on one vertical axis
5. Deeper separation
6. Three-quarter or side
7. Whole again, for the buy beat

If a beat's background is not near-black, do not force this script. Fix the picture.
