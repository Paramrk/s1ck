import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Navbar from "../components/Navbar";
import FooterSection from "../sections/FooterSection";
import heroImg from "../assets/menu-img/story-menu.jpeg";

gsap.registerPlugin(ScrollTrigger);

const benefits = [
    {
        icon: "ri-vip-diamond-line",
        title: "Up to 35% Off",
        desc: "Exclusive member pricing on all S1CK products. The more you commit, the more you save.",
    },
    {
        icon: "ri-gift-line",
        title: "Monthly Drops",
        desc: "Premium fragrances delivered to your door every month. Never run out of your signature scent.",
    },
    {
        icon: "ri-lock-unlock-line",
        title: "Early Access",
        desc: "Be the first to cop limited-edition releases and exclusive collections before anyone else.",
    },
    {
        icon: "ri-star-line",
        title: "Members-Only Scents",
        desc: "Access exclusive formulations that will never hit the shelves. Only for the inner circle.",
    },
    {
        icon: "ri-truck-line",
        title: "Free Shipping",
        desc: "Every order ships free — no minimums, no catches. VIP means VIP.",
    },
    {
        icon: "ri-customer-service-line",
        title: "Priority Support",
        desc: "Skip the line. VIP members get dedicated support and faster response times.",
    },
];

const tiers = [
    {
        name: "Essential",
        price: "$49",
        period: "/month",
        features: ["1 signature scent monthly", "15% off all products", "Free shipping", "Early access drops"],
    },
    {
        name: "Elite",
        price: "$89",
        period: "/month",
        highlight: true,
        badge: "Most Popular",
        features: [
            "2 signature scents monthly",
            "25% off all products",
            "Free shipping",
            "Early access drops",
            "Members-only scents",
            "Priority support",
        ],
    },
    {
        name: "Obsessed",
        price: "$139",
        period: "/month",
        features: [
            "3 signature scents monthly",
            "35% off all products",
            "Free shipping",
            "Early access drops",
            "Members-only scents",
            "Priority support",
            "Exclusive merch drops",
        ],
    },
];

