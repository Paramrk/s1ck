import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Navbar from "../components/Navbar";
import FooterSection from "../sections/FooterSection";
import { flavorlists } from "../constants/details";
import { getImage } from "../utils/media";
import womenImg from "../assets/menu-img/women-menu.webp";
import { useScrollTriggerRefresh } from "../hooks/useScrollTriggerRefresh";

gsap.registerPlugin(ScrollTrigger);

const WomenShopPage = () => {
    const pageRef = useRef<HTMLDivElement>(null);
    const heroImgRef = useRef<HTMLImageElement>(null);
    useScrollTriggerRefresh();

    const hasFineHover =
        typeof window !== "undefined" &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches;

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
            ".women-hero-img-wrap",
            { clipPath: "inset(100% 0 0 0)" },
            { clipPath: "inset(0% 0 0 0)", duration: 1.4 }
        );

        // Hero parallax on scroll
        if (heroImgRef.current) {
            gsap.to(heroImgRef.current, {
                yPercent: 15,
                ease: "none",
                scrollTrigger: {
                    trigger: ".women-hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });
        }

        // Overlay darken on scroll
        gsap.to(".women-hero-overlay", {
            opacity: 0.9,
            ease: "none",
            scrollTrigger: {
                trigger: ".women-hero",
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
        });

        // Breadcrumb line + text
        tl.fromTo(
            ".breadcrumb-line",
            { scaleX: 0 },
            { scaleX: 1, duration: 0.6, ease: "power2.out" },
            "-=0.8"
        );
        tl.fromTo(
            ".women-hero-breadcrumb",
            { opacity: 0, x: -15 },
            { opacity: 1, x: 0, duration: 0.6 },
            "-=0.4"
        );

        // Title clip reveal
        tl.fromTo(
            ".women-hero-title",
            { yPercent: 120 },
            { yPercent: 0, duration: 1.1, ease: "power4.out" },
            "-=0.6"
        );

        // Subtitle
        tl.fromTo(
            ".women-hero-sub",
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.6 },
            "-=0.4"
        );

        // Section heading
        gsap.fromTo(
            ".products-heading",
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
                scrollTrigger: { trigger: ".products-heading", start: "top 88%" },
            }
        );

        // Product cards — staggered
        gsap.utils.toArray<HTMLElement>(".product-card").forEach((card, i) => {
            gsap.fromTo(
                card,
                { y: 80, opacity: 0, scale: 0.95 },
                {
                    y: 0, opacity: 1, scale: 1,
                    duration: 0.8,
                    delay: i * 0.1,
                    ease: "power3.out",
                    scrollTrigger: { trigger: card, start: "top 90%" },
                }
            );
        });
    }, { scope: pageRef });

    const handleCardEnter = (e: React.MouseEvent) => {
        const card = e.currentTarget as HTMLElement;
        const img = card.querySelector(".card-img") as HTMLElement;
        gsap.to(card, { y: -8, duration: 0.4, ease: "power2.out" });
        gsap.to(img, { scale: 1.08, duration: 0.6, ease: "power2.out" });
    };
    const handleCardLeave = (e: React.MouseEvent) => {
        const card = e.currentTarget as HTMLElement;
        const img = card.querySelector(".card-img") as HTMLElement;
        gsap.to(card, { y: 0, duration: 0.4, ease: "power3.out" });
        gsap.to(img, { scale: 1, duration: 0.6, ease: "power3.out" });
    };

    return (
        <main ref={pageRef} className="bg-cream min-h-dvh">
            <Navbar />

            {/* Hero */}
            <section className="women-hero relative h-[70vh] w-full overflow-hidden">
                <div className="women-hero-img-wrap absolute inset-0">
                    <img
                        ref={heroImgRef}
                        src={womenImg}
                        alt="Women's Collection"
                        loading="eager"
                        decoding="async"
                        className="w-full h-[120%] object-cover absolute top-0 left-0"
                    />
                </div>
                <div className="women-hero-overlay absolute inset-0 bg-gradient-to-t from-cream via-cream/50 to-cream/10 z-10" />

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-14 z-20">
                    <div className="flex items-center gap-4 mb-5">
                        <span className="breadcrumb-line block w-8 h-px bg-champagne origin-left" />
                        <p
                            className="women-hero-breadcrumb text-charcoal/50 text-[0.6rem] uppercase tracking-[0.3em]"
                            style={{ fontFamily: "Syne, sans-serif", fontWeight: 500 }}
                        >
                            <Link to="/shop" className="hover:text-charcoal transition-colors duration-300">Shop</Link>
                            <span className="mx-2 text-charcoal/30">/</span>
                            <span className="text-charcoal/70">Women</span>
                        </p>
                    </div>
                    <div className="overflow-hidden">
                        <h1
                            className="women-hero-title text-charcoal text-5xl md:text-7xl font-bold uppercase tracking-tight"
                            style={{ fontFamily: "Syne, sans-serif" }}
                        >
                            For Her
                        </h1>
                    </div>
                    <p
                        className="women-hero-sub text-stone text-xs md:text-sm mt-4 uppercase tracking-[0.2em]"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                    >
                        Elegance meets chemistry
                    </p>
                </div>
            </section>

            {/* Product Grid */}
            <section className="px-6 md:px-14 py-24">
                <div className="max-w-7xl mx-auto">
                    <div className="products-heading flex items-center gap-5 mb-14">
                        <span className="block w-10 h-px bg-champagne" />
                        <p
                            className="text-champagne text-[0.6rem] uppercase tracking-[0.35em]"
                            style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}
                        >
                            Collection — {flavorlists.length} scents
                        </p>
                    </div>

                    <div className="product-grid grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-8 gap-y-14">
                        {flavorlists.map((product, i) => (
                            <div
                                key={product.name}
                                className="product-card group cursor-pointer"
                                onMouseEnter={hasFineHover ? handleCardEnter : undefined}
                                onMouseLeave={hasFineHover ? handleCardLeave : undefined}
                            >
                                <div className="relative aspect-[4/5] overflow-hidden bg-parchment">
                                    <span
                                        className="absolute top-4 left-4 z-10 text-black text-[0.6rem] uppercase tracking-[0.2em]"
                                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                                    >
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <img
                                        src={getImage(product.drinkImage || "")}
                                        alt={product.name}
                                        loading="lazy"
                                        decoding="async"
                                        className="card-img absolute inset-0 w-full h-full object-cover object-center"
                                    />
                                </div>
                                <div className="pt-5 flex items-start justify-between">
                                    <div>
                                        <h3
                                            className="text-charcoal text-sm uppercase tracking-[0.15em]"
                                            style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}
                                        >
                                            {product.name}
                                        </h3>
                                        <p
                                            className="text-stone text-xs mt-1.5 tracking-wide"
                                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                                        >
                                            $89.00
                                        </p>
                                    </div>
                                    <i className="ri-arrow-right-up-line text-taupe text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <FooterSection />
        </main>
    );
};

export default WomenShopPage;
