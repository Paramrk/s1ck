import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import HeroSection from "../sections/HeroSection";
import gsap from "gsap";
import MessageSection from "../sections/MessageSection";
import FlavorSection from "../sections/FlavorSection";
import { ScrollSmoother } from "gsap/all";
import { useGSAP } from "@gsap/react";
import NutritionSection from "../sections/NutritionSection";
import BenifitSection from "../sections/BenifitSection";
import PheromoneBenefits from "../sections/PheromoneBenefits";
import FooterSection from "../sections/FooterSection";
import TestimonialSection from "../sections/TestimonialSection";
import PreLoader from "../components/PreLoader";
import { useEffect, useState } from "react";
import { useScrollTriggerRefresh } from "../hooks/useScrollTriggerRefresh";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const HomePage = () => {
    const [loaded, setLoaded] = useState(false);
    useScrollTriggerRefresh();

    useGSAP(() => {
        if (loaded && !ScrollSmoother.get()) {
            const isMobile = window.innerWidth <= 768;

            // Stabilise iOS Safari scroll: ignore the address-bar
            // show/hide resize so pinned sections don't recalc mid-scroll.
            ScrollTrigger.config({ ignoreMobileResize: true });

            // normalizeScroll hijacks touch events and replaces them with
            // JS-controlled scroll — causes stutter on low-end phones.
            // Only enable on desktop where it smooths wheel jitter.
            if (!isMobile) {
                ScrollTrigger.normalizeScroll(true);
            }

            ScrollSmoother.create({
                wrapper: "#smooth-wrapper",
                content: "#smooth-content",
                // Less interpolation on mobile = less work per frame
                smooth: isMobile ? 1 : 1.5,
                effects: !isMobile,
                // 0 = native touch scroll (always smoother than JS lerp)
                smoothTouch: 0,
            });
            ScrollTrigger.refresh();
        }
    }, [loaded]);

    // Cleanup ScrollSmoother and ScrollTriggers on unmount
    useEffect(() => {
        return () => {
            ScrollSmoother.get()?.kill();
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    return (
        <main>
            {!loaded && <PreLoader onComplete={() => setLoaded(true)} />}

            {loaded && (
                <>
                    <Navbar />
                    <div id="smooth-wrapper">
                        <div id="smooth-content">
                            <HeroSection />
                            <MessageSection />
                            <FlavorSection />
                            <NutritionSection showMockup={true} />
                            <div>
                                <BenifitSection />
                                <TestimonialSection />
                            </div>
                            <PheromoneBenefits showMockup={true} />
                            <FooterSection />
                        </div>
                    </div>
                </>
            )}
        </main>
    );
};

export default HomePage;
