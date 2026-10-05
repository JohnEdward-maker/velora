import { useEffect, useRef, useState } from "react";
import { formatMoney, SIZES, sizeById, type SizeId } from "@/lib/catalog";
import { useBag } from "@/lib/bag";
import { TideButton } from "@/components/tide-button";

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function ramp(value: number, start: number, end: number) {
  return clamp((value - start) / (end - start));
}

function smooth(value: number) {
  return value * value * (3 - 2 * value);
}

export function StoryFilm() {
  const trackRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const add = useBag((state) => state.add);
  const [size, setSize] = useState<SizeId>("750");
  const chosen = sizeById(size);

  useEffect(() => {
    const track = trackRef.current;
    const pin = pinRef.current;
    if (!track || !pin) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let shown = 0;
    let target = 0;
    let frame = 0;

    const apply = (p: number) => {
      pin.style.setProperty("--p", p.toFixed(4));
      const chapter = Math.min(6, Math.floor(p * 7));
      const index = pin.querySelector<HTMLElement>("[data-field-index]");
      if (index) index.textContent = String(chapter + 1).padStart(2, "0");
      const holds: Array<[number, number]> = [
        [0, 0.12],
        [0.18, 0.26],
        [0.32, 0.4],
        [0.48, 0.6],
        [0.66, 0.74],
        [0.8, 0.88],
        [0.94, 1],
      ];
      pin.querySelectorAll<HTMLElement>("[data-beat-img]").forEach((node) => {
        const i = Number(node.dataset.beatImg);
        const [a, b] = holds[i];
        const prev = i === 0 ? 0 : holds[i - 1][1];
        const next = i === holds.length - 1 ? 1 : holds[i + 1][0];
        const fadeIn = i === 0 ? 1 : smooth(ramp(p, prev, a));
        const fadeOut = i === holds.length - 1 ? 1 : 1 - smooth(ramp(p, b, next));
        const opacity = fadeIn * fadeOut;
        node.style.opacity = opacity.toFixed(3);
      });

      const windows: Array<[number, number]> = [
        [0, 0.16],
        [0.16, 0.3],
        [0.3, 0.44],
        [0.46, 0.62],
        [0.64, 0.76],
        [0.78, 0.9],
        [0.92, 1.05],
      ];
      const copy = windows.map(([a, b]) => smooth(ramp(p, a, a + 0.03)) * (1 - smooth(ramp(p, b - 0.04, b))));
      pin.querySelectorAll<HTMLElement>("[data-copy]").forEach((node) => {
        const index = Number(node.dataset.copy);
        const opacity = copy[index] ?? 0;
        const [a, b] = windows[index] ?? [0, 1];
        const local = (p - a) / Math.max(0.001, b - a);
        const depth = Number(node.dataset.depth ?? 0);
        const shift = (local - 0.5) * depth * 18;
        const x = node.classList.contains("story-specs") ? "-50%" : "0px";
        node.style.opacity = opacity.toFixed(3);
        node.style.transform = `translate3d(${x}, ${shift.toFixed(1)}px, 0)`;
        node.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
      });

      const counted = smooth(ramp(p, 0.66, 0.76));
      pin.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
        node.textContent = String(Math.round(Number(node.dataset.count) * counted));
      });
      const circuit = ramp(p, 0.66, 0.76);
      pin.querySelectorAll<HTMLElement>("[data-beat]").forEach((node) => {
        node.dataset.on = circuit >= Number(node.dataset.beat) ? "true" : "false";
      });
    };

    const tick = () => {
      shown += reduced ? target - shown : (target - shown) * 0.18;
      if (Math.abs(target - shown) < 0.001) shown = target;
      apply(shown);
      frame = Math.abs(target - shown) < 0.001 ? 0 : window.requestAnimationFrame(tick);
    };

    const measure = () => {
      if (reduced) {
        target = pin.dataset.hold === "open" ? 0.4 : 0;
      } else {
        const rect = track.getBoundingClientRect();
        const scrollable = Math.max(1, track.offsetHeight - window.innerHeight);
        target = clamp(-rect.top / scrollable);
      }
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  function holdOpen() {
    const pin = pinRef.current;
    if (!pin) return;
    pin.dataset.hold = pin.dataset.hold === "open" ? "" : "open";
    window.dispatchEvent(new Event("resize"));
  }

  return (
    <section className="story-track" ref={trackRef}>
      <span id="film" className="story-mark" style={{ top: "4%" }} />
      <span id="wall" className="story-mark" style={{ top: "62%" }} />
      <span id="circuit" className="story-mark" style={{ top: "88%" }} />
      <span id="atelier" className="story-mark" style={{ top: "95%" }} />

      <div className="story-pin" ref={pinRef}>
        <div className="field" aria-hidden="true">
          <div className="marquee">
            <div className="marquee-track">
              <span>Still · Steel · Vacuum · Copper · Water · Held · Still · Steel · Vacuum · Copper · Water · Held ·</span>
              <span>Still · Steel · Vacuum · Copper · Water · Held · Still · Steel · Vacuum · Copper · Water · Held ·</span>
            </div>
          </div>
          <p className="ghost-word ghost-a">STILL</p>
          <p className="ghost-word ghost-b">VELORA</p>
          <i className="ripple a" />
          <i className="ripple b" />
          <i className="ripple c" />
          <i className="orbit-arc" />
          <div className="rail">
            <span />
          </div>
          <p className="field-index" data-field-index>
            01
          </p>
          <p className="spine">Held in steel</p>
          <i className="mote m1" />
          <i className="mote m2" />
          <i className="mote m3" />
          <i className="mote m4" />
          <div className="marquee marquee-foot">
            <div className="marquee-track reverse">
              <span>24 hr cold · 12 hr hot · 312 g · one mill · seated by hand · four days · </span>
              <span>24 hr cold · 12 hr hot · 312 g · one mill · seated by hand · four days · </span>
            </div>
          </div>
        </div>
        <div className="beat-stack">
          <img className="beat" data-beat-img="0" src="/media/beat-whole.png" alt="" />
          <img className="beat" data-beat-img="1" src="/media/beat-mouth.png" alt="" />
          <img className="beat" data-beat-img="2" src="/media/beat-lip.png" alt="" />
          <img className="beat" data-beat-img="3" src="/media/beat-open.png" alt="" />
          <img className="beat" data-beat-img="4" src="/media/beat-deep.png" alt="" />
          <img className="beat" data-beat-img="5" src="/media/beat-side.png" alt="" />
          <img className="beat" data-beat-img="6" src="/media/beat-still.png" alt="" />
        </div>

        <div className="story-copy left" data-copy="0" data-depth="-1">
          <p className="kicker">01 — The pour</p>
          <h2 className="display">Water, held still.</h2>
          <p className="deck">The cap clears. What you poured stays where you left it.</p>
        </div>
        <div className="story-copy right" data-copy="0" data-depth="1.2">
          <p className="price-line">
            <strong className="tabular-nums">{formatMoney(148)}</strong>
            <span>750 ml</span>
          </p>
          <TideButton type="button" className="buy" onClick={() => add("750")}>
            Buy · 750 ml
          </TideButton>
        </div>

        <div className="story-copy left" data-copy="1" data-depth="-0.85">
          <p className="kicker">02 — The wall</p>
          <h2 className="display">The mouth, first.</h2>
          <p className="deck">The cap lifts. The copper lip stays, seated by hand and left bare.</p>
        </div>
        <div className="story-copy right" data-copy="1" data-depth="1.05">
          <p className="deck">One line of metal. Nothing lacquered over it.</p>
        </div>

        <div className="story-copy left" data-copy="2" data-depth="-0.7">
          <p className="kicker">02 — The wall</p>
          <h2 className="display">The copper, bare.</h2>
          <p className="deck">One ring. Seated by hand. Nothing lacquered over it.</p>
        </div>

        <div className="story-copy right" data-copy="2" data-depth="0.85">
          <p className="deck">Warm where the mouth meets it. Cold nowhere else.</p>
        </div>

        <div className="story-copy left" data-copy="3" data-depth="-0.7">
          <p className="kicker">02 — The wall</p>
          <h2 className="display">Taken apart.</h2>
          <p className="deck">Two steels, and the quiet between them. The water never touches the outside.</p>
        </div>
        <p className="callout c-lip" data-copy="3" data-depth="0.2">
          <i />
          <span>Copper lip</span>
          <small>Seated by hand</small>
        </p>
        <p className="callout c-wall" data-copy="3" data-depth="0.45">
          <i />
          <span>Outer wall</span>
          <small>Brushed steel</small>
        </p>
        <p className="callout c-vac" data-copy="3" data-depth="-0.15">
          <i />
          <span>Vacuum</span>
          <small>The quiet</small>
        </p>
        <p className="callout c-inner" data-copy="3" data-depth="0.3">
          <i />
          <span>Inner wall</span>
          <small>Holds the pour</small>
        </p>
        <p className="callout c-water" data-copy="3" data-depth="0.55">
          <i />
          <span>Water</span>
          <small>Still, at the base</small>
        </p>

        <div className="story-copy left" data-copy="5" data-depth="-0.55">
          <p className="kicker">The side</p>
          <h2 className="display">A little of the side.</h2>
          <p className="deck">The light crosses the steel. The bottle stays one thing.</p>
        </div>
        <div className="story-copy right" data-copy="5" data-depth="0.75">
          <p className="deck">Brushed, not polished. The grain stays in the hand.</p>
        </div>

        <div className="story-copy left" data-copy="4" data-depth="-0.6">
          <p className="kicker">04 — The circuit</p>
          <h2 className="display">What it keeps.</h2>
          <ol className="story-beats">
            <li data-beat="0.15">
              <span>01</span> Cut in one mill
            </li>
            <li data-beat="0.45">
              <span>02</span> Lip seated by hand
            </li>
            <li data-beat="0.72">
              <span>03</span> Four days to your city
            </li>
          </ol>
        </div>
        <div className="story-specs" data-copy="4" data-depth="0.75">
          <p>
            <strong data-count="24">0</strong>
            <span>hr cold</span>
          </p>
          <p>
            <strong data-count="12">0</strong>
            <span>hr hot</span>
          </p>
          <p>
            <strong data-count="312">0</strong>
            <span>grams</span>
          </p>
        </div>

        <div className="story-copy left" data-copy="6" data-depth="-0.4">
          <p className="kicker">03 — The Still</p>
          <h2 className="display">The vessel, priced.</h2>
          <p className="deck">One finish. Two measures. A hold on this device — no card is taken.</p>
          <div className="actions" role="group" aria-label="Measure">
            {SIZES.map((option) => (
              <TideButton
                key={option.id}
                type="button"
                aria-pressed={option.id === size}
                className={option.id === size ? "buy" : "ghost"}
                onClick={() => setSize(option.id)}
              >
                {option.label}
              </TideButton>
            ))}
          </div>
          <p className="meta">
            {chosen.cold} cold · {chosen.hot} hot · {chosen.weight}
          </p>
          <TideButton type="button" className="buy" onClick={() => add(size)}>
            Buy {chosen.label} · {formatMoney(chosen.price)}
          </TideButton>
        </div>
        <div className="story-copy right" data-copy="6" data-depth="0.45">
          <p className="kicker">Four days out</p>
          <p className="deck">Cut once. Finished once. Nothing lacquered over the lip.</p>
        </div>

        <button type="button" className="story-hold" onClick={holdOpen}>
          Open the wall
        </button>

        <p className="sr">
          The Still, scrolled open: cap, copper lip, outer wall, vacuum, inner wall, and water.
          Then it turns, and closes.
        </p>
      </div>
    </section>
  );
}
