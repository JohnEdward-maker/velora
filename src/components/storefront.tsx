import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Minus, Plus, X } from "lucide-react";
import { formatMoney, sizeById } from "@/lib/catalog";
import { useBag, useBagCount, type BagLine } from "@/lib/bag";
import { StoryFilm } from "@/components/story-film";
import { TideButton } from "@/components/tide-button";

export function Storefront() {
  const setOpen = useBag((state) => state.setOpen);

  useEffect(() => {
    void Promise.resolve(useBag.persist.rehydrate()).then(() => {
      useBag.getState().markHydrated();
    });
  }, []);

  return (
    <>
      <StoryFilm />
      <footer className="band band-dark">
        <div className="frame foot">
          <p className="display text-3xl">VELORA</p>
          <p className="deck">One house. One bottle. The Still is not a listing borrowed from somewhere else.</p>
          <TideButton type="button" className="ghost" onClick={() => setOpen(true)}>
            Open bag
          </TideButton>
        </div>
        <p className="made">Made by Gawaform</p>
      </footer>
      <BagSheet />
    </>
  );
}

function lineTotal(line: BagLine) {
  return sizeById(line.size).price * line.qty;
}

function BagSheet() {
  const open = useBag((state) => state.open);
  const setOpen = useBag((state) => state.setOpen);
  const lines = useBag((state) => state.lines);
  const hold = useBag((state) => state.hold);
  const setQty = useBag((state) => state.setQty);
  const placeHold = useBag((state) => state.placeHold);
  const dismissHold = useBag((state) => state.dismissHold);
  const count = useBagCount();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const total = lines.reduce((sum, line) => sum + lineTotal(line), 0);
  const ready = name.trim().length > 1 && city.trim().length > 1 && lines.length > 0;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bag-overlay" />
        <Dialog.Content className="bag-sheet" aria-describedby="bag-note">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="display text-3xl">Bag</Dialog.Title>
              <p id="bag-note" className="mt-2 text-sm text-muted">
                {count === 0 && !hold ? "Empty. The Still is waiting in the atelier." : "A hold stays on this device. No card is taken."}
              </p>
            </div>
            <Dialog.Close className="flex h-11 w-11 items-center justify-center border border-line" aria-label="Close bag">
              <X className="size-4" />
            </Dialog.Close>
          </div>

          {hold ? (
            <div className="mt-10 flex flex-1 flex-col gap-4">
              <p className="kicker">Hold placed</p>
              <p className="display text-4xl tabular-nums">{hold.id}</p>
              <p className="text-sm leading-relaxed text-muted">
                {hold.name}, {hold.city}. {formatMoney(hold.total)} reserved for{" "}
                {hold.lines.map((line) => `${line.qty} × ${sizeById(line.size).label}`).join(", ")}.
                This note lives in the browser only.
              </p>
              <button type="button" className="mt-auto h-12 bg-fg text-sm font-medium text-ink" onClick={dismissHold}>
                Done
              </button>
            </div>
          ) : (
            <form
              className="mt-8 flex flex-1 flex-col gap-6"
              onSubmit={(event) => {
                event.preventDefault();
                if (!ready) return;
                placeHold(name, city);
                setName("");
                setCity("");
              }}
            >
              <ul className="flex flex-col gap-4">
                {lines.map((line) => {
                  const spec = sizeById(line.size);
                  return (
                    <li key={line.size} className="flex items-center gap-4 border-b border-line pb-4">
                      <img src="/media/bottle.png" alt="" width={488} height={1413} className="h-16 w-auto" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm">The Still</p>
                        <p className="text-sm text-muted">{spec.label}</p>
                        <p className="tabular-nums text-sm">{formatMoney(lineTotal(line))}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="flex h-11 w-11 items-center justify-center border border-line"
                          aria-label={`Fewer ${spec.label}`}
                          onClick={() => setQty(line.size, line.qty - 1)}
                        >
                          <Minus className="size-4" />
                        </button>
                        <span className="w-6 text-center tabular-nums">{line.qty}</span>
                        <button
                          type="button"
                          className="flex h-11 w-11 items-center justify-center border border-line"
                          aria-label={`More ${spec.label}`}
                          onClick={() => setQty(line.size, line.qty + 1)}
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {lines.length > 0 ? (
                <div className="mt-auto flex flex-col gap-3">
                  <label className="flex flex-col gap-2 text-sm">
                    Name
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      autoComplete="name"
                      className="h-11 border border-line bg-transparent px-3 text-fg"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm">
                    City
                    <input
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      required
                      autoComplete="address-level2"
                      className="h-11 border border-line bg-transparent px-3 text-fg"
                    />
                  </label>
                  <p className="flex items-center justify-between text-sm">
                    <span className="text-muted">Hold</span>
                    <span className="tabular-nums">{formatMoney(total)}</span>
                  </p>
                  <button type="submit" className="h-12 bg-fg text-sm font-medium text-ink disabled:opacity-40" disabled={!ready}>
                    Place hold
                  </button>
                </div>
              ) : null}
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
