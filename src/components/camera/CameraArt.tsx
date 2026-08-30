import * as React from "react";
import type { Form } from "@/data/products";
import { seeded, r3 } from "@/lib/utils";

type Props = {
  form: Form;
  body: string;
  bodyDark: string;
  trim: string;
  view?: "front" | "back";
  brand?: string;
  model?: string;
  uid: string;
  /** stable seed for per-model shape variation — defaults to uid */
  seed?: string;
  className?: string;
  powered?: boolean;
};

type Base = {
  w: number; h: number; rx: number;
  lensR: number; lensCx: number;
  grip: "none" | "ridge" | "bulge" | "bolts";
  hotshoe: boolean; finder: boolean; hump: boolean; swivel: boolean;
  topPlate: number;
};

const BASE: Record<Form, Base> = {
  slim:    { w: 360, h: 150, rx: 15, lensR: 44, lensCx: 0.31, grip: "none",  hotshoe: false, finder: false, hump: false, swivel: false, topPlate: 12 },
  compact: { w: 352, h: 176, rx: 13, lensR: 54, lensCx: 0.33, grip: "ridge", hotshoe: false, finder: true,  hump: false, swivel: false, topPlate: 15 },
  boxy:    { w: 344, h: 206, rx: 9,  lensR: 66, lensCx: 0.35, grip: "bulge", hotshoe: true,  finder: true,  hump: false, swivel: false, topPlate: 19 },
  rugged:  { w: 356, h: 172, rx: 28, lensR: 50, lensCx: 0.30, grip: "bolts", hotshoe: false, finder: false, hump: false, swivel: false, topPlate: 13 },
  bridge:  { w: 306, h: 198, rx: 11, lensR: 74, lensCx: 0.40, grip: "bulge", hotshoe: true,  finder: true,  hump: true,  swivel: false, topPlate: 20 },
  swivel:  { w: 228, h: 194, rx: 11, lensR: 78, lensCx: 0.00, grip: "bulge", hotshoe: false, finder: true,  hump: false, swivel: true,  topPlate: 16 },
};

function shade(hex: string, amt: number) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((x) => x + x).join("") : h, 16);
  const ch = (v: number) => Math.round(Math.min(255, Math.max(0, v + amt)));
  return `rgb(${ch((n >> 16) & 255)},${ch((n >> 8) & 255)},${ch(n & 255)})`;
}
function luma(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((x) => x + x).join("") : h, 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
}

