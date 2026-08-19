const pressLogos = [
    {
        name: "FOX",
        src: "https://cdn.shopify.com/s/files/1/0022/0358/2529/files/Fox-logo_1.png?v=1722110543",
    },
    {
        name: "USA Today",
        src: "https://cdn.shopify.com/s/files/1/0022/0358/2529/files/usa-today-logo_1.png?v=1722110543",
    },
    {
        name: "MarketWatch",
        src: "https://cdn.shopify.com/s/files/1/0022/0358/2529/files/marketwatch-logo_1.png?v=1722110543",
    },
    {
        name: "Digital Journal",
        src: "https://cdn.shopify.com/s/files/1/0022/0358/2529/files/digital-journal.png?v=1722110543",
    },
];

const TrustBannerSection = () => {
    return (
        <section className="homepage-trust" aria-label="Press recognition and customer trust">
            <div className="press-strip">
                <p className="press-strip-title">As Seen On</p>
                <div className="press-logo-list">
                    {pressLogos.map((logo) => (
                        <img
                            key={logo.name}
                            src={logo.src}
                            alt={logo.name}
                            loading="lazy"
                            decoding="async"
                        />
                    ))}
                </div>
            </div>

            <div className="scientific-trust-banner">
                <p className="trust-rating">
                    <span className="trust-stars" aria-label="Five star rating">★★★★★</span>
                    <span>Over 100,000+ Happy Customers</span>
                </p>
                <h2>Scientifically Formulated To Attract<span aria-hidden="true">★</span></h2>
                <p className="trust-proof">Rated #1 Pheromones 6 Years In A Row By House Of Pheromones</p>
            </div>
        </section>
    );
};

export default TrustBannerSection;
