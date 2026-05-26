import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import NavMenu from "./NavMenu";
import s1ckLogo from "../assets/images/s1ck-logo-transparent.webp";
import { useScrollDirectionVisibility } from "../hooks/useScrollDirectionVisibility";
import { useNavbarLogoInvert } from "../hooks/useNavbarLogoInvert";

interface NavbarProps {
    variant?: "dark" | "light";
}

const Navbar: React.FC<NavbarProps> = ({ variant = "dark" }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pillShellRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLImageElement>(null);
    const forceLightChrome = variant === "light";
    const location = useLocation();
    const isShopPage = location.pathname.startsWith("/shop");

    const pillVisible = useScrollDirectionVisibility({ disabled: isMenuOpen });
    const { useLightLogo, lightLogoClass } = useNavbarLogoInvert(logoRef, {
        forceLight: forceLightChrome,
    });

    useGSAP(() => {
        const shell = pillShellRef.current;
        if (!shell) return;

        gsap.set(shell, { xPercent: -50, willChange: "transform, opacity" });

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reducedMotion) {
            gsap.set(shell, {
                autoAlpha: pillVisible ? 1 : 0,
                pointerEvents: pillVisible ? "auto" : "none",
            });
            return;
        }

        gsap.to(shell, {
            y: pillVisible ? 0 : -28,
            autoAlpha: pillVisible ? 1 : 0,
            duration: 0.42,
            ease: pillVisible ? "power3.out" : "power2.in",
            pointerEvents: pillVisible ? "auto" : "none",
            overwrite: "auto",
        });
    }, { dependencies: [pillVisible] });

    useGSAP(() => {
        const logo = document.querySelector<HTMLElement>(".nav-logo");
        const menu = menuRef.current;
        const els = [logo, menu].filter(Boolean) as HTMLElement[];
        if (!els.length) return;

        const hasFineHover =
            typeof window !== "undefined" &&
            window.matchMedia("(hover: hover) and (pointer: fine)").matches;

        const disposers: Array<() => void> = [];

        els.forEach((el) => {
            if (!hasFineHover) return;

            const onMove = (e: MouseEvent) => {
                const b = el.getBoundingClientRect();
                const x = e.clientX - b.left;
                const y = e.clientY - b.top;
                const offsetX = (x / b.width - 0.5) * 10;
                const offsetY = (y / b.height - 0.5) * 10;
                gsap.to(el, { x: offsetX, y: offsetY, scale: 1.2, duration: 0.25, ease: "power2.out" });
            };

            const onLeave = () => gsap.to(el, { x: 0, y: 0, scale: 1, duration: 0.35, ease: "power3.out" });

            el.addEventListener("mousemove", onMove);
            el.addEventListener("mouseleave", onLeave);

            disposers.push(() => {
                el.removeEventListener("mousemove", onMove);
                el.removeEventListener("mouseleave", onLeave);
            });
        });

        return () => disposers.forEach((d) => d());
    });

    return (
        <>
            <nav
                data-nav-chrome
                className="fixed top-0 left-0 z-50 flex items-center justify-between md:p-6 sm:p-4 p-3 w-full bg-transparent"
            >
                <Link to="/" className="block">
                    <img
                        ref={logoRef}
                        src={s1ckLogo}
                        alt="navbar-logo"
                        className={`md:w-18 w-20 nav-logo transition-[filter] duration-500 ease-out ${
                            useLightLogo ? lightLogoClass : ""
                        }`}
                    />
                </Link>

                {!isShopPage && (
                    <Link
                        to="/shop"
                        className={`hidden md:block group sm:px-6 px-4 py-2 border transition-all duration-500 text-center cursor-pointer ${
                            useLightLogo
                                ? "border-cream/30 bg-transparent hover:bg-cream"
                                : "border-charcoal bg-white hover:bg-charcoal"
                        }`}
                    >
                        <span
                            className={`text-xs font-medium p-0 m-0 transition-colors duration-500 ${
                                useLightLogo
                                    ? "text-cream group-hover:text-charcoal"
                                    : "text-charcoal group-hover:text-cream"
                            }`}
                            style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '0.18em' }}
                        >
                            SHOP NOW
                        </span>
                    </Link>
                )}
            </nav>

            {/* Menu toggle — shell handles scroll hide/show; inner keeps cursor-follow */}
            <div
                ref={pillShellRef}
                data-nav-chrome
                className="pill-shell fixed lg:top-6 top-3 left-1/2 z-[1000]"
                aria-hidden={!pillVisible && !isMenuOpen}
            >
            <div
                ref={menuRef}
                className={`menu-hover flex items-center gap-2 px-5 py-2.5 backdrop-blur-xl border rounded-full cursor-pointer group transition-colors duration-500 ${
                    useLightLogo
                        ? "bg-white/10 border-cream/20 hover:bg-cream"
                        : "bg-white/60 border-ivory/60 hover:bg-charcoal"
                }`}
                onClick={() => setIsMenuOpen((prev) => !prev)}
            >
                <div className="flex flex-col gap-[4px] items-center justify-center">
                    <span className={`block w-4 h-[1.5px] transition-all duration-400 origin-center ${
                        useLightLogo
                            ? `bg-cream group-hover:bg-charcoal ${isMenuOpen ? "rotate-45 translate-y-[2.75px]" : ""}`
                            : `bg-charcoal group-hover:bg-cream ${isMenuOpen ? "rotate-45 translate-y-[2.75px]" : ""}`
                    }`} />
                    <span className={`block w-4 h-[1.5px] transition-all duration-400 origin-center ${
                        useLightLogo
                            ? `bg-cream group-hover:bg-charcoal ${isMenuOpen ? "-rotate-45 -translate-y-[2.75px]" : ""}`
                            : `bg-charcoal group-hover:bg-cream ${isMenuOpen ? "-rotate-45 -translate-y-[2.75px]" : ""}`
                    }`} />
                </div>
                <span
                    className={`text-[0.6rem] uppercase tracking-[0.2em] transition-colors duration-500 ${
                        useLightLogo
                            ? "text-cream group-hover:text-charcoal"
                            : "text-charcoal group-hover:text-cream"
                    }`}
                    style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}
                >
                    {isMenuOpen ? "Close" : "Menu"}
                </span>
            </div>
            </div>
            <NavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
};

export default Navbar;
