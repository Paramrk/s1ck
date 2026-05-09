import { useGSAP } from "@gsap/react";
import { flavorlists } from "../constants/details";
import gsap from "gsap";
import { useMediaQuery } from "react-responsive";

// At the top of component file
// Glob import all images and videos
const images: Record<string, { default: string }> = import.meta.glob(
    "../assets/images/*.{webp,svg,png,jpg,jpeg}",
    { eager: true }
);

// Access image by file name dynamically
const getImage = (fileName?: string): string | undefined => {
    if (!fileName?.trim()) return undefined;

    const key = `../assets/images/${fileName}`;
    return images[key]?.default;
};

const visibleFlavors = flavorlists.filter((flavor) => {
    const hasName = flavor.name.trim().length > 0;
    const hasAssetKey = [
        flavor.bgImage,
        flavor.elementsImage,
        flavor.drinkImage,
        flavor.color,
    ].some((value) => value?.trim().length);

    return hasName && hasAssetKey;
});

const FlavorSlider = () => {

    const isMobSlider = useMediaQuery({ query: "(max-width:768px)" });

    useGSAP(() => {
        const cards = document.querySelectorAll<HTMLDivElement>(".flavors > div");

        cards.forEach((card) => {
            const handleMove = (clientX: number, clientY: number) => {
                const bounds = card.getBoundingClientRect();
                const x = clientX - bounds.left;
                const y = clientY - bounds.top;

                const offsetX = (x / bounds.width - 0.5) * 30;
                const offsetY = (y / bounds.height - 0.5) * 30;

                const elements = card.querySelector<HTMLImageElement>(".elements");
                const drinks = card.querySelector<HTMLImageElement>(".drinks");

                if (elements)
                    gsap.to(elements, { x: offsetX, y: offsetY, duration: 0.3, ease: "power2.out" });
                if (drinks)
                    gsap.to(drinks, { x: -offsetX, duration: 0.3, ease: "power2.out" });
            };

            const handleReset = () => {
                const elements = card.querySelector<HTMLImageElement>(".elements");
                const drinks = card.querySelector<HTMLImageElement>(".drinks");

                if (elements) gsap.to(elements, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });
                if (drinks) gsap.to(drinks, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });
            };

            // Mouse events (desktop)
            card.addEventListener("mousemove", (e: MouseEvent) => handleMove(e.clientX, e.clientY));
            card.addEventListener("mouseleave", handleReset);

            // Touch events (mobile)
            card.addEventListener("touchmove", (e: TouchEvent) => {
                const touch = e.touches[0];
                if (touch) handleMove(touch.clientX, touch.clientY);
            }, { passive: true });
            card.addEventListener("touchend", handleReset);
        });

        // Mobile: staggered fade-in for each flavor card on scroll
        if (isMobSlider) {
            cards.forEach((card) => {
                gsap.from(card, {
                    opacity: 0,
                    y: 80,
                    scale: 0.95,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 95%",
                        end: "top 55%",
                        scrub: 1.5,
                    }
                });
            });
        }
    });

    return (
        <div className="slider-wrapper lg:w-[480vw] lg:h-full mt-0 xl:mt-0 bg-milk h-[100%]">
            <div className="flavors lg:pb-50 flex md:flex-row flex-col items-center lg:items-start lg:pt-10 2xl:gap-72 lg:gap-52 md:gap-24 gap-7 flex-nowrap">
                {visibleFlavors.map((flavor) => {
                    const bgSrc = getImage(flavor.bgImage ?? `${flavor.color}-bg.svg`);
                    const elementsSrc = getImage(flavor.elementsImage ?? `${flavor.color}-elements.webp`);
                    const drinkSrc = getImage(flavor.drinkImage ?? `${flavor.color}-drink.webp`);

                    return (
                        <div
                            key={flavor.name}
                            className={`relative z-30 lg:w-[50vw] w-88 lg:h-[70vh] md:w-[90vw] md:h-[50vh] h-80 flex-none ${flavor.rotation}`}
                        >
                            {bgSrc && (
                                <img
                                    src={bgSrc}
                                    alt={flavor.name}
                                    className={`absolute bottom-0 ${flavor.bgImage ? 'rounded-[40px] w-full h-full object-cover' : ''}`}
                                />
                            )}
                            {elementsSrc && (
                                <img
                                    src={elementsSrc}
                                    alt={flavor.name}
                                    className="elements"
                                />
                            )}
                            {drinkSrc && (
                                <img
                                    src={drinkSrc}
                                    alt={flavor.name}
                                    className="drinks"
                                />
                            )}
                            <h1 className={flavor.textColor ? flavor.textColor : ""}>{flavor.name}</h1>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FlavorSlider;
