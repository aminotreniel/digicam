"use client";
import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart, GitCompareArrows, Minus, Plus, ShieldCheck, Truck, RotateCcw,
  ChevronRight, ThumbsUp, BadgeCheck, Package, AlertTriangle,
} from "lucide-react";
import Gallery from "@/components/product/Gallery";
import SampleFrame from "@/components/camera/SampleFrame";
import ProductCard from "@/components/shop/ProductCard";
import Badge from "@/components/ui/Badge";
import Stars from "@/components/ui/Stars";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { badgeMeta, type Product } from "@/data/products";
import type { Review } from "@/data/reviews";
import { useCatalog } from "@/components/CatalogProvider";
import { useCart, useSaved, useCompare } from "@/lib/store";
import { useToast } from "@/components/ui/Toaster";
import { cn, money } from "@/lib/utils";

const SPEC_GROUPS = (p: Product) => [
  { title: "Imaging", rows: [["Sensor", p.sensor], ["Effective pixels", `${p.mp} megapixels`], ["ISO range", p.iso], ["Lens", p.zoom]] },
  { title: "Body", rows: [["Screen", p.screen], ["Weight", `${p.weight} g`], ["Dimensions", p.dims], ["Body style", p.form[0].toUpperCase() + p.form.slice(1)]] },
  { title: "Storage & power", rows: [["Media", p.media], ["Battery", p.battery], ["Video", p.video], ["Released", String(p.year)]] },
];

