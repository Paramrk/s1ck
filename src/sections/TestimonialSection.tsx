import { cards } from "../constants/details";
import { useRef, useState, useCallback, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import { useMediaQuery } from "react-responsive";

const TestimonialSection = () => {
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

    // Refs to multiple video elements
    const vdRf = useRef<HTMLVideoElement[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeCard, setActiveCard] = useState(0);

    // ── Desktop GSAP scroll animation ──
    useGSAP(() => {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 769px)", () => {
            gsap.set(".testimonials-section", { marginTop: "-100vh" });

            const tesTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".testimonials-section",
                    start: "top bottom",
                    end: "500% top",
                    scrub: true,
                    pinSpacing: false,
                }
            });

            const pinTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".testimonials-section",
                    start: "10% top",
                    end: "200% top",
                    scrub: 1.5,
                    pin: true,
                }
            });

            pinTl.from(".vd-card", {
                yPercent: 300,
                stagger: 0.3,
                ease: "power1.inOut"
            }, "<");

            tesTl.to(".testimonials-section .ft-anim", {
                xPercent: 100, yPercent: -100
            }).to(".testimonials-section .st-anim", {
                xPercent: 55, yPercent: -100
            }, "<").to(".testimonials-section .tt-anim", {
                xPercent: -80, yPercent: -100
            }, "<");
        });

        // Mobile: simple entrance animation (no pin, no heavy scrub)
        mm.add("(max-width: 768px)", () => {
            gsap.set(".testimonials-section", { marginTop: "-50vh" });

            // Title text animation
            gsap.from(".testimonials-section .all-title h1", {
                yPercent: 60,
                opacity: 0,
                stagger: 0.15,
                ease: "power2.out",
                duration: 0.8,
                scrollTrigger: {
                    trigger: ".testimonials-section",
                    start: "top 80%",
                },
            });

            // Cards container entrance
            gsap.from(".mob-carousel-container", {
                opacity: 0,
                y: 60,
                ease: "power2.out",
                duration: 0.9,
                scrollTrigger: {
                    trigger: ".mob-carousel-container",
                    start: "top 90%",
                },
            });
        });

        return () => mm.revert();
    }, []);

    // ── Mobile scroll-snap detection ──
    const handleScroll = useCallback(() => {
        const container = scrollRef.current;
        if (!container) return;
        const cardWidth = container.children[0]?.clientWidth ?? 0;
        if (cardWidth === 0) return;
        const gap = 16;
        const idx = Math.round(container.scrollLeft / (cardWidth + gap));
        setActiveCard(Math.min(idx, cards.length - 1));
    }, []);

    // Auto-play visible card on mobile
    useEffect(() => {
        if (!isMobile) return;
        vdRf.current.forEach((video, i) => {
            if (!video) return;
            if (i === activeCard) {
                video.play().catch(() => {});
            } else {
                video.pause();
                video.currentTime = 0;
            }
        });
    }, [activeCard, isMobile]);

    // Auto-play all cards on desktop on mount
    useEffect(() => {
        if (isMobile) return;
        vdRf.current.forEach((video) => {
            if (video) video.play().catch(() => {});
        });
    }, [isMobile]);

    const scrollToCard = (idx: number) => {
        const container = scrollRef.current;
        if (!container) return;
        const card = container.children[idx] as HTMLElement;
        if (card) {
            card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
    };

    const setVideoRef = (el: HTMLVideoElement | null, index: number): void => {
        if (el) vdRf.current[index] = el;
    };

    const handlePlay = (index: number): void => {
        const video = vdRf.current[index];
        if (video) video.play().catch(() => {});
    };

    const handlePause = (index: number): void => {
        const video = vdRf.current[index];
        if (video) video.pause();
    };

    return (
        <section className="testimonials-section">
            <div className="relative w-full lg:h-[130vh] h-auto min-h-[90vh]">
                {/* Title text */}
                <div className="all-title lg:h-[150vh] lg:absolute lg:size-full flex flex-col items-center lg:pt-[5vw] pt-[12vw] pb-6 lg:pb-0">
                    <h1 className="text-charcoal first-title ft-anim">They're</h1>
                    <h1 className="text-sick-gold sec-title st-anim">All</h1>
                    <h1 className="text-charcoal third-title tt-anim">Simping</h1>
                </div>

                {/* ═══ DESKTOP: Original fan-out card layout ═══ */}
                <div className="pin-box hidden md:flex">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className={`vd-card ${card.translation} ${card.rotation}`}
                        >
                            <video
                                ref={(el) => setVideoRef(el, index)}
                                src={card.src}
                                playsInline muted loop autoPlay
                                preload="auto"
                                className="size-full object-cover"
                            />
                        </div>
                    ))}
                </div>

                {/* ═══ MOBILE: Horizontal swipe carousel ═══ */}
                <div className="mob-carousel-container md:hidden flex flex-col items-center gap-5 px-0 pb-6">
                    {/* Scrollable card track */}
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="mob-card-track flex gap-4 overflow-x-auto snap-x snap-mandatory w-full px-6 pb-4"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                            WebkitOverflowScrolling: "touch",
                        }}
                    >
                        {cards.map((card, index) => (
                            <div
                                key={index}
                                className="snap-center shrink-0 rounded-2xl overflow-hidden border border-ivory shadow-lg relative"
                                style={{
                                    width: "75vw",
                                    maxWidth: "320px",
                                    aspectRatio: "9/16",
                                }}
                            >
                                <video
                                    ref={(el) => setVideoRef(el, index)}
                                    src={card.src}
                                    playsInline muted loop autoPlay
                                    preload="metadata"
                                    className="w-full h-full object-cover"
                                />
                                {/* Name overlay */}
                                <div
                                    className="absolute bottom-0 left-0 right-0 p-4"
                                    style={{
                                        background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
                                    }}
                                >
                                    <p
                                        className="text-white text-[0.7rem] uppercase tracking-[0.2em]"
                                        style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}
                                    >
                                        {card.name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dot indicators */}
                    <div className="flex items-center gap-2">
                        {cards.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                aria-label={`Go to card ${i + 1}`}
                                onClick={() => scrollToCard(i)}
                                className="transition-all duration-300"
                                style={{
                                    width: i === activeCard ? "24px" : "6px",
                                    height: "6px",
                                    borderRadius: "3px",
                                    backgroundColor: i === activeCard ? "#DC2626" : "rgba(17,17,17,0.15)",
                                    border: "none",
                                    padding: 0,
                                    cursor: "pointer",
                                }}
                            />
                        ))}
                    </div>

                    {/* Counter */}
                    <p
                        className="text-stone text-[0.6rem] uppercase tracking-[0.25em]"
                        style={{ fontFamily: "Syne, sans-serif", fontWeight: 500 }}
                    >
                        {String(activeCard + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}
                    </p>
                </div>
            </div>

            {/* CTA button */}
            <div className="md:absolute md:bottom-20 w-full h-auto py-6 md:py-2 flex justify-center items-center z-100">
                <button type="button" className="sick-btn-filled px-10 py-4 rounded-4xl">SEE MORE REACTIONS</button>
            </div>
        </section>
    );
};

export default TestimonialSection;
