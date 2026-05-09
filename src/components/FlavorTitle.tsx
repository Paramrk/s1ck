import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useMediaQuery } from "react-responsive";

const FlavorTitle = () => {

    const isMobFlavor = useMediaQuery({ query: "(max-width:768px)" });

    useGSAP(() => {
        document.fonts.ready.then(() => {
            const firstTextSplit = SplitText.create(".first-text-split h1", {
                type: "chars"
            });
            const secTextSplit = SplitText.create(".second-text-split h1", {
                type: "chars"
            });

            gsap.from(firstTextSplit.chars, {
                yPercent: isMobFlavor ? 120 : 200,
                stagger: isMobFlavor ? 0.015 : 0.02,
                ease: "power1.inOut",
                scrollTrigger: {
                    trigger: ".flavor-section",
                    start: isMobFlavor ? "top 60%" : "top 33%",
                    end: isMobFlavor ? "top 30%" : undefined,
                    scrub: isMobFlavor ? 1.5 : false,
                }
            });

            gsap.to(".flavor-text-scroll", {
                clipPath: "polygon(0% 0%,100% 0%,100% 100%, 0% 100%)",
                ease: "power1.inOut",
                scrollTrigger: {
                    trigger: ".flavor-section",
                    start: isMobFlavor ? "top 40%" : "top 17%",
                    end: isMobFlavor ? "top 15%" : undefined,
                    scrub: isMobFlavor ? 1.5 : false,
                }
            });

            gsap.from(secTextSplit.chars, {
                yPercent: isMobFlavor ? 120 : 200,
                stagger: isMobFlavor ? 0.015 : 0.02,
                ease: "power1.inOut",
                scrollTrigger: {
                    trigger: ".flavor-section",
                    start: isMobFlavor ? "top 25%" : "top 3%",
                    end: isMobFlavor ? "top 0%" : undefined,
                    scrub: isMobFlavor ? 1.5 : false,
                }
            });
        });

        // Mobile: light vertical parallax for title elements
        if (isMobFlavor) {
            const mobTitleTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".flavor-section",
                    start: "top top",
                    end: "40% top",
                    scrub: 1.5,
                },
            });

            mobTitleTl
                .to(".first-text-split", {
                    yPercent: -15,
                    ease: "power1.inOut",
                })
                .to(".flavor-text-scroll", {
                    yPercent: -10,
                    ease: "power1.inOut",
                }, "<")
                .to(".second-text-split", {
                    yPercent: -5,
                    ease: "power1.inOut",
                }, "<");
        }

        // Desktop: Title parallax — horizontal shift
        if (!isMobFlavor) {
            const titleTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".flavor-section",
                    start: "top top",
                    end: "bottom 80%",
                    scrub: true,
                },
            });

            titleTl
                .to(".first-text-split", {
                    xPercent: -30,
                    ease: "power1.inOut",
                })
                .to(".flavor-text-scroll", {
                    xPercent: -22,
                    ease: "power1.inOut",
                }, "<")
                .to(".second-text-split", {
                    xPercent: -10,
                    ease: "power1.inOut",
                }, "<");
        }
    });

    return (
        <div className="general-title col-center h-full 2xl:gap-32 xl:gap-24 gap-16">
            <div className="overflow-hidden 2xl:py-0 py-3 first-text-split">
                <h1>We got 6</h1>
            </div>

            <div className="flavor-text-scroll">
                <div className="bg-champagne pb-5 2xl:pt-0 pt-3 2xl:px-5 px-3">
                    <h2 className="text-charcoal rolling">Deadly</h2>
                </div>
            </div>

            <div className="overflow-hidden 2xl:py-0 py-3 second-text-split">
                <h1>Signature</h1>
                <h1>Scents</h1>
            </div>
        </div>
    );
};

export default FlavorTitle;