"use client";
import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { X, Minus, Plus, Trash2, Truck, ShieldCheck } from "lucide-react";
import CameraArt from "@/components/camera/CameraArt";
import Button from "@/components/ui/Button";
import { useCart } from "@/lib/store";
import { cn, money, money2, clamp } from "@/lib/utils";

const FREE_AT = 250;

export default function CartDrawer() {
  const { lines, open, setOpen, setQty, remove } = useCart();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const subtotal = lines.reduce((a, l) => a + l.price * l.qty, 0);
  const progress = clamp((subtotal / FREE_AT) * 100, 0, 100);
  const remaining = Math.max(0, FREE_AT - subtotal);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-black/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[91] flex h-dvh w-[min(94vw,440px)] flex-col border-l border-line bg-paper"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 36 }}
            role="dialog" aria-label="Shopping cart"
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <p className="label text-muted">Your bag</p>
                <p className="text-[17px] font-semibold tracking-[-.02em]">
                  {lines.reduce((a, l) => a + l.qty, 0)} item{lines.reduce((a, l) => a + l.qty, 0) === 1 ? "" : "s"}
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-[3px] text-muted transition-colors hover:text-ink" aria-label="Close cart">
                <X size={18} />
              </button>
            </header>

            {lines.length > 0 && (
              <div className="border-b border-line px-5 py-3.5">
                <div className="mb-2 flex items-center gap-2">
                  <Truck size={13} className="text-muted" />
                  <p className="text-[12px] text-muted">
                    {remaining > 0 ? (
                      <>You&rsquo;re <span className="font-medium text-ink">{money2(remaining)}</span> from free shipping</>
                    ) : (
                      <span className="font-medium text-[var(--lcd)]">Free shipping unlocked</span>
                    )}
                  </p>
                </div>
                <div className="h-[3px] w-full overflow-hidden rounded-full bg-line">
                  <motion.div
                    className="h-full bg-accent"
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            )}

            <div className="thin-scroll flex-1 overflow-y-auto">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
                  <div className="w-40 opacity-45">
                    <CameraArt form="compact" body="#8b8580" bodyDark="#54504c" trim="#c9c3bb" uid="empty" brand="GRAIN" model="—" />
                  </div>
                  <p className="text-[14px] text-muted">Nothing in the bag yet.</p>
                  <Button href="/shop" variant="outline" size="sm" onClick={() => setOpen(false)}>Browse the archive</Button>
                </div>
              ) : (
                <ul>
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li
                        key={l.key}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden border-b border-line"
                      >
                        <div className="flex gap-4 px-5 py-4">
                          <Link href={`/product/${l.slug}`} onClick={() => setOpen(false)}
                            className="grid h-[74px] w-[92px] shrink-0 place-items-center border border-line bg-paper-2 px-2">
                            <CameraArt form={l.form as any} body={l.body} bodyDark={l.bodyDark} trim={l.trim} uid={l.key} brand={l.brand} model={l.name} />
                          </Link>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="label text-muted">{l.brand}</p>
                                <Link href={`/product/${l.slug}`} onClick={() => setOpen(false)}
                                  className="block truncate text-[13.5px] font-medium leading-snug">{l.name}</Link>
                                <p className="mt-0.5 text-[12px] text-faint">{l.color}</p>
                              </div>
                              <button onClick={() => remove(l.key)} className="text-faint transition-colors hover:text-accent" aria-label="Remove">
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between">
                              <div className="flex items-center border border-line">
                                <button onClick={() => setQty(l.key, l.qty - 1)} className="grid h-7 w-7 place-items-center text-muted transition-colors hover:text-ink" aria-label="Decrease">
                                  <Minus size={12} />
                                </button>
                                <span className="w-7 text-center text-[12px] tabular-nums">{l.qty}</span>
                                <button onClick={() => setQty(l.key, l.qty + 1)} className="grid h-7 w-7 place-items-center text-muted transition-colors hover:text-ink" aria-label="Increase">
                                  <Plus size={12} />
                                </button>
                              </div>
                              <span className="text-[13.5px] font-semibold tabular-nums">{money(l.price * l.qty)}</span>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <footer className="border-t border-line px-5 py-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] text-muted">Subtotal</span>
                  <motion.span key={subtotal} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    className="text-[19px] font-semibold tabular-nums tracking-[-.02em]">{money2(subtotal)}</motion.span>
                </div>
                <p className="mt-1 text-[11.5px] text-faint">Taxes and duties calculated at checkout.</p>
                <Button href="/checkout" variant="accent" size="lg" className="mt-4 w-full" onClick={() => setOpen(false)}>
                  Checkout
                </Button>
                <button onClick={() => setOpen(false)} className="mt-2 w-full py-2 text-[12.5px] text-muted transition-colors hover:text-ink">
                  Continue shopping
                </button>
                <div className="mt-3 flex items-center justify-center gap-1.5 border-t border-line pt-3">
                  <ShieldCheck size={12} className="text-[var(--lcd)]" />
                  <span className="label text-faint">90-day function guarantee on every body</span>
                </div>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
