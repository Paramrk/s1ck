import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import FooterSection from "../sections/FooterSection";
import contactMobile from "../assets/images/contact-mobile.jpg";
import contactDesktop from "../assets/images/contact-desktop.jpg";
import { resolveShopifyAssetUrl } from "../utils/media";

const resolvedMobile = resolveShopifyAssetUrl(contactMobile);
const resolvedDesktop = resolveShopifyAssetUrl(contactDesktop);

const contactChannels = [
    {
        icon: "ri-phone-line",
        title: "Concierge Phone",
        subtitle: "Mon - Sun: 9AM - 9PM EST",
        contact: "+1 (800) 712-7125",
        action: "tel:+18007127125",
        actionLabel: "Call Concierge",
    },
    {
        icon: "ri-mail-send-line",
        title: "VIP Email Support",
        subtitle: "Guaranteed 4-Hour Response",
        contact: "concierge@s1ck.com",
        action: "mailto:concierge@s1ck.com?subject=S1CK%20Concierge%20Inquiry",
        actionLabel: "Send Email",
    },
    {
        icon: "ri-chat-voice-line",
        title: "Live Scent Advisory",
        subtitle: "Direct Formula Specialists",
        contact: "Direct Formulation Guidance",
        action: "#contact-form",
        actionLabel: "Start Inquiry",
    },
];

const faqs = [
    {
        q: "How fast does the concierge team reply?",
        a: "Our dedicated VIP team responds to all inquiries within 2-4 business hours, 7 days a week.",
    },
    {
        q: "Can I receive a personalized scent recommendation?",
        a: "Yes. Our olfactory specialists analyze your preferences, body chemistry goals, and occasions to recommend the optimal S1CK pheromone concentration.",
    },
    {
        q: "How do I track my existing order?",
        a: "Once your order is crafted and shipped, tracking information is emailed immediately. You can also reach our concierge with your order number for real-time status.",
    },
    {
        q: "What is your satisfaction policy?",
        a: "We back every bottle with our ironclad 30-Day Money-Back Guarantee. If your formula does not exceed expectations, our concierge will immediately make it right.",
    },
];

