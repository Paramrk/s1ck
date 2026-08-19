import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Navbar from "../components/Navbar";
import FooterSection from "../sections/FooterSection";
import { getImage } from "../utils/media";
import { useScrollTriggerRefresh } from "../hooks/useScrollTriggerRefresh";

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        num: "01",
        title: "Apply",
        desc: "Tell us about your store, volume needs, and market. We review every wholesale partner.",
    },
    {
        num: "02",
        title: "Get Approved",
        desc: "Receive your wholesale catalog, tier pricing, and a dedicated account contact.",
    },
    {
        num: "03",
        title: "Order & Restock",
        desc: "Place bulk orders with priority restock access and fast fulfillment support.",
    },
];

const benefits = [
    {
        icon: "ri-price-tag-3-line",
        title: "Bulk Pricing",
        desc: "Tiered wholesale rates designed for retailers who move volume.",
    },
    {
        icon: "ri-truck-line",
        title: "Fast Fulfillment",
        desc: "Reliable shipping and restock windows so your shelves stay full.",
    },
    {
        icon: "ri-store-2-line",
        title: "Retail-Ready",
        desc: "Premium packaging and proven bestsellers your customers already want.",
    },
    {
        icon: "ri-bar-chart-box-line",
        title: "Margin Support",
        desc: "Structured pricing that protects your margins and scales with order size.",
    },
    {
        icon: "ri-customer-service-2-line",
        title: "Account Team",
        desc: "Direct support for reorders, launches, and regional opportunities.",
    },
    {
        icon: "ri-shield-check-line",
        title: "Brand Credibility",
        desc: "Seven years recognized as a top pheromone brand — easy to sell in-store.",
    },
];

