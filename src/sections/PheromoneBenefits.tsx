import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaQuery } from "react-responsive";

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
        accent: "#c8ae82",
        accentGlow: "rgba(200,174,130,0.15)",
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
    },
];

const PheromoneBenefits = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const isMobPh = useMediaQuery({ query: "(max-width:768px)" });

    useGSAP(() => {
        const panels = gsap.utils.toArray<HTMLElement>(".pheromone-panel");
        if (panels.length === 0) return;

        // ── Scroll pacing ──
        // Each panel has a TRANSITION zone (slide in) and a DWELL zone (hold still).
        // transitionPart = fraction of each panel's time spent sliding in
        // dwellPart      = fraction spent holding still so the user can read
        const transitionPart = 0.35;

        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            // Reduced scroll distance on mobile for snappier feel
            end: () => `+=${panels.length * (isMobPh ? 150 : 250)}vh`,
            pin: true,
            scrub: isMobPh ? 1.5 : 2.5,
            onUpdate: (self) => {
                const progress = self.progress;
                const step = 1 / panels.length;
                const currentIdx = Math.min(Math.floor(progress / step), panels.length - 1);
                setActiveIndex(currentIdx);

                panels.forEach((panel, i) => {
                    const panelStart = i * step;
                    const rawInPanel = (progress - panelStart) / step; // 0 → 1 within this panel's zone
                    const clamped = Math.max(0, Math.min(1, rawInPanel));

                    // p goes 0→1 only during the transition zone, then stays at 1 during dwell
                    const transitionProgress = Math.min(1, clamped / transitionPart);
                    // Smoothstep for butter
                    const p = transitionProgress * transitionProgress * (3 - 2 * transitionProgress);

                    // Slide in from right — only moves during transition zone
                    gsap.set(panel, {
                        x: `${(1 - p) * 100}%`,
                        opacity: p > 0.01 ? 1 : 0,
                        zIndex: i + 1,
                    });

                    // Background number — gentle drift
                    const numEl = panel.querySelector<HTMLElement>(".bg-number");
                    if (numEl) gsap.set(numEl, { yPercent: (1 - p) * -12, xPercent: (1 - p) * 4 });

                    // Content — subtle rise
                    const content = panel.querySelector<HTMLElement>(".panel-inner");
                    if (content) gsap.set(content, { yPercent: (1 - p) * 8, opacity: Math.min(1, p * 2) });

                    // Stat — scale in softly
                    const stat = panel.querySelector<HTMLElement>(".stat-value");
                    if (stat) gsap.set(stat, { scale: 0.8 + p * 0.2, opacity: Math.min(1, p * 1.8) });

                    // Accent line — grows during first portion
                    const line = panel.querySelector<HTMLElement>(".accent-line");
                    if (line) gsap.set(line, { scaleX: Math.min(1, p * 1.5) });

                    // Glow — fades in gently
                    const glow = panel.querySelector<HTMLElement>(".accent-glow");
                    if (glow) gsap.set(glow, { opacity: p * 0.4, scale: 0.9 + p * 0.2 });
                });
            },
        });
    });

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
            <div className="absolute top-0 left-0 w-full z-[100] flex items-center justify-between px-8 md:px-14 pt-8">
                <div className="flex items-center gap-4">
                    <span
                        className="block w-8 h-px"
                        style={{ background: benefits[activeIndex]?.accent }}
                    />
                    <p
                        className="text-[0.55rem] uppercase tracking-[0.35em] transition-colors duration-500"
                        style={{
                            color: "rgba(247,245,242,0.35)",
                            fontFamily: '"Syne", sans-serif',
                            fontWeight: 600,
                        }}
                    >
                        The Science of S1CK
                    </p>
                </div>
                <p
                    className="text-[0.55rem] uppercase tracking-[0.25em] hidden md:block"
                    style={{
                        color: "rgba(247,245,242,0.2)",
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
                    className="h-full transition-all duration-500 ease-out"
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
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 md:hidden">
                {benefits.map((b, i) => (
                    <div
                        key={i}
                        className="transition-all duration-500"
                        style={{
                            width: i === activeIndex ? "1.5rem" : "0.4rem",
                            height: "3px",
                            borderRadius: "2px",
                            background: i === activeIndex ? b.accent : "rgba(255,255,255,0.15)",
                        }}
                    />
                ))}
            </div>

            {/* Panel stack */}
            <div className="pheromone-benefits-container relative w-full h-full">
                {benefits.map((b, i) => (
                    <div
                        key={i}
                        className="pheromone-panel absolute inset-0 flex items-center overflow-hidden"
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
                                width: "40vw",
                                height: "40vw",
                                borderRadius: "50%",
                                background: `radial-gradient(circle, ${b.accentGlow}, transparent 70%)`,
                                top: "20%",
                                left: "-10%",
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
                                fontSize: "clamp(10rem, 30vw, 24rem)",
                                fontFamily: '"Syne", sans-serif',
                                fontWeight: 800,
                                color: "rgba(255,255,255,0.025)",
                                lineHeight: 0.85,
                                letterSpacing: "-0.05em",
                            }}
                        >
                            {b.number}
                        </div>

                        {/* Content */}
                        <div
                            className="panel-inner relative z-10 w-full px-8 md:px-14 lg:px-[8vw]"
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
                                        color: "rgba(247,245,242,0.3)",
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
                                    color: "#f7f5f2",
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
                                className="mb-10 md:mb-12"
                                style={{
                                    fontFamily: '"Inter", sans-serif',
                                    fontSize: "clamp(0.8rem, 1.1vw, 0.95rem)",
                                    color: "rgba(247,245,242,0.45)",
                                    lineHeight: 2,
                                    maxWidth: "440px",
                                    fontWeight: 300,
                                    letterSpacing: "0.02em",
                                }}
                            >
                                {b.description}
                            </p>

                            {/* Stat */}
                            <div className="flex items-end gap-5">
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
                                            color: "rgba(247,245,242,0.3)",
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
                            {/* Molecular dots */}
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
                ))}
            </div>
        </section>
    );
};

export default PheromoneBenefits;
