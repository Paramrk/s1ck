import { Link } from "react-router-dom";

type AffiliateSectionProps = {
    variant?: "footer" | "page";
};

const perks = [
    { icon: "ri-percent-line", label: "10% cash back" },
    { icon: "ri-links-line", label: "Custom tracking links" },
    { icon: "ri-bar-chart-line", label: "Real-time dashboard" },
];

const affiliateCtaClassName =
    "relative z-20 mt-8 md:mt-10 bg-white text-black px-8 md:px-10 py-3.5 md:py-4 text-[0.62rem] md:text-[0.7rem] font-bold tracking-[0.18em] md:tracking-[0.2em] hover:opacity-80 transition-all uppercase inline-flex items-center gap-2";

const AffiliateSection = ({ variant = "footer" }: AffiliateSectionProps) => {
    const isFooter = variant === "footer";

    if (isFooter) {
        return (
            <section
                className="footer-affiliate-block relative z-20 mx-auto mt-10 md:mt-16 flex max-w-3xl flex-col items-center justify-center overflow-visible px-5 pb-6 text-center md:pb-8"
                data-nav-logo="light"
            >
                <div className="mb-5 flex flex-wrap items-center justify-center gap-3 md:mb-6">
                    <i className="ri-hand-coin-line shrink-0 text-xl text-white md:text-2xl" aria-hidden />
                    <div className="border border-white/30 px-3 py-1 md:px-4 md:py-1.5">
                        <p
                            className="text-[0.58rem] font-bold tracking-[0.22em] text-white md:text-[0.65rem] md:tracking-[0.25em]"
                            style={{ fontFamily: "Syne, sans-serif" }}
                        >
                            PARTNER PROGRAM
                        </p>
                    </div>
                </div>

                <h2
                    className="mt-1 text-[clamp(1.35rem,5.5vw,1.75rem)] font-bold uppercase leading-tight tracking-wide text-white md:mt-2 md:text-5xl"
                    style={{ fontFamily: "Syne, sans-serif" }}
                >
                    JOIN THE <span className="text-white/50">AFFILIATE PROGRAM</span>
                </h2>

                <p
                    className="mt-2 text-[clamp(1.75rem,8vw,2.25rem)] font-bold uppercase leading-[0.95] tracking-wide text-white md:text-7xl"
                    style={{ fontFamily: "Syne, sans-serif" }}
                >
                    EARN 10% CASH BACK
                </p>

                <div
                    className="footer-affiliate-perks mt-6 flex max-w-xs flex-col items-center space-y-1.5 text-[0.58rem] uppercase tracking-[0.12em] text-white/70 md:mt-8 md:max-w-none md:space-y-2 md:text-[0.65rem] md:tracking-[0.15em]"
                    style={{ fontFamily: "Syne, sans-serif" }}
                >
                    <p>FREE TO JOIN — NO FEES EVER</p>
                    <p>CUSTOM LINKS & REAL-TIME TRACKING</p>
                </div>

                <Link
                    to="/affiliate"
                    className={`footer-affiliate-cta ${affiliateCtaClassName}`}
                    style={{ fontFamily: "Syne, sans-serif" }}
                >
                    JOIN PARTNER PROGRAM <span aria-hidden>&rarr;</span>
                </Link>
            </section>
        );
    }

    return (
        <section
            className="affiliate-page-teaser relative z-20 mx-auto max-w-4xl px-6 py-16 text-center md:px-14 md:py-24"
            data-nav-logo="light"
        >
            <div className="mb-5 inline-flex items-center gap-2 border border-white/25 px-3 py-1 md:mb-6">
                <i className="ri-hand-coin-line text-sm text-cream" aria-hidden />
                <p
                    className="text-[0.58rem] font-bold uppercase tracking-[0.22em] text-cream/90 md:text-[0.65rem] md:tracking-[0.25em]"
                    style={{ fontFamily: "Syne, sans-serif" }}
                >
                    Partner Program
                </p>
            </div>

            <h2
                className="text-3xl font-bold uppercase leading-[0.95] tracking-tight text-cream md:text-5xl"
                style={{ fontFamily: "Syne, sans-serif" }}
            >
                Earn With <span className="text-cream/45">S1CK</span>
            </h2>

            <p
                className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream/60 md:mt-5 md:text-base"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
            >
                Share scents that actually work. Get paid for every order you drive — creators,
                campus reps, and partners welcome.
            </p>

            <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs md:mt-8 md:text-sm">
                {perks.map((perk) => (
                    <li
                        key={perk.label}
                        className="flex items-center gap-2 uppercase tracking-[0.12em] text-cream/75"
                        style={{ fontFamily: "Syne, sans-serif", fontWeight: 500 }}
                    >
                        <i className={`${perk.icon} text-base text-champagne`} aria-hidden />
                        {perk.label}
                    </li>
                ))}
            </ul>

            <Link
                to="/affiliate"
                className={`footer-affiliate-cta ${affiliateCtaClassName} bg-cream text-charcoal`}
                style={{ fontFamily: "Syne, sans-serif" }}
            >
                Partner Program <span aria-hidden>&rarr;</span>
            </Link>
        </section>
    );
};

export default AffiliateSection;
