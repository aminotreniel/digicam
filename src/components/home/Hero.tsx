"use client";
import * as React from "react";
import Link from "next/link";
import {
  motion, useMotionValue, useSpring, useTransform, AnimatePresence, useReducedMotion,
} from "motion/react";
import { ArrowDown, Camera, RotateCw } from "lucide-react";
import CameraArt from "@/components/camera/CameraArt";
import SampleFrame from "@/components/camera/SampleFrame";
import Button from "@/components/ui/Button";
import { products } from "@/data/products";
import { cn, money } from "@/lib/utils";

const HERO = ["canon-ixus-70", "panasonic-lumix-dmc-lx3", "fujifilm-finepix-z10fd", "olympus-stylus-720sw"]
  .map((s) => products.find((p) => p.slug === s)!)
  .filter(Boolean);

const ANNOTATIONS = [
  { top: "24%", left: "6%",  label: "CCD sensor", value: "1/1.7 in" },
  { top: "62%", left: "2%",  label: "Optical zoom", value: "3×" },
  { top: "18%", right: "4%", label: "Xenon flash", value: "auto" },
  { top: "70%", right: "7%", label: "Grade", value: "Excellent" },
];

export default function Hero() {
  const reduce = useReducedMotion();
  const [pi, setPi] = React.useState(0);
  const [ci, setCi] = React.useState(0);
  const [view, setView] = React.useState<"front" | "back">("front");
  const [flash, setFlash] = React.useState(false);
  const [roll, setRoll] = React.useState<number[]>([0, 1, 2]);
  const [frameNo, setFrameNo] = React.useState(3);

  const p = HERO[pi];
  const color = p.colors[Math.min(ci, p.colors.length - 1)];

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 120, damping: 18 });
  const tx = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 90, damping: 20 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const shoot = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 240);
    setRoll((r) => [frameNo, ...r].slice(0, 4));
    setFrameNo((n) => n + 1);
  };

  React.useEffect(() => { setCi(0); }, [pi]);

  return (
    <section className="relative overflow-hidden">
      {/* soft field */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-18%] h-[560px] w-[900px] -translate-x-1/2 rounded-full opacity-[.5]"
          style={{ background: `radial-gradient(closest-side, ${color.body}33, transparent 72%)`, transition: "background 700ms" }} />
        <div className="absolute inset-0"
          style={{ backgroundImage: "linear-gradient(var(--line-soft) 1px, transparent 1px), linear-gradient(90deg, var(--line-soft) 1px, transparent 1px)", backgroundSize: "72px 72px", opacity: 0.5,
            maskImage: "radial-gradient(70% 60% at 50% 35%, #000, transparent)", WebkitMaskImage: "radial-gradient(70% 60% at 50% 35%, #000, transparent)" }} />
      </div>

      <div className="shell pb-8 pt-12 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          {/* ---- copy ---- */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 border border-line px-2.5 py-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent blink" />
              <span className="label text-muted">26 bodies in stock · restocked Thursdays</span>
            </motion.div>

            <h1 className="display mt-6 text-[clamp(48px,8.4vw,104px)]">
              {["The digicam", "archive."].map((line, li) => (
                <span key={li} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={reduce ? false : { y: "104%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: 0.06 + li * 0.09, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {li === 1 ? (
                      <>archive<span className="text-accent">.</span></>
                    ) : line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-md text-[15px] leading-relaxed text-muted"
            >
              Compact digital cameras from 2001 to 2012 — the era of hard flash, warm
              skin and honest grain. Every body tested, cleaned and{" "}
              <span className="editorial text-ink">sold with a real warranty.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button href="/shop" variant="accent" size="lg">Shop the archive</Button>
              <Button href="/looks" variant="outline" size="lg">See the looks</Button>
            </motion.div>

            <motion.dl
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.55 }}
              className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-6"
            >
              {[["26", "bodies in stock"], ["90", "day warranty"], ["48h", "dispatch"]].map(([n, l]) => (
                <div key={l}>
                  <dt className="text-[26px] font-extrabold tabular-nums tracking-[-.05em]">{n}</dt>
                  <dd className="label mt-1 text-faint">{l}</dd>
                </div>
              ))}
            </motion.dl>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.7 }}
              className="mt-10 hidden lg:block"
            >
              <p className="label text-faint">Brands on the shelf</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {["Canon", "Sony", "Nikon", "Olympus", "Fujifilm", "Panasonic", "Casio", "Ricoh", "Contax", "Leica", "Minolta", "Pentax", "Kodak", "Samsung"].map((b) => (
                  <span key={b} className="text-[12.5px] text-muted transition-colors hover:text-ink">{b}</span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ---- interactive stage ---- */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
              onMouseMove={onMove}
              onMouseLeave={() => { mx.set(0); my.set(0); }}
              style={{ perspective: 1200 }}
            >
              <div className="relative aspect-[4/2.85] border border-line bg-paper-2/60 backdrop-blur-sm">
                {/* corner reticles */}
                {[["top-3 left-3", "border-t border-l"], ["top-3 right-3", "border-t border-r"],
                  ["bottom-3 left-3", "border-b border-l"], ["bottom-3 right-3", "border-b border-r"]].map(([pos, b], i) => (
                  <span key={i} className={cn("absolute h-4 w-4 border-accent/60", pos, b)} />
                ))}

                {/* EXIF annotations */}
                {ANNOTATIONS.map((a, i) => (
                  <motion.div
                    key={a.label}
                    className="absolute hidden md:block"
                    style={{ top: a.top, left: (a as any).left, right: (a as any).right }}
                    initial={{ opacity: 0, x: (a as any).left ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.7 + i * 0.1 }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-[1px] w-6 bg-line" />
                      <div>
                        <p className="label text-faint">{a.label}</p>
                        <p className="text-[12px] font-medium tabular-nums">
                          {a.label === "Optical zoom" ? p.zoom.split(" ")[0] : a.label === "Sensor" ? p.sensor : a.label === "Grade" ? p.condition : a.value}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  className="grid h-full place-items-center px-[13%]"
                  style={{ rotateX: rx, rotateY: ry, x: tx, transformStyle: "preserve-3d" }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${p.slug}-${ci}-${view}`}
                      className="w-full"
                      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -14, filter: "blur(8px)" }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <CameraArt
                        form={p.form} view={view} body={color.body} bodyDark={color.bodyDark}
                        trim={color.trim} brand={p.brand} model={p.model} uid={`hero-${p.slug}-${ci}-${view}`}
                      />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                {/* flash overlay */}
                <AnimatePresence>
                  {flash && (
                    <motion.div className="pointer-events-none absolute inset-0 bg-white"
                      initial={{ opacity: 0 }} animate={{ opacity: 0.92 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }} />
                  )}
                </AnimatePresence>

                {/* stage controls */}
                <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-center gap-2">
                  <button onClick={shoot}
                    className="flex h-9 items-center gap-2 rounded-[3px] bg-accent px-3 text-[12px] font-medium text-[var(--accent-ink)] transition-transform active:scale-95">
                    <Camera size={13} /> Fire the shutter
                  </button>
                  <button onClick={() => setView(view === "front" ? "back" : "front")}
                    className="flex h-9 items-center gap-2 rounded-[3px] border border-line bg-paper px-3 text-[12px] transition-colors hover:border-ink/40">
                    <RotateCw size={13} /> {view === "front" ? "Back" : "Front"}
                  </button>
                  <div className="ml-auto flex items-center gap-1.5 rounded-[3px] border border-line bg-paper px-2 py-1.5">
                    {p.colors.map((c, i) => (
                      <button key={c.name} onClick={() => setCi(i)} title={c.name} aria-label={c.name}
                        className={cn("h-4 w-4 rounded-full border transition-transform",
                          i === ci ? "scale-110 border-ink" : "border-line hover:scale-110")}
                        style={{ background: `linear-gradient(135deg, ${c.body}, ${c.bodyDark})` }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* caption strip */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="label text-faint">Now showing</p>
                  <Link href={`/product/${p.slug}`} className="link-slide text-[14px] font-medium">
                    {p.brand} {p.model} — {money(p.price)}
                  </Link>
                </div>
                <div className="flex gap-1.5">
                  {HERO.map((h, i) => (
                    <button key={h.slug} onClick={() => setPi(i)} aria-label={h.model}
                      className={cn("h-1.5 rounded-full transition-all duration-300",
                        i === pi ? "w-7 bg-accent" : "w-1.5 bg-line hover:bg-muted")} />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* the roll — frames captured by the shutter button */}
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <p className="label text-faint">The roll — {roll.length} frame{roll.length === 1 ? "" : "s"}</p>
                <p className="label text-faint">{p.look.name}</p>
              </div>
              <div className="mt-2 flex gap-2">
                <AnimatePresence initial={false} mode="popLayout">
                  {roll.map((n) => (
                    <motion.div
                      key={`${p.slug}-${n}`}
                      layout
                      initial={{ opacity: 0, y: -22, scale: 0.85, rotate: -4 }}
                      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="w-[23%] overflow-hidden border border-line bg-paper-2 p-1"
                    >
                      <SampleFrame look={p.look} seed={p.slug} index={n} year={p.year} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex items-center gap-3 text-faint">
          <ArrowDown size={13} className="animate-bounce" />
          <span className="label">Scroll — this week&rsquo;s selection</span>
          <span className="h-[1px] flex-1 bg-line" />
        </div>
      </div>
    </section>
  );
}
