import * as React from "react";
import type { Look } from "@/data/products";
import { seeded, stamp } from "@/lib/utils";

type Props = {
  look: Look;
  seed: string;
  index?: number;
  year?: number;
  showStamp?: boolean;
  scene?: number;
  className?: string;
};

type RGB = [number, number, number];

function parse(hex: string): RGB {
  const s = hex.replace("#", "");
  const n = parseInt(s.length === 3 ? s.split("").map((x) => x + x).join("") : s, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgb([r, g, b]: RGB) {
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}
function lerp(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
function mix(a: string, b: string, t: number) {
  return rgb(lerp(parse(a), parse(b), t));
}
function lift(hex: string, amt: number) {
  const c = parse(hex);
  return rgb([c[0] + amt, c[1] + amt, c[2] + amt].map((v) => Math.max(0, Math.min(255, v))) as RGB);
}
const WHITE = "#ffffff";
const BLACK = "#000000";

/**
 * Synthetic photographs. Five scene templates rendered in each camera's colour
 * character — highlight tint, midtone, shadow tint, bloom and contrast — with
 * fine grain, split toning, vignette and a period-correct date stamp.
 */
export default function SampleFrame({
  look, seed, index = 0, year = 2006, showStamp = true, scene, className,
}: Props) {
  const base = Math.floor(seeded(seed)() * 5);
  const sceneSeed = `${seed}::${index}::scene`;
  const uid = `sf-${seed}-${index}`.replace(/[^a-zA-Z0-9-]/g, "");
  const S = scene ?? (base + index) % 5;

  const hi = look.a;
  const mid = look.b;
  const lo = look.c;
  const D: SD = { hi, mid, lo, uid, bloom: look.bloom, contrast: look.contrast, seed: sceneSeed };

  return (
    <svg viewBox="0 0 100 75" className={className} role="img"
      aria-label={`Sample frame rendered in the ${look.name} character`}
      style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <radialGradient id={`${uid}-vig`} cx="0.5" cy="0.5" r="0.75">
          <stop offset="48%" stopColor={BLACK} stopOpacity="0" />
          <stop offset="100%" stopColor={BLACK} stopOpacity={0.26 + look.contrast * 0.14} />
        </radialGradient>
        <linearGradient id={`${uid}-split`} x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0%" stopColor="#ffcf8f" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#5f86c4" stopOpacity="0.22" />
        </linearGradient>
        <filter id={`${uid}-lens`} x="-4%" y="-4%" width="108%" height="108%">
          <feGaussianBlur stdDeviation="0.22" />
          <feColorMatrix type="saturate" values={String(1.15 + look.contrast * 0.15)} />
        </filter>
        <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.45" />
        </filter>
        <filter id={`${uid}-softer`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
        <filter id={`${uid}-bokeh`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.55" />
        </filter>
        <filter id={`${uid}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="3.4" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <clipPath id={`${uid}-c`}><rect width="100" height="75" /></clipPath>
      </defs>

      <g clipPath={`url(#${uid}-c)`}>
        <g filter={`url(#${uid}-lens)`}>
          {S === 0 && <Horizon {...D} />}
          {S === 1 && <NightBokeh {...D} />}
          {S === 2 && <FlashPortrait {...D} />}
          {S === 3 && <Interior {...D} />}
          {S === 4 && <Street {...D} />}
        </g>
        <rect width="100" height="75" fill={`url(#${uid}-split)`} style={{ mixBlendMode: "soft-light" }} />
        <rect width="100" height="75" fill={`url(#${uid}-vig)`} />
        <rect width="100" height="75" filter={`url(#${uid}-grain)`} opacity="0.17" style={{ mixBlendMode: "overlay" }} />
      </g>

      {showStamp && (
        <text x="96" y="70.5" textAnchor="end"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="3.5" fontWeight="700" letterSpacing="0.3"
          fill="#FF8A2B" opacity="0.95"
          style={{ filter: "drop-shadow(0 0 0.9px rgba(255,110,10,.75))" }}>
          {stamp(year, index)}
        </text>
      )}
    </svg>
  );
}

type SD = {
  hi: string; mid: string; lo: string; uid: string;
  bloom: number; contrast: number; seed: string;
};

/* ----------------------------------------------------------- 0 · HORIZON */
function Horizon({ uid, hi, mid, lo, bloom, seed }: SD) {
  const rnd = seeded(seed);
  const h = 40 + rnd() * 12;
  const sunX = 18 + rnd() * 60;
  const sunY = h - 14 - rnd() * 10;
  const skyTop = lift(hi, 26);
  const skyLow = mix(hi, mid, 0.75);
  const far = mix(mid, lo, 0.5);
  const near = mix(mid, lo, 0.8);
  return (
    <>
      <linearGradient id={`${uid}-h-sky`} x1="0" y1="0" x2="0.12" y2="1">
        <stop offset="0%" stopColor={skyTop} />
        <stop offset="58%" stopColor={mix(hi, mid, 0.4)} />
        <stop offset="100%" stopColor={skyLow} />
      </linearGradient>
      <linearGradient id={`${uid}-h-water`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={mix(mid, lo, 0.3)} />
        <stop offset="100%" stopColor={lift(lo, -6)} />
      </linearGradient>
      <radialGradient id={`${uid}-h-sun`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor={WHITE} stopOpacity={0.6 + bloom * 0.4} />
        <stop offset="30%" stopColor={lift(hi, 40)} stopOpacity={0.5 * bloom + 0.2} />
        <stop offset="100%" stopColor={hi} stopOpacity="0" />
      </radialGradient>

      <rect width="100" height="75" fill={`url(#${uid}-h-sky)`} />
      {/* cloud streaks */}
      {[0, 1, 2, 3].map((i) => (
        <ellipse key={i} cx={8 + rnd() * 84} cy={4 + i * 7 + rnd() * 4}
          rx={16 + rnd() * 20} ry={1.4 + rnd() * 1.6}
          fill={lift(hi, 32)} opacity={0.3 + rnd() * 0.28} filter={`url(#${uid}-softer)`} />
      ))}
      <circle cx={sunX} cy={sunY} r="17" fill={`url(#${uid}-h-sun)`} />
      <circle cx={sunX} cy={sunY} r="3.2" fill={WHITE} opacity={0.55 + bloom * 0.4} filter={`url(#${uid}-soft)`} />

      {/* far ridge */}
      <path d={`M0 ${h - 2} L11 ${h - 8} L21 ${h - 4} L33 ${h - 10} L46 ${h - 5} L58 ${h - 9} L72 ${h - 3} L86 ${h - 7} L100 ${h - 3} L100 ${h + 1} L0 ${h + 1} Z`}
        fill={far} opacity="0.75" filter={`url(#${uid}-soft)`} />
      {/* near ridge */}
      <path d={`M0 ${h + 1} L18 ${h - 3} L34 ${h + 1} L52 ${h - 4} L70 ${h} L88 ${h - 3} L100 ${h} L100 ${h + 3} L0 ${h + 3} Z`}
        fill={near} filter={`url(#${uid}-soft)`} />

      <rect y={h + 2} width="100" height={75 - h - 2} fill={`url(#${uid}-h-water)`} />
      {/* water streaks */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={rnd() * 70} y={h + 5 + i * ((70 - h) / 6)} width={12 + rnd() * 30} height="0.7"
          fill={lift(mid, 30)} opacity={0.16 + rnd() * 0.22} filter={`url(#${uid}-soft)`} />
      ))}
      {/* sun reflection column */}
      <rect x={sunX - 2.4} y={h + 2} width="4.8" height={75 - h - 2}
        fill={lift(hi, 30)} opacity={0.14 + bloom * 0.2} filter={`url(#${uid}-softer)`} />

      {/* foreground silhouettes */}
      <g fill={lift(lo, -12)}>
        <ellipse cx={22 + rnd() * 8} cy={h + 14} rx="2.4" ry="3" filter={`url(#${uid}-soft)`} />
        <rect x={21.2 + rnd() * 8} y={h + 16} width="2.6" height="9" rx="1.2" filter={`url(#${uid}-soft)`} />
        <ellipse cx={73 + rnd() * 10} cy={h + 11} rx="1.9" ry="2.4" filter={`url(#${uid}-soft)`} />
        <rect x={72.4 + rnd() * 10} y={h + 12.5} width="2.2" height="7.5" rx="1" filter={`url(#${uid}-soft)`} />
      </g>
      {/* foreground shore */}
      <path d="M0 75 L0 66 Q 26 63, 52 68 T 100 64 L100 75 Z" fill={lift(lo, -18)} opacity="0.9" filter={`url(#${uid}-soft)`} />
    </>
  );
}

/* -------------------------------------------------------- 1 · NIGHT BOKEH */
function NightBokeh({ uid, hi, mid, lo, bloom, seed }: SD) {
  const rnd = seeded(seed);
  const sky = 40 + rnd() * 8;
  const discs = Array.from({ length: 22 }).map(() => ({
    x: rnd() * 100, y: rnd() * 62, r: 1 + rnd() * 4.6, o: 0.3 + rnd() * 0.6,
  }));
  return (
    <>
      <linearGradient id={`${uid}-n-sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={lift(lo, -10)} />
        <stop offset="60%" stopColor={mix(lo, mid, 0.28)} />
        <stop offset="100%" stopColor={mix(lo, hi, 0.14)} />
      </linearGradient>
      <rect width="100" height="75" fill={`url(#${uid}-n-sky)`} />

      {/* skyline */}
      {Array.from({ length: 12 }).map((_, i) => {
        const w = 6 + rnd() * 8;
        const hh = 12 + rnd() * 30;
        const x = i * 8.8 - 2;
        return (
          <g key={i}>
            <rect x={x} y={sky - hh} width={w} height={hh + 36} fill={lift(lo, -16)} />
            {Array.from({ length: 8 }).map((_, j) => (
              <rect key={j} x={x + 1.2 + (j % 2) * 3} y={sky - hh + 3 + Math.floor(j / 2) * 5}
                width="1.8" height="2.4" fill={lift(hi, 20)} opacity={rnd() > 0.45 ? 0.55 + rnd() * 0.4 : 0.06} />
            ))}
          </g>
        );
      })}

      {/* bokeh */}
      <g filter={`url(#${uid}-bokeh)`}>
        {discs.map((d, i) => (
          <g key={i}>
            <circle cx={d.x} cy={d.y} r={d.r}
              fill={i % 3 === 0 ? lift(hi, 30) : i % 3 === 1 ? mid : mix(hi, mid, 0.45)}
              opacity={d.o * (0.55 + bloom * 0.5)} />
            <circle cx={d.x} cy={d.y} r={d.r * 0.55} fill={WHITE} opacity={d.o * 0.35 * (0.4 + bloom)} />
          </g>
        ))}
      </g>

      {/* wet road */}
      <rect y="58" width="100" height="17" fill={lift(lo, -8)} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={6 + rnd() * 84} y={60 + rnd() * 13} width={2 + rnd() * 9} height="1"
          fill={lift(hi, 10)} opacity={0.2 + rnd() * 0.3} filter={`url(#${uid}-soft)`} />
      ))}
      <ellipse cx={26 + rnd() * 46} cy="64" rx="20" ry="5"
        fill={mix(hi, mid, 0.4)} opacity={0.16 + bloom * 0.24} filter={`url(#${uid}-softer)`} />
      {/* passing figure */}
      <g fill={lift(lo, -22)} filter={`url(#${uid}-soft)`}>
        <ellipse cx="72" cy="48" rx="2.6" ry="3.2" />
        <rect x="70.8" y="50" width="3.2" height="12" rx="1.4" />
      </g>
    </>
  );
}

/* ------------------------------------------------------ 2 · FLASH PORTRAIT */
function FlashPortrait({ uid, hi, mid, lo, bloom, seed }: SD) {
  const rnd = seeded(seed);
  const cx = 40 + rnd() * 22;
  const tilt = (rnd() - 0.5) * 8;
  const headR = 15 + rnd() * 3.5;
  const headY = 30 + rnd() * 5;
  const skin = mix(hi, "#f0c8a4", 0.5);
  return (
    <>
      <radialGradient id={`${uid}-f-wall`} cx="0.5" cy="0.4" r="0.72">
        <stop offset="0%" stopColor={mix(mid, hi, 0.35)} />
        <stop offset="60%" stopColor={mix(mid, lo, 0.42)} />
        <stop offset="100%" stopColor={lift(lo, -6)} />
      </radialGradient>
      <rect width="100" height="75" fill={`url(#${uid}-f-wall)`} />

      {/* background: a doorway and a picture frame, blown out at the edges */}
      <rect x={4 + rnd() * 8} y="6" width={17} height={44} fill={lift(lo, -4)} opacity="0.55" filter={`url(#${uid}-soft)`} />
      <rect x={78 + rnd() * 6} y="12" width={13} height="17" fill={mix(mid, hi, 0.3)} opacity="0.5" filter={`url(#${uid}-soft)`} />

      {/* hard flash shadow, offset down-right */}
      <ellipse cx={cx + 9} cy={headY + 26} rx={headR * 1.9} ry={headR * 2.1}
        fill={lift(lo, -14)} opacity="0.5" filter={`url(#${uid}-softer)`} />

      <g transform={`rotate(${tilt} ${cx} ${headY})`}>
        {/* shoulders — cropped by the frame */}
        <path d={`M ${cx - headR * 2.5} 75 Q ${cx - headR * 2} ${headY + headR * 1.5}, ${cx} ${headY + headR * 1.15}
                  Q ${cx + headR * 2} ${headY + headR * 1.5}, ${cx + headR * 2.5} 75 Z`}
          fill={mix(mid, hi, 0.42)} />
        {/* neck */}
        <rect x={cx - headR * 0.34} y={headY + headR * 0.5} width={headR * 0.68} height={headR * 0.9}
          fill={mix(skin, lo, 0.3)} />
        {/* head */}
        <ellipse cx={cx} cy={headY} rx={headR * 0.78} ry={headR} fill={skin} />
        {/* hair */}
        <path d={`M ${cx - headR * 0.82} ${headY + headR * 0.12}
                  Q ${cx - headR * 0.95} ${headY - headR * 1.1}, ${cx} ${headY - headR * 1.05}
                  Q ${cx + headR * 0.95} ${headY - headR * 1.1}, ${cx + headR * 0.82} ${headY + headR * 0.12}
                  Q ${cx + headR * 0.6} ${headY - headR * 0.45}, ${cx} ${headY - headR * 0.5}
                  Q ${cx - headR * 0.6} ${headY - headR * 0.45}, ${cx - headR * 0.82} ${headY + headR * 0.12} Z`}
          fill={mix(lo, mid, 0.18)} />
        {/* out-of-focus features — shadow side only, never drawn as a face */}
        <ellipse cx={cx + headR * 0.42} cy={headY + headR * 0.12} rx={headR * 0.42} ry={headR * 0.7}
          fill={mix(skin, lo, 0.32)} opacity="0.55" filter={`url(#${uid}-soft)`} />
        {/* flash hotspot on the forehead */}
        <ellipse cx={cx - headR * 0.16} cy={headY - headR * 0.42} rx={headR * 0.38} ry={headR * 0.3}
          fill={WHITE} opacity={0.24 + bloom * 0.3} filter={`url(#${uid}-soft)`} />
      </g>

      {/* corner falloff — the signature of a direct on-camera flash */}
      <radialGradient id={`${uid}-f-fall`} cx="0.5" cy="0.44" r="0.6">
        <stop offset="45%" stopColor={BLACK} stopOpacity="0" />
        <stop offset="100%" stopColor={BLACK} stopOpacity="0.4" />
      </radialGradient>
      <rect width="100" height="75" fill={`url(#${uid}-f-fall)`} />
    </>
  );
}

/* ------------------------------------------------------------ 3 · INTERIOR */
function Interior({ uid, hi, mid, lo, bloom, seed }: SD) {
  const rnd = seeded(seed);
  const wx = 9 + rnd() * 12;
  const table = 50 + rnd() * 5;
  return (
    <>
      <linearGradient id={`${uid}-i-wall`} x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stopColor={mix(mid, hi, 0.28)} />
        <stop offset="100%" stopColor={mix(lo, mid, 0.42)} />
      </linearGradient>
      <linearGradient id={`${uid}-i-glass`} x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0%" stopColor={lift(hi, 46)} />
        <stop offset="100%" stopColor={mix(hi, mid, 0.4)} />
      </linearGradient>
      <rect width="100" height="75" fill={`url(#${uid}-i-wall)`} />

      {/* window */}
      <rect x={wx - 1.6} y="6.4" width="33.2" height="37.2" fill={lift(lo, 4)} opacity="0.8" />
      <rect x={wx} y="8" width="30" height="34" fill={`url(#${uid}-i-glass)`} />
      <rect x={wx + 14.4} y="8" width="1.2" height="34" fill={lift(lo, 10)} opacity="0.85" />
      <rect x={wx} y="24.4" width="30" height="1.2" fill={lift(lo, 10)} opacity="0.85" />
      {/* what's outside — soft blobs */}
      <ellipse cx={wx + 8} cy="30" rx="9" ry="7" fill={mix(mid, hi, 0.5)} opacity="0.5" filter={`url(#${uid}-softer)`} />
      <ellipse cx={wx + 23} cy="18" rx="7" ry="6" fill={lift(hi, 30)} opacity="0.55" filter={`url(#${uid}-softer)`} />

      {/* light shaft */}
      <path d={`M ${wx} 42 L ${wx + 30} 42 L ${wx + 56} 75 L ${wx - 14} 75 Z`}
        fill={lift(hi, 34)} opacity={0.2 + bloom * 0.22} filter={`url(#${uid}-softer)`} />

      {/* plant */}
      <g filter={`url(#${uid}-soft)`}>
        <rect x="68" y="36" width="9" height="12" rx="1.4" fill={mix(mid, lo, 0.4)} />
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse key={i} cx={72.5 + (i - 2) * 4.6} cy={30 - Math.abs(i - 2) * 1.6}
            rx="2.6" ry="6" fill={mix(mid, lo, 0.2 + i * 0.06)}
            transform={`rotate(${(i - 2) * 22} ${72.5 + (i - 2) * 4.6} ${30 - Math.abs(i - 2) * 1.6})`} />
        ))}
      </g>

      {/* table */}
      <rect y={table} width="100" height={75 - table} fill={mix(mid, lo, 0.28)} />
      <rect y={table} width="100" height="1.4" fill={lift(hi, 16)} opacity="0.6" />
      {/* cup + book */}
      <g filter={`url(#${uid}-soft)`}>
        <rect x="52" y={table - 9} width="8" height="9" rx="1" fill={lift(hi, 22)} />
        <rect x="59.6" y={table - 6.5} width="2.6" height="4" rx="1.3" fill="none" stroke={lift(hi, 14)} strokeWidth="1" />
        <ellipse cx="56" cy={table + 1.2} rx="6" ry="1.6" fill={lift(lo, -8)} opacity="0.45" />
        <rect x="76" y={table - 4} width="17" height="4" rx="0.6" fill={mix(mid, lo, 0.45)} />
        <rect x="76" y={table - 6.4} width="17" height="2.6" rx="0.6" fill={mix(hi, mid, 0.4)} />
      </g>
      <rect y="70" width="100" height="5" fill={lift(lo, -14)} opacity="0.4" filter={`url(#${uid}-softer)`} />
    </>
  );
}

/* -------------------------------------------------------------- 4 · STREET */
function Street({ uid, hi, mid, lo, bloom, seed }: SD) {
  const rnd = seeded(seed);
  const sky = 26 + rnd() * 10;
  const sunX = 66 + rnd() * 22;
  return (
    <>
      <linearGradient id={`${uid}-s-sky`} x1="0" y1="0" x2="0.1" y2="1">
        <stop offset="0%" stopColor={lift(hi, 22)} />
        <stop offset="70%" stopColor={mix(hi, mid, 0.55)} />
        <stop offset="100%" stopColor={mix(hi, mid, 0.85)} />
      </linearGradient>
      <radialGradient id={`${uid}-s-sun`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor={WHITE} stopOpacity={0.5 + bloom * 0.4} />
        <stop offset="100%" stopColor={hi} stopOpacity="0" />
      </radialGradient>

      <rect width="100" height="75" fill={`url(#${uid}-s-sky)`} />
      <circle cx={sunX} cy={9 + rnd() * 6} r="15" fill={`url(#${uid}-s-sun)`} />

      {/* left terrace */}
      {[0, 1, 2, 3].map((i) => {
        const w = 11 + rnd() * 8;
        const hh = 24 + rnd() * 26;
        const x = i * 11 - 5;
        const tone = mix(mid, lo, 0.4 + i * 0.11);
        return (
          <g key={`l${i}`}>
            <rect x={x} y={sky + 22 - hh} width={w} height={hh + 34} fill={tone} />
            <rect x={x} y={sky + 22 - hh} width={w} height="1.2" fill={lift(hi, 8)} opacity="0.35" />
            {Array.from({ length: 6 }).map((_, j) => (
              <rect key={j} x={x + 2 + (j % 2) * 5.4} y={sky + 28 - hh + Math.floor(j / 2) * 8.5}
                width="3.2" height="4.6" fill={lift(hi, 24)} opacity={0.2 + rnd() * 0.45} />
            ))}
          </g>
        );
      })}
      {/* right terrace */}
      {[0, 1, 2].map((i) => {
        const w = 13 + rnd() * 9;
        const hh = 26 + rnd() * 26;
        const x = 66 + i * 12.5;
        const tone = mix(mid, lo, 0.46 + i * 0.1);
        return (
          <g key={`r${i}`}>
            <rect x={x} y={sky + 20 - hh} width={w} height={hh + 36} fill={tone} />
            <rect x={x} y={sky + 20 - hh} width={w} height="1.2" fill={lift(hi, 8)} opacity="0.35" />
            {Array.from({ length: 6 }).map((_, j) => (
              <rect key={j} x={x + 2.4 + (j % 2) * 5.6} y={sky + 26 - hh + Math.floor(j / 2) * 8.5}
                width="3.4" height="4.8" fill={lift(hi, 24)} opacity={0.18 + rnd() * 0.45} />
            ))}
          </g>
        );
      })}

      {/* road */}
      <path d="M0 75 L36 44 L64 44 L100 75 Z" fill={mix(lo, mid, 0.3)} />
      <path d="M0 75 L36 44 L64 44 L100 75 Z" fill={lift(hi, 20)} opacity={0.06 + bloom * 0.12} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={49.4 - i * 0.9} y={47 + i * 6.5} width={1.2 + i * 0.8} height={2.6 + i * 1.4}
          fill={lift(hi, 26)} opacity="0.45" />
      ))}
      {/* kerbs */}
      <path d="M0 75 L36 44 L38 44 L4 75 Z" fill={lift(hi, 12)} opacity="0.22" />
      <path d="M100 75 L64 44 L62 44 L96 75 Z" fill={lift(hi, 12)} opacity="0.22" />

      {/* car */}
      <g filter={`url(#${uid}-soft)`}>
        <rect x="42" y="45" width="13" height="5" rx="2" fill={mix(mid, lo, 0.55)} />
        <rect x="44.6" y="42.4" width="7.6" height="3.4" rx="1.6" fill={mix(mid, lo, 0.35)} />
        <circle cx="45" cy="50.4" r="1.5" fill={lift(lo, -12)} />
        <circle cx="52.4" cy="50.4" r="1.5" fill={lift(lo, -12)} />
      </g>
      {/* lamp post */}
      <g fill={lift(lo, -10)}>
        <rect x="27" y="26" width="1.4" height="26" />
        <rect x="27" y="26" width="7" height="1.2" />
        <circle cx="34.4" cy="27.6" r="1.8" fill={lift(hi, 34)} opacity={0.6 + bloom * 0.35} />
      </g>
      {/* pedestrian */}
      <g fill={lift(lo, -18)} filter={`url(#${uid}-soft)`}>
        <ellipse cx="31" cy="47" rx="2" ry="2.5" />
        <rect x="29.9" y="48.8" width="2.4" height="9" rx="1.1" />
      </g>
    </>
  );
}
