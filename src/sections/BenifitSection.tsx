import { useGSAP } from "@gsap/react"
import gsap from "gsap";
import { SplitText, ScrollTrigger } from "gsap/all";
import VideoPin from "../components/VideoPin";

const BenifitSection = () => {

    useGSAP(() => {
        const mm = gsap.matchMedia();

        const buildBenefit = (mobile: boolean) => {
            document.fonts.ready.then(() => {
                const scope = mobile ? ".benefit-mobile-overlay" : ".benefit-text-overlay";
                const triggerBase = {
                    trigger: mobile ? ".benefit-section .video-wrapper" : ".video-wrapper",
                    start: mobile ? "top 85%" : "top 70%",
                    toggleActions: "play none none none",
                };

                const tagSplit = SplitText.create(`${scope} .benefit-tagline`, { type: "words" });
                gsap.from(tagSplit.words, {
                    opacity: 0,
                    yPercent: 40,
                    stagger: 0.08,
                    ease: "power2.out",
                    scrollTrigger: { ...triggerBase },
                });

                const headSplit = SplitText.create(`${scope} .benefit-headline`, { type: "chars" });
                gsap.from(headSplit.chars, {
                    yPercent: mobile ? 120 : 200,
                    stagger: 0.02,
                    ease: "power1.inOut",
                    scrollTrigger: {
                        ...triggerBase,
                        start: mobile ? "top 80%" : "top 60%",
                    },
                });

                gsap.to(`${scope} .benefit-banner`, {
                    clipPath: "polygon(0% 0%,100% 0%,100% 100%,0% 100%)",
                    ease: "circ.inOut",
                    duration: 0.8,
                    scrollTrigger: {
                        ...triggerBase,
                        start: mobile ? "top 75%" : "top 50%",
                    },
                });

                gsap.from(`${scope} .benefit-label`, {
                    x: (i: number) => i === 0 ? -30 : 30,
                    stagger: 0.15,
                    ease: "power2.out",
                    scrollTrigger: {
                        ...triggerBase,
                        start: mobile ? "top 70%" : "top 45%",
                    },
                });

                gsap.from(`${scope} .benefit-badge`, {
                    y: 30,
                    stagger: 0.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        ...triggerBase,
                        start: mobile ? "top 65%" : "top 40%",
                    },
                });

                gsap.from(`${scope} .benefit-bottom`, {
                    y: 20,
                    ease: "power2.out",
                    scrollTrigger: {
                        ...triggerBase,
                        start: mobile ? "top 60%" : "top 35%",
                    },
                });

                ScrollTrigger.refresh();
            });
        };

        mm.add("(max-width: 1023px)", () => buildBenefit(true));
        mm.add("(min-width: 1024px)", () => buildBenefit(false));

        return () => mm.revert();
    }, []);

    return (
        <section className="benefit-section">
            <div className="vd-pin relative overlay-box lg:-mt-10 mt-0">
                <div className="video-wrapper relative w-full h-dvh">
                    <VideoPin />
                </div>
            </div>
        </section>
    )
}

export default BenifitSection
