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

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const HomePage = () => {
    const [loaded, setLoaded] = useState(false);

    useGSAP(() => {
        if (loaded && !ScrollSmoother.get()) {
            ScrollSmoother.create({
                wrapper: "#smooth-wrapper",
                content: "#smooth-content",
                smooth: 1.5,
                effects: true,
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
                            <NutritionSection />
                            <div>
                                <BenifitSection />
                                <TestimonialSection />
                            </div>
                            <PheromoneBenefits />
                            <FooterSection />
                        </div>
                    </div>
                </>
            )}
        </main>
    );
};

export default HomePage;