export default function ProductClient({ p, reviews }: { p: Product; reviews: Review[] }) {
  const { products } = useCatalog();
  const [ci, setCi] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const [tab, setTab] = React.useState<"story" | "specs" | "box">("story");
  const c = p.colors[ci];

  const add = useCart((s) => s.add);
  const setCartOpen = useCart((s) => s.setOpen);
  const savedList = useSaved((s) => s.saved);
  const toggleSave = useSaved((s) => s.toggle);
  const compare = useCompare((s) => s.items);
  const toggleCompare = useCompare((s) => s.toggle);
  const push = useToast((s) => s.push);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const isSaved = mounted && savedList.includes(p.slug);
  const inCompare = mounted && compare.includes(p.slug);

  // Reviews are read from Firestore on the server and passed in as a prop.
  const related = products
    .filter((x) => x.slug !== p.slug && (x.brand === p.brand || x.tags.some((t) => p.tags.includes(t))))
    .slice(0, 4);

  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    pct: star === 5 ? 68 : star === 4 ? 21 : star === 3 ? 7 : star === 2 ? 3 : 1,
  }));

  return (
    <div className="pt-8">
      <div className="shell">
        <nav className="flex items-center gap-1.5 text-[12px] text-muted">
          <Link href="/" className="transition-colors hover:text-ink">Home</Link>
          <ChevronRight size={12} className="text-faint" />
          <Link href="/shop" className="transition-colors hover:text-ink">Shop</Link>
          <ChevronRight size={12} className="text-faint" />
          <Link href={`/shop?brand=${p.brand}`} className="transition-colors hover:text-ink">{p.brand}</Link>
          <ChevronRight size={12} className="text-faint" />
          <span className="text-ink">{p.model}</span>
        </nav>

        <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] xl:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Gallery p={p} ci={ci} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              {p.badges.map((b) => <Badge key={b} tone={badgeMeta[b].tone}>{badgeMeta[b].label}</Badge>)}
              <Badge tone="muted">{p.era}</Badge>
            </div>

            <p className="label mt-5 text-muted">{p.brand}</p>
            <h1 className="display mt-2 text-[clamp(30px,4.6vw,52px)]">{p.model}</h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">{p.tagline}</p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Stars value={p.rating} size={13} />
              <span className="text-[13px] text-muted">{p.rating.toFixed(1)}</span>
              <a href="#reviews" className="link-slide text-[13px] text-muted transition-colors hover:text-ink">
                {p.reviews} reviews
              </a>
              <span className="text-faint">·</span>
              <span className="flex items-center gap-1.5 text-[13px] text-[var(--lcd)]">
                <BadgeCheck size={14} /> Bench tested
              </span>
            </div>

            <div className="mt-7 flex items-end gap-3 border-t border-line pt-7">
              <span className="text-[34px] font-semibold tabular-nums leading-none tracking-[-.04em]">{money(p.price)}</span>
              {p.compareAt && (
                <>
                  <span className="mb-1 text-[15px] text-faint line-through">{money(p.compareAt)}</span>
                  <span className="mb-1 text-[13px] font-medium text-accent">
                    Save {money(p.compareAt - p.price)}
                  </span>
                </>
              )}
            </div>
            <p className="mt-1.5 text-[12.5px] text-muted">
              Condition <span className="text-ink">{p.condition}</span> · includes battery, charger and a memory card
            </p>

            <div className="mt-7">
              <div className="flex items-baseline justify-between">
                <p className="label text-muted">Finish</p>
                <p className="text-[12.5px] text-ink">{c.name}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {p.colors.map((col, i) => (
                  <button key={col.name} onClick={() => setCi(i)} title={col.name}
                    className={cn("group relative h-11 w-11 rounded-full border-2 transition-transform",
                      i === ci ? "scale-105 border-ink" : "border-line hover:scale-105 hover:border-ink/40")}
                    style={{ background: `linear-gradient(135deg, ${col.body}, ${col.bodyDark})` }}
                    aria-label={col.name}>
                    {col.stock <= 1 && (
                      <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-paper bg-accent" />
                    )}
                  </button>
                ))}
              </div>
              <p className="mt-2.5 text-[12px] text-muted">
                {c.stock <= 1
                  ? <span className="text-accent">Final unit in {c.name.toLowerCase()}.</span>
                  : `${c.stock} available in ${c.name.toLowerCase()}.`}
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-stretch gap-2.5">
              <div className="flex h-14 items-center border border-line">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-full w-11 place-items-center text-muted transition-colors hover:text-ink" aria-label="Decrease quantity">
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-[14px] tabular-nums">{qty}</span>
                <button onClick={() => setQty(Math.min(c.stock, qty + 1))} className="grid h-full w-11 place-items-center text-muted transition-colors hover:text-ink" aria-label="Increase quantity">
                  <Plus size={14} />
                </button>
              </div>

              <Button variant="accent" size="lg" className="min-w-[200px] flex-1"
                onClick={() => {
                  add({ slug: p.slug, name: p.model, brand: p.brand, color: c.name, price: p.price,
                    form: p.form, body: c.body, bodyDark: c.bodyDark, trim: c.trim }, qty);
                  push({ title: `${p.brand} ${p.model} added`, body: `${c.name} · ${money(p.price * qty)}` });
                  setCartOpen(true);
                }}>
                Add to bag — {money(p.price * qty)}
              </Button>

              <button onClick={() => toggleSave(p.slug)} aria-label="Save"
                className={cn("grid h-14 w-14 place-items-center border transition-colors",
                  isSaved ? "border-accent bg-accent text-[var(--accent-ink)]" : "border-line hover:border-ink")}>
                <Heart size={17} fill={isSaved ? "currentColor" : "none"} />
              </button>
              <button onClick={() => toggleCompare(p.slug)} aria-label="Compare"
                className={cn("grid h-14 w-14 place-items-center border transition-colors",
                  inCompare ? "border-ink bg-ink text-paper" : "border-line hover:border-ink")}>
                <GitCompareArrows size={17} />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-3">
              {[[ShieldCheck, "90-day warranty"], [Truck, "Free over $250"], [RotateCcw, "14-day returns"]].map(([Icon, t]: any, i) => (
                <div key={i} className="flex items-center gap-2.5 bg-paper px-4 py-3.5">
                  <Icon size={15} className="shrink-0 text-muted" />
                  <span className="text-[12.5px]">{t}</span>
                </div>
              ))}
            </div>

            {/* tabs */}
            <div className="mt-10">
              <div className="flex gap-1 border-b border-line">
                {([["story", "The story"], ["specs", "Specifications"], ["box", "In the box"]] as const).map(([k, label]) => (
                  <button key={k} onClick={() => setTab(k)}
                    className={cn("relative px-4 py-3 text-[13px] transition-colors", tab === k ? "text-ink" : "text-muted hover:text-ink")}>
                    {label}
                    {tab === k && <motion.span layoutId="pdp-tab" className="absolute inset-x-3 -bottom-[1px] h-[2px] bg-accent"
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} />}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={tab}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="pt-6">
                  {tab === "story" && (
                    <div className="space-y-5">
                      <p className="text-[15px] leading-relaxed">{p.story}</p>
                      <div>
                        <p className="label text-muted">Rendering character</p>
                        <p className="mt-2 text-[14px] leading-relaxed text-muted">
                          We describe this body&rsquo;s look as <span className="editorial text-ink">{p.look.name}</span>.
                          The sample frames on this page are rendered to match it.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {p.tags.map((t) => (
                          <Link key={t} href={`/shop?tag=${encodeURIComponent(t)}`}>
                            <Badge tone="muted" className="transition-colors hover:border-ink hover:text-ink">{t}</Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {tab === "specs" && (
                    <div className="space-y-7">
                      {SPEC_GROUPS(p).map((g) => (
                        <div key={g.title}>
                          <p className="label text-muted">{g.title}</p>
                          <dl className="mt-3">
                            {g.rows.map(([k, v]) => (
                              <div key={k} className="flex items-baseline justify-between gap-6 border-b border-line py-2.5">
                                <dt className="text-[13px] text-muted">{k}</dt>
                                <dd className="text-right text-[13px]">{v}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      ))}
                    </div>
                  )}

                  {tab === "box" && (
                    <div className="space-y-7">
                      <div>
                        <p className="label flex items-center gap-2 text-muted"><Package size={13} /> What ships with it</p>
                        <ul className="mt-3">
                          {p.includes.map((x) => (
                            <li key={x} className="flex items-center gap-2.5 border-b border-line py-2.5 text-[13.5px]">
                              <span className="h-1 w-1 rounded-full bg-[var(--lcd)]" />{x}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="label flex items-center gap-2 text-accent"><AlertTriangle size={13} /> What we&rsquo;d flag</p>
                        <ul className="mt-3">
                          {p.quirks.map((x) => (
                            <li key={x} className="flex items-start gap-2.5 border-b border-line py-2.5 text-[13.5px] text-muted">
                              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />{x}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-3 text-[12px] text-faint">
                          We list every flaw we find. If something turns up that isn&rsquo;t here, it goes back for free.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* sample frames */}
      <section className="mt-24 border-y border-line bg-paper-2/40">
        <div className="shell py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label text-accent">Rendered in {p.look.name}</p>
              <h2 className="display mt-2 text-[clamp(26px,4vw,42px)]">Shot on the {p.model}</h2>
            </div>
            <p className="max-w-sm text-[13px] leading-relaxed text-muted">
              Synthetic reference frames generated from this body&rsquo;s measured colour response —
              contrast, bloom and highlight roll-off matched to the real sensor.
            </p>
          </div>
          <div className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <Reveal key={n} delay={n * 0.05}>
                <div className="border border-line bg-paper p-1.5 transition-transform duration-300 hover:-translate-y-1">
                  <SampleFrame look={p.look} seed={`${p.slug}-gallery`} index={n} year={p.year} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* reviews */}
      <section id="reviews" className="shell mt-24 scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[300px_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="label text-accent">Owner reports</p>
            <h2 className="display mt-2 text-[clamp(26px,3.6vw,40px)]">{p.rating.toFixed(1)} / 5</h2>
            <Stars value={p.rating} size={15} className="mt-3" />
            <p className="mt-2 text-[13px] text-muted">Based on {p.reviews} verified purchases</p>
            <div className="mt-6 space-y-2">
              {dist.map((d) => (
                <div key={d.star} className="flex items-center gap-3">
                  <span className="label w-6 text-faint">{d.star}★</span>
                  <span className="relative h-[3px] flex-1 bg-line">
                    <motion.span className="absolute inset-y-0 left-0 bg-[var(--gold)]"
                      initial={{ width: 0 }} whileInView={{ width: `${d.pct}%` }} viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} />
                  </span>
                  <span className="label w-8 text-right text-faint">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-px">
            {reviews.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.04}>
                <article className="border-b border-line py-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <Stars value={r.rating} size={12} />
                    <span className="text-[13.5px] font-medium">{r.title}</span>
                    <span className="label ml-auto text-faint">{r.date}</span>
                  </div>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted">{r.body}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="text-[12.5px] font-medium">{r.name}</span>
                    {r.verified && (
                      <span className="label flex items-center gap-1 text-[var(--lcd)]"><BadgeCheck size={11} /> Verified</span>
                    )}
                    <span className="label ml-auto flex items-center gap-1.5 text-faint">
                      <ThumbsUp size={11} /> {r.helpful} found this helpful
                    </span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="shell mt-24">
          <div className="border-b border-line pb-5">
            <p className="label text-accent">Also worth a look</p>
            <h2 className="display mt-2 text-[clamp(26px,4vw,42px)]">Related bodies</h2>
          </div>
          <div className="mt-9 grid grid-cols-1 gap-x-6 gap-y-11 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r, i) => <ProductCard key={r.slug} p={r} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
