import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useMediaQuery } from "react-responsive";
import { getImage } from '../utils/media';
import heroBgVid from "../assets/videos/hero-bg-3.mp4"

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
                const titleSplit = SplitText.create(".hero-title", { type: "chars" });

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


    return (
        <section>
            <div className="hero-container">
                {(isTabHero ?
                    <>
                        {isMobHero && <img src={getImage("hero-bg.png")} alt="" loading="eager" decoding="async" className="absolute bottom-40 object-cover w-full h-full" />}
                        <img src={getImage("herobg.jpeg")} alt="" loading="eager" decoding="async" className="absolute bottom-0 left-1/2 -translate-x-1/2 object-auto" />
                    </>
                    :
                    <video src={heroBgVid} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="hero-content opacity-0">
                    {/* Decorative emblem row — two lines flanking the S1CK logo */}
                    <div className="hero-emblem flex items-center justify-center gap-5 md:gap-8 mb-5 md:mb-8 w-full max-w-[30rem] sm:max-w-[36rem] md:max-w-[44rem] lg:max-w-[52rem] px-4">
                        <span className="h-px flex-1 bg-cream/70" />
                        <img
                            src={getImage("s1ck-logo-transparent.png")}
                            alt="S1CK"
                            className="hero-logo-slot w-16 md:w-24 lg:w-28 shrink-0 brightness-0 invert select-none pointer-events-none"
                            draggable={false}
                        />
                        <span className="h-px flex-1 bg-cream/70" />
                    </div>

                    <div className="overflow-hidden backdrop-blur-md bg-white/15 rounded-lg px-4 ring-1 ring-white/15 shadow-sm">
                        <h1 className="hero-title lg:p-0 p-2">Dangerously Attractive</h1>
                    </div>

                    <div className="hero-text-scroll mt-2 md:mt-3">
                        <div className="hero-subtitle">
                            <h1>Rated Best Pheromones 7 Years In A Row</h1>
                        </div>
                    </div>

                    <p
                        className="text-center md:max-w-md max-w-[85%] px-5 text-[0.7rem] md:text-[0.78rem] leading-[1.7] mt-3 md:mt-4 tracking-[0.04em]"
                        style={{ fontFamily: "Syne, sans-serif", color: "rgba(255,255,255,0.78)" }}
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
