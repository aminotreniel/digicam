import { Suspense } from "react";
import ShopClient from "./ShopClient";

export const metadata = { title: "Shop — GRAIN Digicam Archive" };

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="shell py-24"><div className="skeleton h-8 w-64" /></div>}>
      <ShopClient />
    </Suspense>
  );
}
