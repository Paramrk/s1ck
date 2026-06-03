import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import HeroSection from "../sections/HeroSection";
import gsap from "gsap";
import MessageSection from "../sections/MessageSection";
import FlavorSection from "../sections/FlavorSection";
import ScentCompositionSection from "../sections/ScentCompositionSection";
import { ScrollSmoother } from "gsap/all";
import { useGSAP } from "@gsap/react";
import NutritionSection from "../sections/NutritionSection";
import BenifitSection from "../sections/BenifitSection";
import PheromoneBenefits from "../sections/PheromoneBenefits";
import FooterSection from "../sections/FooterSection";
import TestimonialSection from "../sections/TestimonialSection";
import PreLoader from "../components/PreLoader";
import DeferredSection from "../components/DeferredSection";
import { useEffect, useState } from "react";
import { useScrollTriggerRefresh } from "../hooks/useScrollTriggerRefresh";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const HomePage = () => {
    const [loaded, setLoaded] = useState(false);
    useScrollTriggerRefresh();

    useGSAP(() => {
        if (ScrollSmoother.get()) return;

        const isMobile = window.innerWidth <= 768;
        ScrollTrigger.config({ ignoreMobileResize: true });

        if (!isMobile) {
            ScrollSmoother.create({
                wrapper: "#smooth-wrapper",
                content: "#smooth-content",
                smooth: 1.5,
                effects: false,
            });
        }

        ScrollTrigger.refresh();
    }, []);

    useGSAP(() => {
        if (!loaded) return;
        requestAnimationFrame(() => ScrollTrigger.refresh(true));
    }, [loaded]);

    useEffect(() => {
        return () => {
            ScrollSmoother.get()?.kill();
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
                            <DeferredSection minHeight="100dvh">
                                <MessageSection />
                            </DeferredSection>
                            <FlavorSection />
                            <ScentCompositionSection />
                            <DeferredSection minHeight="100dvh">
                                <NutritionSection showMockup={true} />
                            </DeferredSection>
                            <DeferredSection minHeight="100dvh">
                                <div>
                                    <BenifitSection />
                                    <TestimonialSection />
                                </div>
                            </DeferredSection>
                            <DeferredSection minHeight="100dvh">
                                <PheromoneBenefits showMockup={true} />
                            </DeferredSection>
                            <DeferredSection minHeight="50vh" rootMargin="520px 0px">
                                <FooterSection />
                            </DeferredSection>
                        </>
                    )}
                </div>
            </div>

            {!loaded && <PreLoader onComplete={() => setLoaded(true)} />}
        </main>
    );
};

export default HomePage;
