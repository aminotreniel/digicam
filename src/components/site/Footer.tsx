"use client";
import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import Logo from "./Logo";
import { useToast } from "@/components/ui/Toaster";

const COLUMNS = [
  { title: "Shop", links: [["All cameras", "/shop"], ["Grails", "/shop?collection=grails"], ["Under $150", "/shop?max=150"], ["Waterproof", "/shop?tag=waterproof"], ["Saved", "/saved"]] },
  { title: "Learn", links: [["The Looks gallery", "/looks"], ["How we grade", "/about"], ["Compare tool", "/compare"], ["Memory card guide", "/about"]] },
  { title: "Service", links: [["Shipping", "/about"], ["Returns", "/about"], ["Warranty", "/about"], ["Trade-in", "/about"]] },
];

export default function Footer() {
  const push = useToast((s) => s.push);
  const [email, setEmail] = React.useState("");
  const [done, setDone] = React.useState(false);

  return (
    <footer className="mt-28 border-t border-line">
      <div className="shell">
        <div className="grid gap-12 py-16 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-muted">
              A working archive of compact digital cameras from 2001–2012. Every body is
              tested, cleaned, re-sealed where needed, and sold with a real warranty.
            </p>

            <form
              className="mt-8 max-w-sm"
              onSubmit={(e) => {
                e.preventDefault();
                if (!email.includes("@")) { push({ title: "That email doesn't look right", tone: "info" }); return; }
                setDone(true);
                push({ title: "You're on the list", body: "Thursday drops land in your inbox at 6pm." });
              }}
            >
              <label className="label text-faint">Thursday drop list</label>
              <div className="mt-2 flex border border-line focus-within:border-ink">
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com" disabled={done}
                  className="h-12 w-full bg-transparent px-3 text-[13px] outline-none placeholder:text-faint disabled:opacity-60"
                />
                <button type="submit" disabled={done}
                  className="flex h-12 shrink-0 items-center gap-1.5 bg-ink px-4 text-[12px] font-medium text-paper transition-opacity disabled:opacity-60">
                  {done ? <><Check size={13} /> Joined</> : "Join"}
                </button>
              </div>
              <p className="mt-2 text-[11.5px] text-faint">Roughly 30 new bodies a week. No other email, ever.</p>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="label text-faint">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map(([label, href]) => (
                    <li key={label as string}>
                      <Link href={href as string} className="link-slide text-[13.5px] text-muted transition-colors hover:text-ink">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-faint">
            © {new Date().getFullYear()} GRAIN Digicam Archive — a fictional storefront built as a UI demo
          </p>
          <div className="flex items-center gap-5">
            {["Instagram", "Discord", "Journal"].map((s) => (
              <span key={s} className="label flex cursor-default items-center gap-0.5 text-faint transition-colors hover:text-ink">
                {s} <ArrowUpRight size={11} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
