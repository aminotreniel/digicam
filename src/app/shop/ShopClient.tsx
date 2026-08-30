"use client";
import * as React from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { SlidersHorizontal, X, LayoutGrid, Rows3, ArrowUpDown } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { Group, Check, PriceRange, Chip } from "@/components/shop/Filters";
import Button from "@/components/ui/Button";
import { products, brands, eras, conditions, allTags, priceBounds } from "@/data/products";
import { cn } from "@/lib/utils";

type Sort = "featured" | "price-asc" | "price-desc" | "newest" | "oldest" | "rating" | "mp";

const SORTS: { key: Sort; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price — low to high" },
  { key: "price-desc", label: "Price — high to low" },
  { key: "newest", label: "Newest bodies" },
  { key: "oldest", label: "Oldest bodies" },
  { key: "rating", label: "Highest rated" },
  { key: "mp", label: "Most megapixels" },
];

const FORMS = ["slim", "compact", "boxy", "rugged", "bridge", "swivel"] as const;

export default function ShopClient() {
  const sp = useSearchParams();

  const [q, setQ] = React.useState("");
  const [selBrands, setBrands] = React.useState<string[]>([]);
  const [selEras, setEras] = React.useState<string[]>([]);
  const [selCond, setCond] = React.useState<string[]>([]);
  const [selForms, setForms] = React.useState<string[]>([]);
  const [selTags, setTags] = React.useState<string[]>([]);
  const [maxPrice, setMax] = React.useState(priceBounds.max);
  const [inStock, setInStock] = React.useState(false);
  const [sort, setSort] = React.useState<Sort>("featured");
  const [cols, setCols] = React.useState<3 | 4>(3);
  const [drawer, setDrawer] = React.useState(false);
  const [sortOpen, setSortOpen] = React.useState(false);

  // hydrate from URL once
  React.useEffect(() => {
    const tag = sp.get("tag");
    const max = sp.get("max");
    const collection = sp.get("collection");
    const brand = sp.get("brand");
    if (tag) setTags([tag]);
    if (max) setMax(Number(max));
    if (brand) setBrands([brand]);
    if (collection === "grails") setTags((t) => Array.from(new Set([...t, "collector"])));
  }, [sp]);

  const grailsMode = sp.get("collection") === "grails";

  const filtered = React.useMemo(() => {
    let out = products.filter((p) => {
      if (grailsMode && !p.badges.includes("rare")) return false;
      if (q) {
        const hay = [p.brand, p.model, p.tagline, p.era, p.condition, ...p.tags].join(" ").toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      if (selBrands.length && !selBrands.includes(p.brand)) return false;
      if (selEras.length && !selEras.includes(p.era)) return false;
      if (selCond.length && !selCond.includes(p.condition)) return false;
      if (selForms.length && !selForms.includes(p.form)) return false;
      if (selTags.length && !selTags.some((t) => p.tags.includes(t))) return false;
      if (p.price > maxPrice) return false;
      if (inStock && p.stock < 1) return false;
      return true;
    });
    const by: Record<Sort, (a: any, b: any) => number> = {
      featured: (a, b) => b.badges.length - a.badges.length || b.rating - a.rating,
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      newest: (a, b) => b.year - a.year,
      oldest: (a, b) => a.year - b.year,
      rating: (a, b) => b.rating - a.rating,
      mp: (a, b) => b.mp - a.mp,
    };
    return [...out].sort(by[sort]);
  }, [q, selBrands, selEras, selCond, selForms, selTags, maxPrice, inStock, sort, grailsMode]);

  const toggle = (arr: string[], set: (v: string[]) => void) => (v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const activeChips = [
    ...selBrands.map((v) => ({ label: v, clear: () => setBrands(selBrands.filter((x) => x !== v)) })),
    ...selEras.map((v) => ({ label: v, clear: () => setEras(selEras.filter((x) => x !== v)) })),
    ...selCond.map((v) => ({ label: v, clear: () => setCond(selCond.filter((x) => x !== v)) })),
    ...selForms.map((v) => ({ label: v, clear: () => setForms(selForms.filter((x) => x !== v)) })),
    ...selTags.map((v) => ({ label: v, clear: () => setTags(selTags.filter((x) => x !== v)) })),
    ...(maxPrice < priceBounds.max ? [{ label: `Under $${maxPrice}`, clear: () => setMax(priceBounds.max) }] : []),
    ...(inStock ? [{ label: "In stock", clear: () => setInStock(false) }] : []),
    ...(q ? [{ label: `“${q}”`, clear: () => setQ("") }] : []),
  ];

  const clearAll = () => {
    setQ(""); setBrands([]); setEras([]); setCond([]); setForms([]); setTags([]);
    setMax(priceBounds.max); setInStock(false);
  };

  const count = (fn: (p: any) => boolean) => products.filter(fn).length;

  const panel = (
    <div>
      <div className="pb-4">
        <input
          value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Filter by keyword…"
          className="h-11 w-full border border-line bg-transparent px-3 text-[13px] outline-none transition-colors placeholder:text-faint focus:border-ink"
        />
      </div>
      <Group title="Price">
        <PriceRange min={priceBounds.min} max={priceBounds.max} value={maxPrice} onChange={setMax} />
      </Group>
      <Group title="Brand">
        <div>
          {brands.map((b) => (
            <Check key={b} label={b} checked={selBrands.includes(b)} onChange={() => toggle(selBrands, setBrands)(b)}
              meta={count((p) => p.brand === b)} />
          ))}
        </div>
      </Group>
      <Group title="Era">
        {eras.filter((e) => count((p) => p.era === e) > 0).map((e) => (
          <Check key={e} label={e} checked={selEras.includes(e)} onChange={() => toggle(selEras, setEras)(e)}
            meta={count((p) => p.era === e)} />
        ))}
      </Group>
      <Group title="Condition">
        {conditions.map((c) => (
          <Check key={c} label={c} checked={selCond.includes(c)} onChange={() => toggle(selCond, setCond)(c)}
            meta={count((p) => p.condition === c)} />
        ))}
      </Group>
      <Group title="Body style" defaultOpen={false}>
        {FORMS.map((f) => (
          <Check key={f} label={f[0].toUpperCase() + f.slice(1)} checked={selForms.includes(f)}
            onChange={() => toggle(selForms, setForms)(f)} meta={count((p) => p.form === f)} />
        ))}
      </Group>
      <Group title="Features" defaultOpen={false}>
        <div className="thin-scroll max-h-[240px] overflow-y-auto pr-1">
          {allTags.map((t) => (
            <Check key={t} label={t} checked={selTags.includes(t)} onChange={() => toggle(selTags, setTags)(t)}
              meta={count((p) => p.tags.includes(t))} />
          ))}
        </div>
      </Group>
      <div className="py-4">
        <Check label="In stock only" checked={inStock} onChange={() => setInStock(!inStock)} />
      </div>
    </div>
  );

  return (
    <div className="shell pt-10">
      <header className="border-b border-line pb-8">
        <p className="label text-accent">{grailsMode ? "Collection" : "All stock"}</p>
        <h1 className="display mt-3 text-[clamp(36px,6vw,68px)]">
          {grailsMode ? "The grail shelf" : "The archive"}
        </h1>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
          {grailsMode
            ? "Bodies that are getting hard to find in working condition. Single units, priced at what the market says."
            : "Twenty-six tested compacts. Filter by what actually matters — the sensor, the era, the way it renders."}
        </p>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[236px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="label text-muted">Refine</span>
              {activeChips.length > 0 && (
                <button onClick={clearAll} className="label text-accent transition-opacity hover:opacity-70">Clear all</button>
              )}
            </div>
            <div className="thin-scroll max-h-[calc(100dvh-190px)] overflow-y-auto pr-1">{panel}</div>
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center gap-3 border-b border-line pb-4">
            <button onClick={() => setDrawer(true)}
              className="flex h-10 items-center gap-2 border border-line px-3 text-[13px] transition-colors hover:border-ink lg:hidden">
              <SlidersHorizontal size={14} /> Filters
              {activeChips.length > 0 && <span className="label rounded-full bg-accent px-1.5 py-[2px] text-[var(--accent-ink)]">{activeChips.length}</span>}
            </button>

            <p className="text-[13px] text-muted">
              <span className="font-medium text-ink tabular-nums">{filtered.length}</span> of {products.length} bodies
            </p>

            <div className="ml-auto flex items-center gap-2">
              <div className="hidden items-center border border-line sm:flex">
                <button onClick={() => setCols(3)} aria-label="Three columns"
                  className={cn("grid h-9 w-9 place-items-center transition-colors", cols === 3 ? "bg-ink/[.08] text-ink" : "text-muted hover:text-ink")}>
                  <Rows3 size={14} />
                </button>
                <button onClick={() => setCols(4)} aria-label="Four columns"
                  className={cn("grid h-9 w-9 place-items-center transition-colors", cols === 4 ? "bg-ink/[.08] text-ink" : "text-muted hover:text-ink")}>
                  <LayoutGrid size={14} />
                </button>
              </div>

              <div className="relative">
                <button onClick={() => setSortOpen(!sortOpen)}
                  className="flex h-9 items-center gap-2 border border-line px-3 text-[13px] transition-colors hover:border-ink">
                  <ArrowUpDown size={13} />
                  <span className="hidden sm:inline">{SORTS.find((s) => s.key === sort)!.label}</span>
                  <span className="sm:hidden">Sort</span>
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-11 z-20 w-[228px] border border-line bg-paper py-1 shadow-[var(--shadow-md)]">
                        {SORTS.map((s) => (
                          <button key={s.key} onClick={() => { setSort(s.key); setSortOpen(false); }}
                            className={cn("block w-full px-3.5 py-2 text-left text-[13px] transition-colors hover:bg-ink/[.05]",
                              sort === s.key ? "text-ink" : "text-muted")}>
                            {s.label}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {activeChips.length > 0 && (
            <div className="flex flex-wrap gap-2 py-4">
              <AnimatePresence initial={false}>
                {activeChips.map((c) => <Chip key={c.label} label={c.label} onRemove={c.clear} />)}
              </AnimatePresence>
              <button onClick={clearAll} className="px-2 text-[12px] text-accent transition-opacity hover:opacity-70">Clear all</button>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center border border-dashed border-line py-24 text-center">
              <p className="text-[17px] font-semibold tracking-[-.02em]">Nothing matches those filters</p>
              <p className="mt-2 max-w-sm text-[13.5px] text-muted">
                Try widening the price range or clearing a brand — stock moves fast and we restock every Thursday.
              </p>
              <Button variant="outline" size="sm" className="mt-5" onClick={clearAll}>Clear all filters</Button>
            </div>
          ) : (
            <motion.div layout
              className={cn("mt-6 grid grid-cols-1 gap-x-6 gap-y-11 sm:grid-cols-2",
                cols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4")}>
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                  <motion.div key={p.slug} layout
                    initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}>
                    <ProductCard p={p} index={i} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* mobile filter drawer */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div className="fixed inset-0 z-[88] bg-black/50 lg:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.div className="fixed inset-y-0 left-0 z-[89] flex w-[min(88vw,340px)] flex-col border-r border-line bg-paper lg:hidden"
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 36 }}>
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <span className="text-[16px] font-semibold">Filters</span>
                <button onClick={() => setDrawer(false)} aria-label="Close"><X size={18} /></button>
              </div>
              <div className="thin-scroll flex-1 overflow-y-auto px-5">{panel}</div>
              <div className="flex gap-2 border-t border-line p-4">
                <Button variant="outline" className="flex-1" onClick={clearAll}>Clear</Button>
                <Button variant="accent" className="flex-1" onClick={() => setDrawer(false)}>Show {filtered.length}</Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
