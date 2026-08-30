export type Form = "compact" | "slim" | "boxy" | "rugged" | "bridge" | "swivel";
export type Condition = "Mint" | "Excellent" | "Good" | "Well-Loved";
export type Era = "Y2K" | "Mid 2000s" | "Late 2000s" | "Early 2010s";
export type Badge = "new-in" | "staff-pick" | "last-one" | "restored" | "trending" | "rare";

export type ColorVariant = {
  name: string;
  body: string;
  bodyDark: string;
  trim: string;
  stock: number;
};

export type Look = {
  name: string;
  a: string;
  b: string;
  c: string;
  bloom: number;
  contrast: number;
};

export type Product = {
  id: number;
  slug: string;
  brand: string;
  model: string;
  tagline: string;
  price: number;
  compareAt?: number;
  year: number;
  era: Era;
  condition: Condition;
  form: Form;
  rating: number;
  reviews: number;
  stock: number;
  mp: number;
  zoom: string;
  sensor: string;
  screen: string;
  iso: string;
  media: string;
  battery: string;
  weight: number;
  dims: string;
  video: string;
  colors: ColorVariant[];
  look: Look;
  tags: string[];
  badges: Badge[];
  story: string;
  includes: string[];
  quirks: string[];
};

const c = (name: string, body: string, bodyDark: string, trim: string, stock = 3): ColorVariant => ({
  name, body, bodyDark, trim, stock,
});

