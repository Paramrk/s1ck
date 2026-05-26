import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const pinVideo = "https://pub-14765fe2465f48c99a2845f3997a3cb2.r2.dev/pin-video.mp4";

const CLIP_RADIUS_START = 6;
const CLIP_RADIUS_END = 100;
const RING_THICKNESS_PCT = 0.28;

type CircleCenter = { x: string; y: string };

const circleClip = (radiusPct: number, center: CircleCenter = { x: "50%", y: "50%" }) =>
    `circle(${radiusPct}% at ${center.x} ${center.y})`;

const circleRingGradient = (radiusPct: number, center: CircleCenter = { x: "50%", y: "50%" }) => {
    const inner = Math.max(0, radiusPct - 0.02);
    const outer = radiusPct + RING_THICKNESS_PCT;
    return `radial-gradient(circle at ${center.x} ${center.y}, transparent ${inner}%, #111111 ${radiusPct}%, #111111 ${outer}%, transparent ${outer}%)`;
};

const getClipRadiusPct = (radiusPx: number, width: number, height: number) => {
    const ref = Math.hypot(width, height) / Math.SQRT2;
    return (radiusPx / ref) * 100;
};

const ClockIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const ShieldIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const VideoPin = () => {
    const desktopOverlayRef = useRef<HTMLDivElement>(null);
    const leftCardRef = useRef<HTMLDivElement>(null);
    const rightCardRef = useRef<HTMLDivElement>(null);
    const circleGroupRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const pinHoleRef = useRef<HTMLDivElement>(null);
    const ringLayerRef = useRef<HTMLDivElement>(null);

    const mobileOverlayRef = useRef<HTMLDivElement>(null);
    const mobCircleAnchorRef = useRef<HTMLDivElement>(null);
    const mobPinStageRef = useRef<HTMLDivElement>(null);
    const mobPinHoleRef = useRef<HTMLDivElement>(null);
    const mobRingLayerRef = useRef<HTMLDivElement>(null);
    const mobVideoRef = useRef<HTMLVideoElement>(null);

    const mobileMetricsRef = useRef({ center: { x: "50%", y: "50%" }, startRadius: CLIP_RADIUS_START });

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        video.pause();
        video.currentTime = 0;
    }, []);

    useGSAP(() => {
        const syncVideoToScroll = (video: HTMLVideoElement | null, progress: number) => {
            if (!video) return;

            if (progress > 0.01) {
                if (video.paused) {
                    video.play().catch(() => {});
                }
            } else {
                video.pause();
                video.currentTime = 0;
            }
        };

        const computeMobileMetrics = () => {
            const stage = mobPinStageRef.current;
            const anchor = mobCircleAnchorRef.current;
            if (!stage || !anchor) {
                return { center: { x: "50%", y: "50%" }, startRadius: CLIP_RADIUS_START };
            }

            const stageRect = stage.getBoundingClientRect();
            const anchorRect = anchor.getBoundingClientRect();
            const cx = ((anchorRect.left + anchorRect.width / 2 - stageRect.left) / stageRect.width) * 100;
            const cy = ((anchorRect.top + anchorRect.height / 2 - stageRect.top) / stageRect.height) * 100;
            const radiusPx = anchorRect.width / 2;

            return {
                center: { x: `${cx}%`, y: `${cy}%` },
                startRadius: getClipRadiusPct(radiusPx, stageRect.width, stageRect.height),
            };
        };

        const applyPinCircle = (
            hole: HTMLDivElement | null,
            ring: HTMLDivElement | null,
            radiusPct: number,
            center: CircleCenter,
        ) => {
            const clip = circleClip(radiusPct, center);
            if (hole) {
                hole.style.clipPath = clip;
                (hole.style as CSSStyleDeclaration & { webkitClipPath?: string }).webkitClipPath = clip;
            }
            if (ring) {
                ring.style.background = circleRingGradient(radiusPct, center);
            }
        };

        const addCircleGrow = (
            tl: gsap.core.Timeline,
            hole: HTMLDivElement | null,
            ring: HTMLDivElement | null,
            center: CircleCenter,
            startRadius: number,
            endRadius = CLIP_RADIUS_END,
        ) => {
            if (!hole || !ring) return;

            const radius = { value: startRadius };
            applyPinCircle(hole, ring, startRadius, center);

            tl.to(
                radius,
                {
                    value: endRadius,
                    ease: "power1.inOut",
                    duration: 1,
                    onUpdate: () => applyPinCircle(hole, ring, radius.value, center),
                },
                0,
            );
        };

        const fadeIntroUi = (tl: gsap.core.Timeline, overlay: HTMLDivElement | null, hint?: HTMLDivElement | null) => {
            const fadeTargets = hint
                ? [overlay, hint].filter(Boolean)
                : [overlay].filter(Boolean);
            tl.to(fadeTargets, {
                opacity: 0,
                y: -25,
                ease: "power1.inOut",
                duration: 0.2,
            }, 0);
        };

        const fadeMobileScrollUi = (tl: gsap.core.Timeline) => {
            const hint = mobCircleAnchorRef.current;
            tl.to(
                [".benefit-mobile-top", ".benefit-mobile-bottom", hint].filter(Boolean),
                {
                    autoAlpha: 0,
                    y: -20,
                    ease: "power1.inOut",
                    duration: 0.15,
                },
                0,
            );
        };

        const syncMobileHintInvert = (progress: number) => {
            const hint = mobCircleAnchorRef.current;
            if (!hint) return;
            hint.classList.toggle("is-inverting", progress > 0.001);
        };

        const fadeRingOnScroll = (ring: HTMLDivElement | null, started: { value: boolean }) => {
            if (!ring) return;

            return (progress: number) => {
                if (progress > 0.001) {
                    if (!started.value) {
                        started.value = true;
                        gsap.to(ring, {
                            opacity: 0,
                            duration: 0.1,
                            ease: "power3.in",
                            overwrite: true,
                        });
                    }
                } else if (started.value) {
                    started.value = false;
                    gsap.killTweensOf(ring);
                    gsap.set(ring, { opacity: 1 });
                }
            };
        };

        const mm = gsap.matchMedia();

        mm.add("(min-width: 1024px)", () => {
            const center = { x: "50%", y: "50%" };
            applyPinCircle(pinHoleRef.current, ringLayerRef.current, CLIP_RADIUS_START, center);

            const desktopRingFade = { value: false };
            const fadeDesktopRing = fadeRingOnScroll(ringLayerRef.current, desktopRingFade);

            const vpTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".video-wrapper",
                    start: "0px top",
                    end: "2500px top",
                    scrub: 1.5,
                    pin: true,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        syncVideoToScroll(videoRef.current, self.progress);
                        fadeDesktopRing?.(self.progress);
                    },
                },
            });

            addCircleGrow(vpTl, pinHoleRef.current, ringLayerRef.current, center, CLIP_RADIUS_START);
            fadeIntroUi(vpTl, desktopOverlayRef.current, circleGroupRef.current);

            vpTl.to([leftCardRef.current, rightCardRef.current], {
                opacity: 0,
                y: -30,
                ease: "power1.inOut",
                duration: 0.15,
            }, 0);
        });

        mm.add("(max-width: 1023px)", () => {
            const refreshMobileCircle = () => {
                mobileMetricsRef.current = computeMobileMetrics();
                applyPinCircle(
                    mobPinHoleRef.current,
                    mobRingLayerRef.current,
                    mobileMetricsRef.current.startRadius,
                    mobileMetricsRef.current.center,
                );
            };

            refreshMobileCircle();

            const overlay = mobileOverlayRef.current;
            const hint = mobCircleAnchorRef.current;
            if (overlay) gsap.set(overlay, { autoAlpha: 1, y: 0 });
            if (hint) gsap.set(hint, { autoAlpha: 1, y: 0, clearProps: "transform" });

            const mobileRingFade = { value: false };
            const fadeMobileRing = fadeRingOnScroll(mobRingLayerRef.current, mobileRingFade);

            const vpTlMob = gsap.timeline({
                scrollTrigger: {
                    trigger: ".benefit-section .video-wrapper",
                    start: "0px top",
                    end: "1400px top",
                    scrub: 1.5,
                    pin: true,
                    invalidateOnRefresh: true,
                    onRefresh: () => {
                        refreshMobileCircle();
                    },
                    onUpdate: (self) => {
                        syncVideoToScroll(mobVideoRef.current, self.progress);
                        fadeMobileRing?.(self.progress);
                        syncMobileHintInvert(self.progress);
                    },
                },
            });

            addCircleGrow(
                vpTlMob,
                mobPinHoleRef.current,
                mobRingLayerRef.current,
                mobileMetricsRef.current.center,
                mobileMetricsRef.current.startRadius,
            );
            fadeMobileScrollUi(vpTlMob);

            requestAnimationFrame(refreshMobileCircle);
        });

        const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 200);

        return () => {
            window.clearTimeout(refreshId);
            mm.revert();
        };
    }, []);

    return (
        <>
            {/* Mobile — scroll pin circle reveal aligned to Scroll to Discover */}
            <div className="lg:hidden video-pin-root h-dvh overflow-hidden relative w-full bg-white">
                <div ref={mobPinStageRef} className="benefit-pin-stage absolute inset-0 z-[100]">
                    <div
                        ref={mobPinHoleRef}
                        className="benefit-pin-hole absolute inset-0"
                    >
                        <video
                            ref={mobVideoRef}
                            src={pinVideo}
                            playsInline
                            muted
                            loop
                            preload="metadata"
                            className="benefit-pin-video"
                        />
                    </div>

                    <div
                        ref={mobRingLayerRef}
                        className="benefit-pin-ring absolute inset-0 z-20 pointer-events-none opacity-100"
                        aria-hidden
                    />
                </div>

                <div
                    ref={mobileOverlayRef}
                    className="benefit-mobile-overlay absolute inset-0 z-[200] flex flex-col items-center justify-between pointer-events-none py-16 px-5"
                >
                    <div className="benefit-mobile-top w-full flex flex-col items-center text-center shrink-0 bg-white">
                        <p
                            className="benefit-tagline text-stone text-[0.65rem] uppercase tracking-[0.2em] mb-6"
                            style={{ fontFamily: "Syne, sans-serif", fontWeight: 500 }}
                        >
                            Premium Quality. Maximum Impact
                        </p>

                        <div className="col-center overflow-hidden w-full">
                            <h1 className="benefit-headline general-title text-center text-charcoal">
                                Long-Lasting Formula
                            </h1>
                        </div>

                        <div className="col-center mt-3 w-full">
                            <div
                                className="benefit-banner inline-block bg-sick-red px-5 py-2"
                                style={{ clipPath: "polygon(50% 0%,50% 0%,50% 100%,50% 100%)" }}
                            >
                                <h2
                                    className="text-white text-[clamp(1rem,3vw,2rem)] font-bold uppercase tracking-[0.04em]"
                                    style={{ fontFamily: "Syne, sans-serif" }}
                                >
                                    48mg Pheromone-Infused Blend
                                </h2>
                            </div>
                        </div>

                        <div className="benefit-labels-row flex items-center justify-center gap-6 mt-8 w-full">
                            <div className="benefit-label flex items-center gap-3">
                                <span className="block w-6 h-px bg-charcoal" />
                                <span
                                    className="text-[0.6rem] uppercase tracking-[0.15em] text-stone"
                                    style={{ fontFamily: "Syne, sans-serif", fontWeight: 500 }}
                                >
                                    93% Raw Materials
                                </span>
                            </div>
                            <div className="benefit-label flex items-center gap-3">
                                <span
                                    className="text-[0.6rem] uppercase tracking-[0.15em] text-stone"
                                    style={{ fontFamily: "Syne, sans-serif", fontWeight: 500 }}
                                >
                                    Luxury Grade Fragrance Oils
                                </span>
                                <span className="block w-6 h-px bg-charcoal" />
                            </div>
                        </div>
                    </div>

                    <div className="col-center shrink-0">
                        <div
                            ref={mobCircleAnchorRef}
                            className="benefit-mobile-circle-anchor benefit-mobile-scroll-hint size-[5.5rem] rounded-full flex flex-col items-center justify-center pointer-events-none bg-white z-[210]"
                        >
                            <p
                                className="benefit-scroll-hint-stack text-[0.45rem] tracking-[0.14em] mb-0 w-full text-center"
                                style={{ fontFamily: "Syne, sans-serif", fontWeight: 500 }}
                            >
                                <span>Scroll</span>
                                <span>to</span>
                                <span>discover</span>
                            </p>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="benefit-scroll-arrow mt-0.5 shrink-0 animate-bounce" aria-hidden>
                                <path d="M6 1v10M6 11l4-4M6 11L2 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <div className="benefit-mobile-bottom w-full shrink-0 bg-white">
                        <div className="benefit-badges-row flex items-start justify-center gap-10">
                            <div className="benefit-badge flex flex-col items-center text-center max-w-[10rem]">
                                <div className="size-8 rounded-full border border-sick-red flex items-center justify-center mb-3">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                </div>
                                <span className="text-[0.55rem] uppercase tracking-[0.12em] text-charcoal leading-relaxed" style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
                                    Designed to Leave a Lasting Impression
                                </span>
                            </div>
                            <div className="benefit-badge flex flex-col items-center text-center max-w-[10rem]">
                                <div className="size-8 rounded-full border border-sick-red flex items-center justify-center mb-3">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                </div>
                                <span className="text-[0.55rem] uppercase tracking-[0.12em] text-charcoal leading-relaxed" style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
                                    Backed by Science, Made to Be Noticed
                                </span>
                            </div>
                        </div>

                        <div className="benefit-bottom col-center mt-10">
                            <div className="flex items-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#DC2626" aria-hidden>
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-stone text-center text-[0.65rem] uppercase tracking-[0.12em]" style={{ fontFamily: "Syne, sans-serif", fontWeight: 500 }}>
                                100,000+ Happy Customers and Counting
                            </p>
                            <p className="text-charcoal text-center text-[0.6rem] uppercase tracking-[0.15em] mt-3" style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
                                Powered by <span className="text-sick-red">Science</span>. Driven by <span className="text-sick-red">Attraction</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop — pinned circle reveal (unchanged) */}
            <div className="hidden lg:block video-pin-root h-dvh overflow-hidden relative w-full bg-white">
                <div className="benefit-pin-stage absolute inset-0 z-[100]">
                    <div
                        ref={pinHoleRef}
                        className="benefit-pin-hole absolute inset-0"
                        style={{ clipPath: circleClip(CLIP_RADIUS_START) }}
                    >
                        <video
                            ref={videoRef}
                            src={pinVideo}
                            playsInline
                            muted
                            loop
                            preload="metadata"
                            className="benefit-pin-video"
                        />
                        <div
                            ref={circleGroupRef}
                            className="benefit-scroll-hint-layer absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
                        >
                            <p
                                className="benefit-scroll-hint-stack text-[0.72rem] uppercase tracking-[0.16em] font-bold text-center"
                                style={{ fontFamily: "Syne, sans-serif", fontWeight: 700 }}
                            >
                                <span>Scroll</span>
                                <span>To</span>
                                <span>Discover</span>
                            </p>
                            <span className="benefit-scroll-arrow mt-1 text-sm leading-none" aria-hidden>↓</span>
                        </div>
                    </div>

                    <div
                        ref={ringLayerRef}
                        className="benefit-pin-ring absolute inset-0 z-20 pointer-events-none opacity-100"
                        style={{ background: circleRingGradient(CLIP_RADIUS_START) }}
                        aria-hidden
                    />
                </div>

                <div ref={leftCardRef} className="hidden lg:flex absolute left-12 top-1/2 -translate-y-1/2 w-80 flex-col pointer-events-auto z-[250] benefit-card">
                    <div className="group relative overflow-hidden rounded-2xl border border-charcoal/5 bg-gradient-to-br from-white/90 to-stone-50/90 backdrop-blur-md p-6 shadow-md hover:-translate-y-1 hover:shadow-xl hover:border-sick-red/20 transition-all duration-500">
                        <div className="absolute -inset-px bg-gradient-to-r from-sick-red/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl -z-10" />
                        <div className="size-12 rounded-full border border-sick-red/20 bg-sick-red/5 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 group-hover:bg-sick-red/10 transition-all duration-500">
                            <ClockIcon />
                        </div>
                        <h3 className="text-xs uppercase tracking-[0.15em] text-charcoal font-bold mb-2 leading-snug" style={{ fontFamily: "Syne, sans-serif" }}>
                            Designed to Leave a Lasting Impression
                        </h3>
                        <p className="text-[0.65rem] text-stone leading-relaxed" style={{ fontFamily: "Syne, sans-serif", fontWeight: 400 }}>
                            An olfactory masterpiece. Every note is precision-blended to linger in the air, ensuring your presence is felt long after you leave.
                        </p>
                    </div>
                </div>

                <div ref={rightCardRef} className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 w-80 flex-col pointer-events-auto z-[250] benefit-card">
                    <div className="group relative overflow-hidden rounded-2xl border border-charcoal/5 bg-gradient-to-br from-white/90 to-stone-50/90 backdrop-blur-md p-6 shadow-md hover:-translate-y-1 hover:shadow-xl hover:border-sick-red/20 transition-all duration-500">
                        <div className="absolute -inset-px bg-gradient-to-r from-sick-red/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl -z-10" />
                        <div className="size-12 rounded-full border border-sick-red/20 bg-sick-red/5 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 group-hover:bg-sick-red/10 transition-all duration-500">
                            <ShieldIcon />
                        </div>
                        <h3 className="text-xs uppercase tracking-[0.15em] text-charcoal font-bold mb-2 leading-snug" style={{ fontFamily: "Syne, sans-serif" }}>
                            Backed by Science, Made to Be Noticed
                        </h3>
                        <p className="text-[0.65rem] text-stone leading-relaxed" style={{ fontFamily: "Syne, sans-serif", fontWeight: 400 }}>
                            Formulated with high-concentration, clinical-grade pheromones that interface naturally with olfactory receptors to amplify subconscious attraction.
                        </p>
                    </div>
                </div>

                <div
                    ref={desktopOverlayRef}
                    className="benefit-text-overlay hidden lg:flex absolute inset-0 flex-col items-center justify-between pointer-events-none z-[200] pt-24 pb-8 px-5"
                >
                    <div className="flex flex-col items-center w-full">
                        <p className="benefit-tagline text-stone text-center text-[0.65rem] uppercase tracking-[0.2em] mb-5" style={{ fontFamily: "Syne, sans-serif", fontWeight: 500 }}>
                            Premium Quality. Maximum Impact
                        </p>

                        <div className="col-center overflow-hidden mb-32">
                            <h1 className="benefit-headline general-title text-center text-charcoal">
                                Long-Lasting Formula
                            </h1>
                        </div>

                        <div className="col-center mt-32">
                            <div className="benefit-banner inline-block bg-sick-red px-8 py-3" style={{ clipPath: "polygon(50% 0%,50% 0%,50% 100%,50% 100%)" }}>
                                <h2 className="text-white text-[clamp(1rem,3vw,2rem)] font-bold uppercase tracking-[0.04em]" style={{ fontFamily: "Syne, sans-serif" }}>
                                    48mg Pheromone-Infused Blend
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center w-full">
                        <div className="benefit-labels-row flex flex-wrap items-center justify-center gap-16 mb-6">
                            <div className="benefit-label flex items-center gap-3">
                                <span className="block w-10 h-px bg-charcoal benefit-line" />
                                <span className="text-[0.6rem] uppercase tracking-[0.15em] text-stone benefit-label-text" style={{ fontFamily: "Syne, sans-serif", fontWeight: 500 }}>93% Raw Materials</span>
                            </div>
                            <div className="benefit-label flex items-center gap-3">
                                <span className="text-[0.6rem] uppercase tracking-[0.15em] text-stone benefit-label-text" style={{ fontFamily: "Syne, sans-serif", fontWeight: 500 }}>Luxury Grade Fragrance Oils</span>
                                <span className="block w-10 h-px bg-charcoal benefit-line" />
                            </div>
                        </div>

                        <div className="flex flex-col items-center benefit-bottom text-center">
                            <div className="flex items-center gap-1.5 mb-2 bg-charcoal/5 px-3 py-1 rounded-full border border-charcoal/10 backdrop-blur-sm benefit-rating-stars-bg">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="#DC2626" aria-hidden>
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                ))}
                                <span className="text-[0.45rem] font-bold text-charcoal uppercase tracking-wider ml-1 benefit-rating-badge" style={{ fontFamily: "Syne, sans-serif" }}>5.0 Rating</span>
                            </div>
                            <p className="text-stone text-[0.55rem] uppercase tracking-[0.15em] mb-1 benefit-rating-text" style={{ fontFamily: "Syne, sans-serif", fontWeight: 500 }}>
                                100,000+ Happy Customers and Counting
                            </p>
                            <p className="text-charcoal text-[0.65rem] uppercase tracking-[0.2em] font-bold benefit-rating-title" style={{ fontFamily: "Syne, sans-serif" }}>
                                Powered by <span className="text-sick-red font-black">Science</span>. Driven by <span className="text-sick-red font-black">Attraction</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VideoPin;
