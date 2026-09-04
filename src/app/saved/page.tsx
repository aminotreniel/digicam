"use client";
import * as React from "react";
import ProductCard from "@/components/shop/ProductCard";
import Button from "@/components/ui/Button";
import { useSaved } from "@/lib/store";
import { useCatalog } from "@/components/CatalogProvider";

export default function SavedPage() {
  const { products } = useCatalog();
  const saved = useSaved((s) => s.saved);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const items = products.filter((p) => saved.includes(p.slug));

  return (
    <div className="shell pt-10">
      <header className="border-b border-line pb-8">
        <p className="label text-accent">Wishlist</p>
        <h1 className="display mt-3 text-[clamp(34px,5.5vw,60px)]">Saved bodies</h1>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
          Stock moves fast and most of these are single units. Saving one doesn&rsquo;t hold it —
          but we&rsquo;ll flag it here while it lasts.
        </p>
      </header>

      {!mounted ? (
        <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton aspect-[4/3]" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="py-20">
          <p className="max-w-md text-[15px] leading-relaxed text-muted">
            Nothing saved yet. Tap the heart on any camera and it will show up here.
          </p>
          <Button href="/shop" variant="accent" size="lg" className="mt-7">Browse the archive</Button>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-11 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p, i) => <ProductCard key={p.slug} p={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
