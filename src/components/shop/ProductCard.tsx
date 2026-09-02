"use client";
import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Heart, Eye, Plus, GitCompareArrows } from "lucide-react";
import CameraArt from "@/components/camera/CameraArt";
import Badge from "@/components/ui/Badge";
import Stars from "@/components/ui/Stars";
import { badgeMeta, type Product } from "@/data/products";
import { useCart, useSaved, useUI, useCompare } from "@/lib/store";
import { useToast } from "@/components/ui/Toaster";
import { cn, money } from "@/lib/utils";

export default function ProductCard({ p, index = 0, dense = false }: { p: Product; index?: number; dense?: boolean }) {
  const [ci, setCi] = React.useState(0);
  const color = p.colors[ci];

  const add = useCart((s) => s.add);
  const setCartOpen = useCart((s) => s.setOpen);
  const toggleSave = useSaved((s) => s.toggle);
  const savedList = useSaved((s) => s.saved);
  const compare = useCompare((s) => s.items);
  const toggleCompare = useCompare((s) => s.toggle);
  const setQuickView = useUI((s) => s.setQuickView);
  const push = useToast((s) => s.push);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const isSaved = mounted && savedList.includes(p.slug);
  const inCompare = mounted && compare.includes(p.slug);

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    add({
      slug: p.slug, name: p.model, brand: p.brand, color: color.name, price: p.price,
      form: p.form, body: color.body, bodyDark: color.bodyDark, trim: color.trim,
    });
    push({ title: `${p.brand} ${p.model} added`, body: `${color.name} · ${money(p.price)}` });
    setCartOpen(true);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6%" }}
      transition={{ duration: 0.6, delay: Math.min(index, 7) * 0.045, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col"
    >
      <Link href={`/product/${p.slug}`} className="block">
        <div
          className="reticle relative aspect-[4/3] overflow-hidden border border-line bg-paper-2 transition-colors duration-300 group-hover:border-ink/25"
        >
          {/* backdrop wash */}
          <div
            className="absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: `radial-gradient(120% 90% at 30% 12%, ${color.body}22, transparent 62%)` }}
          />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <div className="flex flex-wrap gap-1">
              {p.badges.slice(0, 2).map((b) => (
                <Badge key={b} tone={badgeMeta[b].tone}>{badgeMeta[b].label}</Badge>
              ))}
            </div>
            <span className="label rounded-[2px] bg-ink/[.06] px-1.5 py-1 tabular-nums text-muted backdrop-blur-sm">
              {p.year}
            </span>
          </div>

          {/* camera */}
          <div
            className="absolute inset-0 grid place-items-center px-[8%] py-[6%]"
          >
            <CameraArt
              form={p.form} body={color.body} bodyDark={color.bodyDark} trim={color.trim}
              brand={p.brand} model={p.model} uid={`${p.slug}-${ci}`}
            />
          </div>

          {/* hover actions */}
          <div className="pointer-events-none absolute inset-x-3 bottom-3 flex translate-y-3 items-center gap-2 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={quickAdd}
              className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[3px] bg-accent text-[12px] font-medium text-[var(--accent-ink)] shadow-[var(--shadow-sm)] transition-transform active:scale-95"
            >
              <Plus size={14} /> Add — {money(p.price)}
            </button>
            <button
              onClick={(e) => { e.preventDefault(); setQuickView(p.slug); }}
              className="grid h-9 w-9 place-items-center rounded-[3px] border border-white/25 bg-black/45 text-white backdrop-blur-md transition-transform active:scale-95"
              aria-label="Quick view"
            >
              <Eye size={14} />
            </button>
          </div>

          {/* save / compare */}
          <div className="absolute right-3 top-11 flex flex-col gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              onClick={(e) => { e.preventDefault(); toggleSave(p.slug); }}
              className={cn(
                "grid h-8 w-8 place-items-center rounded-[3px] border backdrop-blur-md transition-colors",
                isSaved ? "border-accent bg-accent text-[var(--accent-ink)]" : "border-line bg-paper/70 text-ink hover:border-ink/40"
              )}
              aria-label={isSaved ? "Remove from saved" : "Save"}
            >
              <Heart size={13} fill={isSaved ? "currentColor" : "none"} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); toggleCompare(p.slug); }}
              className={cn(
                "grid h-8 w-8 place-items-center rounded-[3px] border backdrop-blur-md transition-colors",
                inCompare ? "border-ink bg-ink text-paper" : "border-line bg-paper/70 text-ink hover:border-ink/40"
              )}
              aria-label="Compare"
            >
              <GitCompareArrows size={13} />
            </button>
          </div>
        </div>
      </Link>

      <div className={cn("flex flex-1 flex-col pt-3", dense && "pt-2")}>
        <div className="flex items-baseline justify-between gap-3">
          <span className="label text-muted">{p.brand}</span>
          <span className="label text-faint">{p.mp}MP · {p.condition}</span>
        </div>
        <Link href={`/product/${p.slug}`} className="mt-1 block">
          <h3 className="text-[15px] font-semibold leading-snug tracking-[-.015em] link-slide inline">
            {p.model}
          </h3>
        </Link>
        {!dense && <p className="mt-1 line-clamp-1 text-[12.5px] leading-relaxed text-muted">{p.tagline}</p>}

        <div className="mt-2.5 flex items-center gap-2">
          <Stars value={p.rating} />
          <span className="label text-faint">{p.reviews}</span>
          <span className="ml-auto flex items-baseline gap-1.5">
            {p.compareAt && <span className="text-[12px] text-faint line-through">{money(p.compareAt)}</span>}
            <span className="text-[15px] font-semibold tabular-nums tracking-[-.02em]">{money(p.price)}</span>
          </span>
        </div>

        {p.colors.length > 1 && (
          <div className="mt-3 flex items-center gap-1.5">
            {p.colors.map((c, i) => (
              <button
                key={c.name}
                onMouseEnter={() => setCi(i)}
                onFocus={() => setCi(i)}
                onClick={(e) => { e.preventDefault(); setCi(i); }}
                title={c.name}
                aria-label={c.name}
                className={cn(
                  "h-4 w-4 rounded-full border transition-transform duration-200",
                  i === ci ? "scale-110 border-ink" : "border-line hover:scale-110"
                )}
                style={{ background: `linear-gradient(135deg, ${c.body}, ${c.bodyDark})` }}
              />
            ))}
            <span className="label ml-1 text-faint">{color.name}</span>
          </div>
        )}
      </div>
    </motion.article>
  );
}
