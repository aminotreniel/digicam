"use client";
import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import ProductCard from "@/components/shop/ProductCard";
import { useCatalog } from "@/components/CatalogProvider";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "new", label: "New in", filter: (p: any) => p.badges.includes("new-in") || p.badges.includes("restored") },
  { key: "picks", label: "Staff picks", filter: (p: any) => p.badges.includes("staff-pick") },
  { key: "under", label: "Under $180", filter: (p: any) => p.price < 180 },
  { key: "grails", label: "Grails", filter: (p: any) => p.badges.includes("rare") },
];

export default function TabbedGrid() {
  const { products } = useCatalog();
  const [tab, setTab] = React.useState(0);
  const items = products.filter(TABS[tab].filter).slice(0, 8);

  return (
    <section className="mt-28">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-5">
          <div>
            <p className="label text-accent">This week</p>
            <h2 className="display mt-2 text-[clamp(28px,4.4vw,46px)]">On the shelf</h2>
          </div>
          <div className="flex flex-wrap gap-1">
            {TABS.map((t, i) => (
              <button key={t.key} onClick={() => setTab(i)}
                className={cn("relative px-3.5 py-2 text-[13px] transition-colors",
                  i === tab ? "text-ink" : "text-muted hover:text-ink")}>
                {t.label}
                {i === tab && (
                  <motion.span layoutId="tab-underline" className="absolute inset-x-2 -bottom-[21px] h-[2px] bg-accent"
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
                )}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={TABS[tab].key}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 grid grid-cols-1 gap-x-6 gap-y-11 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((p, i) => <ProductCard key={p.slug} p={p} index={i} />)}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
