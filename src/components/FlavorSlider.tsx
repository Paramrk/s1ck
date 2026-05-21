import { flavorlists } from "../constants/details";

const images: Record<string, { default: string }> = import.meta.glob(
    "../assets/images/*.{webp,svg}",
    { eager: true }
);

const getImage = (fileName?: string): string | undefined => {
    if (!fileName?.trim()) return undefined;
    const key = `../assets/images/${fileName}`;
    return images[key]?.default;
};

const visibleFlavors = flavorlists.filter((flavor) => {
    const hasName = flavor.name.trim().length > 0;
    const hasAsset = [flavor.bgImage, flavor.elementsImage, flavor.drinkImage]
        .some((v) => v?.trim().length);
    return hasName && hasAsset;
});

const FlavorSlider = () => {
    return (
        <div
            className="flavor-carousel-stage relative h-full w-full flex items-center justify-center"
            style={{
                perspective: "2200px",
                perspectiveOrigin: "50% 48%",
            }}
        >
            {visibleFlavors.map((flavor, i) => {
                const drinkSrc = getImage(flavor.drinkImage);
                const isFirst = i === 0;
                const vis = isFirst ? 1 : 0;

                return (
                    <div
                        key={flavor.name}
                        className={`fp-${i} absolute inset-0 flex items-center justify-center`}
                        style={{
                            opacity: isFirst ? 1 : 0,
                        }}
                    >
                        {/* ─── Ambient glow behind bottle ─── */}
                        <div
                            className="carousel-glow absolute pointer-events-none"
                            style={{
                                width: "70%",
                                height: "70%",
                                borderRadius: "50%",
                                background: `radial-gradient(circle, ${flavor.accentGlow} 0%, transparent 70%)`,
                                filter: "blur(80px)",
                                zIndex: 0,
                            }}
                        />

                        {/* ═══════════════════════════════════════════════════
                            FLOATING DETAIL ELEMENTS — positioned around bottle
                            ═══════════════════════════════════════════════════ */}

                        {/* ── FLOAT: Top-Left → Tone badge ── */}
                        <div
                            className={`float-tone-${i} floating-detail absolute z-20 hidden lg:block`}
                            style={{
                                top: "12%",
                                left: "4%",
                                opacity: vis,
                                fontFamily: "Syne, sans-serif",
                            }}
                        >
                            <div className="flex items-center gap-2.5 mb-2">
                                <span
                                    className="inline-block w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: flavor.accentColor }}
                                />
                                <span
                                    className="text-xs uppercase tracking-[0.3em] text-stone font-semibold"
                                >
                                    {flavor.tone}
                                </span>
                            </div>
                            <p className="text-[0.7rem] text-charcoal/50 tracking-wider leading-relaxed max-w-[200px]">
                                {flavor.description}
                            </p>
                        </div>

                        {/* ── FLOAT: Top-Right → Tagline ── */}
                        <div
                            className={`float-tagline-${i} floating-detail absolute z-20 hidden lg:block text-right`}
                            style={{
                                top: "10%",
                                right: "4%",
                                opacity: vis,
                                fontFamily: "Syne, sans-serif",
                            }}
                        >
                            <p
                                className="text-[0.65rem] uppercase tracking-[0.3em] mb-1.5"
                                style={{ color: flavor.accentColor, fontWeight: 600 }}
                            >
                                Signature
                            </p>
                            <p className="text-lg text-charcoal font-bold italic leading-snug tracking-wide">
                                "{flavor.tagline}"
                            </p>
                        </div>

                        {/* ── FLOAT: Mid-Left → Top Notes ── */}
                        <div
                            className={`float-top-notes-${i} floating-detail absolute z-20 hidden lg:block text-right`}
                            style={{
                                top: "38%",
                                left: "2%",
                                opacity: vis,
                                fontFamily: "Syne, sans-serif",
                            }}
                        >
                            <p
                                className="text-[0.6rem] uppercase tracking-[0.3em] mb-1.5"
                                style={{ color: flavor.accentColor, fontWeight: 600 }}
                            >
                                Top Notes
                            </p>
                            {flavor.topNotes.map((n) => (
                                <p key={n} className="text-sm text-charcoal/65 leading-[1.9] tracking-wide font-medium">
                                    {n}
                                </p>
                            ))}
                        </div>

                        {/* ── FLOAT: Mid-Right → Heart Notes ── */}
                        <div
                            className={`float-heart-notes-${i} floating-detail absolute z-20 hidden lg:block`}
                            style={{
                                top: "36%",
                                right: "3%",
                                opacity: vis,
                                fontFamily: "Syne, sans-serif",
                            }}
                        >
                            <p
                                className="text-[0.6rem] uppercase tracking-[0.3em] mb-1.5"
                                style={{ color: flavor.accentColor, fontWeight: 600 }}
                            >
                                Heart Notes
                            </p>
                            {flavor.midNotes.map((n) => (
                                <p key={n} className="text-sm text-charcoal/65 leading-[1.9] tracking-wide font-medium">
                                    {n}
                                </p>
                            ))}
                        </div>

                        {/* ── FLOAT: Bottom-Left → Base Notes ── */}
                        <div
                            className={`float-base-notes-${i} floating-detail absolute z-20 hidden lg:block text-right`}
                            style={{
                                bottom: "22%",
                                left: "5%",
                                opacity: vis,
                                fontFamily: "Syne, sans-serif",
                            }}
                        >
                            <p
                                className="text-[0.6rem] uppercase tracking-[0.3em] mb-1.5"
                                style={{ color: flavor.accentColor, fontWeight: 600 }}
                            >
                                Base Notes
                            </p>
                            {flavor.baseNotes.map((n) => (
                                <p key={n} className="text-sm text-charcoal/65 leading-[1.9] tracking-wide font-medium">
                                    {n}
                                </p>
                            ))}
                        </div>

                        {/* ── FLOAT: Bottom-Right → Scent Profile Bars ── */}
                        <div
                            className={`float-profile-${i} floating-detail absolute z-20 hidden lg:block`}
                            style={{
                                bottom: "18%",
                                right: "3%",
                                width: "180px",
                                opacity: vis,
                                fontFamily: "Syne, sans-serif",
                            }}
                        >
                            <p
                                className="text-[0.6rem] uppercase tracking-[0.3em] mb-3"
                                style={{ color: flavor.accentColor, fontWeight: 600 }}
                            >
                                Scent Profile
                            </p>
                            <div className="flex flex-col gap-2.5">
                                {[
                                    { label: "Intensity", value: 85 },
                                    { label: "Longevity", value: 92 },
                                    { label: "Sillage", value: 78 },
                                ].map((stat) => (
                                    <div key={stat.label}>
                                        <div className="flex justify-between text-[0.6rem] text-charcoal/50 uppercase tracking-widest mb-1">
                                            <span>{stat.label}</span>
                                            <span>{stat.value}%</span>
                                        </div>
                                        <div className="w-full h-[3px] bg-charcoal/8 rounded-full overflow-hidden">
                                            <div
                                                className={`profile-bar-${i} h-full rounded-full`}
                                                style={{
                                                    width: isFirst ? `${stat.value}%` : "0%",
                                                    backgroundColor: flavor.accentColor,
                                                    transition: "width 1s ease-out",
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Decorative connector lines — thin radial lines from bottle to text ── */}
                        <svg className="floating-detail connector-lines absolute inset-0 w-full h-full pointer-events-none z-10 hidden lg:block" style={{ opacity: vis }}>
                            {/* Top-left connector */}
                            <line x1="38%" y1="30%" x2="22%" y2="20%" stroke={flavor.accentColor} strokeWidth="0.5" opacity="0.2" />
                            {/* Top-right connector */}
                            <line x1="62%" y1="28%" x2="78%" y2="18%" stroke={flavor.accentColor} strokeWidth="0.5" opacity="0.2" />
                            {/* Mid-left connector */}
                            <line x1="36%" y1="48%" x2="18%" y2="46%" stroke={flavor.accentColor} strokeWidth="0.5" opacity="0.15" />
                            {/* Mid-right connector */}
                            <line x1="64%" y1="46%" x2="82%" y2="44%" stroke={flavor.accentColor} strokeWidth="0.5" opacity="0.15" />
                            {/* Bottom-left connector */}
                            <line x1="40%" y1="68%" x2="22%" y2="74%" stroke={flavor.accentColor} strokeWidth="0.5" opacity="0.2" />
                            {/* Bottom-right connector */}
                            <line x1="60%" y1="70%" x2="80%" y2="76%" stroke={flavor.accentColor} strokeWidth="0.5" opacity="0.2" />
                        </svg>

                        {/* ─── MOBILE DETAIL: Above caption ─── */}
                        <div
                            className={`detail-mobile-${i} absolute z-30 lg:hidden left-0 right-0 flex flex-col items-center gap-1 px-5`}
                            style={{
                                fontFamily: "Syne, sans-serif",
                                opacity: vis,
                                bottom: "20%",
                            }}
                        >
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <span
                                    className="inline-block w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: flavor.accentColor }}
                                />
                                <span className="text-[0.5rem] uppercase tracking-[0.18em] text-stone font-semibold">
                                    {flavor.tone}
                                </span>
                            </div>
                            <p className="text-[0.55rem] text-charcoal/50 text-center tracking-wide max-w-[260px] leading-relaxed">
                                {flavor.description}
                            </p>
                            <div className="flex gap-2.5 mt-0.5 flex-wrap justify-center">
                                {[...flavor.topNotes.slice(0, 2)].map((n) => (
                                    <span key={n} className="text-[0.45rem] uppercase tracking-[0.15em] text-stone/50 font-medium">
                                        {n}
                                    </span>
                                ))}
                                <span className="text-[0.45rem] uppercase tracking-[0.15em]" style={{ color: flavor.accentColor }}>
                                    +{flavor.topNotes.length + flavor.midNotes.length + flavor.baseNotes.length - 2} more
                                </span>
                            </div>
                        </div>

                        {/* ─── BOTTLE ─── */}
                        {drinkSrc && (
                            <img
                                src={drinkSrc}
                                alt={flavor.name}
                                loading={isFirst ? "eager" : "lazy"}
                                decoding="async"
                                draggable={false}
                                className="product-bottle relative z-10 h-[38%] md:h-[65%] max-h-[540px] object-contain"
                                style={{
                                    filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.28)) drop-shadow(0 10px 20px rgba(0,0,0,0.14))",
                                    willChange: "transform",
                                }}
                            />
                        )}

                        {/* ─── BOTTOM CAPTION: Name & Counter ─── */}
                        <div
                            className="product-caption absolute z-30 bottom-[7%] md:bottom-[5%] left-1/2 -translate-x-1/2 text-center w-[92%] md:w-[85%]"
                        >
                            <p
                                className="text-[0.45rem] md:text-[0.65rem] uppercase tracking-[0.35em] text-stone mb-0.5"
                                style={{ fontFamily: "Syne, sans-serif" }}
                            >
                                S1CK Signature
                            </p>
                            <h3
                                className="text-charcoal text-lg md:text-3xl tracking-[0.03em] leading-tight"
                                style={{ fontFamily: "Syne, sans-serif", fontWeight: 700 }}
                            >
                                {flavor.name}
                            </h3>
                            <p
                                className="text-[0.45rem] md:text-[0.6rem] mt-1 md:mt-2 tracking-[0.3em] uppercase"
                                style={{
                                    fontFamily: "Syne, sans-serif",
                                    color: flavor.accentColor,
                                }}
                            >
                                {String(i + 1).padStart(2, "0")} / {String(visibleFlavors.length).padStart(2, "0")}
                            </p>
                        </div>

                        {/* ─── Floor shadow ─── */}
                        <div
                            className="floor-shadow absolute bottom-[8%] md:bottom-[12%] left-1/2 -translate-x-1/2 pointer-events-none rounded-full"
                            style={{
                                width: "40%",
                                height: "20px",
                                background: "radial-gradient(ellipse, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 70%)",
                                filter: "blur(4px)",
                            }}
                        />
                    </div>
                );
            })}

            {/* ─── Scroll progress dots ─── */}
            <div className="carousel-dots absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-1.5 md:gap-2">
                {visibleFlavors.map((flavor, i) => (
                    <div
                        key={flavor.name}
                        className={`carousel-dot-${i}`}
                        style={{
                            width: "6px",
                            height: i === 0 ? "24px" : "6px",
                            borderRadius: "3px",
                            backgroundColor: i === 0 ? flavor.accentColor : "rgba(17,17,17,0.15)",
                            transition: "all 0.5s ease",
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default FlavorSlider;
