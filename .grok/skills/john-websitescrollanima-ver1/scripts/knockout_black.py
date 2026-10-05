#!/usr/bin/env python3
"""Remove a near-black studio plate from a product still, keeping the canvas size.

Flood-fills from the image border through pixels whose max channel is <= threshold.
Does not crop. Cropping changes the product scale between scroll beats.

Usage:
  python3 knockout_black.py input.jpg output.png
  python3 knockout_black.py input.jpg output.png --threshold 16
"""

from __future__ import annotations

import argparse
import sys
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image


def knockout(path: Path, threshold: int) -> Image.Image:
    rgb = np.asarray(Image.open(path).convert("RGB"))
    luma = rgb.max(axis=2)
    height, width = luma.shape
    background = np.zeros((height, width), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    def seed(y: int, x: int) -> None:
        if not background[y, x] and luma[y, x] <= threshold:
            background[y, x] = True
            queue.append((y, x))

    for x in range(width):
        seed(0, x)
        seed(height - 1, x)
    for y in range(height):
        seed(y, 0)
        seed(y, width - 1)

    while queue:
        y, x = queue.popleft()
        if y > 0:
            seed(y - 1, x)
        if y + 1 < height:
            seed(y + 1, x)
        if x > 0:
            seed(y, x - 1)
        if x + 1 < width:
            seed(y, x + 1)

    near = np.zeros_like(background)
    for dy in range(-2, 3):
        for dx in range(-2, 3):
            near |= np.roll(np.roll(background, dy, axis=0), dx, axis=1)
    fringe = near & ~background & (luma < threshold + 26)
    fade = np.clip((luma.astype(np.int16) - threshold) * 8, 0, 255)
    alpha = np.where(background, 0, np.where(fringe, fade, 255)).astype(np.uint8)
    return Image.fromarray(np.dstack([rgb, alpha]), "RGBA")


def main() -> int:
    parser = argparse.ArgumentParser(description="Knock a near-black studio plate out of a product still.")
    parser.add_argument("source")
    parser.add_argument("dest")
    parser.add_argument("--threshold", type=int, default=16)
    args = parser.parse_args()
    if not 0 <= args.threshold <= 80:
        print("threshold must be 0-80", file=sys.stderr)
        return 2
    image = knockout(Path(args.source), args.threshold)
    dest = Path(args.dest)
    dest.parent.mkdir(parents=True, exist_ok=True)
    image.save(dest)
    alpha = np.asarray(image)[:, :, 3]
    print(f"{dest} {image.size[0]}x{image.size[1]} transparent={int((alpha < 20).mean() * 100)}%")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
