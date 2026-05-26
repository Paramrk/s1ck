import { useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import preImg from "../assets/s1cklogo-trnsp.webp";

const MIN_VISIBLE_MS = 350;
const FONT_WAIT_MS = 600;

const PreLoader = ({ onComplete }: { onComplete: () => void }) => {
    const [progress, setProgress] = useState(0);
    const [canHide, setCanHide] = useState(false);

    useEffect(() => {
        const startTime = performance.now();
        let done = false;

        const finish = () => {
            if (done) return;
            done = true;
            setProgress(100);

            const elapsed = performance.now() - startTime;
            const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
            window.setTimeout(() => setCanHide(true), wait);
        };

        const tick = (value: number) => {
            setProgress((prev) => Math.max(prev, value));
        };

        tick(40);

        const domReady =
            document.readyState === "complete"
                ? Promise.resolve()
                : new Promise<void>((resolve) => {
                      const onReady = () => {
                          document.removeEventListener("DOMContentLoaded", onReady);
                          resolve();
                      };
                      if (document.readyState === "interactive") resolve();
                      else document.addEventListener("DOMContentLoaded", onReady);
                  });

        domReady.then(() => tick(70));

        const fontsRace = document.fonts
            ? Promise.race([
                  document.fonts.ready,
                  new Promise<void>((r) => window.setTimeout(r, FONT_WAIT_MS)),
              ])
            : Promise.resolve();

        fontsRace.then(() => tick(90));

        if (document.readyState === "complete") {
            tick(95);
            finish();
        } else {
            window.addEventListener("load", () => {
                tick(95);
                finish();
            }, { once: true });
        }

        // Safety cap — never block the hero longer than ~1.2s
        const cap = window.setTimeout(finish, 1200);

        return () => window.clearTimeout(cap);
    }, []);

    useGSAP(() => {
        if (progress >= 100 && canHide) {
            gsap.to(".preloader", {
                opacity: 0,
                duration: 0.35,
                ease: "power2.out",
                onComplete,
            });
        }
    }, [progress, canHide, onComplete]);

    return (
        <div
            className="preloader fixed inset-0 flex flex-col items-center justify-end pb-20 z-[9999] bg-cream pointer-events-none"
            style={{ color: "#1a1a1a" }}
            aria-hidden={canHide}
        >
            <img src={preImg} alt="" className="lg:mb-40 mb-[60%] lg:w-[20%] w-[40%]" />
            <p
                className="lg:text-2xl text-xl tracking-[0.2em] uppercase"
                style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, color: "#1a1a1a" }}
            >
                {progress}%
            </p>
            <div className="mt-3 lg:w-[10rem] w-52 h-[1px] bg-sand overflow-hidden">
                <div
                    className="h-full preloader-bar transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default PreLoader;
