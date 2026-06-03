import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getImage } from "../utils/media";

gsap.registerPlugin(ScrollTrigger);

const benefits = [
    {
        number: "01",
        title: "Magnetic\nAttraction",
        subtitle: "Androstenol",
        description:
            "Signals warmth, approachability, and freshness. Shown to increase perceived attractiveness and trigger positive first impressions within seconds.",
        stat: "+68%",
        statLabel: "Reported attraction increase",
        accent: "#DC2626",
        accentGlow: "rgba(220,38,38,0.15)",
        image: "ma-mockup.webp",
    },
    {
        number: "02",
        title: "Dominance\n& Presence",
        subtitle: "Androstenone",
        description:
            "Commands attention in any room. Elevates perceived confidence and social dominance — without saying a single word.",
        stat: "3×",
        statLabel: "More memorable interactions",
        accent: "#5a7a94",
        accentGlow: "rgba(90,122,148,0.15)",
        image: "dp-mockup.webp",
    },
    {
        number: "03",
        title: "Emotional\nConnection",
        subtitle: "Estratetraenol",
        description:
            "Promotes deep emotional bonding and empathy. People feel a genuine connection — the kind that keeps them coming back.",
        stat: "82%",
        statLabel: "Users report stronger bonds",
        accent: "#a08060",
        accentGlow: "rgba(160,128,96,0.15)",
        image: "ec-mockup.webp",
    },
    {
        number: "04",
        title: "Lasting\nChemistry",
        subtitle: "Androstadienone",
        description:
            "Sustains mood elevation and romantic tension for hours. One spray in the morning, felt all evening.",
        stat: "8hrs",
        statLabel: "Average effect duration",
        accent: "#8a6e5a",
        accentGlow: "rgba(138,110,90,0.15)",
        image: "lc-mockup.webp",
    },
];

