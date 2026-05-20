import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { getImage } from '../utils/media';

const BottomBanner = () => {

    useGSAP(() => {
        const mm = gsap.matchMedia();

        const buildBanner = (mobile: boolean) => {
            document.fonts.ready.then(() => {
                const bTitleSplit = SplitText.create(".b-title", { type: "chars" });

                const revealTl = gsap.timeline({
                    delay: mobile ? 0.3 : 1,
                    scrollTrigger: {
                        trigger: ".bottom-banner",
                        start: mobile ? "top 65%" : "top 50%",
                        end: mobile ? "top 20%" : "top 10%",
                        scrub: 1.5,
                    }
                });

                revealTl.from(bTitleSplit.chars, {
                    stagger: mobile ? 0.1 : 0.2,
                    opacity: 0,
                    rotate: mobile ? 1 : 3,
                    yPercent: mobile ? 15 : 30,
                    ease: "power1.inOut"
                }).to(".bottom-banner .rolling-animation", {
                    opacity: 1,
                    clipPath: "polygon(0% 0%,100% 0%, 100% 100%, 0% 100%)",
                    ease: "circ.out"
                });

                if (mobile) {
                    gsap.from(".bottom-banner .font-paragraph > div:first-child", {
                        opacity: 0,
                        x: -40,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: ".bottom-banner .font-paragraph",
                            start: "top 95%",
                            end: "top 55%",
                            scrub: 1.5,
                        }
                    });

                    gsap.from(".bottom-banner .font-paragraph .sick-btn", {
                        opacity: 0,
                        y: 30,
                        scale: 0.95,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: ".bottom-banner .font-paragraph .sick-btn",
                            start: "top 95%",
                            end: "top 60%",
                            scrub: 1.5,
                        }
                    });
                }
            });
        };

        mm.add("(max-width: 768px)", () => buildBanner(true));
        mm.add("(min-width: 769px)", () => buildBanner(false));

        return () => mm.revert();
    }, []);


    return (
        <section className="bottom-banner 2xl:min-h-dvh w-full h-full overflow-hidden relative bg-parchment flex flex-col justify-center items-start">
            <img src={getImage("footer-dip.png")} alt="footer-img" loading="lazy" decoding="async" className="w-full object-cover -translate-y-1" />
            <img src={getImage("bottom-banner.svg")} alt="" loading="lazy" decoding="async" className="h-fit mt-10" />

            <div className="absolute lg:w-[35rem] sm:w-[88%] w-[92%] lg:h-[24rem] h-auto z-100 lg:top-[30%] top-[40%] lg:left-20 sm:left-8 left-4 lg:mx-0 mx-auto">
                <div className="relative inline-block md:translate-y-20 z-100">
                    <div className="general-title relative flex flex-col justify-center items-center gap-24">
                        <div className="overflow-hidden place-self-start">
                            <h1 className="text-charcoal b-title">Available</h1>
                        </div>
                        <div className="rotate-[3deg] rolling-animation text-nowrap md:-mt-28 -mt-24 place-self-start">
                            <div className="bg-champagne pb-4 md:pt-0 pt-3 md:px-5 px-3 inline-block">
                                <h2 className="text-charcoal">Everywhere</h2>
                            </div>
                        </div>
                    </div>
                    <div className="lg:mt-10 mt-2 text-stone text-[0.7rem] font-paragraph flex flex-col lg:gap-14 gap-8">
                        <div>
                            <p className="lg:w-1/2 w-full leading-relaxed tracking-wide uppercase text-[0.75rem] lg:text-[0.7rem]" style={{letterSpacing:'0.06em'}}>Cop S1CK online or find us at select drops and premium retail. Nationwide shipping. Same-day drop alerts on IG.</p>
                        </div>
                        <div className="font-medium">
                            <a href="#" className="sick-btn">GET YOUR BOTTLE</a>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default BottomBanner;