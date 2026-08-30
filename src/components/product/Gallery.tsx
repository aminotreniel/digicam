"use client";
import * as React from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { Maximize2, RotateCw, X } from "lucide-react";
import CameraArt from "@/components/camera/CameraArt";
import SampleFrame from "@/components/camera/SampleFrame";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

type Shot = { kind: "cam"; view: "front" | "back" } | { kind: "frame"; index: number };

export default function Gallery({ p, ci }: { p: Product; ci: number }) {
  const shots: Shot[] = [
    { kind: "cam", view: "front" },
    { kind: "cam", view: "back" },
    { kind: "frame", index: 1 },
    { kind: "frame", index: 2 },
    { kind: "frame", index: 3 },
  ];
  const [i, setI] = React.useState(0);
  const [zoom, setZoom] = React.useState(false);
  const reduce = useReducedMotion();
  const c = p.colors[ci];

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 130, damping: 18 });
  const rY = useSpring(useTransform(mx, [-0.5, 0.5], [-13, 13]), { stiffness: 130, damping: 18 });

  const shot = shots[i];

  React.useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setI((v) => (v + 1) % shots.length);
      if (e.key === "ArrowLeft") setI((v) => (v - 1 + shots.length) % shots.length);
      if (e.key === "Escape") setZoom(false);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [shots.length]);

  return (
    <div>
      <div
        className="relative overflow-hidden border border-line"
        style={{
          background: `radial-gradient(110% 85% at 32% 14%, ${c.body}26, transparent 62%), var(--paper-2)`,
          perspective: 1200,
        }}
        onMouseMove={(e) => {
          if (reduce) return;
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onMouseLeave={() => { mx.set(0); my.set(0); }}
      >
        <div className="aspect-[4/3]">
          <AnimatePresence mode="wait">
            {shot.kind === "cam" ? (
              <motion.div key={`cam-${shot.view}-${ci}`}
                className="grid h-full place-items-center px-[10%]"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ rotateX: rX, rotateY: rY, transformStyle: "preserve-3d" }}>
                <CameraArt form={p.form} view={shot.view} body={c.body} bodyDark={c.bodyDark} trim={c.trim}
                  brand={p.brand} model={p.model} uid={`pdp-${p.slug}-${ci}-${shot.view}`} seed={p.slug} />
              </motion.div>
            ) : (
              <motion.div key={`frame-${shot.index}`} className="h-full w-full"
                initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                <SampleFrame look={p.look} seed={p.slug} index={shot.index} year={p.year} showStamp={false} className="h-full w-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="pointer-events-none absolute left-4 top-4">
          <span className="label rounded-[2px] border border-line bg-paper/80 px-2 py-1 text-muted backdrop-blur-sm">
            {shot.kind === "cam" ? `${shot.view === "front" ? "Front" : "Rear"} · ${c.name}` : `Sample frame · ${p.look.name}`}
          </span>
        </div>

        <div className="absolute right-4 top-4 flex gap-2">
          {shot.kind === "cam" && (
            <button
              onClick={() => setI(shot.view === "front" ? 1 : 0)}
              className="grid h-9 w-9 place-items-center border border-line bg-paper/80 text-ink backdrop-blur-sm transition-colors hover:border-ink"
              aria-label="Flip camera">
              <RotateCw size={14} />
            </button>
          )}
          <button onClick={() => setZoom(true)}
            className="grid h-9 w-9 place-items-center border border-line bg-paper/80 text-ink backdrop-blur-sm transition-colors hover:border-ink"
            aria-label="Expand">
            <Maximize2 size={14} />
          </button>
        </div>

        <span className="label pointer-events-none absolute bottom-4 right-4 text-faint">
          {String(i + 1).padStart(2, "0")} / {String(shots.length).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2">
        {shots.map((s, idx) => (
          <button key={idx} onClick={() => setI(idx)}
            className={cn("relative aspect-[4/3] overflow-hidden border transition-colors",
              idx === i ? "border-ink" : "border-line hover:border-ink/40")}>
            {s.kind === "cam" ? (
              <span className="grid h-full place-items-center px-2"
                style={{ background: `linear-gradient(160deg, ${c.body}1f, transparent)` }}>
                <CameraArt form={p.form} view={s.view} body={c.body} bodyDark={c.bodyDark} trim={c.trim}
                  brand={p.brand} model={p.model} uid={`th-${p.slug}-${ci}-${idx}`} seed={p.slug} />
              </span>
            ) : (
              <SampleFrame look={p.look} seed={p.slug} index={s.index} year={p.year} showStamp={false} className="h-full w-full" />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {zoom && (
          <motion.div className="fixed inset-0 z-[94] grid place-items-center bg-black/85 p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setZoom(false)}>
            <button className="absolute right-6 top-6 grid h-10 w-10 place-items-center border border-white/25 text-white" aria-label="Close">
              <X size={18} />
            </button>
            <motion.div className="w-[min(96vw,1100px)]"
              initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}>
              {shot.kind === "cam" ? (
                <CameraArt form={p.form} view={shot.view} body={c.body} bodyDark={c.bodyDark} trim={c.trim}
                  brand={p.brand} model={p.model} uid={`zoom-${p.slug}-${ci}`} seed={p.slug} />
              ) : (
                <SampleFrame look={p.look} seed={p.slug} index={shot.index} year={p.year} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
