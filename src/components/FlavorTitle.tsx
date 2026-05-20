import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";

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
        <div className="general-title flex flex-col items-start text-left lg:gap-7 gap-4 max-w-md w-full">
            {/* Stars + customer count */}
            <div
                className="flavor-stars flex items-center gap-3 text-[0.5rem] md:text-[0.72rem] text-stone uppercase tracking-[0.15em] md:tracking-[0.2em]"
                style={{ fontFamily: "Syne, sans-serif", fontWeight: 500 }}
            >
                <span className="flex items-center gap-[2px]">
                    {[0, 1, 2, 3, 4].map((s) => (
                        <svg
                            key={s}
                            viewBox="0 0 20 20"
                            className="w-2.5 h-2.5 md:w-3 md:h-3 md:w-[14px] md:h-[14px] text-sick-red fill-current"
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
                <h1 className="!text-left text-charcoal leading-[0.92]">Best Sellers</h1>
            </div>

            {/* TRUSTED BY THOUSANDS — red highlight strip */}
            <div className="flavor-text-scroll self-start">
                <div className="bg-sick-red md:py-4 py-2.5 md:px-6 px-3">
                    <h2 className="text-white text-[0.75rem] md:text-base tracking-[-0.01em]">Trusted By Thousands</h2>
                </div>
            </div>

            {/* WORLDWIDE */}
            <div className="overflow-hidden second-text-split w-full">
                <h1 className="!text-left text-charcoal leading-[0.92]">Worldwide</h1>
            </div>

            <p
                className="flavor-subtitle text-stone md:text-sm text-[0.72rem] md:max-w-sm max-w-none leading-relaxed tracking-[0.02em] md:tracking-[0.04em]"
                style={{ fontFamily: "Syne, sans-serif", fontWeight: 400 }}
            >
                Discover the fragrances everyone keeps coming back for.
            </p>
        </div>
    );
};

export default FlavorTitle;
