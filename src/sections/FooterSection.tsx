import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { getImage } from '../utils/media';
import { useMediaQuery } from "react-responsive";

const FooterSection = () => {

    const isMobF = useMediaQuery({
        query: "(max-width: 768px)",
    });

    useGSAP(() => {
        document.fonts.ready.then(() => {
            const footTextSplit = SplitText.create(".footer-title-animation", { type: "chars" });

            gsap.from(footTextSplit.chars, {
                yPercent: isMobF ? 120 : 200,
                stagger: isMobF ? 0.015 : 0.02,
                ease: "power1.inOut",
                zIndex: 0,
                scrollTrigger: {
                    trigger: ".footer-section",
                    start: `${isMobF ? "top 60%" : "top 50%"}`,
                    end: `${isMobF ? "top 20%" : "top 10%"}`,
                    scrub: 1.5,
                }
            });

            // Mobile: smooth scroll-tied animations for all footer elements
            if (isMobF) {
                // VIP badge and title
                gsap.from(".footer-section .flex.items-center.gap-3.mb-6", {
                    opacity: 0,
                    y: 30,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".footer-section .flex.items-center.gap-3.mb-6",
                        start: "top 95%",
                        end: "top 60%",
                        scrub: 1.5,
                    }
                });

                // VIP heading texts - staggered
                gsap.from(".footer-section h2, .footer-section h1:not(.footer-title-animation)", {
                    opacity: 0,
                    y: 40,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".footer-section h2",
                        start: "top 95%",
                        end: "top 50%",
                        scrub: 1.5,
                    }
                });

                // VIP CTA button
                gsap.from(".footer-section button", {
                    opacity: 0,
                    y: 30,
                    scale: 0.95,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".footer-section button",
                        start: "top 95%",
                        end: "top 60%",
                        scrub: 1.5,
                    }
                });

                // Social buttons - scroll-tied scale-in
                gsap.from(".social-btn", {
                    opacity: 0,
                    scale: 0.7,
                    stagger: 0.06,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".social-btn",
                        start: "top 95%",
                        end: "top 60%",
                        scrub: 1.5,
                    }
                });

                // Footer links - slide in from left
                gsap.from(".footer-section .flex.items-start.md\\:gap-10 > div", {
                    opacity: 0,
                    x: -30,
                    stagger: 0.06,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".footer-section .flex.items-start.md\\:gap-10",
                        start: "top 95%",
                        end: "top 55%",
                        scrub: 1.5,
                    }
                });

                // Email input area - fade in
                gsap.from(".footer-section .md\\:max-w-sm", {
                    opacity: 0,
                    y: 30,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".footer-section .md\\:max-w-sm",
                        start: "top 95%",
                        end: "top 60%",
                        scrub: 1.5,
                    }
                });
            }
        });
    });

    return (
        <section className="footer-section lg:pt-20">

            <div className="2xl:h-[110dvh] relative z-100 lg:pt-[8vh] pt-[8vh]">
                <div className="overflow-hidden">
                    <h1 className="general-title text-center text-cream footer-title-animation lg:pb-0 pb-5">#STAYDANGEROUS</h1>
                </div>

                {/* VIP Club Banner */}
                <div className="flex flex-col items-center justify-center mt-16 md:mt-24 z-20 relative px-5 text-center">
                    <div className="flex items-center gap-3 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5z" />
                        </svg>
                        <div className="border border-white/30 px-4 py-1.5">
                            <p className="text-white text-[0.65rem] tracking-[0.25em] font-bold">EXCLUSIVE ACCESS</p>
                        </div>
                    </div>
                    <h2 className="text-white text-3xl md:text-5xl font-bold uppercase tracking-wide mt-2" style={{fontFamily: '"Syne", sans-serif'}}>JOIN THE <span className="text-white/50">VIP CLUB</span></h2>
                    <h1 className="text-white text-4xl md:text-7xl font-bold uppercase tracking-wide mt-2" style={{fontFamily: '"Syne", sans-serif'}}>UP TO 35% OFF</h1>
                    
                    <div className="flex flex-col items-center mt-8 text-white/70 text-[0.65rem] tracking-[0.15em] space-y-2 uppercase" style={{fontFamily: '"Syne", sans-serif'}}>
                        <p>PREMIUM FRAGRANCES DELIVERED MONTHLY</p>
                        <p>EXCLUSIVE MEMBER-ONLY COLLECTIONS</p>
                    </div>

                    <button className="mt-10 bg-white text-black px-10 py-4 text-[0.7rem] font-bold tracking-[0.2em] hover:opacity-80 transition-all uppercase flex items-center gap-2 cursor-pointer" style={{fontFamily: '"Syne", sans-serif'}}>
                        UNLOCK VIP STATUS <span>&rarr;</span>
                    </button>
                </div>
            </div>



            <div className="flex-center gap-3 relative z-10 md:mt-10 mt-5">
                <div className="social-btn">
                    <img src={getImage("yt.svg")} alt="yt" />
                </div>
                <div className="social-btn">
                    <img src={getImage("insta.svg")} alt="instagram" />
                </div>
                <div className="social-btn">
                    <img src={getImage("tiktok.svg")} alt="tiktok" />
                </div>
            </div>

            <div className="mt-30 lg:mb-32 mb-20 md:px-7 px-5 flex gap-10 md:flex-row flex-col justify-between items-start text-cream font-paragraph md:text-sm font-medium">
                <div className="flex items-start md:gap-10 gap-5">
                    <div>
                        <p>S1CK Scents</p>
                    </div>
                    <div>
                        <p>S1CK Club</p>
                        <p>Campus Reps</p>
                        <p>Brand Partners</p>
                    </div>
                    <div>
                        <p>Our Story</p>
                        <p>Contact</p>
                        <p>S1CK Files</p>
                    </div>
                </div>
                <div className="md:max-w-sm">
                    <p>
                        Drop alerts. Early access. S1CK content.
                        No spam — we're not that basic.
                    </p>
                    <div className="flex justify-between items-center border-b border-[#faf7f233] py-4 md:mt-6">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full placeholder:font-sans placeholder:text-[#8a7a6a]"
                        />
                        <img src={getImage("arrow.svg")} alt="arrow" />
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