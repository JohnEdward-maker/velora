import { useEffect, useRef } from "react";
import { useBag, useBagCount } from "@/lib/bag";
import { formatMoney } from "@/lib/catalog";
import { TideButton } from "@/components/tide-button";

const LEFT = ["V", "E", "L"] as const;
const RIGHT = ["O", "R", "A"] as const;

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function paint(root: HTMLElement, video: HTMLVideoElement | null) {
  const total = root.offsetHeight - window.innerHeight;
  const raw = total <= 0 ? 0 : -root.getBoundingClientRect().top / total;
  const p = Math.min(1, Math.max(0, raw));
  const travel = 1 - Math.pow(1 - p, 1.4);
  const vw = window.innerWidth / 100;

  const left = root.querySelectorAll<HTMLElement>('[data-hero="left"] i');
  left.forEach((letter, index) => {
    const fromInner = left.length - 1 - index;
    const x = -(13 + fromInner * 4) * vw * travel;
    const y = -fromInner * 8 * travel;
    letter.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });

  const right = root.querySelectorAll<HTMLElement>('[data-hero="right"] i');
  right.forEach((letter, index) => {
    const x = (13 + index * 4) * vw * travel;
    const y = -index * 8 * travel;
    letter.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });

  const figure = root.querySelector<HTMLElement>('[data-hero="figure"]');
  if (figure) {
    figure.style.transform = `translate3d(-50%, calc(-48% - ${7 * travel}vh), 0)`;
  }

  const disc = root.querySelector<HTMLElement>('[data-hero="disc"]');
  if (disc) {
    const scale = 0.8 + 0.55 * travel;
    disc.style.transform = `translate3d(-50%, -50%, 0) scale(${scale})`;
  }

  const nav = root.querySelector<HTMLElement>('[data-hero="nav"]');
  if (nav) {
    nav.style.opacity = String(1 - travel);
    nav.style.transform = `translate3d(0, ${-18 * travel}px, 0)`;
    nav.style.pointerEvents = travel > 0.92 ? "none" : "auto";
  }

  const meta = root.querySelector<HTMLElement>('[data-hero="meta"]');
  if (meta) {
    meta.style.opacity = String(1 - travel);
    meta.style.transform = `translate3d(0, ${16 * travel}px, 0)`;
  }

  if (!video) return;
  const opacity = smoothstep(0.5, 1, p);
  video.style.opacity = String(opacity);
  if (opacity > 0.04) {
    if (video.paused) void video.play().catch(() => undefined);
  } else if (!video.paused) {
    video.pause();
    video.currentTime = 0;
  }
}

export function HeroFilm() {
  const trackRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const count = useBagCount();
  const setOpen = useBag((state) => state.setOpen);
  const add = useBag((state) => state.add);

  useEffect(() => {
    const root = trackRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let frame = 0;
    const run = () => {
      frame = 0;
      paint(root, videoRef.current);
    };
    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(run);
    };

    run();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="hero-track" ref={trackRef} aria-label="VELORA">
      <div className="hero-pin">
        <header className="hero-nav" data-hero="nav">
          <a href="#film">Velora</a>
          <div className="hero-links">
            <a href="#film">Film</a>
            <a href="#wall">Wall</a>
            <a href="#atelier">Still</a>
            <a href="#circuit">Circuit</a>
            <TideButton type="button" onClick={() => add("750")}>
              Buy · {formatMoney(148)}
            </TideButton>
            <TideButton type="button" className="bag-link" onClick={() => setOpen(true)}>
              Bag{count > 0 ? ` ${count}` : ""}
            </TideButton>
          </div>
        </header>

        <div className="hero-stage">
          <div className="disc" data-hero="disc" aria-hidden="true" />
          <img
            className="figure"
            data-hero="figure"
            src="/media/bottle.png"
            width={488}
            height={1413}
            alt="The Still, brushed steel with a copper lip"
          />
          <h1 className="wordmark">
            <span className="wing" data-hero="left" aria-hidden="true">
              {LEFT.map((letter) => (
                <i key={letter}>{letter}</i>
              ))}
            </span>
            <span className="notch" aria-hidden="true" />
            <span className="wing" data-hero="right" aria-hidden="true">
              {RIGHT.map((letter) => (
                <i key={letter}>{letter}</i>
              ))}
            </span>
            <span className="sr">VELORA</span>
          </h1>
          <video
            ref={videoRef}
            className="dissolve"
            src="/media/dissolve.mp4"
            poster="/media/dissolve.jpg"
            muted
            playsInline
            loop
            preload="auto"
          />
        </div>

        <div className="hero-foot" data-hero="meta">
          <p>{formatMoney(148)} · preview</p>
          <p>Scroll</p>
        </div>
      </div>
    </section>
  );
}
