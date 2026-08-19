// src/utils/media.ts

// Glob import all images and videos recursively across assets for local dev
const allAssets: Record<string, { default: string }> = import.meta.glob(
    [
        "../assets/**/*.{webp,svg,png,jpg,jpeg,gif,webm,mp4,mov}",
        "!../assets/bestseller-frames/**",
        "!../assets/bestseller-sprites/**",
        // Scent-composition artwork is imported directly. Excluding the
        // entire source folder prevents unused multi-megabyte PNGs from being
        // bundled into every Shopify theme build.
        "!../assets/fruits/**",
        "!../assets/images/powered-by-pheromone-image-*.png",
    ],
    { eager: true }
);

const isShopify = (): boolean => {
    if (typeof window === 'undefined') return false;
    const w = window as any;
    return !!(w.__SHOPIFY_MEDIA_BASE_URL__ || w.__SHOPIFY_FILE_BASE_URL__ || w.__SHOPIFY_ASSET_BASE_URL__ || w.__SHOPIFY_VIDEOS__);
};

const getAssetBaseUrl = (): string => {
    if (typeof window === 'undefined') return "";
    const w = window as any;
    return w.__SHOPIFY_ASSET_BASE_URL__ || w.__SHOPIFY_FILE_BASE_URL__ || "";
};

const getFileBaseUrl = (): string => {
    if (typeof window === 'undefined') return "";
    const w = window as any;
    return w.__SHOPIFY_MEDIA_BASE_URL__ || w.__SHOPIFY_FILE_BASE_URL__ || w.__SHOPIFY_ASSET_BASE_URL__ || "";
};

export const resolveShopifyAssetUrl = (rawPath: string): string => {
    if (!rawPath) return "";
    if (rawPath.startsWith('http') || rawPath.startsWith('//')) return rawPath;
    
    const base = getAssetBaseUrl();
    if (base) {
        let fileName = rawPath.split("/").pop()?.split("?")[0] || "";
        if (/^(.+)-[A-Za-z0-9_-]{8}\.([a-z0-9]+)$/i.test(fileName)) {
            fileName = fileName.replace(/^(.+)-[A-Za-z0-9_-]{8}\.([a-z0-9]+)$/i, "$1.$2");
        }
        if (fileName) {
            const cleanBase = base.endsWith('/') ? base : `${base}/`;
            return `${cleanBase}${fileName}`;
        }
    }
    return rawPath;
};

export const getImage = (fileName: string): string => {
    if (!fileName) return "";
    const cleanName = fileName.trim().toLowerCase();
    const baseNameWithoutExt = cleanName.replace(/\.[^/.]+$/, "");
    const underscoreName = cleanName.replace(/-/g, "_");
    const underscoreWithoutExt = baseNameWithoutExt.replace(/-/g, "_");
    
    if (typeof window !== 'undefined') {
        const w = window as any;

        // 1. Direct custom override from Shopify theme settings
        if (w.__SHOPIFY_IMAGES__) {
            const candidates = [
                cleanName,
                baseNameWithoutExt,
                underscoreName,
                underscoreWithoutExt,
                `shop_img_${baseNameWithoutExt}`,
                `menu_img_${baseNameWithoutExt}`
            ];

            for (const key of candidates) {
                const override = w.__SHOPIFY_IMAGES__[key];
                if (override && typeof override === 'string' && override.length > 5 && !override.includes('no-image') && !override.includes('undefined')) {
                    return override.startsWith('//') ? 'https:' + override : override;
                }
            }
        }

        // 2. Direct fallback to Shopify asset CDN
        if (isShopify()) {
            const base = getAssetBaseUrl();
            if (base) {
                const cleanBase = base.endsWith('/') ? base : `${base}/`;
                return `${cleanBase}${fileName}`;
            }
        }
    }

    // 3. Local asset import fallback
    for (const path in allAssets) {
        const lowerPath = path.toLowerCase();
        if (lowerPath.endsWith(`/${cleanName}`) || lowerPath.endsWith(`/${baseNameWithoutExt}.webp`) || lowerPath.endsWith(`/${baseNameWithoutExt}.png`)) {
            return allAssets[path]?.default || fileName;
        }
    }
    
    return fileName;
};

/**
 * Find video URL by filename (e.g. 'hero-bg-3.mp4', 'bestseller-web.webm')
 */
export const getVideo = (fileName: string): string => {
    if (!fileName) return "";
    const cleanName = fileName.trim().toLowerCase();
    
    if (typeof window !== 'undefined') {
        const w = window as any;

        // 1. Direct custom override from theme settings
        if (w.__SHOPIFY_MEDIA_BASE_URL__) {
            const base = w.__SHOPIFY_MEDIA_BASE_URL__.endsWith('/') ? w.__SHOPIFY_MEDIA_BASE_URL__ : `${w.__SHOPIFY_MEDIA_BASE_URL__}/`;
            return `${base}${fileName}`;
        }

        // 2. Direct Liquid file_url mapping generated natively by Shopify for this specific video
        if (w.__SHOPIFY_VIDEOS__ && w.__SHOPIFY_VIDEOS__[cleanName]) {
            let rawUrl = w.__SHOPIFY_VIDEOS__[cleanName];
            if (rawUrl && typeof rawUrl === 'string' && rawUrl.length > 5 && !rawUrl.includes('no-image') && !rawUrl.includes('undefined')) {
                if (rawUrl.startsWith('//')) {
                    rawUrl = 'https:' + rawUrl;
                }
                return rawUrl;
            }
        }

        // 3. Fallback to computed Files CDN base URL
        const base = getFileBaseUrl();
        if (base) {
            const cleanBase = base.endsWith('/') ? base : `${base}/`;
            return `${cleanBase}${fileName}`;
        }
    }

    // Local dev: search through glob-imported assets
    for (const path in allAssets) {
        if (path.toLowerCase().endsWith(`/${cleanName}`)) {
            return allAssets[path]?.default || fileName;
        }
    }
    
    return fileName;
};