export default function CameraArt({
  form, body, bodyDark, trim, view = "front", brand = "", model = "", uid, seed,
  className, powered = true,
}: Props) {
  const b = BASE[form];
  const rnd = seeded(seed ?? uid);
  const id = (s: string) => `ca-${uid}-${s}`.replace(/[^a-zA-Z0-9_-]/g, "");

  // ---- per-model variation ----
  const vW = r3(b.w * (0.93 + rnd() * 0.12));
  const vH = r3(b.h * (0.92 + rnd() * 0.15));
  const bx = r3(210 - vW / 2);
  const by = r3(158 - vH / 2);
  const rx = r3(b.rx * (0.7 + rnd() * 0.85));
  const lensR = r3(b.lensR * (0.88 + rnd() * 0.24));
  const lensCx = r3(b.swivel ? 0 : bx + vW * (b.lensCx + (rnd() - 0.5) * 0.09));
  const lensCy = r3(by + vH * (0.5 + (rnd() - 0.5) * 0.1));
  const plateStyle = Math.floor(rnd() * 4);      // 0 none · 1 vertical band · 2 inset panel · 3 lower band
  const flashRound = rnd() > 0.55;
  const finderWide = rnd() > 0.5;
  const showFinder = b.finder || rnd() > 0.72;
  const brandRight = rnd() > 0.35;
  const light = luma(body) > 0.55;
  const inkOnBody = light ? shade(bodyDark, -46) : shade(body, 74);
  const topPlateH = b.topPlate;

  const rightZone = bx + vW - (b.grip === "bulge" ? 84 : 20);
  const flashW = flashRound ? 30 : 42;
  const flashX = rightZone - flashW - 6;
  const flashY = by + Math.max(14, vH * 0.11);

  return (
    <svg
      viewBox="0 0 420 304"
      className={className}
      role="img"
      aria-label={`${brand} ${model} — ${view} view illustration`}
      style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
    >
      <defs>
        <linearGradient id={id("body")} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor={shade(body, 22)} />
          <stop offset="40%" stopColor={body} />
          <stop offset="100%" stopColor={bodyDark} />
        </linearGradient>
        <linearGradient id={id("top")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shade(body, 52)} />
          <stop offset="100%" stopColor={shade(body, 8)} />
        </linearGradient>
        <linearGradient id={id("sheen")} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="34%" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id("glass")} cx="0.36" cy="0.3" r="0.85">
          <stop offset="0%" stopColor="#54798e" />
          <stop offset="32%" stopColor="#1f3446" />
          <stop offset="70%" stopColor="#0c151d" />
          <stop offset="100%" stopColor="#04080b" />
        </radialGradient>
        <radialGradient id={id("flare")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#9fe6ff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#9fe6ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("ring")} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor={shade(trim, 66)} />
          <stop offset="44%" stopColor={trim} />
          <stop offset="100%" stopColor={shade(trim, -38)} />
        </linearGradient>
        <linearGradient id={id("lcd")} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor={powered ? "#2b4c55" : "#141719"} />
          <stop offset="55%" stopColor={powered ? "#14303a" : "#0e1113"} />
          <stop offset="100%" stopColor={powered ? "#0b1f27" : "#090b0d"} />
        </linearGradient>
        <linearGradient id={id("flash")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffdf2" />
          <stop offset="55%" stopColor="#e6dabd" />
          <stop offset="100%" stopColor="#968e7c" />
        </linearGradient>
        <filter id={id("drop")} x="-35%" y="-35%" width="170%" height="190%">
          <feDropShadow dx="0" dy="16" stdDeviation="15" floodColor="#000" floodOpacity="0.36" />
        </filter>
        <clipPath id={id("clip")}>
          <rect x={bx} y={by} width={vW} height={vH} rx={rx} />
        </clipPath>
      </defs>

      <ellipse cx="210" cy={by + vH + 18} rx={vW * 0.42} ry="10" fill="#000" opacity="0.16" />

      <g filter={`url(#${id("drop")})`}>
        {/* flash hump */}
        {b.hump && <rect x={bx + vW / 2 - 42} y={by - 34} width="84" height="44" rx="6" fill={`url(#${id("top")})`} />}

        {/* top plate — gives the body real depth */}
        <rect x={bx + 6} y={by - topPlateH} width={vW - 12} height={topPlateH + 14} rx={Math.min(10, rx)} fill={`url(#${id("top")})`} />
        <rect x={bx + 6} y={by - topPlateH} width={vW - 12} height={topPlateH + 14} rx={Math.min(10, rx)} fill="none" stroke="#000" strokeOpacity="0.16" />
        {/* shutter button + zoom collar */}
        <circle cx={bx + vW - 46} cy={by - topPlateH / 2 + 1} r={topPlateH * 0.42} fill={shade(trim, 20)} />
        <circle cx={bx + vW - 46} cy={by - topPlateH / 2 + 1} r={topPlateH * 0.42} fill="none" stroke="#000" strokeOpacity="0.3" />
        <circle cx={bx + vW - 46} cy={by - topPlateH / 2 + 1} r={topPlateH * 0.68} fill="none" stroke={shade(bodyDark, -14)} strokeWidth="2.6" opacity="0.8" />
        <rect x={bx + vW - 96} y={by - topPlateH / 2 - 3} width="22" height="6" rx="3" fill={shade(bodyDark, -14)} opacity="0.85" />
        {/* speaker holes on top plate */}
        {Array.from({ length: 5 }).map((_, i) => (
          <circle key={i} cx={bx + 26 + i * 7} cy={by - topPlateH / 2 + 1} r="1.5" fill="#000" opacity="0.28" />
        ))}
        {b.hotshoe && <rect x={bx + vW / 2 - 17} y={by - topPlateH - (b.hump ? 22 : 7)} width="34" height="8" rx="2" fill={shade(trim, -18)} />}

        {/* swivel barrel */}
        {b.swivel && (
          <g>
            <rect x="20" y={by - 4} width="146" height={vH + 8} rx="34" fill={`url(#${id("body")})`} />
            <rect x="20" y={by - 4} width="146" height={vH + 8} rx="34" fill={`url(#${id("sheen")})`} />
            <rect x="150" y={by + 6} width="16" height={vH - 12} rx="8" fill={shade(bodyDark, -20)} opacity="0.5" />
          </g>
        )}

        {/* main body */}
        <rect x={bx} y={by} width={vW} height={vH} rx={rx} fill={`url(#${id("body")})`} />

        <g clipPath={`url(#${id("clip")})`}>
          {/* faceplate treatments */}
          {view === "front" && plateStyle === 1 && (
            <rect x={bx} y={by} width={vW * 0.46} height={vH} fill="#000" opacity={light ? 0.07 : 0.14} />
          )}
          {view === "front" && plateStyle === 2 && (
            <rect x={bx + 12} y={by + 12} width={vW - 24} height={vH - 24} rx={Math.max(4, rx - 6)}
              fill="none" stroke={shade(trim, light ? -20 : 30)} strokeOpacity="0.4" strokeWidth="1.4" />
          )}
          {view === "front" && plateStyle === 3 && (
            <rect x={bx} y={by + vH * 0.68} width={vW} height={vH * 0.32} fill="#000" opacity={light ? 0.08 : 0.16} />
          )}

          <rect x={bx} y={by} width={vW} height={Math.max(9, vH * 0.15)} fill="#fff" opacity="0.12" />
          <rect x={bx} y={by + vH - 20} width={vW} height="20" fill="#000" opacity="0.15" />
          <rect x={bx} y={by} width={vW} height={vH} fill={`url(#${id("sheen")})`} />

          {view === "front" ? (
            <>
              {b.grip === "bulge" && (
                <>
                  <rect x={bx + vW - 80} y={by} width="80" height={vH} fill="#000" opacity="0.13" />
                  {Array.from({ length: 8 }).map((_, i) => (
                    <rect key={i} x={bx + vW - 66 + i * 6} y={by + 22} width="2.2" height={vH - 44} rx="1.1" fill="#000" opacity="0.19" />
                  ))}
                </>
              )}
              {b.grip === "ridge" && (
                <>
                  <rect x={bx + vW - 54} y={by + 18} width="38" height={vH - 36} rx="8" fill="#000" opacity="0.12" />
                  {Array.from({ length: 5 }).map((_, i) => (
                    <rect key={i} x={bx + vW - 46 + i * 7} y={by + 30} width="2" height={vH - 60} rx="1" fill="#000" opacity="0.2" />
                  ))}
                </>
              )}
              {b.grip === "bolts" &&
                [[bx + 22, by + 22], [bx + vW - 22, by + 22], [bx + 22, by + vH - 22], [bx + vW - 22, by + vH - 22]].map(([x, y], i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r="6.5" fill={shade(trim, 16)} />
                    <circle cx={x} cy={y} r="3" fill={shade(bodyDark, -24)} />
                  </g>
                ))}
            </>
          ) : (
            <>
              <rect x={bx + vW - 74} y={by + 16} width="56" height="40" rx="7" fill="#000" opacity="0.11" />
              {Array.from({ length: 18 }).map((_, i) => (
                <circle key={i} cx={bx + vW - 64 + (i % 6) * 9} cy={by + 26 + Math.floor(i / 6) * 9} r="1.4" fill="#000" opacity="0.24" />
              ))}
            </>
          )}
        </g>

        <rect x={bx} y={by} width={vW} height={vH} rx={rx} fill="none" stroke="#000" strokeOpacity="0.22" strokeWidth="1.2" />
        <rect x={bx + 1.2} y={by + 1.2} width={vW - 2.4} height={vH - 2.4} rx={Math.max(0, rx - 1)} fill="none" stroke="#fff" strokeOpacity="0.15" />

        {view === "front" ? (
          <>
            {/* lens */}
            <g>
              <circle cx={lensCx} cy={lensCy} r={lensR + 6} fill={shade(bodyDark, -18)} opacity="0.45" />
              <circle cx={lensCx} cy={lensCy} r={lensR + 2.5} fill={`url(#${id("ring")})`} />
              <circle cx={lensCx} cy={lensCy} r={lensR - 3} fill={shade(bodyDark, -32)} />
              <circle cx={lensCx} cy={lensCy} r={lensR - 8} fill="#080e14" />
              <circle cx={lensCx} cy={lensCy} r={lensR - 12} fill={`url(#${id("glass")})`} />
              <circle cx={lensCx} cy={lensCy} r={lensR * 0.6} fill="none" stroke="#7fd0ff" strokeOpacity="0.15" />
              <circle cx={lensCx} cy={lensCy} r={lensR * 0.42} fill="none" stroke="#e0a24a" strokeOpacity="0.2" strokeWidth="1.3" />
              <ellipse cx={lensCx - lensR * 0.3} cy={lensCy - lensR * 0.34} rx={lensR * 0.36} ry={lensR * 0.22}
                fill={`url(#${id("flare")})`} opacity="0.7"
                transform={`rotate(-28 ${lensCx - lensR * 0.3} ${lensCy - lensR * 0.34})`} />
              <path d={`M ${lensCx - lensR * 0.6} ${lensCy + lensR * 0.22} A ${lensR * 0.64} ${lensR * 0.64} 0 0 1 ${lensCx - lensR * 0.08} ${lensCy - lensR * 0.58}`}
                fill="none" stroke="#fff" strokeOpacity="0.26" strokeWidth={Math.max(1.4, lensR * 0.05)} strokeLinecap="round" />
              {Array.from({ length: 40 }).map((_, i) => {
                const a = (i / 40) * Math.PI * 2;
                return <line key={i}
                  x1={r3(lensCx + Math.cos(a) * (lensR + 0.5))} y1={r3(lensCy + Math.sin(a) * (lensR + 0.5))}
                  x2={r3(lensCx + Math.cos(a) * (lensR - 2))} y2={r3(lensCy + Math.sin(a) * (lensR - 2))}
                  stroke="#000" strokeOpacity="0.28" strokeWidth="1" />;
              })}
            </g>

            {/* flash */}
            {flashRound ? (
              <g>
                <circle cx={flashX + 15} cy={flashY + 12} r="12.5" fill={shade(bodyDark, -24)} />
                <circle cx={flashX + 15} cy={flashY + 12} r="10" fill={shade(trim, -20)} />
                <circle cx={flashX + 15} cy={flashY + 12} r="7.6" fill={`url(#${id("flash")})`} />
                <ellipse cx={flashX + 12.6} cy={flashY + 9.6} rx="2.6" ry="2" fill="#fff" opacity="0.6"
                  transform={`rotate(-30 ${flashX + 12.6} ${flashY + 9.6})`} />
              </g>
            ) : (
              <g>
                <rect x={flashX} y={flashY} width={flashW} height="24" rx="4.5" fill={shade(bodyDark, -22)} />
                <rect x={flashX + 3} y={flashY + 3} width={flashW - 6} height="18" rx="3" fill={`url(#${id("flash")})`} />
                {Array.from({ length: 3 }).map((_, i) => (
                  <line key={i} x1={flashX + 11 + i * 9} y1={flashY + 4} x2={flashX + 11 + i * 9} y2={flashY + 20}
                    stroke="#000" strokeOpacity="0.13" />
                ))}
              </g>
            )}

            {/* AF assist */}
            <circle cx={flashX - 16} cy={flashY + 13} r="6" fill={shade(bodyDark, -26)} />
            <circle cx={flashX - 16} cy={flashY + 13} r="3.4" fill="#c9502a" opacity="0.9" />

            {/* optical finder */}
            {showFinder && (
              <g>
                <rect x={flashX - (finderWide ? 66 : 52)} y={flashY + 1} width={finderWide ? 40 : 28} height="22" rx="3" fill={shade(bodyDark, -28)} />
                <rect x={flashX - (finderWide ? 63 : 49)} y={flashY + 4} width={finderWide ? 34 : 22} height="16" rx="2" fill="#16262e" />
                <rect x={flashX - (finderWide ? 61 : 47)} y={flashY + 6} width="12" height="5" rx="1" fill="#fff" opacity="0.2" />
              </g>
            )}

            {/* mic + model plate */}
            {Array.from({ length: 3 }).map((_, i) => (
              <circle key={i} cx={bx + 22 + i * 7} cy={by + vH - 18} r="1.7" fill="#000" opacity="0.3" />
            ))}

            <text
              x={brandRight ? bx + vW - 18 : bx + 18}
              y={by + vH - 15}
              textAnchor={brandRight ? "end" : "start"}
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fontSize="10.5" fontWeight="600" letterSpacing="2.6"
              fill={inkOnBody} opacity="0.9"
            >
              {brand.toUpperCase()}
            </text>
          </>
        ) : (
          <>
            <rect x={bx + 16} y={by + 18} width={vW * 0.52} height={vH - 38} rx="4" fill={shade(bodyDark, -28)} />
            <rect x={bx + 20} y={by + 22} width={vW * 0.52 - 8} height={vH - 46} rx="2" fill={`url(#${id("lcd")})`} />
            {powered && (
              <g>
                <rect x={bx + 30} y={by + 32} width={vW * 0.52 - 28} height={vH - 66} fill="none"
                  stroke="#8ff0c0" strokeOpacity="0.28" strokeDasharray="6 5" />
                <rect x={bx + vW * 0.26 - 13} y={by + vH / 2 - 13} width="26" height="26" fill="none" stroke="#8ff0c0" strokeOpacity="0.6" strokeWidth="1.4" />
                <text x={bx + 30} y={by + vH - 32} fontFamily="ui-monospace, monospace" fontSize="9" fill="#8ff0c0" opacity="0.8">F2.8</text>
                <text x={bx + vW * 0.52 - 4} y={by + vH - 32} textAnchor="end" fontFamily="ui-monospace, monospace" fontSize="9" fill="#ffb36b" opacity="0.85">1/60</text>
                <circle cx={bx + 36} cy={by + 32} r="3" fill="#ff5f45" />
              </g>
            )}

            <circle cx={bx + vW - 58} cy={by + 40} r="21" fill={shade(bodyDark, -14)} />
            <circle cx={bx + vW - 58} cy={by + 40} r="17" fill={`url(#${id("ring")})`} opacity="0.5" />
            {Array.from({ length: 10 }).map((_, i) => {
              const a = (i / 10) * Math.PI * 2;
              return <line key={i}
                x1={r3(bx + vW - 58 + Math.cos(a) * 17)} y1={r3(by + 40 + Math.sin(a) * 17)}
                x2={r3(bx + vW - 58 + Math.cos(a) * 12)} y2={r3(by + 40 + Math.sin(a) * 12)}
                stroke="#000" strokeOpacity="0.38" strokeWidth="1.6" />;
            })}
            <circle cx={bx + vW - 58} cy={by + 40} r="6.5" fill={shade(bodyDark, -22)} />

            <circle cx={bx + vW - 58} cy={by + vH - 56} r="28" fill={shade(bodyDark, -12)} />
            <circle cx={bx + vW - 58} cy={by + vH - 56} r="24" fill={shade(body, -10)} />
            {[[0, -1], [1, 0], [0, 1], [-1, 0]].map(([dx, dy], i) => (
              <path key={i}
                d={`M ${bx + vW - 58 + dx * 14 - dy * 4.5} ${by + vH - 56 + dy * 14 + dx * 4.5}
                    L ${bx + vW - 58 + dx * 19} ${by + vH - 56 + dy * 19}
                    L ${bx + vW - 58 + dx * 14 + dy * 4.5} ${by + vH - 56 + dy * 14 - dx * 4.5} Z`}
                fill="#000" opacity="0.38" />
            ))}
            <circle cx={bx + vW - 58} cy={by + vH - 56} r="9" fill={shade(bodyDark, -20)} />

            {[0, 1, 2].map((i) => (
              <rect key={i} x={bx + vW - 116} y={by + 26 + i * 24} width="24" height="12" rx="6"
                fill={shade(bodyDark, -10)} stroke="#fff" strokeOpacity="0.07" />
            ))}
            <circle cx={bx + vW - 22} cy={by + 22} r="3.4" fill={powered ? "#7ef08a" : "#3a3a3a"} />
          </>
        )}
      </g>
    </svg>
  );
}
