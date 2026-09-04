import type { Condition, Era, Product } from "@/data/products";

/**
 * The catalog used to be a module-level constant, so every component could
 * import `products`, `brands`, `priceBounds` and friends directly. Now that the
 * catalog comes from Firestore it is per-request data, so those derived values
 * are computed from whatever set of products we actually loaded.
 */
export type Catalog = {
  products: Product[];
  brands: string[];
  eras: Era[];
  conditions: Condition[];
  allTags: string[];
  priceBounds: { min: number; max: number };
  bySlug: (slug: string) => Product | undefined;
};

export const ERAS: Era[] = ["Y2K", "Mid 2000s", "Late 2000s", "Early 2010s"];
export const CONDITIONS: Condition[] = ["Mint", "Excellent", "Good", "Well-Loved"];

export function deriveCatalog(products: Product[]): Catalog {
  const prices = products.map((p) => p.price);
  const index = new Map(products.map((p) => [p.slug, p]));

  return {
    products,
    brands: Array.from(new Set(products.map((p) => p.brand))).sort(),
    eras: ERAS,
    conditions: CONDITIONS,
    allTags: Array.from(new Set(products.flatMap((p) => p.tags))).sort(),
    // Matches the original module-level definition exactly, so the shop
    // filters behave identically. Guarded for the empty case, which the old
    // constant could never hit but a Firestore read can.
    priceBounds: {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0,
    },
    bySlug: (slug: string) => index.get(slug),
  };
}