const ContactUsPage: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 600);
    };

    return (
        <main className="contact-page bg-[#0a0908] text-[#faf7f2] min-h-dvh flex flex-col justify-between">
            <Navbar />

            <div className="w-full pt-16 md:pt-20">
                {/* ── Exact Visual Hero Poster (Mobile & Desktop) ────────── */}
                <section className="contact-hero-wrap relative w-full overflow-hidden bg-black">
                    {/* Mobile Poster */}
                    <div className="block md:hidden w-full relative">
                        <img
                            src={resolvedMobile}
                            alt="S1CK Luxury Pheromone Perfumes - Contact Us"
                            width={576}
                            height={1024}
                            loading="eager"
                            decoding="async"
                            className="w-full h-auto object-cover object-center"
                        />
                    </div>

                    {/* Desktop Poster */}
                    <div className="hidden md:block w-full max-w-[1920px] mx-auto relative">
                        <img
                            src={resolvedDesktop}
                            alt="S1CK Luxury Pheromone Perfumes - Contact Us"
                            width={1024}
                            height={576}
                            loading="eager"
                            decoding="async"
                            className="w-full h-auto object-cover object-center"
                        />
                    </div>
                </section>

                {/* ── Direct Concierge Channels ─────────────────────────────── */}
                <section className="relative z-10 px-5 md:px-12 lg:px-16 py-14 md:py-20 max-w-6xl mx-auto">
                    <div className="text-center mb-12 md:mb-16">
                        <p
                            className="text-[#dfba73] text-xs md:text-sm uppercase tracking-[0.3em] font-bold mb-3"
                            style={{ fontFamily: "Syne, sans-serif" }}
                        >
                            VIP Concierge Desk
                        </p>
                        <h2
                            className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white"
                            style={{ fontFamily: "Syne, sans-serif" }}
                        >
                            Direct Assistance &amp; Inquiries
                        </h2>
                        <p className="text-[#d8d0c5] text-xs md:text-sm mt-3 max-w-xl mx-auto font-normal leading-relaxed">
                            Whether you need order assistance, customized formula guidance, or bespoke consultations, our advisory team is at your service.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {contactChannels.map((c) => (
                            <div
                                key={c.title}
                                className="group relative p-7 md:p-8 rounded-2xl border border-[#382f25] bg-[#161412] hover:border-[#dfba73] transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
                            >
                                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#dfba73]/15 border border-[#dfba73]/40 text-[#dfba73] text-2xl mb-5 group-hover:scale-110 transition-transform duration-300">
                                    <i className={c.icon} aria-hidden="true" />
                                </span>
                                <h3
                                    className="text-base md:text-lg font-bold text-white uppercase tracking-wider mb-1"
                                    style={{ fontFamily: "Syne, sans-serif" }}
                                >
                                    {c.title}
                                </h3>
                                <p className="text-[#a89d8f] text-xs uppercase tracking-wider mb-3">
                                    {c.subtitle}
                                </p>
                                <p className="text-white text-sm font-semibold mb-6 break-all">
                                    {c.contact}
                                </p>
                                <a
                                    href={c.action}
                                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-bold text-[#dfba73] group-hover:text-white transition-colors"
                                    style={{ fontFamily: "Syne, sans-serif" }}
                                >
                                    {c.actionLabel} <span aria-hidden="true">&rarr;</span>
                                </a>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Luxury Contact Form & FAQs ─────────────────────────────── */}
                <section id="contact-form" className="relative z-10 px-5 md:px-12 lg:px-16 py-14 md:py-24 border-t border-[#26201a] bg-[#0e0c0b]">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                        {/* Left: Contact Form */}
                        <div className="lg:col-span-7 bg-[#161412] border border-[#382f25] p-6 md:p-10 rounded-3xl shadow-2xl">
                            <div className="mb-8">
                                <span className="text-[#dfba73] text-xs uppercase tracking-[0.25em] font-bold block mb-1">
                                    Priority Message
                                </span>
                                <h3
                                    className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white"
                                    style={{ fontFamily: "Syne, sans-serif" }}
                                >
                                    Send a Dispatch
                                </h3>
                                <p className="text-[#c7bdb0] text-xs md:text-sm mt-2 font-normal">
                                    Fill in your details below and an advisor will respond promptly.
                                </p>
                            </div>

                            {submitted ? (
                                <div className="py-12 text-center flex flex-col items-center">
                                    <span className="w-16 h-16 rounded-full bg-[#dfba73]/20 border border-[#dfba73] text-[#dfba73] inline-flex items-center justify-center text-3xl mb-4 shadow-[0_0_20px_rgba(223,186,115,0.4)]">
                                        <i className="ri-check-line" aria-hidden="true" />
                                    </span>
                                    <h4
                                        className="text-xl md:text-2xl font-bold uppercase text-white tracking-tight"
                                        style={{ fontFamily: "Syne, sans-serif" }}
                                    >
                                        Message Received
                                    </h4>
                                    <p className="text-[#d8d0c5] text-xs md:text-sm mt-2 max-w-md">
                                        Thank you. Our VIP Concierge has logged your inquiry and will contact you within 2-4 hours.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setSubmitted(false)}
                                        className="mt-6 px-6 py-2.5 rounded-full border border-[#dfba73] text-[#dfba73] text-xs uppercase tracking-widest font-bold hover:bg-[#dfba73] hover:text-black transition-colors"
                                    >
                                        Send Another Inquiry
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-[#dfba73] mb-2 font-bold">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Marcus Vance"
                                                className="w-full px-4 py-3.5 bg-[#0f0e0d] border border-[#3d3329] rounded-xl text-sm text-white placeholder:text-[#82776a] focus:outline-none focus:border-[#dfba73] focus:ring-1 focus:ring-[#dfba73] transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-[#dfba73] mb-2 font-bold">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="marcus@example.com"
                                                className="w-full px-4 py-3.5 bg-[#0f0e0d] border border-[#3d3329] rounded-xl text-sm text-white placeholder:text-[#82776a] focus:outline-none focus:border-[#dfba73] focus:ring-1 focus:ring-[#dfba73] transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-[#dfba73] mb-2 font-bold">
                                                Inquiry Type
                                            </label>
                                            <select className="w-full px-4 py-3.5 bg-[#0f0e0d] border border-[#3d3329] rounded-xl text-sm text-white focus:outline-none focus:border-[#dfba73] transition-all">
                                                <option value="order">Order Tracking &amp; Delivery</option>
                                                <option value="advice">Scent Consultation &amp; Guidance</option>
                                                <option value="vip">VIP Club Membership</option>
                                                <option value="wholesale">Wholesale &amp; Retail Partnerships</option>
                                                <option value="general">General Inquiries</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-[#dfba73] mb-2 font-bold">
                                                Order Number (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="#S1CK-1049"
                                                className="w-full px-4 py-3.5 bg-[#0f0e0d] border border-[#3d3329] rounded-xl text-sm text-white placeholder:text-[#82776a] focus:outline-none focus:border-[#dfba73] transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-[#dfba73] mb-2 font-bold">
                                            Your Message *
                                        </label>
                                        <textarea
                                            rows={4}
                                            required
                                            placeholder="How can our concierge assist you today?"
                                            className="w-full px-4 py-3.5 bg-[#0f0e0d] border border-[#3d3329] rounded-xl text-sm text-white placeholder:text-[#82776a] focus:outline-none focus:border-[#dfba73] transition-all resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(223,186,115,0.3)] hover:brightness-110 active:scale-[0.99]"
                                        style={{
                                            fontFamily: "Syne, sans-serif",
                                            background: "linear-gradient(135deg, #f0cf98 0%, #c99f5e 100%)",
                                            color: "#111",
                                        }}
                                    >
                                        {loading ? (
                                            <span>Dispatching...</span>
                                        ) : (
                                            <>
                                                <span>Send Message to Concierge</span>
                                                <i className="ri-arrow-right-line" aria-hidden="true" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Right: Concierge FAQs */}
                        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                            <div>
                                <span className="text-[#dfba73] text-xs uppercase tracking-[0.25em] font-bold block mb-1">
                                    Quick Answers
                                </span>
                                <h3
                                    className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-6"
                                    style={{ fontFamily: "Syne, sans-serif" }}
                                >
                                    Frequently Asked
                                </h3>

                                <div className="space-y-4">
                                    {faqs.map((f) => (
                                        <div key={f.q} className="border-b border-[#2d251d] pb-4">
                                            <p
                                                className="text-white text-sm md:text-base font-bold tracking-wide mb-1.5"
                                                style={{ fontFamily: "Syne, sans-serif" }}
                                            >
                                                {f.q}
                                            </p>
                                            <p className="text-[#d8d0c5] text-xs md:text-sm leading-relaxed font-normal">
                                                {f.a}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Location / Brand stamp */}
                            <div className="p-6 rounded-2xl border border-[#382f25] bg-[#161412]">
                                <p
                                    className="text-[#dfba73] text-xs uppercase tracking-[0.25em] font-bold mb-1"
                                    style={{ fontFamily: "Syne, sans-serif" }}
                                >
                                    S1CK Luxury Headquarters
                                </p>
                                <p className="text-[#d8d0c5] text-xs md:text-sm leading-relaxed">
                                    Formulated &amp; Distributed Globally from Miami, FL &amp; Paris, France.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <FooterSection />
        </main>
    );
};

export default ContactUsPage;
