import { useRef, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { getVideo } from "../utils/media";

interface Card {
    src: string;
    name: string;
}

const cards: Card[] = [
    { src: getVideo("f1.mp4"), name: "Marcus V. — Verified Buyer" },
    { src: getVideo("f2.mp4"), name: "Daniel K. — Verified Buyer" },
    { src: getVideo("f3.mp4"), name: "Alexander P. — Verified Buyer" },
    { src: getVideo("f5.mp4"), name: "Leo R. — Verified Buyer" },
    { src: getVideo("f6.mp4"), name: "Julian M. — Verified Buyer" },
    { src: getVideo("f7.mp4"), name: "Ethan S. — Verified Buyer" },
];

const TestimonialSection = () => {
    const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });
    const scrollRef = useRef<HTMLDivElement>(null);
    const vdRf = useRef<(HTMLVideoElement | null)[]>([]);
    const [activeCard, setActiveCard] = useState<number>(0);

    // Track active card on mobile scroll
    useEffect(() => {
        if (!isMobile) return;
        const container = scrollRef.current;
        if (!container) return;

        const handleScroll = () => {
            const children = Array.from(container.children) as HTMLElement[];
            if (!children.length) return;
            const containerLeft = container.scrollLeft;
            const containerWidth = container.clientWidth;
            const center = containerLeft + containerWidth / 2;

            let closestIdx = 0;
            let minDistance = Infinity;

            children.forEach((child, idx) => {
                const childCenter = child.offsetLeft + child.clientWidth / 2;
                const distance = Math.abs(center - childCenter);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIdx = idx;
                }
            });

            setActiveCard(closestIdx);
        };

        container.addEventListener("scroll", handleScroll, { passive: true });
        return () => container.removeEventListener("scroll", handleScroll);
    }, [isMobile]);

    // Auto-play visible card on mobile
    useEffect(() => {
        if (!isMobile) return;
        vdRf.current.forEach((video, i) => {
            if (!video) return;
            if (i === activeCard) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, [activeCard, isMobile]);

    // Auto-play all cards on desktop on mount
    useEffect(() => {
        if (isMobile) return;
        vdRf.current.forEach((video) => {
            if (video) {
                video.muted = true;
                video.play().catch(() => {});
            }
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
        if (el) {
            el.muted = true;
            el.defaultMuted = true;
            vdRf.current[index] = el;
            el.play().catch(() => {});
        }
    };

    return (
        <section className="testimonials-section bg-black py-16 px-4 md:px-8">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                {/* Title text */}
                <div className="text-center mb-12">
                    <span className="text-[0.65rem] md:text-xs uppercase tracking-[0.35em] text-sick-red font-bold block mb-2">
                        Real Reaction Videos
                    </span>
                    <h2
                        className="text-2xl sm:text-3xl md:text-5xl uppercase tracking-tight text-white font-black"
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        They're All Simping
                    </h2>
                </div>

                {/* Video Cards Grid / Carousel */}
                <div className="w-full flex flex-col items-center gap-6">
                    <div
                        ref={scrollRef}
                        className="w-full flex items-center gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory py-4 px-2 no-scrollbar"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                            WebkitOverflowScrolling: "touch",
                        }}
                    >
                        {cards.map((card, index) => (
                            <div
                                key={index}
                                className="snap-center shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-zinc-900"
                                style={{
                                    width: isMobile ? "75vw" : "280px",
                                    maxWidth: "320px",
                                    aspectRatio: "9/16",
                                }}
                            >
                                <video
                                    key={card.src}
                                    src={card.src}
                                    ref={(el) => setVideoRef(el, index)}
                                    playsInline
                                    muted
                                    loop
                                    autoPlay
                                    preload="auto"
                                    className="w-full h-full object-cover"
                                >
                                    <source src={card.src} type="video/mp4" />
                                </video>
                                {/* Name overlay */}
                                <div
                                    className="absolute bottom-0 left-0 right-0 p-4"
                                    style={{
                                        background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
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

                    {/* Dot indicators for mobile */}
                    {isMobile && (
                        <div className="flex items-center gap-2 mt-2">
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
                                        backgroundColor: i === activeCard ? "#DC2626" : "rgba(255,255,255,0.2)",
                                        border: "none",
                                        padding: 0,
                                        cursor: "pointer",
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;
