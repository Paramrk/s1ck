import { useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import preImg from "../assets/s1cklogo-trnsp.webp"

const PreLoader = ({ onComplete }: { onComplete: () => void }) => {
    const [progress, setProgress] = useState(0);
    const [canHide, setCanHide] = useState(false); // flag to control hiding

    useEffect(() => {
        const MIN_DURATION = 1000; // minimum 1 seconds
        const startTime = performance.now();

        const resources: (HTMLImageElement | HTMLVideoElement)[] = [
            ...Array.from(document.images),
            ...Array.from(document.querySelectorAll("video")),
        ];

        const total = resources.length || 1;
        let loaded = 0;

        const updateProgress = () => {
            loaded++;
            const percent = Math.round((loaded / total) * 100);
            setProgress((prev) => (percent > prev ? percent : prev));
        };

        resources.forEach((res) => {
            if (
                (res instanceof HTMLImageElement && res.complete) ||
                (res instanceof HTMLVideoElement && res.readyState >= 3)
            ) {
                updateProgress();
            } else {
                res.addEventListener("load", updateProgress);
                res.addEventListener("loadeddata", updateProgress);
                res.addEventListener("error", updateProgress);
            }
        });

        if (document.fonts) {
            document.fonts.ready.then(() => {
                setProgress((prev) => (prev < 90 ? 90 : prev));
            });
        }

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    const elapsed = performance.now() - startTime;
                    const remaining = MIN_DURATION - elapsed;
                    if (remaining > 0) {
                        setTimeout(() => setCanHide(true), remaining);
                    } else {
                        setCanHide(true);
                    }
                    return 100;
                }
                return prev + 1;
            });
        }, 50);

        const handleWindowLoad = () => {
            const elapsed = performance.now() - startTime;
            const remaining = MIN_DURATION - elapsed;
            if (remaining > 0) {
                setTimeout(() => setCanHide(true), remaining);
            } else {
                setCanHide(true);
            }
        };
        window.addEventListener("load", handleWindowLoad);

        return () => {
            clearInterval(interval);
            window.removeEventListener("load", handleWindowLoad);
        };
    }, []);

    useGSAP(() => {
        if (progress >= 100 && canHide) {
            gsap.to(".preloader", {
                opacity: 0,
                duration: 0.5,
                ease: "power2.out",
                onComplete,
            });
        }
    }, [progress, canHide, onComplete]);

    return (
        <div className="preloader fixed inset-0 flex flex-col items-center justify-end pb-20 z-[9999] bg-cream" style={{color: '#1a1a1a'}}>
            <img src={preImg} alt="pre img" className="lg:mb-40 mb-[60%] lg:w-[20%] w-[40%]" />
            <p className="lg:text-2xl text-xl tracking-[0.2em] uppercase" style={{fontFamily: 'Syne, sans-serif', fontWeight: 600, color: '#1a1a1a'}}>{progress}%</p>
            <div className="mt-3 lg:w-[10rem] w-52 h-[1px] bg-sand overflow-hidden">
                <div
                    className="h-full preloader-bar transition-all duration-150 ease-linear"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default PreLoader;