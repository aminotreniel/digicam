"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartLine = {
  key: string;
  slug: string;
  name: string;
  brand: string;
  color: string;
  price: number;
  qty: number;
  form: string;
  body: string;
  bodyDark: string;
  trim: string;
};

type CartState = {
  lines: CartLine[];
  open: boolean;
  add: (line: Omit<CartLine, "key" | "qty">, qty?: number) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  setOpen: (v: boolean) => void;
  count: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      open: false,
      add: (line, qty = 1) =>
        set((s) => {
          const key = `${line.slug}::${line.color}`;
          const existing = s.lines.find((l) => l.key === key);
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.key === key ? { ...l, qty: Math.min(9, l.qty + qty) } : l
              ),
            };
          }
          return { lines: [...s.lines, { ...line, key, qty }] };
        }),
      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),
      setQty: (key, qty) =>
        set((s) => ({
          lines:
            qty <= 0
              ? s.lines.filter((l) => l.key !== key)
              : s.lines.map((l) => (l.key === key ? { ...l, qty: Math.min(9, qty) } : l)),
        })),
      clear: () => set({ lines: [] }),
      setOpen: (v) => set({ open: v }),
      count: () => get().lines.reduce((a, l) => a + l.qty, 0),
      subtotal: () => get().lines.reduce((a, l) => a + l.qty * l.price, 0),
    }),
    {
      name: "grain-cart",
      storage: createJSONStorage(() => localStorage),
      // only the lines are durable — the drawer must never restore itself open
      partialize: (s) => ({ lines: s.lines }) as any,
    }
  )
);

type SavedState = {
  saved: string[];
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
};

export const useSaved = create<SavedState>()(
  persist(
    (set, get) => ({
      saved: [],
      toggle: (slug) =>
        set((s) => ({
          saved: s.saved.includes(slug)
            ? s.saved.filter((x) => x !== slug)
            : [...s.saved, slug],
        })),
      has: (slug) => get().saved.includes(slug),
    }),
    { name: "grain-saved", storage: createJSONStorage(() => localStorage) }
  )
);

type CompareState = {
  items: string[];
  toggle: (slug: string) => void;
  clear: () => void;
};

export const useCompare = create<CompareState>()(
  persist(
    (set) => ({
      items: [],
      toggle: (slug) =>
        set((s) => ({
          items: s.items.includes(slug)
            ? s.items.filter((x) => x !== slug)
            : s.items.length >= 3
            ? s.items
            : [...s.items, slug],
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "grain-compare", storage: createJSONStorage(() => localStorage) }
  )
);

type UIState = {
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
  quickView: string | null;
  setQuickView: (slug: string | null) => void;
};

export const useUI = create<UIState>((set) => ({
  paletteOpen: false,
  setPaletteOpen: (v) => set({ paletteOpen: v }),
  quickView: null,
  setQuickView: (slug) => set({ quickView: slug }),
}));
