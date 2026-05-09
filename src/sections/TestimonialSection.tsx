import { cards } from "../constants/details";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import { useMediaQuery } from "react-responsive";

const TestimonialSection = () => {
    const isMobile = useMediaQuery({
        query: "(max-width: 768px)",
    });

    // Refs to multiple video elements
    const vdRf = useRef<HTMLVideoElement[]>([]);

    useGSAP(() => {
        gsap.set(".testimonials-section", {
            marginTop: "-100vh"
        });

        const tesTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".testimonials-section",
                start: "top bottom",
                end: `${isMobile ? "80% top" : "500% top"}`,
                scrub: true,
                // markers: true
                pinSpacing: false
            }
        });

        const pinTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".testimonials-section",
                start: `${isMobile ? "1% top" : "10% top"}`,
                end: `${isMobile ? "100% top" : "200% top"}`,
                scrub: 1.5,
                pin: true,
                // markers: true,
            }
        });

        pinTl.from(".vd-card", {
            // opacity: 0,
            yPercent: 300,
            stagger: 0.3,
            ease: "power1.inOut"
        }, "<");

        tesTl.to(".testimonials-section .ft-anim", {
            xPercent: 70 + 30,
            yPercent: -100
        }).to(".testimonials-section .st-anim", {
            xPercent: 25 + 30, yPercent: -100
        }, "<").to(".testimonials-section .tt-anim", {
            xPercent: -80, yPercent: -100
        }, "<");
    });

    const setVideoRef = (el: HTMLVideoElement | null, index: number): void => {
        if (el) vdRf.current[index] = el;
    };

    const handlePlay = (index: number): void => {
        const video = vdRf.current[index];
        if (video) video.play().catch((err) => console.error("Play failed:", err));
    };

    const handlePause = (index: number): void => {
        const video = vdRf.current[index];
        if (video) video.pause();
    };

    return (
        <section className="testimonials-section">
            <div className="relative w-full lg:h-[130vh] h-[112vh]">
                <div className="all-title lg:h-[150vh] h-full absolute size-full flex flex-col items-center lg:pt-[5vw] pt-[15vw]">
                    <h1 className="text-charcoal first-title ft-anim">They're</h1>
                    <h1 className="text-sick-gold sec-title st-anim">All</h1>
                    <h1 className="text-charcoal third-title tt-anim">Simping</h1>
                </div>
                <div className="pin-box ">
                    {
                        cards.map((card, index) => (
                            <div
                                key={index}
                                className={`vd-card  ${card.translation} ${card.rotation}`}
                                onMouseEnter={() => handlePlay(index)}
                                onMouseLeave={() => handlePause(index)}
                                onTouchStart={() => handlePlay(index)}
                                onTouchEnd={() => handlePause(index)}
                            >
                                <video
                                    key={index}
                                    ref={(el) => setVideoRef(el, index)}
                                    src={card.src} playsInline muted loop
                                    className="size-full object-cover"
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="absolute md:bottom-20 bottom-8 w-full h-auto py-2 flex justify-center items-center z-100">
                <button type="button" className="sick-btn-filled px-10 py-4 rounded-4xl">SEE MORE REACTIONS</button>
            </div>
        </section >
    );
};

export default TestimonialSection;