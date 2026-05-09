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
        document.fonts.ready.then(() => {
            const titleSplit = SplitText.create(".hero-title", { type: "chars" });

            const tl = gsap.timeline({ delay: 1 });

            tl.to(".hero-content", {
                opacity: 1,
                y: 0,
                ease: "power1.inOut"
            })
                .to(".hero-text-scroll", {
                    duration: isMobHero ? 0.7 : 1,
                    clipPath: "polygon(0% 0%,100% 0%,100% 100%, 0% 100%)",
                    ease: "circ.out"
                }, "-=0.5")
                .from(titleSplit.chars, {
                    yPercent: isMobHero ? 120 : 200,
                    stagger: isMobHero ? 0.015 : 0.02,
                    ease: "power2.out"
                }, "-=0.5");

            // Mobile: staggered entrance for subtitle, description, and CTA
            if (isMobHero) {
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
                    scrub: true,
                }
            });

            // Reduced parallax on mobile for smoother feel
            heroTl.to(".hero-container", {
                rotate: isMobHero ? 3 : 7,
                scale: isMobHero ? 0.95 : 0.9,
                yPercent: isMobHero ? 15 : 30,
                ease: "power1.inOut"
            });
        });
    });


    return (
        <section>
            <div className="hero-container">
                {(isTabHero ?
                    <>
                        {isMobHero && <img src={getImage("hero-bg.png")} alt="" className="absolute bottom-40 object-cover w-full h-full" />}
                        <img src={getImage("hero-img.png")} alt="" className="absolute bottom-0 left-1/2 -translate-x-1/2 object-auto" />
                    </>
                    :
                    <video src={heroBgVid} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="hero-content opacity-0">
                    <div className="overflow-hidden">
                        <h1 className="hero-title lg:p-0 p-2">Dangerously Attractive</h1>
                    </div>
                    <div className="hero-text-scroll">
                        <div className="hero-subtitle">
                            <h1>Pure Pheromone Science</h1>
                        </div>
                    </div>
                    <h2>S1CK is engineered to make you unforgettable. Wear the scent that doesn't just turn heads — it owns the room.</h2>
                    <div className="hero-button">
                        <a href="shop">SMELL DIFFERENT</a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection;