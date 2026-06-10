import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductByHandle, getMergedProduct } from "../utils/shopify";
import Navbar from "../components/Navbar";
import FooterSection from "../sections/FooterSection";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cartStore } from "../utils/cartStore";

const ProductDetailPage = () => {
    const { handle } = useParams<{ handle: string }>();
    const [product, setProduct] = useState<any>(null);
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [activeImage, setActiveImage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (handle) {
            setLoading(true);
            getProductByHandle(handle)
                .then((data) => {
                    if (data) {
                        const merged = getMergedProduct(data);
                        setProduct(merged);
                        setActiveImage(merged?.displayImage || "");
                        setSelectedVariant(merged?.variants?.nodes?.[0] || null);
                    } else {
                        setError("Product not found");
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setError("Failed to load product");
                    setLoading(false);
                });
        }
    }, [handle]);

    useGSAP(() => {
        if (!loading && product) {
            const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

            tl.fromTo(
                ".product-image-container",
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 1.2 }
            );

            tl.fromTo(
                ".product-details-container > *",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
                "-=1.0"
            );
        }
    }, [loading, product]);

    const handleAddToCart = () => {
        if (!selectedVariant || !product) return;

        cartStore.addItem({
            id: selectedVariant.id,
            title: product.title,
            variantTitle: selectedVariant.title,
            price: selectedVariant.price.amount,
            currencyCode: selectedVariant.price.currencyCode,
            image: product.displayImage || "",
            handle: handle || "",
        });

        // Trigger navbar to open Cart Drawer
        window.dispatchEvent(new CustomEvent("open-cart"));
    };

    if (loading) {
        return (
            <main className="bg-cream min-h-screen flex items-center justify-center">
                <Navbar />
                <div className="text-center">
                    <p className="text-charcoal uppercase tracking-[0.2em] animate-pulse">Loading Scent...</p>
                </div>
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="bg-cream min-h-screen flex flex-col items-center justify-center gap-6">
                <Navbar />
                <div className="text-center px-4">
                    <h2 className="text-charcoal text-2xl uppercase tracking-wider font-bold mb-4">
                        {error || "Product Not Found"}
                    </h2>
                    <p className="text-stone text-sm mb-8">The scent you are looking for does not exist or has been removed.</p>
                    <Link to="/shop" className="sick-btn">
                        Back to Shop
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main ref={containerRef} className="bg-cream min-h-screen flex flex-col justify-between">
            <Navbar />

            <div className="max-w-7xl mx-auto w-full px-6 md:px-14 py-32 flex flex-col lg:flex-row gap-12 lg:gap-20">
                {/* Image Gallery */}
                <div className="product-image-container flex-1 flex flex-col gap-4">
                    <div className="aspect-[4/5] overflow-hidden bg-parchment border border-ivory">
                        {activeImage ? (
                            <img
                                src={activeImage}
                                alt={product.title}
                                className="w-full h-full object-cover object-center transition-all duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone/40">
                                No Image Available
                            </div>
                        )}
                    </div>
                    {/* Thumbnails */}
                    {product.images?.nodes?.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                            {product.images.nodes.map((img: any, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImage(img.url)}
                                    className={`w-20 aspect-[4/5] overflow-hidden bg-parchment border transition-all ${
                                        activeImage === img.url ? "border-sick-red" : "border-ivory"
                                    }`}
                                >
                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details Column */}
                <div className="product-details-container flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="block w-8 h-px bg-sick-red" />
                        <span className="text-sick-red text-[0.6rem] uppercase tracking-[0.3em] font-semibold">
                            Shopify Collection
                        </span>
                    </div>

                    <h1
                        className="text-charcoal text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight mb-4"
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        {product.title}
                    </h1>

                    {selectedVariant && (
                        <p className="text-charcoal text-xl md:text-2xl tracking-wide mb-8 font-medium">
                            ${parseFloat(selectedVariant.price.amount).toFixed(2)}{" "}
                            <span className="text-stone text-xs uppercase tracking-widest ml-1">
                                {selectedVariant.price.currencyCode}
                            </span>
                        </p>
                    )}

                    <div className="h-px bg-ivory w-full mb-8" />

                    {product.tagline && (
                        <p className="text-stone text-xs md:text-sm font-semibold tracking-wider mb-2 italic">
                            "{product.tagline}"
                        </p>
                    )}

                    <div className="text-stone text-sm leading-relaxed mb-8 space-y-4 font-light">
                        <p>{product.description}</p>
                    </div>

                    {/* Fragrance Notes */}
                    {product.topNotes && (
                        <div className="mb-8 border-t border-b border-ivory py-6 space-y-4">
                            <h3 className="text-charcoal text-[0.7rem] uppercase tracking-[0.2em] font-bold">
                                Fragrance Notes
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <h4 className="text-[0.6rem] uppercase tracking-widest text-sick-red mb-1 font-semibold">Top Notes</h4>
                                    <p className="text-stone text-xs leading-relaxed">{product.topNotes.join(", ")}</p>
                                </div>
                                <div>
                                    <h4 className="text-[0.6rem] uppercase tracking-widest text-sick-red mb-1 font-semibold">Heart Notes</h4>
                                    <p className="text-stone text-xs leading-relaxed">{product.midNotes.join(", ")}</p>
                                </div>
                                <div>
                                    <h4 className="text-[0.6rem] uppercase tracking-widest text-sick-red mb-1 font-semibold">Base Notes</h4>
                                    <p className="text-stone text-xs leading-relaxed">{product.baseNotes.join(", ")}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Variant Selector */}
                    {product.variants?.nodes?.length > 1 && (
                        <div className="mb-8">
                            <label className="block text-charcoal text-[0.7rem] uppercase tracking-[0.2em] font-bold mb-3">
                                Select Variant
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedVariant?.id || ""}
                                    onChange={(e) => {
                                        const found = product.variants.nodes.find((v: any) => v.id === e.target.value);
                                        if (found) setSelectedVariant(found);
                                    }}
                                    className="w-full bg-transparent border border-charcoal text-charcoal px-4 py-3 text-xs uppercase tracking-[0.15em] focus:outline-none appearance-none cursor-pointer rounded-none"
                                >
                                    {product.variants.nodes.map((variant: any) => (
                                        <option key={variant.id} value={variant.id}>
                                            {variant.title} - ${parseFloat(variant.price.amount).toFixed(2)}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-charcoal">
                                    <i className="ri-arrow-down-s-line" />
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedVariant?.availableForSale}
                        className="sick-btn-filled w-full py-4 text-center mt-4 tracking-[0.25em]"
                    >
                        {selectedVariant?.availableForSale ? "Add to Bag" : "Out of Stock"}
                    </button>

                    <Link to="/shop" className="text-stone text-[0.6rem] uppercase tracking-[0.2em] mt-8 text-center hover:text-charcoal transition-colors">
                        <i className="ri-arrow-left-line mr-2" /> Back to all collections
                    </Link>
                </div>
            </div>

            <FooterSection />
        </main>
    );
};

export default ProductDetailPage;
