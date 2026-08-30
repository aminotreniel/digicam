import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export const money2 = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

/** round to 3dp — keeps SSR and client SVG output byte-identical */
export const r3 = (n: number) => Math.round(n * 1000) / 1000;

export function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

/** deterministic pseudo-random from a string seed — keeps SSR and client in sync */
export function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function stamp(year: number, i = 0) {
  const m = ((i * 5 + 3) % 12) + 1;
  const d = ((i * 11 + 7) % 27) + 1;
  const p = (n: number) => String(n).padStart(2, "0");
  return `'${String(year).slice(2)} ${p(m)} ${p(d)}`;
}
