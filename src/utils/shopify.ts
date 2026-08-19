import { flavorlists } from "../constants/details";
import { getImage } from "./media";

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || "";
const SHOPIFY_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";

/**
 * Get product URL: returns /products/:handle when running on Shopify live theme, or /product/:handle locally
 */
export function getProductUrl(handleOrName: string): string {
    if (!handleOrName) return "/collections/all";
    const handle = handleOrName
        .toLowerCase()
        .replace(/[èéêë]/g, "e")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    if (typeof window !== 'undefined' && ((window as any).__SHOPIFY_ASSET_BASE_URL__ || (window as any).__SHOPIFY_FILE_BASE_URL__)) {
        return `/products/${handle}`;
    }

    return `/product/${handle}`;
}

export async function shopifyQuery(query: string, variables = {}) {
    if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
        console.error("Shopify domain or token is missing from environment variables.");
        return null;
    }

    try {
        const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-04/graphql.json`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
            },
            body: JSON.stringify({ query, variables }),
        });

        if (!response.ok) {
            throw new Error(`Shopify API responded with status ${response.status}`);
        }

        const { data, errors } = await response.json();
        if (errors) {
            throw new Error(errors.map((e: any) => e.message).join(", "));
        }
        return data;
    } catch (error) {
        console.error("Shopify query failed:", error);
        return null;
    }
}

export async function getProducts() {
    const query = `
      query getProducts {
        products(first: 50) {
          nodes {
            id
            title
            handle
            description
            images(first: 1) {
              nodes {
                url
                altText
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            metafields(identifiers: [
              {namespace: "reviews", key: "rating"},
              {namespace: "reviews", key: "rating_count"},
              {namespace: "reviews", key: "list"},
              {namespace: "custom", key: "reviews"},
              {namespace: "custom", key: "units_sold"}
            ]) {
              namespace
              key
              value
              type
            }
          }
        }
      }
    `;
    const data = await shopifyQuery(query);
    return data?.products?.nodes || [];
}

export async function getProductByHandle(handle: string) {
    const query = `
      query getProduct($handle: String!) {
        product(handle: $handle) {
          id
          title
          handle
          description
          images(first: 5) {
            nodes {
              url
              altText
            }
          }
          variants(first: 5) {
            nodes {
              id
              title
              price {
                amount
                currencyCode
              }
              availableForSale
            }
          }
          metafields(identifiers: [
            {namespace: "reviews", key: "rating"},
            {namespace: "reviews", key: "rating_count"},
            {namespace: "reviews", key: "list"},
            {namespace: "custom", key: "reviews"}
          ]) {
            namespace
            key
            value
            type
          }
        }
      }
    `;
    const data = await shopifyQuery(query, { handle });
    if (data?.product) {
        return data.product;
    }

    // Attempt matching handle from all Shopify products list if handle is truncated (e.g. 'arcane' vs 'arcane-pheromone-cologne-for-men')
    const normalizedHandle = handle.toLowerCase();
    const allShopifyProducts = await getProducts();
    const matchedShopify = allShopifyProducts.find((p: any) => {
        const h = (p.handle || "").toLowerCase();
        return h === normalizedHandle || h.includes(normalizedHandle) || normalizedHandle.includes(h);
    });

    if (matchedShopify) {
        // Fetch full product by matched handle
        if (matchedShopify.handle !== handle) {
            const matchedData = await shopifyQuery(query, { handle: matchedShopify.handle });
            if (matchedData?.product) return matchedData.product;
        }
        return matchedShopify;
    }

    // Local fallback for static/offline data or unlinked handles
    const localProduct = flavorlists.find((f) => {
        const norm = f.name
            .toLowerCase()
            .replace(/[èéêë]/g, "e")
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-");
        return norm === normalizedHandle || normalizedHandle.includes(norm) || norm.includes(normalizedHandle);
    });

    if (localProduct) {
        const isArcane = localProduct.name.toLowerCase() === "arcane";
        const displayTitle = isArcane ? "ARCANE — Pheromone Eau de Parfum" : localProduct.name;
        const mainImg = localProduct.drinkImage ? getImage(localProduct.drinkImage) : "";
        const elementsImg = localProduct.elementsImage ? getImage(localProduct.elementsImage) : "";
        const bgImg = localProduct.bgImage ? getImage(localProduct.bgImage) : "";

        return {
            id: `local-${localProduct.name.toLowerCase()}`,
            title: displayTitle,
            handle: handle,
            description: localProduct.description,
            tagline: localProduct.tagline,
            topNotes: localProduct.topNotes,
            midNotes: localProduct.midNotes,
            baseNotes: localProduct.baseNotes,
            tone: localProduct.tone,
            accentColor: localProduct.accentColor,
            accentGlow: localProduct.accentGlow,
            images: {
                nodes: [
                    ...(mainImg ? [{ url: mainImg, altText: displayTitle }] : []),
                    ...(elementsImg ? [{ url: elementsImg, altText: `${displayTitle} Notes` }] : []),
                    ...(bgImg ? [{ url: bgImg, altText: `${displayTitle} Mood` }] : []),
                ]
            },
            variants: {
                nodes: [
                    {
                        id: `var-${localProduct.name.toLowerCase()}-60ml`,
                        title: "60ml — Full Bottle",
                        price: { amount: "100.00", currencyCode: "USD" },
                        availableForSale: true
                    },
                    {
                        id: `var-${localProduct.name.toLowerCase()}-10ml`,
                        title: "10ml — Trial Size (310+ sprays)",
                        price: { amount: "35.00", currencyCode: "USD" },
                        availableForSale: true
                    }
                ]
            }
        };
    }

    return null;
}
export async function getProductsByCollection(handle: string) {
    const query = `
      query getCollectionProducts($handle: String!) {
        collection(handle: $handle) {
          products(first: 20) {
            nodes {
              id
              title
              handle
              description
              images(first: 1) {
                nodes {
                  url
                  altText
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `;
    const data = await shopifyQuery(query, { handle });
    return data?.collection?.products?.nodes || [];
}

export async function createShopifyCheckout(lines: { variantId: string; quantity: number }[]) {
    const query = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
        input: {
            lines: lines.map(line => ({
                merchandiseId: line.variantId,
                quantity: line.quantity
            }))
        }
    };
    const data = await shopifyQuery(query, variables);
    return data?.cartCreate?.cart?.checkoutUrl || null;
}

export function getMergedProduct(shopifyProduct: any) {
    if (!shopifyProduct) return null;

    const handle = (shopifyProduct.handle || "").toLowerCase();

    const localProduct = handle ? flavorlists.find((f) => {
        const normalizedLocal = f.name
            .toLowerCase()
            .replace(/[èéêë]/g, "e")
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-");
        return (
            normalizedLocal === handle ||
            handle.includes(normalizedLocal) ||
            normalizedLocal.includes(handle)
        );
    }) : undefined;

    const displayImage = localProduct?.drinkImage
        ? getImage(localProduct.drinkImage)
        : (shopifyProduct.images?.nodes?.[0]?.url || "");

    return {
        ...localProduct,
        ...shopifyProduct,
        localDetails: localProduct || null,
        displayImage,
    };
}
