import { useEffect, useRef, useState, type RefObject } from "react";

/** Logo filter: white mark on dark backgrounds */
const LIGHT_LOGO_CLASS = "brightness-0 invert";

type NavLogoMode = "light" | "dark";

interface Options {
    /** Always use white/inverted logo (e.g. shop, VIP pages) */
    forceLight?: boolean;
    /** Always use dark logo */
    forceDark?: boolean;
}

function parseRgb(color: string): { r: number; g: number; b: number; a: number } | null {
    if (color === "transparent") return null;
    const m = color.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);
    if (!m) return null;
    return { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : 1 };
}

function relativeLuminance(r: number, g: number, b: number): number {
    const channel = (c: number) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function isNavChrome(el: Element): boolean {
    return Boolean(
        el.closest("nav, [data-nav-chrome], [data-nav-skip], .menu-hover, .pill-shell"),
    );
}

function modeFromSection(el: Element): NavLogoMode | null {
    const themed = el.closest<HTMLElement>("[data-nav-logo]");
    if (!themed) return null;
    const mode = themed.dataset.navLogo;
    if (mode === "light" || mode === "dark") return mode;
    return null;
}

function sampleBackgroundLuminance(el: Element): number | null {
    let node: Element | null = el;
    while (node && node !== document.documentElement) {
        const sectionMode = modeFromSection(node);
        if (sectionMode === "light") return 0;
        if (sectionMode === "dark") return 1;

        const { backgroundColor } = getComputedStyle(node);
        const rgb = parseRgb(backgroundColor);
        if (rgb && rgb.a > 0.08) {
            return relativeLuminance(rgb.r, rgb.g, rgb.b);
        }
        node = node.parentElement;
    }
    return null;
}

function resolveLogoMode(x: number, y: number): NavLogoMode {
    const stack = document.elementsFromPoint(x, y);
    let blendedLum = 1;

    for (const el of stack) {
        if (isNavChrome(el)) continue;

        const sectionMode = modeFromSection(el);
        if (sectionMode) return sectionMode;

        const tag = el.tagName;
        if (tag === "VIDEO") return "light";

        if (tag === "IMG" && !(el as HTMLElement).classList.contains("nav-logo")) {
            const parentMode = modeFromSection(el.parentElement ?? el);
            if (parentMode) return parentMode;
        }

        const lum = sampleBackgroundLuminance(el);
        if (lum !== null) {
            const style = getComputedStyle(el);
            const rgb = parseRgb(style.backgroundColor);
            const alpha = rgb?.a ?? 1;
            blendedLum = lum * alpha + blendedLum * (1 - alpha);
            if (alpha > 0.85) break;
        }
    }

    return blendedLum < 0.52 ? "light" : "dark";
}

export function useNavbarLogoInvert(
    logoRef: RefObject<HTMLElement | null>,
    { forceLight = false, forceDark = false }: Options = {},
) {
    const [useLightLogo, setUseLightLogo] = useState(forceLight);
    const modeRef = useRef<NavLogoMode>(forceLight ? "light" : "dark");
    const ticking = useRef(false);

    useEffect(() => {
        if (forceLight) {
            modeRef.current = "light";
            setUseLightLogo(true);
            return;
        }
        if (forceDark) {
            modeRef.current = "dark";
            setUseLightLogo(false);
            return;
        }

        const sample = () => {
            ticking.current = false;
            const logo = logoRef.current;
            if (!logo) return;

            const rect = logo.getBoundingClientRect();
            if (rect.width === 0) return;

            const x = Math.min(
                Math.max(rect.left + rect.width / 2, 1),
                window.innerWidth - 1,
            );
            const y = Math.min(
                Math.max(rect.bottom + 3, 1),
                window.innerHeight - 1,
            );

            const next = resolveLogoMode(x, y);
            if (next === modeRef.current) return;
            modeRef.current = next;
            setUseLightLogo(next === "light");
        };

        const schedule = () => {
            if (ticking.current) return;
            ticking.current = true;
            requestAnimationFrame(sample);
        };

        sample();

        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule, { passive: true });
        window.addEventListener("nav-logo-resample", schedule);

        const wrapper = document.getElementById("smooth-wrapper");
        wrapper?.addEventListener("scroll", schedule, { passive: true });

        const ro = new ResizeObserver(schedule);
        if (logoRef.current) ro.observe(logoRef.current);

        return () => {
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
            window.removeEventListener("nav-logo-resample", schedule);
            wrapper?.removeEventListener("scroll", schedule);
            ro.disconnect();
        };
    }, [logoRef, forceLight, forceDark]);

    return { useLightLogo, lightLogoClass: LIGHT_LOGO_CLASS };
}
