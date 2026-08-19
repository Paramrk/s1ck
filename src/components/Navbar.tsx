import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import NavMenu from "./NavMenu";
import CartDrawer from "./CartDrawer";
import s1ckLogo from "../assets/images/s1ck-logo-transparent.webp";
import { useScrollDirectionVisibility } from "../hooks/useScrollDirectionVisibility";
import { useNavbarLogoInvert } from "../hooks/useNavbarLogoInvert";
import { cartStore } from "../utils/cartStore";

interface NavbarProps {
    variant?: "dark" | "light";
}

const Navbar: React.FC<NavbarProps> = ({ variant = "dark" }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const pillShellRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLImageElement>(null);
    const forceLightChrome = variant === "light";
    const location = useLocation();
    const isShopPage = location.pathname.startsWith("/shop");
    const isProductPage = location.pathname.startsWith("/product");

    const productNavLinks = [
        { label: "Shop",       path: "/shop" },
        { label: "Our Story",  path: "/our-story" },
        { label: "VIP Club",   path: "/vip-club" },
        { label: "Affiliate",  path: "/affiliate" },
        { label: "Wholesaler", path: "/wholesaler" },
        { label: "Contact",    path: "/contact" },
    ];

    useEffect(() => {
        const updateCount = () => {
            const items = cartStore.getCart();
            const count = items.reduce((acc, curr) => acc + curr.quantity, 0);
            setCartCount(count);
        };

        updateCount();
        const unsubscribe = cartStore.subscribe(updateCount);
        window.addEventListener("cart-updated", updateCount);

        const handleOpenCart = () => setIsCartOpen(true);
        window.addEventListener("open-cart", handleOpenCart);

        return () => {
            unsubscribe();
            window.removeEventListener("cart-updated", updateCount);
            window.removeEventListener("open-cart", handleOpenCart);
        };
    }, []);

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
                className={`fixed top-0 left-0 z-50 flex items-center justify-between w-full transition-all duration-300 ${
                    isProductPage
                        ? "bg-[#fcfbf9]/95 backdrop-blur-md border-b border-[#e8e5de]/80 py-3.5 md:px-8 sm:px-6 px-4 shadow-sm"
                        : "bg-transparent md:p-6 sm:p-4 p-3"
                }`}
            >
                <Link to="/" className="block shrink-0">
                    <img
                        ref={logoRef}
                        src={s1ckLogo}
                        alt="navbar-logo"
                        className={`transition-[filter,transform] duration-500 ease-out ${
                            isProductPage
                                ? "w-16 sm:w-20 hover:scale-105"
                                : `md:w-18 w-20 nav-logo ${useLightLogo ? lightLogoClass : ""}`
                        }`}
                    />
                </Link>

                {/* Direct Navigation Links for Product Page */}
                {isProductPage && (
                    <div className="hidden lg:flex items-center gap-5 xl:gap-7">
                        {productNavLinks.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    className={`relative text-[0.68rem] xl:text-xs uppercase tracking-[0.18em] font-semibold transition-colors duration-300 py-1 group ${
                                        isActive ? "text-[#b58a2b]" : "text-charcoal/80 hover:text-charcoal"
                                    }`}
                                    style={{ fontFamily: "Syne, sans-serif" }}
                                >
                                    <span>{item.label}</span>
                                    <span
                                        className={`absolute left-0 -bottom-0.5 h-[1.5px] bg-[#c9a24b] transition-all duration-300 ${
                                            isActive ? "w-full" : "w-0 group-hover:w-full"
                                        }`}
                                    />
                                </Link>
                            );
                        })}
                    </div>
                )}

                <div className="flex items-center gap-3 sm:gap-[15px]">
                    {/* Cart Trigger */}
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className={`nav-action-button group flex h-11 sm:h-12 w-[130px] sm:w-[153px] items-center justify-center gap-2 border p-0 text-center cursor-pointer transition-all duration-500 ${
                            isProductPage
                                ? "border-charcoal bg-white hover:bg-charcoal text-charcoal hover:text-cream"
                                : useLightLogo
                                    ? "border-cream/30 bg-transparent hover:bg-cream text-cream hover:text-charcoal"
                                    : "border-charcoal bg-white hover:bg-charcoal text-charcoal hover:text-cream"
                        }`}
                    >
                        <i className="ri-shopping-bag-line text-base leading-none" />
                        <span
                            className="m-0 p-0 text-xs sm:text-sm font-semibold leading-none"
                            style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '0.15em' }}
                        >
                            BAG ({cartCount})
                        </span>
                    </button>

                    {/* On Product Page: Mobile Hamburger Toggle */}
                    {isProductPage && (
                        <button
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                            className="lg:hidden flex items-center justify-center h-11 sm:h-12 w-11 sm:w-12 border border-charcoal bg-white text-charcoal hover:bg-charcoal hover:text-cream transition-colors duration-300 cursor-pointer"
                            aria-label="Toggle menu"
                        >
                            <i className={isMenuOpen ? "ri-close-line text-xl" : "ri-menu-line text-xl"} />
                        </button>
                    )}

                    {!isShopPage && !isProductPage && (
                        <Link
                            to="/shop"
                            className={`nav-action-button nav-shop-button group hidden h-12 w-[169px] items-center justify-center border p-0 text-center cursor-pointer transition-all duration-500 md:flex ${
                                useLightLogo
                                    ? "border-cream/30 bg-transparent hover:bg-cream"
                                    : "border-charcoal bg-white hover:bg-charcoal"
                            }`}
                        >
                            <span
                                className={`m-0 p-0 text-sm font-medium leading-none transition-colors duration-500 ${
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
                </div>
            </nav>

            {/* Menu toggle for non-product pages — shell handles scroll hide/show; inner keeps cursor-follow */}
            {!isProductPage && (
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
            )}
            <NavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
};

export default Navbar;