const PheromoneBenefits = ({ showMockup = false }: { showMockup?: boolean }) => {
    const sectionRef = useRef<HTMLElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useGSAP(() => {
        const mm = gsap.matchMedia();

        const buildPanels = (mobile: boolean) => {
            const panels = gsap.utils.toArray<HTMLElement>(".pheromone-panel");
            if (panels.length === 0) return;

            const transitionPart = mobile ? 0.3 : 0.35;

            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                // More scroll distance on mobile = slower, smoother transitions
                end: () => `+=${panels.length * (mobile ? 200 : 250)}vh`,
                pin: true,
                anticipatePin: 1,
                // Higher scrub = more interpolation = smoother feel
                scrub: mobile ? 2.5 : 2.5,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const step = 1 / panels.length;
                    const currentIdx = Math.min(Math.floor(progress / step), panels.length - 1);
                    setActiveIndex(currentIdx);

                    panels.forEach((panel, i) => {
                        if (mobile && Math.abs(i - currentIdx) > 1) {
                            if (panel.style.opacity !== '0') {
                                gsap.set(panel, { opacity: 0, x: '100%', zIndex: 0 });
                            }
                            return;
                        }

                        const panelStart = i * step;
                        const rawInPanel = (progress - panelStart) / step;
                        const clamped = Math.max(0, Math.min(1, rawInPanel));

                        const transitionProgress = Math.min(1, clamped / transitionPart);
                        // Smoother easing curve
                        const p = transitionProgress * transitionProgress * (3 - 2 * transitionProgress);

                        gsap.set(panel, {
                            x: `${(1 - p) * 100}%`,
                            opacity: p > 0.01 ? 1 : 0,
                            zIndex: i + 1,
                            force3D: true,
                        });

                        const numEl = panel.querySelector<HTMLElement>(".bg-number");
                        if (numEl) gsap.set(numEl, { yPercent: (1 - p) * -12, xPercent: (1 - p) * 4 });

                        const content = panel.querySelector<HTMLElement>(".panel-inner");
                        if (content) gsap.set(content, { yPercent: (1 - p) * 8, opacity: Math.min(1, p * 2) });

                        const stat = panel.querySelector<HTMLElement>(".stat-value");
                        if (stat) gsap.set(stat, { scale: 0.8 + p * 0.2, opacity: Math.min(1, p * 1.8) });

                        const line = panel.querySelector<HTMLElement>(".accent-line");
                        if (line) gsap.set(line, { scaleX: Math.min(1, p * 1.5) });

                        const glow = panel.querySelector<HTMLElement>(".accent-glow");
                        if (glow) gsap.set(glow, { opacity: p * 0.4, scale: 0.9 + p * 0.2 });
                    });
                },
            });
        };

        mm.add("(max-width: 768px)", () => buildPanels(true));
        mm.add("(min-width: 769px)", () => buildPanels(false));

        return () => mm.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="pheromone-benefits-section"
            style={{ height: "100dvh", overflow: "hidden", position: "relative" }}
        >
            {/* Subtle grid background */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "#0a0908",
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Top label */}
            <div className="absolute top-0 left-0 w-full z-[100] flex items-center justify-between px-5 md:px-14 pt-6 md:pt-8">
                <div className="flex items-center gap-3 md:gap-4">
                    <span
                        className="block w-6 md:w-8 h-px transition-colors duration-500"
                        style={{ background: benefits[activeIndex]?.accent }}
                    />
                    <p
                        className="text-[0.5rem] md:text-[0.55rem] uppercase tracking-[0.3em] md:tracking-[0.35em] transition-colors duration-500"
                        style={{
                            color: "rgba(247,245,242,0.65)",
                            fontFamily: '"Syne", sans-serif',
                            fontWeight: 600,
                        }}
                    >
                        The Science of S1CK
                    </p>
                </div>
                {/* Counter — visible on both mobile and desktop */}
                <p
                    className="text-[0.5rem] md:text-[0.55rem] uppercase tracking-[0.25em]"
                    style={{
                        color: "rgba(247,245,242,0.55)",
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 300,
                    }}
                >
                    {String(activeIndex + 1).padStart(2, "0")} / {String(benefits.length).padStart(2, "0")}
                </p>
            </div>

            {/* Progress bar — bottom */}
            <div className="absolute bottom-0 left-0 w-full h-px z-[100] bg-white/5">
                <div
                    className="h-full transition-all duration-700 ease-out"
                    style={{
                        width: `${((activeIndex + 1) / benefits.length) * 100}%`,
                        background: benefits[activeIndex]?.accent,
                    }}
                />
            </div>

            {/* Side progress dots — desktop */}
            <div
                className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 z-[100] flex-col gap-3 hidden md:flex"
            >
                {benefits.map((b, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 transition-all duration-500"
                    >
                        {i === activeIndex && (
                            <span
                                className="text-[0.5rem] uppercase tracking-[0.15em] transition-opacity duration-300"
                                style={{
                                    color: b.accent,
                                    fontFamily: '"Inter", sans-serif',
                                    fontWeight: 300,
                                    opacity: 0.7,
                                }}
                            >
                                {b.subtitle}
                            </span>
                        )}
                        <div
                            className="transition-all duration-500"
                            style={{
                                width: "2px",
                                height: i === activeIndex ? "2rem" : "0.4rem",
                                background: i === activeIndex ? b.accent : "rgba(255,255,255,0.15)",
                                borderRadius: "1px",
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Mobile progress dots — bottom horizontal */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 md:hidden">
                {benefits.map((b, i) => (
                    <div
                        key={i}
                        className="transition-all duration-500"
                        style={{
                            width: i === activeIndex ? "1.5rem" : "0.4rem",
                            height: "3px",
                            borderRadius: "2px",
                            background: i === activeIndex ? b.accent : "rgba(255,255,255,0.2)",
                        }}
                    />
                ))}
            </div>

            {/* Panel stack */}
            <div className="pheromone-benefits-container relative w-full h-full">
                {benefits.map((b, i) => (
                    <div
                        key={i}
                        className="pheromone-panel absolute inset-0 overflow-hidden"
                        style={{
                            background: "#0a0908",
                            opacity: i === 0 ? 1 : 0,
                            transform: i === 0 ? "translateX(0%)" : "translateX(100%)",
                        }}
                    >
                        {/* Accent glow orb */}
                        <div
                            className="accent-glow absolute pointer-events-none"
                            style={{
                                borderRadius: "50%",
                                background: `radial-gradient(circle, ${b.accentGlow}, transparent 70%)`,
                                width: "50vw",
                                height: "50vw",
                                left: "-15%",
                                top: "25%",
                                opacity: 0,
                            }}
                        />

                        {/* Accent left bar */}
                        <div
                            className="absolute left-0 top-0 bottom-0 w-[3px]"
                            style={{ background: b.accent }}
                        />

                        {/* Giant background number */}
                        <div
                            className="bg-number absolute select-none pointer-events-none"
                            style={{
                                bottom: "-10%",
                                right: "-4%",
                                fontSize: "clamp(8rem, 25vw, 24rem)",
                                fontFamily: '"Syne", sans-serif',
                                fontWeight: 800,
                                color: "rgba(255,255,255,0.025)",
                                lineHeight: 0.85,
                                letterSpacing: "-0.05em",
                            }}
                        >
                            {b.number}
                        </div>

                        {/* ── MOBILE LAYOUT: Image on top, content below ── */}
                        <div className="md:hidden flex flex-col h-full w-full">
                            {/* Top half: Mockup image */}
                            {showMockup && b.image && (
                                <div
                                    className="relative w-full h-[40%] shrink-0"
                                    style={{
                                        maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
                                        WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
                                    }}
                                >
                                    <img
                                        src={getImage(b.image)}
                                        alt={b.title.replace('\n', ' ')}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover object-center opacity-80"
                                    />
                                </div>
                            )}

                            {/* Bottom: Content */}
                            <div
                                className="panel-inner relative z-10 flex-1 flex flex-col justify-center px-6 pb-16"
                                style={{ marginTop: showMockup ? "-2rem" : "0" }}
                            >
                                {/* Number + compound */}
                                <div className="flex items-center gap-3 mb-5">
                                    <span
                                        className="text-[0.55rem] tracking-[0.2em] uppercase"
                                        style={{ fontFamily: '"Syne", sans-serif', color: b.accent, fontWeight: 600 }}
                                    >
                                        {b.number}
                                    </span>
                                    <span
                                        className="accent-line block h-px origin-left flex-1"
                                        style={{ maxWidth: "80px", background: `${b.accent}40` }}
                                    />
                                    <span
                                        className="text-[0.5rem] tracking-[0.2em] uppercase"
                                        style={{
                                            fontFamily: '"Syne", sans-serif',
                                            color: "rgba(247,245,242,0.6)",
                                            fontWeight: 400,
                                        }}
                                    >
                                        {b.subtitle}
                                    </span>
                                </div>

                                {/* Accent line */}
                                <div
                                    className="accent-line w-10 h-[2px] mb-5 origin-left"
                                    style={{ background: b.accent }}
                                />

                                {/* Title */}
                                <h2
                                    className="mb-4"
                                    style={{
                                        fontFamily: '"Syne", sans-serif',
                                        fontSize: "clamp(1.8rem, 8vw, 2.5rem)",
                                        fontWeight: 800,
                                        color: "#ffffff",
                                        lineHeight: 1.05,
                                        letterSpacing: "-0.03em",
                                        textTransform: "uppercase",
                                        whiteSpace: "pre-line",
                                    }}
                                >
                                    {b.title}
                                </h2>

                                {/* Description */}
                                <p
                                    className="mb-8"
                                    style={{
                                        fontFamily: '"Inter", sans-serif',
                                        fontSize: "0.8rem",
                                        color: "rgba(247,245,242,0.7)",
                                        lineHeight: 1.8,
                                        maxWidth: "340px",
                                        fontWeight: 300,
                                        letterSpacing: "0.02em",
                                    }}
                                >
                                    {b.description}
                                </p>

                                {/* Stat */}
                                <div className="flex items-end gap-4">
                                    <span
                                        className="stat-value"
                                        style={{
                                            fontFamily: '"Syne", sans-serif',
                                            fontSize: "clamp(2.5rem, 12vw, 3.5rem)",
                                            fontWeight: 800,
                                            color: b.accent,
                                            lineHeight: 1,
                                            letterSpacing: "-0.04em",
                                        }}
                                    >
                                        {b.stat}
                                    </span>
                                    <div className="pb-1.5">
                                        <span
                                            className="block w-5 h-px mb-1.5"
                                            style={{ background: `${b.accent}50` }}
                                        />
                                        <span
                                            style={{
                                                fontFamily: '"Syne", sans-serif',
                                                fontSize: "0.5rem",
                                                color: "rgba(247,245,242,0.55)",
                                                letterSpacing: "0.15em",
                                                textTransform: "uppercase",
                                                fontWeight: 400,
                                            }}
                                        >
                                            {b.statLabel}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── DESKTOP LAYOUT: Side-by-side ── */}
                        <div className="hidden md:flex items-center w-full h-full">
                            {/* Right Side Mockup Image */}
                            {showMockup && b.image && (
                                <div
                                    className="absolute right-0 top-0 bottom-0 w-[70%] lg:w-[60%] pointer-events-none z-0"
                                    style={{
                                        maskImage: "linear-gradient(to right, transparent 0%, black 30%)",
                                        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 30%)",
                                    }}
                                >
                                    <img
                                        src={getImage(b.image)}
                                        alt={b.title.replace('\n', ' ')}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover object-[70%_center] opacity-90"
                                    />
                                </div>
                            )}

                            {/* Content */}
                            <div
                                className="panel-inner relative z-10 w-full px-14 lg:px-[8vw]"
                                style={{ maxWidth: "900px" }}
                            >
                                {/* Number + compound row */}
                                <div className="flex items-center gap-5 mb-8">
                                    <span
                                        className="text-[0.6rem] tracking-[0.2em] uppercase"
                                        style={{ fontFamily: '"Syne", sans-serif', color: b.accent, fontWeight: 600 }}
                                    >
                                        {b.number}
                                    </span>
                                    <span
                                        className="accent-line block h-px origin-left"
                                        style={{ flex: 1, maxWidth: "120px", background: `${b.accent}40` }}
                                    />
                                    <span
                                        className="text-[0.55rem] tracking-[0.25em] uppercase"
                                        style={{
                                            fontFamily: '"Syne", sans-serif',
                                            color: "rgba(247,245,242,0.6)",
                                            fontWeight: 400,
                                        }}
                                    >
                                        {b.subtitle}
                                    </span>
                                </div>

                                {/* Accent line */}
                                <div
                                    className="accent-line w-12 h-[2px] mb-8 origin-left"
                                    style={{ background: b.accent }}
                                />

                                {/* Title */}
                                <h2
                                    className="mb-6"
                                    style={{
                                        fontFamily: '"Syne", sans-serif',
                                        fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)",
                                        fontWeight: 800,
                                        color: "#ffffff",
                                        lineHeight: 1.05,
                                        letterSpacing: "-0.03em",
                                        textTransform: "uppercase",
                                        whiteSpace: "pre-line",
                                    }}
                                >
                                    {b.title}
                                </h2>

                                {/* Description */}
                                <p
                                    className="mb-12"
                                    style={{
                                        fontFamily: '"Inter", sans-serif',
                                        fontSize: "clamp(0.8rem, 1.1vw, 0.95rem)",
                                        color: "rgba(247,245,242,0.78)",
                                        lineHeight: 2,
                                        maxWidth: "440px",
                                        fontWeight: 300,
                                        letterSpacing: "0.02em",
                                    }}
                                >
                                    {b.description}
                                </p>

                                {/* Stat */}
                                <div className="flex items-end gap-5 flex-wrap">
                                    <span
                                        className="stat-value"
                                        style={{
                                            fontFamily: '"Syne", sans-serif',
                                            fontSize: "clamp(3rem, 7vw, 5rem)",
                                            fontWeight: 800,
                                            color: b.accent,
                                            lineHeight: 1,
                                            letterSpacing: "-0.04em",
                                        }}
                                    >
                                        {b.stat}
                                    </span>
                                    <div className="pb-2">
                                        <span
                                            className="block w-6 h-px mb-2"
                                            style={{ background: `${b.accent}50` }}
                                        />
                                        <span
                                            style={{
                                                fontFamily: '"Syne", sans-serif',
                                                fontSize: "0.55rem",
                                                color: "rgba(247,245,242,0.6)",
                                                letterSpacing: "0.18em",
                                                textTransform: "uppercase",
                                                fontWeight: 400,
                                            }}
                                        >
                                            {b.statLabel}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right side — compound formula visual */}
                            <div
                                className="absolute right-[12vw] top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3 pointer-events-none"
                                style={{ opacity: 0.06 }}
                            >
                                <div className="relative w-32 h-32">
                                    <div
                                        className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
                                        style={{ background: b.accent }}
                                    />
                                    <div
                                        className="absolute bottom-4 left-2 w-2 h-2 rounded-full"
                                        style={{ background: b.accent }}
                                    />
                                    <div
                                        className="absolute bottom-4 right-2 w-2 h-2 rounded-full"
                                        style={{ background: b.accent }}
                                    />
                                    <div
                                        className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-20"
                                        style={{ background: b.accent }}
                                    />
                                    <div
                                        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-px"
                                        style={{ background: b.accent }}
                                    />
                                </div>
                                <span
                                    className="text-[0.5rem] uppercase tracking-[0.3em]"
                                    style={{ color: b.accent, fontFamily: '"Inter", sans-serif' }}
                                >
                                    {b.subtitle}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PheromoneBenefits;
