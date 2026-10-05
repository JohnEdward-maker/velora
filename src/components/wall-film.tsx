import { useRef, useState } from "react";
import { formatMoney } from "@/lib/catalog";
import { useBag } from "@/lib/bag";
import { TideButton } from "@/components/tide-button";

const LABELS = ["Open the wall", "Show the rest", "Close the wall"] as const;

export function WallFilm() {
  const add = useBag((state) => state.add);
  const film = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState(0);
  const [turning, setTurning] = useState(false);

  function advance() {
    if (turning) return;
    const next = (step + 1) % 3;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (next === 2 && !reduced) {
      const node = film.current;
      if (!node) {
        setStep(2);
        return;
      }
      setTurning(true);
      node.currentTime = 0;
      void node.play().catch(() => {
        setTurning(false);
        setStep(2);
      });
      return;
    }
    setTurning(false);
    setStep(next);
  }

  return (
    <section id="wall" className={turning ? "wall-stage is-turning" : "wall-stage"} data-step={step}>
      <div className="wall-object">
        <video
          ref={film}
          className="spin-film"
          src="/media/turn.mp4"
          muted
          playsInline
          preload="auto"
          onEnded={() => {
            setTurning(false);
            setStep(2);
          }}
        />
        <div className="stack">
          <div className="slot">
            <div className="clip">
              <img src="/media/part-cap.png" width={488} height={252} alt="" />
            </div>
            <span className="name cap">
              <i />
              Cap
            </span>
          </div>

          <div className="slot extra lip">
            <div className="clip">
              <svg viewBox="0 0 488 36" aria-hidden="true">
                <defs>
                  <linearGradient id="copper-lip" x1="0" x2="1">
                    <stop offset="0" stopColor="#6e4330" />
                    <stop offset="0.34" stopColor="#f0c7a0" />
                    <stop offset="0.52" stopColor="#a86d45" />
                    <stop offset="0.74" stopColor="#f6d7b8" />
                    <stop offset="1" stopColor="#734832" />
                  </linearGradient>
                </defs>
                <ellipse cx="244" cy="18" rx="116" ry="6.5" fill="none" stroke="#4a2e22" strokeWidth="8" />
                <ellipse cx="244" cy="18" rx="116" ry="6.5" fill="none" stroke="url(#copper-lip)" strokeWidth="5" />
                <ellipse cx="244" cy="16" rx="104" ry="2.6" fill="none" stroke="rgba(255,236,214,0.7)" strokeWidth="1" />
              </svg>
            </div>
            <span className="name lip">
              <i />
              Copper lip
            </span>
          </div>

          <div className="slot outer">
            <div className="clip">
              <img src="/media/part-body.png" width={488} height={1165} alt="" />
            </div>
            <span className="name outer">
              <i />
              Outer wall
            </span>
          </div>

          <div className="slot extra liner">
            <span className="name vacuum">
              <i />
              Vacuum
            </span>
            <div className="clip">
              <img src="/media/part-inner.png" width={488} height={520} alt="" />
              <div className="water-col" />
            </div>
            <span className="name inner">
              <i />
              Inner wall
            </span>
            <span className="name water">
              <i />
              Water
            </span>
          </div>
        </div>
      </div>

      <p className="sr">
        The Still, in three clicks. First the cap and copper lip. Then the bottle turns, and the
        wall, the vacuum, and the water are shown. Then it closes.
      </p>

      <aside className="side side-left">
        <p className="kicker">02 — The wall</p>
        <h2 className="display">The pieces, named.</h2>
        <p className="deck">
          Two steels, and the quiet between them. The cap sits low. The lip is copper, seated by
          hand and left bare.
        </p>
        <p className="deck">Open it once for the mouth. Again, and it turns. Once more, and it is whole.</p>
      </aside>

      <aside className="side side-right">
        <p className="kicker">Inside</p>
        <p className="side-line">
          <span>01</span>
          Cap and lip
        </p>
        <p className="side-line">
          <span>02</span>
          Vacuum between the steels
        </p>
        <p className="side-line">
          <span>03</span>
          Inner wall, and the water
        </p>
        <p className="deck">Nothing here is borrowed. One bottle, taken apart on its own axis.</p>
      </aside>

      <div className="wall-ui">
        <div className="actions">
          <TideButton type="button" className="buy" onClick={advance} aria-pressed={step > 0}>
            {LABELS[step]}
          </TideButton>
          <TideButton type="button" className="ghost" onClick={() => add("750")}>
            Buy · {formatMoney(148)}
          </TideButton>
        </div>
      </div>
    </section>
  );
}
