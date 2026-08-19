import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useMediaQuery } from "react-responsive";
import { getProductCarouselTiming } from "../utils/productCarouselScroll";
import { getProductUrl, getProducts } from "../utils/shopify";
import BestsellerFrameSequence, {
    type BestsellerFrameSequenceHandle,
} from "../components/BestsellerFrameSequence";

gsap.registerPlugin(ScrollTrigger);

/**
 * Product landing frames in the original bestseller motion, expressed as
 * seconds. The generated image sequence preserves these exact transitions.
 */
const PRODUCT_VIDEO_CUES = [
    {
        name: "Le Toxique",
        time: 1.523,
        handle: "le-toxique",
        fallbackPrice: "$164.00",
        badge: "Iconic bestseller",
        type: "Masculine pheromone cologne",
        concentration: "Eau de Parfum · 48mg blend",
        profile: "Warm · Seductive · Powerful",
        notes: ["Mandarin", "Bergamot", "Ambergris"],
        accent: "#dc2626",
    },
    {
        name: "Liquid Silver",
        time: 3.835,
        handle: "liquid-silver",
        fallbackPrice: "$128.00",
        badge: "Signature bestseller",
        type: "Premium pheromone fragrance",
        concentration: "Eau de Parfum · 8hr wear",
        profile: "Fresh · Fruity · Woody",
        notes: ["Pineapple", "Bergamot", "Musk"],
        accent: "#64748b",
    },
    {
        name: "Alpha Q",
        time: 5.960,
        handle: "pheromone-cologne",
        fallbackPrice: "$52.98",
        badge: "High-status formula",
        type: "Men's pheromone cologne spray",
        concentration: "Scented or unscented",
        profile: "Citrusy · Woody · Bold",
        notes: ["Citrus", "Woods", "Musk"],
        accent: "#2563eb",
    },
    {
        name: "Avant Garde",
        time: 7.148,
        handle: "new-pre-order-avant-garde-for-men-regular-size-2oz-release-date-6-12",
        fallbackPrice: "$54.98",
        badge: "Cutting-edge attraction",
        type: "Premium pheromone cologne",
        concentration: "Scented or unscented",
        profile: "Fresh · Citrusy · Magnetic",
        notes: ["Grapefruit", "Lemon", "Vetiver"],
        accent: "#d97706",
    },
    {
        name: "Le Toxique For Her",
        time: 10.751,
        handle: "le-toxique-w",
        fallbackPrice: "$158.00",
        badge: "For her",
        type: "Feminine pheromone perfume",
        concentration: "Eau de Parfum",
        profile: "Floral · Magnetic · Sensual",
        notes: ["Rose", "Jasmine", "Warm Musk"],
        accent: "#db2777",
    },
] as const;

const PRODUCT_COUNT = PRODUCT_VIDEO_CUES.length;
const VIDEO_START_TIME = 0;
const PRODUCT_VIDEO_CUE_TIMES = PRODUCT_VIDEO_CUES.map((cue) => cue.time);
const MOBILE_PRODUCT_VIDEO_CUE_TIMES = PRODUCT_VIDEO_CUES.map((cue) =>
    cue.name === "Avant Garde" ? 8.087 : cue.time,
);

type ProductCue = (typeof PRODUCT_VIDEO_CUES)[number];

type ShopifyProductSummary = {
    id?: string;
    title?: string;
    handle?: string;
    priceRange?: {
        minVariantPrice?: {
            amount?: string;
            currencyCode?: string;
        };
    };
    metafields?: Array<{
        namespace?: string;
        key?: string;
        value?: string;
    } | null>;
};

const getMetafieldValue = (product: ShopifyProductSummary | undefined, key: string) =>
    product?.metafields?.find((field) => field?.key === key)?.value;

const formatShopifyPrice = (product: ShopifyProductSummary | undefined, fallback: string) => {
    const money = product?.priceRange?.minVariantPrice;
    const amount = Number(money?.amount);
    if (!money?.currencyCode || !Number.isFinite(amount)) return fallback;

    try {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: money.currencyCode,
            minimumFractionDigits: 2,
        }).format(amount);
    } catch {
        return `${money.currencyCode} ${amount.toFixed(2)}`;
    }
};

const getRating = (product: ShopifyProductSummary | undefined) => {
    const raw = getMetafieldValue(product, "rating");
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw);
        const value = Number(parsed?.value ?? parsed?.rating);
        return Number.isFinite(value) ? value : null;
    } catch {
        const value = Number(raw);
        return Number.isFinite(value) ? value : null;
    }
};

