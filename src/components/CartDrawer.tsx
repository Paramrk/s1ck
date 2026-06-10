import React, { useEffect, useState, useRef } from "react";
import { cartStore } from "../utils/cartStore";
import type { CartItem } from "../utils/cartStore";
import { createShopifyCheckout } from "../utils/shopify";
import gsap from "gsap";
import preImg from "../assets/s1cklogo-trnsp.webp";


interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const drawerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    // Sync state with localstorage store
    useEffect(() => {
        setCartItems(cartStore.getCart());

        const handleUpdate = () => {
            setCartItems(cartStore.getCart());
        };

        const unsubscribe = cartStore.subscribe(handleUpdate);
        window.addEventListener("cart-updated", handleUpdate);

        return () => {
            unsubscribe();
            window.removeEventListener("cart-updated", handleUpdate);
        };
    }, []);

    // GSAP Slide animation
    useEffect(() => {
        if (isOpen) {
            // Prevent body scroll
            document.body.style.overflow = "hidden";
            
            gsap.to(overlayRef.current, {
                opacity: 1,
                duration: 0.4,
                ease: "power2.out",
                pointerEvents: "auto",
            });
            gsap.to(drawerRef.current, {
                x: 0,
                duration: 0.5,
                ease: "power3.out",
            });
        } else {
            // Restore body scroll
            document.body.style.overflow = "";

            gsap.to(overlayRef.current, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.in",
                pointerEvents: "none",
            });
            gsap.to(drawerRef.current, {
                x: "100%",
                duration: 0.4,
                ease: "power3.in",
            });
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;
        setIsCheckingOut(true);

        try {
            const lines = cartItems.map((item) => ({
                variantId: item.id,
                quantity: item.quantity,
            }));

            const checkoutUrl = await createShopifyCheckout(lines);
            if (checkoutUrl) {
                // Clear cart locally upon redirecting
                cartStore.clearCart();
                window.location.href = checkoutUrl;
            } else {
                alert("Failed to create checkout. Please try again.");
                setIsCheckingOut(false);
            }
        } catch (error) {
            console.error("Checkout redirection failed:", error);
            alert("An error occurred during checkout redirect.");
            setIsCheckingOut(false);
        }
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0
    );

    return (
        <>
            {/* Overlay */}
            <div
                ref={overlayRef}
                className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[2000] opacity-0 pointer-events-none transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Drawer Container */}
            <div
                ref={drawerRef}
                className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-cream border-l border-ivory z-[2001] translate-x-full shadow-2xl flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-ivory flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="block w-6 h-px bg-sick-red" />
                        <h2 className="text-charcoal uppercase tracking-[0.2em] text-sm font-bold">
                            Your Bag ({cartItems.reduce((acc, curr) => acc + curr.quantity, 0)})
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-stone hover:text-charcoal transition-colors cursor-pointer text-xl flex items-center justify-center p-1"
                    >
                        <i className="ri-close-line" />
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <i className="ri-shopping-bag-line text-stone/20 text-5xl mb-4" />
                            <p className="text-stone text-xs uppercase tracking-[0.2em] font-light">
                                Your bag is currently empty
                            </p>
                            <button
                                onClick={onClose}
                                className="sick-btn mt-6 py-2.5 px-6 text-[0.6rem]"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4 border-b border-parchment pb-6 last:border-0 last:pb-0">
                                {/* Thumbnail */}
                                <div className="w-20 aspect-[4/5] bg-parchment border border-ivory overflow-hidden flex-shrink-0">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[0.6rem] text-stone/30">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col justify-between min-w-0">
                                    <div>
                                        <h4 className="text-charcoal uppercase text-xs tracking-wider font-semibold truncate">
                                            {item.title}
                                        </h4>
                                        <p className="text-stone text-[0.65rem] tracking-wide mt-1 uppercase">
                                            {item.variantTitle}
                                        </p>
                                    </div>

                                    {/* Action row: quantity and remove */}
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center border border-ivory">
                                            <button
                                                onClick={() => cartStore.updateQuantity(item.id, item.quantity - 1)}
                                                className="px-2.5 py-1 text-stone hover:text-charcoal transition-colors text-xs"
                                            >
                                                -
                                            </button>
                                            <span className="px-2 text-charcoal text-xs font-medium min-w-[1.5rem] text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => cartStore.updateQuantity(item.id, item.quantity + 1)}
                                                className="px-2.5 py-1 text-stone hover:text-charcoal transition-colors text-xs"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => cartStore.removeItem(item.id)}
                                            className="text-[0.65rem] text-stone/60 hover:text-sick-red uppercase tracking-wider transition-colors cursor-pointer"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="text-right flex-shrink-0">
                                    <p className="text-charcoal text-xs font-semibold">
                                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                    </p>
                                    <p className="text-stone text-[0.6rem] uppercase tracking-widest mt-0.5">
                                        {item.currencyCode}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Summary */}
                {cartItems.length > 0 && (
                    <div className="p-6 border-t border-ivory bg-parchment">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-stone text-xs uppercase tracking-wider">Subtotal</span>
                            <div className="text-right">
                                <span className="text-charcoal text-base font-bold">
                                    ${subtotal.toFixed(2)}
                                </span>
                                <span className="text-stone text-[0.65rem] uppercase tracking-wider ml-1">
                                    {cartItems[0]?.currencyCode || "USD"}
                                </span>
                            </div>
                        </div>
                        <p className="text-stone/60 text-[0.6rem] uppercase tracking-wider mb-6 leading-relaxed">
                            Shipping and taxes calculated at checkout.
                        </p>
                        <button
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                            className="sick-btn-filled w-full py-4 text-center tracking-[0.25em] flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isCheckingOut ? (
                                <>
                                    <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-cream" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                "Checkout"
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Redirecting Overlay */}
            {isCheckingOut && (
                <div className="fixed inset-0 z-[9999] bg-charcoal flex flex-col items-center justify-center text-cream">
                    <div className="flex flex-col items-center max-w-md px-6 text-center space-y-8">
                        {/* Glowing Logo Container */}
                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-sick-red/25 blur-3xl rounded-full scale-150 animate-pulse" />
                            <img
                                src={preImg}
                                alt="S1CK"
                                className="relative w-32 md:w-40 filter brightness-0 invert"
                            />
                        </div>

                        {/* Title & Status */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-sick-red animate-ping" />
                                <span className="text-[0.65rem] tracking-[0.3em] text-sick-red font-bold uppercase">
                                    Secure Connection
                                </span>
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold tracking-[0.1em] uppercase">
                                Redirecting to Checkout
                            </h2>
                            <p className="text-stone text-[0.7rem] uppercase tracking-widest max-w-[280px] mx-auto leading-relaxed opacity-80">
                                Please do not close this tab or refresh the page.
                            </p>
                        </div>

                        {/* Custom loading bar */}
                        <div className="w-48 h-[2px] bg-stone/20 overflow-hidden relative rounded-full">
                            <div className="h-full bg-sick-red w-full absolute left-0 top-0 origin-left animate-[loading-bar_1.5s_infinite_ease-in-out]" />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CartDrawer;
