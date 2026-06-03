import React, { useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import menu1 from "../assets/menu-img/men-menu.webp";
import menu3 from "../assets/menu-img/shop-menu.webp";
import menu4 from "../assets/menu-img/story-menu.webp";

const defaultMenuImg = menu1;

interface MenuItem {
    name: string;
    img?: string;
    path?: string;
}

interface NavMenuProps {
    isOpen: boolean;
    onClose?: () => void;
}

const NavMenu: React.FC<NavMenuProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const menuRef = useRef<HTMLDivElement>(null);
    const prevOpen = useRef(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const imgOverlayRef = useRef<HTMLImageElement>(null);

    const menuItems: MenuItem[] = [
        { name: "Shop",      img: menu3, path: "/shop" },
        { name: "Our Story", img: menu1, path: "/our-story" },
        { name: "VIP Club",  img: menu4, path: "/vip-club" },
        { name: "Affiliate", img: menu3, path: "/affiliate" },
        { name: "Wholesaler", img: menu1, path: "/wholesaler" },
        { name: "Contact" },
    ];

    const [hovered, setHovered] = useState<string | null>(null);

    // Animate open / close with staggered links
    useGSAP(() => {
        if (!menuRef.current) return;
        const menu = menuRef.current;
        const links = menu.querySelectorAll<HTMLElement>(".menu-link-item");
        const socials = menu.querySelector<HTMLElement>(".menu-socials");
        const imgWrap = menu.querySelector<HTMLElement>(".menu-img-wrap");
        const counter = menu.querySelector<HTMLElement>(".menu-counter");

        if (isOpen && !prevOpen.current) {
            // --- OPEN ---
            gsap.set(menu, { display: "flex" });

            const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

            tl.fromTo(menu, { opacity: 0 }, { opacity: 1, duration: 0.5 });

            tl.fromTo(
                links,
                { yPercent: 120, opacity: 0, rotateZ: 4 },
                { yPercent: 0, opacity: 1, rotateZ: 0, duration: 0.9, stagger: 0.08 },
                "-=0.3"
            );

            if (socials) {
                tl.fromTo(
                    socials,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6 },
                    "-=0.4"
                );
            }

            if (counter) {
                tl.fromTo(
                    counter,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.5 },
                    "-=0.5"
                );
            }

            if (imgWrap) {
                tl.fromTo(
                    imgWrap,
                    { clipPath: "inset(100% 0 0 0)", scale: 1.15 },
                    { clipPath: "inset(0% 0 0 0)", scale: 1, duration: 1.2, ease: "power3.out" },
                    "-=1.0"
                );
            }
        } else if (!isOpen && prevOpen.current) {
            // --- CLOSE ---
            const tl = gsap.timeline({
                defaults: { ease: "power3.in" },
                onComplete: () => gsap.set(menu, { display: "none" }),
            });

            tl.to(links, { yPercent: -80, opacity: 0, duration: 0.4, stagger: 0.04 });
            if (socials) tl.to(socials, { y: -20, opacity: 0, duration: 0.3 }, "-=0.3");
            tl.to(menu, { opacity: 0, duration: 0.4 }, "-=0.2");
        }

        prevOpen.current = isOpen;
    }, [isOpen]);

    // Crossfade image on hover
    const handleImageTransition = useCallback((newSrc: string) => {
        if (!imgRef.current || !imgOverlayRef.current) return;
        if (imgRef.current.src === newSrc) return;

        imgOverlayRef.current.src = newSrc;
        gsap.fromTo(
            imgOverlayRef.current,
            { opacity: 0, scale: 1.08 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: "power2.out",
                onComplete: () => {
                    if (imgRef.current) imgRef.current.src = newSrc;
                    if (imgOverlayRef.current) gsap.set(imgOverlayRef.current, { opacity: 0 });
                },
            }
        );
    }, []);

    const handleHover = (item: MenuItem) => {
        setHovered(item.name);
        handleImageTransition(item.img ?? defaultMenuImg);
    };

    const handleLeave = () => {
        setHovered(null);
        handleImageTransition(defaultMenuImg);
    };

    const handleClick = (e: React.MouseEvent, item: MenuItem) => {
        if (item.path) {
            e.preventDefault();
            onClose?.();
            navigate(item.path);
        }
    };

    return (
        <div
            ref={menuRef}
            className="navmenu fixed inset-0 w-full h-dvh bg-cream justify-center items-center hidden z-50"
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 md:top-8 md:right-8 z-50 group cursor-pointer"
                aria-label="Close menu"
            >
                <div className="relative size-10 flex items-center justify-center">
                    <span className="absolute w-6 h-[1.5px] bg-charcoal rotate-45 transition-transform duration-300 group-hover:rotate-[135deg]" />
                    <span className="absolute w-6 h-[1.5px] bg-charcoal -rotate-45 transition-transform duration-300 group-hover:rotate-[45deg]" />
                </div>
            </button>

            <div className="flex w-full h-full">
                {/* Left — Links */}
                <div className="lg:w-1/2 w-full flex flex-col justify-center lg:items-start items-center lg:pl-[8vw] px-6 relative">
                    {/* Item counter */}
                    <p
                        className="menu-counter absolute top-8 left-8 text-taupe text-[0.65rem] uppercase tracking-[0.3em] hidden lg:block"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                    >
                        Menu
                    </p>

                    <nav className="flex flex-col lg:gap-2 gap-1">
                        {menuItems.map((item, i) => {
                            const isActive = item.path === location.pathname;
                            const num = String(i + 1).padStart(2, "0");

                            return (
                                <div key={item.name} className="overflow-hidden">
                                    <a
                                        href={item.path ?? "#"}
                                        onClick={(e) => handleClick(e, item)}
                                        onMouseEnter={() => handleHover(item)}
                                        onMouseLeave={handleLeave}
                                        className="menu-link-item flex items-baseline gap-4 group cursor-pointer"
                                    >
                                        {/* Number */}
                                        <span
                                            className={`text-xs tracking-[0.2em] transition-colors duration-300 ${
                                                hovered === item.name ? "text-champagne" : "text-taupe"
                                            }`}
                                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                                        >
                                            {num}
                                        </span>

                                        {/* Link text */}
                                        <span
                                            className={`uppercase lg:text-[4.5vw] md:text-6xl text-4xl font-bold tracking-tight transition-all duration-500 relative ${
                                                hovered === item.name
                                                    ? "text-charcoal"
                                                    : hovered
                                                        ? "text-charcoal/15"
                                                        : "text-charcoal"
                                            }`}
                                            style={{ fontFamily: "Syne, sans-serif" }}
                                        >
                                            {item.name}

                                            {/* Hover underline */}
                                            <span
                                                className={`absolute left-0 -bottom-1 h-[2px] bg-champagne transition-all duration-500 ease-out ${
                                                    hovered === item.name ? "w-full" : "w-0"
                                                }`}
                                            />

                                            {/* Active dot */}
                                            {isActive && (
                                                <span className="absolute -right-4 top-1/2 -translate-y-1/2 size-[6px] rounded-full bg-champagne" />
                                            )}
                                        </span>

                                        {/* Arrow on hover */}
                                        <i
                                            className={`ri-arrow-right-up-line text-2xl transition-all duration-400 ${
                                                hovered === item.name
                                                    ? "text-champagne opacity-100 translate-x-0"
                                                    : "opacity-0 -translate-x-3"
                                            }`}
                                        />
                                    </a>
                                </div>
                            );
                        })}
                    </nav>

                    {/* Social links */}
                    <div
                        className="menu-socials flex items-center gap-5 mt-14"
                    >
                        {[
                            { icon: "ri-youtube-line", label: "YouTube" },
                            { icon: "ri-instagram-line", label: "Instagram" },
                            { icon: "ri-tiktok-line", label: "TikTok" },
                        ].map((s) => (
                            <a
                                key={s.label}
                                href="#"
                                aria-label={s.label}
                                className="size-10 rounded-full border border-ivory flex items-center justify-center text-stone hover:text-charcoal hover:border-champagne transition-all duration-300 group"
                            >
                                <i className={`${s.icon} text-lg group-hover:scale-110 transition-transform duration-300`} />
                            </a>
                        ))}

                        <span
                            className="text-taupe text-[0.6rem] uppercase tracking-[0.2em] ml-2 hidden md:inline"
                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                        >
                            @s1ckpheromones
                        </span>
                    </div>
                </div>

                {/* Right — Image (hidden on mobile) */}
                <div className="menu-img-wrap w-1/2 h-full relative overflow-hidden hidden lg:block">
                    <img
                        ref={imgRef}
                        src={defaultMenuImg}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <img
                        ref={imgOverlayRef}
                        src={defaultMenuImg}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-0"
                    />
                    {/* Dark vignette */}
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-cream/20 pointer-events-none" />
                </div>
            </div>
        </div>
    );
};

export default NavMenu;
