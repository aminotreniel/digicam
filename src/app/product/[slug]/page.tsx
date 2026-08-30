import { notFound } from "next/navigation";
import { bySlug, products } from "@/data/products";
import ProductClient from "./ProductClient";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = bySlug(slug);
  return { title: p ? `${p.brand} ${p.model} — GRAIN` : "Not found" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) notFound();
  return <ProductClient p={p} />;
}
