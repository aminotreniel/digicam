"use client";
import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Check, ArrowLeft, ArrowRight, Lock, Truck, Zap, CreditCard, Package } from "lucide-react";
import CameraArt from "@/components/camera/CameraArt";
import Button from "@/components/ui/Button";
import { useCart } from "@/lib/store";
import { cn, money2 } from "@/lib/utils";

const STEPS = ["Contact", "Delivery", "Payment"] as const;

function Field({
  label, value, onChange, placeholder, type = "text", error, className, ...rest
}: any) {
  return (
    <label className={cn("block", className)}>
      <span className="label text-muted">{label}</span>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className={cn(
          "mt-2 h-12 w-full border bg-transparent px-3 text-[14px] outline-none transition-colors placeholder:text-faint",
          error ? "border-accent" : "border-line focus:border-ink"
        )}
        {...rest}
      />
      <AnimatePresence>
        {error && (
          <motion.span initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 block text-[11.5px] text-accent">{error}</motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}

const SHIPPING = [
  { id: "standard", icon: Truck, name: "Standard", eta: "4–6 business days", price: 12, note: "Free on orders over $250" },
  { id: "express", icon: Zap, name: "Express", eta: "2 business days", price: 18, note: "Tracked, signature on delivery" },
  { id: "courier", icon: Package, name: "Same-week courier", eta: "Thu or Fri this week", price: 34, note: "Selected metro areas" },
];

export default function CheckoutPage() {
  const { lines, clear } = useCart();
  const [mounted, setMounted] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [ship, setShip] = React.useState("standard");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [f, setF] = React.useState({
    email: "", first: "", last: "", address: "", city: "", zip: "", country: "United States",
    card: "", exp: "", cvc: "", name: "",
  });
  React.useEffect(() => setMounted(true), []);
  const set = (k: string) => (v: string) => setF((s) => ({ ...s, [k]: v }));

  const subtotal = lines.reduce((a, l) => a + l.price * l.qty, 0);
  const shipCost = ship === "standard" && subtotal >= 250 ? 0 : SHIPPING.find((s) => s.id === ship)!.price;
  const tax = subtotal * 0.08;
  const total = subtotal + shipCost + tax;
  const orderNo = React.useMemo(() => `GR-${Math.floor(100000 + Math.random() * 899999)}`, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!f.email.includes("@")) e.email = "Enter a valid email address";
      if (!f.first.trim()) e.first = "Required";
      if (!f.last.trim()) e.last = "Required";
    }
    if (step === 1) {
      if (!f.address.trim()) e.address = "Required";
      if (!f.city.trim()) e.city = "Required";
      if (!f.zip.trim()) e.zip = "Required";
    }
    if (step === 2) {
      if (f.card.replace(/\s/g, "").length < 15) e.card = "Enter a 16-digit card number";
      if (!/^\d{2}\/\d{2}$/.test(f.exp)) e.exp = "MM/YY";
      if (f.cvc.length < 3) e.cvc = "3 digits";
      if (!f.name.trim()) e.name = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    if (step < 2) setStep(step + 1);
    else { setDone(true); window.scrollTo({ top: 0, behavior: "smooth" }); setTimeout(() => clear(), 400); }
  };

  if (!mounted) return <div className="shell py-24"><div className="skeleton h-8 w-48" /></div>;

  if (done) {
    return (
      <div className="shell grid place-items-center py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="max-w-lg text-center">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 14 }}
            className="mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-[var(--lcd)] text-[var(--lcd)]">
            <Check size={28} />
          </motion.span>
          <h1 className="display mt-8 text-[clamp(32px,5vw,52px)]">Order confirmed</h1>
          <p className="label mt-4 text-accent">{orderNo}</p>
          <p className="mt-5 text-[15px] leading-relaxed text-muted">
            We&rsquo;ve sent a confirmation to <span className="text-ink">{f.email || "your inbox"}</span>. Each body
            gets one final bench check before it&rsquo;s packed, so tracking usually lands within 48 hours.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button href="/shop" variant="accent" size="lg">Keep browsing</Button>
            <Button href="/" variant="outline" size="lg">Back home</Button>
          </div>
          <p className="mt-10 text-[11.5px] text-faint">
            This is a demo storefront — no payment was processed and nothing will ship.
          </p>
        </motion.div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="shell py-24">
        <h1 className="display text-[clamp(30px,5vw,52px)]">Your bag is empty</h1>
        <p className="mt-4 max-w-md text-[15px] text-muted">Add a body before checking out.</p>
        <Button href="/shop" variant="accent" size="lg" className="mt-7">Browse the archive</Button>
      </div>
    );
  }

  return (
    <div className="shell pt-10">
      <Link href="/cart" className="flex items-center gap-2 text-[13px] text-muted transition-colors hover:text-ink">
        <ArrowLeft size={14} /> Back to bag
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          {/* stepper */}
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <button onClick={() => i < step && setStep(i)}
                  className={cn("flex items-center gap-2.5", i <= step ? "text-ink" : "text-faint")}>
                  <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[11px] tabular-nums transition-colors",
                    i < step ? "border-[var(--lcd)] bg-[var(--lcd)] text-[var(--paper)]" :
                    i === step ? "border-accent text-accent" : "border-line")}>
                    {i < step ? <Check size={13} /> : i + 1}
                  </span>
                  <span className="hidden text-[13px] sm:inline">{s}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <span className="relative h-[1px] flex-1 bg-line">
                    <motion.span className="absolute inset-y-0 left-0 bg-accent" initial={false}
                      animate={{ width: i < step ? "100%" : "0%" }} transition={{ duration: 0.45 }} />
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="mt-10 min-h-[380px]">
            <AnimatePresence mode="wait">
              <motion.div key={step}
                initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
                {step === 0 && (
                  <div>
                    <h2 className="display text-[clamp(24px,3.4vw,34px)]">Where do we send it?</h2>
                    <div className="mt-7 grid gap-5 sm:grid-cols-2">
                      <Field className="sm:col-span-2" label="Email" value={f.email} onChange={set("email")}
                        placeholder="you@email.com" type="email" error={errors.email} />
                      <Field label="First name" value={f.first} onChange={set("first")} placeholder="Jordan" error={errors.first} />
                      <Field label="Last name" value={f.last} onChange={set("last")} placeholder="Reyes" error={errors.last} />
                    </div>
                    <label className="mt-6 flex cursor-pointer items-center gap-2.5">
                      <span className="grid h-[15px] w-[15px] place-items-center border border-accent bg-accent">
                        <Check size={10} className="text-[var(--accent-ink)]" />
                      </span>
                      <span className="text-[13px] text-muted">Email me when new stock drops on Thursdays</span>
                    </label>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h2 className="display text-[clamp(24px,3.4vw,34px)]">Delivery</h2>
                    <div className="mt-7 grid gap-5 sm:grid-cols-2">
                      <Field className="sm:col-span-2" label="Street address" value={f.address} onChange={set("address")}
                        placeholder="140 Wilder Street, Apt 4" error={errors.address} />
                      <Field label="City" value={f.city} onChange={set("city")} placeholder="Portland" error={errors.city} />
                      <Field label="Postal code" value={f.zip} onChange={set("zip")} placeholder="97209" error={errors.zip} />
                      <Field className="sm:col-span-2" label="Country" value={f.country} onChange={set("country")} />
                    </div>

                    <p className="label mt-9 text-muted">Shipping method</p>
                    <div className="mt-3 space-y-2">
                      {SHIPPING.map((s) => {
                        const price = s.id === "standard" && subtotal >= 250 ? 0 : s.price;
                        return (
                          <button key={s.id} onClick={() => setShip(s.id)}
                            className={cn("flex w-full items-center gap-4 border p-4 text-left transition-colors",
                              ship === s.id ? "border-ink bg-ink/[.04]" : "border-line hover:border-ink/40")}>
                            <span className={cn("grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                              ship === s.id ? "border-accent" : "border-line")}>
                              {ship === s.id && <span className="h-2 w-2 rounded-full bg-accent" />}
                            </span>
                            <s.icon size={16} className="shrink-0 text-muted" />
                            <span className="min-w-0 flex-1">
                              <span className="block text-[14px] font-medium">{s.name} — {s.eta}</span>
                              <span className="block text-[12px] text-muted">{s.note}</span>
                            </span>
                            <span className="shrink-0 text-[13.5px] font-medium tabular-nums">
                              {price === 0 ? <span className="text-[var(--lcd)]">Free</span> : money2(price)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="display text-[clamp(24px,3.4vw,34px)]">Payment</h2>
                    <p className="mt-3 flex items-center gap-2 text-[12.5px] text-muted">
                      <Lock size={12} className="text-[var(--lcd)]" /> Demo checkout — no card is charged and nothing is stored.
                    </p>
                    <div className="mt-7 grid gap-5 sm:grid-cols-2">
                      <Field className="sm:col-span-2" label="Card number" value={f.card}
                        onChange={(v: string) => set("card")(v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim())}
                        placeholder="4242 4242 4242 4242" inputMode="numeric" error={errors.card} />
                      <Field label="Expiry" value={f.exp}
                        onChange={(v: string) => {
                          const d = v.replace(/\D/g, "").slice(0, 4);
                          set("exp")(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
                        }}
                        placeholder="04/29" inputMode="numeric" error={errors.exp} />
                      <Field label="CVC" value={f.cvc}
                        onChange={(v: string) => set("cvc")(v.replace(/\D/g, "").slice(0, 4))}
                        placeholder="123" inputMode="numeric" error={errors.cvc} />
                      <Field className="sm:col-span-2" label="Name on card" value={f.name} onChange={set("name")}
                        placeholder="Jordan Reyes" error={errors.name} />
                    </div>
                    <div className="mt-6 flex items-center gap-2 border border-line px-4 py-3">
                      <CreditCard size={15} className="text-muted" />
                      <span className="text-[12.5px] text-muted">Visa · Mastercard · Amex · Apple Pay accepted</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center gap-3 border-t border-line pt-7">
            {step > 0 && (
              <Button variant="outline" size="lg" onClick={() => setStep(step - 1)}>
                <ArrowLeft size={15} /> Back
              </Button>
            )}
            <Button variant="accent" size="lg" className="flex-1 sm:flex-none sm:min-w-[240px]" onClick={next}>
              {step === 2 ? `Pay ${money2(total)}` : "Continue"} <ArrowRight size={15} />
            </Button>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-line p-6">
            <p className="label text-muted">{lines.reduce((a, l) => a + l.qty, 0)} item{lines.reduce((a, l) => a + l.qty, 0) === 1 ? "" : "s"} in this order</p>
            <ul className="mt-5 space-y-4">
              {lines.map((l) => (
                <li key={l.key} className="flex gap-3.5">
                  <span className="relative grid h-[62px] w-[80px] shrink-0 place-items-center border border-line bg-paper-2 px-1.5">
                    <CameraArt form={l.form as any} body={l.body} bodyDark={l.bodyDark} trim={l.trim}
                      uid={`co-${l.key}`} seed={l.slug} brand={l.brand} model={l.name} />
                    <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] tabular-nums text-paper">{l.qty}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="label block text-muted">{l.brand}</span>
                    <span className="block truncate text-[13px] font-medium">{l.name}</span>
                    <span className="block text-[11.5px] text-faint">{l.color}</span>
                  </span>
                  <span className="shrink-0 text-[13px] tabular-nums">{money2(l.price * l.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-2.5 border-t border-line pt-5 text-[13px]">
              <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="tabular-nums">{money2(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Shipping</dt>
                <dd className="tabular-nums">{shipCost === 0 ? <span className="text-[var(--lcd)]">Free</span> : money2(shipCost)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Tax</dt><dd className="tabular-nums">{money2(tax)}</dd></div>
            </dl>
            <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
              <span className="text-[14px] font-medium">Total</span>
              <span className="text-[24px] font-semibold tabular-nums tracking-[-.03em]">{money2(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
