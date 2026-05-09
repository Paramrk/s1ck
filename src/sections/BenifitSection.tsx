import { useGSAP } from "@gsap/react"
import ClipPathTitle from "../components/ClipPathTitle"
import gsap from "gsap";
import { SplitText } from "gsap/all";
import VideoPin from "../components/VideoPin";
import { useMediaQuery } from "react-responsive";

const BenifitSection = () => {

    const isMobBenefit = useMediaQuery({ query: "(max-width:768px)" });

    useGSAP(() => {
        document.fonts.ready.then(() => {
            const hParaSplit = SplitText.create(".para-animation", { type: "words" });

            const revealTl = gsap.timeline({
                delay: isMobBenefit ? 0.3 : 1,
                scrollTrigger: {
                    trigger: ".benefit-section",
                    start: isMobBenefit ? "top 75%" : "top 65%",
                    end: isMobBenefit ? "top -5%" : "top -10%",
                    scrub: 1.5,
                }
            });

            revealTl.from(hParaSplit.words, {
                duration: isMobBenefit ? 0.6 : 1,
                stagger: isMobBenefit ? 0.1 : 0.2,
                opacity: 0,
                rotate: isMobBenefit ? 3 : 8,
                yPercent: isMobBenefit ? 15 : 30,
                ease: "power1.inOut"
            }).to(".benefit-section .first-title", {
                duration: isMobBenefit ? 0.6 : 1,
                opacity: 1,
                clipPath: "polygon(0% 0%,100% 0%, 100% 100%, 0% 100%)",
                ease: "circ.out"
            }).to(".benefit-section .second-title", {
                duration: isMobBenefit ? 0.6 : 1,
                opacity: 1,
                clipPath: "polygon(0% 0%,100% 0%, 100% 100%, 0% 100%)",
                ease: "circ.out"
            }).to(".benefit-section .third-title", {
                duration: isMobBenefit ? 0.6 : 1,
                opacity: 1,
                clipPath: "polygon(0% 0%,100% 0%, 100% 100%, 0% 100%)",
                ease: "circ.out"
            }).to(".benefit-section .fourth-title", {
                duration: isMobBenefit ? 0.6 : 1,
                opacity: 1,
                clipPath: "polygon(0% 0%,100% 0%, 100% 100%, 0% 100%)",
                ease: "circ.out"
            });

            // Mobile: smooth scroll-tied fade-in for the "100,000+" counter text
            if (isMobBenefit) {
                gsap.from(".benefit-section > .container > div:last-child", {
                    opacity: 0,
                    y: 30,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".benefit-section > .container > div:last-child",
                        start: "top 95%",
                        end: "top 60%",
                        scrub: 1.5,
                    }
                });
            }
        });
    });

    return (
        <section className="benefit-section">
            <div className="container mx-auto pt-16 mb-0 py-0">
                <div className="col-center">
                    <p className="md:text-sm para-animation">Why S1CK hits different.
                        <br />Rated #1 Pheromones 6 Years In A Row
                    </p>
                </div>

                <div className="md:mt-20 md:mb-0 mb-30 mt-30 col-center">
                    <ClipPathTitle title={"Long-lasting formula"} color={"#f7f5f2"} bg={"#2e3d4a"} className={"first-title"} borderColor={"#ede9e3"} />
                    <ClipPathTitle title={"Pheromone-infused"} color={"#1c1a18"} bg={"#ede9e3"} className={"second-title"} borderColor={"#ede9e3"} />
                    <ClipPathTitle title={"Gender-fluid scents"} color={"#f7f5f2"} bg={"#c8ae82"} className={"third-title"} borderColor={"#ede9e3"} />
                    <ClipPathTitle title={"No artificial BS"} color={"#1c1a18"} bg={"#e6e1d9"} className={"fourth-title"} borderColor={"#ede9e3"} />
                </div>
                <div className="md:mt-0 md:pb-0 pb-20 mt-10">
                    <p>100,000+ Happy Customers and counting ...</p>
                </div>
            </div>

            <div className="vd-pin relative overlay-box md:-mt-52 mt-0">
                <div className="video-wrapper relative w-full h-screen">
                    <VideoPin />
                </div>
            </div>
        </section>
    )
}

export default BenifitSection