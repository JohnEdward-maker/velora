import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { sizeById, type SizeId } from "@/lib/catalog";

export type BagLine = {
  size: SizeId;
  qty: number;
};

export type Hold = {
  id: string;
  name: string;
  city: string;
  lines: BagLine[];
  total: number;
};

type BagState = {
  lines: BagLine[];
  open: boolean;
  hold: Hold | null;
  hydrated: boolean;
  setOpen: (open: boolean) => void;
  add: (size: SizeId) => void;
  setQty: (size: SizeId, qty: number) => void;
  placeHold: (name: string, city: string) => void;
  dismissHold: () => void;
  markHydrated: () => void;
};

const MAX_QTY = 4;

export const useBag = create<BagState>()(
  persist(
    (set, get) => ({
      lines: [],
      open: false,
      hold: null,
      hydrated: false,
      setOpen: (open) => set({ open }),
      add: (size) => {
        const lines = get().lines.map((line) => ({ ...line }));
        const index = lines.findIndex((line) => line.size === size);
        if (index >= 0) {
          lines[index] = { ...lines[index], qty: Math.min(MAX_QTY, lines[index].qty + 1) };
        } else {
          lines.push({ size, qty: 1 });
        }
        set({ lines, open: true, hold: null });
      },
      setQty: (size, qty) => {
        const next =
          qty <= 0
            ? get().lines.filter((line) => line.size !== size)
            : get().lines.map((line) =>
                line.size === size ? { ...line, qty: Math.min(MAX_QTY, qty) } : line,
              );
        set({ lines: next });
      },
      placeHold: (name, city) => {
        const lines = get().lines;
        if (!lines.length) return;
        const total = lines.reduce((sum, line) => sum + sizeById(line.size).price * line.qty, 0);
        const id = `VEL-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
        set({
          hold: { id, name: name.trim(), city: city.trim(), lines, total },
          lines: [],
        });
      },
      dismissHold: () => set({ hold: null, open: false }),
      markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "velora-bag",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({ lines: state.lines, hold: state.hold }),
    },
  ),
);

export function useBagCount(): number {
  const lines = useBag((state) => state.lines);
  const hydrated = useBag((state) => state.hydrated);
  if (!hydrated) return 0;
  return lines.reduce((sum, line) => sum + line.qty, 0);
}
