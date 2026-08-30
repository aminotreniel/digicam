"use client";
import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, ShoppingBag } from "lucide-react";
import CameraArt from "@/components/camera/CameraArt";
import Stars from "@/components/ui/Stars";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { products, badgeMeta, type Product } from "@/data/products";
import { useCompare, useCart } from "@/lib/store";
import { useToast } from "@/components/ui/Toaster";
import { cn, money } from "@/lib/utils";

const ROWS: { label: string; get: (p: Product) => string | number; best?: "high" | "low" }[] = [
  { label: "Price", get: (p) => p.price, best: "low" },
  { label: "Year", get: (p) => p.year, best: "high" },
  { label: "Megapixels", get: (p) => p.mp, best: "high" },
  { label: "Sensor", get: (p) => p.sensor },
  { label: "Lens", get: (p) => p.zoom },
  { label: "ISO range", get: (p) => p.iso },
  { label: "Screen", get: (p) => p.screen },
  { label: "Media", get: (p) => p.media },
  { label: "Battery", get: (p) => p.battery },
  { label: "Weight", get: (p) => p.weight, best: "low" },
  { label: "Video", get: (p) => p.video },
  { label: "Condition", get: (p) => p.condition },
  { label: "Rating", get: (p) => p.rating, best: "high" },
  { label: "Look", get: (p) => p.look.name },
];

export default function ComparePage() {
  const { items, toggle, clear } = useCompare();
  const add = useCart((s) => s.add);
  const setCartOpen = useCart((s) => s.setOpen);
  const push = useToast((s) => s.push);
  const [mounted, setMounted] = React.useState(false);
  const [picker, setPicker] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const picked = mounted ? products.filter((p) => items.includes(p.slug)) : [];
  const slots = [0, 1, 2];

  return (
    <div className="shell pt-10">
      <header className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-8">
        <div>
          <p className="label text-accent">Side by side</p>
          <h1 className="display mt-3 text-[clamp(34px,5.5vw,60px)]">Compare</h1>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
            Up to three bodies at once. Best value in each row is marked.
          </p>
        </div>
        {picked.length > 0 && (
          <button onClick={clear} className="label text-accent transition-opacity hover:opacity-70">Clear all</button>
        )}
      </header>

      <div className="thin-scroll mt-10 overflow-x-auto pb-4">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-[150px_repeat(3,minmax(0,1fr))] gap-4">
            <div />
            {slots.map((i) => {
              const p = picked[i];
              if (!p) {
                return (
                  <button key={i} onClick={() => setPicker(true)}
                    className="flex aspect-[4/3] flex-col items-center justify-center gap-3 border border-dashed border-line text-muted transition-colors hover:border-ink hover:text-ink">
                    <Plus size={22} />
                    <span className="text-[13px]">Add a camera</span>
                  </button>
                );
              }
              return (
                <div key={p.slug} className="relative">
                  <button onClick={() => toggle(p.slug)} aria-label="Remove"
                    className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center border border-line bg-paper text-muted transition-colors hover:text-ink">
                    <X size={13} />
                  </button>
                  <Link href={`/product/${p.slug}`}
                    className="grid aspect-[4/3] place-items-center border border-line px-6"
                    style={{ background: `radial-gradient(110% 85% at 32% 14%, ${p.colors[0].body}22, transparent 62%), var(--paper-2)` }}>
                    <CameraArt form={p.form} body={p.colors[0].body} bodyDark={p.colors[0].bodyDark} trim={p.colors[0].trim}
                      brand={p.brand} model={p.model} uid={`cmp-${p.slug}`} seed={p.slug} />
                  </Link>
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {p.badges.slice(0, 2).map((b) => <Badge key={b} tone={badgeMeta[b].tone}>{badgeMeta[b].label}</Badge>)}
                    </div>
                    <p className="label mt-2 text-muted">{p.brand}</p>
                    <Link href={`/product/${p.slug}`} className="link-slide text-[15px] font-semibold tracking-[-.02em]">{p.model}</Link>
                    <Stars value={p.rating} className="mt-2 block" />
                    <Button variant="outline" size="sm" className="mt-3 w-full"
                      onClick={() => {
                        const c = p.colors[0];
                        add({ slug: p.slug, name: p.model, brand: p.brand, color: c.name, price: p.price,
                          form: p.form, body: c.body, bodyDark: c.bodyDark, trim: c.trim });
                        push({ title: `${p.model} added` });
                        setCartOpen(true);
                      }}>
                      <ShoppingBag size={13} /> {money(p.price)}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {picked.length > 0 && (
            <div className="mt-10">
              {ROWS.map((row, ri) => {
                const vals = picked.map((p) => row.get(p));
                const nums = vals.filter((v) => typeof v === "number") as number[];
                const best = row.best && nums.length > 1
                  ? (row.best === "high" ? Math.max(...nums) : Math.min(...nums))
                  : null;
                return (
                  <div key={row.label}
                    className={cn("grid grid-cols-[150px_repeat(3,minmax(0,1fr))] gap-4 border-b border-line py-3.5",
                      ri % 2 === 1 && "bg-ink/[.02]")}>
                    <span className="label text-muted">{row.label}</span>
                    {slots.map((i) => {
                      const p = picked[i];
                      if (!p) return <span key={i} className="text-[13px] text-faint">—</span>;
                      const v = row.get(p);
                      const isBest = best !== null && v === best;
                      return (
                        <span key={i} className={cn("text-[13px]", isBest ? "font-semibold text-accent" : "text-ink")}>
                          {row.label === "Price" ? money(v as number) : row.label === "Weight" ? `${v} g` : v}
                          {isBest && <span className="label ml-1.5 text-accent">best</span>}
                        </span>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {picked.length === 0 && (
        <div className="mt-12">
          <p className="label text-muted">Popular comparisons</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[["canon-ixus-70", "fujifilm-finepix-z10fd"], ["panasonic-lumix-dmc-lx3", "canon-powershot-g9"], ["olympus-stylus-720sw", "pentax-optio-w30"]].map((pair, i) => (
              <button key={i} onClick={() => { clear(); pair.forEach((s) => toggle(s)); }}
                className="border border-line px-4 py-2.5 text-[13px] transition-colors hover:border-ink">
                {pair.map((s) => products.find((p) => p.slug === s)!.model).join("  vs  ")}
              </button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {picker && (
          <>
            <motion.div className="fixed inset-0 z-[92] bg-black/55 backdrop-blur-[3px]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPicker(false)} />
            <motion.div className="fixed left-1/2 top-1/2 z-[93] max-h-[80dvh] w-[min(94vw,720px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-line bg-paper"
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}>
              <div className="sticky top-0 flex items-center justify-between border-b border-line bg-paper px-5 py-4">
                <span className="text-[15px] font-semibold">Add to comparison</span>
                <button onClick={() => setPicker(false)} aria-label="Close"><X size={17} /></button>
              </div>
              <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3">
                {products.filter((p) => !items.includes(p.slug)).map((p) => (
                  <button key={p.slug} onClick={() => { toggle(p.slug); if (items.length >= 2) setPicker(false); }}
                    className="border border-line p-2 text-left transition-colors hover:border-ink">
                    <span className="grid aspect-[4/3] place-items-center px-3">
                      <CameraArt form={p.form} body={p.colors[0].body} bodyDark={p.colors[0].bodyDark} trim={p.colors[0].trim}
                        brand={p.brand} model={p.model} uid={`pick-${p.slug}`} seed={p.slug} />
                    </span>
                    <span className="label mt-1 block text-muted">{p.brand}</span>
                    <span className="block truncate text-[12.5px] font-medium">{p.model}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
