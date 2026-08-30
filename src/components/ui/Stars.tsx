import * as React from "react";
import { cn } from "@/lib/utils";

export default function Stars({ value, size = 11, className }: { value: number; size?: number; className?: string }) {
  const pct = (value / 5) * 100;
  const star = "M8 .8l2.1 4.5 4.9.6-3.6 3.4.9 4.9L8 11.9 3.7 14.2l.9-4.9L1 5.9l4.9-.6z";
  return (
    <span className={cn("relative inline-flex", className)} aria-label={`${value} out of 5`}>
      <span className="flex gap-[2px] text-line">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg key={i} width={size} height={size} viewBox="0 0 16 15" fill="currentColor"><path d={star} /></svg>
        ))}
      </span>
      <span className="absolute inset-0 overflow-hidden text-[var(--gold)]" style={{ width: `${pct}%` }}>
        <span className="flex gap-[2px]">
          {[0, 1, 2, 3, 4].map((i) => (
            <svg key={i} width={size} height={size} viewBox="0 0 16 15" fill="currentColor" style={{ flex: "none" }}><path d={star} /></svg>
          ))}
        </span>
      </span>
    </span>
  );
}
