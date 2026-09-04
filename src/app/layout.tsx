import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import CartDrawer from "@/components/site/CartDrawer";
import CommandPalette from "@/components/site/CommandPalette";
import QuickView from "@/components/site/QuickView";
import Toaster from "@/components/ui/Toaster";
import CatalogProvider from "@/components/CatalogProvider";
import { getProducts } from "@/data/remote";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-face", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: "italic", variable: "--font-serif-face", display: "swap" });

export const metadata: Metadata = {
  title: "GRAIN — Digicam Archive",
  description:
    "A working archive of compact digital cameras from 2001–2012. Tested, cleaned, warrantied.",
};

const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('grain-theme');
    if (!t) t = 'dark';
    document.documentElement.setAttribute('data-theme', t);
  } catch(e) { document.documentElement.setAttribute('data-theme','dark'); }
})();
`;

/** Re-read the catalog from Firestore at most once a minute, so edits made in
 *  the Firebase console show up without a redeploy. */
export const revalidate = 60;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const products = await getProducts();

  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${mono.variable} ${serif.variable} antialiased`}>
        <CatalogProvider products={products}>
          <div className="grain-layer" aria-hidden="true" />
          <Nav />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <CommandPalette />
          <QuickView />
          <Toaster />
        </CatalogProvider>
      </body>
    </html>
  );
}
