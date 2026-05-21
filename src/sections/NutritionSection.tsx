import { useGSAP } from "@gsap/react";
import { nutrientLists } from "../constants/details";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import { getImage } from "../utils/media";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

type Feature = {
    icon: string;
    title: string;
    body: string;
};

const features: Feature[] = [
    {
        icon: "ri-hourglass-2-line",
        title: "92% Raw Materials",
        body: "Premium ingredients. No cheap filler scent.",
    },
    {
        icon: "ri-contrast-drop-2-line",
        title: "48mg Pheromone Blend",
        body: "A complex S1CK formula designed for presence and attraction.",
    },
    {
        icon: "ri-time-line",
        title: "Long-Lasting Formula",
        body: "Built for bold projection and lasting wear.",
    },
    {
        icon: "ri-focus-3-line",
        title: "Crafted for Maximum Impact",
        body: "Luxury fragrance meets advanced pheromone science.",
    },
];

const bottles: { name: string; file: string }[] = [
    { name: "Le Toxiquè", file: "lt.webp" },
    { name: "Liquid Silver", file: "ls.webp" },
    { name: "Alpha Q", file: "aq.webp" },
    { name: "Avant-Garde", file: "avant-garde.webp" },
    { name: "Le-Toxique Oil", file: "ltoil.webp" },
    { name: "Arcane", file: "arc.webp" },
];

// Tiny inline splash SVG used behind every bottle — fluid, vector, blends with white
const SplashSVG = ({ className = "" }: { className?: string }) => (
    <svg
        viewBox="0 0 600 400"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
        focusable="false"
    >
        <defs>
            <radialGradient id="splash-core" cx="50%" cy="55%" r="55%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="40%" stopColor="#ffffff" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="splash-droplet" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#cdd6e0" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#e6ecf3" stopOpacity="0.35" />
            </linearGradient>
        </defs>
        <ellipse cx="300" cy="230" rx="240" ry="120" fill="url(#splash-core)" />
        {/* radiating droplets */}
        <g fill="url(#splash-droplet)">
            <ellipse cx="80"  cy="180" rx="22" ry="14" />
            <ellipse cx="120" cy="120" rx="14" ry="9"  />
            <ellipse cx="200" cy="60"  rx="18" ry="11" />
            <ellipse cx="300" cy="40"  rx="12" ry="8"  />
            <ellipse cx="400" cy="70"  rx="20" ry="13" />
            <ellipse cx="490" cy="130" rx="15" ry="10" />
            <ellipse cx="540" cy="190" rx="24" ry="15" />
            <ellipse cx="60"  cy="260" rx="16" ry="10" />
            <ellipse cx="540" cy="280" rx="18" ry="11" />
        </g>
        {/* fine spray dots */}
        <g fill="#ffffff" fillOpacity="0.75">
            {Array.from({ length: 18 }).map((_, i) => {
                const cx = 40 + ((i * 79) % 520);
                const cy = 20 + ((i * 53) % 360);
                const r = 1.5 + ((i * 7) % 5) * 0.4;
                return <circle key={i} cx={cx} cy={cy} r={r} />;
            })}
        </g>
    </svg>
);

