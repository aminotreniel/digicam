import Link from "next/link";
import { ArrowRight, Wrench, ShieldCheck, Truck, Recycle, Microscope, HandCoins } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import CameraArt from "@/components/camera/CameraArt";

export const metadata = { title: "About — GRAIN Digicam Archive" };

const FAQ = [
  { q: "What does the 90-day warranty cover?", a: "Any functional failure that isn't caused by impact or liquid. We repair first, replace second, refund third. Cosmetic wear listed on the product page isn't covered because you already knew about it." },
  { q: "Do I need a special memory card?", a: "Sometimes. xD-Picture Card, Memory Stick, SmartMedia and CompactFlash are all obsolete — so we include a working card with every body that needs one, plus a USB reader where the format needs it." },
  { q: "Will the battery still hold charge?", a: "Every battery is cycled and its capacity logged before shipping. Anything under 70% of rated capacity gets replaced with a fresh cell." },
  { q: "Can I return it if I don't like the look?", a: "Fourteen days, no questions, provided it comes back in the condition it left. Shipping back is on you unless the body was misdescribed." },
  { q: "How does trade-in work?", a: "Send photos, we quote store credit within 48 hours, you post it with a prepaid label. If it fails the bench test we recycle it for parts and still credit you a token amount." },
  { q: "Are these cameras actually better than my phone?", a: "No. They're worse in almost every measurable way, and that's the point — the limitations are what produce the look." },
];

const STEPS = [
  { icon: HandCoins, t: "Sourced", d: "We buy from estate lots, camera fairs, and trade-ins. Roughly one in four bodies we look at is worth listing." },
  { icon: Microscope, t: "Bench tested", d: "Eight-point functional test. Shutter count, sensor scan, screen scan, flash output, battery capacity, every port and every zoom step." },
  { icon: Wrench, t: "Serviced", d: "Contacts cleaned, sensors dusted, seals replaced on waterproof bodies, tired batteries swapped for fresh cells." },
  { icon: ShieldCheck, t: "Graded", d: "Four grades, defined publicly, applied harshly. Every flaw we find goes on the product page before it goes in the box." },
  { icon: Truck, t: "Packed", d: "Foam-lined, double-boxed, dispatched within 48 hours with a charger, a working memory card and a printed quick-start." },
  { icon: Recycle, t: "Recycled", d: "Bodies that fail the bench test are stripped for parts so the next repair doesn't need a new donor." },
];

export default function AboutPage() {
  return (
    <div className="pt-10">
      <div className="shell">
        <header className="grid gap-10 border-b border-line pb-14 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="label text-accent">About</p>
            <h1 className="display mt-3 text-[clamp(36px,6.4vw,76px)]">
              A working archive,<br />not a junk drawer<span className="text-accent">.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-muted">
              GRAIN is a fictional storefront built as a UI demonstration. The premise: a small
              workshop that buys, tests, services and resells compact digital cameras from
              2001 to 2012 — the era whose limitations turned out to be a look worth keeping.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/shop" variant="accent" size="lg">Browse the archive</Button>
              <Button href="/looks" variant="outline" size="lg">See the looks</Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {[["canon", "#D9D6D0", "#A9A5A0", "#6E6A66"], ["fuji", "#DE5C86", "#AC3B60", "#57192E"]].map(([k, a, b, c], i) => (
              <div key={k} className="grid aspect-[4/3] place-items-center border border-line bg-paper-2 px-8">
                <CameraArt form={i === 0 ? "compact" : "slim"} body={a} bodyDark={b} trim={c}
                  brand={i === 0 ? "Canon" : "Fujifilm"} model="—" uid={`about-${k}`} seed={k} />
              </div>
            ))}
          </div>
        </header>

        <section className="mt-20">
          <p className="label text-accent">The process</p>
          <h2 className="display mt-3 text-[clamp(28px,4.6vw,50px)]">From a shoebox to your shelf</h2>
          <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.t} delay={i * 0.05}>
                <div className="h-full bg-paper p-7">
                  <div className="flex items-center justify-between">
                    <s.icon size={18} className="text-accent" />
                    <span className="label text-faint">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="mt-5 text-[16px] font-semibold tracking-[-.02em]">{s.t}</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-24 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="label text-accent">Questions</p>
            <h2 className="display mt-3 text-[clamp(28px,4.6vw,50px)]">The honest FAQ</h2>
            <p className="mt-5 text-[14px] leading-relaxed text-muted">
              Including the one where we tell you these cameras are technically worse than the
              phone already in your pocket.
            </p>
          </div>
          <div>
            {FAQ.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.04}>
                <details className="group border-b border-line py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                    <span className="text-[15.5px] font-medium tracking-[-.01em]">{f.q}</span>
                    <span className="grid h-6 w-6 shrink-0 place-items-center border border-line text-muted transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3.5 max-w-2xl text-[14px] leading-relaxed text-muted">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-24 border border-line p-8 sm:p-12">
          <p className="label text-accent">Note on this site</p>
          <h2 className="display mt-3 text-[clamp(24px,3.6vw,38px)]">It&rsquo;s a demo, and it&rsquo;s honest about it</h2>
          <p className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-muted">
            GRAIN is not a real business. Every camera listing, price, review and order flow on
            this site is fictional demonstration data, and checkout processes nothing. The
            camera illustrations and sample photographs are drawn procedurally in SVG from each
            product&rsquo;s spec — there are no photographs anywhere in this project.
          </p>
          <Link href="/shop" className="mt-7 inline-flex items-center gap-2 text-[14px] font-medium link-slide">
            Go look at the cameras anyway <ArrowRight size={15} />
          </Link>
        </section>
      </div>
    </div>
  );
}
