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
        const scrollLength = isMob ? productCount * 420 : productCount * 700;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".flavor-section",
                start: "top top",
                end: `+=${scrollLength}`,
                scrub: 1,
                pin: true,
            },
        });

        // Subtle background hue shift driven by scroll position
        tl.to(".flavor-bg-tint", {
            backgroundPosition: "100% 50%",
            ease: "none",
        }, 0);

        flavorlists.forEach((_, i) => {
            if (i === 0) return;

            const prev = `.fp-${i - 1}`;
            const curr = `.fp-${i}`;
            const currBottle = `.fp-${i} .product-bottle`;
            const currCaption = `.fp-${i} .product-caption`;

            tl.addLabel(`step-${i}`)
                .to(prev, {
                    opacity: 0,
                    scale: 0.78,
                    rotateY: -30,
                    yPercent: -8,
                    filter: "blur(8px)",
                    duration: 0.55,
                    ease: "power2.inOut",
                }, `step-${i}`)
                .fromTo(curr, {
                    opacity: 0,
                    scale: 1.18,
                    rotateY: 32,
                    yPercent: 6,
                    filter: "blur(10px)",
                }, {
                    opacity: 1,
                    scale: 1,
                    rotateY: 0,
                    yPercent: 0,
                    filter: "blur(0px)",
                    duration: 0.6,
                    ease: "power2.out",
                }, `step-${i}`)
                .fromTo(currBottle, {
                    yPercent: 12,
                    rotate: -4,
                }, {
                    yPercent: 0,
                    rotate: 0,
                    duration: 0.7,
                    ease: "power3.out",
                }, `step-${i}`)
                .fromTo(currCaption, {
                    opacity: 0,
                    yPercent: 30,
                }, {
                    opacity: 1,
                    yPercent: 0,
                    duration: 0.4,
                    ease: "power2.out",
                }, `step-${i}+=0.2`);
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

            {/* Main editorial layout — left: title, right: cinematic product */}
            <div className="relative z-10 h-screen w-full flex flex-col lg:flex-row pt-14 md:pt-16 lg:pt-20 pb-20 md:pb-24">
                <div className="lg:w-1/2 w-full lg:h-full flex items-center justify-start px-6 md:px-12 lg:pl-14 xl:pl-20 2xl:pl-28">
                    <FlavorTitle />
                </div>
                <div className="lg:w-1/2 w-full flex-1 lg:h-full relative">
                    <FlavorSlider />
                </div>
            </div>

            {/* CTA */}
            <div className="absolute md:bottom-[6%] bottom-[4%] left-1/2 -translate-x-1/2 z-40 flex justify-center">
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