const NutritionSection = ({ showMockup = false }: { showMockup?: boolean }) => {
    const sectionRef = useRef<HTMLElement | null>(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();

        const build = (mobile: boolean) => {
            // ── Set initial hidden states synchronously so nothing flashes ───
            gsap.set(".nut-headline-line", { yPercent: 120, opacity: 0, rotateX: 14, transformPerspective: 800 });
            gsap.set(".nut-ribbon", { x: -160, rotate: -8, opacity: 0, scale: 0.9 });
            gsap.set(".nut-feature", { opacity: 0, y: 40 });
            gsap.set(".nut-bottle", { opacity: 0, yPercent: 18, scale: 0.92 });
            gsap.set(".nut-splash", { opacity: 0, scale: 0.6 });
            gsap.set(".nut-mockup-img", { opacity: 0, yPercent: 12, scale: 0.95 });
            gsap.set(".nut-shop", { opacity: 0, y: 20 });
            gsap.set(".nut-compound", { opacity: 0, y: 40 });

            document.fonts.ready.then(() => {
                // ── 1. Headline: line-by-line entrance ───────────────────────
                gsap.to(".nut-headline-line", {
                    yPercent: 0,
                    opacity: 1,
                    rotateX: 0,
                    stagger: 0.18,
                    ease: "power3.out",
                    duration: 1,
                    scrollTrigger: {
                        trigger: ".nutrition-section",
                        start: mobile ? "top 80%" : "top 75%",
                    },
                });

                // Subtle parallax on the headline CLIP wrappers — desktop only
                // (scrub-based parallax on mobile adds per-frame overhead)
                if (!mobile) {
                    gsap.utils.toArray<HTMLElement>(".nut-headline-clip").forEach((clip, idx) => {
                        gsap.to(clip, {
                            yPercent: -(4 + idx * 3),
                            ease: "none",
                            scrollTrigger: {
                                trigger: ".nutrition-section",
                                start: "top top",
                                end: "bottom top",
                                scrub: true,
                            },
                        });
                    });
                }

                // Description words
                const paraSplit = SplitText.create(".nut-para", { type: "words" });
                gsap.from(paraSplit.words, {
                    opacity: 0,
                    yPercent: 30,
                    stagger: 0.03,
                    duration: 0.7,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".nutrition-section",
                        start: mobile ? "top 70%" : "top 65%",
                    },
                });

                gsap.to(".nut-shop", {
                    opacity: 1, y: 0,
                    duration: 0.7,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".nutrition-section",
                        start: mobile ? "top 65%" : "top 60%",
                    },
                });

                // ── 2. Red ribbon ────────────────────────────────────────────
                gsap.to(".nut-ribbon", {
                    x: 0, rotate: -2, opacity: 1, scale: 1,
                    duration: 0.9,
                    ease: "back.out(1.6)",
                    scrollTrigger: {
                        trigger: ".nutrition-section",
                        start: mobile ? "top 60%" : "top 55%",
                    },
                });

                // ── 3. Feature icons stagger left-to-right ───────────────────
                gsap.to(".nut-feature", {
                    opacity: 1, y: 0,
                    stagger: 0.12,
                    duration: 0.7,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".nut-feature-row",
                        start: mobile ? "top 90%" : "top 85%",
                    },
                });

                // ── 4. Bottle entrance ───────────────────────────────────────
                gsap.to(".nut-bottle", {
                    opacity: 1, yPercent: 0, scale: 1,
                    stagger: 0.08,
                    duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".nut-stage",
                        start: mobile ? "top 90%" : "top 85%",
                    },
                });

                gsap.to(".nut-splash", {
                    opacity: 1, scale: 1,
                    stagger: 0.06,
                    duration: 1.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".nut-stage",
                        start: mobile ? "top 85%" : "top 80%",
                    },
                });

                // ── 4b. Mockup entrance ──────────────────────────────────────
                gsap.to(".nut-mockup-img", {
                    opacity: 1, yPercent: 0, scale: 1,
                    duration: 1.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".nut-stage",
                        start: mobile ? "top 90%" : "top 85%",
                    },
                });

                // ── Desktop-only continuous animations ───────────────────────
                // These run infinitely (repeat: -1) and eat GPU even when
                // off-screen. Skip entirely on mobile.
                if (!mobile) {
                    // 4c. Continuous float on mockup image
                    gsap.to(".nut-mockup-img", {
                        y: "-=8",
                        rotate: 0.4,
                        duration: 4.5,
                        ease: "sine.inOut",
                        yoyo: true,
                        repeat: -1,
                    });

                    // 5. Bottle parallax — applied to the FRAME wrapper
                    gsap.utils.toArray<HTMLElement>(".nut-bottle-frame").forEach((frame, i) => {
                        const depth = (i % 3) - 1;
                        gsap.to(frame, {
                            yPercent: depth * 10,
                            ease: "none",
                            scrollTrigger: {
                                trigger: ".nutrition-section",
                                start: "top bottom",
                                end: "bottom top",
                                scrub: 1,
                            },
                        });
                    });

                    // 6. Continuous float on bottle FRAMES
                    gsap.utils.toArray<HTMLElement>(".nut-bottle-frame").forEach((frame, i) => {
                        gsap.to(frame, {
                            y: "-=10",
                            rotate: i % 2 === 0 ? 1.2 : -1.2,
                            duration: 3 + (i % 3) * 0.6,
                            ease: "sine.inOut",
                            yoyo: true,
                            repeat: -1,
                            delay: i * 0.25,
                        });
                    });

                    // 7. Splash breathing
                    gsap.utils.toArray<HTMLElement>(".nut-splash").forEach((splash, i) => {
                        gsap.to(splash, {
                            scale: 1.04,
                            duration: 4 + (i % 3) * 0.7,
                            ease: "sine.inOut",
                            yoyo: true,
                            repeat: -1,
                            delay: 0.6 + i * 0.4,
                        });
                    });

                    // 8. Drifting particles
                    gsap.utils.toArray<HTMLElement>(".nut-particle").forEach((p, i) => {
                        const drift = 30 + (i % 4) * 18;
                        gsap.to(p, {
                            y: `-=${drift}`,
                            x: `+=${(i % 2 === 0 ? -1 : 1) * (12 + (i % 3) * 6)}`,
                            opacity: 0.2 + ((i * 7) % 5) * 0.12,
                            duration: 6 + (i % 5),
                            ease: "sine.inOut",
                            yoyo: true,
                            repeat: -1,
                        });
                    });
                }

                // ── 9. Compound bar slide-up ─────────────────────────────────
                gsap.to(".nut-compound", {
                    opacity: 1, y: 0,
                    stagger: 0.06,
                    duration: 0.7,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".nut-compound-bar",
                        start: mobile ? "top 95%" : "top 90%",
                    },
                });

                // Re-measure once after fonts/images settle so triggers anchor correctly
                setTimeout(() => ScrollTrigger.refresh(), 200);
            });
        };

        mm.add("(max-width: 768px)", () => build(true));
        mm.add("(min-width: 769px)", () => build(false));

        return () => mm.revert();
    }, []);

    return (
        <section ref={sectionRef} className="nutrition-section relative">
            {/* Luxury white base + subtle warm overlays */}
            <div className="absolute inset-0 -z-10 bg-white" />
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_30%,rgba(220,38,38,0.05),transparent_50%)]" />
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_85%,rgba(17,17,17,0.04),transparent_55%)]" />

            {/* Ambient mist (slow-drifting blurred orbs) — desktop only, filter:blur is expensive */}
            <div className="absolute -top-24 -left-24 w-[36rem] h-[36rem] rounded-full pointer-events-none opacity-60 nut-particle hidden md:block" style={{ background: "radial-gradient(circle, rgba(255,235,210,0.6), transparent 65%)", filter: "blur(60px)" }} />
            <div className="absolute top-1/3 -right-24 w-[28rem] h-[28rem] rounded-full pointer-events-none opacity-50 nut-particle hidden md:block" style={{ background: "radial-gradient(circle, rgba(220,200,180,0.45), transparent 65%)", filter: "blur(80px)" }} />

            {/* Floating particles — fewer on mobile to reduce composited layers */}
            {Array.from({ length: typeof window !== 'undefined' && window.innerWidth <= 768 ? 6 : 18 }).map((_, i) => {
                const left = (i * 53) % 100;
                const top = 8 + ((i * 37) % 80);
                const size = 2 + ((i * 11) % 4);
                return (
                    <span
                        key={`particle-${i}`}
                        className="nut-particle absolute rounded-full pointer-events-none"
                        style={{
                            left: `${left}%`,
                            top: `${top}%`,
                            width: `${size}px`,
                            height: `${size}px`,
                            background: i % 3 === 0 ? "rgba(220,38,38,0.35)" : "rgba(17,17,17,0.18)",
                            opacity: 0.4,
                            boxShadow: "0 0 12px rgba(255,255,255,0.8)",
                        }}
                    />
                );
            })}

            <div className="relative z-10 max-w-[1400px] mx-auto px-5 md:px-10 lg:px-16 pt-20 md:pt-28 pb-10">
                {/* ── Headline + description + CTA ──────────────────────── */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 lg:gap-12">
                    <div className="lg:max-w-3xl">
                        <h1
                            className="text-5xl md:text-6xl lg:text-[4.8rem] uppercase text-charcoal !text-left leading-[0.95] tracking-tight"
                            style={{ fontFamily: "Syne, sans-serif", fontWeight: 800 }}
                        >
                            <span className="nut-headline-clip block overflow-hidden pb-1 md:pb-2">
                                <span className="nut-headline-line block">Powered By</span>
                            </span>
                            <span className="nut-headline-clip block overflow-hidden">
                                <span className="nut-headline-line block">Real Pheromone Science</span>
                            </span>
                        </h1>

                        {/* Red ribbon */}
                        <div className="mt-4 md:mt-6 inline-flex">
                            <div
                                className="nut-ribbon bg-sick-red text-white uppercase tracking-[0.2em] text-[0.65rem] md:text-xs font-bold px-5 md:px-7 py-2.5 md:py-3"
                                style={{
                                    fontFamily: "Syne, sans-serif",
                                    boxShadow:
                                        "0 14px 30px rgba(220,38,38,0.28), 0 2px 6px rgba(0,0,0,0.15)",
                                }}
                            >
                                Designed To Get You Noticed
                            </div>
                        </div>
                    </div>

                    <div className="lg:max-w-xs flex flex-col gap-5 lg:items-end lg:text-right">
                         <p
                             className="nut-para text-stone text-sm md:text-[0.95rem] leading-relaxed tracking-[0.02em]"
                             style={{ fontFamily: "Syne, sans-serif" }}
                         >
                             S1CK blends luxury fragrance with advanced pheromone compounds designed to enhance presence, confidence, and attraction.
                         </p>
                         <button
                             type="button"
                             className="nut-shop self-start lg:self-end hidden md:inline-flex items-center gap-2 border border-charcoal/20 text-charcoal bg-transparent uppercase tracking-[0.25em] text-[0.7rem] md:text-xs font-semibold px-7 md:px-8 py-3 md:py-3.5 rounded-full hover:bg-charcoal hover:text-white transition-colors duration-300"
                             style={{ fontFamily: "Syne, sans-serif" }}
                         >
                             Shop Now
                         </button>
                    </div>
                </div>

                {/* ── Feature row (4 columns) ───────────────────────────── */}
                <div className="nut-feature-row mt-10 md:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 md:gap-x-10">
                    {features.map((f) => (
                        <div key={f.title} className="nut-feature flex items-start gap-3">
                            <span className="shrink-0 inline-flex items-center justify-center text-sick-red pt-0.5">
                                <i className={`${f.icon} text-[1.35rem] md:text-[1.5rem]`} aria-hidden="true" />
                            </span>
                            <div>
                                <p
                                    className="text-charcoal text-[0.7rem] md:text-[0.78rem] uppercase tracking-[0.16em] mb-1"
                                    style={{ fontFamily: "Syne, sans-serif", fontWeight: 700 }}
                                >
                                    {f.title}
                                </p>
                                <p
                                    className="text-stone text-[0.7rem] md:text-[0.78rem] leading-snug"
                                    style={{ fontFamily: "Syne, sans-serif" }}
                                >
                                    {f.body}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Bottle or Mockup showcase ─────────────────────────── */}
                <div className={`nut-stage relative mt-10 md:mt-16 mb-10 md:mb-14 ${showMockup ? 'h-[320px] sm:h-[400px] md:h-[520px] lg:h-[640px]' : 'h-[280px] sm:h-[340px] md:h-[420px] lg:h-[460px]'} flex items-center justify-center`}>
                    {showMockup ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <img
                                src={getImage("mockup-img.webp")}
                                alt="S1CK Pheromones Mockup"
                                loading="lazy"
                                decoding="async"
                                draggable={false}
                                className="nut-mockup-img w-full h-full object-contain mix-blend-multiply"
                            />
                        </div>
                    ) : (
                        <>
                            {/* Floor reflection wash */}
                            <div
                                className="absolute bottom-[10%] left-[5%] right-[5%] h-12 md:h-16 pointer-events-none"
                                style={{
                                    background:
                                        "radial-gradient(ellipse at center, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 70%)",
                                    filter: "blur(6px)",
                                }}
                            />

                            {/* Bottle + splash row */}
                            <div className="absolute inset-0 flex items-end justify-between gap-1 md:gap-3 px-1 md:px-4">
                                {bottles.map((b, i) => (
                                    <div
                                        key={b.name}
                                        className="nut-bottle-frame relative flex-1 h-full flex items-end justify-center"
                                        style={{ zIndex: i % 2 === 0 ? 20 : 10 }}
                                    >
                                        {/* Splash behind bottle */}
                                        <div
                                            className="nut-splash absolute left-1/2 -translate-x-1/2 w-[180%] sm:w-[200%] md:w-[230%] pointer-events-none"
                                            style={{
                                                bottom: i % 2 === 0 ? "12%" : "8%",
                                                transform: `translateX(-50%) rotate(${(i * 23) % 25 - 12}deg)`,
                                            }}
                                        >
                                            <SplashSVG />
                                        </div>

                                        {/* Bottle */}
                                        <img
                                            src={getImage(b.file)}
                                            alt={b.name}
                                            loading="lazy"
                                            decoding="async"
                                            draggable={false}
                                            className="nut-bottle relative object-contain max-h-full"
                                            style={{
                                                height: `${82 + (i % 3) * 6}%`,
                                                filter:
                                                    "drop-shadow(0 22px 28px rgba(0,0,0,0.22)) drop-shadow(0 4px 8px rgba(0,0,0,0.12))",
                                            }}
                                        />

                                        {/* Subtle ground shadow under each bottle */}
                                        <div
                                            className="absolute bottom-[6%] left-1/2 -translate-x-1/2 pointer-events-none"
                                            style={{
                                                width: "60%",
                                                height: "10px",
                                                background:
                                                    "radial-gradient(ellipse, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0) 70%)",
                                                filter: "blur(3px)",
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* ── Compound bar ──────────────────────────────────────── */}
                <CompoundBar />
            </div>
        </section>
    );
};

const compoundItems: { icon: string; label: string }[] = [
    { icon: "ri-hourglass-2-line", label: "92% Raw Materials" },
    { icon: "ri-contrast-drop-2-line", label: "48mg Pheromone Blend" },
    ...nutrientLists.map((n) => ({ icon: "ri-flashlight-line", label: n.label })),
];

const CompoundBar = () => (
    <div className="nut-compound-bar relative mt-2 md:mt-6">
        <div
            className="bg-warm-white border border-ivory rounded-2xl md:rounded-full px-3 md:px-6 py-4 md:py-5 flex flex-wrap md:flex-nowrap items-center justify-center md:justify-between gap-x-4 gap-y-3"
            style={{ boxShadow: "0 8px 30px rgba(28,26,24,0.06)" }}
        >
            {compoundItems.map((c, i) => (
                <div key={c.label} className="flex items-center justify-center w-[45%] md:w-auto md:flex-1">
                    <div className="nut-compound flex items-center gap-2 md:gap-2.5 justify-center md:px-2">
                        <i
                            className={`${c.icon} text-sick-red text-base md:text-lg shrink-0`}
                            aria-hidden="true"
                        />
                        <p
                            className="text-charcoal text-[0.55rem] md:text-[0.62rem] uppercase tracking-[0.18em] text-center"
                            style={{ fontFamily: "Syne, sans-serif", fontWeight: 700 }}
                        >
                            {c.label}
                        </p>
                    </div>
                    {i < compoundItems.length - 1 && (
                        <span className="hidden md:block w-px h-6 bg-ivory" />
                    )}
                </div>
            ))}
        </div>
        <p
            className="text-center text-stone text-[0.65rem] md:text-[0.75rem] mt-3 md:mt-4 tracking-[0.04em]"
            style={{ fontFamily: "Syne, sans-serif" }}
        >
            Advanced pheromone compounds selected for presence, attraction, and confidence.
        </p>
    </div>
);

export default NutritionSection;
