import * as React from "react";

export function Aperture({ size = 20, className }: { size?: number; className?: string }) {
  const blades = Array.from({ length: 6 });
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.85" />
      {blades.map((_, i) => (
        <path
          key={i}
          d="M16 16 L16 2.4 A13.6 13.6 0 0 1 27.8 9.2 Z"
          fill="currentColor"
          opacity={i % 2 === 0 ? 0.95 : 0.42}
          transform={`rotate(${i * 60} 16 16)`}
        />
      ))}
      <circle cx="16" cy="16" r="3.6" fill="var(--paper)" />
    </svg>
  );
}

export default function Logo({ className }: { className?: string }) {
  return (
    <span className={"flex items-center gap-2 " + (className ?? "")}>
      <Aperture size={19} className="text-accent" />
      <span className="text-[19px] font-extrabold tracking-[-.06em] leading-none">GRAIN</span>
      <span className="label mt-[3px] hidden text-faint sm:inline">/ DIGICAM ARCHIVE</span>
    </span>
  );
}
