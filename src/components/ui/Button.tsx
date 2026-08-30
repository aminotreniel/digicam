"use client";
import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost" | "accent";
type Size = "sm" | "md" | "lg";

const base =
  "relative inline-flex items-center justify-center gap-2 select-none font-medium " +
  "transition-[transform,background-color,color,border-color,box-shadow] duration-200 " +
  "active:scale-[.975] disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  solid:
    "bg-ink text-paper hover:bg-ink/88 border border-ink",
  accent:
    "bg-accent text-[var(--accent-ink)] border border-accent hover:brightness-110 shadow-[0_2px_0_0_rgba(0,0,0,.18)]",
  outline:
    "border border-line text-ink hover:border-ink hover:bg-ink/[.04]",
  ghost:
    "text-ink hover:bg-ink/[.06] border border-transparent",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[12px] rounded-[3px]",
  md: "h-11 px-5 text-[13px] rounded-[4px]",
  lg: "h-14 px-8 text-[14px] rounded-[4px]",
};

type Props = {
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  variant = "solid", size = "md", href, className, children, ...rest
}: Props) {
  const cls = cn(base, variants[variant], sizes[size], "tracking-[.02em]", className);
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
