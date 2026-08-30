"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { Search, ShoppingBag, Heart, Menu, X, GitCompareArrows } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import Marquee from "@/components/ui/Marquee";
import { useCart, useSaved, useUI, useCompare } from "@/lib/store";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?collection=grails", label: "Grails" },
  { href: "/looks", label: "Looks" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [menu, setMenu] = React.useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  const lines = useCart((s) => s.lines);
  const setCartOpen = useCart((s) => s.setOpen);
  const saved = useSaved((s) => s.saved);
  const compare = useCompare((s) => s.items);
  const setPalette = useUI((s) => s.setPaletteOpen);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const count = mounted ? lines.reduce((a, l) => a + l.qty, 0) : 0;

  React.useEffect(() => { setMenu(false); }, [pathname]);
  React.useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menu]);

  return (
    <>
      <div className="relative z-50 border-b border-line bg-ink text-paper">
        <Marquee
          className="label-lg edge-fade-x py-[7px] opacity-90"
          duration={55}
          items={[
            "Every camera tested, cleaned and warrantied",
            "Free shipping over $250",
            "90-day function guarantee",
            "New stock drops every Thursday 6pm",
            "Trade in your old compact for store credit",
          ]}
        />
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled
            ? "border-b border-line bg-[color-mix(in_srgb,var(--paper)_82%,transparent)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="shell flex h-16 items-center gap-4">
          <button
            className="-ml-2 grid h-9 w-9 place-items-center rounded-[3px] text-ink lg:hidden"
            onClick={() => setMenu(true)}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>

          <Link href="/" className="shrink-0" aria-label="GRAIN home">
            <Logo />
          </Link>

          <nav className="ml-6 hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => {
              const active = pathname === l.href.split("?")[0] && l.href !== "/shop?collection=grails";
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative px-3 py-2 text-[13px] tracking-[.01em] transition-colors",
                    active ? "text-ink" : "text-muted hover:text-ink"
                  )}
                >
                  {l.label}
                  {active && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute inset-x-3 -bottom-[1px] h-[2px] bg-accent"
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => setPalette(true)}
              className="group hidden h-9 items-center gap-2 rounded-[3px] border border-line px-3 text-muted transition-colors hover:border-ink/40 hover:text-ink md:flex"
            >
              <Search size={14} />
              <span className="text-[12px]">Search cameras</span>
              <kbd className="label ml-4 rounded-[2px] border border-line px-1 py-[2px] text-faint">⌘K</kbd>
            </button>
            <button
              onClick={() => setPalette(true)}
              className="grid h-9 w-9 place-items-center rounded-[3px] text-ink/80 transition-colors hover:text-ink md:hidden"
              aria-label="Search"
            >
              <Search size={16} />
            </button>

            <ThemeToggle />

            <Link href="/compare" className="relative hidden h-9 w-9 place-items-center rounded-[3px] text-ink/80 transition-colors hover:text-ink sm:grid" aria-label="Compare">
              <GitCompareArrows size={16} />
              {mounted && compare.length > 0 && (
                <span className="absolute right-1 top-1 h-[6px] w-[6px] rounded-full bg-accent" />
              )}
            </Link>

            <Link href="/saved" className="relative grid h-9 w-9 place-items-center rounded-[3px] text-ink/80 transition-colors hover:text-ink" aria-label="Saved">
              <Heart size={16} />
              {mounted && saved.length > 0 && (
                <span className="absolute right-1 top-1 h-[6px] w-[6px] rounded-full bg-accent" />
              )}
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="relative ml-1 flex h-9 items-center gap-2 rounded-[3px] bg-ink px-3 text-paper transition-transform active:scale-95"
              aria-label={`Cart, ${count} items`}
            >
              <ShoppingBag size={15} />
              <span className="label-lg tabular-nums">{String(count).padStart(2, "0")}</span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-[80] bg-paper lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex h-16 items-center justify-between px-5">
              <Logo />
              <button onClick={() => setMenu(false)} aria-label="Close menu" className="grid h-9 w-9 place-items-center"><X size={20} /></button>
            </div>
            <nav className="mt-6 px-5">
              {[...LINKS, { href: "/saved", label: "Saved" }, { href: "/compare", label: "Compare" }, { href: "/cart", label: "Cart" }].map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href={l.href} className="block border-b border-line py-5 text-[30px] font-extrabold tracking-[-.045em]">
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