export const products: Product[] = [
  {
    id: 1, slug: "canon-powershot-sd1100", brand: "Canon", model: "PowerShot SD1100 IS",
    tagline: "The one everybody's aunt owned, and for good reason.",
    price: 189, compareAt: 240, year: 2008, era: "Late 2000s", condition: "Excellent",
    form: "slim", rating: 4.8, reviews: 214, stock: 6,
    mp: 8, zoom: "3× optical", sensor: '1/2.5" CCD', screen: '2.5" LCD', iso: "80–1600",
    media: "SD / SDHC", battery: "NB-4L", weight: 133, dims: "86 × 54 × 22 mm", video: "640×480 @ 30fps",
    colors: [
      c("Silver", "#D9D6D0", "#A9A5A0", "#6E6A66", 4),
      c("Blush Pink", "#E9BFC0", "#C3969A", "#7A5B5F", 1),
      c("Ink Blue", "#7E93AE", "#54677F", "#31414F", 1),
    ],
    look: { name: "Clean Daylight", a: "#F3E4CE", b: "#9FB6C4", c: "#2E3742", bloom: 0.35, contrast: 1.05 },
    tags: ["pocketable", "flash-friendly", "beginner"],
    badges: ["staff-pick", "restored"],
    story: "Canon's Digital ELPH line is the reason the digicam look is having a moment. The SD1100 renders skin warm, blows out highlights just enough, and fits in the coin pocket of a pair of jeans.",
    includes: ["Battery + charger", "2GB SD card", "Wrist strap", "GRAIN 90-day warranty"],
    quirks: ["Faint scuff on the base plate", "Battery door hinge slightly stiff"],
  },
  {
    id: 2, slug: "sony-cybershot-dsc-w200", brand: "Sony", model: "Cyber-shot DSC-W200",
    tagline: "12 megapixels of pure 2007 optimism.",
    price: 235, year: 2007, era: "Late 2000s", condition: "Mint",
    form: "compact", rating: 4.6, reviews: 138, stock: 3,
    mp: 12, zoom: "3× Carl Zeiss", sensor: '1/1.7" CCD', screen: '2.5" LCD', iso: "100–3200",
    media: "Memory Stick PRO Duo", battery: "NP-BG1", weight: 180, dims: "92 × 58 × 23 mm", video: "640×480 @ 30fps",
    colors: [c("Graphite", "#4A4A4E", "#2C2C30", "#8C8C92", 2), c("Champagne", "#D8C7A6", "#AA9878", "#6A5F4A", 1)],
    look: { name: "Zeiss Punch", a: "#FFEFD6", b: "#7FA3B8", c: "#1E2530", bloom: 0.25, contrast: 1.18 },
    tags: ["high-res", "zeiss glass", "night mode"],
    badges: ["trending"],
    story: "The W200 was Sony flexing. A bigger sensor than its neighbours, a Zeiss badge, and a metal shell that still feels expensive eighteen years later.",
    includes: ["Battery + charger", "4GB Memory Stick", "Original case"],
    quirks: ["Needs Memory Stick media — one is included"],
  },
  {
    id: 3, slug: "nikon-coolpix-s6", brand: "Nikon", model: "Coolpix S6",
    tagline: "A wafer of brushed steel with Wi-Fi from 2006.",
    price: 168, compareAt: 210, year: 2006, era: "Mid 2000s", condition: "Good",
    form: "slim", rating: 4.2, reviews: 71, stock: 2,
    mp: 6, zoom: "3× optical", sensor: '1/2.5" CCD', screen: '3.0" LCD', iso: "50–800",
    media: "SD", battery: "EN-EL8", weight: 130, dims: "94 × 59 × 21 mm", video: "640×480 @ 30fps",
    colors: [c("Brushed Steel", "#C9CCCF", "#94989C", "#5A5E62", 2)],
    look: { name: "Cool Steel", a: "#E7EEF3", b: "#8FA0AC", c: "#262E36", bloom: 0.2, contrast: 0.95 },
    tags: ["big screen", "wi-fi", "flat body"],
    badges: ["rare"],
    story: "One of the first cameras that tried to send pictures over Wi-Fi, and the screen swallows the whole back panel. It is an object from a future that took another decade to arrive.",
    includes: ["Battery + charger", "2GB SD card"],
    quirks: ["Wi-Fi feature is period-accurate: it does not connect to anything modern", "Light screen scratch, invisible when on"],
  },
  {
    id: 4, slug: "olympus-stylus-720sw", brand: "Olympus", model: "Stylus 720 SW",
    tagline: "Waterproof, shockproof, unbothered.",
    price: 205, year: 2006, era: "Mid 2000s", condition: "Excellent",
    form: "rugged", rating: 4.7, reviews: 156, stock: 5,
    mp: 7, zoom: "3× optical", sensor: '1/2.33" CCD', screen: '2.5" LCD', iso: "64–1600",
    media: "xD-Picture Card", battery: "LI-42B", weight: 155, dims: "90 × 60 × 21 mm", video: "640×480 @ 30fps",
    colors: [c("Arctic Silver", "#CBD2D6", "#959CA1", "#3E464C", 3), c("Signal Blue", "#4E86B4", "#2F5B80", "#1B3448", 2)],
    look: { name: "Pool Blue", a: "#DFF3F6", b: "#63A8C0", c: "#173540", bloom: 0.4, contrast: 1.1 },
    tags: ["waterproof", "beach", "durable"],
    badges: ["staff-pick"],
    story: "Rated to three metres and a 1.5m drop. Take it in the ocean. That is the entire pitch and it still works.",
    includes: ["Battery + charger", "2GB xD card", "Carabiner strap", "New door gasket"],
    quirks: ["Gasket replaced by our techs — still, we don't warranty water damage"],
  },
  {
    id: 5, slug: "fujifilm-finepix-f31fd", brand: "Fujifilm", model: "FinePix F31fd",
    tagline: "The low-light legend. Still undefeated.",
    price: 340, year: 2006, era: "Mid 2000s", condition: "Excellent",
    form: "compact", rating: 4.9, reviews: 302, stock: 2,
    mp: 6, zoom: "3× Fujinon", sensor: '1/1.7" Super CCD HR', screen: '2.5" LCD', iso: "100–3200",
    media: "xD-Picture Card", battery: "NP-95", weight: 155, dims: "92 × 58 × 23 mm", video: "640×480 @ 30fps",
    colors: [c("Onyx", "#2F3033", "#16171A", "#9A9CA1", 2)],
    look: { name: "Fuji Warmth", a: "#FFE9CB", b: "#8FAF97", c: "#2A2A22", bloom: 0.3, contrast: 1.0 },
    tags: ["low light", "cult classic", "long battery"],
    badges: ["rare", "trending"],
    story: "Photographers still argue that nothing this small has matched the F31fd at ISO 1600. Six megapixels, a huge sensor for its class, and a battery that runs for 580 frames.",
    includes: ["Battery + charger", "2GB xD card", "Original box"],
    quirks: ["Collector demand keeps prices high — this is not a bargain camera"],
  },
  {
    id: 6, slug: "casio-exilim-ex-z75", brand: "Casio", model: "Exilim EX-Z75",
    tagline: "Card-thin, candy-coloured, quietly excellent.",
    price: 142, compareAt: 175, year: 2007, era: "Late 2000s", condition: "Good",
    form: "slim", rating: 4.3, reviews: 94, stock: 7,
    mp: 7, zoom: "3× optical", sensor: '1/2.5" CCD', screen: '2.6" LCD', iso: "50–1600",
    media: "SD / SDHC", battery: "NP-40", weight: 125, dims: "95 × 60 × 20 mm", video: "640×480 @ 30fps",
    colors: [
      c("Ice White", "#EDEAE4", "#BEBAB3", "#7C7873", 3),
      c("Lipstick Red", "#C3392F", "#8C2620", "#4A1512", 2),
      c("Mint", "#A8CFC0", "#7BA294", "#3F5B52", 2),
    ],
    look: { name: "Candy Flash", a: "#FFF0E4", b: "#C9A7C6", c: "#3A2E3D", bloom: 0.5, contrast: 1.12 },
    tags: ["pocketable", "colourful", "budget"],
    badges: ["new-in"],
    story: "Casio understood that a camera is jewellery. The EX-Z75 turns on in about a second and the direct-to-YouTube button on later models remains the most 2007 feature ever shipped.",
    includes: ["Battery + charger", "2GB SD card"],
    quirks: ["Body shows light handling marks", "Flash is enthusiastic — lean into it"],
  },
  {
    id: 7, slug: "panasonic-lumix-dmc-lx3", brand: "Panasonic", model: "Lumix DMC-LX3",
    tagline: "A serious lens hiding in a small black box.",
    price: 395, year: 2008, era: "Late 2000s", condition: "Mint",
    form: "boxy", rating: 4.9, reviews: 188, stock: 2,
    mp: 10, zoom: "2.5× Leica f/2.0", sensor: '1/1.63" CCD', screen: '3.0" LCD', iso: "80–3200",
    media: "SD / SDHC", battery: "DMW-BCJ13", weight: 265, dims: "109 × 60 × 27 mm", video: "1280×720 @ 24fps",
    colors: [c("Matte Black", "#26262A", "#111114", "#8E8E96", 2)],
    look: { name: "Leica Render", a: "#F6E7CE", b: "#7D93A0", c: "#191C21", bloom: 0.18, contrast: 1.25 },
    tags: ["fast lens", "raw", "enthusiast"],
    badges: ["staff-pick", "rare"],
    story: "f/2.0 at the wide end in 2008 was outrageous. Shoots RAW, has a proper aspect-ratio switch on the barrel, and is the reason a lot of people never bought a DSLR.",
    includes: ["Battery + charger", "8GB SD card", "Lens cap + strap", "Original box"],
    quirks: ["Lens cap is not automatic — do not lose it"],
  },
  {
    id: 8, slug: "kodak-easyshare-v550", brand: "Kodak", model: "EasyShare V550",
    tagline: "Kodak yellow, Kodak colour, no notes.",
    price: 128, year: 2005, era: "Mid 2000s", condition: "Good",
    form: "slim", rating: 4.1, reviews: 63, stock: 4,
    mp: 5, zoom: "3× Schneider", sensor: '1/2.5" CCD', screen: '2.5" LCD', iso: "80–800",
    media: "SD", battery: "KLIC-7001", weight: 115, dims: "89 × 51 × 20 mm", video: "640×480 @ 30fps",
    colors: [c("Silver", "#D2D0CB", "#A2A09B", "#5F5D59", 3), c("Kodak Black", "#2B2A28", "#151412", "#C9A227", 1)],
    look: { name: "Kodak Gold", a: "#FFE3B4", b: "#C99A6B", c: "#3B2C1F", bloom: 0.42, contrast: 1.08 },
    tags: ["warm colour", "cheap", "point and shoot"],
    badges: ["new-in"],
    story: "Kodak spent a century learning how skin should look and then put it in a $200 pocket camera. The V550 files need almost no editing.",
    includes: ["Battery + charger", "2GB SD card"],
    quirks: ["Proprietary dock connector — charger included, dock not"],
  },
  {
    id: 9, slug: "ricoh-gr-digital-ii", brand: "Ricoh", model: "GR Digital II",
    tagline: "A street photographer's secret, 28mm and silent.",
    price: 465, year: 2007, era: "Late 2000s", condition: "Excellent",
    form: "boxy", rating: 4.8, reviews: 121, stock: 1,
    mp: 10, zoom: "28mm f/2.4 fixed", sensor: '1/1.75" CCD', screen: '2.7" LCD', iso: "64–1600",
    media: "SD", battery: "DB-60", weight: 200, dims: "107 × 58 × 25 mm", video: "640×480 @ 30fps",
    colors: [c("Stealth Black", "#1E1E20", "#0C0C0E", "#7A7A80", 1)],
    look: { name: "GR Monochrome", a: "#EFEBE4", b: "#8A867F", c: "#131313", bloom: 0.1, contrast: 1.35 },
    tags: ["fixed lens", "street", "snap focus", "raw"],
    badges: ["last-one", "rare"],
    story: "No zoom, no apology. Snap focus locks the lens at a set distance so the shutter fires the instant you press it. Generations of street photographers have carried one of these in a coat pocket.",
    includes: ["Battery + charger", "8GB SD card", "Ricoh wrist strap"],
    quirks: ["Fixed 28mm lens — there is no zoom, that is the point"],
  },
  {
    id: 10, slug: "sony-cybershot-dsc-t70", brand: "Sony", model: "Cyber-shot DSC-T70",
    tagline: "Touchscreen slider. Peak 2007 futurism.",
    price: 176, year: 2007, era: "Late 2000s", condition: "Excellent",
    form: "slim", rating: 4.4, reviews: 88, stock: 3,
    mp: 8, zoom: "3× Carl Zeiss", sensor: '1/2.5" CCD', screen: '3.0" touch LCD', iso: "100–3200",
    media: "Memory Stick Duo", battery: "NP-BD1", weight: 130, dims: "94 × 57 × 18 mm", video: "640×480 @ 30fps",
    colors: [
      c("Silver", "#CFCFD2", "#9C9CA0", "#5C5C60", 2),
      c("Black", "#242427", "#111113", "#8A8A90", 1),
      c("Rose", "#DDA9AC", "#B07E84", "#5E4145", 1),
    ],
    look: { name: "Slider Glow", a: "#FFEDDD", b: "#A0AFC8", c: "#242B38", bloom: 0.38, contrast: 1.06 },
    tags: ["touchscreen", "slide cover", "pocketable"],
    badges: ["trending"],
    story: "The lens cover slides down and the camera wakes up. There is no better on-switch. The whole back is a touchscreen, which in 2007 felt like operating a spaceship.",
    includes: ["Battery + charger", "4GB Memory Stick Duo", "Stylus"],
    quirks: ["Touchscreen is resistive — press, don't swipe"],
  },
  {
    id: 11, slug: "canon-powershot-a590", brand: "Canon", model: "PowerShot A590 IS",
    tagline: "Runs on AA batteries. Runs forever.",
    price: 115, compareAt: 145, year: 2008, era: "Late 2000s", condition: "Good",
    form: "compact", rating: 4.5, reviews: 176, stock: 9,
    mp: 8, zoom: "4× optical IS", sensor: '1/2.5" CCD', screen: '2.5" LCD', iso: "80–1600",
    media: "SD / SDHC", battery: "2× AA", weight: 175, dims: "94 × 64 × 32 mm", video: "640×480 @ 30fps",
    colors: [c("Silver", "#D4D2CE", "#A4A29E", "#4E4C49", 6), c("Black", "#2A2A2C", "#141416", "#8B8B90", 3)],
    look: { name: "Everyday", a: "#F7E9D3", b: "#A5B49F", c: "#332F28", bloom: 0.33, contrast: 1.02 },
    tags: ["AA batteries", "manual modes", "budget", "stabilised"],
    badges: ["staff-pick"],
    story: "Full manual control, image stabilisation, and it takes AAs you can buy at any petrol station on the planet. The most travel-proof camera we sell.",
    includes: ["4× rechargeable AA + charger", "4GB SD card", "Wrist strap"],
    quirks: ["Chunkier than the slim models — it has a real grip"],
  },
  {
    id: 12, slug: "olympus-mju-770sw", brand: "Olympus", model: "µ 770 SW",
    tagline: "Freezeproof to −10°C. Genuinely.",
    price: 198, year: 2007, era: "Late 2000s", condition: "Excellent",
    form: "rugged", rating: 4.6, reviews: 102, stock: 4,
    mp: 7, zoom: "3× optical", sensor: '1/2.35" CCD', screen: '2.5" LCD', iso: "64–1600",
    media: "xD-Picture Card", battery: "LI-42B", weight: 168, dims: "92 × 62 × 22 mm", video: "640×480 @ 30fps",
    colors: [c("Storm Grey", "#8D9297", "#5F6469", "#2A2F34", 2), c("Sulphur", "#D9C24B", "#A38F2C", "#3E3712", 2)],
    look: { name: "Cold Snap", a: "#E9F4FA", b: "#7C9BB0", c: "#1D2A35", bloom: 0.22, contrast: 1.14 },
    tags: ["waterproof", "freezeproof", "crushproof", "snow"],
    badges: ["restored"],
    story: "Ten metres underwater, 100kg of crush resistance, and it keeps working in a blizzard. Bring it snowboarding and stop worrying about it.",
    includes: ["Battery + charger", "2GB xD card", "Fresh seals", "Carabiner"],
    quirks: ["Seals replaced, but we don't warranty submersion"],
  },
  {
    id: 13, slug: "contax-tvs-digital", brand: "Contax", model: "TVS Digital",
    tagline: "Titanium body, Zeiss glass, cult status.",
    price: 780, year: 2002, era: "Y2K", condition: "Excellent",
    form: "compact", rating: 4.7, reviews: 44, stock: 1,
    mp: 5, zoom: "3× Vario-Sonnar T*", sensor: '1/1.8" CCD', screen: '1.6" LCD', iso: "100–400",
    media: "CompactFlash", battery: "BP-1000", weight: 250, dims: "104 × 60 × 34 mm", video: "None",
    colors: [c("Titanium", "#B9B4AB", "#8A857D", "#403C36", 1)],
    look: { name: "Sonnar Cream", a: "#FBEBD2", b: "#9FA98F", c: "#2C2A24", bloom: 0.28, contrast: 1.22 },
    tags: ["titanium", "zeiss", "collector", "grail"],
    badges: ["rare", "last-one"],
    story: "Contax made cameras for people who wanted a Leica but had somewhere to be. The TVS Digital is a titanium brick with a Vario-Sonnar on the front and a following that has pushed prices past reason.",
    includes: ["Battery + charger", "512MB CF card", "Leather case", "Certificate of servicing"],
    quirks: ["No video. Tiny screen. 5MP. Buy it for the files, not the spec sheet."],
  },
  {
    id: 14, slug: "sony-cybershot-dsc-f717", brand: "Sony", model: "Cyber-shot DSC-F717",
    tagline: "The swivel body. Nothing else looks like this.",
    price: 420, year: 2002, era: "Y2K", condition: "Good",
    form: "swivel", rating: 4.6, reviews: 79, stock: 2,
    mp: 5, zoom: "5× Carl Zeiss f/2.0", sensor: '2/3" CCD', screen: '1.8" LCD', iso: "100–800",
    media: "Memory Stick", battery: "NP-FM50", weight: 850, dims: "119 × 79 × 172 mm", video: "320×240 @ 15fps",
    colors: [c("Silver", "#C6C4C0", "#96948F", "#403E3B", 2)],
    look: { name: "Nightshot Green", a: "#E8F0D8", b: "#87A06E", c: "#20291B", bloom: 0.3, contrast: 1.16 },
    tags: ["swivel", "nightshot", "fast lens", "statement piece"],
    badges: ["rare", "trending"],
    story: "The barrel rotates independently of the body, so you can shoot from the hip or over a crowd without contorting. It also has NightShot infrared, which produces the greenest, strangest photographs you will ever take.",
    includes: ["Battery + charger", "128MB Memory Stick", "Lens hood", "Shoulder strap"],
    quirks: ["Big and heavy — this is a shoulder-strap camera", "Original Memory Stick media required"],
  },
  {
    id: 15, slug: "nikon-coolpix-p5100", brand: "Nikon", model: "Coolpix P5100",
    tagline: "Hot shoe, manual dials, small body.",
    price: 268, year: 2007, era: "Late 2000s", condition: "Excellent",
    form: "boxy", rating: 4.5, reviews: 67, stock: 3,
    mp: 12, zoom: "3.5× Nikkor VR", sensor: '1/1.72" CCD', screen: '2.5" LCD', iso: "64–3200",
    media: "SD / SDHC", battery: "EN-EL5", weight: 200, dims: "98 × 65 × 41 mm", video: "640×480 @ 30fps",
    colors: [c("Black", "#232326", "#0F0F12", "#8C8C92", 3)],
    look: { name: "Nikkor Neutral", a: "#F2E8D9", b: "#93A6A2", c: "#252A2B", bloom: 0.2, contrast: 1.1 },
    tags: ["hot shoe", "manual modes", "enthusiast", "vibration reduction"],
    badges: [],
    story: "A hot shoe on a compact is rare. Put a real flash on top, dial in manual exposure, and this becomes a very capable small camera.",
    includes: ["Battery + charger", "8GB SD card", "Strap"],
    quirks: ["High ISO gets noisy fast — stay under 400"],
  },
  {
    id: 16, slug: "panasonic-lumix-dmc-fx07", brand: "Panasonic", model: "Lumix DMC-FX07",
    tagline: "28mm wide in a body the size of a wallet.",
    price: 152, year: 2006, era: "Mid 2000s", condition: "Good",
    form: "slim", rating: 4.3, reviews: 85, stock: 5,
    mp: 7, zoom: "3.6× Leica 28mm", sensor: '1/2.5" CCD', screen: '2.5" LCD', iso: "100–1600",
    media: "SD", battery: "DMW-BCE10", weight: 132, dims: "94 × 51 × 24 mm", video: "848×480 @ 30fps",
    colors: [c("Silver", "#CECBC6", "#9E9B97", "#57544F", 3), c("Black", "#26262A", "#111113", "#888890", 2)],
    look: { name: "Wide Open", a: "#F5EAD8", b: "#8FA8B6", c: "#252D33", bloom: 0.26, contrast: 1.09 },
    tags: ["wide angle", "leica lens", "pocketable", "stabilised"],
    badges: ["new-in"],
    story: "28mm equivalent means you can actually fit the whole group in the frame without backing into traffic. The Leica-branded lens is sharp corner to corner.",
    includes: ["Battery + charger", "4GB SD card"],
    quirks: ["Corner softness at full wide, wide open"],
  },
  {
    id: 17, slug: "fujifilm-finepix-z10fd", brand: "Fujifilm", model: "FinePix Z10fd",
    tagline: "Slide-open, candy-shell, unrepentantly fun.",
    price: 134, compareAt: 168, year: 2007, era: "Late 2000s", condition: "Good",
    form: "slim", rating: 4.2, reviews: 112, stock: 6,
    mp: 7, zoom: "3× Fujinon", sensor: '1/2.5" CCD', screen: '2.5" LCD', iso: "64–1600",
    media: "xD-Picture Card", battery: "NP-45", weight: 110, dims: "90 × 55 × 19 mm", video: "640×480 @ 30fps",
    colors: [
      c("Hot Pink", "#DE5C86", "#AC3B60", "#57192E", 2),
      c("Lime", "#B8CF4A", "#8AA02D", "#3E4A12", 2),
      c("Black", "#242426", "#101012", "#8A8A8E", 2),
    ],
    look: { name: "Party Flash", a: "#FFE6EE", b: "#C58FB6", c: "#3B2635", bloom: 0.55, contrast: 1.15 },
    tags: ["colourful", "slide cover", "party", "budget"],
    badges: ["trending"],
    story: "This is the camera that lives in a jacket pocket at a party. Direct flash, hard shadows, saturated colour — the exact look people are now spending money to imitate.",
    includes: ["Battery + charger", "2GB xD card", "Wrist strap"],
    quirks: ["Low-light autofocus hunts", "xD media only"],
  },
  {
    id: 18, slug: "canon-powershot-g9", brand: "Canon", model: "PowerShot G9",
    tagline: "The pro's backup camera, in miniature.",
    price: 385, year: 2007, era: "Late 2000s", condition: "Excellent",
    form: "boxy", rating: 4.8, reviews: 143, stock: 2,
    mp: 12, zoom: "6× optical IS", sensor: '1/1.7" CCD', screen: '3.0" LCD', iso: "80–3200",
    media: "SD / SDHC", battery: "NB-2LH", weight: 320, dims: "106 × 72 × 42 mm", video: "1024×768 @ 15fps",
    colors: [c("Classic Black", "#282826", "#131311", "#B9B4A8", 2)],
    look: { name: "G-Series", a: "#F4E8D2", b: "#8FA396", c: "#22251F", bloom: 0.16, contrast: 1.2 },
    tags: ["raw", "hot shoe", "manual modes", "enthusiast", "optical viewfinder"],
    badges: ["staff-pick"],
    story: "Retro dials on top, an optical viewfinder, RAW files, and a hot shoe. The G9 was what photographers carried when they left the SLR at home, and it has aged into a genuinely lovely object.",
    includes: ["Battery + charger", "8GB SD card", "Neck strap", "Original manual"],
    quirks: ["Heavier than it looks — 320g", "Video mode is an afterthought"],
  },
  {
    id: 19, slug: "samsung-nv3", brand: "Samsung", model: "NV3",
    tagline: "The one with the built-in MP3 player.",
    price: 122, year: 2006, era: "Mid 2000s", condition: "Good",
    form: "slim", rating: 3.9, reviews: 48, stock: 4,
    mp: 7, zoom: "3× Schneider", sensor: '1/2.5" CCD', screen: '2.5" LCD', iso: "80–1000",
    media: "SD / MMC", battery: "SLB-0737", weight: 118, dims: "91 × 57 × 18 mm", video: "640×480 @ 30fps",
    colors: [c("Silver", "#D0CDC8", "#A09D98", "#59564F", 2), c("Wine", "#7C3341", "#54202B", "#2B0F16", 2)],
    look: { name: "Schneider Soft", a: "#F6E8DD", b: "#AE9EAE", c: "#332C33", bloom: 0.44, contrast: 0.98 },
    tags: ["mp3 player", "oddball", "budget", "text viewer"],
    badges: ["new-in"],
    story: "It plays MP3s. It reads text files. It has a voice recorder. Samsung in 2006 was trying to build a phone before phones were ready, and the result is delightfully strange.",
    includes: ["Battery + charger", "2GB SD card", "Earbuds"],
    quirks: ["Menu system is a maze", "Battery life is mediocre if you play music"],
  },
  {
    id: 20, slug: "pentax-optio-w30", brand: "Pentax", model: "Optio W30",
    tagline: "Slim, waterproof, and nobody expects it.",
    price: 158, year: 2007, era: "Late 2000s", condition: "Good",
    form: "rugged", rating: 4.4, reviews: 58, stock: 3,
    mp: 7, zoom: "3× optical", sensor: '1/2.5" CCD', screen: '2.5" LCD', iso: "64–3200",
    media: "SD / SDHC", battery: "D-LI63", weight: 135, dims: "94 × 55 × 21 mm", video: "640×480 @ 30fps",
    colors: [c("Aqua", "#67B2BE", "#41858F", "#1E4249", 2), c("Silver", "#CDCFD0", "#9C9E9F", "#54575A", 1)],
    look: { name: "Shallow Water", a: "#E4F6F4", b: "#6FB0AE", c: "#1B3B3B", bloom: 0.3, contrast: 1.07 },
    tags: ["waterproof", "slim", "travel"],
    badges: ["restored"],
    story: "Most waterproof cameras look like construction equipment. The W30 is barely thicker than a normal compact and shrugs off three metres of water.",
    includes: ["Battery + charger", "4GB SD card", "New seals"],
    quirks: ["Seals replaced; submersion not covered by warranty"],
  },
  {
    id: 21, slug: "minolta-dimage-x", brand: "Minolta", model: "DiMAGE X",
    tagline: "A periscope lens in 2002. Two millimetres thin per megapixel.",
    price: 245, year: 2002, era: "Y2K", condition: "Good",
    form: "slim", rating: 4.3, reviews: 39, stock: 2,
    mp: 3, zoom: "3× folded optics", sensor: '1/2.7" CCD', screen: '1.5" LCD', iso: "100–400",
    media: "SD / MMC", battery: "NP-200", weight: 105, dims: "85 × 67 × 20 mm", video: "320×240 @ 15fps",
    colors: [c("Silver", "#C7C6C3", "#979693", "#4C4B48", 2)],
    look: { name: "Early Digital", a: "#F0E6D0", b: "#A2A594", c: "#33322A", bloom: 0.35, contrast: 1.28 },
    tags: ["periscope lens", "y2k", "3 megapixel", "collector"],
    badges: ["rare"],
    story: "Minolta bent the light path with a prism so the lens never leaves the body. Twenty-three years later phones use the same trick. Three megapixels produces exactly the crunchy, low-res look people are chasing.",
    includes: ["Battery + charger", "512MB SD card"],
    quirks: ["3MP files are small — that is the aesthetic", "Screen is tiny by modern standards"],
  },
  {
    id: 22, slug: "canon-ixus-70", brand: "Canon", model: "IXUS 70",
    tagline: "The definitive pocket rectangle.",
    price: 175, year: 2007, era: "Late 2000s", condition: "Excellent",
    form: "slim", rating: 4.7, reviews: 231, stock: 5,
    mp: 7, zoom: "3× optical", sensor: '1/2.5" CCD', screen: '2.5" LCD', iso: "80–1600",
    media: "SD / SDHC / MMC", battery: "NB-4L", weight: 125, dims: "86 × 54 × 22 mm", video: "640×480 @ 30fps",
    colors: [
      c("Silver", "#D6D4CF", "#A6A49F", "#6A6864", 3),
      c("Black", "#252527", "#111113", "#8B8B90", 1),
      c("Bronze", "#B4906A", "#886A4A", "#453424", 1),
    ],
    look: { name: "IXUS Standard", a: "#F8EBD9", b: "#9BB0B8", c: "#2B3238", bloom: 0.32, contrast: 1.08 },
    tags: ["pocketable", "iconic", "flash-friendly"],
    badges: ["staff-pick", "trending"],
    story: "If someone says the word digicam and a shape appears in your head, this is probably the shape. Stainless shell, DIGIC III processing, and a flash that makes everyone look like they are having a great night.",
    includes: ["Battery + charger", "4GB SD card", "Wrist strap", "GRAIN 90-day warranty"],
    quirks: ["Silver bodies show fingerprints"],
  },
  {
    id: 23, slug: "sony-cybershot-dsc-p200", brand: "Sony", model: "Cyber-shot DSC-P200",
    tagline: "Metal-shelled, sharp, and quietly overachieving.",
    price: 186, year: 2005, era: "Mid 2000s", condition: "Excellent",
    form: "compact", rating: 4.5, reviews: 96, stock: 3,
    mp: 7, zoom: "3× Carl Zeiss", sensor: '1/1.8" CCD', screen: '2.0" LCD', iso: "64–400",
    media: "Memory Stick PRO Duo", battery: "NP-FR1", weight: 156, dims: "94 × 52 × 24 mm", video: "640×480 @ 30fps",
    colors: [c("Silver", "#CACAC8", "#9A9A98", "#4F4F4E", 2), c("Black", "#232325", "#0F0F11", "#8A8A8E", 1)],
    look: { name: "P-Series Crisp", a: "#FBEEDA", b: "#8DA6B6", c: "#232B33", bloom: 0.24, contrast: 1.14 },
    tags: ["metal body", "zeiss glass", "sharp"],
    badges: [],
    story: "A bigger sensor than most of its rivals, a proper Zeiss lens, and a shell machined out of actual metal. Files hold up remarkably well at 100%.",
    includes: ["Battery + charger", "2GB Memory Stick PRO Duo"],
    quirks: ["Max ISO 400 — it is a daylight camera"],
  },
  {
    id: 24, slug: "olympus-camedia-c-3040", brand: "Olympus", model: "CAMEDIA C-3040 Zoom",
    tagline: "f/1.8 glass on a camera from the year 2001.",
    price: 290, year: 2001, era: "Y2K", condition: "Good",
    form: "bridge", rating: 4.6, reviews: 52, stock: 2,
    mp: 3, zoom: "3× f/1.8 Olympus", sensor: '1/1.8" CCD', screen: '1.8" LCD', iso: "100–400",
    media: "SmartMedia", battery: "4× AA", weight: 315, dims: "110 × 76 × 66 mm", video: "320×240 @ 15fps",
    colors: [c("Silver", "#C4C3BF", "#94938F", "#3F3E3B", 2)],
    look: { name: "Millennium", a: "#EEE2C6", b: "#A6A78F", c: "#302F26", bloom: 0.4, contrast: 1.3 },
    tags: ["fast lens", "AA batteries", "y2k", "3 megapixel"],
    badges: ["rare"],
    story: "An f/1.8 lens is faster than most kit zooms sold today. Three megapixels, a flip-open flash, and a shape that looks like a prop from a film about the year 2000.",
    includes: ["4× rechargeable AA + charger", "128MB SmartMedia card", "USB reader"],
    quirks: ["SmartMedia is obsolete — card reader included", "Slow to write files"],
  },
  {
    id: 25, slug: "leica-c-lux-2", brand: "Leica", model: "C-LUX 2",
    tagline: "The red dot, at a fraction of the usual cost of entry.",
    price: 520, year: 2007, era: "Late 2000s", condition: "Mint",
    form: "slim", rating: 4.5, reviews: 37, stock: 1,
    mp: 7, zoom: "3.6× Leica DC Vario-Elmar", sensor: '1/2.5" CCD', screen: '2.5" LCD', iso: "100–1250",
    media: "SD / SDHC", battery: "BP-DC4", weight: 132, dims: "95 × 51 × 22 mm", video: "848×480 @ 30fps",
    colors: [c("Silver", "#D3D1CC", "#A3A19C", "#B01D22", 1), c("Black", "#232326", "#101012", "#B01D22", 1)],
    look: { name: "Elmar Neutral", a: "#F7EBD8", b: "#93A9AF", c: "#262C30", bloom: 0.22, contrast: 1.12 },
    tags: ["leica", "wide angle", "collector", "pocketable"],
    badges: ["last-one", "rare"],
    story: "Yes, it shares a chassis with a Panasonic. It also has Leica's colour science, Leica's badge, and a build that has held up better than most. The cheapest way to put a red dot in your pocket.",
    includes: ["Battery + charger", "8GB SD card", "Leica leather case", "Original box"],
    quirks: ["Collector pricing — you pay for the badge and we won't pretend otherwise"],
  },
  {
    id: 26, slug: "nikon-coolpix-l18", brand: "Nikon", model: "Coolpix L18",
    tagline: "The unfussy AA-powered workhorse.",
    price: 98, compareAt: 130, year: 2008, era: "Late 2000s", condition: "Well-Loved",
    form: "compact", rating: 4.0, reviews: 143, stock: 11,
    mp: 8, zoom: "3× Nikkor", sensor: '1/2.5" CCD', screen: '3.0" LCD', iso: "64–1600",
    media: "SD / SDHC", battery: "2× AA", weight: 145, dims: "91 × 62 × 29 mm", video: "640×480 @ 30fps",
    colors: [c("Silver", "#D1CFCB", "#A19F9B", "#565452", 6), c("Red", "#B5392E", "#83231A", "#3F0F0A", 3)],
    look: { name: "Straight Ahead", a: "#F5EAD6", b: "#A3AE9C", c: "#31302A", bloom: 0.36, contrast: 1.0 },
    tags: ["AA batteries", "big screen", "budget", "first camera"],
    badges: [],
    story: "The cheapest way into the look. Cosmetically tired, mechanically fine, fully tested. Buy it, throw it in a bag, and stop being precious about it.",
    includes: ["4× rechargeable AA + charger", "2GB SD card"],
    quirks: ["Visible wear on the body and battery door", "Sold as-is beyond our 30-day function guarantee"],
  },
];

export const bySlug = (slug: string) => products.find((p) => p.slug === slug);

export const brands = Array.from(new Set(products.map((p) => p.brand))).sort();
export const eras: Era[] = ["Y2K", "Mid 2000s", "Late 2000s", "Early 2010s"];
export const conditions: Condition[] = ["Mint", "Excellent", "Good", "Well-Loved"];
export const allTags = Array.from(new Set(products.flatMap((p) => p.tags))).sort();
export const priceBounds = {
  min: Math.min(...products.map((p) => p.price)),
  max: Math.max(...products.map((p) => p.price)),
};

export const badgeMeta: Record<Badge, { label: string; tone: "accent" | "lcd" | "ink" | "gold" }> = {
  "new-in": { label: "New in", tone: "lcd" },
  "staff-pick": { label: "Staff pick", tone: "accent" },
  "last-one": { label: "Last one", tone: "accent" },
  restored: { label: "Restored", tone: "ink" },
  trending: { label: "Trending", tone: "gold" },
  rare: { label: "Rare", tone: "gold" },
};
