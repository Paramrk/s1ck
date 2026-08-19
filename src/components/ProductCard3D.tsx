import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cartStore } from "../utils/cartStore";
import { createShopifyCheckout, getProductUrl } from "../utils/shopify";

export interface ProductCardItem {
    id: string;
    name: string;
    handle: string;
    image: string;
    price: string;
    numericPrice?: number;
    currencyCode?: string;
    variantId?: string;
    tagline?: string;
    badge?: string;
    rating?: number;
    reviewsCount?: number;
}

interface ProductCard3DProps {
    product: ProductCardItem;
    index: number;
}

export const ProductCard3D: React.FC<ProductCard3DProps> = ({ product, index }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
    const [isAdding, setIsAdding] = useState(false);
    const [addedSuccess, setAddedSuccess] = useState(false);
    const [isBuying, setIsBuying] = useState(false);
    const navigate = useNavigate();

    const productHref = getProductUrl(product.handle || product.name);
    const isLocalRoute = productHref.startsWith("/");

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotX = ((y - centerY) / centerY) * -10;
        const rotY = ((x - centerX) / centerX) * 10;

        setRotateX(rotX);
        setRotateY(rotY);
        setGlarePos({
            x: (x / rect.width) * 100,
            y: (y / rect.height) * 100,
            opacity: 0.35,
        });
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setRotateX(0);
        setRotateY(0);
        setGlarePos((prev) => ({ ...prev, opacity: 0 }));
    };

    const cleanPrice = product.price.replace(/[^0-9.]/g, "") || "89.00";
    const variantGid = product.variantId || product.id || `gid://shopify/ProductVariant/${product.handle}`;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isAdding) return;
        setIsAdding(true);

        cartStore.addItem({
            id: variantGid,
            title: product.name,
            variantTitle: "Default Size (50ml / 1.7oz)",
            price: cleanPrice,
            currencyCode: product.currencyCode || "USD",
            image: product.image,
            handle: product.handle,
        });

        setAddedSuccess(true);
        window.dispatchEvent(new CustomEvent("open-cart"));

        setTimeout(() => {
            setIsAdding(false);
            setTimeout(() => setAddedSuccess(false), 2000);
        }, 300);
    };

    const handleBuyNow = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isBuying) return;
        setIsBuying(true);

        cartStore.addItem({
            id: variantGid,
            title: product.name,
            variantTitle: "Default Size (50ml / 1.7oz)",
            price: cleanPrice,
            currencyCode: product.currencyCode || "USD",
            image: product.image,
            handle: product.handle,
        });

        try {
            const checkoutUrl = await createShopifyCheckout([
                { variantId: variantGid, quantity: 1 }
            ]);

            if (checkoutUrl) {
                window.location.href = checkoutUrl;
                return;
            }
        } catch (err) {
            console.error("Instant checkout redirect failed, opening cart drawer:", err);
        }

        setIsBuying(false);
        window.dispatchEvent(new CustomEvent("open-cart"));
    };

    const handleCardClick = () => {
        if (isLocalRoute) {
            navigate(productHref);
        } else {
            window.location.href = productHref;
        }
    };

    return (
        <div
            className="product-card-3d-wrapper perspective-[1200px] w-full"
            style={{ perspective: "1200px" }}
        >
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleCardClick}
                className={`product-card group relative flex flex-col justify-between rounded-2xl bg-white border border-[#e8e4dc] p-4 sm:p-5 transition-all duration-500 ease-out cursor-pointer select-none ${
                    isHovered
                        ? "shadow-[0_25px_50px_-12px_rgba(181,138,43,0.18),0_12px_24px_-8px_rgba(0,0,0,0.08)] border-[#c9a24b]/60"
                        : "shadow-[0_8px_20px_-6px_rgba(0,0,0,0.05)]"
                }`}
                style={{
                    transform: isHovered
                        ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px) scale3d(1.02, 1.02, 1.02)`
                        : "rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)",
                    transformStyle: "preserve-3d",
                    willChange: "transform, box-shadow",
                }}
            >
                {/* 3D Glare Light Sweep Overlay */}
                <div
                    className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 z-30 overflow-hidden"
                    style={{
                        background: `radial-gradient(circle 320px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.45) 0%, rgba(201,162,75,0.1) 40%, transparent 80%)`,
                        opacity: glarePos.opacity,
                    }}
                />

                {/* Top Badge & Number Header */}
                <div
                    className="flex items-center justify-between gap-2 mb-3 z-20"
                    style={{ transform: "translateZ(25px)" }}
                >
                    <div className="flex items-center gap-1.5 bg-[#fbf8f0] border border-[#c9a24b]/40 px-2.5 py-1 rounded-full shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c9a24b] animate-pulse" />
                        <span className="text-[0.6rem] font-extrabold uppercase tracking-[0.18em] text-[#8a6818]">
                            {product.badge || "48mg Pheromones"}
                        </span>
                    </div>

                    <span
                        className="text-[0.65rem] font-mono font-bold text-stone-400 uppercase tracking-widest"
                        style={{ fontFamily: "Inter, sans-serif" }}
                    >
                        {String(index + 1).padStart(2, "0")}
                    </span>
                </div>

                {/* Image Stage Container with 3D Depth */}
                <div
                    className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-gradient-to-b from-[#f9f8f5] to-[#f0ede6] flex items-center justify-center p-3 sm:p-4 mb-4"
                    style={{ transform: "translateZ(35px)" }}
                >
                    {/* Subtle Radial Glow Under Bottle */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(201,162,75,0.18)_0%,transparent_70%)]" />

                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            decoding="async"
                            className={`card-img w-full h-full object-contain object-center drop-shadow-[0_15px_20px_rgba(0,0,0,0.12)] transition-transform duration-700 ease-out ${
                                isHovered ? "scale-110 -translate-y-1.5 drop-shadow-[0_20px_28px_rgba(0,0,0,0.2)]" : "scale-100"
                            }`}
                        />
                    ) : (
                        <div className="text-stone-400 text-xs uppercase tracking-widest font-semibold">
                            Fragrance
                        </div>
                    )}

                    {/* Quick View Tag on Hover */}
                    <div
                        className={`absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/85 backdrop-blur-md text-white text-[0.62rem] uppercase tracking-[0.2em] font-bold px-3 py-1.5 rounded-full shadow-lg transition-all duration-300 ${
                            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                        }`}
                    >
                        View Details
                    </div>
                </div>

                {/* Product Info Block with Elevation */}
                <div
                    className="flex flex-col gap-1.5 mb-4 z-20"
                    style={{ transform: "translateZ(20px)" }}
                >
                    {/* Ratings row */}
                    <div className="flex items-center gap-1.5 text-xs">
                        <div className="flex text-[#c9a24b] text-xs">
                            {"★".repeat(5)}
                        </div>
                        <span className="text-[0.65rem] font-bold text-stone-700">5.0</span>
                        <span className="text-[0.6rem] text-stone-400">({product.reviewsCount || 48})</span>
                    </div>

                    {/* Title */}
                    <h3
                        className="text-[#111111] text-base sm:text-lg font-bold uppercase tracking-tight line-clamp-1 group-hover:text-[#9e7620] transition-colors duration-300"
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        {product.name}
                    </h3>

                    {/* Price and edition tag */}
                    <div className="flex items-baseline justify-between mt-0.5">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-[#111111] text-lg sm:text-xl font-extrabold tracking-tight">
                                {product.price.startsWith("$") ? product.price : `$${product.price}`}
                            </span>
                            <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-stone-400">
                                {product.currencyCode || "USD"}
                            </span>
                        </div>

                        <span className="text-[0.6rem] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider border border-emerald-200">
                            In Stock
                        </span>
                    </div>
                </div>

                {/* Action Buttons: Add to Cart & Buy Now */}
                <div
                    className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f0ece4] z-20"
                    style={{ transform: "translateZ(30px)" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Add to Cart Button */}
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-[0.65rem] sm:text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer ${
                            addedSuccess
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "border-[#111111] bg-white text-[#111111] hover:bg-[#111111] hover:text-white active:scale-95 shadow-xs"
                        }`}
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        <i className={addedSuccess ? "ri-check-line text-sm" : "ri-shopping-bag-line text-sm"} />
                        <span>{addedSuccess ? "Added" : isAdding ? "Adding..." : "Add"}</span>
                    </button>

                    {/* Buy Now Button */}
                    <button
                        type="button"
                        onClick={handleBuyNow}
                        disabled={isBuying}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#c9a24b] hover:bg-[#b08b35] text-black border border-[#b89139] text-[0.65rem] sm:text-xs font-extrabold uppercase tracking-[0.15em] transition-all duration-300 active:scale-95 shadow-sm hover:shadow-md cursor-pointer"
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        <i className={isBuying ? "ri-loader-4-line animate-spin text-sm" : "ri-flashlight-line text-sm"} />
                        <span>{isBuying ? "..." : "Buy Now"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard3D;
