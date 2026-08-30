"use client";
import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, Trash2, ArrowRight, Tag, Check } from "lucide-react";
import CameraArt from "@/components/camera/CameraArt";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/shop/ProductCard";
import { useCart } from "@/lib/store";
import { useToast } from "@/components/ui/Toaster";
import { products } from "@/data/products";
import { money2, clamp } from "@/lib/utils";

const CODES: Record<string, number> = { GRAIN10: 0.1, FIRSTROLL: 0.15 };

export default function CartPage() {
  const { lines, setQty, remove } = useCart();
  const push = useToast((s) => s.push);
  const [mounted, setMounted] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [applied, setApplied] = React.useState<string | null>(null);
  React.useEffect(() => setMounted(true), []);

  const subtotal = lines.reduce((a, l) => a + l.price * l.qty, 0);
  const discount = applied ? subtotal * CODES[applied] : 0;
  const shipping = subtotal - discount >= 250 || subtotal === 0 ? 0 : 12;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  const suggestions = products.filter((p) => !lines.some((l) => l.slug === p.slug)).slice(0, 4);

  if (!mounted) return <div className="shell py-24"><div className="skeleton h-8 w-48" /></div>;

  return (
    <div className="shell pt-10">
      <header className="border-b border-line pb-8">
        <p className="label text-accent">Your bag</p>
        <h1 className="display mt-3 text-[clamp(34px,5.5vw,60px)]">
          {lines.length === 0 ? "Nothing here yet" : `${lines.reduce((a, l) => a + l.qty, 0)} in the bag`}
        </h1>
      </header>

      {lines.length === 0 ? (
        <div className="py-16">
          <p className="max-w-md text-[15px] leading-relaxed text-muted">
            Your bag is empty. Twenty-six tested bodies are sitting on the shelf waiting —
            start with the ones our bench team picked this week.
          </p>
          <Button href="/shop" variant="accent" size="lg" className="mt-7">Browse the archive</Button>
          <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-11 sm:grid-cols-2 lg:grid-cols-4">
            {suggestions.map((p, i) => <ProductCard key={p.slug} p={p} index={i} />)}
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <AnimatePresence initial={false}>
              {lines.map((l) => (
                <motion.div key={l.key} layout
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden border-b border-line">
                  <div className="flex flex-col gap-5 py-6 sm:flex-row">
                    <Link href={`/product/${l.slug}`}
                      className="grid aspect-[4/3] w-full shrink-0 place-items-center border border-line bg-paper-2 px-4 sm:w-[190px]">
                      <CameraArt form={l.form as any} body={l.body} bodyDark={l.bodyDark} trim={l.trim}
                        uid={`cart-${l.key}`} seed={l.slug} brand={l.brand} model={l.name} />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="label text-muted">{l.brand}</p>
                          <Link href={`/product/${l.slug}`} className="link-slide mt-1 block text-[18px] font-semibold tracking-[-.02em]">
                            {l.name}
                          </Link>
                          <p className="mt-1.5 text-[13px] text-muted">{l.color}</p>
                        </div>
                        <span className="text-[17px] font-semibold tabular-nums">{money2(l.price * l.qty)}</span>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-5">
                        <div className="flex items-center border border-line">
                          <button onClick={() => setQty(l.key, l.qty - 1)} className="grid h-10 w-10 place-items-center text-muted hover:text-ink" aria-label="Decrease"><Minus size={13} /></button>
                          <span className="w-8 text-center text-[13px] tabular-nums">{l.qty}</span>
                          <button onClick={() => setQty(l.key, l.qty + 1)} className="grid h-10 w-10 place-items-center text-muted hover:text-ink" aria-label="Increase"><Plus size={13} /></button>
                        </div>
                        <button onClick={() => { remove(l.key); push({ title: `${l.name} removed`, tone: "info" }); }}
                          className="flex items-center gap-1.5 text-[12.5px] text-muted transition-colors hover:text-accent">
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="mt-16">
              <p className="label text-accent">Pairs well with</p>
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-11 sm:grid-cols-2 lg:grid-cols-4">
                {suggestions.map((p, i) => <ProductCard key={p.slug} p={p} index={i} dense />)}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-line p-6">
              <p className="label text-muted">Order summary</p>

              <div className="mt-5 flex gap-2">
                <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Discount code"
                  className="h-11 w-full border border-line bg-transparent px-3 text-[13px] outline-none placeholder:text-faint focus:border-ink" />
                <button
                  onClick={() => {
                    if (CODES[code]) { setApplied(code); push({ title: `${code} applied`, body: `${CODES[code] * 100}% off your order` }); }
                    else push({ title: "That code isn't valid", body: "Try GRAIN10 or FIRSTROLL", tone: "info" });
                  }}
                  className="h-11 shrink-0 border border-line px-4 text-[12.5px] transition-colors hover:border-ink">
                  Apply
                </button>
              </div>
              {applied && (
                <p className="mt-2 flex items-center gap-1.5 text-[12px] text-[var(--lcd)]">
                  <Check size={12} /> {applied} — {CODES[applied] * 100}% off
                </p>
              )}
              {!applied && <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-faint"><Tag size={11} /> Try GRAIN10</p>}

              <dl className="mt-6 space-y-3 border-t border-line pt-5 text-[13.5px]">
                <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="tabular-nums">{money2(subtotal)}</dd></div>
                {discount > 0 && (
                  <div className="flex justify-between text-accent"><dt>Discount</dt><dd className="tabular-nums">−{money2(discount)}</dd></div>
                )}
                <div className="flex justify-between"><dt className="text-muted">Shipping</dt>
                  <dd className="tabular-nums">{shipping === 0 ? <span className="text-[var(--lcd)]">Free</span> : money2(shipping)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">Estimated tax</dt><dd className="tabular-nums">{money2(tax)}</dd></div>
              </dl>

              <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
                <span className="text-[14px] font-medium">Total</span>
                <motion.span key={total} initial={{ y: -5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  className="text-[24px] font-semibold tabular-nums tracking-[-.03em]">{money2(total)}</motion.span>
              </div>

              {shipping > 0 && (
                <div className="mt-4">
                  <div className="h-[3px] w-full overflow-hidden bg-line">
                    <motion.div className="h-full bg-accent" initial={false}
                      animate={{ width: `${clamp((subtotal / 250) * 100, 0, 100)}%` }}
                      transition={{ duration: 0.5 }} />
                  </div>
                  <p className="mt-2 text-[11.5px] text-muted">{money2(250 - subtotal)} more for free shipping</p>
                </div>
              )}

              <Button href="/checkout" variant="accent" size="lg" className="mt-6 w-full">
                Checkout <ArrowRight size={16} />
              </Button>
              <Link href="/shop" className="mt-3 block py-1 text-center text-[12.5px] text-muted transition-colors hover:text-ink">
                Continue shopping
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
