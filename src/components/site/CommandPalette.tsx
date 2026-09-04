"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Search, CornerDownLeft, ArrowUp, ArrowDown } from "lucide-react";
import CameraArt from "@/components/camera/CameraArt";
import { useCatalog } from "@/components/CatalogProvider";
import { useUI } from "@/lib/store";
import { cn, money } from "@/lib/utils";

const QUICK = [
  { label: "Shop everything", href: "/shop" },
  { label: "Under $150", href: "/shop?max=150" },
  { label: "Waterproof bodies", href: "/shop?tag=waterproof" },
  { label: "Grails & rarities", href: "/shop?collection=grails" },
  { label: "Compare cameras", href: "/compare" },
  { label: "The Looks gallery", href: "/looks" },
];

export default function CommandPalette() {
  const { products } = useCatalog();
  const open = useUI((s) => s.paletteOpen);
  const setOpen = useUI((s) => s.setPaletteOpen);
  const [q, setQ] = React.useState("");
  const [sel, setSel] = React.useState(0);
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  React.useEffect(() => {
    if (open) { setQ(""); setSel(0); setTimeout(() => inputRef.current?.focus(), 60); }
  }, [open]);

  const results = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return products.slice(0, 6);
    return products
      .filter((p) =>
        [p.brand, p.model, p.tagline, ...p.tags, p.era, p.condition].join(" ").toLowerCase().includes(term)
      )
      .slice(0, 8);
  }, [q]);

  const quick = q.trim()
    ? QUICK.filter((x) => x.label.toLowerCase().includes(q.trim().toLowerCase()))
    : QUICK.slice(0, 3);

  const flat: { type: "p" | "q"; href: string }[] = [
    ...results.map((p) => ({ type: "p" as const, href: `/product/${p.slug}` })),
    ...quick.map((x) => ({ type: "q" as const, href: x.href })),
  ];

  const go = (href: string) => { setOpen(false); router.push(href); };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => (s + 1) % Math.max(1, flat.length)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => (s - 1 + flat.length) % Math.max(1, flat.length)); }
    if (e.key === "Enter" && flat[sel]) { e.preventDefault(); go(flat[sel].href); }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[95] bg-black/50 backdrop-blur-[3px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }} onClick={() => setOpen(false)} />
          <motion.div
            className="fixed left-1/2 top-[10vh] z-[96] w-[min(94vw,620px)] -translate-x-1/2 overflow-hidden border border-line bg-paper shadow-[var(--shadow-lg)]"
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.985 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            role="dialog" aria-label="Search"
          >
            <div className="ring-host flex items-center gap-3 border-b border-line px-4 transition-colors">
              <Search size={16} className="shrink-0 text-muted" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => { setQ(e.target.value); setSel(0); }}
                onKeyDown={onKeyDown}
                placeholder="Search 26 bodies — brand, era, waterproof, low light…"
                className="h-14 w-full bg-transparent text-[14px] outline-none placeholder:text-faint"
              />
              <kbd className="label shrink-0 rounded-[2px] border border-line px-1.5 py-1 text-faint">ESC</kbd>
            </div>

            <div className="thin-scroll max-h-[54vh] overflow-y-auto">
              {results.length > 0 && (
                <div className="px-2 py-2">
                  <p className="label px-2 py-2 text-faint">Cameras</p>
                  {results.map((p, i) => (
                    <button
                      key={p.slug}
                      onMouseEnter={() => setSel(i)}
                      onClick={() => go(`/product/${p.slug}`)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-[3px] px-2 py-2 text-left transition-colors",
                        sel === i ? "bg-ink/[.07]" : "hover:bg-ink/[.04]"
                      )}
                    >
                      <span className="grid h-11 w-14 shrink-0 place-items-center border border-line bg-paper-2 px-1">
                        <CameraArt form={p.form} body={p.colors[0].body} bodyDark={p.colors[0].bodyDark}
                          trim={p.colors[0].trim} uid={`cmd-${p.slug}`} brand={p.brand} model={p.model} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-medium">{p.brand} {p.model}</span>
                        <span className="label block text-faint">{p.year} · {p.mp}MP · {p.condition}</span>
                      </span>
                      <span className="shrink-0 text-[13px] font-semibold tabular-nums">{money(p.price)}</span>
                    </button>
                  ))}
                </div>
              )}

              {quick.length > 0 && (
                <div className="border-t border-line px-2 py-2">
                  <p className="label px-2 py-2 text-faint">Jump to</p>
                  {quick.map((x, i) => {
                    const idx = results.length + i;
                    return (
                      <button
                        key={x.href}
                        onMouseEnter={() => setSel(idx)}
                        onClick={() => go(x.href)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-[3px] px-2 py-2.5 text-left text-[13px] transition-colors",
                          sel === idx ? "bg-ink/[.07]" : "hover:bg-ink/[.04]"
                        )}
                      >
                        <span className="h-1 w-1 rounded-full bg-accent" />
                        {x.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {results.length === 0 && quick.length === 0 && (
                <p className="px-5 py-10 text-center text-[13px] text-muted">
                  No bodies match &ldquo;{q}&rdquo;. Try &ldquo;waterproof&rdquo; or &ldquo;Canon&rdquo;.
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 border-t border-line px-4 py-2.5">
              <span className="label flex items-center gap-1 text-faint"><ArrowUp size={10} /><ArrowDown size={10} /> navigate</span>
              <span className="label flex items-center gap-1 text-faint"><CornerDownLeft size={10} /> open</span>
              <span className="label ml-auto text-faint">{results.length} result{results.length === 1 ? "" : "s"}</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
