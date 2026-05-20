import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const useScrollTriggerRefresh = (debounceMs = 150) => {
    useEffect(() => {
        let t: ReturnType<typeof setTimeout> | null = null;
        const trigger = () => {
            if (t) clearTimeout(t);
            t = setTimeout(() => ScrollTrigger.refresh(true), debounceMs);
        };

        window.addEventListener("resize", trigger);
        window.addEventListener("orientationchange", trigger);
        return () => {
            if (t) clearTimeout(t);
            window.removeEventListener("resize", trigger);
            window.removeEventListener("orientationchange", trigger);
        };
    }, [debounceMs]);
};

export default useScrollTriggerRefresh;
