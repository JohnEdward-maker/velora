import { useEffect, useRef, type ButtonHTMLAttributes, type PointerEvent } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export function TideButton({
  className = "",
  onPointerMove,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  children,
  ...props
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const hover = useRef(false);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const frame = useRef(0);
  const bubbles = useRef([
    { x: 0, y: 0, k: 0.18, ox: -8, oy: -5 },
    { x: 0, y: 0, k: 0.11, ox: 9, oy: 3 },
    { x: 0, y: 0, k: 0.08, ox: -3, oy: 7 },
    { x: 0, y: 0, k: 0.055, ox: 6, oy: -7 },
  ]);

  useEffect(() => {
    return () => cancelAnimationFrame(frame.current);
  }, []);

  function setTarget(event: PointerEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    target.current.x = event.clientX - rect.left;
    target.current.y = event.clientY - rect.top;
  }

  function loop() {
    const el = ref.current;
    if (!el || !hover.current) return;
    pos.current.x += (target.current.x - pos.current.x) * 0.1;
    pos.current.y += (target.current.y - pos.current.y) * 0.1;
    el.style.setProperty("--sx", `${pos.current.x}px`);
    el.style.setProperty("--sy", `${pos.current.y}px`);
    for (let i = 0; i < bubbles.current.length; i += 1) {
      const bubble = bubbles.current[i];
      bubble.x += (target.current.x + bubble.ox - bubble.x) * bubble.k;
      bubble.y += (target.current.y + bubble.oy - bubble.y) * bubble.k;
      el.style.setProperty(`--b${i}x`, `${bubble.x}px`);
      el.style.setProperty(`--b${i}y`, `${bubble.y}px`);
    }
    frame.current = requestAnimationFrame(loop);
  }

  function enter(event: PointerEvent<HTMLButtonElement>) {
    hover.current = true;
    setTarget(event);
    pos.current.x = target.current.x;
    pos.current.y = target.current.y;
    for (const bubble of bubbles.current) {
      bubble.x = target.current.x + bubble.ox;
      bubble.y = target.current.y + bubble.oy;
    }
    cancelAnimationFrame(frame.current);
    loop();
    onPointerEnter?.(event);
  }

  function move(event: PointerEvent<HTMLButtonElement>) {
    setTarget(event);
    onPointerMove?.(event);
  }

  function leave(event: PointerEvent<HTMLButtonElement>) {
    hover.current = false;
    cancelAnimationFrame(frame.current);
    onPointerLeave?.(event);
  }

  function down(event: PointerEvent<HTMLButtonElement>) {
    setTarget(event);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      for (const late of [false, true]) {
        const ring = document.createElement("span");
        ring.className = late ? "tide-ring late" : "tide-ring";
        ring.style.left = `${x}px`;
        ring.style.top = `${y}px`;
        event.currentTarget.appendChild(ring);
        ring.addEventListener("animationend", () => ring.remove());
      }
    }
    onPointerDown?.(event);
  }

  return (
    <button
      ref={ref}
      className={className ? `tide ${className}` : "tide"}
      onPointerEnter={enter}
      onPointerMove={move}
      onPointerLeave={leave}
      onPointerDown={down}
      {...props}
    >
      <span className="tide-caustic" aria-hidden="true" />
      <span className="tide-glow" aria-hidden="true" />
      <span className="tide-bubbles" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="tide-label">{children}</span>
    </button>
  );
}
