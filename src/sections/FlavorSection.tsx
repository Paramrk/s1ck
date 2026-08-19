import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useMediaQuery } from "react-responsive";
import {
    buildCarouselSegments,
    getActiveProductIndex,
    getMaxProgressForPlayhead,
    getPlayheadAtProgress,
    getProductCarouselTiming,
    getProgressForProduct,
    getSettledProductIndex,
    snapPlayheadToFrame,
} from "../utils/productCarouselScroll";
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
const FRAME_RATE = 60;
const PRODUCT_VIDEO_CUE_TIMES = PRODUCT_VIDEO_CUES.map((cue) => cue.time);
const MOBILE_PRODUCT_VIDEO_CUE_TIMES = PRODUCT_VIDEO_CUES.map((cue) =>
    cue.name === "Avant Garde" ? 8.087 : cue.time,
);

/** Bottle settle points in the generated 60 fps sprite sequence (0-based frame index). */
export const PRODUCT_FRAME_CUES = PRODUCT_VIDEO_CUES.map((cue, index) => ({
    index,
    name: cue.name,
    desktop: {
        timeSec: cue.time,
        frame: Math.round(cue.time * FRAME_RATE),
    },
    mobile: {
        timeSec: MOBILE_PRODUCT_VIDEO_CUE_TIMES[index],
        frame: Math.round(MOBILE_PRODUCT_VIDEO_CUE_TIMES[index] * FRAME_RATE),
    },
}));

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

const CARD_SLOT_CLASS =
    "h-[19.5rem] w-[min(22rem,calc(100vw-5.5rem))] md:h-[21rem] md:w-[25rem]";

const INTRO_ACCENT = "#dc2626";

const CARD_LAYER_CLASS =
    "bestseller-card-layer absolute inset-0 flex h-full flex-col p-4 text-charcoal md:p-5";

const CARD_SHELL_CLASS =
    "bestseller-card-shell pointer-events-auto flex h-full w-full flex-col overflow-hidden rounded-2xl border border-charcoal/10 bg-white shadow-[0_18px_52px_rgba(0,0,0,0.24)]";

const IntroCardLayer = () => (
    <div className={`${CARD_LAYER_CLASS} bestseller-card-layer-intro invisible opacity-0`}>
        <div className="flex h-[4.25rem] shrink-0 items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-sick-red shadow-[0_0_12px_rgba(220,38,38,0.55)]" />
                    <span className="truncate text-[0.55rem] font-bold uppercase tracking-[0.22em] text-charcoal/55">
                        From S1CK
                    </span>
                </div>
                <h3
                    className="line-clamp-2 text-lg font-black uppercase leading-[1.05] tracking-[-0.02em] md:text-xl"
                    style={{ fontFamily: "Syne, sans-serif" }}
                >
                    The Best of the Best
                </h3>
            </div>
            <div className="w-[5.25rem] shrink-0 text-right">
                <p className="text-[0.5rem] uppercase tracking-[0.2em] text-charcoal/45">Rated</p>
                <p className="truncate text-lg font-black leading-tight text-sick-red md:text-xl">
                    #1 × 7
                </p>
            </div>
        </div>

        <div className="grid h-[4.5rem] shrink-0 grid-cols-2 gap-3 border-y border-charcoal/10 py-3 text-[0.62rem]">
            <div className="min-w-0">
                <p className="mb-1 uppercase tracking-[0.18em] text-charcoal/40">Collection</p>
                <p className="line-clamp-2 font-semibold leading-snug">Signature bestseller lineup</p>
            </div>
            <div className="min-w-0">
                <p className="mb-1 uppercase tracking-[0.18em] text-charcoal/40">Experience</p>
                <p className="line-clamp-2 font-semibold leading-snug">Scroll to reveal each bottle</p>
            </div>
        </div>

        <div className="flex h-[2.85rem] shrink-0 flex-wrap content-start gap-1.5 overflow-hidden pt-3">
            {["Pheromone", "Premium", "Magnetic"].map((tag) => (
                <span
                    key={tag}
                    className="rounded-full border border-charcoal/10 bg-charcoal/[0.04] px-2.5 py-1 text-[0.52rem] font-semibold uppercase tracking-[0.12em]"
                >
                    {tag}
                </span>
            ))}
        </div>

        <div className="mt-auto flex h-[3.75rem] shrink-0 items-end justify-between gap-3 pt-3">
            <div className="min-w-0 flex-1">
                <p className="truncate text-[0.58rem] font-bold uppercase tracking-[0.14em] text-charcoal/65">
                    House of Pheromones pick
                </p>
                <p className="mt-1 line-clamp-2 text-[0.54rem] leading-snug text-charcoal/45">
                    Dangerously attractive formulas · scroll to explore
                </p>
            </div>
            <span className="shrink-0 rounded-full border border-charcoal/15 bg-charcoal/5 px-4 py-2.5 text-[0.55rem] font-bold uppercase tracking-[0.18em] text-charcoal/55">
                Scroll ↓
            </span>
        </div>
    </div>
);

