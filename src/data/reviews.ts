import { seeded } from "@/lib/utils";

const NAMES = ["Mira K.", "Dev A.", "Sam O.", "Nina T.", "Leo P.", "Yuki S.", "Ade B.", "Tomas R.",
  "Priya N.", "Callum W.", "Zoë F.", "Hana M.", "Marco D.", "Ines G.", "Jonah L.", "Riya S."];

const OPENERS = [
  "Arrived faster than I expected and in better shape than described.",
  "First roll of photos came out exactly like the sample frames on the listing.",
  "I've bought three cameras from other sellers and this is the only one that arrived working properly.",
  "Packaging alone tells you these people care.",
  "Bought this for a trip and it did not miss a single shot.",
  "Was nervous about buying something this old online.",
  "Handed it to a friend at a party and did not get it back for two hours.",
  "The battery held a full day of shooting, which I did not expect.",
];

const BODIES = [
  "Flash is punchy in the best way and the colours need basically no editing.",
  "Screen is small by modern standards but you stop noticing after ten minutes.",
  "Menus are from another era and that's part of the charm.",
  "Feels solid in the hand — heavier than a phone, which is the point.",
  "Autofocus hunts in dim rooms, but outdoors it's instant.",
  "Startup time is about a second, so you don't miss things.",
  "It slips into a jacket pocket and I've stopped leaving it at home.",
  "The condition grading was completely accurate to what turned up.",
];

const CLOSERS = [
  "Would buy from GRAIN again without thinking about it.",
  "Exactly what I wanted from a digicam in 2026.",
  "Four stars only because I wish I'd bought two.",
  "My phone has not left my pocket since.",
  "Recommend it to anyone curious about the look.",
  "Genuinely a joy to carry around.",
];

export type Review = {
  id: string; name: string; rating: number; title: string; body: string;
  date: string; verified: boolean; helpful: number;
};

const TITLES = [
  "Exactly as described", "Better than expected", "The look is real",
  "Solid buy", "My new everyday carry", "Worth it", "No notes",
];

export function reviewsFor(slug: string, rating: number, total: number): Review[] {
  const rnd = seeded(`rev-${slug}`);
  const n = Math.min(6, Math.max(3, Math.round(total / 30)));
  return Array.from({ length: n }).map((_, i) => {
    const r = Math.max(3, Math.min(5, Math.round((rating + (rnd() - 0.45)) * 2) / 2));
    const month = 1 + Math.floor(rnd() * 8);
    return {
      id: `${slug}-${i}`,
      name: NAMES[Math.floor(rnd() * NAMES.length)],
      rating: r,
      title: TITLES[Math.floor(rnd() * TITLES.length)],
      body: `${OPENERS[Math.floor(rnd() * OPENERS.length)]} ${BODIES[Math.floor(rnd() * BODIES.length)]} ${CLOSERS[Math.floor(rnd() * CLOSERS.length)]}`,
      date: `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"][month - 1]} 2026`,
      verified: rnd() > 0.18,
      helpful: Math.floor(rnd() * 34),
    };
  });
}
