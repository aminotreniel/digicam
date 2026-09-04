"use client";
import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import SampleFrame from "@/components/camera/SampleFrame";
import CameraArt from "@/components/camera/CameraArt";
import { useCatalog } from "@/components/CatalogProvider";
import { cn, money } from "@/lib/utils";

const LOOKS = [
  { key: "flash", scene: 2, name: "Hard flash", blurb: "Direct light, cut-out shadows, that unmistakable night-out look.", slugs: ["fujifilm-finepix-z10fd", "casio-exilim-ex-z75", "canon-ixus-70"] },
  { key: "warm", scene: 0, name: "Warm skin", blurb: "Kodak-adjacent colour science. Everybody looks like they slept well.", slugs: ["kodak-easyshare-v550", "canon-powershot-sd1100", "nikon-coolpix-l18"] },
  { key: "lowlight", scene: 1, name: "Low light", blurb: "Big sensors, clean high ISO, usable after sunset without a flash.", slugs: ["fujifilm-finepix-f31fd", "panasonic-lumix-dmc-lx3", "canon-powershot-g9"] },
  { key: "cold", scene: 3, name: "Cold & clean", blurb: "Neutral, contrasty, slightly clinical. Good for architecture and water.", slugs: ["olympus-stylus-720sw", "pentax-optio-w30", "nikon-coolpix-s6"] },
  { key: "crunch", scene: 4, name: "Low-res crunch", blurb: "Three to five megapixels. Soft, grainy, absolutely of its moment.", slugs: ["minolta-dimage-x", "olympus-camedia-c-3040", "contax-tvs-digital"] },
];

export default function LookSelector() {
  const { products } = useCatalog();
  const [active, setActive] = React.useState(0);
  const look = LOOKS[active];
  const picks = look.slugs.map((s) => products.find((p) => p.slug === s)!).filter(Boolean);
  const hero = picks[0];

  return (
    <section className="mt-28 border-y border-line bg-paper-2/50">
      <div className="shell py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="label text-accent">Start from the photo, not the spec sheet</p>
            <h2 className="display mt-3 text-[clamp(30px,5vw,54px)]">
              Pick a look.<br />We&rsquo;ll pick the body<span className="text-accent">.</span>
            </h2>
          </div>
          <p className="max-w-sm text-[14px] leading-relaxed text-muted">
            Every sensor and lens combination renders differently. Choose the
            character you want and we&rsquo;ll show you the three cameras that get closest.
          </p>
        </div>

        <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-1">
          {LOOKS.map((l, i) => (
            <button
              key={l.key}
              onClick={() => setActive(i)}
              className={cn(
                "relative shrink-0 border px-4 py-2.5 text-[13px] transition-colors",
                i === active ? "border-ink text-ink" : "border-line text-muted hover:border-ink/40 hover:text-ink"
              )}
            >
              {i === active && (
                <motion.span layoutId="look-pill" className="absolute inset-0 -z-10 bg-ink/[.06]"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
              )}
              {l.name}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <div className="relative overflow-hidden border border-line">
            <AnimatePresence mode="wait">
              <motion.div key={look.key}
                initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
                <SampleFrame look={hero.look} seed={`${look.key}-hero`} index={2} year={hero.year} scene={look.scene} showStamp={false} className="w-full" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 pt-16">
              <p className="label text-white/70">{hero.brand} {hero.model} · {hero.look.name}</p>
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-white">{look.blurb}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {picks.map((p, i) => (
              <motion.div key={`${look.key}-${p.slug}`}
                initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}>
                <Link href={`/product/${p.slug}`}
                  className="group flex items-center gap-4 border border-line bg-paper p-3 transition-colors hover:border-ink/40">
                  <span className="grid h-[72px] w-[96px] shrink-0 place-items-center border border-line bg-paper-2 px-2">
                    <CameraArt form={p.form} body={p.colors[0].body} bodyDark={p.colors[0].bodyDark}
                      trim={p.colors[0].trim} uid={`ls-${look.key}-${p.slug}`} brand={p.brand} model={p.model} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="label block text-muted">{p.brand} · {p.year}</span>
                    <span className="mt-0.5 block truncate text-[14px] font-medium">{p.model}</span>
                    <span className="mt-1 block text-[12px] text-faint">{p.sensor} · {p.mp}MP</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-[14px] font-semibold tabular-nums">{money(p.price)}</span>
                    <ArrowRight size={15} className="ml-auto mt-2 text-muted transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            ))}
            <Link href="/looks" className="mt-1 flex items-center justify-between border border-dashed border-line p-4 text-[13px] transition-colors hover:border-ink">
              <span>See the full gallery of looks</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
