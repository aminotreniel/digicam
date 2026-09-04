import Link from "next/link";
import { ArrowRight, Recycle, Truck, ShieldCheck, Wrench } from "lucide-react";
import Hero from "@/components/home/Hero";
import Rail from "@/components/home/Rail";
import LookSelector from "@/components/home/LookSelector";
import TabbedGrid from "@/components/home/TabbedGrid";
import Grading from "@/components/home/Grading";
import Testimonials from "@/components/home/Testimonials";
import Reveal from "@/components/ui/Reveal";
import { getProducts } from "@/data/remote";

const PROMISES = [
  { icon: Wrench, t: "Bench tested", d: "Eight-point check on every body before it is listed." },
  { icon: ShieldCheck, t: "90-day warranty", d: "If it stops working, we repair it or refund you." },
  { icon: Truck, t: "48-hour dispatch", d: "Packed properly. Tracked. Free over $250." },
  { icon: Recycle, t: "Trade-in credit", d: "Send us your old compact for store credit." },
];

export const revalidate = 60;

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.filter((p) => p.badges.includes("staff-pick") || p.badges.includes("trending")).slice(0, 6);
  const grails = products.filter((p) => p.badges.includes("rare")).slice(0, 5);

  return (
    <>
      <Hero />

      <section className="mt-16 border-y border-line">
        <div className="shell grid grid-cols-2 divide-x divide-y divide-line sm:grid-cols-4 sm:divide-y-0">
          {PROMISES.map(({ icon: Icon, t, d }, i) => (
            <Reveal key={t} delay={i * 0.06}>
              <div className="px-5 py-7 sm:px-7">
                <Icon size={17} className="text-accent" />
                <p className="mt-4 text-[14px] font-semibold tracking-[-.01em]">{t}</p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Rail kicker="Chosen by the bench team" title="This week's picks" href="/shop" items={featured} />

      <LookSelector />

      <TabbedGrid />

      <Grading />

      <Rail kicker="Rare, restored, and not coming back" title="The grail shelf" href="/shop?collection=grails" items={grails} />

      <Testimonials />

      <section className="mt-28">
        <div className="shell">
          <Reveal>
            <div className="relative overflow-hidden border border-line bg-ink px-6 py-16 text-paper sm:px-14 sm:py-20">
              <div className="pointer-events-none absolute inset-0 opacity-[.16]"
                style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "22px 22px" }} />
              <div className="relative max-w-2xl">
                <p className="label text-accent">Trade-in programme</p>
                <h2 className="display mt-4 text-[clamp(30px,5.4vw,58px)]">
                  Got a camera in a drawer?
                </h2>
                <p className="mt-5 max-w-lg text-[15px] leading-relaxed opacity-70">
                  Send us any working compact from 2000–2012 and we&rsquo;ll quote store credit
                  within 48 hours. If it fails our bench test we recycle it for parts and
                  still pay you something.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/shop"
                    className="inline-flex h-14 items-center gap-2 bg-accent px-8 text-[14px] font-medium text-[var(--accent-ink)] transition-transform active:scale-[.98]">
                    Start a trade-in <ArrowRight size={16} />
                  </Link>
                  <Link href="/about"
                    className="inline-flex h-14 items-center border border-paper/25 px-8 text-[14px] transition-colors hover:border-paper/60">
                    How it works
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
