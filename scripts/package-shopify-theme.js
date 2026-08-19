import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import JSZip from 'jszip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const distAssetsDir = path.join(rootDir, 'dist', 'assets');
const themeDir = path.join(rootDir, 'shopify-theme');

// Clean & rebuild directories
if (fs.existsSync(themeDir)) {
    fs.rmSync(themeDir, { recursive: true, force: true });
}

const mediaDir = path.join(rootDir, 'shopify-media-files');
if (fs.existsSync(mediaDir)) {
    fs.rmSync(mediaDir, { recursive: true, force: true });
}

const dirs = [
    themeDir,
    path.join(themeDir, 'assets'),
    path.join(themeDir, 'config'),
    path.join(themeDir, 'layout'),
    path.join(themeDir, 'locales'),
    path.join(themeDir, 'templates'),
    path.join(themeDir, 'sections'),
    path.join(themeDir, 'snippets'),
    mediaDir,
];

dirs.forEach(dir => fs.mkdirSync(dir, { recursive: true }));

console.log('Classifying built assets and building robust Shopify Theme...');

let mainJs = 's1ck-app.js';
let mainCss = 's1ck-app.css';

const distDir = path.join(rootDir, 'dist');
const themeAssetsDir = path.join(themeDir, 'assets');

const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg']);
const videoExtensions = new Set(['.mp4', '.webm', '.mov']);

// Max file size for theme zip assets (5 MB)
const MAX_THEME_ASSET_SIZE_BYTES = 5 * 1024 * 1024;

const copyAssetFile = (srcPath, file) => {
    const stat = fs.statSync(srcPath);
    const ext = path.extname(file).toLowerCase();
    const cleanName = file.match(/^(.+)-[A-Za-z0-9_-]{8}\.([a-z0-9]+)$/i) 
        ? file.replace(/^(.+)-[A-Za-z0-9_-]{8}\.([a-z0-9]+)$/i, "$1.$2")
        : file;

    const isCodeOrFont = file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.woff') || file.endsWith('.woff2') || file.endsWith('.ttf') || file.endsWith('.otf') || file.endsWith('.eot');

    // Copy code, fonts, AND images under 5 MB into theme/assets/
    if (isCodeOrFont || (imageExtensions.has(ext) && stat.size <= MAX_THEME_ASSET_SIZE_BYTES)) {
        fs.copyFileSync(srcPath, path.join(themeAssetsDir, cleanName));
    }

    // Save all media to shopify-media-files directory for reference
    if (videoExtensions.has(ext) || imageExtensions.has(ext)) {
        fs.copyFileSync(srcPath, path.join(mediaDir, cleanName));
    }
};

// 1. Process files from dist/assets/
if (fs.existsSync(distAssetsDir)) {
    fs.readdirSync(distAssetsDir).forEach(file => {
        const srcPath = path.join(distAssetsDir, file);
        if (fs.statSync(srcPath).isFile()) {
            if (file.endsWith('.js') && file.includes('s1ck-app')) {
                mainJs = file;
            } else if (file.endsWith('.css') && file.includes('s1ck-app')) {
                mainCss = file;
            }
            copyAssetFile(srcPath, file);
        }
    });
}

// 2. Process public files directly under dist/ (e.g. videos)
if (fs.existsSync(distDir)) {
    fs.readdirSync(distDir).forEach(file => {
        const srcPath = path.join(distDir, file);
        if (fs.statSync(srcPath).isFile() && file !== 'index.html') {
            copyAssetFile(srcPath, file);
        }
    });
}

console.log(`Main JS: ${mainJs}`);
console.log(`Main CSS: ${mainCss}`);

