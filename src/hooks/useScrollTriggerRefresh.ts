import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const useScrollTriggerRefresh = (debounceMs = 150) => {
    useEffect(() => {
        let t: ReturnType<typeof setTimeout> | null = null;
        let lastWidth = window.innerWidth;

        const trigger = () => {
            const currentWidth = window.innerWidth;
            if (currentWidth === lastWidth) return;
            lastWidth = currentWidth;

            if (t) clearTimeout(t);
            t = setTimeout(() => ScrollTrigger.refresh(true), debounceMs);
        };

        const onOrientationChange = () => {
            if (t) clearTimeout(t);
            t = setTimeout(() => ScrollTrigger.refresh(true), debounceMs);
        };

        window.addEventListener("resize", trigger);
        window.addEventListener("orientationchange", onOrientationChange);

        return () => {
            if (t) clearTimeout(t);
            window.removeEventListener("resize", trigger);
            window.removeEventListener("orientationchange", onOrientationChange);
        };
    }, [debounceMs]);
};

export default useScrollTriggerRefresh;
