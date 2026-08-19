import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import FooterSection from "../sections/FooterSection";
import affiliateMobile from "../assets/images/affiliate-mobile.jpg";
import affiliateDesktop from "../assets/images/affiliate-desktop.png";
import { resolveShopifyAssetUrl } from "../utils/media";

const resolvedMobile = resolveShopifyAssetUrl(affiliateMobile);
const resolvedDesktop = resolveShopifyAssetUrl(affiliateDesktop);

const threePillars = [
    {
        icon: "ri-links-line",
        title: "Share Your Unique Link",
        desc: "Get your custom tracking link and exclusive discount code to share with your audience across TikTok, Instagram, YouTube, or campus.",
    },
    {
        icon: "ri-group-line",
        title: "Friends & Followers Shop",
        desc: "Your audience receives a VIP discount on luxury S1CK pheromone fragrances with an extended 30-day cookie attribution window.",
    },
    {
        icon: "ri-money-dollar-circle-line",
        title: "Earn Commissions on Every Sale",
        desc: "Receive generous 10%–20% cash payouts on every qualifying order, with real-time conversion tracking and prompt monthly payouts.",
    },
];

const featurePills = [
    "Competitive Commissions",
    "30 Day Cookie Window",
    "Real Time Tracking",
    "Marketing Support",
];

const perks = [
    {
        icon: "ri-copper-diamond-line",
        title: "Free Creator PR Packages",
        desc: "Top active affiliates receive complimentary S1CK full-size bottles and pre-release fragrances for content creation.",
    },
    {
        icon: "ri-dashboard-2-line",
        title: "Real-Time Live Dashboard",
        desc: "Track clicks, orders, pending commissions, and historical payouts with crystal clear analytics.",
    },
    {
        icon: "ri-user-star-line",
        title: "Dedicated Partner Support",
        desc: "Direct access to our affiliate managers for custom discount codes, creative assets, and campaign ideas.",
    },
    {
        icon: "ri-calendar-check-line",
        title: "Guaranteed Monthly Payouts",
        desc: "Direct deposit / PayPal payouts processed on time every month once minimum payout is met.",
    },
];

const faqs = [
    {
        q: "Who is eligible to join the S1CK Affiliate Program?",
        a: "We welcome creators, fragrance influencers, lifestyle personalities, students, and anyone with an engaged audience looking to earn by promoting luxury pheromone scents.",
    },
    {
        q: "How much commission do I earn?",
        a: "Standard partners earn 10% cash commission per order. High-volume creators can unlock up to 20% commission plus monthly bonus incentives.",
    },
    {
        q: "How does tracking work?",
        a: "We use a 30-day tracking cookie window. If someone clicks your link and purchases anytime within 30 days, you get full credit for the sale.",
    },
    {
        q: "Is there any cost to join?",
        a: "No, joining the S1CK Partner Program is 100% free with no minimum sales quotas or hidden fees.",
    },
];

