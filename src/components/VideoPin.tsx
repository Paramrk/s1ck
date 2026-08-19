import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { getVideo } from "../utils/media";
import TickingClock from "./TickingClock";

const pinVideo = getVideo("video-1.mp4") || "https://pub-14765fe2465f48c99a2845f3997a3cb2.r2.dev/pin-video.mp4";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

// Deterministic random generator for reproducible particle distribution
function createSeededRandom(seed: number) {
    let s = seed;
    return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

interface SprayParticle {
    angle: number;       // Cone dispersion angle in radians
    speed: number;       // Velocity multiplier
    distance: number;    // Normalized reach (0.35 to 1.35)
    size: number;        // Particle radius (px)
    alpha: number;       // Base opacity
    wobbleFreq: number;  // Turbulence frequency
    wobbleAmp: number;   // Turbulence amplitude
    yDrift: number;      // Vertical gravity/drift bias
    type: "droplet" | "mist" | "core" | "streak";
}

// Generate rich particle set matching aerosol perfume spray nozzle
const generateParticles = (count = 1600): SprayParticle[] => {
    const rng = createSeededRandom(59281);
    const particles: SprayParticle[] = [];

    for (let i = 0; i < count; i++) {
        const u = rng() + rng() - 1; // Triangular distribution near 0
        const maxSpread = 0.66;      // ~38 degrees cone half-angle
        const angle = u * maxSpread;

        const dist = 0.35 + rng() * 0.95;
        const speed = 0.8 + rng() * 0.6;
        const pType = i < count * 0.2 ? "core" : i < count * 0.7 ? "droplet" : i < count * 0.9 ? "mist" : "streak";

        let size = 1.4;
        let alpha = 0.9;

        if (pType === "core") {
            size = 1.2 + rng() * 2.0;
            alpha = 0.8 + rng() * 0.2;
        } else if (pType === "droplet") {
            size = 1.0 + rng() * 3.0;
            alpha = 0.7 + rng() * 0.3;
        } else if (pType === "mist") {
            size = 3.0 + rng() * 8.0;
            alpha = 0.15 + rng() * 0.25;
        } else {
            size = 1.2 + rng() * 2.0;
            alpha = 0.6 + rng() * 0.4;
        }

        particles.push({
            angle,
            speed,
            distance: dist,
            size,
            alpha,
            wobbleFreq: 1.5 + rng() * 3.5,
            wobbleAmp: (rng() - 0.5) * 16,
            yDrift: (rng() - 0.5) * 0.25,
            type: pType,
        });
    }

    return particles;
};

const PARTICLES = generateParticles(1600);

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
    // Desktop refs
    const desktopUiRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Mobile refs
    const mobileUiRef = useRef<HTMLDivElement>(null);
    const mobVideoRef = useRef<HTMLVideoElement>(null);
    const mobCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const vid = videoRef.current;
        const mobVid = mobVideoRef.current;
        if (vid) {
            vid.pause();
            vid.currentTime = 0;
        }
        if (mobVid) {
            mobVid.pause();
            mobVid.currentTime = 0;
        }
    }, []);

    useGSAP(() => {
        // Canvas Spray Renderer with Transparent Droplets & Mist revealing background video
        const renderTransparentSprayOnCanvas = (
            canvas: HTMLCanvasElement | null,
            sprayProgress: number,
        ) => {
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const width = canvas.width;
            const height = canvas.height;
            ctx.clearRect(0, 0, width, height);

            // Phase 1 (spray hasn't started): solid white background covers video
            if (sprayProgress <= 0.001) {
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, width, height);
                return;
            }

            // Phase 3 (spray fully complete): canvas is 100% transparent, full video visible
            if (sprayProgress >= 0.985) {
                return;
            }

            // 1. Draw solid white foreground layer
            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, width, height);

            // Nozzle origin on the left middle
            const nozzleX = -width * 0.02;
            const nozzleY = height * 0.5;

            // 2. Erase holes through white layer (destination-out) so background video is seen inside droplets & mist!
            ctx.globalCompositeOperation = "destination-out";

            // A. Expanding mist plume apertures
            const puffCount = 22;
            for (let i = 0; i < puffCount; i++) {
                const puffProgress = clamp(sprayProgress * (1.18 - (i / puffCount) * 0.28), 0, 1);
                if (puffProgress <= 0) continue;

                const angle = ((i - puffCount / 2) / (puffCount / 2)) * 0.62;
                const d = puffProgress * width * (0.32 + (i % 5) * 0.16);
                const px = nozzleX + Math.cos(angle) * d;
                const py = nozzleY + Math.sin(angle) * d * (height / width * 1.25);
                const radius = Math.max(30, puffProgress * width * (0.18 + (i % 4) * 0.08));

                const grad = ctx.createRadialGradient(px, py, 0, px, py, radius);
                const puffAlpha = clamp(sprayProgress * 1.3, 0, 1) * 0.85;
                grad.addColorStop(0, `rgba(0, 0, 0, ${puffAlpha})`);
                grad.addColorStop(0.55, `rgba(0, 0, 0, ${puffAlpha * 0.65})`);
                grad.addColorStop(1, "rgba(0, 0, 0, 0)");

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(px, py, radius, 0, Math.PI * 2);
                ctx.fill();
            }

            // B. High-speed directional jet streaks (cut transparent slits through white)
            const streakCount = 18;
            ctx.save();
            ctx.lineWidth = 3.5;
            for (let j = 0; j < streakCount; j++) {
                const angle = ((j - streakCount / 2) / (streakCount / 2)) * 0.44;
                const len = clamp(sprayProgress * width * 0.6 * (0.8 + (j % 4) * 0.15), 0, width * 0.7);
                const endX = nozzleX + Math.cos(angle) * len;
                const endY = nozzleY + Math.sin(angle) * len * (height / width * 1.15);

                const streakGrad = ctx.createLinearGradient(nozzleX, nozzleY, endX, endY);
                const streakAlpha = clamp(sprayProgress * 1.4, 0, 1) * 0.9;
                streakGrad.addColorStop(0, `rgba(0, 0, 0, ${streakAlpha})`);
                streakGrad.addColorStop(0.4, `rgba(0, 0, 0, ${streakAlpha * 0.7})`);
                streakGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

                ctx.strokeStyle = streakGrad;
                ctx.beginPath();
                ctx.moveTo(nozzleX, nozzleY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }
            ctx.restore();

            // C. Cut transparent droplet circles through the white layer (showing video inside every droplet!)
            for (let i = 0; i < PARTICLES.length; i++) {
                const p = PARTICLES[i];
                const pTravel = clamp(sprayProgress * p.speed * 1.25, 0, 1.4);
                if (pTravel <= 0) continue;

                const distancePx = pTravel * width * p.distance;
                const wobble = Math.sin(pTravel * p.wobbleFreq * Math.PI) * p.wobbleAmp;

                const x = nozzleX + Math.cos(p.angle) * distancePx;
                const y = nozzleY + Math.sin(p.angle) * distancePx * (height / width * 1.18) + wobble + p.yDrift * distancePx * 0.2;

                if (x < -10 || x > width + 30 || y < -30 || y > height + 30) continue;

                const distFade = clamp(1.2 - distancePx / (width * 1.3), 0, 1);
                const alpha = p.alpha * distFade;

                if (alpha <= 0.01) continue;

                const dropletRadius = p.size * (1.2 + sprayProgress * 0.7);
                ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
                ctx.beginPath();
                ctx.arc(x, y, dropletRadius, 0, Math.PI * 2);
                ctx.fill();
            }

            // D. Full-screen fill wash when spray reaches terminal coverage
            if (sprayProgress > 0.6) {
                const fillProgress = (sprayProgress - 0.6) / 0.4; // 0 to 1
                const fillGrad = ctx.createLinearGradient(0, 0, width, 0);
                const fillAlpha = fillProgress * 0.95;
                fillGrad.addColorStop(0, `rgba(0, 0, 0, ${fillAlpha})`);
                fillGrad.addColorStop(clamp(fillProgress * 1.1, 0, 1), `rgba(0, 0, 0, ${fillAlpha * 0.85})`);
                fillGrad.addColorStop(1, `rgba(0, 0, 0, ${fillAlpha * 0.5})`);

                ctx.fillStyle = fillGrad;
                ctx.fillRect(0, 0, width, height);
            }

            // 3. Draw physical liquid droplet highlights & subtle mist borders on top
            ctx.globalCompositeOperation = "source-over";

            // Subtle liquid droplet specular glint & dark rim
            for (let i = 0; i < PARTICLES.length; i += 2) {
                const p = PARTICLES[i];
                const pTravel = clamp(sprayProgress * p.speed * 1.25, 0, 1.4);
                if (pTravel <= 0) continue;

                const distancePx = pTravel * width * p.distance;
                const wobble = Math.sin(pTravel * p.wobbleFreq * Math.PI) * p.wobbleAmp;

                const x = nozzleX + Math.cos(p.angle) * distancePx;
                const y = nozzleY + Math.sin(p.angle) * distancePx * (height / width * 1.18) + wobble + p.yDrift * distancePx * 0.2;

                if (x < -10 || x > width + 30 || y < -30 || y > height + 30) continue;

                const dropletRadius = p.size * (1.2 + sprayProgress * 0.7);

                ctx.strokeStyle = `rgba(30, 35, 45, ${p.alpha * 0.35})`;
                ctx.lineWidth = 0.75;
                ctx.beginPath();
                ctx.arc(x, y, dropletRadius, 0, Math.PI * 2);
                ctx.stroke();

                if (dropletRadius > 1.8) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.6})`;
                    ctx.beginPath();
                    ctx.arc(x - dropletRadius * 0.3, y - dropletRadius * 0.3, dropletRadius * 0.28, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        };

        const setupCanvasSize = (canvas: HTMLCanvasElement | null) => {
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(rect.width * dpr);
            canvas.height = Math.round(rect.height * dpr);
        };

        // Complete UI fade & removal strictly before spray starts
        const updateUiFade = (uiContainer: HTMLDivElement | null, progress: number, fadeOutEnd = 0.08) => {
            if (!uiContainer) return;

            if (progress <= 0.001) {
                uiContainer.style.opacity = "1";
                uiContainer.style.visibility = "visible";
                uiContainer.style.pointerEvents = "auto";
                uiContainer.style.transform = "translateY(0px)";
            } else if (progress < fadeOutEnd) {
                const fade = clamp(1 - (progress / fadeOutEnd), 0, 1);
                uiContainer.style.opacity = String(fade);
                uiContainer.style.visibility = "visible";
                uiContainer.style.pointerEvents = fade > 0.4 ? "auto" : "none";
                uiContainer.style.transform = `translateY(${-progress * 150}px)`;
            } else {
                // 100% completely hidden & removed - NO ghosting or text showing
                uiContainer.style.opacity = "0";
                uiContainer.style.visibility = "hidden";
                uiContainer.style.pointerEvents = "none";
                uiContainer.style.transform = `translateY(${-fadeOutEnd * 150}px)`;
            }
        };

        // Handle continuous video playback strictly AFTER spray has completed (not scrubbed by scroll)
        const handleVideoPlayback = (
            video: HTMLVideoElement | null,
            overallProgress: number,
            sprayCompletionThreshold = 0.55,
        ) => {
            if (!video) return;

            // Before spray finishes: pause and reset to start
            if (overallProgress < sprayCompletionThreshold) {
                if (!video.paused) {
                    video.pause();
                }
                video.currentTime = 0;
                return;
            }

            // Once spray completes: continuously play video naturally
            if (video.paused) {
                video.play().catch(() => {});
            }
        };

        const mm = gsap.matchMedia();

        // ─── DESKTOP (min-width: 1024px) ───
        mm.add("(min-width: 1024px)", () => {
            setupCanvasSize(canvasRef.current);
            renderTransparentSprayOnCanvas(canvasRef.current, 0);
            updateUiFade(desktopUiRef.current, 0);

            ScrollTrigger.create({
                trigger: ".video-wrapper",
                start: "0px top",
                end: "2800px top",
                scrub: 1.2,
                pin: true,
                invalidateOnRefresh: true,
                onRefresh: () => {
                    setupCanvasSize(canvasRef.current);
                },
                onUpdate: (self) => {
                    const progress = self.progress;

                    // 1. First text disappears completely & smoothly: 0.00 -> 0.08
                    updateUiFade(desktopUiRef.current, progress, 0.08);

                    // 2. Then spray comes with transparent droplets showing background video: 0.12 -> 0.55
                    const sprayP = clamp((progress - 0.12) / 0.43, 0, 1);
                    renderTransparentSprayOnCanvas(canvasRef.current, sprayP);

                    // 3. Then full video comes smoothly from the spray mist and plays: 0.55 -> 1.00
                    handleVideoPlayback(videoRef.current, progress, 0.55);
                },
            });
        });

        // ─── MOBILE (max-width: 1023px) ───
        mm.add("(max-width: 1023px)", () => {
            setupCanvasSize(mobCanvasRef.current);
            renderTransparentSprayOnCanvas(mobCanvasRef.current, 0);
            updateUiFade(mobileUiRef.current, 0);

            ScrollTrigger.create({
                trigger: ".benefit-section .video-wrapper",
                start: "0px top",
                end: "2000px top",
                scrub: 1.2,
                pin: true,
                invalidateOnRefresh: true,
                onRefresh: () => {
                    setupCanvasSize(mobCanvasRef.current);
                },
                onUpdate: (self) => {
                    const progress = self.progress;

                    // 1. First text disappears completely & smoothly: 0.00 -> 0.08
                    updateUiFade(mobileUiRef.current, progress, 0.08);

                    // 2. Then spray comes with transparent droplets showing background video: 0.12 -> 0.55
                    const sprayP = clamp((progress - 0.12) / 0.43, 0, 1);
                    renderTransparentSprayOnCanvas(mobCanvasRef.current, sprayP);

                    // 3. Then full video comes smoothly from the spray mist and plays: 0.55 -> 1.00
                    handleVideoPlayback(mobVideoRef.current, progress, 0.55);
                },
            });
        });

        const handleResize = () => {
            setupCanvasSize(canvasRef.current);
            setupCanvasSize(mobCanvasRef.current);
            ScrollTrigger.refresh();
        };
        window.addEventListener("resize", handleResize);

        const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 200);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.clearTimeout(refreshId);
            mm.revert();
        };
    }, []);

    return (
        <>
            {/* ─── MOBILE ─── */}
            <div className="lg:hidden video-pin-root h-dvh overflow-hidden relative w-full bg-white">
                {/* 1. Underlying Background Video */}
                <div className="benefit-video-layer absolute inset-0 z-[100] pointer-events-auto">
                    <video
                        key={pinVideo}
                        src={pinVideo}
                        ref={mobVideoRef}
                        playsInline
                        muted
                        loop
                        preload="auto"
                        className="benefit-pin-video w-full h-full object-cover"
                    />
                </div>

                {/* 2. White Stage with Transparent Spray Droplets & Mist Cutout Layer */}
                <canvas
                    ref={mobCanvasRef}
                    className="benefit-spray-canvas absolute inset-0 z-[110] pointer-events-none w-full h-full"
                    aria-hidden
                />

                {/* 3. Master Mobile UI Container (Fades out and completely vanishes first) */}
                <div
                    ref={mobileUiRef}
                    className="benefit-mobile-ui-master absolute inset-0 z-[200] flex flex-col items-center justify-between py-16 px-5"
                >
                    <div className="benefit-mobile-top w-full flex flex-col items-center text-center shrink-0">
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

                    <div className="col-center shrink-0 flex flex-col items-center gap-3">
                        <div className="benefit-mobile-circle-anchor benefit-center-clock rounded-full flex items-center justify-center pointer-events-none bg-white z-[210] shadow-[0_6px_24px_rgba(0,0,0,0.07)] border border-charcoal/5 p-1.5">
                            <TickingClock size={72} />
                        </div>
                        <div className="benefit-mobile-scroll-hint flex flex-col items-center pointer-events-none">
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

                    <div className="benefit-mobile-bottom w-full shrink-0">
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

            {/* ─── DESKTOP ─── */}
            <div className="hidden lg:block video-pin-root h-dvh overflow-hidden relative w-full bg-white">
                {/* 1. Underlying Background Video */}
                <div className="benefit-video-layer absolute inset-0 z-[100] pointer-events-auto">
                    <video
                        key={pinVideo}
                        src={pinVideo}
                        ref={videoRef}
                        playsInline
                        muted
                        loop
                        preload="auto"
                        className="benefit-pin-video w-full h-full object-cover"
                    />
                </div>

                {/* 2. White Stage with Transparent Spray Droplets & Mist Cutout Layer */}
                <canvas
                    ref={canvasRef}
                    className="benefit-spray-canvas absolute inset-0 z-[110] pointer-events-none w-full h-full"
                    aria-hidden
                />

                {/* 3. Master Desktop UI Container (Fades out and completely vanishes first) */}
                <div
                    ref={desktopUiRef}
                    className="benefit-desktop-ui-master absolute inset-0 z-[200] pointer-events-none"
                >
                    {/* Center clock — kept outside blend layer so it stays clean during scroll */}
                    <div className="benefit-center-stack absolute inset-0 z-[210] flex flex-col items-center justify-center pointer-events-none">
                        <div className="benefit-center-clock rounded-full bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-charcoal/5 p-3">
                            <TickingClock size={132} />
                        </div>
                        <div className="benefit-scroll-hint-layer mt-4 flex flex-col items-center">
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

                    {/* Left Benefit Card */}
                    <div className="hidden lg:flex absolute left-12 top-1/2 -translate-y-1/2 w-80 flex-col pointer-events-auto z-[250] benefit-card">
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

                    {/* Right Benefit Card */}
                    <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 w-80 flex-col pointer-events-auto z-[250] benefit-card">
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

                    {/* Desktop Text Overlay */}
                    <div
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
            </div>
        </>
    );
};

export default VideoPin;
