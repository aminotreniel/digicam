"use client";
import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Aperture } from "lucide-react";
import SampleFrame from "@/components/camera/SampleFrame";
import CameraArt from "@/components/camera/CameraArt";
import Reveal from "@/components/ui/Reveal";
import { useCatalog } from "@/components/CatalogProvider";
import { cn, money } from "@/lib/utils";

const SCENES = ["Horizon", "Night", "Flash", "Interior", "Street"];

export default function LooksPage() {
  const { products } = useCatalog();
  const [scene, setScene] = React.useState<number | null>(null);
  const [active, setActive] = React.useState(0);
  const p = products[active];

  const grid = products.slice(0, 18);

  return (
    <div className="pt-10">
      <div className="shell">
        <header className="border-b border-line pb-8">
          <p className="label text-accent">The gallery</p>
          <h1 className="display mt-3 text-[clamp(34px,6vw,68px)]">
            Every body renders<br />the world differently<span className="text-accent">.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted">
            Twenty-six sensors, twenty-six sets of colour science. These frames are generated
            from each camera&rsquo;s measured response — contrast, highlight roll-off, bloom and
            shadow tint — so you can judge the look before you buy the body.
          </p>
        </header>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="label mr-2 text-muted">Scene</span>
          <button onClick={() => setScene(null)}
            className={cn("border px-3.5 py-2 text-[12.5px] transition-colors",
              scene === null ? "border-ink bg-ink/[.06]" : "border-line text-muted hover:border-ink/40 hover:text-ink")}>
            Mixed
          </button>
          {SCENES.map((s, i) => (
            <button key={s} onClick={() => setScene(i)}
              className={cn("border px-3.5 py-2 text-[12.5px] transition-colors",
                scene === i ? "border-ink bg-ink/[.06]" : "border-line text-muted hover:border-ink/40 hover:text-ink")}>
              {s}
            </button>
          ))}
        </div>

        {/* feature */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_.85fr]">
          <div className="relative overflow-hidden border border-line">
            <AnimatePresence mode="wait">
              <motion.div key={`${p.slug}-${scene}`}
                initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                <SampleFrame look={p.look} seed={`${p.slug}-feature`} index={2} year={p.year} scene={scene ?? undefined} showStamp={false} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex flex-col justify-between border border-line p-7">
            <div>
              <p className="label flex items-center gap-2 text-accent"><Aperture size={12} /> {p.look.name}</p>
              <h2 className="display mt-3 text-[clamp(24px,3vw,34px)]">{p.brand} {p.model}</h2>
              <p className="mt-4 text-[14px] leading-relaxed text-muted">{p.story}</p>
              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-5">
                {[["Sensor", p.sensor], ["Lens", p.zoom], ["Contrast", `${p.look.contrast.toFixed(2)}×`], ["Bloom", `${Math.round(p.look.bloom * 100)}%`]].map(([k, v]) => (
                  <div key={k}>
                    <dt className="label text-faint">{k}</dt>
                    <dd className="mt-1 text-[13px]">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="mt-7 flex items-center gap-3 border-t border-line pt-6">
              <span className="grid h-16 w-20 place-items-center border border-line bg-paper-2 px-2">
                <CameraArt form={p.form} body={p.colors[0].body} bodyDark={p.colors[0].bodyDark} trim={p.colors[0].trim}
                  brand={p.brand} model={p.model} uid={`lk-${p.slug}`} seed={p.slug} />
              </span>
              <span className="flex-1">
                <span className="block text-[17px] font-semibold tabular-nums">{money(p.price)}</span>
                <span className="label block text-faint">{p.condition} · {p.mp}MP</span>
              </span>
              <Link href={`/product/${p.slug}`}
                className="flex h-11 items-center gap-2 bg-accent px-5 text-[13px] font-medium text-[var(--accent-ink)]">
                View <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* contact sheet */}
        <div className="mt-16 border-t border-line pt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="display text-[clamp(24px,3.4vw,36px)]">Contact sheet</h2>
            <p className="text-[13px] text-muted">Click any frame to load that body above</p>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {grid.map((g, i) => (
              <Reveal key={g.slug} delay={(i % 6) * 0.04}>
                <button onClick={() => { setActive(products.indexOf(g)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className={cn("group block w-full border bg-paper p-1.5 text-left transition-all duration-300 hover:-translate-y-1",
                    products[active].slug === g.slug ? "border-accent" : "border-line hover:border-ink/40")}>
                  <SampleFrame look={g.look} seed={`${g.slug}-sheet`} index={i} year={g.year} scene={scene ?? undefined} />
                  <span className="mt-2 flex items-baseline justify-between gap-2 px-0.5 pb-0.5">
                    <span className="label truncate text-muted group-hover:text-ink">{g.brand}</span>
                    <span className="label shrink-0 text-faint">{g.look.name}</span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
