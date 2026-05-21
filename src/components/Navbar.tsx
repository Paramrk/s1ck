import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import NavMenu from "./NavMenu";
import s1ckLogo from "../assets/images/s1ck-logo-transparent.webp";

interface NavbarProps {
    variant?: "dark" | "light";
}

const Navbar: React.FC<NavbarProps> = ({ variant = "dark" }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isLight = variant === "light";
    const location = useLocation();
    const isShopPage = location.pathname.startsWith("/shop");

    useGSAP(() => {
        const els = Array.from(document.querySelectorAll<HTMLElement>(".nav-logo, .menu-hover"));
        if (!els.length) return;

        // Cursor-follow is meaningless on touch devices — skip the listeners entirely
        // so :hover-stuck transforms never linger after a tap.
        const hasFineHover =
            typeof window !== "undefined" &&
            window.matchMedia("(hover: hover) and (pointer: fine)").matches;

        const disposers: Array<() => void> = [];

        els.forEach((el) => {
            const isCentered = el.classList.contains("menu-hover");
            if (isCentered) gsap.set(el, { xPercent: -50 });

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
            <nav className="fixed top-0 left-0 z-50 flex items-center justify-between md:p-6 sm:p-4 p-3 w-full bg-transparent">
                <Link to="/" className="block">
                    <img
                        src={s1ckLogo}
                        alt="navbar-logo"
                        className={`md:w-18 w-20 nav-logo ${isLight ? "brightness-0 invert" : ""}`}
                    />
                </Link>

                {!isShopPage && (
                    <Link
                        to="/shop"
                        className={`group sm:px-6 px-4 py-2 border transition-all duration-500 text-center cursor-pointer ${
                            isLight
                                ? "border-cream/30 bg-transparent hover:bg-cream"
                                : "border-charcoal bg-white hover:bg-charcoal"
                        }`}
                    >
                        <span
                            className={`text-xs font-medium p-0 m-0 transition-colors duration-500 ${
                                isLight
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

            {/* Menu toggle */}
            <div
                className={`menu-hover flex items-center gap-2 px-5 py-2.5 backdrop-blur-xl border rounded-full cursor-pointer fixed lg:top-6 top-3 left-1/2 z-[1000] group transition-all duration-500 ${
                    isLight
                        ? "bg-white/10 border-cream/20 hover:bg-cream"
                        : "bg-white/60 border-ivory/60 hover:bg-charcoal"
                }`}
                onClick={() => setIsMenuOpen((prev) => !prev)}
            >
                <div className="flex flex-col gap-[4px] items-center justify-center">
                    <span className={`block w-4 h-[1.5px] transition-all duration-400 origin-center ${
                        isLight
                            ? `bg-cream group-hover:bg-charcoal ${isMenuOpen ? "rotate-45 translate-y-[2.75px]" : ""}`
                            : `bg-charcoal group-hover:bg-cream ${isMenuOpen ? "rotate-45 translate-y-[2.75px]" : ""}`
                    }`} />
                    <span className={`block w-4 h-[1.5px] transition-all duration-400 origin-center ${
                        isLight
                            ? `bg-cream group-hover:bg-charcoal ${isMenuOpen ? "-rotate-45 -translate-y-[2.75px]" : ""}`
                            : `bg-charcoal group-hover:bg-cream ${isMenuOpen ? "-rotate-45 -translate-y-[2.75px]" : ""}`
                    }`} />
                </div>
                <span
                    className={`text-[0.6rem] uppercase tracking-[0.2em] transition-colors duration-500 ${
                        isLight
                            ? "text-cream group-hover:text-charcoal"
                            : "text-charcoal group-hover:text-cream"
                    }`}
                    style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}
                >
                    {isMenuOpen ? "Close" : "Menu"}
                </span>
            </div>
            <NavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
};

export default Navbar;
