---
description: "Part labels for the exploded beat. Placement, leaders, and copy. Read only for that chapter."
connections: [scroll-contract, motion-field]
---

# Wall annotations

Use these only on the exploded beat (copy window 3 in the [[scroll-contract]]). They replace the right-hand paragraph. They are not a caption list in the left column.

## Placement

| Rule | Why |
|---|---|
| All labels on the right, `right: max(1.75rem, 6vw)`, `width: 11rem`, text aligned end. | The left column already holds the headline. A label there sits on the paragraph. |
| One label per physical piece, `top` matched to that piece. | A label in empty air is a fail. |
| No label over the product, the headline, or the bottom marquee. | The water label stays at or above `80vh`. |
| Hide every `.callout` under 800px. | They cover the product. |

Starting tops for a tall vessel, cap at the top of a 90vh still:

| Piece | Top | Leader width |
|---|---|---|
| Lip / cap | 16vh | 8rem |
| Outer body | 34vh | 6.5rem |
| Gap / vacuum | 50vh | 9rem |
| Inner piece | 64vh | 11rem |
| Contents | 80vh | 13rem |

A wider piece gets a shorter leader, because its edge is closer to the label. The leader is `position: absolute; right: calc(100% + 0.7rem)`, a 1px dashed cream line, animated `background-position` about 1.15s. A 5px copper disc sits at the product end and pings on a 2.6s loop. Stagger the delays.

## Copy

Two lines only.

- Name, uppercase, tracking `0.18em`, 0.72rem.
- Small, sentence case, under four words, 50% cream. What the piece does, not a repeat of the name.

Good: `Outer wall` / `Brushed steel`. Bad: `OUTER WALL` dropped on top of "Two steels, and the quiet…".

Left column on this beat: kicker, one headline, one sentence. Do not list the parts there. The labels are the list.

## Motion

Each label is its own `[data-copy="3"]` node so it fades with the exploded window. Depth stays between `-0.2` and `0.55`. Larger depth walks the label into the product.

Do not add a second right paragraph that repeats the label names.