// 3. theme.liquid
const themeLiquid = `<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="icon" type="image/png" sizes="64x64" href="{{ 'favicon.png' | asset_url }}">
  <link rel="apple-touch-icon" href="{{ 'favicon.png' | asset_url }}">
  <title>{{ page_title }}{% if current_tags %} &ndash; tagged "{{ current_tags | join: ', ' }}"{% endif %}{% if current_page != 1 %} &ndash; Page {{ current_page }}{% endif %}{% unless page_title contains shop.name %} &ndash; {{ shop.name }}{% endunless %}</title>
  
  {% comment %} Dynamic Shopify CDN Base & Liquid Video Mappings {% endcomment %}
  <script>
    (function() {
      try {
        var assetUrl = "{{ '${mainCss}' | asset_url }}";
        var assetBaseUrl = assetUrl.split('${mainCss}')[0];
        if (!assetBaseUrl || !assetBaseUrl.endsWith('/')) {
          assetBaseUrl = assetUrl.substring(0, assetUrl.lastIndexOf('/') + 1);
        }
        window.__SHOPIFY_ASSET_BASE_URL__ = assetBaseUrl;

        var fileBaseUrl = assetBaseUrl;
        if (assetBaseUrl.indexOf('/assets/') !== -1) {
          fileBaseUrl = assetBaseUrl.replace('/assets/', '/files/').replace(/\\/t\\/[^\\/]+\\/files\\//, '/files/');
        } else if (assetBaseUrl.indexOf('/s/files/') !== -1) {
          var filesIdx = assetBaseUrl.indexOf('/s/files/');
          var sub = assetBaseUrl.substring(filesIdx + 9);
          var subParts = sub.split('/');
          if (subParts.length >= 2) {
            fileBaseUrl = assetBaseUrl.substring(0, filesIdx + 9) + subParts[0] + '/' + subParts[1] + '/files/';
          }
        }
        window.__SHOPIFY_FILE_BASE_URL__ = fileBaseUrl;

        {% if settings.custom_media_base_url != blank %}
          window.__SHOPIFY_MEDIA_BASE_URL__ = "{{ settings.custom_media_base_url | escape }}";
        {% endif %}

        // Explicit Liquid mappings generated natively by Shopify for every uploaded video
        window.__SHOPIFY_VIDEOS__ = {
          "hero-bg-3.mp4": "{{ 'hero-bg-3.mp4' | file_url }}",
          "hero-mobile.mp4": "{{ 'hero-mobile.mp4' | file_url }}",
          "bestseller-web.webm": "{{ 'bestseller-web.webm' | file_url }}",
          "bestseller-mobile.webm": "{{ 'bestseller-mobile.webm' | file_url }}",
          "video-1.mp4": "{{ 'video-1.mp4' | file_url }}",
          "video-2.mp4": "{{ 'video-2.mp4' | file_url }}",
          "video-3.mp4": "{{ 'video-3.mp4' | file_url }}",
          "f1.mp4": "{{ 'f1.mp4' | file_url }}",
          "f2.mp4": "{{ 'f2.mp4' | file_url }}",
          "f3.mp4": "{{ 'f3.mp4' | file_url }}",
          "f5.mp4": "{{ 'f5.mp4' | file_url }}",
          "f6.mp4": "{{ 'f6.mp4' | file_url }}",
          "f7.mp4": "{{ 'f7.mp4' | file_url }}"
        };

        console.log('[S1CK Theme] Asset Base URL:', window.__SHOPIFY_ASSET_BASE_URL__);
        console.log('[S1CK Theme] Files Base URL:', window.__SHOPIFY_FILE_BASE_URL__);
        console.log('[S1CK Theme] Liquid Videos:', window.__SHOPIFY_VIDEOS__);
      } catch (err) {
        console.error('[S1CK Theme] Error computing CDN base URLs:', err);
      }
    })();
  </script>

  {% if page_description %}
    <meta name="description" content="{{ page_description | escape }}">
  {% endif %}
  <link rel="canonical" href="{{ canonical_url }}">
  {{ content_for_header }}
  
  {% comment %} S1CK Custom Theme Styles {% endcomment %}
  {{ '${mainCss}' | asset_url | stylesheet_tag }}
</head>
<body class="bg-black text-white">
  {{ content_for_layout }}

  {% comment %} S1CK Custom Theme Script {% endcomment %}
  {{ '${mainJs}' | asset_url | script_tag }}
</body>
</html>
`;

fs.writeFileSync(path.join(themeDir, 'layout', 'theme.liquid'), themeLiquid);

