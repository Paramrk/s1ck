import React, { useState, useEffect, useRef } from "react";
import { cartStore } from "../utils/cartStore";
import ShopifyReviewSection from "../components/ShopifyReviewSection";
import lsImg from "../assets/images/ls.webp";
import ltImg from "../assets/images/lt.webp";
import ltoilImg from "../assets/images/ltoil.webp";

interface LiquidSilverSectionProps {
    shopifyProduct?: any;
}

const LiquidSilverSection: React.FC<LiquidSilverSectionProps> = ({ shopifyProduct }) => {
    // Dynamic Product details
    const productTitle = shopifyProduct?.title || "Liquid Silver";
    const productDescription = shopifyProduct?.description || "Premium Aventus-inspired fragrance infused with a 48mg pheromone blend engineered to create unforgettable first impressions.";
    const productDisplayImg = shopifyProduct?.displayImage || lsImg;

    // Build gallery images from Shopify product images or fallback
    const galleryImages: string[] = (() => {
        const shopImgs = shopifyProduct?.images?.nodes;
        if (shopImgs && shopImgs.length > 0) {
            return shopImgs.map((img: any) => img.url || img.src).filter(Boolean);
        }
        return [productDisplayImg, productDisplayImg, productDisplayImg, productDisplayImg];
    })();

    // Variants setup
    const rawVariants = shopifyProduct?.variants?.nodes?.length > 0
        ? shopifyProduct.variants.nodes.map((v: any) => ({
            id: v.id,
            title: v.title,
            price: parseFloat(v.price.amount),
            compareAtPrice: v.compareAtPrice ? parseFloat(v.compareAtPrice.amount) : parseFloat(v.price.amount) * 1.15,
            available: v.availableForSale ?? true,
        }))
        : [
            { id: "ls-100ml", title: "100ml", price: 205, compareAtPrice: 236, available: true },
            { id: "ls-50ml", title: "50ml", price: 125, compareAtPrice: 145, available: true },
            { id: "ls-travel", title: "10ml (310+ Sprays)", price: 45, compareAtPrice: 55, available: true },
        ];

    const variants = rawVariants;
    const [selectedVariant, setSelectedVariant] = useState(variants[0] || { id: "ls-100ml", title: "100ml", price: 205, compareAtPrice: 236, available: true });
    const [quantity, setQuantity] = useState(1);
    const [showSticky, setShowSticky] = useState(false);
    const [addedStatus, setAddedStatus] = useState<string | null>(null);
    const [activeThumb, setActiveThumb] = useState(0);
    const galleryRef = useRef<HTMLDivElement>(null);

    // Keep selected variant in sync
    useEffect(() => {
        if (variants.length > 0) {
            setSelectedVariant(variants[0]);
        }
    }, [shopifyProduct]);

    // Scroll listener for sticky bar
    useEffect(() => {
        const handleScroll = () => {
            setShowSticky(window.scrollY > 700);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Gallery scroll observer for active thumbnail
    useEffect(() => {
        const container = galleryRef.current;
        if (!container) return;
        const imgs = container.querySelectorAll("[data-gallery-img]");
        if (!imgs.length) return;
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const idx = Number((entry.target as HTMLElement).dataset.galleryImg);
                        if (!isNaN(idx)) setActiveThumb(idx);
                    }
                });
            },
            { root: null, threshold: 0.6 }
        );
        imgs.forEach((el) => obs.observe(el));
        return () => obs.disconnect();
    }, [galleryImages.length]);

    // Add to cart handler
    const handleAddToCart = (variantId: string, itemTitle: string, priceVal: number, qtyVal: number = 1, varTitle: string = "Standard") => {
        cartStore.addItem(
            {
                id: variantId,
                title: itemTitle,
                variantTitle: varTitle,
                price: priceVal.toFixed(2),
                currencyCode: "USD",
                image: productDisplayImg,
                handle: shopifyProduct?.handle || "liquid-silver",
            },
            qtyVal
        );
        setAddedStatus("Added ✓");
        setTimeout(() => setAddedStatus(null), 1500);
        window.dispatchEvent(new CustomEvent("open-cart"));
    };

    // FAQ state
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: "How do pheromones work?",
            a: "Pheromones are natural chemical signals emitted by the body. Liquid Silver is infused with a high-concentration 48mg human-identical pheromone blend designed to trigger positive subconscious responses, boosting attraction, approachability, and confidence.",
        },
        {
            q: "How many sprays should I use?",
            a: "Because Liquid Silver is highly concentrated (Extrait de Parfum intensity), 2 to 4 sprays on key pulse points (neck, wrists, chest) is all you need for an 8+ hour scent trail.",
        },
        {
            q: "How long does it last?",
            a: "Liquid Silver lasts over 8 hours on skin and up to 24+ hours on fabrics and clothing thanks to its heavy concentration of raw ambergris, musk, and Molecule 01 notes.",
        },
        {
            q: "Is it safe to use daily?",
            a: "Yes! Liquid Silver is formulated with 92% premium raw materials and dermatologically tested ingredients that are safe for daily application on skin and clothing.",
        },
        {
            q: "What is your return policy?",
            a: "We offer an ironclad 30-Day Money-Back Guarantee. If you are not 100% satisfied with your results, contact our support team for a full refund.",
        },
        {
            q: "Do you ship internationally?",
            a: "Yes! We ship worldwide with fast, insured shipping. Orders over $50 qualify for Free Shipping.",
        },
    ];

    const scrollToGalleryImg = (idx: number) => {
        const container = galleryRef.current;
        if (!container) return;
        const el = container.querySelector(`[data-gallery-img="${idx}"]`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    return (
        <div className="bg-[#0a0a0a] text-[#f5f1e8] font-sans leading-relaxed selection:bg-[#c9a24b] selection:text-[#0a0a0a]">
            {/* Inline Theme Custom Styles */}
            <style>{`
                .s1ck-gold-btn {
                    background: linear-gradient(180deg, #e6c878, #c9a24b);
                    color: #1a1400;
                }
                .s1ck-gold-btn:hover {
                    filter: brightness(1.1);
                    transform: translateY(-1px);
                }
                .s1ck-gold-text {
                    color: #c9a24b;
                }
            `}</style>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* SECTION 1 — HERO: STICKY GALLERY + BUY BOX               */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <section className="bg-[radial-gradient(120%_90%_at_50%_30%,#1a1a1a_0%,#000_75%)] py-8 md:py-12 border-b border-[#222]">
                <div className="max-w-[1240px] mx-auto px-4">

                    {/* Top headline band */}
                    <div className="text-center mb-8">
                        <p className="text-[#c9a24b] tracking-[0.25em] uppercase text-[10px] font-extrabold mb-2">THE FRAGRANCE</p>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase leading-[1.05] text-[#f5f1e8]" style={{ fontFamily: "Syne, sans-serif" }}>
                            THEY'LL REMEMBER <span className="text-[#c9a24b]">YOU BY.</span>
                        </h1>
                        <p className="text-stone-400 text-xs sm:text-sm max-w-2xl mx-auto mt-3 leading-relaxed">
                            {productDescription}
                        </p>
                    </div>

                    {/* 2-column: Sticky Scroll Gallery (left) + Buy Box (right) */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 items-start">

                        {/* LEFT — Scrollable Gallery with Thumbnail Sidebar */}
                        <div className="flex gap-3">
                            {/* Thumbnail Rail */}
                            <div className="hidden sm:flex flex-col gap-2 w-[70px] shrink-0 sticky top-28 self-start">
                                {galleryImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => { setActiveThumb(idx); scrollToGalleryImg(idx); }}
                                        className={`w-[70px] h-[70px] rounded-lg border-2 overflow-hidden transition-all cursor-pointer ${
                                            activeThumb === idx
                                                ? "border-[#c9a24b] opacity-100 ring-1 ring-[#c9a24b]/40"
                                                : "border-[#262626] opacity-50 hover:opacity-80 hover:border-stone-500"
                                        }`}
                                    >
                                        <img src={img} alt={`${productTitle} view ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>

                            {/* Main Gallery Scroll Column */}
                            <div ref={galleryRef} className="flex flex-col gap-3 flex-1">
                                {galleryImages.map((img, idx) => (
                                    <div
                                        key={idx}
                                        data-gallery-img={idx}
                                        className="relative rounded-2xl overflow-hidden border border-[#262626] bg-gradient-to-b from-[#161616] to-[#0d0d0d] aspect-square group shadow-2xl"
                                    >
                                        <img
                                            src={img}
                                            alt={`${productTitle} ${idx + 1}`}
                                            className="w-full h-full object-contain p-6 drop-shadow-[0_20px_25px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {/* Play button on first image */}
                                        {idx === 0 && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none">
                                                <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-[#c9a24b]/60 flex items-center justify-center pl-1 shadow-lg group-hover:scale-110 transition-transform">
                                                    <div className="w-0 h-0 border-y-[9px] border-y-transparent border-l-[15px] border-l-[#c9a24b]" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT — Sticky Buy Box */}
                        <div className="lg:sticky lg:top-28 self-start">
                            <div className="bg-[#111113] border border-[#262626] rounded-2xl p-5 md:p-6 shadow-2xl space-y-4">
                                {/* Title */}
                                <div>
                                    <h2 className="text-xl md:text-2xl font-extrabold uppercase text-[#f5f1e8] tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
                                        {productTitle}
                                    </h2>
                                    <p className="text-[#c9a24b] text-[0.65rem] font-bold uppercase tracking-[0.18em]">
                                        PREMIUM PHEROMONE FRAGRANCE
                                    </p>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-2 text-xs">
                                    <div className="flex text-[#c9a24b] text-xs">★★★★★</div>
                                    <span className="text-[0.7rem] text-stone-400 font-semibold">(22,000+ Reviews)</span>
                                </div>

                                {/* Price */}
                                <div className="space-y-1">
                                    <div className="flex items-baseline gap-2.5">
                                        <span className="text-2xl md:text-3xl font-extrabold text-[#c9a24b]">
                                            ${selectedVariant.price.toFixed(2)}
                                        </span>
                                        {selectedVariant.compareAtPrice > selectedVariant.price && (
                                            <span className="text-sm text-stone-500 line-through">
                                                ${selectedVariant.compareAtPrice.toFixed(2)}
                                            </span>
                                        )}
                                        <span className="bg-[#c8332b] text-white text-[9px] font-extrabold px-2 py-0.5 rounded tracking-wider uppercase">
                                            SALE
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-stone-400">
                                        or 4 interest-free payments of ${(selectedVariant.price / 4).toFixed(2)} with <span className="text-[#8B7AE8] font-bold">Shop Pay</span>
                                    </p>
                                </div>

                                {/* Size selector */}
                                <div>
                                    <label className="block text-[0.65rem] text-stone-400 uppercase tracking-[0.18em] font-bold mb-2">
                                        SIZE: {selectedVariant.title}
                                    </label>
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {variants.map((v: any) => (
                                            <button
                                                key={v.id}
                                                type="button"
                                                onClick={() => setSelectedVariant(v)}
                                                className={`py-2 px-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                                                    selectedVariant.id === v.id
                                                        ? "border-[#c9a24b] bg-[#1a160d] text-white ring-1 ring-[#c9a24b]/40"
                                                        : "border-[#262626] bg-[#0c0c0c] text-stone-400 hover:border-stone-600"
                                                }`}
                                            >
                                                <div className="text-xs font-bold">{v.title.split("/")[0].trim()}</div>
                                                <div className="text-[9px] text-[#c9a24b]">${v.price}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quantity + Add to Cart */}
                                <div className="space-y-2.5 pt-1">
                                    <div className="flex gap-2">
                                        <div className="flex items-center border border-[#262626] rounded-xl overflow-hidden bg-[#0c0c0c] shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                                className="w-9 h-12 text-base font-bold text-stone-300 hover:bg-[#1a1a1a] transition cursor-pointer"
                                            >
                                                −
                                            </button>
                                            <span className="w-9 h-12 flex items-center justify-center text-white font-bold text-sm">
                                                {quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setQuantity((q) => q + 1)}
                                                className="w-9 h-12 text-base font-bold text-stone-300 hover:bg-[#1a1a1a] transition cursor-pointer"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleAddToCart(selectedVariant.id, productTitle, selectedVariant.price, quantity, selectedVariant.title)}
                                            className="flex-1 s1ck-gold-btn font-extrabold uppercase text-xs md:text-sm tracking-[0.18em] py-3 px-4 rounded-xl transition-all shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                                        >
                                            <i className="ri-shopping-bag-line" />
                                            <span>{addedStatus || "ADD TO CART"}</span>
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleAddToCart(selectedVariant.id, productTitle, selectedVariant.price, quantity, selectedVariant.title)}
                                        className="w-full bg-[#5a31f4] hover:bg-[#4b27d4] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        <span>Buy with</span>
                                        <span className="font-extrabold">Shop Pay</span>
                                    </button>
                                    <span className="block text-center text-[10px] text-stone-500 underline cursor-pointer hover:text-stone-300">
                                        More payment options
                                    </span>
                                </div>

                                {/* Trust badges */}
                                <div className="grid grid-cols-3 gap-1 pt-3 border-t border-[#262626] text-center text-[9px] text-stone-400 uppercase tracking-wider">
                                    <div>🛡️ 30 Day Guarantee</div>
                                    <div>🔒 Secure Checkout</div>
                                    <div>🚚 Free Shipping</div>
                                </div>
                            </div>

                            {/* Trust Stats below buy box */}
                            <div className="grid grid-cols-4 gap-2 mt-4">
                                <div className="bg-[#111] border border-[#262626] rounded-xl p-2.5 text-center">
                                    <div className="text-[#c9a24b] text-[10px] tracking-[1px] mb-0.5">★★★★★</div>
                                    <div className="text-sm md:text-base font-bold text-[#c9a24b]">4.9/5</div>
                                    <div className="text-[8px] text-stone-400 uppercase tracking-wider">22,000+ Reviews</div>
                                </div>
                                <div className="bg-[#111] border border-[#262626] rounded-xl p-2.5 text-center">
                                    <div className="text-sm md:text-base font-bold text-[#c9a24b] mt-1">100,000+</div>
                                    <div className="text-[8px] text-stone-400 uppercase tracking-wider">Happy Customers</div>
                                </div>
                                <div className="bg-[#111] border border-[#262626] rounded-xl p-2.5 text-center">
                                    <div className="text-sm md:text-base font-bold text-[#c9a24b] mt-1">8 Years</div>
                                    <div className="text-[8px] text-stone-400 uppercase tracking-wider">#1 Rated</div>
                                </div>
                                <div className="bg-[#111] border border-[#262626] rounded-xl p-2.5 text-center">
                                    <div className="text-lg leading-tight mt-0.5">🇺🇸</div>
                                    <div className="text-[8px] text-stone-400 uppercase tracking-wider">Made in USA</div>
                                </div>
                            </div>

                            {/* Awards Row */}
                            <div className="space-y-1.5 mt-4">
                                <span className="text-[9px] uppercase tracking-[0.2em] text-stone-400 font-bold block text-center">
                                    As Seen In & Awarded
                                </span>
                                <div className="bg-[#111] border border-[#262626] rounded-xl p-3 grid grid-cols-4 gap-2 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-[#1c1c1c] border border-[#c9a24b]/40 flex items-center justify-center text-[10px] font-bold text-[#c9a24b] mb-1">🏆</div>
                                        <span className="text-[8px] text-stone-400 uppercase tracking-wider leading-tight">Best of Pheromones</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-[#1c1c1c] border border-[#c9a24b]/40 flex items-center justify-center text-[10px] font-bold text-[#c9a24b] mb-1">👑</div>
                                        <span className="text-[8px] text-stone-400 uppercase tracking-wider leading-tight">House of Pheromones</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-[#1c1c1c] border border-[#c9a24b]/40 flex items-center justify-center text-[10px] font-bold text-[#c9a24b] mb-1">🌍</div>
                                        <span className="text-[8px] text-stone-400 uppercase tracking-wider leading-tight">Top Brand Globally</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-[#1c1c1c] border border-[#c9a24b]/40 flex items-center justify-center text-[10px] font-bold text-[#c9a24b] mb-1">📰</div>
                                        <span className="text-[8px] text-stone-400 uppercase tracking-wider leading-tight">Featured In Media</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Strip Across Bottom of Hero */}
                    <div className="grid grid-cols-2 md:grid-cols-5 border-t border-b border-[#262626] mt-10 divide-x divide-y md:divide-y-0 divide-[#262626] rounded-xl bg-[#0d0d0d]">
                        <div className="p-3.5 text-center">
                            <span className="block font-extrabold text-[#f5f1e8] text-xs uppercase tracking-wider">Highly Concentrated</span>
                            <span className="text-[10px] text-[#8a8a8a] uppercase tracking-widest">48mg Pheromone Blend</span>
                        </div>
                        <div className="p-3.5 text-center">
                            <span className="block font-extrabold text-[#f5f1e8] text-xs uppercase tracking-wider">310+ Sprays</span>
                            <span className="text-[10px] text-[#8a8a8a] uppercase tracking-widest">Long-Lasting</span>
                        </div>
                        <div className="p-3.5 text-center">
                            <span className="block font-extrabold text-[#f5f1e8] text-xs uppercase tracking-wider">8+ Hours</span>
                            <span className="text-[10px] text-[#8a8a8a] uppercase tracking-widest">On Skin</span>
                        </div>
                        <div className="p-3.5 text-center">
                            <span className="block font-extrabold text-[#f5f1e8] text-xs uppercase tracking-wider">24+ Hours</span>
                            <span className="text-[10px] text-[#8a8a8a] uppercase tracking-widest">On Clothes</span>
                        </div>
                        <div className="p-3.5 text-center col-span-2 md:col-span-1">
                            <span className="block font-extrabold text-[#f5f1e8] text-xs uppercase tracking-wider">Crafted With</span>
                            <span className="text-[10px] text-[#8a8a8a] uppercase tracking-widest">92% Raw Materials</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* SECTION 2 — WATCH THE 30-SECOND EXPERIENCE                */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <section className="bg-[radial-gradient(120%_100%_at_50%_50%,#191308,#000_70%)] py-12 md:py-16 border-t border-[#262626]">
                <div className="max-w-[1180px] mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-4xl font-extrabold text-white uppercase tracking-wider mb-2">
                        Watch The 30-Second Experience
                    </h2>
                    <p className="text-[#cfcabd] text-sm md:text-base mb-8 max-w-xl mx-auto">
                        See why 100,000+ men choose Liquid Silver to be unforgettable.
                    </p>

                    {/* Video Player */}
                    <div className="relative aspect-video max-w-3xl mx-auto rounded-2xl overflow-hidden bg-[#111] border border-[#262626] mb-8 group cursor-pointer">
                        <img src={productDisplayImg} alt="Experience Liquid Silver" className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                            <div className="w-20 h-20 rounded-full bg-black/60 border-2 border-white flex items-center justify-center pl-1 hover:scale-110 transition-transform shadow-2xl">
                                <div className="w-0 h-0 border-y-[12px] border-y-transparent border-l-[20px] border-l-white" />
                            </div>
                        </div>
                    </div>

                    {/* 3 checkmark badges */}
                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="flex items-center gap-2 text-xs text-[#8a8a8a] uppercase tracking-wider font-semibold">
                            <span className="w-8 h-8 rounded-full bg-[#1c1c1c] border border-[#c9a24b] text-[#c9a24b] flex items-center justify-center">✓</span>
                            Premium Quality Ingredients
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#8a8a8a] uppercase tracking-wider font-semibold">
                            <span className="w-8 h-8 rounded-full bg-[#1c1c1c] border border-[#c9a24b] text-[#c9a24b] flex items-center justify-center">✓</span>
                            Real Reactions, Real Results
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#8a8a8a] uppercase tracking-wider font-semibold">
                            <span className="w-8 h-8 rounded-full bg-[#1c1c1c] border border-[#c9a24b] text-[#c9a24b] flex items-center justify-center">✓</span>
                            Luxury Performance
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* SECTION 3 — THE PROBLEM: MOST COLOGNES FAIL YOU           */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <section className="bg-[#111] py-14 border-t border-[#262626]">
                <div className="max-w-[1180px] mx-auto px-4">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-10 leading-tight uppercase">
                        Most Colognes Fail You.<br />
                        <span className="text-[#c9a24b]">Liquid Silver Doesn't.</span>
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-center">
                        {/* Fail Card Matrix */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: "👃", label: "Smell Good For An Hour" },
                                { icon: "💨", label: "Fade & Disappear" },
                                { icon: "👥", label: "Blend Into The Crowd" },
                                { icon: "🚫", label: "Get Forgotten" },
                            ].map((item, i) => (
                                <div key={i} className="bg-[#0d0d0d] border border-[#262626] rounded-xl p-5 text-center">
                                    <div className="text-3xl mb-3 opacity-60">{item.icon}</div>
                                    <div className="text-red-500 font-bold text-lg mb-1">✕</div>
                                    <span className="text-xs uppercase text-[#8a8a8a] font-semibold">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* VS Badge */}
                        <div className="w-16 h-16 rounded-full bg-black border-2 border-[#c9a24b] text-[#c9a24b] font-extrabold flex items-center justify-center text-xl mx-auto shadow-lg shadow-[#c9a24b]/10">
                            VS
                        </div>

                        {/* Win Solution */}
                        <div className="bg-[#14110a] border border-[#c9a24b]/40 rounded-xl p-6">
                            <ul className="grid grid-cols-2 gap-4 text-xs uppercase tracking-wider font-semibold text-[#f5f1e8]">
                                {[
                                    "Signature Scent",
                                    "That Stands Out",
                                    "Memorable",
                                    "Unforgettable",
                                    "Get Compliments",
                                    "Wherever You Go",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <span className="text-[#c9a24b] font-extrabold text-base">✓</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* SECTION 4 — WHY 100,000+ MEN CHOOSE LIQUID SILVER         */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <section className="py-14 border-t border-[#262626]">
                <div className="max-w-[1180px] mx-auto px-4">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-10 uppercase">
                        Why 100,000+ Men Choose Liquid Silver
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
                        {[
                            { icon: "🧪", title: "48mg Premium Pheromone Blend", desc: "Engineered for real human attraction." },
                            { icon: "💎", title: "92% Premium Raw Materials", desc: "Higher quality. Better performance." },
                            { icon: "⏳", title: "8+ Hour Long Lasting", desc: "Long-lasting on skin, clothes & hair." },
                            { icon: "✨", title: "310+ Sprays Per Bottle", desc: "More sprays. More value." },
                            { icon: "👑", title: "Inspired By Legendary 2016 Aventus", desc: "Iconic batch DNA. Modern perfection." },
                            { icon: "🇺🇸", title: "Proudly Made in USA", desc: "Crafted under premium standards." },
                        ].map((item, i) => (
                            <div key={i} className="bg-[#111] border border-[#262626] rounded-xl p-4 hover:border-[#c9a24b]/30 transition-colors">
                                <div className="text-2xl mb-2">{item.icon}</div>
                                <h5 className="text-xs font-bold uppercase text-[#c9a24b] mb-1">{item.title}</h5>
                                <p className="text-[11px] text-[#8a8a8a]">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* SECTION 5 — SCENT JOURNEY                                 */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <section className="bg-[#111] py-14 border-t border-[#262626]">
                <div className="max-w-[1180px] mx-auto px-4">
                    <p className="text-[#c9a24b] text-[10px] uppercase tracking-[0.25em] font-extrabold text-center mb-1">
                        Scent Journey
                    </p>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-3 uppercase">
                        The Evolution of Liquid Silver
                    </h2>
                    <p className="text-stone-500 text-xs text-center mb-10 max-w-lg mx-auto">
                        From the first spray to the drydown — every note is designed to evolve and captivate.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* First Impression */}
                        <div className="bg-[#0d0d0d] border border-[#262626] rounded-xl p-6 text-center">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#1a1a1a] border border-[#262626] flex items-center justify-center">
                                <img src={productDisplayImg} alt="First Impression" className="w-14 h-14 object-contain" />
                            </div>
                            <h5 className="text-sm font-bold uppercase tracking-wider text-white">First Impression</h5>
                            <div className="text-xs text-[#c9a24b] font-semibold mb-4">(0 – 10 Minutes)</div>
                            <div className="flex flex-wrap justify-center gap-2">
                                <span className="px-3 py-1 bg-[#1a1a1a] border border-[#262626] rounded-full text-xs text-[#8a8a8a]">🍍 Pineapple</span>
                                <span className="px-3 py-1 bg-[#1a1a1a] border border-[#262626] rounded-full text-xs text-[#8a8a8a]">🍏 Apple</span>
                                <span className="px-3 py-1 bg-[#1a1a1a] border border-[#262626] rounded-full text-xs text-[#8a8a8a]">🍊 Bergamot</span>
                                <span className="px-3 py-1 bg-[#1a1a1a] border border-[#262626] rounded-full text-xs text-[#8a8a8a]">🌿 Juniper Berries</span>
                            </div>
                        </div>

                        {/* Heart Notes */}
                        <div className="bg-[#0d0d0d] border border-[#262626] rounded-xl p-6 text-center">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#1a1a1a] border border-[#262626] flex items-center justify-center">
                                <img src={productDisplayImg} alt="Heart Notes" className="w-14 h-14 object-contain" />
                            </div>
                            <h5 className="text-sm font-bold uppercase tracking-wider text-white">Heart Notes</h5>
                            <div className="text-xs text-[#c9a24b] font-semibold mb-4">(15 – 30 Minutes)</div>
                            <div className="flex flex-wrap justify-center gap-2">
                                <span className="px-3 py-1 bg-[#1a1a1a] border border-[#262626] rounded-full text-xs text-[#8a8a8a]">🌸 Jasmine</span>
                                <span className="px-3 py-1 bg-[#1a1a1a] border border-[#262626] rounded-full text-xs text-[#8a8a8a]">🍃 Patchouli</span>
                                <span className="px-3 py-1 bg-[#1a1a1a] border border-[#262626] rounded-full text-xs text-[#8a8a8a]">✨ Molecule 01</span>
                            </div>
                        </div>

                        {/* The Drydown */}
                        <div className="bg-[#0d0d0d] border border-[#262626] rounded-xl p-6 text-center">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#1a1a1a] border border-[#262626] flex items-center justify-center">
                                <img src={productDisplayImg} alt="The Drydown" className="w-14 h-14 object-contain" />
                            </div>
                            <h5 className="text-sm font-bold uppercase tracking-wider text-white">The Drydown</h5>
                            <div className="text-xs text-[#c9a24b] font-semibold mb-4">(30 Minutes +)</div>
                            <div className="flex flex-wrap justify-center gap-2">
                                <span className="px-3 py-1 bg-[#1a1a1a] border border-[#262626] rounded-full text-xs text-[#8a8a8a]">🌿 Musk</span>
                                <span className="px-3 py-1 bg-[#1a1a1a] border border-[#262626] rounded-full text-xs text-[#8a8a8a]">🌊 Ambergris</span>
                                <span className="px-3 py-1 bg-[#1a1a1a] border border-[#262626] rounded-full text-xs text-[#8a8a8a]">🍦 Vanilla</span>
                                <span className="px-3 py-1 bg-[#1a1a1a] border border-[#262626] rounded-full text-xs text-[#8a8a8a]">🪵 Woody Notes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* SECTION 6 — REAL PEOPLE. REAL RESULTS.                    */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <section className="py-14 border-t border-[#262626]">
                <div className="max-w-[1180px] mx-auto px-4">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-3 uppercase">
                        Real People. Real Results.
                    </h2>
                    <p className="text-stone-500 text-sm text-center mb-10">
                        Video testimonials from real customers, unscripted and unfiltered.
                    </p>

                    {/* Video Reaction Thumbnails */}
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-12">
                        {[1, 2, 3, 4, 5].map((idx) => (
                            <div key={idx} className="relative aspect-[9/16] rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#262626] group cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                                    <div className="w-10 h-10 rounded-full bg-black/60 border border-white/40 flex items-center justify-center pl-0.5">
                                        <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-white" />
                                    </div>
                                </div>
                                <div className="absolute bottom-2 left-2 right-2">
                                    <div className="text-[9px] text-white font-bold">Real Reaction #{idx}</div>
                                    <div className="text-[#c9a24b] text-[8px]">★★★★★</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Customer Review Cards */}
                    <h3 className="text-xl font-bold text-center text-white mb-6 uppercase tracking-wider">
                        What Our Customers Say
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { name: "Marcus T.", text: "Liquid Silver is the GOAT. Nothing else comes close to the reactions I get." },
                            { name: "Andre L.", text: "I have spent thousands on colognes. This is the only one that actually works." },
                            { name: "David K.", text: "The compliments are REAL. My social life completely transformed." },
                            { name: "Carl G.", text: "Best smelling cologne ever. This is the smoothest scent." },
                        ].map((review, i) => (
                            <div key={i} className="bg-[#0d0d0d] border border-[#262626] rounded-xl p-5 text-center">
                                <div className="text-[#c9a24b] text-xs mb-2">★★★★★</div>
                                <p className="text-[#d8d3c6] text-xs italic mb-3">"{review.text}"</p>
                                <cite className="text-[#c9a24b] text-[10px] font-bold not-italic">— {review.name}</cite>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SHOPIFY REVIEWS SECTION */}
            <ShopifyReviewSection
                productTitle={productTitle}
                shopifyMetafields={shopifyProduct?.metafields}
            />

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* SECTION 7 — TOP RATED                                     */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <section className="bg-[#111] py-14 border-t border-[#262626]">
                <div className="max-w-[1180px] mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
                        <div className="bg-[#0d0d0d] border border-[#262626] rounded-xl p-6 text-center italic text-[#d8d3c6] text-sm">
                            "Beats all the designer colognes. #1 fragrance in my collection forever."
                            <cite className="block not-italic text-[#c9a24b] text-xs font-bold mt-2">— Kawika W.</cite>
                        </div>

                        <div className="text-center px-6">
                            <div className="text-7xl font-extrabold text-white">5</div>
                            <div className="text-[#c9a24b] text-2xl my-1">★★★★★</div>
                            <div className="text-[11px] text-[#8a8a8a] uppercase tracking-wider font-semibold">
                                OUT OF 5 · 22,000+ REVIEWS
                            </div>
                        </div>

                        <div className="bg-[#0d0d0d] border border-[#262626] rounded-xl p-6 text-center italic text-[#d8d3c6] text-sm">
                            "You can never go wrong with Liquid Silver. Unbeatable compliment factor."
                            <cite className="block not-italic text-[#c9a24b] text-xs font-bold mt-2">— Omar S.</cite>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* SECTION 8 — COMPARISON CHART                              */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <section className="py-14 border-t border-[#262626]">
                <div className="max-w-[1180px] mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 uppercase">
                        S1CK vs Other Brands
                    </h2>

                    {/* Bottle comparison header */}
                    <div className="flex justify-center items-end gap-12 mb-8">
                        <div className="text-center">
                            <img src={productDisplayImg} alt="S1CK Liquid Silver" className="w-20 h-28 object-contain mx-auto mb-2" />
                            <span className="text-[#c9a24b] text-xs font-bold uppercase tracking-wider">S1CK<br/>Liquid Silver</span>
                        </div>
                        <div className="text-center opacity-40">
                            <div className="w-20 h-28 bg-[#1a1a1a] rounded-lg mx-auto mb-2 flex items-center justify-center border border-[#262626]">
                                <span className="text-2xl">🧴</span>
                            </div>
                            <span className="text-[#8a8a8a] text-xs font-bold uppercase tracking-wider">Other<br/>Brands</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs md:text-sm">
                            <thead>
                                <tr className="border-b border-[#262626] bg-black">
                                    <th className="p-4 text-[#8a8a8a] uppercase tracking-wider font-bold">Features</th>
                                    <th className="p-4 bg-[#14110a] text-[#c9a24b] uppercase tracking-wider font-bold">S1CK Liquid Silver</th>
                                    <th className="p-4 text-[#8a8a8a] uppercase tracking-wider font-bold">Other Brands</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#262626]">
                                {[
                                    { feature: "Pheromone Blend", s1ck: "48mg Premium Blend", other: "0mg – None" },
                                    { feature: "Raw Material Quality", s1ck: "92% Premium", other: "20% – 60%" },
                                    { feature: "Longevity (Skin)", s1ck: "8+ Hours", other: "2 – 4 Hours" },
                                    { feature: "Longevity (Clothes)", s1ck: "24+ Hours", other: "4 – 6 Hours" },
                                    { feature: "Sprays Per Bottle", s1ck: "310+ Sprays", other: "100 – 150 Sprays" },
                                    { feature: "Compliment Factor", s1ck: "High – Proven", other: "Low – Unproven" },
                                    { feature: "Price Per Spray", s1ck: "High Value", other: "Overpriced / Low Value" },
                                ].map((row, i) => (
                                    <tr key={i}>
                                        <td className="p-4 text-white font-medium">{row.feature}</td>
                                        <td className="p-4 bg-[#14110a] text-white font-bold">
                                            <span className="text-[#c9a24b] font-bold mr-2">✓</span>{row.s1ck}
                                        </td>
                                        <td className="p-4 text-[#8a8a8a]">{row.other}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* SECTION 9 — CHOOSE YOUR POWER LEVEL + BUNDLES + ADD-ONS   */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <section className="bg-[#111] py-14 border-t border-[#262626]">
                <div className="max-w-[1180px] mx-auto px-4">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-10 uppercase">
                        Choose Your Power Level
                    </h2>

                    {/* Bundles Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {/* Bundle 1 - The Starter */}
                        <div className="bg-[#0d0d0d] border border-[#262626] rounded-xl p-6 text-center flex flex-col justify-between hover:border-[#c9a24b]/40 transition-colors">
                            <div>
                                <h5 className="text-lg font-bold uppercase tracking-wider text-white">The Starter</h5>
                                <div className="text-xs text-[#8a8a8a] mb-4">1 × 100ml Bottle</div>
                                <img src={lsImg} alt="Starter Bundle" className="w-full aspect-square object-contain rounded-lg mb-4" />
                                <div className="text-2xl font-extrabold text-[#c9a24b] mb-1">$205</div>
                                <div className="text-xs text-[#c9a24b] font-semibold mb-6">SAVE 13%</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleAddToCart("ls-100ml", "Liquid Silver - The Starter", 205, 1, "100ml")}
                                className="w-full s1ck-gold-btn font-extrabold uppercase text-xs tracking-wider py-3 rounded-lg cursor-pointer"
                            >
                                Add to Cart
                            </button>
                        </div>

                        {/* Bundle 2 - The Collector (Highlighted) */}
                        <div className="bg-[#0d0d0d] border-2 border-[#c9a24b] rounded-xl p-6 text-center flex flex-col justify-between relative">
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c9a24b] text-[#1a1400] text-[10px] font-extrabold px-4 py-1 rounded-full uppercase tracking-wider">
                                Most Popular
                            </span>
                            <div>
                                <h5 className="text-lg font-bold uppercase tracking-wider text-white">The Collector</h5>
                                <div className="text-xs text-[#8a8a8a] mb-4">2 × 100ml Bottles</div>
                                <img src={lsImg} alt="Collector Bundle" className="w-full aspect-square object-contain rounded-lg mb-4" />
                                <div className="text-2xl font-extrabold text-[#c9a24b] mb-1">
                                    $369 <s className="text-sm text-[#8a8a8a] font-normal ml-1">$440</s>
                                </div>
                                <div className="text-xs text-[#c9a24b] font-semibold mb-6">SAVE 16%</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleAddToCart("ls-collector", "Liquid Silver - The Collector (2 Pack)", 369, 1, "2 x 100ml")}
                                className="w-full s1ck-gold-btn font-extrabold uppercase text-xs tracking-wider py-3.5 rounded-lg shadow-lg cursor-pointer"
                            >
                                Add to Cart
                            </button>
                        </div>

                        {/* Bundle 3 - The Legend */}
                        <div className="bg-[#0d0d0d] border border-[#262626] rounded-xl p-6 text-center flex flex-col justify-between hover:border-[#c9a24b]/40 transition-colors">
                            <div>
                                <h5 className="text-lg font-bold uppercase tracking-wider text-white">The Legend</h5>
                                <div className="text-xs text-[#8a8a8a] mb-4">3 × 100ml Bottles</div>
                                <img src={lsImg} alt="Legend Bundle" className="w-full aspect-square object-contain rounded-lg mb-4" />
                                <div className="text-2xl font-extrabold text-[#c9a24b] mb-1">
                                    $525 <s className="text-sm text-[#8a8a8a] font-normal ml-1">$615</s>
                                </div>
                                <div className="text-xs text-[#c9a24b] font-semibold mb-6">SAVE 24%</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleAddToCart("ls-legend", "Liquid Silver - The Legend (3 Pack)", 525, 1, "3 x 100ml")}
                                className="w-full s1ck-gold-btn font-extrabold uppercase text-xs tracking-wider py-3 rounded-lg cursor-pointer"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>

                    {/* Add-Ons */}
                    <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Complete Your Routine (Add & Save)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
                        <div
                            onClick={() => handleAddToCart("addon-travel", "10ml Travel Spray", 35, 1, "10ml")}
                            className="bg-[#0d0d0d] border border-[#262626] hover:border-[#c9a24b] rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all"
                        >
                            <img src={lsImg} alt="Travel Spray" className="w-12 h-12 rounded-lg object-cover" />
                            <div>
                                <div className="text-xs font-bold text-white">Add 10ml Travel Spray</div>
                                <div className="text-xs font-bold text-[#c9a24b] mt-1">+$35</div>
                            </div>
                        </div>

                        <div
                            onClick={() => handleAddToCart("addon-rollon", "Le Toxiquè Roll-On Oil", 42, 1, "10ml")}
                            className="bg-[#0d0d0d] border border-[#262626] hover:border-[#c9a24b] rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all"
                        >
                            <img src={ltoilImg} alt="Le Toxique Oil" className="w-12 h-12 rounded-lg object-cover" />
                            <div>
                                <div className="text-xs font-bold text-white">Add Le Toxiquè Roll-On Oil 10ml</div>
                                <div className="text-xs font-bold text-[#c9a24b] mt-1">+$42</div>
                            </div>
                        </div>

                        <div
                            onClick={() => handleAddToCart("addon-oil", "S1CK Pheromone Oil 6ml", 59, 1, "6ml")}
                            className="bg-[#0d0d0d] border border-[#262626] hover:border-[#c9a24b] rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all"
                        >
                            <img src={ltImg} alt="Pheromone Oil" className="w-12 h-12 rounded-lg object-cover" />
                            <div>
                                <div className="text-xs font-bold text-white">Add S1CK Pheromone Oil 6ml</div>
                                <div className="text-xs font-bold text-[#c9a24b] mt-1">+$59</div>
                            </div>
                        </div>

                        <div className="bg-[#14110a] border border-[#c9a24b] rounded-xl p-4 flex items-center gap-3 cursor-pointer">
                            <div className="w-12 h-12 rounded-lg bg-[#c9a24b]/20 flex items-center justify-center text-xl">
                                👑
                            </div>
                            <div>
                                <div className="text-xs font-bold text-white">VIP Club Membership</div>
                                <div className="text-[10px] text-[#c9a24b] font-semibold mt-1">Up to 35% Off · Free Gifts</div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ */}
                    <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Frequently Asked Questions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className="bg-[#0d0d0d] border border-[#262626] rounded-xl p-4 cursor-pointer hover:border-stone-600 transition-colors"
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            >
                                <div className="flex justify-between items-center text-xs md:text-sm font-bold text-white">
                                    <span>{faq.q}</span>
                                    <span className="text-[#c9a24b] text-base ml-3 shrink-0">{openFaq === i ? "−" : "+"}</span>
                                </div>
                                {openFaq === i && <p className="mt-3 text-xs text-[#8a8a8a] leading-relaxed">{faq.a}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* SECTION 10 — FINAL CTA BAR                                */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <section className="bg-[linear-gradient(90deg,#000_0%,#191308_100%)] py-14 border-t border-[#262626]">
                <div className="max-w-[1180px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <div className="flex items-center gap-6">
                        <img src={productDisplayImg} alt="Liquid Silver Final CTA" className="w-28 h-28 rounded-xl object-cover hidden sm:block" />
                        <div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase">
                                Become The Man <span className="text-[#c9a24b]">They Remember.</span>
                            </h2>
                            <div className="flex gap-6 mt-3 text-xs text-[#8a8a8a]">
                                <div><b className="text-[#c9a24b] block text-sm">100,000+</b>Happy Customers</div>
                                <div><b className="text-[#c9a24b] block text-sm">8 Years</b>#1 Rated</div>
                                <div><b className="text-[#c9a24b] block text-sm">4.9/5</b>22,000+ Reviews</div>
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() =>
                            handleAddToCart(selectedVariant.id, "Liquid Silver", selectedVariant.price, quantity, selectedVariant.title)
                        }
                        className="s1ck-gold-btn font-extrabold uppercase text-sm tracking-wider py-4 px-8 rounded-lg shadow-xl cursor-pointer whitespace-nowrap"
                    >
                        Get Liquid Silver Now
                    </button>
                </div>
                <p className="text-center text-xs text-[#8a8a8a] mt-6 tracking-wider">
                    30 Day Guarantee · Secure Checkout · Free Shipping Over $50
                </p>
            </section>

            {/* STICKY BOTTOM BAR */}
            <div
                className={`fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 border-t border-[#c9a24b] backdrop-blur-md z-50 transition-transform duration-300 ${
                    showSticky ? "translate-y-0" : "translate-y-[120%]"
                }`}
            >
                <div className="max-w-[1180px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <img src={productDisplayImg} alt="Liquid Silver Sticky" className="w-11 h-11 rounded-lg object-cover" />
                        <div>
                            <div className="font-extrabold text-sm text-white">{productTitle}</div>
                            <div className="text-xs text-[#c9a24b] font-bold">
                                ${selectedVariant.price.toFixed(2)}
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            handleAddToCart(selectedVariant.id, productTitle, selectedVariant.price, quantity, selectedVariant.title)
                        }
                        className="s1ck-gold-btn font-extrabold uppercase text-xs tracking-wider py-3 px-6 rounded-lg shadow-md cursor-pointer"
                    >
                        Add to Bag
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LiquidSilverSection;
