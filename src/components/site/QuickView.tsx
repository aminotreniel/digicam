"use client";
import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { X, ArrowRight, RotateCw } from "lucide-react";
import CameraArt from "@/components/camera/CameraArt";
import SampleFrame from "@/components/camera/SampleFrame";
import Badge from "@/components/ui/Badge";
import Stars from "@/components/ui/Stars";
import Button from "@/components/ui/Button";
import { badgeMeta } from "@/data/products";
import { useCatalog } from "@/components/CatalogProvider";
import { useCart, useUI } from "@/lib/store";
import { useToast } from "@/components/ui/Toaster";
import { cn, money } from "@/lib/utils";

export default function QuickView() {
  const { bySlug } = useCatalog();
  const slug = useUI((s) => s.quickView);
  const setSlug = useUI((s) => s.setQuickView);
  const add = useCart((s) => s.add);
  const setCartOpen = useCart((s) => s.setOpen);
  const push = useToast((s) => s.push);
  const [ci, setCi] = React.useState(0);
  const [view, setView] = React.useState<"front" | "back">("front");

  const p = slug ? bySlug(slug) : undefined;

  React.useEffect(() => { setCi(0); setView("front"); }, [slug]);
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSlug(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSlug]);

  return (
    <AnimatePresence>
      {p && (
        <>
          <motion.div className="fixed inset-0 z-[92] bg-black/55 backdrop-blur-[3px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }} onClick={() => setSlug(null)} />
          <motion.div
            className="fixed left-1/2 top-1/2 z-[93] w-[min(96vw,940px)] max-h-[88dvh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-line bg-paper shadow-[var(--shadow-lg)]"
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 6 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            role="dialog" aria-label={`${p.brand} ${p.model} quick view`}
          >
            <button onClick={() => setSlug(null)}
              className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-[3px] border border-line bg-paper text-muted transition-colors hover:text-ink"
              aria-label="Close">
              <X size={16} />
            </button>

            <div className="grid md:grid-cols-2">
              <div className="relative border-b border-line bg-paper-2 md:border-b-0 md:border-r"
                style={{ background: `radial-gradient(120% 90% at 30% 15%, ${p.colors[ci].body}1f, transparent 62%)` }}>
                <div className="grid aspect-[4/3] place-items-center px-10">
                  <AnimatePresence mode="wait">
                    <motion.div key={view + ci} className="w-full"
                      initial={{ opacity: 0, rotateY: -18 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: 18 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
                      <CameraArt form={p.form} view={view} body={p.colors[ci].body} bodyDark={p.colors[ci].bodyDark}
                        trim={p.colors[ci].trim} uid={`qv-${p.slug}-${ci}-${view}`} brand={p.brand} model={p.model} />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <button onClick={() => setView(view === "front" ? "back" : "front")}
                  className="absolute bottom-4 left-4 flex h-9 items-center gap-2 rounded-[3px] border border-line bg-paper px-3 text-[12px] transition-colors hover:border-ink/40">
                  <RotateCw size={13} /> {view === "front" ? "See the back" : "See the front"}
                </button>
                <div className="absolute bottom-4 right-4 flex gap-2">
                  {[0, 1].map((i) => (
                    <span key={i} className="h-12 w-16 overflow-hidden border border-line">
                      <SampleFrame look={p.look} seed={p.slug} index={i + 3} year={p.year} showStamp={false} />
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-1.5">
                  {p.badges.map((b) => <Badge key={b} tone={badgeMeta[b].tone}>{badgeMeta[b].label}</Badge>)}
                  <Badge tone="muted">{p.era}</Badge>
                </div>
                <p className="label mt-4 text-muted">{p.brand}</p>
                <h2 className="mt-1 text-[26px] font-extrabold leading-[1.05] tracking-[-.04em]">{p.model}</h2>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{p.tagline}</p>

                <div className="mt-4 flex items-center gap-2">
                  <Stars value={p.rating} size={12} />
                  <span className="text-[12px] text-muted">{p.rating} · {p.reviews} reviews</span>
                </div>

                <div className="mt-5 flex items-baseline gap-3">
                  <span className="text-[28px] font-semibold tabular-nums tracking-[-.035em]">{money(p.price)}</span>
                  {p.compareAt && <span className="text-[14px] text-faint line-through">{money(p.compareAt)}</span>}
                </div>

                <div className="mt-5">
                  <p className="label mb-2 text-muted">Finish — {p.colors[ci].name}</p>
                  <div className="flex gap-2">
                    {p.colors.map((c, i) => (
                      <button key={c.name} onClick={() => setCi(i)} title={c.name}
                        className={cn("h-8 w-8 rounded-full border-2 transition-transform",
                          i === ci ? "scale-110 border-ink" : "border-line hover:scale-105")}
                        style={{ background: `linear-gradient(135deg, ${c.body}, ${c.bodyDark})` }} />
                    ))}
                  </div>
                </div>

                <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-5">
                  {[["Sensor", p.sensor], ["Resolution", `${p.mp} MP`], ["Lens", p.zoom], ["Condition", p.condition]].map(([k, v]) => (
                    <div key={k}>
                      <dt className="label text-faint">{k}</dt>
                      <dd className="mt-0.5 text-[13px]">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 flex gap-2">
                  <Button variant="accent" size="lg" className="flex-1"
                    onClick={() => {
                      add({ slug: p.slug, name: p.model, brand: p.brand, color: p.colors[ci].name, price: p.price,
                        form: p.form, body: p.colors[ci].body, bodyDark: p.colors[ci].bodyDark, trim: p.colors[ci].trim });
                      push({ title: `${p.brand} ${p.model} added`, body: `${p.colors[ci].name} · ${money(p.price)}` });
                      setSlug(null); setCartOpen(true);
                    }}>
                    Add to bag
                  </Button>
                  <Link href={`/product/${p.slug}`} onClick={() => setSlug(null)}
                    className="grid h-14 w-14 place-items-center border border-line transition-colors hover:border-ink"
                    aria-label="Full details">
                    <ArrowRight size={18} />
                  </Link>
                </div>
                <p className="mt-3 text-[11.5px] text-faint">
                  {p.stock <= 2 ? `Only ${p.stock} left in this condition grade.` : "In stock, ships within 48 hours."}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