const WholesalerPage = () => {
    const pageRef = useRef<HTMLDivElement>(null);
    const heroImgRef = useRef<HTMLImageElement>(null);
    useScrollTriggerRefresh();

    useEffect(() => {
        window.scrollTo(0, 0);
        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.fromTo(
            ".wholesaler-hero-img-wrap",
            { clipPath: "inset(100% 0 0 0)" },
            { clipPath: "inset(0% 0 0 0)", duration: 1.4 },
        );

        if (heroImgRef.current) {
            gsap.to(heroImgRef.current, {
                scale: 1.08,
                ease: "none",
                scrollTrigger: {
                    trigger: ".wholesaler-hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });
        }

        tl.from(
            [
                ".wholesaler-hero-headline",
                ".wholesaler-hero-tagline",
                ".wholesaler-hero-title",
                ".wholesaler-hero-cta",
            ],
            { y: 40, opacity: 0, duration: 0.9, stagger: 0.12 },
            "-=0.6",
        );

        gsap.utils.toArray<HTMLElement>(".wholesaler-step").forEach((step, i) => {
            gsap.from(step, {
                y: 50,
                opacity: 0,
                duration: 0.7,
                delay: i * 0.05,
                ease: "power2.out",
                scrollTrigger: { trigger: step, start: "top 88%" },
            });
        });

        gsap.from(".wholesaler-benefit-card", {
            y: 40,
            opacity: 0,
            stagger: 0.08,
            duration: 0.65,
            ease: "power2.out",
            scrollTrigger: { trigger: ".wholesaler-benefits-grid", start: "top 85%" },
        });

        gsap.from(".wholesaler-cta-block", {
            y: 36,
            opacity: 0,
            duration: 0.75,
            ease: "power2.out",
            scrollTrigger: { trigger: ".wholesaler-cta-block", start: "top 88%" },
        });
    }, []);

    const wholesaleDesktop = getImage("wholesale-desktop.jpg");
    const wholesaleMobile = getImage("wholesale-mobile.jpg");

    return (
        <main ref={pageRef} className="wholesaler-page bg-cream min-h-dvh">
            <Navbar variant="light" />

            <section className="wholesaler-hero relative isolate min-h-[min(100dvh,920px)] w-full overflow-hidden">
                <div className="wholesaler-hero-img-wrap absolute inset-0 z-0">
                    <picture>
                        <source media="(max-width: 768px)" srcSet={wholesaleMobile} />
                        <img
                            ref={heroImgRef}
                            src={wholesaleDesktop}
                            alt="S1CK Wholesale Agreement & Partnership"
                            className="h-full w-full object-cover object-center"
                        />
                    </picture>
                    <div className="absolute inset-0 bg-black/55" />
                </div>

                <div className="wholesaler-hero-content relative z-10 mx-auto flex min-h-[min(100dvh,920px)] w-full max-w-5xl flex-col justify-end px-6 pb-12 pt-28 md:px-14 md:pb-16 md:pt-32">
                    <p
                        className="wholesaler-hero-headline text-champagne text-[0.65rem] uppercase tracking-[0.28em] md:text-xs"
                        style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}
                    >
                        Wholesale Program
                    </p>

                    <h1
                        className="wholesaler-hero-tagline mt-4 text-cream text-[clamp(1.75rem,5.5vw,2.75rem)] font-bold leading-[1.1] tracking-tight md:mt-5 md:text-5xl"
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        Be a Wholesaler
                    </h1>

                    <p
                        className="wholesaler-hero-title mt-4 max-w-3xl text-cream/90 text-[clamp(1.05rem,3.2vw,1.35rem)] leading-snug md:mt-5 md:text-2xl"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                    >
                        Stock S1CK pheromone fragrances in bulk with competitive pricing,
                        priority restock, and dedicated account support.
                    </p>

                    <a
                        href="mailto:wholesale@s1ck.com?subject=S1CK%20Wholesale%20Application"
                        className="wholesaler-hero-cta mt-8 inline-flex w-fit items-center gap-2 bg-cream px-8 py-3.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-charcoal transition-opacity hover:opacity-85 md:mt-10 md:px-10 md:py-4 md:text-[0.7rem]"
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        Apply for Wholesale <span aria-hidden>&rarr;</span>
                    </a>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-16 md:px-14 md:py-24">
                <p
                    className="text-[0.65rem] uppercase tracking-[0.28em] text-taupe"
                    style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}
                >
                    How It Works
                </p>
                <h2
                    className="mt-3 text-3xl font-bold uppercase tracking-tight text-charcoal md:text-4xl"
                    style={{ fontFamily: "Syne, sans-serif" }}
                >
                    Partner in Three Steps
                </h2>

                <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-3 md:gap-10">
                    {steps.map((step) => (
                        <article key={step.num} className="wholesaler-step border-t border-ivory pt-6">
                            <p
                                className="text-champagne text-sm tracking-[0.2em]"
                                style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}
                            >
                                {step.num}
                            </p>
                            <h3
                                className="mt-3 text-xl font-bold uppercase text-charcoal md:text-2xl"
                                style={{ fontFamily: "Syne, sans-serif" }}
                            >
                                {step.title}
                            </h3>
                            <p
                                className="mt-3 text-sm leading-relaxed text-stone md:text-base"
                                style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                            >
                                {step.desc}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="border-t border-ivory bg-parchment/40 px-6 py-16 md:px-14 md:py-24">
                <div className="mx-auto max-w-6xl">
                    <p
                        className="text-[0.65rem] uppercase tracking-[0.28em] text-taupe"
                        style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}
                    >
                        Why S1CK Wholesale
                    </p>
                    <h2
                        className="mt-3 text-3xl font-bold uppercase tracking-tight text-charcoal md:text-4xl"
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        Built for Retailers
                    </h2>

                    <div className="wholesaler-benefits-grid mt-10 grid gap-6 md:mt-14 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
                        {benefits.map((benefit) => (
                            <article
                                key={benefit.title}
                                className="wholesaler-benefit-card border border-ivory bg-cream p-6 md:p-8"
                            >
                                <i className={`${benefit.icon} text-2xl text-champagne`} aria-hidden />
                                <h3
                                    className="mt-4 text-lg font-bold uppercase text-charcoal md:text-xl"
                                    style={{ fontFamily: "Syne, sans-serif" }}
                                >
                                    {benefit.title}
                                </h3>
                                <p
                                    className="mt-3 text-sm leading-relaxed text-stone"
                                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                                >
                                    {benefit.desc}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 pb-20 pt-4 md:px-14 md:pb-28">
                <div className="wholesaler-cta-block mx-auto max-w-2xl border border-charcoal bg-charcoal px-8 py-12 text-center text-cream md:py-16">
                    <h2
                        className="text-2xl font-bold uppercase tracking-tight md:text-3xl"
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        Ready to Stock S1CK?
                    </h2>
                    <p
                        className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-cream/70 md:text-base"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                    >
                        Send us your business details and we&apos;ll get back to you with
                        wholesale pricing and next steps.
                    </p>
                    <a
                        href="mailto:wholesale@s1ck.com?subject=S1CK%20Wholesale%20Application"
                        className="mt-8 inline-flex items-center gap-2 bg-cream px-8 py-3.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-charcoal transition-opacity hover:opacity-85 md:px-10 md:py-4 md:text-[0.7rem]"
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        Contact Wholesale Team <span aria-hidden>&rarr;</span>
                    </a>
                </div>
            </section>

            <FooterSection hideWholesalerTeaser />
        </main>
    );
};

export default WholesalerPage;
