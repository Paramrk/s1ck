import { flavorlists } from "../constants/details";

const images: Record<string, { default: string }> = import.meta.glob(
    "../assets/images/*.{webp,svg,png,jpg,jpeg}",
    { eager: true }
);

const getImage = (fileName?: string): string | undefined => {
    if (!fileName?.trim()) return undefined;
    const key = `../assets/images/${fileName}`;
    return images[key]?.default;
};

// Subtle radial tint behind each bottle so the section feels alive as products rotate
const tints: string[] = [
    "rgba(232,154,60,0.18)",   // Le Toxiquè - amber
    "rgba(176,188,201,0.22)",  // Liquid Silver - pearl
    "rgba(61,123,255,0.18)",   // Alpha Q - blue
    "rgba(232,90,31,0.20)",    // Avant-Garde - orange
    "rgba(217,200,150,0.22)",  // Le-Toxique Oil - champagne
    "rgba(26,26,36,0.22)",     // Arcane - smoke
];

// Parallax depth layers for immersive 3D effect
const depthLayers = [
    { translateZ: -80, scale: 0.85 },
    { translateZ: -40, scale: 0.92 },
    { translateZ: 0, scale: 1 },
    { translateZ: 40, scale: 1.08 },
    { translateZ: 80, scale: 1.15 },
];


const visibleFlavors = flavorlists.filter((flavor) => {
    const hasName = flavor.name.trim().length > 0;
    const hasAsset = [flavor.bgImage, flavor.elementsImage, flavor.drinkImage]
        .some((v) => v?.trim().length);
    return hasName && hasAsset;
});

const FlavorSlider = () => {
    return (
        <div 
            className="relative h-full w-full flex items-center justify-center parallax-container"
            style={{ 
                perspective: "1800px",
                perspectiveOrigin: "50% 50%",
            }}
        >
            {visibleFlavors.map((flavor, i) => {
                const drinkSrc = getImage(flavor.drinkImage);
                const tint = tints[i % tints.length];
                const isFirst = i === 0;
                const depth = depthLayers[i % depthLayers.length];

                return (
                    <div
                        key={flavor.name}
                        className={`fp-${i} absolute inset-0 flex items-center justify-center parallax-layer`}
                        style={{
                            opacity: isFirst ? 1 : 0,
                            transformStyle: "preserve-3d",
                            willChange: "transform, opacity, filter",
                            transform: `translateZ(${depth.translateZ}px) scale(${depth.scale})`,
                        }}
                    >
                        {/* Background depth layer - furthest */}
                        <div
                            className="absolute inset-0 pointer-events-none depth-back"
                            style={{
                                transform: "translateZ(-120px) scale(1.15)",
                                opacity: 0.4,
                            }}
                        >
                            <div 
                                className="w-full h-full"
                                style={{
                                    background: `radial-gradient(circle at 30% 40%, ${tint.replace('0.18', '0.12').replace('0.22', '0.14')}, transparent 70%)`,
                                }}
                            />
                        </div>

                        {/* Tinted spotlight behind bottle - main layer */}
                        <div
                            className="absolute inset-0 pointer-events-none depth-mid"
                            style={{
                                background: `radial-gradient(circle at 50% 58%, ${tint}, transparent 58%)`,
                                transform: "translateZ(-20px)",
                            }}
                        />

                        {/* Soft floor shadow under the bottle - closer layer */}
                        <div
                            className="floor-shadow absolute bottom-[10%] md:bottom-[14%] left-1/2 -translate-x-1/2 pointer-events-none rounded-full depth-front"
                            style={{
                                width: "38%",
                                height: "24px",
                                background: "radial-gradient(ellipse, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0) 70%)",
                                filter: "blur(2px)",
                                transform: "translateZ(30px)",
                            }}
                        />

                        {/* Bottle - foreground layer */}
                        {drinkSrc && (
                            <img
                                src={drinkSrc}
                                alt={flavor.name}
                                loading={isFirst ? "eager" : "lazy"}
                                decoding="async"
                                draggable={false}
                                className="product-bottle relative z-20 h-[58%] md:h-[78%] max-h-[640px] object-contain rounded-2xl md:rounded-3xl"
                                style={{
                                    filter: "drop-shadow(0 22px 30px rgba(0,0,0,0.18)) drop-shadow(0 4px 8px rgba(0,0,0,0.12))",
                                    transform: "translateZ(60px)",
                                    willChange: "transform",
                                }}
                            />
                        )}

                        {/* Caption - top layer */}
                        <div 
                            className="product-caption absolute z-30 bottom-[3%] md:bottom-[7%] left-1/2 -translate-x-1/2 text-center w-[92%] md:w-[85%]"
                            style={{ transform: "translateZ(80px)" }}
                        >
                            <p
                                className="text-[0.42rem] md:text-[0.65rem] uppercase tracking-[0.3em] md:tracking-[0.4em] text-stone mb-0.5 md:mb-1"
                                style={{ fontFamily: "Syne, sans-serif" }}
                            >
                                S1CK Signature
                            </p>
                            <h3
                                className="text-charcoal text-[0.85rem] md:text-xl tracking-[0.03em] md:tracking-[0.05em] leading-tight"
                                style={{ fontFamily: "Syne, sans-serif", fontWeight: 700 }}
                            >
                                {flavor.name}
                            </h3>
                            <p
                                className="text-[0.4rem] md:text-[0.55rem] mt-1 md:mt-2 text-taupe tracking-[0.25em] md:tracking-[0.3em] uppercase"
                                style={{ fontFamily: "Syne, sans-serif" }}
                            >
                                {String(i + 1).padStart(2, "0")} / {String(visibleFlavors.length).padStart(2, "0")}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default FlavorSlider;