const ProductCardLayer = ({
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

    const subline = rating
        ? `${rating.toFixed(1)} ★ verified rating`
        : cue.concentration;

    return (
        <div
            className={`${CARD_LAYER_CLASS} bestseller-card-layer-${index} invisible opacity-0`}
        >
            <div className="flex h-[4.25rem] shrink-0 items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-2">
                            <span
                                className="h-2 w-2 shrink-0 rounded-full shadow-[0_0_12px_currentColor]"
                                style={{ backgroundColor: cue.accent, color: cue.accent }}
                            />
                            <span className="truncate text-[0.55rem] font-bold uppercase tracking-[0.22em] text-charcoal/55">
                                {cue.badge}
                            </span>
                        </div>
                        <h3 className="line-clamp-2 text-lg font-black uppercase leading-[1.05] tracking-[-0.02em] md:text-xl">
                            {cue.name}
                        </h3>
                    </div>
                    <div className="w-[5.25rem] shrink-0 text-right">
                        <p className="text-[0.5rem] uppercase tracking-[0.2em] text-charcoal/45">From</p>
                        <p
                            className="truncate text-lg font-black leading-tight md:text-xl"
                            style={{ color: cue.accent }}
                        >
                            {price}
                        </p>
                    </div>
                </div>

                <div className="grid h-[4.5rem] shrink-0 grid-cols-2 gap-3 border-y border-charcoal/10 py-3 text-[0.62rem]">
                    <div className="min-w-0">
                        <p className="mb-1 uppercase tracking-[0.18em] text-charcoal/40">Fragrance</p>
                        <p className="line-clamp-2 font-semibold leading-snug">{cue.type}</p>
                    </div>
                    <div className="min-w-0">
                        <p className="mb-1 uppercase tracking-[0.18em] text-charcoal/40">Profile</p>
                        <p className="line-clamp-2 font-semibold leading-snug">{cue.profile}</p>
                    </div>
                </div>

                <div className="flex h-[2.85rem] shrink-0 flex-wrap content-start gap-1.5 overflow-hidden pt-3">
                    {cue.notes.map((note) => (
                        <span
                            key={note}
                            className="max-w-full truncate rounded-full border border-charcoal/10 bg-charcoal/[0.04] px-2.5 py-1 text-[0.52rem] font-semibold uppercase tracking-[0.12em]"
                        >
                            {note}
                        </span>
                    ))}
                </div>

                <div className="mt-auto flex h-[3.75rem] shrink-0 items-end justify-between gap-3 pt-3">
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[0.58rem] font-bold uppercase tracking-[0.14em] text-charcoal/65">
                            {proof}
                        </p>
                        <p className="mt-1 line-clamp-2 text-[0.54rem] leading-snug text-charcoal/45">
                            {subline}
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
    );
};

const FlavorSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const sequenceRef = useRef<BestsellerFrameSequenceHandle>(null);
    const ctaRef = useRef<HTMLButtonElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const entryPendingRef = useRef(false);
    const isMob = useMediaQuery({ query: "(max-width:768px)" });
    const [shopifyProducts, setShopifyProducts] = useState<ShopifyProductSummary[]>([]);
    const [loadProgress, setLoadProgress] = useState(0);
    const [sequenceReady, setSequenceReady] = useState(false);
    const [experienceStarted, setExperienceStarted] = useState(false);
    const [immersiveActive, setImmersiveActive] = useState(false);
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
        if (!sectionRef.current || !experienceStarted) return;

        const scroller = ScrollSmoother.get()
            ? document.getElementById("smooth-wrapper") ?? undefined
            : undefined;

        const dots = sectionRef.current.querySelectorAll<HTMLElement>(".bestseller-dot");

        const { transDur, holdDur, scrollLength } =
            getProductCarouselTiming(PRODUCT_COUNT + 1, isMob);
        const { segments, totalDuration } = buildCarouselSegments(
            productVideoCueTimes,
            transDur,
            holdDur,
            VIDEO_START_TIME,
        );

        let activeIdx = -1;
        let visibleCardIdx: number | "intro" | null = null;
        let targetProgress = 0;
        let displayPlayheadTime = VIDEO_START_TIME;
        let targetPlayheadTime = VIDEO_START_TIME;
        let playheadRaf = 0;
        let scrollIdleTimer = 0;
        const frameDuration = 1 / FRAME_RATE;
        const SCROLL_IDLE_MS = 140;
        const END_SCROLL_LOCK = 0.92;

        gsap.set(".bestseller-card-shell", {
            autoAlpha: 1,
            visibility: "visible",
        });
        gsap.set(".bestseller-card-layer", {
            autoAlpha: 0,
            visibility: "hidden",
        });

        const CARD_CROSSFADE = 0.45;

        const fadeCardLayer = (selector: string, visible: boolean) => {
            if (visible) {
                gsap.set(selector, { visibility: "visible" });
            }

            gsap.to(selector, {
                autoAlpha: visible ? 1 : 0,
                duration: CARD_CROSSFADE,
                ease: "power1.inOut",
                overwrite: true,
                onComplete: () => {
                    if (!visible) {
                        gsap.set(selector, { visibility: "hidden" });
                    }
                },
            });
        };

        const updateDots = (index: number) => {
            if (index === activeIdx) return;
            activeIdx = index;

            dots.forEach((dot, dotIndex) => {
                if (index < 0) {
                    dot.className = "bestseller-dot transition-all duration-300 rounded-full w-2 h-2 bg-charcoal/20 cursor-pointer";
                    return;
                }

                if (dotIndex === index) {
                    dot.className = "bestseller-dot transition-all duration-300 rounded-full w-2.5 h-6 bg-sick-red shadow-[0_0_12px_rgba(220,38,38,0.5)] cursor-pointer";
                } else {
                    dot.className = "bestseller-dot transition-all duration-300 rounded-full w-2 h-2 bg-charcoal/20 hover:bg-charcoal/50 cursor-pointer";
                }
            });
        };

        const syncProductCards = (playheadTime: number) => {
            const productIndex = getActiveProductIndex(playheadTime, productVideoCueTimes);
            const nextState: number | "intro" = productIndex === -1 ? "intro" : productIndex;

            if (nextState === visibleCardIdx) return;
            visibleCardIdx = nextState;

            const showIntro = nextState === "intro";
            const accent = showIntro
                ? INTRO_ACCENT
                : PRODUCT_VIDEO_CUES[productIndex].accent;

            gsap.to(".bestseller-card-shell", {
                borderTopColor: accent,
                duration: CARD_CROSSFADE,
                ease: "power1.inOut",
                overwrite: true,
            });

            fadeCardLayer(".bestseller-card-layer-intro", showIntro);

            for (let index = 0; index < PRODUCT_COUNT; index += 1) {
                fadeCardLayer(`.bestseller-card-layer-${index}`, index === productIndex);
            }

            updateDots(showIntro ? -1 : getSettledProductIndex(playheadTime, productVideoCueTimes));
        };

        const applyPlayhead = (playheadTime: number, snapFrame = false) => {
            displayPlayheadTime = snapFrame
                ? snapPlayheadToFrame(playheadTime, FRAME_RATE)
                : playheadTime;

            sequenceRef.current?.setTime(displayPlayheadTime);
            syncProductCards(displayPlayheadTime);
        };

        const resolveTargetPlayhead = (progress: number) =>
            getPlayheadAtProgress(progress, segments, totalDuration);

        const stopPlayheadStepper = () => {
            if (playheadRaf) {
                cancelAnimationFrame(playheadRaf);
                playheadRaf = 0;
            }
        };

        let scrollIntentProgress = 0;
        let mainTrigger: ScrollTrigger;

        const settlePlayhead = () => {
            if (Math.abs(targetPlayheadTime - displayPlayheadTime) <= frameDuration * 0.5) {
                stopPlayheadStepper();
                applyPlayhead(targetPlayheadTime, true);
            }
        };

        const scheduleScrollIdle = () => {
            window.clearTimeout(scrollIdleTimer);
            scrollIdleTimer = window.setTimeout(() => {
                const caughtUp =
                    Math.abs(targetPlayheadTime - displayPlayheadTime) <= frameDuration * 0.5;
                const endCatchUpPending =
                    scrollIntentProgress >= END_SCROLL_LOCK && !isSequenceComplete();

                if (caughtUp && !endCatchUpPending) {
                    stopPlayheadStepper();
                }
            }, SCROLL_IDLE_MS);
        };

        const isSequenceComplete = () =>
            displayPlayheadTime >= resolveTargetPlayhead(1) - frameDuration * 0.5;

        const clampScrollPosition = (self: ScrollTrigger) => {
            if (isSequenceComplete()) {
                return;
            }

            if (scrollIntentProgress < END_SCROLL_LOCK) {
                return;
            }

            const maxProgress = getMaxProgressForPlayhead(
                displayPlayheadTime,
                segments,
                totalDuration,
            );
            const allowedProgress = Math.min(scrollIntentProgress, maxProgress);

            if (Math.abs(self.progress - allowedProgress) > 0.0005) {
                self.scroll(self.start + allowedProgress * scrollLength);
            }
        };

        const getFrameTargetProgress = (self: ScrollTrigger) => {
            if (isSequenceComplete()) {
                return Math.min(1, Math.max(self.progress, scrollIntentProgress));
            }

            // During end lock, frames keep advancing toward where the user scrolled,
            // while physical scroll stays clamped to displayed frames.
            if (scrollIntentProgress >= END_SCROLL_LOCK) {
                return Math.min(1, scrollIntentProgress);
            }

            return self.progress;
        };

        const syncProgressFromScroll = (self: ScrollTrigger, stepping: boolean) => {
            if (self.progress + 0.005 < scrollIntentProgress) {
                scrollIntentProgress = self.progress;
            } else {
                scrollIntentProgress = Math.max(scrollIntentProgress, self.progress);
            }

            clampScrollPosition(self);
            syncScrollTarget(getFrameTargetProgress(self), stepping);
        };

        const stepPlayhead = () => {
            playheadRaf = 0;

            const diff = targetPlayheadTime - displayPlayheadTime;
            if (Math.abs(diff) <= frameDuration * 0.5) {
                applyPlayhead(targetPlayheadTime, true);
                syncProgressFromScroll(mainTrigger, true);
                return;
            }

            applyPlayhead(
                displayPlayheadTime + Math.sign(diff) * frameDuration,
                true,
            );

            syncProgressFromScroll(mainTrigger, true);

            if (Math.abs(targetPlayheadTime - displayPlayheadTime) > frameDuration * 0.5) {
                playheadRaf = requestAnimationFrame(stepPlayhead);
            }
        };

        const queuePlayheadStep = () => {
            if (!playheadRaf) {
                playheadRaf = requestAnimationFrame(stepPlayhead);
            }
        };

        const syncScrollTarget = (progress: number, stepping: boolean) => {
            targetProgress = progress;
            targetPlayheadTime = resolveTargetPlayhead(targetProgress);

            if (stepping) {
                queuePlayheadStep();
                scheduleScrollIdle();
                return;
            }

            settlePlayhead();
        };

        mainTrigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            scroller,
            start: "top top",
            end: `+=${scrollLength}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 0,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                syncProgressFromScroll(self, true);
            },
            onLeave: (self) => {
                if (isSequenceComplete()) return;
                if (scrollIntentProgress < END_SCROLL_LOCK) return;
                syncProgressFromScroll(self, true);
                queuePlayheadStep();
            },
            onToggle: (self) => {
                sectionRef.current?.classList.toggle("is-scroll-pinned", self.isActive);
                if (!self.isActive) {
                    window.clearTimeout(scrollIdleTimer);
                    if (!isSequenceComplete() && scrollIntentProgress >= END_SCROLL_LOCK) {
                        syncProgressFromScroll(self, true);
                        queuePlayheadStep();
                        return;
                    }
                    stopPlayheadStepper();
                } else {
                    syncProgressFromScroll(self, false);
                }
            },
        });

        const scrollToProgress = (progress: number) => {
            const targetScroll = mainTrigger.start + progress * scrollLength;
            const sm = ScrollSmoother.get();
            if (sm) {
                sm.scrollTo(targetScroll, true);
            } else {
                window.scrollTo({ top: targetScroll, behavior: "smooth" });
            }
        };

        const enterExperience = () => {
            applyPlayhead(VIDEO_START_TIME, true);
            syncScrollTarget(0, false);
            scrollToProgress(0);
        };

        if (entryPendingRef.current) {
            entryPendingRef.current = false;
            requestAnimationFrame(() => {
                ScrollTrigger.refresh(true);
                enterExperience();
            });
        } else {
            applyPlayhead(VIDEO_START_TIME, true);
            syncScrollTarget(0, false);
        }

        const dotHandlers: Array<() => void> = [];
        dots.forEach((dot, dIdx) => {
            const handleDotClick = () => {
                const productProgress = getProgressForProduct(dIdx, segments, totalDuration);
                scrollToProgress(productProgress);
            };
            dotHandlers.push(handleDotClick);
            dot.addEventListener("click", handleDotClick);
        });

        requestAnimationFrame(() => ScrollTrigger.refresh(true));

        return () => {
            stopPlayheadStepper();
            window.clearTimeout(scrollIdleTimer);
            dots.forEach((dot, index) => {
                dot.removeEventListener("click", dotHandlers[index]);
            });
            mainTrigger.kill();
        };
    }, { scope: sectionRef, dependencies: [isMob, experienceStarted, productVideoCueTimes] });

    const handleStartExperience = () => {
        if (!sequenceReady || experienceStarted) return;

        entryPendingRef.current = true;
        setImmersiveActive(true);
        window.dispatchEvent(new CustomEvent("nav-logo-resample"));

        const enterTimeline = gsap.timeline({
            onComplete: () => setExperienceStarted(true),
        });

        if (overlayRef.current) {
            enterTimeline.to(overlayRef.current, {
                opacity: 0,
                duration: 0.45,
                ease: "power2.inOut",
                pointerEvents: "none",
            }, 0);
        }

        if (ctaRef.current) {
            enterTimeline.to(ctaRef.current, {
                opacity: 0,
                scale: 0.9,
                y: 20,
                duration: 0.4,
                ease: "power2.in",
            }, 0);
        }
    };

    return (
        <section
            ref={sectionRef}
            className="flavor-section relative bg-white overflow-hidden w-full h-screen"
            data-nav-logo={immersiveActive ? "light" : undefined}
        >
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

            {/* Vertical Indicator Dots (Left Side) */}
            <div className={`absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3 bg-white/80 backdrop-blur-md p-2.5 rounded-full border border-charcoal/10 shadow-lg transition-opacity duration-300 ${experienceStarted ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
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
                    onPreloadProgress={setLoadProgress}
                    onPreloadComplete={() => setSequenceReady(true)}
                />
            </div>

            {/* Preload gate — full sequence must cache before the experience unlocks */}
            {!experienceStarted && (
                <div
                    ref={overlayRef}
                    className="bestseller-load-overlay absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#faf8f5]/95 px-6 backdrop-blur-md"
                >
                    <div
                        className="pointer-events-none absolute inset-0 opacity-70"
                        style={{
                            background:
                                "radial-gradient(ellipse at 50% 40%, rgba(220,38,38,0.08) 0%, rgba(250,248,245,0) 62%)",
                        }}
                    />

                    <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
                        <span className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.38em] text-charcoal/50 md:text-xs">
                            Signature Collection
                        </span>
                        <h2
                            className="mb-8 text-2xl font-black uppercase tracking-tight text-charcoal sm:text-3xl md:text-4xl"
                            style={{ fontFamily: "Syne, sans-serif" }}
                        >
                            The Bestsellers
                        </h2>

                        <div className="mb-3 w-full">
                            <div className="mb-2 flex items-center justify-between text-[0.58rem] font-bold uppercase tracking-[0.22em] text-charcoal/45">
                                <span>Preparing experience</span>
                                <span>{loadProgress}%</span>
                            </div>
                            <div className="h-[3px] w-full overflow-hidden rounded-full bg-charcoal/10">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-red-700 via-sick-red to-red-600 transition-[width] duration-300 ease-out shadow-[0_0_16px_rgba(220,38,38,0.45)]"
                                    style={{ width: `${loadProgress}%` }}
                                />
                            </div>
                        </div>

                        <p className="mb-8 max-w-xs text-[0.72rem] leading-relaxed tracking-[0.04em] text-charcoal/55">
                            Caching the full bottle sequence so scroll stays smooth on any connection.
                        </p>

                        <button
                            ref={ctaRef}
                            type="button"
                            disabled={!sequenceReady}
                            onClick={handleStartExperience}
                            className={`rounded-full px-8 py-4 text-[0.62rem] font-black uppercase tracking-[0.22em] transition-all duration-300 md:px-10 md:py-4 md:text-xs ${
                                sequenceReady
                                    ? "bg-gradient-to-r from-red-700 via-sick-red to-red-700 text-white shadow-[0_0_32px_rgba(220,38,38,0.55)] border border-red-400/40 hover:scale-[1.03] active:scale-[0.98]"
                                    : "cursor-not-allowed border border-charcoal/10 bg-charcoal/5 text-charcoal/35"
                            }`}
                        >
                            {sequenceReady ? "Immersive S1CK Experience" : "Loading sequence…"}
                        </button>
                    </div>
                </div>
            )}

            {/* Product card — opaque shell; only inner text layers crossfade */}
            <div
                className={`pointer-events-none absolute bottom-4 right-4 z-30 md:bottom-8 md:right-8 ${CARD_SLOT_CLASS} ${experienceStarted ? "" : "opacity-0"}`}
            >
                <div
                    className={CARD_SHELL_CLASS}
                    style={{ borderTop: `3px solid ${INTRO_ACCENT}` }}
                >
                    <div className="relative h-full w-full">
                        <IntroCardLayer />
                        {PRODUCT_VIDEO_CUES.map((cue, index) => (
                            <ProductCardLayer
                                key={cue.handle}
                                cue={cue}
                                index={index}
                                product={shopifyProducts.find((product) => product.handle === cue.handle)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FlavorSection;
