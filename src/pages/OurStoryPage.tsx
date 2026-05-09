import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Navbar from "../components/Navbar";
import FooterSection from "../sections/FooterSection";
import storyImg from "../assets/menu-img/story-menu.jpeg";
import mockupImg from "../assets/images/mockup-img.jpeg";

gsap.registerPlugin(ScrollTrigger);

const values = [
    {
        num: "01",
        title: "Real Science",
        desc: "Every compound is clinically studied. We don't guess — we engineer attraction with precision.",
    },
    {
        num: "02",
        title: "No Compromise",
        desc: "Premium ingredients. No artificial fillers. No watered-down formulas. S1CK is the real thing.",
    },
    {
        num: "03",
        title: "Confidence Bottled",
        desc: "We believe everyone deserves to walk into a room and be the one they remember. S1CK makes that happen.",
    },
];

const stats = [
    { stat: "6+", label: "Years Running" },
    { stat: "100K+", label: "Happy Customers" },
    { stat: "#1", label: "Rated Pheromone" },
    { stat: "6", label: "Signature Scents" },
];

const OurStoryPage = () => {
    const pageRef = useRef<HTMLDivElement>(null);
    const heroImgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        // Hero image reveal
        tl.fromTo(
            ".story-hero-img-wrap",
            { clipPath: "inset(100% 0 0 0)" },
            { clipPath: "inset(0% 0 0 0)", duration: 1.4 }
        );

        // Hero parallax
        if (heroImgRef.current) {
            gsap.to(heroImgRef.current, {
                yPercent: 15,
                ease: "none",
                scrollTrigger: {
                    trigger: ".story-hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });
        }

        // Title
        tl.fromTo(
            ".story-hero-title",
            { yPercent: 120 },
            { yPercent: 0, duration: 1.1 },
            "-=0.8"
        );

        // Subtitle line + text
        tl.fromTo(
            ".story-hero-line",
            { scaleX: 0 },
            { scaleX: 1, duration: 0.6, ease: "power2.out" },
            "-=0.5"
        );
        tl.fromTo(
            ".story-hero-sub",
            { opacity: 0, x: -15 },
            { opacity: 1, x: 0, duration: 0.6 },
            "-=0.3"
        );

        // Content blocks — scroll triggered
        gsap.utils.toArray<HTMLElement>(".story-block").forEach((block) => {
            gsap.fromTo(
                block,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: { trigger: block, start: "top 85%" },
                }
            );
        });

        // Mockup image clip-path reveal on scroll
        gsap.fromTo(
            ".mockup-reveal",
            { clipPath: "inset(0 100% 0 0)" },
            {
                clipPath: "inset(0 0% 0 0)",
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: { trigger: ".mockup-reveal", start: "top 80%" },
            }
        );

        // Mockup parallax
        gsap.to(".mockup-img", {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
                trigger: ".mockup-reveal",
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            },
        });

        // Values — staggered per card
        gsap.utils.toArray<HTMLElement>(".value-card").forEach((card, i) => {
            gsap.fromTo(
                card,
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1,
                    duration: 0.8,
                    delay: i * 0.12,
                    ease: "power3.out",
                    scrollTrigger: { trigger: card, start: "top 88%" },
                }
            );
        });

        // Stats — count-up (simple approach)
        gsap.utils.toArray<HTMLElement>(".stat-number").forEach((el) => {
            gsap.fromTo(
                el,
                { yPercent: 60, opacity: 0 },
                {
                    yPercent: 0, opacity: 1,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: { trigger: el, start: "top 90%" },
                }
            );
        });
    }, { scope: pageRef });

    // Value card hover
    const handleValueEnter = (e: React.MouseEvent | React.TouchEvent) => {
        const card = e.currentTarget as HTMLElement;
        gsap.to(card, { y: -6, duration: 0.35, ease: "power2.out" });
        gsap.to(card.querySelector(".value-line"), { scaleX: 1, duration: 0.4, ease: "power2.out" });
    };
    const handleValueLeave = (e: React.MouseEvent | React.TouchEvent) => {
        const card = e.currentTarget as HTMLElement;
        gsap.to(card, { y: 0, duration: 0.35, ease: "power3.out" });
        gsap.to(card.querySelector(".value-line"), { scaleX: 0, duration: 0.3, ease: "power2.in" });
    };

    return (
        <main ref={pageRef} className="bg-cream min-h-dvh">
            <Navbar />

            {/* Hero */}
            <section className="story-hero relative h-[75vh] w-full overflow-hidden">
                <div className="story-hero-img-wrap absolute inset-0">
                    <img
                        ref={heroImgRef}
                        src={storyImg}
                        alt="Our Story"
                        className="w-full h-[120%] object-cover absolute top-0 left-0"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/40 to-cream/5 z-10" />

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-14 z-20">
                    <div className="overflow-hidden">
                        <h1
                            className="story-hero-title text-charcoal text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight"
                            style={{ fontFamily: "Syne, sans-serif" }}
                        >
                            Our Story
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 mt-5">
                        <span className="story-hero-line block w-10 h-px bg-champagne origin-left" />
                        <p
                            className="story-hero-sub text-stone text-xs md:text-sm uppercase tracking-[0.25em]"
                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                        >
                            The science of being unforgettable
                        </p>
                    </div>
                </div>
            </section>

            {/* Origin */}
            <section className="px-6 md:px-14 py-24 max-w-5xl mx-auto">
                <div className="story-block">
                    <div className="flex items-center gap-4 mb-8">
                        <span className="block w-8 h-px bg-champagne" />
                        <p
                            className="text-champagne text-[0.6rem] uppercase tracking-[0.35em]"
                            style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}
                        >
                            The Beginning
                        </p>
                    </div>
                    <h2
                        className="text-charcoal text-3xl md:text-5xl font-bold uppercase tracking-tight leading-[1.1]"
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        Born from obsession.
                        <br />
                        Built to dominate.
                    </h2>
                    <p
                        className="text-stone text-sm md:text-base leading-[2] mt-8 max-w-2xl"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                    >
                        S1CK wasn't born in a boardroom. It started with a simple question — what if a scent could
                        do more than just smell good? What if it could change how people feel about you the moment
                        you walk in? We studied the science of pheromones, decoded what triggers attraction at a
                        biological level, and engineered fragrances that don't just turn heads — they own the room.
                    </p>
                </div>
            </section>

            {/* Mockup Image — clip reveal + parallax */}
            <section className="px-6 md:px-14 pb-10">
                <div className="mockup-reveal max-w-6xl mx-auto overflow-hidden">
                    <img
                        src={mockupImg}
                        alt="S1CK Products"
                        className="mockup-img w-full h-[50vh] md:h-[65vh] object-cover"
                    />
                </div>
            </section>

            {/* Philosophy */}
            <section className="px-6 md:px-14 py-24 max-w-5xl mx-auto">
                <div className="story-block">
                    <div className="flex items-center gap-4 mb-8">
                        <span className="block w-8 h-px bg-champagne" />
                        <p
                            className="text-champagne text-[0.6rem] uppercase tracking-[0.35em]"
                            style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}
                        >
                            Our Philosophy
                        </p>
                    </div>
                    <h2
                        className="text-charcoal text-3xl md:text-5xl font-bold uppercase tracking-tight leading-[1.1]"
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        Not a cologne.
                        <br />
                        A biological advantage.
                    </h2>
                    <p
                        className="text-stone text-sm md:text-base leading-[2] mt-8 max-w-2xl"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                    >
                        Every S1CK formula is synthesized from clinically studied compounds — androstenol,
                        androstenone, estratetraenol, and androstadienone — blended for maximum biological impact.
                        No artificial shortcuts. No watered-down knockoffs. Just pure pheromone science in a bottle,
                        designed to make you dangerously attractive.
                    </p>
                </div>
            </section>

            {/* Values */}
            <section className="px-6 md:px-14 py-24 bg-parchment">
                <div className="max-w-5xl mx-auto">
                    <div className="story-block mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <span className="block w-8 h-px bg-champagne" />
                            <p
                                className="text-champagne text-[0.6rem] uppercase tracking-[0.35em]"
                                style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}
                            >
                                What We Stand For
                            </p>
                        </div>
                        <h2
                            className="text-charcoal text-3xl md:text-5xl font-bold uppercase tracking-tight"
                            style={{ fontFamily: "Syne, sans-serif" }}
                        >
                            #StayDangerous
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 grid-cols-1 gap-10">
                        {values.map((item) => (
                            <div
                                key={item.title}
                                className="value-card bg-warm-white border border-ivory p-8 cursor-default"
                                onMouseEnter={handleValueEnter}
                                onMouseLeave={handleValueLeave}
                                onTouchStart={handleValueEnter}
                                onTouchEnd={handleValueLeave}
                            >
                                <span
                                    className="text-champagne/40 text-[0.6rem] tracking-[0.2em] block mb-5"
                                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                                >
                                    {item.num}
                                </span>
                                <h3
                                    className="text-charcoal text-base uppercase tracking-[0.12em] mb-4"
                                    style={{ fontFamily: "Syne, sans-serif", fontWeight: 700 }}
                                >
                                    {item.title}
                                </h3>
                                <p
                                    className="text-stone text-sm leading-[1.9]"
                                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                                >
                                    {item.desc}
                                </p>
                                {/* Hover accent line */}
                                <span className="value-line block w-full h-[2px] bg-champagne mt-6 origin-left scale-x-0" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="px-6 md:px-14 py-28">
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-4 grid-cols-2 gap-10">
                        {stats.map((item, i) => (
                            <div key={item.label} className="text-center">
                                <div className="overflow-hidden">
                                    <p
                                        className="stat-number text-charcoal text-4xl md:text-6xl font-bold"
                                        style={{ fontFamily: "Syne, sans-serif" }}
                                    >
                                        {item.stat}
                                    </p>
                                </div>
                                <span className="block w-6 h-px bg-champagne mx-auto mt-4 mb-3" />
                                <p
                                    className="text-stone text-[0.6rem] uppercase tracking-[0.25em]"
                                    style={{ fontFamily: "Syne, sans-serif", fontWeight: 500 }}
                                >
                                    {item.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <FooterSection />
        </main>
    );
};

export default OurStoryPage;
