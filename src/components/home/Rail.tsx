"use client";
import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import type { Product } from "@/data/products";

export default function Rail({
  title, kicker, href, items,
}: { title: string; kicker: string; href: string; items: Product[] }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = React.useState(true);
  const [atEnd, setAtEnd] = React.useState(false);

  const check = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  React.useEffect(() => { check(); }, [check]);

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(680, el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section className="mt-24">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
          <div>
            <p className="label text-accent">{kicker}</p>
            <h2 className="display mt-2 text-[clamp(28px,4.4vw,46px)]">{title}</h2>
          </div>
          <div className="flex items-center gap-3">
            <Link href={href} className="link-slide text-[13px] text-muted transition-colors hover:text-ink">
              View all
            </Link>
            <div className="flex gap-1.5">
              <button onClick={() => scrollBy(-1)} disabled={atStart} aria-label="Scroll left"
                className="grid h-9 w-9 place-items-center border border-line transition-colors hover:border-ink disabled:opacity-30">
                <ArrowLeft size={15} />
              </button>
              <button onClick={() => scrollBy(1)} disabled={atEnd} aria-label="Scroll right"
                className="grid h-9 w-9 place-items-center border border-line transition-colors hover:border-ink disabled:opacity-30">
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div ref={ref} onScroll={check}
        className="no-scrollbar rail-pad mt-8 flex snap-x gap-6 overflow-x-auto pb-2">
        {items.map((p, i) => (
          <div key={p.slug} className="w-[80vw] shrink-0 snap-start sm:w-[46vw] lg:w-[30vw] xl:w-[23vw]">
            <ProductCard p={p} index={i} />
          </div>
        ))}
        <div className="w-[80vw] shrink-0 snap-start sm:w-[46vw] lg:w-[30vw] xl:w-[23vw]">
          <Link href={href}
            className="group flex aspect-[4/3] flex-col items-start justify-end border border-dashed border-line p-6 transition-colors hover:border-ink">
            <ArrowRight size={22} className="mb-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            <p className="text-[19px] font-semibold leading-tight tracking-[-.03em]">Browse the full archive</p>
            <p className="mt-1.5 text-[13px] text-muted">26 tested bodies, filtered any way you like.</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
