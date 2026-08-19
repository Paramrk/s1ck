import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductByHandle, getMergedProduct } from "../utils/shopify";
import Navbar from "../components/Navbar";
import FooterSection from "../sections/FooterSection";
import LiquidSilverSection from "../sections/LiquidSilverSection";

const ProductDetailPage = () => {
    const { handle } = useParams<{ handle: string }>();
    const [product, setProduct] = useState<any>(null);
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

    if (loading) {
        return (
            <main className="bg-[#0a0a0a] min-h-screen flex items-center justify-center text-white">
                <Navbar />
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-2 border-[#8B7AE8] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-stone-400 uppercase tracking-[0.3em] text-xs animate-pulse">Extracting Scent Notes...</p>
                </div>
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="bg-[#0a0a0a] min-h-screen flex flex-col items-center justify-center gap-6 text-white">
                <Navbar />
                <div className="text-center px-4 max-w-md">
                    <h2 className="text-white text-2xl uppercase tracking-wider font-bold mb-4 font-serif">
                        {error || "Product Not Found"}
                    </h2>
                    <p className="text-stone-400 text-xs tracking-wider mb-8">The scent you are looking for does not exist or has been removed.</p>
                    <Link to="/shop/men" className="sick-btn">
                        Explore Collections
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main ref={containerRef} className="bg-[#0a0a0a] min-h-screen flex flex-col justify-between">
            <Navbar />
            <div className="pt-20">
                <LiquidSilverSection shopifyProduct={product} />
            </div>
            <FooterSection />
        </main>
    );
};

export default ProductDetailPage;
