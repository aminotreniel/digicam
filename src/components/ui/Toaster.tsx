"use client";
import * as React from "react";
import { create } from "zustand";
import { AnimatePresence, motion } from "motion/react";
import { Check, X, Info } from "lucide-react";

type Toast = { id: number; title: string; body?: string; tone?: "ok" | "info" };
type S = { toasts: Toast[]; push: (t: Omit<Toast, "id">) => void; dismiss: (id: number) => void };

let n = 0;
export const useToast = create<S>((set) => ({
  toasts: [],
  push: (t) => {
    const id = ++n;
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })), 3600);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

export default function Toaster() {
  const { toasts, dismiss } = useToast();
  return (
    <div className="fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 flex-col items-center gap-2 px-4 sm:left-auto sm:right-5 sm:translate-x-0 sm:items-end">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-[min(92vw,360px)] items-start gap-3 border border-line bg-paper-2 px-4 py-3 shadow-[var(--shadow-md)]"
          >
            <span className={t.tone === "info" ? "mt-[2px] text-muted" : "mt-[2px] text-[var(--lcd)]"}>
              {t.tone === "info" ? <Info size={15} /> : <Check size={15} />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium leading-tight">{t.title}</p>
              {t.body && <p className="mt-1 text-[12px] leading-snug text-muted">{t.body}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} className="text-faint transition-colors hover:text-ink" aria-label="Dismiss">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
