export type SizeId = "500" | "750";

export type VesselSize = {
  id: SizeId;
  label: string;
  price: number;
  weight: string;
  cold: string;
  hot: string;
};

export const SIZES: VesselSize[] = [
  {
    id: "500",
    label: "500 ml",
    price: 118,
    weight: "268 g",
    cold: "18 hours",
    hot: "10 hours",
  },
  {
    id: "750",
    label: "750 ml",
    price: 148,
    weight: "312 g",
    cold: "24 hours",
    hot: "12 hours",
  },
];

export function sizeById(id: SizeId): VesselSize {
  const found = SIZES.find((size) => size.id === id);
  if (!found) return SIZES[1];
  return found;
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
