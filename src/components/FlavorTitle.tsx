import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import s1ckLogo from "../assets/s1cklogo-trnsp.png";

const FlavorTitle = () => {

    useGSAP(() => {
        const mm = gsap.matchMedia();

        const buildIntro = (isMobile: boolean) => {
            document.fonts.ready.then(() => {
                const firstTextSplit = SplitText.create(".first-text-split h1", {
                    type: "chars",
                });
                const secTextSplit = SplitText.create(".second-text-split h1", {
                    type: "chars",
                });

                gsap.from(".flavor-logo emblem", {
                    opacity: 0,
                    scale: 0.7,
                    rotate: -10,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".flavor-section",
                        start: isMobile ? "top 75%" : "top 85%",
                    },
                });

                gsap.from(firstTextSplit.chars, {
                    yPercent: 180,
                    stagger: 0.02,
                    ease: "power2.out",
                    duration: 0.9,
                    scrollTrigger: {
                        trigger: ".flavor-section",
                        start: isMobile ? "top 70%" : "top 80%",
                    },
                });

                gsap.to(".flavor-text-scroll", {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    ease: "power2.out",
                    duration: 0.9,
                    scrollTrigger: {
                        trigger: ".flavor-section",
                        start: isMobile ? "top 55%" : "top 65%",
                    },
                });

                gsap.from(secTextSplit.chars, {
                    yPercent: 180,
                    stagger: 0.02,
                    ease: "power2.out",
                    duration: 0.9,
                    scrollTrigger: {
                        trigger: ".flavor-section",
                        start: isMobile ? "top 40%" : "top 50%",
                    },
                });

                gsap.from(".flavor-stars", {
                    opacity: 0,
                    y: 20,
                    duration: 0.7,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".flavor-section",
                        start: isMobile ? "top 80%" : "top 90%",
                    },
                });

                gsap.from(".flavor-subtitle", {
                    opacity: 0,
                    y: 20,
                    duration: 0.7,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".flavor-section",
                        start: isMobile ? "top 35%" : "top 45%",
                    },
                });
            });
        };

        mm.add("(max-width: 768px)", () => buildIntro(true));
        mm.add("(min-width: 769px)", () => buildIntro(false));

        return () => mm.revert();
    }, []);

    return (
        <div className="general-title flex flex-col items-center lg:items-start text-center lg:text-left lg:gap-7 gap-2 max-w-md w-full">
            {/* S1CK Logo Emblem — desktop only */}
            <div className="flavor-logo mb-2 lg:mb-4 hidden lg:block">
                <div 
                    className="emblem w-20 h-20 rounded-full bg-sick-red/10 border-2 border-sick-red/20 flex items-center justify-center shadow-lg shadow-sick-red/10"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    <img 
                        src={s1ckLogo} 
                        alt="S1CK Logo" 
                        className="w-12 h-12 object-contain filter brightness-0 saturate-100 invert sepia(1) hue-rotate(330deg)"
                        style={{ transform: "translateZ(10px)" }}
                    />
                </div>
            </div>

            {/* Stars + customer count */}
            <div
                className="flavor-stars flex items-center gap-2 lg:gap-3 text-[0.45rem] md:text-[0.72rem] text-stone uppercase tracking-[0.12em] md:tracking-[0.2em]"
                style={{ fontFamily: "Syne, sans-serif", fontWeight: 500 }}
            >
                <span className="flex items-center gap-[1px] lg:gap-[2px]">
                    {[0, 1, 2, 3, 4].map((s) => (
                        <svg
                            key={s}
                            viewBox="0 0 20 20"
                            className="w-2 h-2 md:w-3 md:h-3 lg:w-[14px] lg:h-[14px] text-sick-red fill-current"
                            aria-hidden="true"
                        >
                            <path d="M10 1.5l2.6 5.3 5.9.86-4.27 4.16 1.01 5.88L10 14.9l-5.24 2.8 1-5.88L1.5 7.66l5.9-.86z" />
                        </svg>
                    ))}
                </span>
                <span className="hidden sm:inline">Over 100,000+ Happy Customers</span>
            </div>

            {/* BEST SELLERS */}
            <div className="overflow-hidden first-text-split w-full">
                <h1 className="!text-left lg:!text-left !text-center text-charcoal leading-[0.92] text-2xl md:text-4xl lg:text-6xl 2xl:text-[5.5rem]">Best Sellers</h1>
            </div>

            {/* TRUSTED BY THOUSANDS — red highlight strip */}
            <div className="flavor-text-scroll self-center lg:self-start">
                <div className="bg-sick-red md:py-4 py-1.5 md:px-6 px-3">
                    <h2 className="text-white text-[0.6rem] md:text-base tracking-[-0.01em]">Trusted By Thousands</h2>
                </div>
            </div>

            {/* WORLDWIDE */}
            <div className="overflow-hidden second-text-split w-full">
                <h1 className="!text-left lg:!text-left !text-center text-charcoal leading-[0.92] text-2xl md:text-4xl lg:text-6xl 2xl:text-[5.5rem]">Worldwide</h1>
            </div>

            <p
                className="flavor-subtitle text-stone md:text-sm text-[0.58rem] md:max-w-sm max-w-[280px] leading-relaxed tracking-[0.02em] md:tracking-[0.04em] hidden lg:block"
                style={{ fontFamily: "Syne, sans-serif", fontWeight: 400 }}
            >
                Discover the fragrances everyone keeps coming back for.
            </p>
        </div>
    );
};

export default FlavorTitle;
