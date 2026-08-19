import { getImage } from "../utils/media";

const bottleOne = getImage("Perfume_bottle_on_white_background_202605271151.webp");
const bottleTwo = getImage("Perfume_bottle_on_white_background_202605271154.webp");
const bottleThree = getImage("remove_the_water_splash_202605271151.webp");

const vanilla = getImage("vanilla.webp");
const cinemonsticks = getImage("cinemonsticks.webp");
const berryred = getImage("berryred.webp");
const orange = getImage("orange.webp");

const blueberry = getImage("blueberry.webp");
const grapes = getImage("grapes.webp");
const apple = getImage("apple.webp");
const starfruit = getImage("starfruit.webp");

const peach = getImage("peach.webp");
const cinemon = getImage("cinemon.webp");
const oranageg = getImage("oranageg.webp");
const pomogranade = getImage("pomogranade.webp");

export type ScentFruit = {
    src: string;
    style: { top: string; left?: string; right?: string };
    sizeClass: string;
    spinSec: number;
};

const hexToRgb = (hex: string) => {
    const h = hex.replace("#", "");
    const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

/** Soft radial glow behind bottle — no card edges */
export const buildBottleGlow = (
    primary: string,
    secondary: string,
    intensity = 0.28,
) => {
    const p = hexToRgb(primary);
    const s = hexToRgb(secondary);
    const a1 = intensity;
    const a2 = intensity * 0.45;
    const a3 = intensity * 0.55;
    return `
        radial-gradient(ellipse 72% 68% at 50% 54%, rgba(${p.r},${p.g},${p.b},${a1}) 0%, rgba(${p.r},${p.g},${p.b},${a2}) 40%, transparent 72%),
        radial-gradient(ellipse 58% 52% at 50% 62%, rgba(${s.r},${s.g},${s.b},${a3}) 0%, transparent 70%)
    `;
};

export type ScentCompositionItem = {
    id: string;
    name: string;
    highlights: string[];
    accentColor: string;
    accentGlow: string;
    /** CSS radial-gradient stack behind the bottle */
    bottleGlow: string;
    /** Optional vertical offset class for glow (splash bottle) */
    bottleGlowClass?: string;
    bottleSrc: string;
    bottleWidthClass: string;
    /** Tailwind scale on bottle wrap; default is ~2.2–2.6 */
    bottleScaleClass: string;
    /** Flex alignment for bottle wrap (compact bottles stay centered) */
    bottlePlacementClass?: string;
    /** Override wrap layout (e.g. absolute center in stage) */
    bottleWrapClass?: string;
    /** Override img sizing/position (splash assets need object-center) */
    bottleImgClass?: string;
    /** Fade-only bottle on scroll (no shoot-up from bottom) */
    bottleFadeTransition?: boolean;
    shopHref: string;
    fruits: ScentFruit[];
};

const defaultBottleScale = "scale-[2.2] sm:scale-[2.4] lg:scale-[2.6]";
/** Splash PNG — shares sc-bottle-wrap so scroll + mobile sizing match slides 1–2 */
const splashBottleWrap =
    "sc-bottle-wrap sc-bottle-splash relative z-10 flex w-full max-md:h-full max-md:items-center max-md:justify-center max-md:origin-center items-end justify-center origin-bottom will-change-[transform,opacity] lg:absolute lg:inset-0 lg:items-center lg:justify-center lg:origin-center lg:-translate-y-8 xl:-translate-y-10 max-md:scale-100 scale-[2.2] sm:scale-[2.4] lg:scale-[2.6]";
const splashBottleImg =
    "sc-splash-img w-auto h-auto max-h-[min(44dvh,400px)] sm:max-h-[min(46dvh,500px)] lg:max-h-[min(52dvh,540px)] max-w-[min(92vw,360px)] lg:max-w-[min(85vw,320px)] object-contain object-bottom lg:object-center drop-shadow-[0_28px_56px_rgba(0,0,0,0.22)]";

const bottles = [bottleOne, bottleTwo, bottleThree];

const bottleWidths = [
    "w-auto h-full max-h-full max-w-[min(88vw,340px)]",
    "w-auto h-full max-h-full max-w-[min(90vw,360px)]",
    "w-auto h-full max-h-full max-w-[min(92vw,380px)]",
];

const fruitById: Record<string, ScentFruit[]> = {
    arc: [
        { src: peach, style: { top: "5%", left: "7%" }, sizeClass: "w-[5.5rem] sm:w-28 md:w-32 lg:w-36", spinSec: 14 },
        { src: oranageg, style: { top: "8%", right: "7%" }, sizeClass: "w-[5.5rem] sm:w-28 md:w-32 lg:w-36", spinSec: 18 },
        { src: cinemon, style: { top: "59%", left: "6%" }, sizeClass: "w-12 sm:w-[3.75rem] md:w-[4.25rem]", spinSec: 25 },
        { src: pomogranade, style: { top: "57%", right: "4%" }, sizeClass: "w-[3.25rem] sm:w-[3.75rem] md:w-20 lg:w-24", spinSec: 20 },
    ],
    ltoil: [
        { src: orange, style: { top: "6%", left: "8%" }, sizeClass: "w-[5.5rem] sm:w-28 md:w-32 lg:w-36", spinSec: 16 },
        { src: berryred, style: { top: "8%", right: "8%" }, sizeClass: "w-12 sm:w-14 md:w-16", spinSec: 22 },
        { src: cinemonsticks, style: { top: "58%", left: "4%" }, sizeClass: "w-14 sm:w-[3.75rem] md:w-20 lg:w-24", spinSec: 18 },
        { src: vanilla, style: { top: "56%", right: "6%" }, sizeClass: "w-[4.75rem] sm:w-24 md:w-28 lg:w-32", spinSec: 14 },
    ],
    ls: [
        { src: grapes, style: { top: "4%", left: "6%" }, sizeClass: "w-[5rem] sm:w-[6.5rem] md:w-[7.5rem] lg:w-[8.5rem]", spinSec: 20 },
        { src: blueberry, style: { top: "6%", right: "6%" }, sizeClass: "w-11 sm:w-14 md:w-16", spinSec: 24 },
        { src: apple, style: { top: "52%", left: "5%" }, sizeClass: "w-[3.25rem] sm:w-[3.5rem] md:w-[4.5rem] lg:w-20", spinSec: 17 },
        { src: starfruit, style: { top: "50%", right: "5%" }, sizeClass: "w-[4.5rem] sm:w-[5.5rem] md:w-[6.5rem] lg:w-28", spinSec: 15 },
    ],
};

/** Three background-removed bottles; copy order matches scroll flow */
export const scentCompositions: ScentCompositionItem[] = [
    {
        id: "arc",
        name: "ARCANE FOR HIM",
        highlights: [
            "Mass Appeal. Universally Desired. Men & Women Obsessed.",
            "48MG Proprietary Pheromone Blend",
            "Gourmand Seduction. Succulent Peach Tea. Impossibly Inviting.",
        ],
        accentColor: "#8B7AE8",
        accentGlow: "rgba(139,122,232,0.35)",
        bottleGlow: buildBottleGlow("#8B7AE8", "#C4B8F5", 0.26),
        bottleSrc: bottles[0],
        bottleWidthClass: bottleWidths[0],
        bottleScaleClass: defaultBottleScale,
        shopHref: "/shop/men",
        fruits: fruitById.arc,
    },
    {
        id: "ltoil",
        name: "LE TOXIQUE PHEROMONE OIL - EXTRAIT PURE",
        highlights: [
            "48MG Proprietary Pheromone Blend",
            "Ultra Long-Lasting Silky Smooth",
            "Intoxicating Projection + Sillage. Irresistible Close Encounters.",
        ],
        accentColor: "#C9A227",
        accentGlow: "rgba(201,162,39,0.35)",
        bottleGlow: buildBottleGlow("#C9A227", "#F2E6C8", 0.3),
        bottleSrc: bottles[1],
        bottleWidthClass: bottleWidths[1],
        bottleScaleClass: defaultBottleScale,
        bottleFadeTransition: true,
        shopHref: "/shop/men",
        fruits: fruitById.ltoil,
    },
    {
        id: "ls",
        name: "LIQUID SILVER ABSOLÛ",
        highlights: [
            "Inspired by Creed Aventus Absolut Triple Aged Batch Legendary DNA",
            "Fruity Indulgence. Airy Sophistication. Masculine Mastery.",
            "Timeless. Coveted. Unforgettable.",
        ],
        accentColor: "#8FAEC4",
        accentGlow: "rgba(143,174,196,0.35)",
        bottleGlow: buildBottleGlow("#6E95B0", "#DCE8F0", 0.24),
        bottleGlowClass: "-translate-y-6 sm:-translate-y-8 lg:-translate-y-10 lg:top-[46%]",
        bottleSrc: bottles[2],
        bottleWidthClass: bottleWidths[2],
        bottleScaleClass: defaultBottleScale,
        bottleWrapClass: splashBottleWrap,
        bottleImgClass: splashBottleImg,
        bottleFadeTransition: true,
        shopHref: "/shop/men",
        fruits: fruitById.ls,
    },
];
