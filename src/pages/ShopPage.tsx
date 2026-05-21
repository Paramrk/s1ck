import { useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Navbar from "../components/Navbar";
import menImg from "../assets/menu-img/men-menu.webp";
import womenImg from "../assets/menu-img/women-menu.webp";

const ShopPage = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const menImgRef = useRef<HTMLImageElement>(null);
    const womenImgRef = useRef<HTMLImageElement>(null);

    // Hover/parallax effects only make sense with a fine pointer.
    const hasFineHover =
        typeof window !== "undefined" &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // --- Entrance timeline ---
    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        // Panels clip-path reveal from opposite sides
        tl.fromTo(
            ".shop-panel-men",
            { clipPath: "inset(0 100% 0 0)" },
            { clipPath: "inset(0 0% 0 0)", duration: 1.4 }
        );
        tl.fromTo(
            ".shop-panel-women",
            { clipPath: "inset(0 0 0 100%)" },
            { clipPath: "inset(0 0 0 0%)", duration: 1.4 },
            "-=1.2"
        );




        // Numbers fade up
        tl.fromTo(
            ".panel-number",
            { opacity: 0, yPercent: 40 },
            { opacity: 1, yPercent: 0, duration: 0.7, stagger: 0.1 },
            "-=0.7"
        );

        // Titles slide up
        tl.fromTo(
            ".shop-panel-title",
            { yPercent: 120 },
            { yPercent: 0, duration: 1, stagger: 0.12, ease: "power4.out" },
            "-=0.8"
        );

        // Subtitles
        tl.fromTo(
            ".shop-panel-subtitle",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
            "-=0.5"
        );

        // CTA line + text
        tl.fromTo(
            ".cta-line",
            { scaleX: 0 },
            { scaleX: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
            "-=0.4"
        );
        tl.fromTo(
            ".shop-panel-cta span, .shop-panel-cta i",
            { opacity: 0, x: -15 },
            { opacity: 1, x: 0, duration: 0.5, stagger: 0.08 },
            "-=0.3"
        );
    }, { scope: containerRef });

    // --- Hover ---
    const handleMouseEnter = useCallback((panel: "men" | "women") => {
        const isMen = panel === "men";
        const active = isMen ? ".shop-panel-men" : ".shop-panel-women";
        const passive = isMen ? ".shop-panel-women" : ".shop-panel-men";
        const activeImg = isMen ? ".panel-img-men" : ".panel-img-women";
        const passiveImg = isMen ? ".panel-img-women" : ".panel-img-men";
        const activeOverlay = isMen ? ".overlay-men" : ".overlay-women";
        const passiveOverlay = isMen ? ".overlay-women" : ".overlay-men";

        // Gentle flex shift — not too aggressive so text never clips
        gsap.to(active, { flex: 1.15, duration: 0.7, ease: "power3.out" });
        gsap.to(passive, { flex: 0.85, duration: 0.7, ease: "power3.out" });

        // Image scale on active
        gsap.to(activeImg, { scale: 1.06, duration: 0.8, ease: "power2.out" });
        gsap.to(passiveImg, { scale: 1, duration: 0.6, ease: "power2.out" });

        // Overlay: active lightens, passive darkens
        gsap.to(activeOverlay, { opacity: 0.35, duration: 0.5 });
        gsap.to(passiveOverlay, { opacity: 0.7, duration: 0.5 });

        // Passive content dims
        gsap.to(`${passive} .panel-content`, { opacity: 0.3, duration: 0.4 });
        gsap.to(`${active} .panel-content`, { opacity: 1, duration: 0.4 });

        // CTA arrow nudge
        gsap.to(`${active} .cta-arrow`, { x: 8, duration: 0.3, ease: "power2.out" });

        // Divider shifts slightly
        gsap.to(".panel-divider", {
            x: isMen ? 15 : -15,
            duration: 0.7,
            ease: "power3.out",
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        gsap.to(".shop-panel-men, .shop-panel-women", { flex: 1, duration: 0.7, ease: "power3.out" });
        gsap.to(".panel-img-men, .panel-img-women", { scale: 1, x: 0, y: 0, duration: 0.8, ease: "power2.out" });
        gsap.to(".overlay-men, .overlay-women", { opacity: 0.5, duration: 0.5 });
        gsap.to(".panel-content", { opacity: 1, duration: 0.4 });
        gsap.to(".cta-arrow", { x: 0, duration: 0.3 });
        gsap.to(".panel-divider", { x: 0, duration: 0.7, ease: "power3.out" });
    }, []);

    // --- Parallax: image follows cursor ---
    const handleMouseMove = useCallback((e: React.MouseEvent, panel: "men" | "women") => {
        const imgEl = panel === "men" ? menImgRef.current : womenImgRef.current;
        if (!imgEl) return;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(imgEl, {
            x: xPct * -15,
            y: yPct * -15,
            duration: 0.8,
            ease: "power2.out",
        });
    }, []);

    const handlePanelLeave = useCallback((panel: "men" | "women") => {
        const imgEl = panel === "men" ? menImgRef.current : womenImgRef.current;
        if (imgEl) gsap.to(imgEl, { x: 0, y: 0, duration: 0.6, ease: "power3.out" });
        handleMouseLeave();
    }, [handleMouseLeave]);

    return (
        <main className="shop-page" ref={containerRef}>
            <Navbar variant="light" />

            <div className="flex lg:flex-row flex-col w-full h-dvh relative">



                {/* ─── Men Panel ─── */}
                <Link
                    to="/shop/men"
                    className="shop-panel shop-panel-men relative overflow-hidden cursor-pointer block"
                    style={{ flex: 1, textDecoration: "none" }}
                    onMouseEnter={hasFineHover ? () => handleMouseEnter("men") : undefined}
                    onMouseMove={hasFineHover ? (e) => handleMouseMove(e, "men") : undefined}
                    onMouseLeave={hasFineHover ? () => handlePanelLeave("men") : undefined}
                >
                    {/* Image — slightly oversized for parallax room */}
                    <div className="absolute inset-0 overflow-hidden">
                        <img
                            ref={menImgRef}
                            src={menImg}
                            alt="Men's Collection"
                            className="panel-img-men w-[110%] h-[110%] object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        />
                    </div>

                    {/* Overlay */}
                    <div className="overlay-men absolute inset-0 bg-black z-10 pointer-events-none" style={{ opacity: 0.5 }} />

                    {/* Number watermark */}
                    <span
                        className="panel-number absolute top-8 left-10 md:top-12 md:left-14 z-20 text-cream/[0.06] text-[5rem] md:text-[10rem] font-bold leading-none select-none pointer-events-none"
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        01
                    </span>

                    {/* Content */}
                    <div className="panel-content absolute bottom-0 left-0 w-full p-8 md:p-14 z-20">
                        <p
                            className="shop-panel-subtitle text-champagne text-[0.6rem] uppercase tracking-[0.35em] mb-4"
                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                        >
                            Men's Collection
                        </p>
                        <div className="overflow-hidden">
                            <h2
                                className="shop-panel-title text-cream text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight"
                                style={{ fontFamily: "Syne, sans-serif" }}
                            >
                                For Him
                            </h2>
                        </div>
                        <p
                            className="shop-panel-subtitle text-cream/40 text-xs md:text-sm mt-4 max-w-[16rem] leading-relaxed"
                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                        >
                            Scents engineered for dominance. Command any room.
                        </p>

                        <div className="shop-panel-cta flex items-center gap-4 mt-8">
                            <span className="cta-line block w-8 h-px bg-champagne origin-left" />
                            <span
                                className="text-cream text-[0.6rem] uppercase tracking-[0.3em]"
                                style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}
                            >
                                Explore
                            </span>
                            <i className="cta-arrow ri-arrow-right-line text-champagne text-base" />
                        </div>
                    </div>
                </Link>

                {/* ─── Women Panel ─── */}
                <Link
                    to="/shop/women"
                    className="shop-panel shop-panel-women relative overflow-hidden cursor-pointer block"
                    style={{ flex: 1, textDecoration: "none" }}
                    onMouseEnter={hasFineHover ? () => handleMouseEnter("women") : undefined}
                    onMouseMove={hasFineHover ? (e) => handleMouseMove(e, "women") : undefined}
                    onMouseLeave={hasFineHover ? () => handlePanelLeave("women") : undefined}
                >
                    {/* Image */}
                    <div className="absolute inset-0 overflow-hidden">
                        <img
                            ref={womenImgRef}
                            src={womenImg}
                            alt="Women's Collection"
                            className="panel-img-women w-[110%] h-[110%] object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        />
                    </div>

                    {/* Overlay */}
                    <div className="overlay-women absolute inset-0 bg-black z-10 pointer-events-none" style={{ opacity: 0.5 }} />

                    {/* Number watermark */}
                    <span
                        className="panel-number absolute top-8 right-10 md:top-12 md:right-14 z-20 text-cream/[0.06] text-[5rem] md:text-[10rem] font-bold leading-none select-none pointer-events-none"
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        02
                    </span>

                    {/* Content */}
                    <div className="panel-content absolute bottom-0 left-0 w-full p-8 md:p-14 z-20">
                        <p
                            className="shop-panel-subtitle text-champagne text-[0.6rem] uppercase tracking-[0.35em] mb-4"
                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                        >
                            Women's Collection
                        </p>
                        <div className="overflow-hidden">
                            <h2
                                className="shop-panel-title text-cream text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight"
                                style={{ fontFamily: "Syne, sans-serif" }}
                            >
                                For Her
                            </h2>
                        </div>
                        <p
                            className="shop-panel-subtitle text-cream/40 text-xs md:text-sm mt-4 max-w-[16rem] leading-relaxed"
                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                        >
                            Elegance meets chemistry. Be unforgettable.
                        </p>

                        <div className="shop-panel-cta flex items-center gap-4 mt-8">
                            <span className="cta-line block w-8 h-px bg-champagne origin-left" />
                            <span
                                className="text-cream text-[0.6rem] uppercase tracking-[0.3em]"
                                style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}
                            >
                                Explore
                            </span>
                            <i className="cta-arrow ri-arrow-right-line text-champagne text-base" />
                        </div>
                    </div>
                </Link>
            </div>
        </main>
    );
};

export default ShopPage;
