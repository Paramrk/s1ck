import { useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText, ScrollTrigger } from "gsap/all";
import { Link } from "react-router-dom";
import { getImage } from "../utils/media";
import AffiliateSection from "./AffiliateSection";
import WholesalerSection from "./WholesalerSection";

gsap.registerPlugin(ScrollTrigger);

const FooterSection = ({
    hideAffiliateTeaser = false,
    hideVipTeaser = false,
    hideWholesalerTeaser = false,
}: {
    hideAffiliateTeaser?: boolean;
    hideVipTeaser?: boolean;
    hideWholesalerTeaser?: boolean;
}) => {

    useGSAP(() => {
        const mm = gsap.matchMedia();

        const buildTitle = (mobile: boolean) => {
            const run = () => {
                if (mobile) {
                    gsap.utils.toArray<HTMLElement>(".footer-title-line").forEach((line) => {
                        const split = SplitText.create(line, { type: "chars" });
                        gsap.from(split.chars, {
                            yPercent: 100,
                            opacity: 0,
                            stagger: 0.018,
                            ease: "power2.out",
                            duration: 0.65,
                            scrollTrigger: {
                                trigger: ".footer-title-mobile",
                                start: "top 92%",
                                toggleActions: "play none none none",
                                once: true,
                            },
                        });
                    });
                    return;
                }

                const footTextSplit = SplitText.create(".footer-title-desktop", { type: "chars" });

                gsap.from(footTextSplit.chars, {
                    yPercent: 200,
                    stagger: 0.02,
                    ease: "power1.inOut",
                    zIndex: 0,
                    scrollTrigger: {
                        trigger: ".footer-section",
                        start: "top 50%",
                        end: "top 10%",
                        scrub: 1.5,
                    },
                });
            };

            if (mobile) {
                run();
                document.fonts?.ready?.then(() => ScrollTrigger.refresh());
            } else {
                document.fonts.ready.then(run);
            }
        };

        const buildMobileFooterUi = () => {
            const run = () => {
                const vipBlock = ".footer-vip-block";

                if (!hideVipTeaser) {
                    gsap.from(`${vipBlock} > *`, {
                    opacity: 0,
                    y: 28,
                    stagger: 0.07,
                    ease: "power2.out",
                    duration: 0.55,
                    scrollTrigger: {
                        trigger: vipBlock,
                        start: "top 90%",
                        toggleActions: "play none none none",
                        once: true,
                    },
                });
                }

                gsap.from(".social-btn", {
                    opacity: 0,
                    scale: 0.85,
                    stagger: 0.05,
                    ease: "power2.out",
                    duration: 0.45,
                    scrollTrigger: {
                        trigger: ".footer-social-row",
                        start: "top 92%",
                        toggleActions: "play none none none",
                        once: true,
                    },
                });

                gsap.from(".footer-links-grid > div", {
                    opacity: 0,
                    x: -24,
                    stagger: 0.06,
                    ease: "power2.out",
                    duration: 0.5,
                    scrollTrigger: {
                        trigger: ".footer-links-grid",
                        start: "top 92%",
                        toggleActions: "play none none none",
                        once: true,
                    },
                });

                gsap.from(".footer-newsletter", {
                    opacity: 0,
                    y: 24,
                    ease: "power2.out",
                    duration: 0.5,
                    scrollTrigger: {
                        trigger: ".footer-newsletter",
                        start: "top 92%",
                        toggleActions: "play none none none",
                        once: true,
                    },
                });

                requestAnimationFrame(() => ScrollTrigger.refresh());
            };

            run();
            document.fonts?.ready?.then(() => ScrollTrigger.refresh());
        };

        mm.add("(min-width: 769px)", () => {
            buildTitle(false);
        });

        mm.add("(max-width: 768px)", () => {
            buildTitle(true);
            buildMobileFooterUi();
        });

        return () => mm.revert();
    }, [hideVipTeaser]);

    useEffect(() => {
        const resetAffiliateVisibility = () => {
            gsap.set(".footer-affiliate-block, .footer-affiliate-block *", {
                opacity: 1,
                y: 0,
                clearProps: "opacity,transform",
            });
        };
        resetAffiliateVisibility();
        const t1 = window.setTimeout(resetAffiliateVisibility, 100);
        const t2 = window.setTimeout(() => ScrollTrigger.refresh(), 250);
        return () => {
            window.clearTimeout(t1);
            window.clearTimeout(t2);
        };
    }, []);

    return (
        <section className="footer-section lg:pt-20" data-nav-logo="light">

            <div className="footer-hero relative lg:pt-[8vh] pt-10 pb-4">
                <div className="footer-title-wrap px-4">
                    <h1 className="footer-title-desktop hidden md:block general-title text-center text-cream lg:pb-0 pb-5">
                        #STAYDANGEROUS
                    </h1>
                    <h1 className="footer-title-mobile md:hidden text-center text-cream pb-2" aria-label="#STAYDANGEROUS">
                        <span className="footer-title-line">#STAY</span>
                        <span className="footer-title-line">DANGEROUS</span>
                    </h1>
                </div>

                {!hideAffiliateTeaser && <AffiliateSection variant="footer" />}

                {/* VIP Club Banner */}
                {!hideVipTeaser && (
                <div className="footer-vip-block relative z-20 flex flex-col items-center justify-center mt-10 md:mt-24 px-5 text-center">
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-5 md:mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 md:w-7 md:h-7">
                            <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5z" />
                        </svg>
                        <div className="border border-white/30 px-3 py-1 md:px-4 md:py-1.5">
                            <p className="text-white text-[0.58rem] md:text-[0.65rem] tracking-[0.22em] md:tracking-[0.25em] font-bold">EXCLUSIVE ACCESS</p>
                        </div>
                    </div>
                    <h2 className="text-white text-[clamp(1.35rem,5.5vw,1.75rem)] md:text-5xl font-bold uppercase tracking-wide mt-1 md:mt-2 leading-tight" style={{ fontFamily: "Syne, sans-serif" }}>
                        JOIN THE <span className="text-white/50">VIP CLUB</span>
                    </h2>
                    <p className="text-white text-[clamp(1.75rem,8vw,2.25rem)] md:text-7xl font-bold uppercase tracking-wide mt-2 leading-[0.95]" style={{ fontFamily: "Syne, sans-serif" }}>
                        UP TO 35% OFF
                    </p>

                    <div
                        className="footer-vip-perks flex flex-col items-center mt-6 md:mt-8 text-white/70 text-[0.58rem] md:text-[0.65rem] tracking-[0.12em] md:tracking-[0.15em] space-y-1.5 md:space-y-2 uppercase max-w-xs md:max-w-none"
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        <p>PREMIUM FRAGRANCES DELIVERED MONTHLY</p>
                        <p>EXCLUSIVE MEMBER-ONLY COLLECTIONS</p>
                    </div>

                    <Link
                        to="/vip-club"
                        className="relative z-20 mt-8 md:mt-10 bg-white text-black px-8 md:px-10 py-3.5 md:py-4 text-[0.62rem] md:text-[0.7rem] font-bold tracking-[0.18em] md:tracking-[0.2em] hover:opacity-80 transition-all uppercase inline-flex items-center gap-2"
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        UNLOCK VIP STATUS <span aria-hidden>&rarr;</span>
                    </Link>
                </div>
                )}

                {!hideWholesalerTeaser && <WholesalerSection variant="footer" />}

                <div className="footer-brand-row relative z-20 mt-12 md:mt-16 px-5 pt-10 md:pt-12">
                    <div className="footer-brand-emblem mx-auto flex w-full max-w-[18rem] items-center justify-center gap-4 sm:max-w-xs md:max-w-md md:gap-6">
                        <span className="footer-brand-line h-px flex-1 bg-white/25" aria-hidden />
                        <img
                            src={getImage("s1ck-logo-transparent.webp")}
                            alt="S1CK"
                            className="footer-brand-logo w-[3.75rem] shrink-0 brightness-0 invert opacity-90 md:w-[5.5rem]"
                            loading="lazy"
                            decoding="async"
                        />
                        <span className="footer-brand-line h-px flex-1 bg-white/25" aria-hidden />
                    </div>
                </div>
            </div>

            <div className="footer-social-row flex-center gap-3 relative z-20 mt-8 md:mt-10 px-5">
                <a href="#" className="social-btn" aria-label="YouTube">
                    <img src={getImage("yt.svg")} alt="" className="footer-social-icon" />
                </a>
                <a href="#" className="social-btn" aria-label="Instagram">
                    <img src={getImage("insta.svg")} alt="" className="footer-social-icon" />
                </a>
                <a href="#" className="social-btn" aria-label="TikTok">
                    <img src={getImage("tiktok.svg")} alt="" className="footer-social-icon" />
                </a>
            </div>

            <div className="footer-links-row mt-12 md:mt-30 lg:mb-32 mb-16 md:px-7 px-5 flex md:flex-row flex-col justify-between items-start md:items-start gap-10 text-cream font-paragraph md:text-sm text-[0.8rem] font-medium">
                <div className="footer-links-grid grid grid-cols-3 gap-x-4 gap-y-3 w-full md:w-auto md:flex md:items-start md:gap-10">
                    <div>
                        <p>S1CK Scents</p>
                    </div>
                    <div>
                        <p>
                            <Link to="/vip-club" className="hover:text-cream transition-colors">
                                S1CK Club
                            </Link>
                        </p>
                        <p>Campus Reps</p>
                        <p>Brand Partners</p>
                    </div>
                    <div>
                        <p>Our Story</p>
                        <p>Contact</p>
                        <p>S1CK Files</p>
                        <p>
                            <Link to="/affiliate" className="hover:text-cream transition-colors">
                                Affiliate
                            </Link>
                        </p>
                        <p>
                            <Link to="/wholesaler" className="hover:text-cream transition-colors">
                                Wholesaler
                            </Link>
                        </p>
                    </div>
                </div>
                <div className="footer-newsletter w-full md:max-w-sm md:mt-0">
                    <p className="leading-relaxed">
                        Drop alerts. Early access. S1CK content.
                        No spam — we're not that basic.
                    </p>
                    <div className="flex justify-between items-center gap-3 border-b border-[#faf7f233] py-3 md:py-4 mt-4 md:mt-6">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full min-w-0 placeholder:font-sans placeholder:text-[#8a7a6a] text-base md:text-lg"
                        />
                        <img src={getImage("arrow.svg")} alt="" className="footer-arrow-icon shrink-0" />
                    </div>
                </div>
            </div>

            <div className="copyright-box">
                <p>Copyright © 2025 S1CK Pheromones — All Rights Reserved</p>
                <div className="flex items-center gap-7">
                    <p>Privacy Policy</p>
                    <p>Terms of Service</p>
                </div>
            </div>
        </section>
    );
};

export default FooterSection;