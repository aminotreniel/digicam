"use client";
import * as React from "react";
import { ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn, money } from "@/lib/utils";

export function Group({
  title, count, children, defaultOpen = true,
}: { title: string; count?: number; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="border-b border-line py-4">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-left">
        <span className="label text-ink">{title}{count ? ` (${count})` : ""}</span>
        <ChevronDown size={14} className={cn("text-muted transition-transform duration-300", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-3.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Check({
  label, checked, onChange, meta,
}: { label: string; checked: boolean; onChange: () => void; meta?: string | number }) {
  return (
    <button onClick={onChange} className="group flex w-full items-center gap-2.5 py-[5px] text-left">
      <span className={cn(
        "grid h-[15px] w-[15px] shrink-0 place-items-center border transition-colors",
        checked ? "border-accent bg-accent" : "border-line group-hover:border-ink/50"
      )}>
        {checked && (
          <motion.svg width="9" height="9" viewBox="0 0 10 10" initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <path d="M1 5 L4 8 L9 2" fill="none" stroke="var(--accent-ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        )}
      </span>
      <span className={cn("flex-1 text-[13px] transition-colors", checked ? "text-ink" : "text-muted group-hover:text-ink")}>{label}</span>
      {meta !== undefined && <span className="label text-faint">{meta}</span>}
    </button>
  );
}

export function PriceRange({
  min, max, value, onChange,
}: { min: number; max: number; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[13px] text-muted">Up to</span>
        <span className="text-[14px] font-semibold tabular-nums">{money(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={5} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full"
        aria-label="Maximum price"
      />
      <div className="mt-1.5 flex justify-between">
        <span className="label text-faint">{money(min)}</span>
        <span className="label text-faint">{money(max)}</span>
      </div>
    </div>
  );
}

export function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.22 }}
      onClick={onRemove}
      className="flex items-center gap-1.5 border border-line px-2.5 py-1.5 text-[12px] transition-colors hover:border-ink"
    >
      {label}
      <X size={11} className="text-muted" />
    </motion.button>
  );
}
