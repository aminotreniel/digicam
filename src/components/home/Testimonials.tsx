"use client";
import * as React from "react";
import { motion } from "motion/react";
import Stars from "@/components/ui/Stars";

const NOTES = [
  { t: "Arrived cleaner than described. The flash on this thing is exactly the look I was chasing.", n: "Mira K.", i: "Canon IXUS 70", r: 5 },
  { t: "I was nervous buying a 2006 camera online. It came with a fresh battery, a card, and it just worked.", n: "Dev A.", i: "Fujifilm F31fd", r: 5 },
  { t: "The condition grading is honest. Bought a Good body, got exactly a Good body.", n: "Sam O.", i: "Casio EX-Z75", r: 4.5 },
  { t: "Took it in the sea for a week straight. Still going. Seals were clearly redone properly.", n: "Nina T.", i: "Olympus 720 SW", r: 5 },
  { t: "Shipped in 30 hours. Packaging was better than most new-product unboxings.", n: "Leo P.", i: "Lumix LX3", r: 5 },
  { t: "Asked three annoying questions before ordering and got real answers each time.", n: "Yuki S.", i: "Ricoh GR Digital II", r: 4.5 },
];

export default function Testimonials() {
  return (
    <section className="mt-28 overflow-hidden border-y border-line py-16">
      <div className="shell mb-10">
        <p className="label text-accent">4.8 average across 1,240 orders</p>
        <h2 className="display mt-2 text-[clamp(26px,4vw,42px)]">What people say after the first roll</h2>
      </div>
      <div className="edge-fade-x marquee-paused">
        <div className="marquee-track flex w-max gap-4" style={{ ["--dur" as any]: "62s" }}>
          {[...NOTES, ...NOTES].map((n, i) => (
            <motion.figure key={i}
              className="flex w-[330px] shrink-0 flex-col justify-between border border-line bg-paper-2 p-6"
              whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <div>
                <Stars value={n.r} size={12} />
                <blockquote className="mt-4 text-[14.5px] leading-relaxed">&ldquo;{n.t}&rdquo;</blockquote>
              </div>
              <figcaption className="mt-6 flex items-center justify-between border-t border-line pt-4">
                <span className="text-[13px] font-medium">{n.n}</span>
                <span className="label text-faint">{n.i}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
