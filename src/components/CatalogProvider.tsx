"use client";

import { createContext, useContext, useMemo, useEffect } from "react";
import type { Product } from "@/data/products";
import { deriveCatalog, type Catalog } from "@/lib/catalog";
import { initAnalytics } from "@/lib/analytics";

const CatalogContext = createContext<Catalog | null>(null);

/**
 * The catalog is fetched once per request in the root layout (a server
 * component) and handed to the tree here. Client components that used to
 * `import { products } from "@/data/products"` now call `useCatalog()`.
 *
 * Doing it this way means one Firestore read per render rather than one per
 * component, and the client bundle never has to ship a Firestore query.
 */
export default function CatalogProvider({
  products,
  children,
}: {
  products: Product[];
  children: React.ReactNode;
}) {
  const catalog = useMemo(() => deriveCatalog(products), [products]);

  useEffect(() => {
    void initAnalytics();
  }, []);

  return <CatalogContext.Provider value={catalog}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): Catalog {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error("useCatalog must be used inside <CatalogProvider>");
  }
  return ctx;
}