// 4. Sections
const mainAppSection = `<div id="root"></div>

{% schema %}
{
  "name": "S1CK React App",
  "settings": []
}
{% endschema %}
`;
fs.writeFileSync(path.join(themeDir, 'sections', 'main-app.liquid'), mainAppSection);

// 5. Snippets
fs.writeFileSync(path.join(themeDir, 'snippets', 's1ck-head.liquid'), '{% comment %} S1CK Snippet {% endcomment %}');

// 6. Templates
const jsonTemplate = JSON.stringify({
    sections: {
        main: {
            type: "main-app"
        }
    },
    order: ["main"]
}, null, 2);

['index.json', 'product.json', 'collection.json', 'list-collections.json', 'page.json', 'cart.json', 'search.json', '404.json'].forEach(tpl => {
    fs.writeFileSync(path.join(themeDir, 'templates', tpl), jsonTemplate);
});

// 7. Settings schema & data
const settingsSchema = [
    {
        "name": "theme_info",
        "theme_name": "S1CK Luxury Theme",
        "theme_author": "S1CK",
        "theme_version": "1.0.0",
        "theme_documentation_url": "https://s1ckshop.com",
        "theme_support_url": "https://s1ckshop.com"
    },
    {
        "name": "General Settings",
        "settings": [
            {
                "type": "text",
                "id": "store_name",
                "label": "Store Name",
                "default": "S1CK Shop"
            },
            {
                "type": "text",
                "id": "custom_media_base_url",
                "label": "Custom Media Base URL (Optional)",
                "info": "If media files are uploaded to Shopify Files or an external CDN, paste the URL prefix here (e.g. https://cdn.shopify.com/s/files/1/xxxx/files/)."
            }
        ]
    }
];

fs.writeFileSync(path.join(themeDir, 'config', 'settings_schema.json'), JSON.stringify(settingsSchema, null, 2));

const settingsData = {
    "current": {
        "sections": {
            "main": {
                "type": "main-app"
            }
        }
    }
};

fs.writeFileSync(path.join(themeDir, 'config', 'settings_data.json'), JSON.stringify(settingsData, null, 2));

// 8. Locales
const localesEn = {
    "general": {
        "meta": {
            "tags": "Tags",
            "page": "Page"
        }
    }
};

fs.writeFileSync(path.join(themeDir, 'locales', 'en.default.json'), JSON.stringify(localesEn, null, 2));

console.log(`✅ Uncompressed Shopify theme folder: ${themeDir}`);

function addFolderToZip(dirPath, zipFolder) {
    const items = fs.readdirSync(dirPath);
    items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);
        if (stat.isDirectory()) {
            const newZipFolder = zipFolder.folder(item);
            addFolderToZip(itemPath, newZipFolder);
        } else {
            const data = fs.readFileSync(itemPath);
            zipFolder.file(item, data);
        }
    });
}

// Generate s1ck-shopify-theme.zip
const themeZip = new JSZip();
addFolderToZip(themeDir, themeZip);

const themeZipPath = path.join(rootDir, 's1ck-shopify-theme.zip');
themeZip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 6 } })
    .then(content => {
        fs.writeFileSync(themeZipPath, content);
        const sizeMb = (fs.statSync(themeZipPath).size / (1024 * 1024)).toFixed(2);
        console.log(`✅ Successfully generated Theme ZIP (${sizeMb} MB) at: ${themeZipPath}`);
    })
    .catch(err => {
        console.error('JSZip error packaging theme:', err);
    });

// Generate s1ck-media-files.zip
const mediaZip = new JSZip();
addFolderToZip(mediaDir, mediaZip);

const mediaZipPath = path.join(rootDir, 's1ck-media-files.zip');
mediaZip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 6 } })
    .then(content => {
        fs.writeFileSync(mediaZipPath, content);
        const sizeMb = (fs.statSync(mediaZipPath).size / (1024 * 1024)).toFixed(2);
        console.log(`✅ Successfully generated Media ZIP (${sizeMb} MB) at: ${mediaZipPath}`);
    })
    .catch(err => {
        console.error('JSZip error packaging media:', err);
    });
