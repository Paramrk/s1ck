import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useMediaQuery } from "react-responsive";
import { getImage, getVideo } from '../utils/media';

const heroBgVid = getVideo("hero-bg-3.mp4");

const HeroSection = () => {

    const isMobHero = useMediaQuery({
        query: "(max-width:768px)",
    });

    const isTabHero = useMediaQuery({
        query: "(max-width:1024px)",
    });

    useGSAP(() => {
        const mm = gsap.matchMedia();

        const buildIntro = (isMobile: boolean) => {
            document.fonts.ready.then(() => {
                const titleSplit = SplitText.create(".hero-title", { type: "words,chars" });

                const tl = gsap.timeline({ delay: 1 });

                tl.to(".hero-content", {
                    opacity: 1,
                    y: 0,
                    ease: "power1.inOut"
                })
                    .to(".hero-text-scroll", {
                        duration: isMobile ? 0.7 : 1,
                        clipPath: "polygon(0% 0%,100% 0%,100% 100%, 0% 100%)",
                        ease: "circ.out"
                    }, "-=0.5")
                    .from(titleSplit.chars, {
                        yPercent: isMobile ? 120 : 200,
                        stagger: isMobile ? 0.015 : 0.02,
                        ease: "power2.out"
                    }, "-=0.5");

                // Mobile: staggered entrance for subtitle, description, and CTA
                if (isMobile) {
                    tl.from(".hero-content h2", {
                        opacity: 0,
                        y: 20,
                        duration: 0.6,
                        ease: "power2.out"
                    }, "-=0.3")
                        .from(".hero-button", {
                            opacity: 0,
                            y: 15,
                            scale: 0.95,
                            duration: 0.5,
                            ease: "power2.out"
                        }, "-=0.2");
                }

                const heroTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".hero-container",
                        start: "1% top",
                        end: "bottom top",
                        // Lerped scrub on mobile damps per-frame jitter from
                        // variable touch frame rate; instant scrub on desktop.
                        scrub: isMobile ? 1 : true,
                    }
                });

                // Reduced parallax on mobile for smoother feel
                heroTl.to(".hero-container", {
                    rotate: isMobile ? 3 : 7,
                    scale: isMobile ? 0.95 : 0.9,
                    yPercent: isMobile ? 15 : 30,
                    ease: "power1.inOut",
                    force3D: true,
                });
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
    const titleBgTheme = isMobileOrTablet ? "bg-charcoal/5 ring-charcoal/10" : "bg-white/15 ring-white/15";

    return (
        <section>
            <div className="hero-container">
                {(isTabHero ?
                    <>
                        {isMobHero && <img src={getImage("hero-bg.png")} alt="" loading="eager" decoding="async" className="absolute bottom-40 object-cover w-full h-full" />}
                        <img src={getImage("herobg.webp")} alt="" loading="eager" decoding="async" className="absolute bottom-0 left-1/2 -translate-x-1/2 object-auto" />
                    </>
                    :
                    <>
                        <video src={heroBgVid} autoPlay loop playsInline muted className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/45 z-[1]" />
                    </>
                )}
                <div className="hero-content opacity-0">
                    {/* Decorative emblem row — two lines flanking the S1CK logo */}
                    <div className="hero-emblem hidden md:flex items-center justify-center gap-5 md:gap-8 mb-4 md:mb-8 w-full max-w-[30rem] sm:max-w-[36rem] md:max-w-[44rem] lg:max-w-[52rem] px-4">
                        <span className={`h-px flex-1 ${lineTheme}`} />
                        <img
                            src={getImage("s1ck-logo-transparent.webp")}
                            alt="S1CK"
                            className={`hero-logo-slot w-16 md:w-24 lg:w-28 shrink-0 select-none pointer-events-none ${logoTheme}`}
                            draggable={false}
                        />
                        <span className={`h-px flex-1 ${lineTheme}`} />
                    </div>

                    <div className={`overflow-hidden backdrop-blur-md rounded-lg px-4 ring-1 shadow-sm ${titleBgTheme}`}>
                        <h1 className={`hero-title lg:p-0 p-2 ${textTheme}`}>Dangerously Attractive</h1>
                    </div>

                    <div className={`hero-text-scroll mt-1.5 md:mt-3 border-[3px] rounded-sm ${isMobileOrTablet ? "border-charcoal" : "border-cream"}`}>
                        <div className={`hero-subtitle ${isMobileOrTablet ? "bg-charcoal" : "bg-slate"}`}>
                            <h1>Rated Best Pheromones 7 Years In A Row</h1>
                        </div>
                    </div>

                    <p
                        className={`text-center md:max-w-md max-w-[90%] px-5 text-[0.7rem] md:text-[0.78rem] leading-[1.7] mt-2.5 md:mt-4 tracking-[0.04em] ${descTheme}`}
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        Recognized by House of Pheromones for unmatched performance and attraction.
                    </p>

                    <div className="hero-button">
                        <a href="shop">SMELL DIFFERENT</a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection;