const ProductSpotlightCard = ({
    cue,
    index,
    product,
}: {
    cue: ProductCue;
    index: number;
    product?: ShopifyProductSummary;
}) => {
    const rating = getRating(product);
    const ratingCount = Number(getMetafieldValue(product, "rating_count"));
    const unitsSold = Number(getMetafieldValue(product, "units_sold"));
    const price = formatShopifyPrice(product, cue.fallbackPrice);
    const productHandle = product?.handle || cue.handle;

    const proof = Number.isFinite(unitsSold) && unitsSold > 0
        ? `${unitsSold.toLocaleString("en-US")}+ sold`
        : Number.isFinite(ratingCount) && ratingCount > 0
            ? `${ratingCount.toLocaleString("en-US")} verified customers`
            : "Customer favorite";

    return (
        <article
            className={`bestseller-product-card bestseller-product-card-${index} invisible absolute inset-0 z-40 text-charcoal opacity-0`}
        >
            <div
                className="hidden"
                style={{ borderTop: `3px solid ${cue.accent}` }}
            >
                <div className="mb-1.5 flex items-center gap-2">
                    <span
                        className="h-2 w-2 shrink-0 rounded-full shadow-[0_0_12px_currentColor]"
                        style={{ backgroundColor: cue.accent, color: cue.accent }}
                    />
                    <span className="text-[0.48rem] font-bold uppercase tracking-[0.2em] text-charcoal/55 md:text-[0.58rem]">
                        {cue.badge}
                    </span>
                </div>
                <h3 className="text-base font-black uppercase leading-none tracking-[-0.02em] md:text-2xl">
                    {cue.name}
                </h3>
            </div>

            <div className="hidden">
                <p className="text-[0.42rem] uppercase tracking-[0.2em] text-charcoal/45 md:text-[0.52rem]">From</p>
                <p className="text-base font-black leading-tight md:text-2xl" style={{ color: cue.accent }}>
                    {price}
                </p>
            </div>

            <div className="hidden">
                <p className="mb-1 text-[0.42rem] uppercase tracking-[0.18em] text-charcoal/40 md:text-[0.52rem]">Fragrance</p>
                <p className="text-[0.58rem] font-semibold leading-snug md:text-xs">{cue.type}</p>
            </div>

            <div className="hidden">
                <p className="mb-1 text-[0.42rem] uppercase tracking-[0.18em] text-charcoal/40 md:text-[0.52rem]">Profile</p>
                <p className="text-[0.58rem] font-semibold leading-snug md:text-xs">{cue.profile}</p>
            </div>

            <div className="hidden">
                {cue.notes.map((note) => (
                    <span
                        key={note}
                        className="rounded-full border border-white/70 bg-white/90 px-2.5 py-1.5 text-[0.45rem] font-bold uppercase tracking-[0.12em] shadow-[0_8px_24px_rgba(0,0,0,0.16)] backdrop-blur-xl md:px-4 md:py-2 md:text-[0.58rem]"
                    >
                        {note}
                    </span>
                ))}
            </div>

            <div className="hidden">
                <p className="text-[0.5rem] font-bold uppercase tracking-[0.13em] text-charcoal/70 md:text-[0.62rem]">
                    {proof}
                </p>
                <p className="mt-0.5 text-[0.46rem] text-charcoal/45 md:text-[0.56rem]">
                    {rating ? `${rating.toFixed(1)} ★ verified rating` : cue.concentration}
                </p>
            </div>

            <a
                href={getProductUrl(productHandle)}
                className="hidden"
            >
                Shop now →
            </a>

            <div
                className="bestseller-product-panel pointer-events-auto absolute bottom-4 left-4 w-[calc(100%_-_2rem)] max-w-[25rem] rounded-2xl border border-white/65 bg-white/90 p-4 shadow-[0_18px_52px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:bottom-6 sm:left-6 sm:p-5 md:bottom-8 md:left-8"
                style={{ borderTop: `3px solid ${cue.accent}` }}
            >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <span
                            className="h-2 w-2 rounded-full shadow-[0_0_12px_currentColor]"
                            style={{ backgroundColor: cue.accent, color: cue.accent }}
                        />
                        <span className="text-[0.55rem] font-bold uppercase tracking-[0.22em] text-charcoal/55">
                            {cue.badge}
                        </span>
                    </div>
                    <h3 className="text-xl font-black uppercase leading-none tracking-[-0.02em] md:text-2xl">
                        {cue.name}
                    </h3>
                </div>
                <div className="shrink-0 text-right">
                    <p className="text-[0.5rem] uppercase tracking-[0.2em] text-charcoal/45">From</p>
                    <p className="text-lg font-black leading-tight" style={{ color: cue.accent }}>
                        {price}
                    </p>
                </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 border-y border-charcoal/10 py-3 text-[0.62rem]">
                <div>
                    <p className="mb-0.5 uppercase tracking-[0.18em] text-charcoal/40">Fragrance</p>
                    <p className="font-semibold leading-snug">{cue.type}</p>
                </div>
                <div>
                    <p className="mb-0.5 uppercase tracking-[0.18em] text-charcoal/40">Profile</p>
                    <p className="font-semibold leading-snug">{cue.profile}</p>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {cue.notes.map((note) => (
                    <span
                        key={note}
                        className="rounded-full border border-charcoal/10 bg-white/70 px-2.5 py-1 text-[0.52rem] font-semibold uppercase tracking-[0.12em]"
                    >
                        {note}
                    </span>
                ))}
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
                <div>
                    <p className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-charcoal/65">
                        {proof}
                    </p>
                    <p className="mt-0.5 text-[0.54rem] text-charcoal/45">
                        {rating ? `${rating.toFixed(1)} ★ verified rating` : cue.concentration}
                    </p>
                </div>
                <a
                    href={getProductUrl(productHandle)}
                    className="pointer-events-auto shrink-0 rounded-full bg-charcoal px-4 py-2.5 text-[0.55rem] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-sick-red"
                >
                    Shop now →
                </a>
            </div>
            </div>
        </article>
    );
};

const FlavorSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const sequenceRef = useRef<BestsellerFrameSequenceHandle>(null);
    const isMob = useMediaQuery({ query: "(max-width:768px)" });
    const [shopifyProducts, setShopifyProducts] = useState<ShopifyProductSummary[]>([]);
    const productVideoCueTimes = isMob
        ? MOBILE_PRODUCT_VIDEO_CUE_TIMES
        : PRODUCT_VIDEO_CUE_TIMES;

    useEffect(() => {
        let active = true;
        getProducts()
            .then((products) => {
                if (active && Array.isArray(products)) {
                    setShopifyProducts(products);
                }
            })
            .catch(() => {
                // Static cue details remain available when the API is unavailable.
            });

        return () => {
            active = false;
        };
    }, []);

    useGSAP(() => {
        if (!sectionRef.current) return;

        const scroller = ScrollSmoother.get()
            ? document.getElementById("smooth-wrapper") ?? undefined
            : undefined;

        const dots = sectionRef.current.querySelectorAll<HTMLElement>(".bestseller-dot");

        // Include one extra timeline step for the opening transition from the
        // start of the video into the first product cue.
        const { holdDur, transDur, scrollLength, snap } =
            getProductCarouselTiming(PRODUCT_COUNT + 1, isMob);
        const playhead = { time: VIDEO_START_TIME };
        let activeIdx = -1;

        gsap.set(".bestseller-product-card", {
            autoAlpha: 0,
            y: 24,
            scale: 0.96,
        });

        const updateDots = (index: number) => {
            if (index === activeIdx) return;
            activeIdx = index;

            dots.forEach((dot, dotIndex) => {
                if (dotIndex === index) {
                    dot.className = "bestseller-dot transition-all duration-300 rounded-full w-2.5 h-6 bg-sick-red shadow-[0_0_12px_rgba(220,38,38,0.5)] cursor-pointer";
                } else {
                    dot.className = "bestseller-dot transition-all duration-300 rounded-full w-2 h-2 bg-charcoal/20 hover:bg-charcoal/50 cursor-pointer";
                }
            });
        };

        const seekToPlayhead = () => {
            sequenceRef.current?.setTime(playhead.time);

            const nearestIndex = productVideoCueTimes.reduce((nearest, cueTime, index) =>
                Math.abs(cueTime - playhead.time) <
                Math.abs(productVideoCueTimes[nearest] - playhead.time)
                    ? index
                    : nearest,
            0);
            updateDots(nearestIndex);
        };

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                scroller,
                start: "top top",
                end: `+=${scrollLength}`,
                scrub: 0.65,
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                // Snap the scroll position to the nearest settled product label.
                // Because the playhead is tied to scroll, snapping still moves
                // through the frame sequence instead of jumping timestamps.
                snap,
                onToggle: (self) => {
                    sectionRef.current?.classList.toggle("is-scroll-pinned", self.isActive);
                    seekToPlayhead();
                },
            },
        });

        let transitionAt = 0;
        for (let index = 0; index < PRODUCT_COUNT; index += 1) {
            const settledAt = transitionAt + transDur;
            const cardInDuration = Math.min(0.35, transDur * 0.35);
            const cardOutDuration = Math.min(0.25, transDur * 0.25);

            if (index > 0) {
                timeline.to(
                    `.bestseller-product-card-${index - 1}`,
                    {
                        autoAlpha: 0,
                        y: -18,
                        scale: 0.98,
                        duration: cardOutDuration,
                        ease: "power2.in",
                    },
                    transitionAt,
                );
            }

            timeline.to(
                playhead,
                {
                    time: productVideoCueTimes[index],
                    duration: transDur,
                // Linear progress preserves the frame order between the
                // supplied product timestamps.
                    ease: "none",
                    onUpdate: seekToPlayhead,
                },
                transitionAt,
            );

            timeline.fromTo(
                `.bestseller-product-card-${index}`,
                { autoAlpha: 0, y: 24, scale: 0.96 },
                {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: cardInDuration,
                    ease: "power3.out",
                },
                Math.max(transitionAt, settledAt - cardInDuration),
            );
            timeline.addLabel(`product-${index}`, settledAt);

            if (index < PRODUCT_COUNT - 1) {
                timeline.to({}, { duration: holdDur, ease: "none" }, settledAt);
                transitionAt = settledAt + holdDur;
            }
        }

        const mainTrigger = timeline.scrollTrigger;
        if (!mainTrigger) return;

        // Add click listeners on indicator dots
        const dotHandlers: Array<() => void> = [];
        dots.forEach((dot, dIdx) => {
            const handleDotClick = () => {
                const labelTime = timeline.labels[`product-${dIdx}`] ?? 0;
                const targetProgress = timeline.duration() > 0
                    ? labelTime / timeline.duration()
                    : 0;
                const targetScroll = mainTrigger.start + targetProgress * scrollLength;
                const sm = ScrollSmoother.get();
                if (sm) {
                    sm.scrollTo(targetScroll, true);
                } else {
                    window.scrollTo({ top: targetScroll, behavior: "smooth" });
                }
            };
            dotHandlers.push(handleDotClick);
            dot.addEventListener("click", handleDotClick);
        });

        return () => {
            dots.forEach((dot, index) => {
                dot.removeEventListener("click", dotHandlers[index]);
            });
            timeline.kill();
        };
    }, { scope: sectionRef, dependencies: [isMob] });

    return (
        <section ref={sectionRef} className="flavor-section relative bg-white overflow-hidden w-full h-screen">
            {/* Background luxury gradient */}
            <div
                className="flavor-bg-tint pointer-events-none absolute inset-0 z-0"
                style={{
                    background:
                        "radial-gradient(ellipse at 50% 45%, rgba(220,38,38,0.06) 0%, rgba(255,255,255,0) 65%)",
                }}
            />

            {/* Header: Centered title overlay */}
            <div className="bestseller-heading absolute top-6 md:top-10 inset-x-0 z-20 flex flex-col items-center pointer-events-none px-4 text-center">
                <span className="bestseller-heading-kicker mb-1 text-[0.65rem] font-bold uppercase tracking-[0.35em] md:text-xs">
                    Signature Collection
                </span>
                <h2
                    className="bestseller-heading-title text-2xl sm:text-3xl md:text-5xl uppercase tracking-tight font-black"
                    style={{ fontFamily: "Syne, sans-serif" }}
                >
                    The Bestsellers
                </h2>
            </div>

            {/* Vertical Indicator Dots (Right Side) */}
            <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3 bg-white/80 backdrop-blur-md p-2.5 rounded-full border border-charcoal/10 shadow-lg">
                {Array.from({ length: PRODUCT_COUNT }).map((_, i) => (
                    <div
                        key={i}
                        className={`bestseller-dot transition-all duration-300 rounded-full ${
                            i === 0
                                ? "w-2.5 h-6 bg-sick-red shadow-[0_0_12px_rgba(220,38,38,0.5)] cursor-pointer"
                                : "w-2 h-2 bg-charcoal/20 hover:bg-charcoal/50 cursor-pointer"
                        }`}
                        title={`Go to ${PRODUCT_VIDEO_CUES[i].name}`}
                    />
                ))}
            </div>

            {/* Full Screen Video Stage */}
            <div className="bestseller-video-stage absolute inset-0 z-10 flex h-full w-full items-center justify-center pointer-events-none">
                <BestsellerFrameSequence
                    ref={sequenceRef}
                    mobile={isMob}
                    cueTimes={productVideoCueTimes}
                />
            </div>

            {/* Product details animate in only as each timestamp settles. */}
            <div className="pointer-events-none absolute inset-0 z-30">
                {PRODUCT_VIDEO_CUES.map((cue, index) => (
                    <ProductSpotlightCard
                        key={cue.handle}
                        cue={cue}
                        index={index}
                        product={shopifyProducts.find((product) => product.handle === cue.handle)}
                    />
                ))}
            </div>
        </section>
    );
};

export default FlavorSection;
