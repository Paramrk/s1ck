import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaQuery } from "react-responsive";
import { useRef } from "react";
import { flavorlists } from "../constants/details";
import FlavorTitle from "../components/FlavorTitle";
import FlavorSlider from "../components/FlavorSlider";

gsap.registerPlugin(ScrollTrigger);

const FlavorSection = () => {
    const sectionRef = useRef<HTMLElement | null>(null);

    const isMob = useMediaQuery({ query: "(max-width: 768px)" });

    useGSAP(() => {
        if (!sectionRef.current) return;

        const productCount = flavorlists.length;
        const scrollLength = isMob ? productCount * 400 : productCount * 850;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".flavor-section",
                start: "top top",
                end: `+=${scrollLength}`,
                // Higher scrub on mobile = more lerp smoothing = fewer visual hitches
                scrub: isMob ? 1.8 : 1.2,
                pin: true,
                anticipatePin: 1,
            },
        });

        // Background hue shift
        tl.to(".flavor-bg-tint", {
            backgroundPosition: "100% 50%",
            ease: "none",
        }, 0);

        // Floating detail selectors for each product
        const floatSelectors = (idx: number) => [
            `.float-tone-${idx}`,
            `.float-tagline-${idx}`,
            `.float-top-notes-${idx}`,
            `.float-heart-notes-${idx}`,
            `.float-base-notes-${idx}`,
            `.float-profile-${idx}`,
        ];

        // Connector lines inside each fp panel
        const connectorSel = (idx: number) => `.fp-${idx} .connector-lines`;

        flavorlists.forEach((flavor, i) => {
            if (i === 0) return;

            const prev = `.fp-${i - 1}`;
            const curr = `.fp-${i}`;
            const currBottle = `.fp-${i} .product-bottle`;
            const currCaption = `.fp-${i} .product-caption`;
            const currGlow = `.fp-${i} .carousel-glow`;

            // Mobile
            const prevDetailMobile = `.detail-mobile-${i - 1}`;
            const currDetailMobile = `.detail-mobile-${i}`;

            // Dots
            const prevDot = `.carousel-dot-${i - 1}`;
            const currDot = `.carousel-dot-${i}`;

            // Previous floating details
            const prevFloats = floatSelectors(i - 1);
            const currFloats = floatSelectors(i);
            const prevConnectors = connectorSel(i - 1);
            const currConnectors = connectorSel(i);

            tl.addLabel(`step-${i}`)

                // ═══ EXIT previous product ═══
                // Mobile: no blur/rotateY/scale (GPU-killer during scrub)
                .to(prev, isMob ? {
                    opacity: 0,
                    xPercent: -15,
                    duration: 0.5,
                    ease: "power2.inOut",
                } : {
                    opacity: 0,
                    scale: 0.7,
                    rotateY: -40,
                    yPercent: -12,
                    filter: "blur(14px)",
                    duration: 0.6,
                    ease: "power2.inOut",
                }, `step-${i}`)

                // Float OUT — each detail drifts away from center with fade
                .to(prevFloats[0], { // tone: top-left → drifts up-left
                    opacity: 0, x: -50, y: -30,
                    duration: 0.35, ease: "power2.in",
                }, `step-${i}`)
                .to(prevFloats[1], { // tagline: top-right → drifts up-right
                    opacity: 0, x: 50, y: -30,
                    duration: 0.35, ease: "power2.in",
                }, `step-${i}`)
                .to(prevFloats[2], { // top notes: mid-left → drifts left
                    opacity: 0, x: -60,
                    duration: 0.3, ease: "power2.in",
                }, `step-${i}+=0.02`)
                .to(prevFloats[3], { // heart notes: mid-right → drifts right
                    opacity: 0, x: 60,
                    duration: 0.3, ease: "power2.in",
                }, `step-${i}+=0.02`)
                .to(prevFloats[4], { // base notes: bottom-left → drifts down-left
                    opacity: 0, x: -50, y: 30,
                    duration: 0.35, ease: "power2.in",
                }, `step-${i}+=0.03`)
                .to(prevFloats[5], { // profile: bottom-right → drifts down-right
                    opacity: 0, x: 50, y: 30,
                    duration: 0.35, ease: "power2.in",
                }, `step-${i}+=0.03`)

                // Connector lines fade out
                .to(prevConnectors, {
                    opacity: 0, duration: 0.25, ease: "power2.in",
                }, `step-${i}`)

                // Mobile detail out
                .to(prevDetailMobile, {
                    opacity: 0, y: 25, duration: 0.25, ease: "power2.in",
                }, `step-${i}`)

                // Dot shrink
                .to(prevDot, {
                    height: 6,
                    backgroundColor: "rgba(17,17,17,0.15)",
                    duration: 0.3,
                }, `step-${i}`)

                // ═══ ENTER current product ═══
                // Mobile: simple fade+slide (no blur/rotateY/scale)
                .fromTo(curr, isMob ? {
                    opacity: 0,
                    xPercent: 15,
                } : {
                    opacity: 0,
                    scale: 1.25,
                    rotateY: 40,
                    yPercent: 10,
                    filter: "blur(16px)",
                }, isMob ? {
                    opacity: 1,
                    xPercent: 0,
                    duration: 0.55,
                    ease: "power2.out",
                } : {
                    opacity: 1,
                    scale: 1,
                    rotateY: 0,
                    yPercent: 0,
                    filter: "blur(0px)",
                    duration: 0.65,
                    ease: "power2.out",
                }, `step-${i}`)

                // Bottle entrance — simpler on mobile
                .fromTo(currBottle, isMob ? {
                    yPercent: 12,
                    scale: 1.05,
                } : {
                    yPercent: 18,
                    rotate: -6,
                    scale: 1.12,
                }, isMob ? {
                    yPercent: 0,
                    scale: 1,
                    duration: 0.55,
                    ease: "power2.out",
                } : {
                    yPercent: 0,
                    rotate: 0,
                    scale: 1,
                    duration: 0.75,
                    ease: "power3.out",
                }, `step-${i}`)

                // Glow bloom
                .fromTo(currGlow, {
                    scale: 0.4, opacity: 0,
                }, {
                    scale: 1, opacity: 1,
                    duration: isMob ? 0.6 : 0.85,
                    ease: "power2.out",
                }, `step-${i}`)

                // Caption rise
                .fromTo(currCaption, {
                    opacity: 0, yPercent: 45,
                }, {
                    opacity: 1, yPercent: 0,
                    duration: 0.45,
                    ease: "power2.out",
                }, `step-${i}+=0.2`)

                // ═══ Float IN — details drift toward their positions from center ═══
                .fromTo(currFloats[0], { // tone: from center → top-left
                    opacity: 0, x: 50, y: 40,
                }, {
                    opacity: 1, x: 0, y: 0,
                    duration: 0.45, ease: "power3.out",
                }, `step-${i}+=0.15`)
                .fromTo(currFloats[1], { // tagline: from center → top-right
                    opacity: 0, x: -50, y: 40,
                }, {
                    opacity: 1, x: 0, y: 0,
                    duration: 0.45, ease: "power3.out",
                }, `step-${i}+=0.18`)
                .fromTo(currFloats[2], { // top notes: from center → mid-left
                    opacity: 0, x: 60, y: 15,
                }, {
                    opacity: 1, x: 0, y: 0,
                    duration: 0.4, ease: "power3.out",
                }, `step-${i}+=0.22`)
                .fromTo(currFloats[3], { // heart notes: from center → mid-right
                    opacity: 0, x: -60, y: 15,
                }, {
                    opacity: 1, x: 0, y: 0,
                    duration: 0.4, ease: "power3.out",
                }, `step-${i}+=0.22`)
                .fromTo(currFloats[4], { // base notes: from center → bottom-left
                    opacity: 0, x: 50, y: -35,
                }, {
                    opacity: 1, x: 0, y: 0,
                    duration: 0.45, ease: "power3.out",
                }, `step-${i}+=0.26`)
                .fromTo(currFloats[5], { // profile: from center → bottom-right
                    opacity: 0, x: -50, y: -35,
                }, {
                    opacity: 1, x: 0, y: 0,
                    duration: 0.45, ease: "power3.out",
                }, `step-${i}+=0.28`)

                // Connector lines fade in
                .fromTo(currConnectors, {
                    opacity: 0,
                }, {
                    opacity: 1,
                    duration: 0.6,
                    ease: "power2.out",
                }, `step-${i}+=0.3`)

                // Mobile detail entrance
                .fromTo(currDetailMobile, {
                    opacity: 0, y: 30,
                }, {
                    opacity: 1, y: 0,
                    duration: 0.4,
                    ease: "power2.out",
                }, `step-${i}+=0.25`)

                // Profile bars fill
                .to(`.profile-bar-${i}`, {
                    width: "auto",
                    duration: 0.01,
                    onComplete: () => {
                        document.querySelectorAll(`.profile-bar-${i}`).forEach((el) => {
                            const parent = el.closest('[class*="float-profile"]');
                            if (parent) {
                                const bars = parent.querySelectorAll(`[class*="profile-bar"]`);
                                const widths = [85, 92, 78];
                                bars.forEach((bar, bi) => {
                                    (bar as HTMLElement).style.width = `${widths[bi]}%`;
                                });
                            }
                        });
                    },
                }, `step-${i}+=0.35`)

                // Dot expand
                .to(currDot, {
                    height: 24,
                    backgroundColor: flavor.accentColor,
                    duration: 0.3,
                }, `step-${i}+=0.1`);
        });

        const refreshHandle = setTimeout(() => ScrollTrigger.refresh(), 250);
        return () => clearTimeout(refreshHandle);
    }, [isMob]);

    return (
        <section ref={sectionRef} className="flavor-section relative bg-white overflow-hidden">

            {/* Luxury white background with subtle warm hue shift */}
            <div
                className="flavor-bg-tint pointer-events-none absolute inset-0 z-0"
                style={{
                    background:
                        "linear-gradient(120deg, #ffffff 0%, #faf7f2 35%, #ffffff 65%, #fbf2ee 100%)",
                    backgroundSize: "220% 100%",
                    backgroundPosition: "0% 50%",
                }}
            />
            <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_75%_38%,rgba(220,38,38,0.06),transparent_55%)]" />
            <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_25%_85%,rgba(17,17,17,0.05),transparent_60%)]" />

            {/* AS SEEN ON top bar */}
            <div className="as-seen-on absolute top-0 left-0 right-0 z-30 border-b border-ivory bg-white/75 backdrop-blur-sm">
                <div
                    className="flex items-center justify-center gap-5 md:gap-12 py-3 md:py-4 text-charcoal text-[0.55rem] md:text-[0.7rem] uppercase tracking-[0.25em]"
                    style={{ fontFamily: "Syne, sans-serif" }}
                >
                    <span className="text-stone hidden sm:inline">As Seen On</span>
                    <span className="font-bold tracking-[0.18em]">FOX</span>
                    <span className="w-px h-3 bg-ivory" />
                    <span className="font-bold tracking-[0.18em]">USA TODAY</span>
                    <span className="w-px h-3 bg-ivory" />
                    <span className="font-bold tracking-[0.18em]">MarketWatch</span>
                </div>
            </div>

            {/* Unlock 10% off vertical sidebar */}
            <div
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-30 items-center justify-center bg-sick-red text-white px-2 py-6 tracking-[0.3em] uppercase text-[0.6rem]"
                style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 600,
                    writingMode: "vertical-rl",
                    transform: "translateY(-50%) rotate(180deg)",
                }}
            >
                Unlock 10% Off
            </div>

            {/* Main editorial layout — mobile: title on top + carousel below | desktop: side by side */}
            <div className="relative z-10 h-screen w-full flex flex-col lg:flex-row pt-10 md:pt-16 lg:pt-20 pb-14 md:pb-24">
                <div className="lg:w-[35%] w-full flex items-center justify-center lg:justify-start px-4 md:px-12 lg:pl-14 xl:pl-20 2xl:pl-28 py-2 lg:py-0 lg:h-full shrink-0">
                    <FlavorTitle />
                </div>
                <div className="lg:w-[65%] w-full flex-1 lg:h-full relative min-h-0">
                    <FlavorSlider />
                </div>
            </div>

            {/* CTA */}
            <div className="absolute md:bottom-[6%] bottom-[2%] left-1/2 -translate-x-1/2 z-40 flex justify-center">
                <button
                    type="button"
                    className="text-[0.7rem] md:text-sm rounded-full bg-charcoal text-cream px-8 md:px-10 md:py-4 py-3 cursor-pointer shadow-[0_12px_32px_rgba(0,0,0,0.18)] hover:bg-sick-red transition-all tracking-[0.25em] uppercase"
                    style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}
                >
                    Shop Best Sellers
                </button>
            </div>
        </section>
    );
};

export default FlavorSection;