const AffiliatePage: React.FC = () => {
    const formSectionRef = useRef<HTMLDivElement>(null);
    const [ordersCount, setOrdersCount] = useState<number>(40);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, []);

    const scrollToForm = () => {
        formSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 600);
    };

    // Calculate estimated earnings (Average S1CK order ~$120 at 15% commission)
    const avgOrderValue = 120;
    const commissionRate = ordersCount >= 80 ? 0.18 : ordersCount >= 40 ? 0.15 : 0.12;
    const monthlyEarnings = Math.round(ordersCount * avgOrderValue * commissionRate);
    const annualEarnings = monthlyEarnings * 12;

    return (
        <main className="affiliate-page bg-[#080505] text-[#faf7f2] min-h-dvh flex flex-col justify-between">
            <Navbar />

            <div className="w-full pt-16 md:pt-20">
                {/* ── Exact Visual Poster Banner (Mobile & Desktop) ────────── */}
                <section className="affiliate-banner-wrap relative w-full overflow-hidden bg-black">
                    {/* Mobile Poster */}
                    <div className="block md:hidden w-full relative">
                        <img
                            src={resolvedMobile}
                            alt="Become an Affiliate - S1CK Fragrances"
                            width={576}
                            height={1024}
                            loading="eager"
                            decoding="async"
                            className="w-full h-auto object-cover object-center"
                        />
                        <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-center z-10">
                            <button
                                type="button"
                                onClick={scrollToForm}
                                className="w-full py-4 rounded-full bg-gradient-to-r from-red-700 via-sick-red to-red-700 text-white font-black uppercase text-xs tracking-[0.2em] shadow-[0_0_35px_rgba(220,38,38,0.8)] border border-red-400/50 hover:scale-105 active:scale-95 transition-transform"
                                style={{ fontFamily: "Syne, sans-serif" }}
                            >
                                Join Now &amp; Start Earning Today
                            </button>
                        </div>
                    </div>

                    {/* Desktop Poster */}
                    <div className="hidden md:block w-full max-w-[1920px] mx-auto relative">
                        <img
                            src={resolvedDesktop}
                            alt="Become an Affiliate - S1CK Fragrances"
                            width={1024}
                            height={576}
                            loading="eager"
                            decoding="async"
                            className="w-full h-auto object-cover object-center"
                        />
                        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10">
                            <button
                                type="button"
                                onClick={scrollToForm}
                                className="px-12 py-4 rounded-full bg-gradient-to-r from-red-700 via-sick-red to-red-700 text-white font-black uppercase text-sm tracking-[0.22em] shadow-[0_0_40px_rgba(220,38,38,0.85)] border border-red-400/60 hover:scale-105 active:scale-95 transition-transform"
                                style={{ fontFamily: "Syne, sans-serif" }}
                            >
                                Join Now &amp; Start Earning Today
                            </button>
                        </div>
                    </div>
                </section>

                {/* ── 4 Feature Badges Bar ─────────────────────────────────── */}
                <section className="relative z-10 px-4 md:px-8 py-6 bg-[#120808] border-y border-[#331414]">
                    <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center md:justify-between gap-3 md:gap-4">
                        {featurePills.map((pill) => (
                            <div
                                key={pill}
                                className="px-5 md:px-6 py-2.5 rounded-full border border-sick-red/50 bg-sick-red/15 text-white text-xs font-bold uppercase tracking-[0.16em] flex items-center gap-2.5 shadow-[0_0_15px_rgba(220,38,38,0.25)]"
                                style={{ fontFamily: "Syne, sans-serif" }}
                            >
                                <span className="w-2 h-2 rounded-full bg-sick-red animate-pulse" />
                                <span>{pill}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── The 3 Core Pillars ───────────────────────────────────── */}
                <section className="relative z-10 px-5 md:px-12 lg:px-16 py-14 md:py-24 max-w-6xl mx-auto">
                    <div className="text-center mb-12 md:mb-16">
                        <span className="text-sick-red text-xs uppercase tracking-[0.3em] font-bold block mb-2">
                            Simple 3-Step Process
                        </span>
                        <h2
                            className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white"
                            style={{ fontFamily: "Syne, sans-serif" }}
                        >
                            How You Make Money
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {threePillars.map((p, i) => (
                            <div
                                key={p.title}
                                className="relative p-7 md:p-9 rounded-2xl border border-[#3b1818] bg-[#160c0c] hover:border-sick-red transition-all duration-300 hover:-translate-y-1 shadow-[0_12px_32px_rgba(0,0,0,0.7)]"
                            >
                                <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sick-red/20 border border-sick-red/50 text-sick-red text-2xl mb-6 shadow-[0_0_20px_rgba(220,38,38,0.35)]">
                                    <i className={p.icon} aria-hidden="true" />
                                </span>
                                <span className="block text-sick-red text-xs font-mono font-bold mb-2 tracking-widest">
                                    STEP 0{i + 1}
                                </span>
                                <h3
                                    className="text-lg md:text-xl font-bold text-white uppercase tracking-wider mb-3 leading-snug"
                                    style={{ fontFamily: "Syne, sans-serif" }}
                                >
                                    {p.title}
                                </h3>
                                <p className="text-[#ded1d1] text-xs md:text-sm leading-relaxed font-normal">
                                    {p.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Interactive Commission Earnings Calculator ───────────── */}
                <section className="relative z-10 px-5 md:px-12 lg:px-16 py-14 md:py-24 border-y border-[#331414] bg-[#0f0707]">
                    <div className="max-w-4xl mx-auto p-6 md:p-12 rounded-3xl border border-[#4a1c1c] bg-[#190c0c] shadow-2xl">
                        <div className="text-center mb-10">
                            <span className="text-sick-red text-xs uppercase tracking-[0.25em] font-bold block mb-2">
                                Live Earnings Projection
                            </span>
                            <h3
                                className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white"
                                style={{ fontFamily: "Syne, sans-serif" }}
                            >
                                Estimate Your Monthly Cash Payout
                            </h3>
                            <p className="text-[#ded1d1] text-xs md:text-sm mt-2 max-w-lg mx-auto font-normal">
                                Slide to calculate your potential commission based on monthly referred orders.
                            </p>
                        </div>

                        <div className="space-y-7">
                            <div>
                                <div className="flex justify-between items-center text-xs md:text-sm uppercase tracking-wider font-bold mb-3">
                                    <span className="text-white">Monthly Orders Referred:</span>
                                    <span className="text-sick-red font-mono text-lg md:text-xl font-black">{ordersCount} Orders</span>
                                </div>
                                <input
                                    type="range"
                                    min={5}
                                    max={250}
                                    step={5}
                                    value={ordersCount}
                                    onChange={(e) => setOrdersCount(Number(e.target.value))}
                                    className="w-full h-3 bg-[#331414] rounded-lg appearance-none cursor-pointer accent-sick-red"
                                />
                                <div className="flex justify-between text-xs text-[#a89595] mt-2 font-medium">
                                    <span>5 Orders</span>
                                    <span>100 Orders</span>
                                    <span>250+ Orders</span>
                                </div>
                            </div>

                            {/* Results Box */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6 border-t border-[#3d1919]">
                                <div className="p-5 rounded-2xl bg-[#130707] border border-[#3d1919] text-center">
                                    <span className="text-[#a89595] text-xs uppercase tracking-wider block mb-1 font-bold">
                                        Commission Rate
                                    </span>
                                    <span
                                        className="text-white text-2xl md:text-3xl font-black"
                                        style={{ fontFamily: "Syne, sans-serif" }}
                                    >
                                        {(commissionRate * 100).toFixed(0)}%
                                    </span>
                                </div>

                                <div className="p-5 rounded-2xl bg-sick-red/15 border border-sick-red/40 text-center shadow-[0_0_25px_rgba(220,38,38,0.25)]">
                                    <span className="text-sick-red text-xs uppercase tracking-wider block mb-1 font-black">
                                        Est. Monthly Cash
                                    </span>
                                    <span
                                        className="text-white text-3xl md:text-4xl font-black"
                                        style={{ fontFamily: "Syne, sans-serif" }}
                                    >
                                        ${monthlyEarnings.toLocaleString()}
                                    </span>
                                </div>

                                <div className="p-5 rounded-2xl bg-[#130707] border border-[#3d1919] text-center">
                                    <span className="text-[#a89595] text-xs uppercase tracking-wider block mb-1 font-bold">
                                        Est. Annual Payout
                                    </span>
                                    <span
                                        className="text-white text-2xl md:text-3xl font-black"
                                        style={{ fontFamily: "Syne, sans-serif" }}
                                    >
                                        ${annualEarnings.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Partner Perks Grid ───────────────────────────────────── */}
                <section className="relative z-10 px-5 md:px-12 lg:px-16 py-14 md:py-24 max-w-6xl mx-auto">
                    <div className="text-center mb-12 md:mb-16">
                        <span className="text-sick-red text-xs uppercase tracking-[0.3em] font-bold block mb-2">
                            Exclusive Benefits
                        </span>
                        <h2
                            className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white"
                            style={{ fontFamily: "Syne, sans-serif" }}
                        >
                            Partner Perks
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {perks.map((p) => (
                            <div
                                key={p.title}
                                className="p-7 rounded-2xl border border-[#381818] bg-[#160c0c] hover:border-sick-red transition-colors shadow-lg"
                            >
                                <i className={`${p.icon} text-2xl text-sick-red mb-4 block`} aria-hidden="true" />
                                <h4
                                    className="text-base uppercase tracking-wider font-bold text-white mb-2"
                                    style={{ fontFamily: "Syne, sans-serif" }}
                                >
                                    {p.title}
                                </h4>
                                <p className="text-[#ded1d1] text-xs md:text-sm leading-relaxed font-normal">
                                    {p.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Application Form Section ─────────────────────────────── */}
                <section
                    ref={formSectionRef}
                    id="apply-form"
                    className="relative z-10 px-5 md:px-12 lg:px-16 py-14 md:py-24 border-t border-[#331414] bg-[#0f0707]"
                >
                    <div className="max-w-3xl mx-auto p-6 md:p-12 rounded-3xl border border-[#4a1c1c] bg-[#180b0b] shadow-2xl">
                        <div className="text-center mb-8">
                            <span className="text-sick-red text-xs uppercase tracking-[0.25em] font-bold block mb-1">
                                Direct Application
                            </span>
                            <h3
                                className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white"
                                style={{ fontFamily: "Syne, sans-serif" }}
                            >
                                Join The S1CK Affiliate Team
                            </h3>
                            <p className="text-[#ded1d1] text-xs md:text-sm mt-2 font-normal">
                                Fill out the form below. Approved creators receive tracking links and assets within 24 hours.
                            </p>
                        </div>

                        {submitted ? (
                            <div className="py-12 text-center flex flex-col items-center">
                                <span className="w-16 h-16 rounded-full bg-sick-red/20 border border-sick-red text-sick-red inline-flex items-center justify-center text-3xl mb-4 shadow-[0_0_25px_rgba(220,38,38,0.5)]">
                                    <i className="ri-check-line" aria-hidden="true" />
                                </span>
                                <h4
                                    className="text-xl md:text-2xl font-bold uppercase text-white tracking-tight"
                                    style={{ fontFamily: "Syne, sans-serif" }}
                                >
                                    Application Submitted!
                                </h4>
                                <p className="text-[#ded1d1] text-xs md:text-sm mt-2 max-w-md">
                                    Your application has been dispatched to our partnerships team. We will review your channels and email your custom link and portal invite.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setSubmitted(false)}
                                    className="mt-6 px-6 py-2.5 rounded-full border border-sick-red text-sick-red text-xs uppercase tracking-widest font-bold hover:bg-sick-red hover:text-white transition-colors"
                                >
                                    Submit Another Application
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleFormSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-[#ff7070] mb-2 font-bold">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Your full name"
                                            className="w-full px-4 py-3.5 bg-[#0e0606] border border-[#421d1d] rounded-xl text-sm text-white placeholder:text-[#8a6b6b] focus:outline-none focus:border-sick-red focus:ring-1 focus:ring-sick-red transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-[#ff7070] mb-2 font-bold">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="your@email.com"
                                            className="w-full px-4 py-3.5 bg-[#0e0606] border border-[#421d1d] rounded-xl text-sm text-white placeholder:text-[#8a6b6b] focus:outline-none focus:border-sick-red focus:ring-1 focus:ring-sick-red transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-[#ff7070] mb-2 font-bold">
                                            Primary Social Handle / URL *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="@yourhandle or youtube.com/..."
                                            className="w-full px-4 py-3.5 bg-[#0e0606] border border-[#421d1d] rounded-xl text-sm text-white placeholder:text-[#8a6b6b] focus:outline-none focus:border-sick-red focus:ring-1 focus:ring-sick-red transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-[#ff7070] mb-2 font-bold">
                                            Total Audience Size
                                        </label>
                                        <select className="w-full px-4 py-3.5 bg-[#0e0606] border border-[#421d1d] rounded-xl text-sm text-white focus:outline-none focus:border-sick-red transition-all">
                                            <option value="1k-10k">1,000 - 10,000</option>
                                            <option value="10k-50k">10,000 - 50,000</option>
                                            <option value="50k-250k">50,000 - 250,000</option>
                                            <option value="250k+">250,000+</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-[#ff7070] mb-2 font-bold">
                                        How do you plan to promote S1CK fragrances?
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="e.g. TikTok reviews, fragrance unboxings, gym/lifestyle content..."
                                        className="w-full px-4 py-3.5 bg-[#0e0606] border border-[#421d1d] rounded-xl text-sm text-white placeholder:text-[#8a6b6b] focus:outline-none focus:border-sick-red transition-all resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-red-700 via-sick-red to-red-700 text-white font-bold uppercase tracking-[0.2em] text-xs transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-[0_0_30px_rgba(220,38,38,0.6)] flex items-center justify-center gap-2"
                                    style={{ fontFamily: "Syne, sans-serif" }}
                                >
                                    {loading ? (
                                        <span>Processing Application...</span>
                                    ) : (
                                        <>
                                            <span>Submit Partner Application</span>
                                            <i className="ri-arrow-right-line" aria-hidden="true" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </section>

                {/* ── FAQs ─────────────────────────────────────────────────── */}
                <section className="relative z-10 px-5 md:px-12 lg:px-16 py-14 md:py-24 max-w-4xl mx-auto">
                    <h3
                        className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white text-center mb-10 md:mb-14"
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        Frequently Asked Questions
                    </h3>
                    <div className="space-y-5">
                        {faqs.map((f) => (
                            <div key={f.q} className="border-b border-[#381818] pb-5">
                                <p
                                    className="text-white text-sm md:text-base font-bold tracking-wide mb-2"
                                    style={{ fontFamily: "Syne, sans-serif" }}
                                >
                                    {f.q}
                                </p>
                                <p className="text-[#ded1d1] text-xs md:text-sm leading-relaxed font-normal">
                                    {f.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <FooterSection hideAffiliateTeaser />
        </main>
    );
};

export default AffiliatePage;
