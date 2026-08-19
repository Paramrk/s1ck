import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const MessageSection = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        if (!sectionRef.current) return;

        const media = gsap.matchMedia();
        media.add({
            isMobile: "(max-width: 768px)",
            isDesktop: "(min-width: 769px)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
        }, (context) => {
            const { isMobile, reduceMotion } = context.conditions as {
                isMobile: boolean;
                isDesktop: boolean;
                reduceMotion: boolean;
            };
            if (reduceMotion) return;

            const words = gsap.utils.toArray<HTMLElement>(".message-word");
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: () => `+=${Math.max(
                        window.innerHeight * (isMobile ? 0.78 : 1.15),
                        isMobile ? 460 : 720,
                    )}`,
                    pin: ".message-sticky",
                    pinSpacing: true,
                    scrub: isMobile ? 0.55 : 1.05,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            });

            timeline
                .from(words, {
                    opacity: 0,
                    yPercent: isMobile ? 35 : 70,
                    rotationX: isMobile ? -35 : -78,
                    filter: isMobile ? "none" : "blur(8px)",
                    transformOrigin: "50% 100%",
                    stagger: isMobile ? 0.14 : 0.28,
                    duration: isMobile ? 0.6 : 0.9,
                    ease: "power2.out",
                })
                .from(".enough-cord", {
                    scaleY: 0,
                    transformOrigin: "top center",
                    stagger: 0.05,
                    duration: isMobile ? 0.28 : 0.38,
                    ease: "power2.inOut",
                }, ">-0.08")
                .from(".message-enough", {
                    opacity: 0,
                    yPercent: isMobile ? -80 : -145,
                    z: isMobile ? 0 : -280,
                    rotationX: isMobile ? -45 : -86,
                    rotationZ: isMobile ? -4 : -9,
                    transformOrigin: "50% 0%",
                    duration: isMobile ? 0.75 : 1.15,
                    ease: "back.out(1.35)",
                }, "<0.04")
                .to(".message-enough", {
                    yPercent: isMobile ? 1.5 : 2,
                    rotationX: isMobile ? 3 : 6,
                    rotationZ: isMobile ? 1.5 : 2.2,
                    duration: 0.3,
                    ease: "sine.inOut",
                })
                .to(".message-enough", {
                    yPercent: 0,
                    rotationX: 0,
                    rotationZ: 0,
                    duration: 0.25,
                    ease: "sine.inOut",
                });

            return () => timeline.kill();
        });

        return () => media.revert();
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="message-content">
            <div className="message-sticky">
                <h2 className="message-heading" aria-label="Because being different isn't enough">
                    <span className="message-line" aria-hidden="true">
                        <span className="message-word">Because</span>
                        <span className="message-word">Being</span>
                    </span>
                    <span className="message-line" aria-hidden="true">
                        <span className="message-word">Different</span>
                        <span className="message-word">Isn't</span>
                    </span>
                    <span className="enough-hanger" aria-hidden="true">
                        <span className="enough-cord enough-cord-left" />
                        <span className="enough-cord enough-cord-right" />
                        <span className="message-enough">Enough</span>
                    </span>
                </h2>
            </div>
        </section>
    );
};

export default MessageSection;
