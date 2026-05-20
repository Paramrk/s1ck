import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import { getImage } from '../utils/media';
import { useMediaQuery } from "react-responsive";

const pinVideo = "https://pub-14765fe2465f48c99a2845f3997a3cb2.r2.dev/pin-video.mp4";

const VideoPin = () => {

    const vidMob = useMediaQuery({
        query: "(max-width:768px)",
    })

    useGSAP(() => {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 769px)", () => {
            const vpTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".video-wrapper",
                    start: "0px top",
                    end: "2500px top",
                    scrub: 1.5,
                    pin: true,
                }
            });
            vpTl.fromTo(
                ".video-box",
                { clipPath: "circle(6% at 50% 50%)" },
                {
                    clipPath: "circle(100% at 50% 50%)",
                    ease: "power1.inOut",
                }
            );
        });

        mm.add("(max-width: 768px)", () => {
            gsap.to(".video-wrapper", {
                scrollTrigger: {
                    trigger: ".vd-pin",
                    start: "0px top",
                    end: "120% top",
                    scrub: 1.5,
                    pin: true,
                }
            });
        });

        return () => mm.revert();
    }, []);

    return (
        <div className="h-dvh overflow-hidden ">
            <div className="relative w-full h-full video-box overflow-hidden">
                <img
                    src={getImage("circle-text.svg")}
                    alt=""
                    className="spin-circle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-100 md:w-[15%] w-[30%] h-auto"
                    loading="lazy"
                    decoding="async"
                />
                <video
                    src={pinVideo}
                    playsInline
                    muted
                    loop
                    autoPlay
                    preload={vidMob ? "metadata" : "auto"}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-auto h-full object-cover"
                />
            </div>
        </div>
    )
};

export default VideoPin;
