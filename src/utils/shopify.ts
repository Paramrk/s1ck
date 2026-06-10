import { flavorlists } from "../constants/details";
import { getImage } from "./media";

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || "";
const SHOPIFY_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";

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
        }
      }
    `;
    const data = await shopifyQuery(query, { handle });
    return data?.product || null;
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

    const localProduct = flavorlists.find((f) => {
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
    });

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
