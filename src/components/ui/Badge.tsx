import * as React from "react";
import { cn } from "@/lib/utils";

const tones = {
  accent: "text-accent border-accent/45 bg-accent/10",
  lcd: "text-[var(--lcd)] border-[var(--lcd)]/45 bg-[var(--lcd)]/10",
  ink: "text-ink border-line bg-ink/[.05]",
  gold: "text-[var(--gold)] border-[var(--gold)]/45 bg-[var(--gold)]/10",
  muted: "text-muted border-line bg-transparent",
} as const;

export default function Badge({
  children, tone = "ink", className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span className={cn("label inline-flex items-center gap-1 border px-1.5 py-[3px] rounded-[2px] leading-none", tones[tone], className)}>
      {children}
    </span>
  );
}
