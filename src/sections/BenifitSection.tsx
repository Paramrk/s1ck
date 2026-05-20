import { useGSAP } from "@gsap/react"
import gsap from "gsap";
import { SplitText } from "gsap/all";
import VideoPin from "../components/VideoPin";

const BenifitSection = () => {

    useGSAP(() => {
        const mm = gsap.matchMedia();

        const buildBenefit = (mobile: boolean) => {
            document.fonts.ready.then(() => {
                // Tagline words
                const tagSplit = SplitText.create(".benefit-tagline", { type: "words" });
                gsap.from(tagSplit.words, {
                    opacity: 0,
                    yPercent: 40,
                    stagger: 0.08,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".benefit-section",
                        start: mobile ? "top 80%" : "top 70%",
                        end: mobile ? "top 50%" : undefined,
                        scrub: mobile ? 1.5 : false,
                    }
                });

                // Headline chars
                const headSplit = SplitText.create(".benefit-headline", { type: "chars" });
                gsap.from(headSplit.chars, {
                    yPercent: mobile ? 120 : 200,
                    stagger: 0.02,
                    ease: "power1.inOut",
                    scrollTrigger: {
                        trigger: ".benefit-section",
                        start: mobile ? "top 70%" : "top 60%",
                        end: mobile ? "top 40%" : undefined,
                        scrub: mobile ? 1.5 : false,
                    }
                });

                // Red banner clip-path reveal
                gsap.to(".benefit-banner", {
                    clipPath: "polygon(0% 0%,100% 0%,100% 100%,0% 100%)",
                    ease: "circ.inOut",
                    scrollTrigger: {
                        trigger: ".benefit-section",
                        start: mobile ? "top 55%" : "top 50%",
                        end: mobile ? "top 30%" : undefined,
                        scrub: mobile ? 1.5 : false,
                    }
                });

                // Side labels fade in
                gsap.from(".benefit-label", {
                    opacity: 0,
                    x: (i: number) => i === 0 ? -30 : 30,
                    stagger: 0.15,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".benefit-labels-row",
                        start: mobile ? "top 85%" : "top 70%",
                        end: mobile ? "top 55%" : undefined,
                        scrub: mobile ? 1.5 : false,
                    }
                });

                // Icon badges fade up
                gsap.from(".benefit-badge", {
                    opacity: 0,
                    y: 30,
                    stagger: 0.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".benefit-badges-row",
                        start: mobile ? "top 90%" : "top 75%",
                        end: mobile ? "top 60%" : undefined,
                        scrub: mobile ? 1.5 : false,
                    }
                });

                // Bottom text fade
                gsap.from(".benefit-bottom", {
                    opacity: 0,
                    y: 20,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".benefit-bottom",
                        start: mobile ? "top 95%" : "top 85%",
                        end: mobile ? "top 70%" : undefined,
                        scrub: mobile ? 1.5 : false,
                    }
                });
            });
        };

        mm.add("(max-width: 768px)", () => buildBenefit(true));
        mm.add("(min-width: 769px)", () => buildBenefit(false));

        return () => mm.revert();
    }, []);

    return (
        <section className="benefit-section">
            <div className="container mx-auto md:pt-24 pt-16 md:pb-20 pb-12 px-5">
                {/* Tagline */}
                <p className="benefit-tagline text-stone text-center text-[0.65rem] uppercase tracking-[0.2em] mb-6" style={{ fontFamily: "Syne, sans-serif", fontWeight: 500 }}>
                    Premium Quality. Maximum Impact
                </p>

                {/* Headline */}
                <div className="col-center overflow-hidden">
                    <h1 className="benefit-headline general-title text-center text-charcoal">
                        Long-Lasting Formula
                    </h1>
                </div>

                {/* Red banner */}
                <div className="col-center md:mt-4 mt-3">
                    <div className="benefit-banner inline-block bg-sick-red md:px-8 px-5 md:py-3 py-2" style={{ clipPath: "polygon(50% 0%,50% 0%,50% 100%,50% 100%)" }}>
                        <h2 className="text-white text-[clamp(1rem,3vw,2rem)] font-bold uppercase tracking-[0.04em]" style={{ fontFamily: "Syne, sans-serif" }}>
                            48mg Pheromone-Infused Blend
                        </h2>
                    </div>
                </div>

                {/* Side labels row */}
                <div className="benefit-labels-row flex items-center justify-center md:gap-16 gap-6 md:mt-10 mt-8">
                    <div className="benefit-label flex items-center gap-3">
                        <span className="block md:w-10 w-6 h-px bg-charcoal" />
                        <span className="text-[0.6rem] uppercase tracking-[0.15em] text-stone" style={{ fontFamily: "Syne, sans-serif", fontWeight: 500 }}>93% Raw Materials</span>
                    </div>
                    <div className="benefit-label flex items-center gap-3">
                        <span className="text-[0.6rem] uppercase tracking-[0.15em] text-stone" style={{ fontFamily: "Syne, sans-serif", fontWeight: 500 }}>Luxury Grade Fragrance Oils</span>
                        <span className="block md:w-10 w-6 h-px bg-charcoal" />
                    </div>
                </div>

                {/* Scroll to discover circle */}
                <div className="col-center md:mt-12 mt-10">
                    <div className="md:size-28 size-22 rounded-full bg-charcoal flex flex-col items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform duration-300">
                        <span className="text-[0.5rem] uppercase tracking-[0.2em] mb-1" style={{ fontFamily: "Syne, sans-serif", fontWeight: 500 }}>Scroll to</span>
                        <span className="text-[0.5rem] uppercase tracking-[0.2em] mb-2" style={{ fontFamily: "Syne, sans-serif", fontWeight: 500 }}>Discover</span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="animate-bounce">
                            <path d="M6 1v10M6 11l4-4M6 11L2 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                {/* Icon badges */}
                <div className="benefit-badges-row flex items-start justify-center md:gap-32 gap-10 md:mt-12 mt-10">
                    <div className="benefit-badge flex flex-col items-center text-center max-w-[10rem]">
                        <div className="md:size-10 size-8 rounded-full border border-sick-red flex items-center justify-center mb-3">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                        <span className="text-[0.55rem] uppercase tracking-[0.12em] text-charcoal leading-relaxed" style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
                            Designed to Leave a Lasting Impression
                        </span>
                    </div>
                    <div className="benefit-badge flex flex-col items-center text-center max-w-[10rem]">
                        <div className="md:size-10 size-8 rounded-full border border-sick-red flex items-center justify-center mb-3">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </div>
                        <span className="text-[0.55rem] uppercase tracking-[0.12em] text-charcoal leading-relaxed" style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
                            Backed by Science, Made to Be Noticed
                        </span>
                    </div>
                </div>

                {/* Bottom text */}
                <div className="benefit-bottom col-center md:mt-14 mt-10">
                    <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#DC2626">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        ))}
                    </div>
                    <p className="text-stone text-center text-[0.65rem] uppercase tracking-[0.12em]" style={{ fontFamily: "Syne, sans-serif", fontWeight: 500 }}>
                        100,000+ Happy Customers and Counting
                    </p>
                    <p className="text-charcoal text-center text-[0.6rem] uppercase tracking-[0.15em] mt-3" style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
                        Powered by <span className="text-sick-red">Science</span>. Driven by <span className="text-sick-red">Attraction</span>.
                    </p>
                </div>
            </div>

            {/* Video pin section - leave video playing as they scroll */}
            <div className="vd-pin relative overlay-box md:-mt-10 mt-0">
                <div className="video-wrapper relative w-full h-dvh">
                    <VideoPin />
                </div>
            </div>
        </section>
    )
}

export default BenifitSection
