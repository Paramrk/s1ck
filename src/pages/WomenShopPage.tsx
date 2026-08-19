import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Navbar from "../components/Navbar";
import FooterSection from "../sections/FooterSection";
import ProductCard3D from "../components/ProductCard3D";
import { flavorlists } from "../constants/details";
import { getImage } from "../utils/media";
import { useScrollTriggerRefresh } from "../hooks/useScrollTriggerRefresh";
import { getProductsByCollection, getMergedProduct } from "../utils/shopify";

gsap.registerPlugin(ScrollTrigger);

const WomenShopPage = () => {
    const pageRef = useRef<HTMLDivElement>(null);
    const heroImgRef = useRef<HTMLImageElement>(null);
    const [shopifyProducts, setShopifyProducts] = useState<any[]>([]);
    const womenImg = getImage("shop_img_women") || getImage("women-menu.webp");
    useScrollTriggerRefresh();

    useEffect(() => {
        window.scrollTo(0, 0);
        
        getProductsByCollection("women")
            .then((products) => {
                if (products && products.length > 0) {
                    setShopifyProducts(products);
                }
            })
            .catch((err) => console.error("Error loading products from Shopify:", err));

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        // Hero image clip-path reveal
        tl.fromTo(
            ".women-hero-img-wrap",
            { clipPath: "inset(100% 0 0 0)" },
            { clipPath: "inset(0% 0 0 0)", duration: 1.4 }
        );

        // Hero parallax on scroll
        if (heroImgRef.current) {
            gsap.to(heroImgRef.current, {
                yPercent: 15,
                ease: "none",
                scrollTrigger: {
                    trigger: ".women-hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });
        }

        // Overlay darken on scroll
        gsap.to(".women-hero-overlay", {
            opacity: 0.9,
            ease: "none",
            scrollTrigger: {
                trigger: ".women-hero",
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
        });

        // Breadcrumb line + text
        tl.fromTo(
            ".breadcrumb-line",
            { scaleX: 0 },
            { scaleX: 1, duration: 0.6, ease: "power2.out" },
            "-=0.8"
        );
        tl.fromTo(
            ".women-hero-breadcrumb",
            { opacity: 0, x: -15 },
            { opacity: 1, x: 0, duration: 0.6 },
            "-=0.4"
        );

        // Title clip reveal
        tl.fromTo(
            ".women-hero-title",
            { yPercent: 120 },
            { yPercent: 0, duration: 1.1, ease: "power4.out" },
            "-=0.6"
        );

        // Subtitle
        tl.fromTo(
            ".women-hero-sub",
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.6 },
            "-=0.4"
        );

        // Section heading
        gsap.fromTo(
            ".products-heading",
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
                scrollTrigger: { trigger: ".products-heading", start: "top 88%" },
            }
        );

        // Product cards — staggered
        gsap.utils.toArray<HTMLElement>(".product-card-3d-wrapper").forEach((card, i) => {
            gsap.fromTo(
                card,
                { y: 60, opacity: 0, scale: 0.96 },
                {
                    y: 0, opacity: 1, scale: 1,
                    duration: 0.8,
                    delay: i * 0.08,
                    ease: "power3.out",
                    scrollTrigger: { trigger: card, start: "top 92%" },
                }
            );
        });
    }, { scope: pageRef });

    return (
        <main ref={pageRef} className="bg-cream min-h-dvh">
            <Navbar />

            {/* Hero */}
            <section className="women-hero relative h-[70vh] w-full overflow-hidden">
                <div className="women-hero-img-wrap absolute inset-0">
                    <img
                        ref={heroImgRef}
                        src={womenImg}
                        alt="Women's Collection"
                        loading="eager"
                        decoding="async"
                        className="w-full h-[120%] object-cover absolute top-0 left-0"
                    />
                </div>
                <div className="women-hero-overlay absolute inset-0 bg-gradient-to-t from-cream via-cream/50 to-cream/10 z-10" />

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-14 z-20">
                    <div className="flex items-center gap-4 mb-5">
                        <span className="breadcrumb-line block w-8 h-px bg-champagne origin-left" />
                        <p
                            className="women-hero-breadcrumb text-charcoal/50 text-[0.6rem] uppercase tracking-[0.3em]"
                            style={{ fontFamily: "Syne, sans-serif", fontWeight: 500 }}
                        >
                            <Link to="/shop" className="hover:text-charcoal transition-colors duration-300">Shop</Link>
                            <span className="mx-2 text-charcoal/30">/</span>
                            <span className="text-charcoal/70">Women</span>
                        </p>
                    </div>
                    <div className="overflow-hidden">
                        <h1
                            className="women-hero-title text-charcoal text-5xl md:text-7xl font-bold uppercase tracking-tight"
                            style={{ fontFamily: "Syne, sans-serif" }}
                        >
                            For Her
                        </h1>
                    </div>
                    <p
                        className="women-hero-sub text-stone text-xs md:text-sm mt-4 uppercase tracking-[0.2em]"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                    >
                        Elegance meets chemistry
                    </p>
                </div>
            </section>

            {/* Product Grid */}
            <section className="px-6 md:px-14 py-20">
                <div className="max-w-7xl mx-auto">
                    <div className="products-heading flex items-center justify-between gap-5 mb-12">
                        <div className="flex items-center gap-4">
                            <span className="block w-10 h-px bg-champagne" />
                            <p
                                className="text-champagne text-[0.65rem] uppercase tracking-[0.35em]"
                                style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}
                            >
                                Signature Fragrances — {shopifyProducts.length > 0 ? shopifyProducts.length : flavorlists.length} scents
                            </p>
                        </div>
                        <span className="text-[0.65rem] uppercase tracking-widest text-stone-500 font-semibold hidden sm:inline">
                            Premium Extraction • 48mg Pheromones
                        </span>
                    </div>

                    <div className="product-grid grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-8 gap-y-10">
                        {(shopifyProducts.length > 0
                            ? shopifyProducts.map((p) => {
                                  const merged = getMergedProduct(p);
                                  const firstVariant = p.variants?.nodes?.[0];
                                  return {
                                      id: p.id,
                                      name: p.title,
                                      handle: p.handle,
                                      image: merged?.displayImage || "",
                                      price: `$${parseFloat(p.priceRange?.minVariantPrice?.amount || "0").toFixed(2)}`,
                                      numericPrice: parseFloat(p.priceRange?.minVariantPrice?.amount || "0"),
                                      currencyCode: p.priceRange?.minVariantPrice?.currencyCode || "USD",
                                      variantId: firstVariant?.id,
                                      badge: "48mg Pheromones",
                                  };
                              })
                            : flavorlists.map((p) => ({
                                  id: p.name,
                                  name: p.name,
                                  handle: p.name.toLowerCase().replace(/[èéêë]/g, "e").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                                  image: getImage(p.drinkImage || ""),
                                  price: "$89.00",
                                  numericPrice: 89,
                                  currencyCode: "USD",
                                  badge: "48mg Pheromones",
                              }))
                        ).map((product, i) => (
                            <ProductCard3D
                                key={product.id || product.handle}
                                product={product}
                                index={i}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <FooterSection />
        </main>
    );
};

export default WomenShopPage;
