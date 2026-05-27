const ScentSectionTitle = () => (
    <div className="sc-title-block general-title flex flex-col items-center text-center w-full max-w-3xl mx-auto gap-2 max-md:gap-1.5 lg:gap-4 px-2 max-md:px-1">
        <div
            className="sc-title-stars hidden md:flex items-center justify-center gap-2 lg:gap-3 text-[0.62rem] md:text-[0.72rem] text-stone uppercase tracking-[0.14em] md:tracking-[0.2em]"
            style={{ fontFamily: "Syne, sans-serif", fontWeight: 500 }}
        >
            <span className="flex items-center gap-[1px] lg:gap-[2px]">
                {[0, 1, 2, 3, 4].map((s) => (
                    <svg
                        key={s}
                        viewBox="0 0 20 20"
                        className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-[14px] lg:h-[14px] text-sick-red fill-current"
                        aria-hidden="true"
                    >
                        <path d="M10 1.5l2.6 5.3 5.9.86-4.27 4.16 1.01 5.88L10 14.9l-5.24 2.8 1-5.88L1.5 7.66l5.9-.86z" />
                    </svg>
                ))}
            </span>
            <span className="hidden sm:inline">Fresh additions to the collection</span>
        </div>

        <div className="sc-first-text-split w-full flex justify-center overflow-x-visible overflow-y-clip pb-1 md:pb-2">
            <h2
                id="scent-composition-heading"
                className="sc-whatsnew-title flavor-headline-stack text-charcoal leading-[0.92] text-[1.35rem] max-[380px]:text-[1.2rem] sm:text-[2rem] md:text-5xl lg:text-6xl 2xl:text-[5.5rem] font-bold uppercase gap-0 max-[380px]:gap-0 sm:gap-2 md:gap-3"
            >
                <span className="flavor-headline-line">What&apos;s</span>
                <span className="flavor-headline-line">New</span>
            </h2>
        </div>

        <div className="sc-flavor-text-scroll mt-0 max-md:mt-0.5 md:mt-1">
            <div className="bg-sick-red md:py-4 py-1 md:px-6 px-3 max-md:py-1 max-md:px-3">
                <p className="text-white text-[0.58rem] sm:text-xs md:text-base tracking-[0.06em] md:tracking-[-0.01em] text-nowrap uppercase font-bold">
                    Just Launched
                </p>
            </div>
        </div>

        <p
            className="sc-title-subtitle hidden sm:block text-stone md:text-sm text-xs max-w-sm mx-auto leading-relaxed tracking-[0.02em] md:tracking-[0.04em] text-center mt-1"
            style={{ fontFamily: "Syne, sans-serif", fontWeight: 400 }}
        >
            Discover our latest fragrance lines.
        </p>
    </div>
);

export default ScentSectionTitle;
