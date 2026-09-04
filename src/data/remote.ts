import { collection, doc, getDocs, getDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db, appPath } from "@/lib/firebase";
import { products as localProducts, type Product } from "@/data/products";
import { reviewsFor, type Review } from "@/data/reviews";

/**
 * Every read falls back to the bundled static data.
 *
 * This is a client demo: an empty collection, a cold network, or someone having
 * emptied the shared database must never produce an empty storefront in front
 * of a client. Firestore is the source of truth when it has something to say,
 * and the committed data is the floor.
 */

const col = (...segments: string[]) => collection(db, appPath(...segments).join("/"));

export async function getProducts(): Promise<Product[]> {
  try {
    const snap = await getDocs(col("products"));
    if (snap.empty) return localProducts;
    return snap.docs
      .map((d) => d.data() as Product)
      .sort((a, b) => a.id - b.id);
  } catch (err) {
    console.warn("[grain] product read failed, serving bundled catalog:", err);
    return localProducts;
  }
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  try {
    const snap = await getDoc(doc(db, appPath("products", slug).join("/")));
    if (snap.exists()) return snap.data() as Product;
  } catch (err) {
    console.warn(`[grain] product read failed for "${slug}":`, err);
  }
  return localProducts.find((p) => p.slug === slug);
}

export async function getReviews(
  slug: string,
  rating: number,
  total: number
): Promise<Review[]> {
  try {
    const snap = await getDocs(col("products", slug, "reviews"));
    if (!snap.empty) return snap.docs.map((d) => d.data() as Review);
  } catch (err) {
    console.warn(`[grain] review read failed for "${slug}":`, err);
  }
  return reviewsFor(slug, rating, total);
}

/** Shape of a demo order. Visitor writes land here and are never read back
 *  into the storefront, so a junk order cannot affect what a client sees. */
export type DemoOrder = {
  reference: string;
  email: string;
  name: string;
  lines: { slug: string; name: string; color: string; qty: number; price: number }[];
  subtotal: number;
  placedAt: unknown;
};

export async function placeOrder(
  order: Omit<DemoOrder, "placedAt" | "reference">
): Promise<string | null> {
  const reference = `GR-${Date.now().toString(36).toUpperCase()}`;
  try {
    await addDoc(col("orders"), { ...order, reference, placedAt: serverTimestamp() });
    return reference;
  } catch (err) {
    console.warn("[grain] order write failed:", err);
    // The demo checkout still succeeds visually — persistence is a bonus here,
    // not a requirement, and a write failure must not dead-end the flow.
    return reference;
  }
}
