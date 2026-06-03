import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/all";

const DEFAULT_TOP = 72;
const DEFAULT_DELTA = 10;

function getScrollTarget(): HTMLElement | Window {
    const smoother = ScrollSmoother.get();
    if (smoother) {
        return document.getElementById("smooth-wrapper") ?? window;
    }

    const wrapper = document.getElementById("smooth-wrapper");
    if (wrapper) {
        const { overflowY } = getComputedStyle(wrapper);
        const scrolls =
            (overflowY === "auto" || overflowY === "scroll") &&
            wrapper.scrollHeight > wrapper.clientHeight + 1;
        if (scrolls) return wrapper;
    }

    return window;
}

function readScrollY(): number {
    const smoother = ScrollSmoother.get();
    if (smoother) return smoother.scrollTop();

    const target = getScrollTarget();
    if (target === window) {
        return window.scrollY || document.documentElement.scrollTop;
    }

    return (target as HTMLElement).scrollTop;
}

interface Options {
    disabled?: boolean;
    topThreshold?: number;
    deltaThreshold?: number;
}

/**
 * Returns true when the navbar pill should be visible.
 * Hides on scroll down, shows on scroll up; always visible near the top.
 */
export function useScrollDirectionVisibility({
    disabled = false,
    topThreshold = DEFAULT_TOP,
    deltaThreshold = DEFAULT_DELTA,
}: Options = {}) {
    const [visible, setVisible] = useState(true);
    const lastY = useRef(0);
    const visibleRef = useRef(true);
    const ticking = useRef(false);

    const setVisibility = useCallback((next: boolean) => {
        if (visibleRef.current === next) return;
        visibleRef.current = next;
        setVisible(next);
    }, []);

    useEffect(() => {
        if (disabled) {
            setVisibility(true);
            return;
        }

        lastY.current = readScrollY();

        const applyFromPosition = (y: number) => {
            if (y <= topThreshold) {
                setVisibility(true);
                lastY.current = y;
                return;
            }

            const delta = y - lastY.current;
            if (Math.abs(delta) < deltaThreshold) return;

            setVisibility(delta < 0);
            lastY.current = y;
        };

        const scrollTarget = getScrollTarget();
        let scrollTrigger: ScrollTrigger | undefined;

        if (scrollTarget !== window) {
            scrollTrigger = ScrollTrigger.create({
                scroller: scrollTarget,
                start: 0,
                end: "max",
                onUpdate(self) {
                    const y = self.scroll();
                    if (y <= topThreshold) {
                        setVisibility(true);
                        lastY.current = y;
                        return;
                    }
                    if (self.direction === 1) setVisibility(false);
                    else if (self.direction === -1) setVisibility(true);
                    lastY.current = y;
                },
            });

            return () => {
                scrollTrigger?.kill();
            };
        }

        const evaluate = () => {
            ticking.current = false;
            applyFromPosition(readScrollY());
        };

        const onScroll = () => {
            if (ticking.current) return;
            ticking.current = true;
            requestAnimationFrame(evaluate);
        };

        if (scrollTarget === window) {
            window.addEventListener("scroll", onScroll, { passive: true });
        } else {
            scrollTarget.addEventListener("scroll", onScroll, { passive: true });
        }

        return () => {
            scrollTrigger?.kill();
            if (scrollTarget === window) {
                window.removeEventListener("scroll", onScroll);
            } else {
                scrollTarget.removeEventListener("scroll", onScroll);
            }
        };
    }, [disabled, topThreshold, deltaThreshold, setVisibility]);

    return visible;
}