const VipClubPage = () => {
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

        // Hero image clip-path reveal
        tl.fromTo(
            ".vip-hero-img-wrap",
            { clipPath: "inset(100% 0 0 0)" },
            { clipPath: "inset(0% 0 0 0)", duration: 1.4 }
        );

        // Hero parallax
        if (heroImgRef.current) {
            gsap.to(heroImgRef.current, {
                yPercent: 15,
                ease: "none",
                scrollTrigger: {
                    trigger: ".vip-hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });
        }

        // Badge
        tl.fromTo(
            ".vip-hero-badge",
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.6 },
            "-=0.8"
        );

        // Title
        tl.fromTo(
            ".vip-hero-title",
            { yPercent: 120 },
            { yPercent: 0, duration: 1.1 },
            "-=0.5"
        );

        // Subtitle line + text
        tl.fromTo(
            ".vip-hero-line",
            { scaleX: 0 },
            { scaleX: 1, duration: 0.6, ease: "power2.out" },
            "-=0.5"
        );
        tl.fromTo(
            ".vip-hero-sub",
            { opacity: 0, x: -15 },
            { opacity: 1, x: 0, duration: 0.6 },
            "-=0.3"
        );

        // Benefit cards — staggered
        gsap.utils.toArray<HTMLElement>(".benefit-card").forEach((card, i) => {
            gsap.fromTo(
                card,
                { y: 50, opacity: 0, scale: 0.96 },
                {
                    y: 0, opacity: 1, scale: 1,
                    duration: 0.7,
                    delay: i * 0.08,
                    ease: "power3.out",
                    scrollTrigger: { trigger: card, start: "top 90%" },
                }
            );
        });

        // Tier cards — staggered
        gsap.fromTo(
            ".tier-card",
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: { trigger: ".tiers-grid", start: "top 80%" },
            }
        );

        // CTA section
        gsap.utils.toArray<HTMLElement>(".vip-block").forEach((block) => {
            gsap.fromTo(
                block,
                { y: 40, opacity: 0 },
                {
                    y: 0, opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: { trigger: block, start: "top 85%" },
                }
            );
        });
    }, { scope: pageRef });

    // Benefit card hover
    const handleBenefitEnter = (e: React.MouseEvent) => {
        const card = e.currentTarget as HTMLElement;
        const icon = card.querySelector(".benefit-icon") as HTMLElement;
        gsap.to(card, { y: -6, borderColor: "#c8ae82", duration: 0.35, ease: "power2.out" });
        if (icon) gsap.to(icon, { scale: 1.2, rotation: 5, duration: 0.35, ease: "power2.out" });
    };
    const handleBenefitLeave = (e: React.MouseEvent) => {
        const card = e.currentTarget as HTMLElement;
        const icon = card.querySelector(".benefit-icon") as HTMLElement;
        gsap.to(card, { y: 0, borderColor: "#e6e1d9", duration: 0.35, ease: "power3.out" });
        if (icon) gsap.to(icon, { scale: 1, rotation: 0, duration: 0.35, ease: "power3.out" });
    };

    // Tier card hover
    const handleTierEnter = (e: React.MouseEvent) => {
        const card = e.currentTarget as HTMLElement;
        gsap.to(card, { y: -8, duration: 0.4, ease: "power2.out" });
    };
    const handleTierLeave = (e: React.MouseEvent) => {
        const card = e.currentTarget as HTMLElement;
        gsap.to(card, { y: 0, duration: 0.4, ease: "power3.out" });
    };

    return (
        <main ref={pageRef} className="bg-cream min-h-dvh">
            <Navbar variant="light" />

            {/* Hero */}
            <section className="vip-hero relative h-[75vh] w-full overflow-hidden">
                <div className="vip-hero-img-wrap absolute inset-0">
                    <img
                        ref={heroImgRef}
                        src={heroImg}
                        alt="VIP Club"
                        className="w-full h-[120%] object-cover absolute top-0 left-0"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/50 to-charcoal/10 z-10" />

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-14 z-20">
                    {/* Badge */}
                    <div className="vip-hero-badge inline-flex items-center gap-2 border border-champagne/40 px-4 py-1.5 mb-6">
                        <i className="ri-vip-diamond-fill text-champagne text-xs" />
                        <span
                            className="text-champagne text-[0.55rem] uppercase tracking-[0.3em]"
                            style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}
                        >
                            Exclusive Access
                        </span>
                    </div>

                    <div className="overflow-hidden">
                        <h1
                            className="vip-hero-title text-cream text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight"
                            style={{ fontFamily: "Syne, sans-serif" }}
                        >
                            VIP Club
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 mt-5">
                        <span className="vip-hero-line block w-10 h-px bg-champagne origin-left" />
                        <p
                            className="vip-hero-sub text-cream/50 text-xs md:text-sm uppercase tracking-[0.25em]"
                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                        >
                            Premium fragrances. Exclusive perks. Inner circle only.
                        </p>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="px-6 md:px-14 py-28">
                <div className="max-w-5xl mx-auto">
                    <div className="vip-block mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <span className="block w-8 h-px bg-champagne" />
                            <p
                                className="text-champagne text-[0.6rem] uppercase tracking-[0.35em]"
                                style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}
                            >
                                Why Join
                            </p>
                        </div>
                        <h2
                            className="text-charcoal text-3xl md:text-5xl font-bold uppercase tracking-tight leading-[1.1]"
                            style={{ fontFamily: "Syne, sans-serif" }}
                        >
                            Perks that hit
                            <br />
                            different.
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 grid-cols-1 gap-8">
                        {benefits.map((b, i) => (
                            <div
                                key={b.title}
                                className="benefit-card border border-ivory bg-warm-white p-8 cursor-default"
                                onMouseEnter={handleBenefitEnter}
                                onMouseLeave={handleBenefitLeave}
                            >
                                <span
                                    className="text-taupe/30 text-[0.55rem] tracking-[0.2em] block mb-4"
                                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                                >
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <i className={`benefit-icon ${b.icon} text-champagne text-2xl mb-5 block`} />
                                <h3
                                    className="text-charcoal text-sm uppercase tracking-[0.12em] mb-3"
                                    style={{ fontFamily: "Syne, sans-serif", fontWeight: 700 }}
                                >
                                    {b.title}
                                </h3>
                                <p
                                    className="text-stone text-sm leading-[1.8]"
                                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                                >
                                    {b.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Tiers */}
            <section className="px-6 md:px-14 py-28 bg-parchment">
                <div className="max-w-5xl mx-auto">
                    <div className="vip-block text-center mb-16">
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <span className="block w-8 h-px bg-champagne" />
                            <p
                                className="text-champagne text-[0.6rem] uppercase tracking-[0.35em]"
                                style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}
                            >
                                Choose Your Tier
                            </p>
                            <span className="block w-8 h-px bg-champagne" />
                        </div>
                        <h2
                            className="text-charcoal text-3xl md:text-5xl font-bold uppercase tracking-tight"
                            style={{ fontFamily: "Syne, sans-serif" }}
                        >
                            Unlock VIP Status
                        </h2>
                    </div>

                    <div className="tiers-grid grid md:grid-cols-3 grid-cols-1 gap-6">
                        {tiers.map((tier) => (
                            <div
                                key={tier.name}
                                className={`tier-card p-8 flex flex-col relative ${
                                    tier.highlight
                                        ? "bg-charcoal text-cream border border-charcoal"
                                        : "bg-warm-white text-charcoal border border-ivory"
                                }`}
                                onMouseEnter={handleTierEnter}
                                onMouseLeave={handleTierLeave}
                            >
                                {/* Popular badge */}
                                {tier.badge && (
                                    <span
                                        className="absolute -top-3 left-8 bg-champagne text-charcoal text-[0.5rem] uppercase tracking-[0.2em] px-3 py-1"
                                        style={{ fontFamily: "Syne, sans-serif", fontWeight: 700 }}
                                    >
                                        {tier.badge}
                                    </span>
                                )}

                                <p
                                    className="text-champagne text-[0.6rem] uppercase tracking-[0.25em] mb-2"
                                    style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}
                                >
                                    {tier.name}
                                </p>
                                <div className="flex items-baseline gap-1 mb-3">
                                    <span
                                        className="text-4xl md:text-5xl font-bold"
                                        style={{ fontFamily: "Syne, sans-serif" }}
                                    >
                                        {tier.price}
                                    </span>
                                    <span
                                        className={`text-sm ${tier.highlight ? "text-cream/40" : "text-stone"}`}
                                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                                    >
                                        {tier.period}
                                    </span>
                                </div>

                                {/* Divider */}
                                <span className={`block w-full h-px mb-8 ${tier.highlight ? "bg-cream/10" : "bg-ivory"}`} />

                                <ul className="flex-1 space-y-4 mb-10">
                                    {tier.features.map((f) => (
                                        <li key={f} className="flex items-start gap-3">
                                            <i className="ri-check-line text-champagne text-base mt-0.5 flex-shrink-0" />
                                            <span
                                                className={`text-sm ${tier.highlight ? "text-cream/70" : "text-stone"}`}
                                                style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                                            >
                                                {f}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className={`w-full py-3.5 uppercase md:text-[0.55rem] text-[0.65rem] font-medium tracking-[0.2em] transition-all duration-500 cursor-pointer ${
                                        tier.highlight
                                            ? "bg-cream text-charcoal hover:bg-champagne"
                                            : "bg-charcoal text-cream hover:bg-slate"
                                    }`}
                                    style={{ fontFamily: "Syne, sans-serif" }}
                                >
                                    Join {tier.name}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 md:px-14 py-28">
                <div className="max-w-3xl mx-auto text-center vip-block">
                    <h2
                        className="text-charcoal text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4"
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        Stay Dangerous.
                    </h2>
                    <span className="block w-10 h-px bg-champagne mx-auto mb-8" />
                    <p
                        className="text-stone text-sm md:text-base leading-[2] mb-12 max-w-xl mx-auto"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                    >
                        Join 100,000+ people who refuse to be forgettable. Drop alerts. Early access. S1CK content.
                        No spam — we're not that basic.
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-transparent border border-ivory px-6 py-3.5 text-sm text-charcoal w-72 focus:outline-none focus:border-champagne transition-colors placeholder:text-taupe"
                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 300, letterSpacing: "0.03em" }}
                        />
                        <button className="sick-btn-filled">
                            Get VIP Access
                        </button>
                    </div>
                </div>
            </section>

            <FooterSection />
        </main>
    );
};

export default VipClubPage;
