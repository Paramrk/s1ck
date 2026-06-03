import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";

const MessageSection = () => {

    useGSAP(() => {
        const mm = gsap.matchMedia();

        const buildMessage = (isMobile: boolean) => {
            document.fonts.ready.then(() => {
                // Animate each headline line from ghost → solid on scroll
                const lines = gsap.utils.toArray<HTMLElement>(".msg-line, .msg-line-last");
                lines.forEach((line) => {
                    const split = SplitText.create(line, { type: "words" });
                    gsap.to(split.words, {
                        color: "#111111",
                        ease: "power1.in",
                        stagger: isMobile ? 0.3 : 0.6,
                        scrollTrigger: {
                            trigger: line,
                            start: isMobile ? "top 80%" : "top 65%",
                            end: isMobile ? "bottom 60%" : "bottom 45%",
                            scrub: isMobile ? 1 : 1.3,
                        }
                    });
                });

                // Red banner slide-in
                const revealTl = gsap.timeline({
                    delay: isMobile ? 0 : 0.5,
                    scrollTrigger: {
                        trigger: ".msg-text-scroll",
                        start: isMobile ? "top 85%" : "top 65%",
                        end: isMobile ? "top 55%" : undefined,
                        scrub: isMobile ? 1.5 : false,
                    }
                });

                revealTl.to(".msg-text-scroll", {
                    clipPath: "polygon(0% 0%,100% 0%, 100% 100%, 0% 100%)",
                    ease: "circ.inOut"
                }, "<");

                // Paragraph text reveal
                const paragraphSplit = SplitText.create(".message-content p", { type: "words,lines", linesClass: "paragraph-line" });
                const paragraphTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".message-content p",
                        start: isMobile ? "top 90%" : "top 70%",
                        end: isMobile ? "top 55%" : undefined,
                        scrub: isMobile ? 1.5 : false,
                    }
                });

                paragraphTl.from(paragraphSplit.words, {
                    stagger: 0.01,
                    yPercent: isMobile ? 100 : 300,
                    rotate: isMobile ? 1 : 3,
                    ease: "power1.inOut"
                });

                if (isMobile) {
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
        };

        mm.add("(max-width: 768px)", () => buildMessage(true));
        mm.add("(min-width: 769px)", () => buildMessage(false));

        return () => mm.revert();
    }, []);

    return (
        <section className="message-content">
            <div className="container mx-auto flex-center py-28 relative">
                <div className="w-full h-full md:px-28 px-5">
                    <div className="msg-wrapper">
                        <h1 className="msg-line">You're Either</h1>
                        <h1 className="msg-line">The One They</h1>
                        <h1 className="msg-line">Notice</h1>
                        <div className="msg-text-scroll">
                            <div className="bg-sick-red md:py-4 py-3 md:px-8 px-5 inline-block">
                                <h2 className="text-white tracking-[0.02em]">Or The One They Forget.</h2>
                            </div>
                        </div>
                        <h1 className="msg-line-last">S1CK Makes Sure It's Always You.</h1>
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
