import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState, type ReactNode } from "react";

type DeferredSectionProps = {
    children: ReactNode;
    /** Placeholder height so layout stays stable before mount */
    minHeight?: string;
    rootMargin?: string;
};

/**
 * Mounts children only when the placeholder nears the viewport,
 * so below-the-fold GSAP / SplitText init does not block the hero.
 */
const DeferredSection = ({
    children,
    minHeight = "80vh",
    rootMargin = "280px 0px",
}: DeferredSectionProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || mounted) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setMounted(true);
                    observer.disconnect();
                }
            },
            { rootMargin, threshold: 0 },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [mounted, rootMargin]);

    useEffect(() => {
        if (!mounted) return;
        const id = requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => cancelAnimationFrame(id);
    }, [mounted]);

    return (
        <div ref={ref} style={mounted ? undefined : { minHeight }}>
            {mounted ? children : null}
        </div>
    );
};

export default DeferredSection;
