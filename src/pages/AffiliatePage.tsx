import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Navbar from "../components/Navbar";
import FooterSection from "../sections/FooterSection";
import heroImg from "../assets/menu-img/shop-menu.webp";
import { useScrollTriggerRefresh } from "../hooks/useScrollTriggerRefresh";

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        num: "01",
        title: "Apply",
        desc: "Tell us about your audience — TikTok, campus, blog, or your own channel. We review every partner.",
    },
    {
        num: "02",
        title: "Get Your Link",
        desc: "Approved partners receive a custom tracking link and access to creative assets.",
    },
    {
        num: "03",
        title: "Share & Earn",
        desc: "Promote S1CK scents. Earn commission on every qualifying sale you refer.",
    },
];

const benefits = [
    {
        icon: "ri-money-dollar-circle-line",
        title: "10% Cash Back",
        desc: "Earn 10% on every qualifying order you refer. Free to join — no fees, no hidden catches.",
    },
    {
        icon: "ri-image-line",
        title: "Creator Assets",
        desc: "Product shots, hooks, and brand guidelines so your content looks sharp and converts.",
    },
    {
        icon: "ri-dashboard-3-line",
        title: "Live Dashboard",
        desc: "Track clicks, conversions, and payouts in real time — no guessing games.",
    },
    {
        icon: "ri-gift-2-line",
        title: "Early Drops",
        desc: "Partners get first look at launches and limited runs before the public.",
    },
    {
        icon: "ri-team-line",
        title: "Dedicated Support",
        desc: "A real partner team for questions, custom codes, and campaign ideas.",
    },
    {
        icon: "ri-calendar-check-line",
        title: "Monthly Payouts",
        desc: "Reliable payouts once you hit the minimum threshold. Simple, transparent, on time.",
    },
];

const faqs = [
    {
        q: "Who can join?",
        a: "Creators, campus reps, micro-influencers, and anyone with an engaged audience that fits the S1CK brand.",
    },
    {
        q: "How much can I earn?",
        a: "You earn 10% cash back on every qualifying sale made through your referral link. It's free to join.",
    },
    {
        q: "When do I get paid?",
        a: "Payouts are processed monthly for all earnings above the minimum threshold once orders are confirmed.",
    },
];

