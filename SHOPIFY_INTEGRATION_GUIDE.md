# Shopify Headless Integration Guide

This guide explains how to integrate your custom website with Shopify so that adding a product in Shopify automatically updates your site.

## 1. Get the Shopify Storefront Access Token

To connect your website to Shopify, you need to create a **Custom App** in Shopify.

1. **Log in** to your Shopify Admin Panel.
2. In the bottom left corner, click on **Settings**, then go to **Apps and sales channels**.
3. Click on **Develop apps** (If prompted, click "Allow custom app development").
4. Click the **Create an app** button.
   - **App name:** Give it a name like "S1ck Website Integration".
   - **App developer:** Select your email.
   - Click **Create app**.
5. Go to the **Configuration** tab.
6. Under **Storefront API integration**, click the **Configure** button.
7. **Select Scopes:** Check the boxes for the permissions your website needs. At a minimum, you must check:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_tags`
   - `unauthenticated_read_product_inventory`
   - *(If you plan to implement Shopify checkout later, also check `unauthenticated_write_checkouts` and `unauthenticated_read_checkouts`)*.
8. Click **Save** in the top right corner.
9. Go to the **API Credentials** tab and click **Install app** in the top right corner. Confirm the installation.
10. Once installed, scroll down to the **Storefront API access token** section. Reveal and copy this token.

### Environment Variables

Add your copied token and your store domain to your `.env` file at the root of your project:

```env
VITE_SHOPIFY_STORE_DOMAIN=your-store-name.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=the_token_you_just_copied
```

---

## 2. Setting Up Products in Shopify

For our current integration to work beautifully (mapping your premium UI images and scent notes to the Shopify products), you must follow these rules when adding products in Shopify:

### The Golden Rule: The Product Handle

When you create a product in Shopify, Shopify automatically generates a **URL Handle** based on the title (e.g., if you name it "Le Toxiquè", the handle becomes `le-toxique`).

**This handle MUST match the products defined in your local website code (`src/constants/details.ts`).** 

Our code looks at the Shopify handle, and if it finds a match in your local `flavorlists` data, it attaches your beautiful high-res images, taglines, and fragrance notes to that product. 

For example, if you want the "Le Toxiquè" aesthetic to apply to a Shopify product:
1. Create the product in Shopify.
2. Scroll to the bottom of the product page to **Search engine listing**.
3. Click **Edit**.
4. Check the **URL handle**. It should be `le-toxique`. (If it's `le-toxique-perfume`, change it to just `le-toxique` to match your frontend code).

### Publishing the Product

Whenever you add a new product in Shopify, make sure it is available to your Custom App:
1. On the product page in Shopify, look at the right sidebar under **Publishing** or **Sales channels and apps**.
2. Make sure your custom app (e.g., "S1ck Website Integration") is checked. If it's not checked, the website won't be able to fetch the product.

### Pricing and Inventory

- Ensure you set a **Price** in Shopify.
- Make sure to track inventory and ensure the item is **In Stock** (or allow it to be sold when out of stock); otherwise, it won't be purchasable.

Once your `.env` keys are in place and you create a product in Shopify with a matching handle, it will instantly and automatically appear on your website with the correct price, and the "Add to Bag" button will work!
