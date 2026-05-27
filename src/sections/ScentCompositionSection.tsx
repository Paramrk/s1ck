import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother, SplitText } from "gsap/all";
import ScentSectionTitle from "../components/ScentSectionTitle";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import {
    scentCompositions,
    type ScentCompositionItem,
} from "../constants/scentComposition";

gsap.registerPlugin(ScrollTrigger);

const getScrollScroller = (): Element | undefined => {
    if (ScrollSmoother.get()) {
        return document.getElementById("smooth-wrapper") ?? undefined;
    }
    return undefined;
};

const HighlightsList = ({ item }: { item: ScentCompositionItem }) => (
    <ul className="sc-highlights space-y-2 sm:space-y-3.5 border-t border-charcoal/10 pt-3 sm:pt-4">
        {item.highlights.map((line, idx) => (
            <li
                key={line}
                className={`text-charcoal leading-snug pl-3 border-l-2 ${
                    idx === 0
                        ? "text-sm sm:text-base font-medium"
                        : "text-xs sm:text-sm text-charcoal/85"
                }`}
                style={{
                    fontFamily: "Syne, sans-serif",
                    borderColor: item.accentColor,
                }}
            >
                {line}
            </li>
        ))}
    </ul>
);

const ScentCompositionSection = () => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const isMob = useMediaQuery({ query: "(max-width: 768px)" });
    const count = scentCompositions.length;

    useGSAP(
        () => {
            const section = sectionRef.current;
            if (!section) return;

            const bottleEnterY = isMob ? 0 : 110;
            const stepDuration = isMob ? 1.15 : 1;
            const scrollLength = isMob ? count * 1100 : count * 1100;
            const scroller = getScrollScroller();

            scentCompositions.forEach((entry, i) => {
                if (i === 0) {
                    gsap.set(`.sc-panel-0`, { autoAlpha: 1, visibility: "visible", zIndex: 2 });
                    gsap.set(`.sc-panel-0 .sc-bottle-wrap`, { yPercent: 0, opacity: 1 });
                    return;
                }
                gsap.set(`.sc-panel-${i}`, { autoAlpha: 0, visibility: "hidden", zIndex: 1 });
                gsap.set(`.sc-panel-${i} .sc-bottle-wrap`, {
                    yPercent: entry.bottleFadeTransition ? 0 : bottleEnterY,
                    opacity: 0,
                });
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    scroller: scroller ?? undefined,
                    start: "top top",
                    end: `+=${scrollLength}`,
                    scrub: isMob ? 1.25 : 0.85,
                    pin: true,
                    pinSpacing: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            });

            if (isMob) {
                tl.to({}, { duration: 0.45, ease: "none" }, 0);
            }

            for (let i = 1; i < count; i++) {
                const item = scentCompositions[i];
                const prev = i - 1;
                const at = i * stepDuration;
                const panelIn = `.sc-panel-${i}`;
                const panelOut = `.sc-panel-${prev}`;

                const bottleWrap = `${panelIn} .sc-bottle-wrap`;
                const fadeBottle = isMob || item.bottleFadeTransition === true;
                const fadeOutPrevBottle =
                    isMob || scentCompositions[prev]?.bottleFadeTransition === true
                        ? `${panelOut} .sc-bottle-wrap`
                        : null;

                tl.addLabel(`sc-step-${i}`, at);

                if (fadeOutPrevBottle) {
                    tl.to(
                        fadeOutPrevBottle,
                        { opacity: 0, duration: 0.35, ease: "power2.inOut" },
                        at,
                    );
                }

                tl.to(panelOut, { autoAlpha: 0, duration: 0.32, ease: "power2.in" }, at)
                    .set(panelOut, { visibility: "hidden", zIndex: 1 }, at)
                    .set(panelIn, { visibility: "visible", zIndex: 2 }, at)
                    .fromTo(
                        panelIn,
                        { autoAlpha: 0 },
                        { autoAlpha: 1, duration: 0.35, ease: "power2.out" },
                        at,
                    );

                if (fadeBottle) {
                    tl.fromTo(
                        bottleWrap,
                        { opacity: 0 },
                        { opacity: 1, duration: 0.55, ease: "power2.inOut" },
                        at + 0.08,
                    );
                } else {
                    tl.fromTo(
                        bottleWrap,
                        { yPercent: bottleEnterY, opacity: 0 },
                        { yPercent: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
                        at + 0.03,
                    );
                }

                tl
                    .to(
                        `.sc-dot-${prev}`,
                        {
                            width: 8,
                            height: 8,
                            backgroundColor: "rgba(17,17,17,0.18)",
                            duration: 0.25,
                        },
                        at,
                    )
                    .to(
                        `.sc-dot-${i}`,
                        {
                            width: 28,
                            height: 8,
                            backgroundColor: item.accentColor,
                            duration: 0.25,
                        },
                        at,
                    );

                if (isMob) {
                    tl.to({}, { duration: 0.5, ease: "none" }, at + 0.72);
                }
            }

            const refresh = () => ScrollTrigger.refresh(true);
            const t1 = window.setTimeout(refresh, 80);
            const t2 = window.setTimeout(refresh, 400);

            return () => {
                window.clearTimeout(t1);
                window.clearTimeout(t2);
            };
        },
        { scope: sectionRef, dependencies: [isMob, count], revertOnUpdate: true },
    );

    useEffect(() => {
        const refresh = () => ScrollTrigger.refresh(true);
        const t = window.setTimeout(refresh, 100);
        return () => window.clearTimeout(t);
    }, []);

    useGSAP(
        () => {
            const section = sectionRef.current;
            if (!section) return;

            const mm = gsap.matchMedia();
            const scroller = getScrollScroller();

            const buildTitleIntro = (isMobile: boolean) => {
                document.fonts.ready.then(() => {
                    const splitHeadlineLines = (selector: string) => {
                        const lines = gsap.utils.toArray<HTMLElement>(
                            `${selector} .flavor-headline-line`,
                        );
                        return lines
                            .map((line) => SplitText.create(line, { type: "chars" }))
                            .flatMap((split) => split.chars);
                    };

                    const firstChars = splitHeadlineLines(".sc-first-text-split");

                    const triggerBase = {
                        trigger: section,
                        scroller: scroller ?? undefined,
                    };

                    gsap.from(firstChars, {
                        yPercent: 180,
                        stagger: 0.02,
                        ease: "power2.out",
                        duration: 0.9,
                        scrollTrigger: {
                            ...triggerBase,
                            start: isMobile ? "top 72%" : "top 78%",
                        },
                    });

                    gsap.to(".sc-flavor-text-scroll", {
                        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                        ease: "power2.out",
                        duration: 0.9,
                        scrollTrigger: {
                            ...triggerBase,
                            start: isMobile ? "top 58%" : "top 65%",
                        },
                    });

                    gsap.from(".sc-title-stars", {
                        opacity: 0,
                        y: 16,
                        duration: 0.7,
                        ease: "power2.out",
                        scrollTrigger: {
                            ...triggerBase,
                            start: isMobile ? "top 82%" : "top 88%",
                        },
                    });

                    gsap.from(".sc-title-subtitle", {
                        opacity: 0,
                        y: 16,
                        duration: 0.7,
                        ease: "power2.out",
                        scrollTrigger: {
                            ...triggerBase,
                            start: isMobile ? "top 42%" : "top 48%",
                        },
                    });
                });
            };

            mm.add("(max-width: 768px)", () => {
                gsap.set(".sc-flavor-text-scroll", {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                });
                gsap.set(".sc-first-text-split .flavor-headline-line", {
                    y: 0,
                    opacity: 1,
                    clearProps: "transform",
                });
            });
            mm.add("(min-width: 769px)", () => buildTitleIntro(false));

            return () => mm.revert();
        },
        { scope: sectionRef },
    );

    return (
        <section
            ref={sectionRef}
            className="scent-composition-section relative overflow-hidden bg-white"
            aria-labelledby="scent-composition-heading"
        >
            <div className="scent-composition-inner relative z-10 flex max-md:h-[100dvh] max-md:max-h-[100dvh] max-md:flex-col max-md:justify-between max-md:overflow-hidden max-md:px-4 max-md:pt-[3.35rem] max-md:pb-3 md:h-dvh md:min-h-[600px] md:max-h-dvh md:flex md:flex-col md:px-6 md:pt-10 md:pb-[4.5rem] lg:px-12 xl:px-16">
                <header className="sc-section-header shrink-0 w-full flex justify-center z-30 max-md:pb-0 md:mb-3 lg:mb-4">
                    <ScentSectionTitle />
                </header>

                <div className="sc-panel-stage relative flex-1 min-h-0 w-full">
                    {scentCompositions.map((item, i) => {
                        const isFirst = i === 0;

                        return (
                            <article
                                key={item.id}
                                className={`sc-panel sc-panel-${i} absolute inset-0 flex h-full min-h-0 flex-col bg-transparent lg:grid lg:h-full lg:grid-cols-2 lg:grid-rows-1 lg:gap-8 xl:gap-12 lg:items-stretch`}
                                style={{
                                    visibility: isFirst ? "visible" : "hidden",
                                    zIndex: isFirst ? 2 : 1,
                                }}
                            >
                                {/* ── Left: bottle stage ── */}
                                <div className="sc-bottle-col relative flex min-h-0 w-full items-center justify-center overflow-visible max-md:flex-1 max-md:min-h-0 max-md:items-start max-md:justify-center max-md:pt-1 max-md:overflow-visible lg:order-1 lg:h-full lg:max-h-none lg:min-h-[min(44dvh,380px)]">
                                    <div className="sc-stage relative flex h-full w-full max-w-[540px] items-center justify-center mx-auto lg:min-h-[min(58dvh,620px)] lg:h-full">
                                        <div
                                            className={`sc-bottle-glow pointer-events-none absolute left-1/2 top-1/2 z-[5] max-md:sc-bottle-glow--mobile -translate-x-1/2 -translate-y-1/2 lg:top-[54%] lg:h-[min(46dvh,460px)] lg:w-[min(88vw,400px)] lg:max-w-none ${item.bottleGlowClass ?? ""}`}
                                            style={{ background: item.bottleGlow }}
                                            aria-hidden="true"
                                        />
                                        <div
                                            className={`sc-fruits-${i} absolute inset-0 z-20 pointer-events-none`}
                                        >
                                            {item.fruits.map((fruit, fi) => (
                                                <div
                                                    key={fi}
                                                    className={`scent-fruit-spin absolute ${fruit.sizeClass} aspect-square flex items-center justify-center`}
                                                    style={{
                                                        ...fruit.style,
                                                        animationDuration: `${fruit.spinSec}s`,
                                                    }}
                                                >
                                                    <img
                                                        src={fruit.src}
                                                        alt=""
                                                        className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
                                                        loading="lazy"
                                                        decoding="async"
                                                        draggable={false}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div
                                            className={
                                                item.bottleWrapClass ??
                                                `sc-bottle-wrap relative z-10 flex h-[min(42dvh,460px)] sm:h-[min(46dvh,500px)] lg:h-[min(54dvh,560px)] w-full will-change-[transform,opacity] ${item.bottlePlacementClass ?? "items-end justify-center origin-bottom"} ${item.bottleScaleClass}`
                                            }
                                        >
                                            <img
                                                src={item.bottleSrc}
                                                alt={`${item.name} perfume bottle`}
                                                className={
                                                    item.bottleImgClass ??
                                                    `${item.bottleWidthClass} object-contain object-bottom drop-shadow-[0_28px_56px_rgba(0,0,0,0.22)]`
                                                }
                                                loading="lazy"
                                                decoding="async"
                                                draggable={false}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* ── Right: product info (fixed slots per slide) ── */}
                                <div
                                    className={`sc-copy sc-copy-${i} flex min-h-0 flex-col overflow-hidden max-md:relative max-md:z-30 max-md:shrink-0 max-md:justify-start max-md:bg-white max-md:pt-1 max-md:pb-0 lg:flex-1 lg:order-2 lg:justify-center lg:pl-4 lg:pt-2 xl:pl-8`}
                                >
                                    <div className="sc-copy-inner w-full">
                                        <div className="sc-copy-title flex items-start pr-1">
                                            <h3
                                                className="text-charcoal text-xl sm:text-2xl lg:text-[2rem] xl:text-[2.15rem] uppercase font-bold leading-[1.12] tracking-tight"
                                                style={{ fontFamily: "Syne, sans-serif" }}
                                            >
                                                {item.name}
                                            </h3>
                                        </div>

                                        <div className="sc-copy-cta">
                                            <Link
                                                to={item.shopHref}
                                                className="sc-buy-btn flex w-full min-h-[3.25rem] sm:min-h-[3.5rem] items-center justify-center gap-2 rounded-full px-8 py-3.5 sm:py-4 text-xs uppercase tracking-[0.2em] font-semibold text-white transition-opacity duration-300 hover:opacity-90 pointer-events-auto relative z-40"
                                                style={{
                                                    fontFamily: "Syne, sans-serif",
                                                    backgroundColor: item.accentColor,
                                                    boxShadow: `0 10px 28px ${item.accentGlow}`,
                                                }}
                                            >
                                                Shop Now
                                                <i className="ri-shopping-bag-3-line text-base" aria-hidden="true" />
                                            </Link>
                                        </div>

                                        <div className="sc-copy-body pr-1">
                                            <HighlightsList item={item} />
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>

                <div
                    className="sc-dots-row relative z-30 mx-auto flex shrink-0 items-center justify-center gap-2 py-2 pointer-events-none max-md:mt-0 md:absolute md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:py-0"
                    role="tablist"
                    aria-label="Scent slides"
                >
                    {scentCompositions.map((item, i) => (
                        <span
                            key={item.id}
                            className={`sc-dot-${i} rounded-full`}
                            style={{
                                width: i === 0 ? 28 : 8,
                                height: 8,
                                backgroundColor: i === 0 ? item.accentColor : "rgba(17,17,17,0.18)",
                            }}
                            aria-hidden="true"
                        />
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes scent-fruit-rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .scent-fruit-spin {
                    animation: scent-fruit-rotate linear infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .scent-fruit-spin { animation: none; }
                }
            `}</style>
        </section>
    );
};

export default ScentCompositionSection;