const AffiliatePage = () => {
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
            ".affiliate-hero-img-wrap",
            { clipPath: "inset(100% 0 0 0)" },
            { clipPath: "inset(0% 0 0 0)", duration: 1.4 }
        );

        if (heroImgRef.current) {
            gsap.to(heroImgRef.current, {
                scale: 1.08,
                ease: "none",
                scrollTrigger: {
                    trigger: ".affiliate-hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });
        }

        tl.fromTo(
            ".affiliate-hero-headline",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6 },
            "-=0.6"
        );

        tl.fromTo(
            ".affiliate-hero-tagline",
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.75 },
            "-=0.4"
        );

        tl.fromTo(
            ".affiliate-hero-title",
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 0.85 },
            "-=0.45"
        );

        tl.fromTo(
            ".affiliate-hero-cta",
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.6 },
            "-=0.35"
        );

        gsap.utils.toArray<HTMLElement>(".affiliate-step").forEach((step, i) => {
            gsap.fromTo(
                step,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    delay: i * 0.06,
                    ease: "power3.out",
                    scrollTrigger: { trigger: step, start: "top 90%" },
                }
            );
        });

        gsap.fromTo(
            ".affiliate-benefit-card",
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.7,
                stagger: 0.08,
                ease: "power3.out",
                scrollTrigger: { trigger: ".affiliate-benefits-grid", start: "top 85%" },
            }
        );

        gsap.utils.toArray<HTMLElement>(".affiliate-faq-item").forEach((item) => {
            gsap.fromTo(
                item,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: { trigger: item, start: "top 92%" },
                }
            );
        });

        gsap.fromTo(
            ".affiliate-cta-block",
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: { trigger: ".affiliate-cta-block", start: "top 88%" },
            }
        );
    }, { scope: pageRef });

    return (
        <main ref={pageRef} className="affiliate-page bg-cream min-h-dvh">
            <Navbar />

            <section className="affiliate-hero relative isolate min-h-[min(100dvh,920px)] w-full overflow-hidden">
                <div className="affiliate-hero-img-wrap absolute inset-0 z-0">
                    <img
                        ref={heroImgRef}
                        src={heroImg}
                        alt="S1CK Affiliate Program"
                        loading="eager"
                        decoding="async"
                        className="h-full w-full object-cover"
                    />
                </div>
                <div
                    className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-charcoal via-charcoal/55 to-charcoal/25"
                    aria-hidden
                />

                <div className="affiliate-hero-content relative z-10 mx-auto flex min-h-[min(100dvh,920px)] w-full max-w-5xl flex-col justify-end px-6 pb-12 pt-28 md:px-14 md:pb-16 md:pt-32">
                    <p
                        className="affiliate-hero-headline text-champagne text-[0.65rem] uppercase tracking-[0.28em] md:text-xs"
                        style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}
                    >
                        Partner Program
                    </p>

                    <h1
                        className="affiliate-hero-tagline mt-4 text-cream text-[clamp(1.75rem,5.5vw,2.75rem)] font-bold leading-[1.1] tracking-tight md:mt-5 md:text-5xl"
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        Refer a friend and get paid!
                    </h1>

                    <p
                        className="affiliate-hero-title mt-4 max-w-3xl text-cream/90 text-[clamp(1.05rem,3.2vw,1.35rem)] leading-snug md:mt-5 md:text-2xl"
                        style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}
                    >
                        Join Our Affiliate Program Free &amp; Earn 10% Cash Back
                    </p>

                    <a
                        href="mailto:affiliates@s1ck.com?subject=S1CK%20Affiliate%20Application"
                        className="affiliate-hero-cta mt-8 inline-flex w-fit items-center gap-2 bg-cream px-8 py-3.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-charcoal transition-opacity hover:opacity-85 md:mt-10 md:px-10 md:py-4 md:text-[0.7rem]"
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        Join Free <span aria-hidden>&rarr;</span>
                    </a>
                </div>
            </section>

            <section className="relative z-10 bg-cream px-6 md:px-14 py-20 md:py-28 max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-12 md:mb-16">
                    <span className="block w-10 h-px bg-champagne" />
                    <p
                        className="text-champagne text-[0.6rem] uppercase tracking-[0.35em]"
                        style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}
                    >
                        How It Works
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-10 md:gap-8">
                    {steps.map((step) => (
                        <article key={step.num} className="affiliate-step border-t border-ivory pt-6">
                            <p
                                className="text-taupe text-[0.65rem] tracking-[0.25em] mb-3"
                                style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                            >
                                {step.num}
                            </p>
                            <h2
                                className="text-charcoal text-xl md:text-2xl font-bold uppercase tracking-tight mb-3"
                                style={{ fontFamily: "Syne, sans-serif" }}
                            >
                                {step.title}
                            </h2>
                            <p
                                className="text-stone text-sm leading-relaxed"
                                style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                            >
                                {step.desc}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="relative z-10 bg-warm-white border-y border-ivory px-6 md:px-14 py-20 md:py-28">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14 md:mb-16">
                        <h2
                            className="text-charcoal text-3xl md:text-5xl font-bold uppercase tracking-tight"
                            style={{ fontFamily: "Syne, sans-serif" }}
                        >
                            Partner Perks
                        </h2>
                        <p
                            className="text-stone text-sm md:text-base mt-4 max-w-lg mx-auto"
                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                        >
                            Everything you need to promote with confidence and scale your earnings.
                        </p>
                    </div>

                    <div className="affiliate-benefits-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {benefits.map((b) => (
                            <div
                                key={b.title}
                                className="affiliate-benefit-card border border-ivory bg-cream p-6 md:p-8"
                            >
                                <i className={`${b.icon} text-2xl text-champagne mb-4 block`} aria-hidden />
                                <h3
                                    className="text-charcoal text-sm uppercase tracking-[0.12em] font-bold mb-2"
                                    style={{ fontFamily: "Syne, sans-serif" }}
                                >
                                    {b.title}
                                </h3>
                                <p
                                    className="text-stone text-sm leading-relaxed"
                                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                                >
                                    {b.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative z-10 bg-cream px-6 md:px-14 py-20 md:py-28 max-w-3xl mx-auto">
                <h2
                    className="text-charcoal text-2xl md:text-4xl font-bold uppercase tracking-tight text-center mb-10 md:mb-14"
                    style={{ fontFamily: "Syne, sans-serif" }}
                >
                    FAQ
                </h2>
                <div className="space-y-8">
                    {faqs.map((item) => (
                        <div key={item.q} className="affiliate-faq-item border-b border-ivory pb-8">
                            <h3
                                className="text-charcoal text-sm uppercase tracking-[0.1em] font-bold mb-2"
                                style={{ fontFamily: "Syne, sans-serif" }}
                            >
                                {item.q}
                            </h3>
                            <p
                                className="text-stone text-sm leading-relaxed"
                                style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                            >
                                {item.a}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="relative z-10 bg-cream px-6 md:px-14 pb-20 md:pb-28">
                <div className="affiliate-cta-block max-w-2xl mx-auto text-center border border-charcoal bg-charcoal text-cream px-8 py-12 md:py-16">
                    <h2
                        className="text-2xl md:text-4xl font-bold uppercase tracking-tight"
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        Ready to partner?
                    </h2>
                    <p
                        className="text-cream/60 text-sm mt-4 mb-8 max-w-md mx-auto"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                    >
                        Applications are open. Drop your details and we&apos;ll get back within 48 hours.
                    </p>
                    <a
                        href="mailto:affiliates@s1ck.com?subject=S1CK%20Affiliate%20Application"
                        className="inline-flex items-center gap-2 bg-cream text-charcoal px-10 py-4 text-[0.65rem] uppercase tracking-[0.2em] font-bold hover:opacity-85 transition-opacity"
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        Apply Now <span aria-hidden>&rarr;</span>
                    </a>
                </div>
            </section>

            <FooterSection hideAffiliateTeaser />
        </main>
    );
};

export default AffiliatePage;
