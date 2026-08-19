import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import HeroSection from "../sections/HeroSection";
import gsap from "gsap";
import MessageSection from "../sections/MessageSection";
import TrustBannerSection from "../sections/TrustBannerSection";
import FlavorSection from "../sections/FlavorSection";
import ScentCompositionSection from "../sections/ScentCompositionSection";
import { useGSAP } from "@gsap/react";
import NutritionSection from "../sections/NutritionSection";
import BenifitSection from "../sections/BenifitSection";
import PheromoneBenefits from "../sections/PheromoneBenefits";
import FooterSection from "../sections/FooterSection";
import TestimonialSection from "../sections/TestimonialSection";
import PreLoader from "../components/PreLoader";
import { useEffect, useState } from "react";
import { useScrollTriggerRefresh } from "../hooks/useScrollTriggerRefresh";

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
    const [loaded, setLoaded] = useState(false);
    useScrollTriggerRefresh();

    useGSAP(() => {
        ScrollTrigger.config({ ignoreMobileResize: true });
        ScrollTrigger.refresh();
    }, []);

    useEffect(() => {
        if (!loaded) return;

        // All scroll sections must exist before ScrollTrigger measures the page.
        // Mounting tall sections later made downstream pins (especially Science
        // of S1CK) keep coordinates from the shorter placeholder layout.
        let secondFrame = 0;
        const firstFrame = requestAnimationFrame(() => {
            secondFrame = requestAnimationFrame(() => {
                ScrollTrigger.sort();
                ScrollTrigger.refresh(true);
            });
        });
        const settledRefresh = window.setTimeout(() => {
            ScrollTrigger.sort();
            ScrollTrigger.refresh(true);
        }, 300);

        document.fonts?.ready?.then(() => {
            ScrollTrigger.sort();
            ScrollTrigger.refresh(true);
        });

        return () => {
            cancelAnimationFrame(firstFrame);
            cancelAnimationFrame(secondFrame);
            window.clearTimeout(settledRefresh);
        };
    }, [loaded]);

    useEffect(() => {
        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    return (
        <main>
            <Navbar />
            <div id="smooth-wrapper">
                <div id="smooth-content">
                    <HeroSection />

                    {loaded && (
                        <>
                            <TrustBannerSection />
                            <MessageSection />
                            <FlavorSection />
                            <ScentCompositionSection />
                            <NutritionSection showMockup={true} />
                            <BenifitSection />
                            <TestimonialSection />
                            <div className="bg-[#0a0908]">
                                <PheromoneBenefits showMockup={true} />
                                <FooterSection />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {!loaded && <PreLoader onComplete={() => setLoaded(true)} />}
        </main>
    );
};

export default HomePage;
