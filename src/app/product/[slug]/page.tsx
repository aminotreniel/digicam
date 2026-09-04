import { notFound } from "next/navigation";
import { getProduct, getProducts, getReviews } from "@/data/remote";
import ProductClient from "./ProductClient";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  return { title: p ? `${p.brand} ${p.model} — GRAIN` : "Not found" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();

  const reviews = await getReviews(p.slug, p.rating, p.reviews);

  return <ProductClient p={p} reviews={reviews} />;
}
