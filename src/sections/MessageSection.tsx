import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useMediaQuery } from "react-responsive";

const MessageSection = () => {

    const isMobMsg = useMediaQuery({ query: "(max-width:768px)" });

    useGSAP(() => {
        document.fonts.ready.then(() => {
            const firstMsgSplit = SplitText.create(".first-message", { type: "words" });
            const secMsgSplit = SplitText.create(".second-message", { type: "words" });
            const paragraphSplit = SplitText.create(".message-content p", { type: "words,lines", linesClass: "paragraph-line" });

            gsap.to(firstMsgSplit.words, {
                color: "#faeade",
                ease: "power1.in",
                stagger: isMobMsg ? 0.5 : 1,
                scrollTrigger: {
                    trigger: ".message-content",
                    start: isMobMsg ? "top 70%" : "top center",
                    end: isMobMsg ? "25% center" : "30% center",
                    scrub: true,
                }
            });

            gsap.to(secMsgSplit.words, {
                color: "#faeade",
                ease: "power1.in",
                stagger: isMobMsg ? 0.5 : 1,
                scrollTrigger: {
                    trigger: ".second-message",
                    start: isMobMsg ? "top 70%" : "top center",
                    end: "bottom center",
                    scrub: true,
                }
            });

            //Timeline — clip-path reveal
            const revealTl = gsap.timeline({
                delay: isMobMsg ? 0 : 1,
                scrollTrigger: {
                    trigger: ".msg-text-scroll",
                    start: isMobMsg ? "top 80%" : "top 60%",
                    end: isMobMsg ? "top 50%" : undefined,
                    scrub: isMobMsg ? 1.5 : false,
                }
            });

            revealTl.to(".msg-text-scroll", {
                clipPath: "polygon(0% 0%,100% 0%, 100% 100%, 0% 100%)",
                ease: "circ.inOut"
            }, "<");

            const paragraphTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".message-content p",
                    start: isMobMsg ? "top 90%" : "top 60%",
                    end: isMobMsg ? "top 50%" : undefined,
                    scrub: isMobMsg ? 1.5 : false,
                }
            });

            paragraphTl.from(paragraphSplit.words, {
                stagger: 0.01,
                yPercent: isMobMsg ? 100 : 300,
                rotate: isMobMsg ? 1 : 3,
                ease: "power1.inOut"
            });

            // Mobile: smooth scroll-tied fade-in for the paragraph container
            if (isMobMsg) {
                gsap.from(".message-content .max-w-md", {
                    opacity: 0,
                    y: 40,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".message-content .max-w-md",
                        start: "top 95%",
                        end: "top 55%",
                        scrub: 1.5,
                    }
                });
            }
        });
    }, []);

    return (
        <section className="message-content">
            <div className="container mx-auto flex-center py-28 relative">
                <div className="w-full h-full md:px-28 px-5">
                    <div className="msg-wrapper">
                        <h1 className="first-message text-wrap w-[90%]">You're either the one they notice</h1>
                        <div className="msg-text-scroll md:mt-12 mt-0">
                            <div className="bg-champagne md:pb-4 pb-3 px-5">
                                <h2 className="text-charcoal">or the one they forget.</h2>
                            </div>
                        </div>
                        <h1 className="second-message md:w-full w-[80%]">S1CK makes sure it's always you.</h1>
                    </div>
                    <div className="flex-center md:mt-20 mt-10">
                        <div className="max-w-md px-10 flex-center overflow-hidden">
                            <p>Formulated with real pheromone compounds. Not a cologne. Not a perfume. A biological advantage — bottled.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MessageSection;