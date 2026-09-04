/**
 * Seeds the GRAIN demo data into the shared Firestore project.
 *
 *   npm run seed
 *
 * Idempotent: every document is written at a deterministic path with `set`, so
 * rerunning restores the showcase data to a known-good state. Because the demo
 * runs with open write rules, that is the repair tool if a visitor writes junk.
 *
 * Uses the normal client SDK rather than firebase-admin — the rules are open,
 * so no service-account key is needed and nothing secret has to exist anywhere.
 */

import { initializeApp } from "firebase/app";
import { getFirestore, doc, writeBatch, serverTimestamp } from "firebase/firestore";
import { products } from "../src/data/products";
import { reviewsFor } from "../src/data/reviews";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyCxucNZL7FHZO7fS2pzshnB5veACKZaJ1I",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "alldb-a1804.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "alldb-a1804",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "alldb-a1804.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "397138423193",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:397138423193:web:88a338e16f85761112b708",
};

const APP_ID = "grain";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/** Firestore caps a batch at 500 writes. */
const BATCH_LIMIT = 450;

type Write = { path: string[]; data: Record<string, unknown> };

async function commitAll(writes: Write[]) {
  for (let i = 0; i < writes.length; i += BATCH_LIMIT) {
    const slice = writes.slice(i, i + BATCH_LIMIT);
    const batch = writeBatch(db);
    for (const w of slice) {
      batch.set(doc(db, w.path.join("/")), w.data);
    }
    await batch.commit();
    process.stdout.write(`  committed ${Math.min(i + BATCH_LIMIT, writes.length)}/${writes.length}\n`);
  }
}

/** Deterministic sample orders so the orders view is never empty. */
function sampleOrders() {
  const picks = products.slice(0, 5);
  return picks.map((p, i) => {
    const qty = (i % 2) + 1;
    return {
      reference: `GR-SEED${String(i + 1).padStart(3, "0")}`,
      email: ["mira.k@example.com", "dev.a@example.com", "sam.o@example.com", "nina.t@example.com", "leo.p@example.com"][i],
      name: ["Mira Kovac", "Dev Anand", "Sam Osei", "Nina Torres", "Leo Park"][i],
      lines: [
        {
          slug: p.slug,
          name: `${p.brand} ${p.model}`,
          color: p.colors[0]?.name ?? "Silver",
          qty,
          price: p.price,
        },
      ],
      subtotal: p.price * qty,
      status: ["Delivered", "Shipped", "Packing", "Delivered", "Shipped"][i],
      placedAt: `2026-0${(i % 8) + 1}-1${i} 10:0${i}`,
      seeded: true,
    };
  });
}

async function main() {
  const writes: Write[] = [];

  writes.push({
    path: ["apps", APP_ID],
    data: {
      name: "GRAIN — Digicam Archive",
      description: "Vintage compact digital camera storefront. UI demo backed by Firestore.",
      repo: "aminotreniel/digicam",
      seededAt: new Date().toISOString(),
    },
  });

  for (const p of products) {
    writes.push({ path: ["apps", APP_ID, "products", p.slug], data: { ...p } });
    for (const r of reviewsFor(p.slug, p.rating, p.reviews)) {
      writes.push({
        path: ["apps", APP_ID, "products", p.slug, "reviews", r.id],
        data: { ...r },
      });
    }
  }

  for (const o of sampleOrders()) {
    writes.push({ path: ["apps", APP_ID, "orders", o.reference], data: o });
  }

  console.log(`Seeding ${writes.length} documents into apps/${APP_ID} …`);
  await commitAll(writes);

  // Stamp the run so it is obvious in the console when data was last repaired.
  const batch = writeBatch(db);
  batch.set(doc(db, ["apps", APP_ID].join("/")), { lastSeedAt: serverTimestamp() }, { merge: true });
  await batch.commit();

  console.log(`Done. ${products.length} products, sample reviews, ${sampleOrders().length} orders.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
