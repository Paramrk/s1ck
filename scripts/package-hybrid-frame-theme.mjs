import fs from "node:fs";
import path from "node:path";
import JSZip from "jszip";

const root = path.resolve(import.meta.dirname, "..");
const themeDirectory = path.join(root, "s1ck-hybrid-product-theme-work");
const distAssetsDirectory = path.join(root, "dist", "assets");
const outputPath = path.join(root, "s1ck-hybrid-original-product-theme.zip");
const zip = new JSZip();

const storefrontAssetExtensions = new Set([
    ".css", ".js", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg",
    ".woff", ".woff2", ".ttf", ".otf", ".eot",
]);
const packagedVideoAssets = new Set([
    "hero-bg-3.mp4",
]);
const maxThemeAssetBytes = 5 * 1024 * 1024;
const zipExcludedThemeAssets = new Set([
    // Modern Shopify-supported browsers use the bundled WOFF2/WOFF icon font.
    // Omitting legacy fallbacks keeps the compressed upload below 50 MB.
    "remixicon.eot",
    "remixicon.ttf",
    "remixicon.woff",
    "remixicon.svg",
    // These source PNGs are now represented by substantially smaller,
    // high-quality WebP assets. Exclude stale copies retained by the hybrid
    // working theme from earlier builds.
    "Perfume_bottle_on_white_background_202605271151.png",
    "Perfume_bottle_on_white_background_202605271154.png",
    "remove_the_water_splash_202605271151.png",
    "vanilla.png",
    "cinemonsticks.png",
    "berryred.png",
    "orange.png",
    "blueberry.png",
    "grapes.png",
    "apple.png",
    "starfruit.png",
    "peach.png",
    "cinemon.png",
    "oranageg.png",
    "pomogranade.png",
    // Unused fruit artwork was previously pulled in by a broad asset glob.
    "pineapple.png",
    "coconut.png",
    "cheerry.png",
    "berryblack.png",
    "lichi.png",
    "berryred2.png",
    "grapesred.png",
    "pineapple2.png",
]);

const themeAssetsDirectory = path.join(themeDirectory, "assets");
for (const entry of fs.readdirSync(distAssetsDirectory, { withFileTypes: true })) {
    if (!entry.isFile()) continue;

    const extension = path.extname(entry.name).toLowerCase();
    const sourcePath = path.join(distAssetsDirectory, entry.name);
    const size = fs.statSync(sourcePath).size;

    const isPackagedVideo = packagedVideoAssets.has(entry.name);
    if ((storefrontAssetExtensions.has(extension) || isPackagedVideo) && size <= maxThemeAssetBytes) {
        fs.copyFileSync(sourcePath, path.join(themeAssetsDirectory, entry.name));
    }
}

const faviconPath = path.join(root, "dist", "favicon.png");
if (fs.existsSync(faviconPath)) {
    fs.copyFileSync(faviconPath, path.join(themeAssetsDirectory, "favicon.png"));
}

for (const requiredProductFile of [
    "templates/product.json",
    "sections/main-product.liquid",
    "snippets/product-form.liquid",
]) {
    if (!fs.existsSync(path.join(themeDirectory, requiredProductFile))) {
        throw new Error(`Missing original-theme product file: ${requiredProductFile}`);
    }
}

const addDirectory = (directory, archivePath = "") => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const diskPath = path.join(directory, entry.name);
        const zipPath = archivePath ? `${archivePath}/${entry.name}` : entry.name;

        if (entry.isDirectory()) {
            addDirectory(diskPath, zipPath);
        } else if (entry.isFile()) {
            if (archivePath === "assets" && zipExcludedThemeAssets.has(entry.name)) {
                continue;
            }
            zip.file(zipPath, fs.readFileSync(diskPath));
        }
    }
};

addDirectory(themeDirectory);

const archive = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
});

fs.writeFileSync(outputPath, archive);
console.log(`${path.basename(outputPath)} (${(archive.length / 1024 / 1024).toFixed(2)} MB)`);
