import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMediaQuery } from "react-responsive";
import { getImage, getVideo } from "../utils/media";

const heroBgVid = getVideo("hero-bg-3.mp4");
const heroMobileVid = getVideo("hero-mobile.mp4");
const heroPoster = getImage("herobg.webp");

const HeroSection = () => {
    const isTabHero = useMediaQuery({
        query: "(max-width:1024px)",
    });

    useGSAP(() => {
        const mm = gsap.matchMedia();

        const buildIntro = (isMobile: boolean) => {
            const tl = gsap.timeline({ delay: 0.12 });

            tl.to(".hero-content", {
                opacity: 1,
                y: 0,
                duration: 0.55,
                ease: "power2.out",
            })
                .to(
                    ".hero-text-scroll",
                    {
                        duration: isMobile ? 0.55 : 0.75,
                        clipPath: "polygon(0% 0%,100% 0%,100% 100%, 0% 100%)",
                        ease: "circ.out",
                    },
                    "-=0.35",
                )
                .from(
                    ".hero-title",
                    {
                        y: 20,
                        opacity: 0,
                        duration: 0.6,
                        ease: "power2.out",
                    },
                    "-=0.45",
                );

            if (isMobile) {
                tl.from(
                    ".hero-button",
                    {
                        opacity: 0,
                        y: 12,
                        duration: 0.45,
                        ease: "power2.out",
                    },
                    "-=0.25",
                );
            }

            // Parallax only the content layer — not the video/images
            gsap.to(".hero-scroll-layer", {
                rotate: isMobile ? 2 : 5,
                scale: isMobile ? 1 : 0.92,
                yPercent: isMobile ? 10 : 22,
                ease: "none",
                force3D: true,
                scrollTrigger: {
                    trigger: ".hero-container",
                    start: "1% top",
                    end: "bottom top",
                    scrub: isMobile ? 0.8 : 1.4,
                },
            });
        };

        mm.add("(max-width: 768px)", () => buildIntro(true));
        mm.add("(min-width: 769px)", () => buildIntro(false));

        return () => mm.revert();
    }, []);

    const isMobileOrTablet = isTabHero;
    const textTheme = isMobileOrTablet ? "text-charcoal" : "text-cream";
    const lineTheme = isMobileOrTablet ? "bg-charcoal/20" : "bg-cream/60";
    const logoTheme = isMobileOrTablet ? "brightness-0" : "brightness-0 invert";
    const descTheme = isMobileOrTablet ? "text-charcoal/80" : "text-cream/80";
    const titleBgTheme = isMobileOrTablet
        ? "bg-charcoal/8 ring-charcoal/10"
        : "bg-white/20 ring-white/20";

    return (
        <section data-nav-logo={isMobileOrTablet ? "dark" : "light"}>
            <div className="hero-container max-md:bg-parchment">
                <div className="hero-media-layer" aria-hidden>
                    {isTabHero ? (
                        <video
                            src={heroMobileVid}
                            poster={heroPoster}
                            autoPlay
                            loop
                            playsInline
                            muted
                            preload="metadata"
                            className="absolute inset-0 h-full w-full object-cover object-bottom"
                        />
                    ) : (
                        <>
                            <video
                                src={heroBgVid}
                                poster={heroPoster}
                                autoPlay
                                loop
                                playsInline
                                muted
                                preload="metadata"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/45" />
                        </>
                    )}
                </div>

                <div className="hero-scroll-layer">
                    <div className="hero-content opacity-0">
                        <div className="hero-emblem flex items-center justify-center gap-4 md:gap-8 mb-4 md:mb-8 w-full max-w-[17rem] sm:max-w-[22rem] md:max-w-[44rem] lg:max-w-[52rem] px-4 mx-auto">
                            <span className={`h-px flex-1 ${lineTheme}`} />
                            <img
                                src={getImage("s1ck-logo-transparent.webp")}
                                alt="S1CK"
                                className={`hero-logo-slot w-14 sm:w-16 md:w-24 lg:w-28 shrink-0 select-none pointer-events-none ${logoTheme}`}
                                draggable={false}
                                loading="lazy"
                                decoding="async"
                            />
                            <span className={`h-px flex-1 ${lineTheme}`} />
                        </div>

                        <div
                            className={`overflow-hidden rounded-lg px-4 max-md:ring-0 max-md:shadow-none md:ring-1 md:shadow-sm max-md:mx-auto max-md:w-[92%] max-md:max-w-sm max-md:text-center ${titleBgTheme}`}
                        >
                            <h1 className={`hero-title lg:p-0 p-2 max-md:text-center ${textTheme}`}>
                                Dangerously Attractive
                            </h1>
                        </div>

                        <div
                            className={`hero-text-scroll mt-1.5 md:mt-3 border-[3px] rounded-sm max-md:mx-auto max-md:w-[92%] max-md:max-w-sm max-md:text-center ${isMobileOrTablet ? "border-charcoal" : "border-cream"}`}
                        >
                            <div
                                className={`hero-subtitle ${isMobileOrTablet ? "bg-charcoal" : "bg-slate"}`}
                            >
                                <h1>Rated Best Pheromones 7 Years In A Row</h1>
                            </div>
                        </div>

                        <p
                            className={`text-center md:max-w-md max-w-[90%] px-5 text-[0.7rem] md:text-[0.78rem] leading-[1.7] mt-2.5 md:mt-4 tracking-[0.04em] ${descTheme}`}
                            style={{ fontFamily: "Syne, sans-serif" }}
                        >
                            Recognized by House of Pheromones for unmatched performance and
                            attraction.
                        </p>

                        <div className="hero-button">
                            <a href="shop">SMELL DIFFERENT</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
