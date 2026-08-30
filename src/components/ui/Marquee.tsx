"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export default function Marquee({
  items, duration = 46, className, separator = "✦",
}: { items: string[]; duration?: number; className?: string; separator?: string }) {
  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className="px-6 whitespace-nowrap">{t}</span>
          <span className="text-accent/70">{separator}</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={cn("marquee-paused overflow-hidden", className)}>
      <div className="marquee-track flex w-max" style={{ ["--dur" as any]: `${duration}s` }}>
        {row}
        {row}
      </div>
    </div>
  );
}
