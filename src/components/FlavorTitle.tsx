import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";

const FlavorTitle = () => {

    useGSAP(() => {
        const mm = gsap.matchMedia();

        const buildIntro = (isMobile: boolean) => {
            document.fonts.ready.then(() => {
                const splitHeadlineLines = (selector: string) => {
                    const lines = gsap.utils.toArray<HTMLElement>(
                        `${selector} .flavor-headline-line`,
                    );
                    const splits = lines.map((line) =>
                        SplitText.create(line, { type: "chars" }),
                    );
                    return splits.flatMap((split) => split.chars);
                };

                const firstChars = splitHeadlineLines(".first-text-split");
                const secondChars = splitHeadlineLines(".second-text-split");

                gsap.from(firstChars, {
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

                gsap.from(secondChars, {
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
        <div className="general-title flex flex-col items-start text-left w-full max-w-md gap-2 max-md:gap-2.5 lg:gap-7">


            {/* Stars + customer count */}
            <div
                className="flavor-stars flex items-center gap-2 lg:gap-3 text-[0.62rem] md:text-[0.72rem] text-stone uppercase tracking-[0.14em] md:tracking-[0.2em]"
                style={{ fontFamily: "Syne, sans-serif", fontWeight: 500 }}
            >
                <span className="flex items-center gap-[1px] lg:gap-[2px]">
                    {[0, 1, 2, 3, 4].map((s) => (
                        <svg
                            key={s}
                            viewBox="0 0 20 20"
                            className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-[14px] lg:h-[14px] text-sick-red fill-current"
                            aria-hidden="true"
                        >
                            <path d="M10 1.5l2.6 5.3 5.9.86-4.27 4.16 1.01 5.88L10 14.9l-5.24 2.8 1-5.88L1.5 7.66l5.9-.86z" />
                        </svg>
                    ))}
                </span>
                <span className="hidden sm:inline">Over 100,000+ Happy Customers</span>
            </div>

            {/* BEST SELLERS */}
            <div className="first-text-split w-full self-start text-left overflow-x-visible overflow-y-clip pb-1 md:pb-2 pr-1 md:pr-2">
                <h1 className="bestseller-title flavor-headline-stack text-left text-charcoal leading-[0.92] text-[2.35rem] md:text-5xl lg:text-6xl 2xl:text-[5.5rem] font-bold uppercase w-full max-w-full">
                    <span className="flavor-headline-line">Best</span>
                    <span className="flavor-headline-line">Seller</span>
                </h1>
            </div>

            {/* TRUSTED BY THOUSANDS — red highlight strip */}
            <div className="flavor-text-scroll self-start">
                <div className="bg-sick-red md:py-4 py-2 md:px-6 px-4">
                    <h2 className="text-white text-xs md:text-base tracking-[-0.01em] text-nowrap uppercase font-bold">Trusted By Thousands</h2>
                </div>
            </div>

            {/* WORLDWIDE */}
            <div className="second-text-split w-full self-start text-left overflow-x-visible overflow-y-clip pb-1 md:pb-2 pr-1 md:pr-2">
                <h1 className="worldwide-title flavor-headline-stack text-left text-charcoal leading-[0.92] text-[2.35rem] md:text-5xl lg:text-6xl 2xl:text-[5.5rem] font-bold uppercase w-full max-w-full">
                    <span className="flavor-headline-line">World</span>
                    <span className="flavor-headline-line">wide</span>
                </h1>
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
