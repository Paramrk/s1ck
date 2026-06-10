export interface CartItem {
    id: string; // variant GID (e.g. gid://shopify/ProductVariant/...)
    title: string; // product title
    variantTitle: string; // variant title
    price: string; // price amount e.g. "89.00"
    currencyCode: string; // e.g. "USD"
    image: string; // image URL
    handle: string; // product handle
    quantity: number;
}

let cartListeners: (() => void)[] = [];

export const cartStore = {
    getCart(): CartItem[] {
        try {
            const data = localStorage.getItem("s1ck_cart");
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    setCart(cart: CartItem[]) {
        localStorage.setItem("s1ck_cart", JSON.stringify(cart));
        cartListeners.forEach(listener => listener());
    },

    subscribe(listener: () => void) {
        cartListeners.push(listener);
        return () => {
            cartListeners = cartListeners.filter(l => l !== listener);
        };
    },

    addItem(item: Omit<CartItem, "quantity">, quantity = 1) {
        const cart = this.getCart();
        const existing = cart.find(i => i.id === item.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({ ...item, quantity });
        }
        this.setCart(cart);
        
        // Dispatch custom event to notify external listeners
        window.dispatchEvent(new CustomEvent("cart-updated"));
    },

    removeItem(id: string) {
        const cart = this.getCart();
        const filtered = cart.filter(i => i.id !== id);
        this.setCart(filtered);
        window.dispatchEvent(new CustomEvent("cart-updated"));
    },

    updateQuantity(id: string, quantity: number) {
        if (quantity <= 0) {
            this.removeItem(id);
            return;
        }
        const cart = this.getCart();
        const item = cart.find(i => i.id === id);
        if (item) {
            item.quantity = quantity;
            this.setCart(cart);
        }
        window.dispatchEvent(new CustomEvent("cart-updated"));
    },

    clearCart() {
        this.setCart([]);
        window.dispatchEvent(new CustomEvent("cart-updated"));
    }
};
