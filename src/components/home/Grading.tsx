"use client";
import * as React from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const GRADES = [
  { name: "Mint", pct: 98, blurb: "Indistinguishable from new. Often boxed, sometimes unused. No marks under raking light.", eg: "Roughly 1 in 12 bodies we buy." },
  { name: "Excellent", pct: 88, blurb: "Light shelf wear at most. Screen clean, lens clean, all mechanics crisp. The sweet spot.", eg: "Most of what we sell." },
  { name: "Good", pct: 72, blurb: "Visible handling marks on the shell. Cosmetics only — everything works exactly as it should.", eg: "The value pick." },
  { name: "Well-Loved", pct: 52, blurb: "Scuffs, worn paint, tired battery doors. Fully functional, priced accordingly, sold honestly.", eg: "Buy it to actually use it." },
];

const CHECKS = [
  "Shutter fired 100× and timed",
  "Every aperture and zoom step",
  "Sensor checked for hot pixels",
  "Flash output measured",
  "Screen tested for dead pixels",
  "Battery cycled and capacity logged",
  "All ports and card slots",
  "Seals replaced on waterproof bodies",
];

export default function Grading() {
  const [active, setActive] = React.useState(1);
  const g = GRADES[active];

  return (
    <section className="mt-28">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <Reveal>
              <p className="label text-accent">Condition, defined</p>
              <h2 className="display mt-3 text-[clamp(30px,5vw,54px)]">
                We grade hard<span className="text-accent">,</span><br />so you don&rsquo;t get surprised.
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
                Used-camera listings are famously optimistic. Ours aren&rsquo;t. Here is
                exactly what each grade means and what fails a body outright.
              </p>
            </Reveal>

            <div className="mt-10 space-y-px">
              {GRADES.map((grade, i) => (
                <button key={grade.name} onClick={() => setActive(i)}
                  className={cn("flex w-full items-center gap-4 border border-line px-4 py-4 text-left transition-colors",
                    i === active ? "bg-ink/[.06]" : "hover:bg-ink/[.03]")}>
                  <span className={cn("label w-24 shrink-0", i === active ? "text-ink" : "text-muted")}>{grade.name}</span>
                  <span className="relative h-[3px] flex-1 bg-line">
                    <motion.span className="absolute inset-y-0 left-0 bg-accent"
                      initial={false} animate={{ width: `${grade.pct}%` }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />
                  </span>
                  <span className="w-10 shrink-0 text-right text-[12px] tabular-nums text-faint">{grade.pct}%</span>
                </button>
              ))}
            </div>

            <motion.div key={g.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 border-l-2 border-accent pl-5">
              <p className="text-[15px] leading-relaxed">{g.blurb}</p>
              <p className="mt-2 text-[13px] text-muted">{g.eg}</p>
            </motion.div>
          </div>

          <Reveal delay={0.1}>
            <div className="border border-line bg-paper-2 p-7 sm:p-9">
              <p className="label text-muted">The bench test — every single body</p>
              <ul className="mt-6 space-y-0">
                {CHECKS.map((c, i) => (
                  <motion.li key={c}
                    initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.05 }}
                    className="flex items-center gap-3 border-b border-line py-3.5 last:border-b-0">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-[var(--lcd)]/50 text-[var(--lcd)]">
                      <Check size={11} />
                    </span>
                    <span className="text-[14px]">{c}</span>
                    <span className="label ml-auto text-faint">{String(i + 1).padStart(2, "0")}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-7 border-t border-line pt-5">
                <p className="text-[13px] leading-relaxed text-muted">
                  If a body fails any of these it doesn&rsquo;t get listed. It goes to the parts
                  bin and keeps another camera alive.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
