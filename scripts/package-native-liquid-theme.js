import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import JSZip from 'jszip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const nativeThemeDir = path.join(rootDir, 'shopify-native-theme');

// Clean & rebuild directory
if (fs.existsSync(nativeThemeDir)) {
    fs.rmSync(nativeThemeDir, { recursive: true, force: true });
}

const dirs = [
    nativeThemeDir,
    path.join(nativeThemeDir, 'assets'),
    path.join(nativeThemeDir, 'config'),
    path.join(nativeThemeDir, 'layout'),
    path.join(nativeThemeDir, 'locales'),
    path.join(nativeThemeDir, 'sections'),
    path.join(nativeThemeDir, 'snippets'),
    path.join(nativeThemeDir, 'templates'),
];

dirs.forEach(dir => fs.mkdirSync(dir, { recursive: true }));

console.log('Generating native Shopify Liquid theme files...');

// 1. layout/theme.liquid
const themeLiquid = `<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{{ page_title }}{% if current_tags %} &ndash; tagged "{{ current_tags | join: ', ' }}"{% endif %}{% if current_page != 1 %} &ndash; Page {{ current_page }}{% endif %}{% unless page_title contains shop.name %} &ndash; {{ shop.name }}{% endunless %}</title>
  {% if page_description %}
    <meta name="description" content="{{ page_description | escape }}">
  {% endif %}
  <link rel="canonical" href="{{ canonical_url }}">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css">
  {{ content_for_header }}
  {{ 's1ck-theme.css' | asset_url | stylesheet_tag }}
</head>
<body class="bg-[#0a0a0a] text-white selection:bg-[#8B7AE8] selection:text-black">
  {% section 's1ck-header' %}
  
  <main role="main" id="MainContent">
    {{ content_for_layout }}
  </main>

  {% section 's1ck-footer' %}

  {{ 's1ck-theme.js' | asset_url | script_tag }}
</body>
</html>
`;
fs.writeFileSync(path.join(nativeThemeDir, 'layout', 'theme.liquid'), themeLiquid);

// 2. sections/s1ck-header.liquid
const headerLiquid = `<header class="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#22222a] py-4 px-6 md:px-12 flex items-center justify-between">
  <a href="/" class="text-xl md:text-2xl font-black uppercase tracking-[0.25em] text-white flex items-center gap-2">
    <span>S1CK</span>
    <span class="text-[#8B7AE8] text-xs px-2 py-0.5 border border-[#8B7AE8]/40 rounded-full font-sans font-semibold">PARFUM</span>
  </a>

  <nav class="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-semibold text-stone-300">
    <a href="/collections/all" class="hover:text-[#8B7AE8] transition-colors">All Fragrances</a>
    <a href="/collections/mens-fragrances" class="hover:text-[#8B7AE8] transition-colors">Men's</a>
    <a href="/collections/womens-fragrances" class="hover:text-[#8B7AE8] transition-colors">Women's</a>
    <a href="/pages/monthly-box" class="hover:text-[#8B7AE8] transition-colors">VIP Club</a>
  </nav>

  <div class="flex items-center gap-5">
    <a href="/cart" class="relative text-white hover:text-[#8B7AE8] transition-colors flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
      <i class="ri-shopping-bag-line text-lg"></i>
      <span>Cart ({{ cart.item_count }})</span>
    </a>
  </div>
</header>
`;
fs.writeFileSync(path.join(nativeThemeDir, 'sections', 's1ck-header.liquid'), headerLiquid);

// 3. sections/s1ck-product-detail.liquid (Native Arcane & Product Detail Page)
const productDetailLiquid = `{% assign selected_variant = product.selected_or_first_available_variant %}

<section class="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20">
  <nav class="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.25em] text-stone-400 mb-10 overflow-x-auto whitespace-nowrap">
    <a href="/" class="hover:text-white">Home</a> /
    <a href="/collections/all" class="hover:text-white">Fragrances</a> /
    <span class="text-[#8B7AE8] font-semibold">{{ product.title }}</span>
  </nav>

  <div class="flex flex-col lg:flex-row gap-12 lg:gap-16">
    <!-- Gallery -->
    <div className="flex-1 space-y-4">
      <div class="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#111115] border border-[#22222a] shadow-2xl">
        <div class="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-md border border-[#8B7AE8]/40 px-3.5 py-1.5 rounded-full flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-[#8B7AE8] animate-ping"></span>
          <span class="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#8B7AE8]">48MG Human-Grade Pheromones</span>
        </div>
        <img id="MainProductImage" src="{{ product.featured_image | image_url: width: 1000 }}" alt="{{ product.title }}" class="w-full h-full object-cover">
      </div>

      {% if product.images.size > 1 %}
        <div class="flex gap-4 overflow-x-auto pb-2">
          {% for image in product.images %}
            <button onclick="document.getElementById('MainProductImage').src='{{ image | image_url: width: 1000 }}'" class="w-20 aspect-[4/5] rounded-xl overflow-hidden bg-[#111115] border border-[#22222a]">
              <img src="{{ image | image_url: width: 200 }}" alt="" class="w-full h-full object-cover">
            </button>
          {% endfor %}
        </div>
      {% endif %}
    </div>

    <!-- Product Controls -->
    <div class="flex-1 space-y-6">
      <div class="flex items-center gap-3">
        <span class="w-6 h-px bg-[#8B7AE8]"></span>
        <span class="text-[#8B7AE8] text-[0.65rem] uppercase tracking-[0.3em] font-extrabold">Dark. Luxurious. Addictive.</span>
      </div>

      <h1 class="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight">{{ product.title }}</h1>

      <div class="flex items-center gap-3 text-xs">
        <div class="text-[#FFD700]">★★★★★</div>
        <span class="text-white font-bold">5.0</span> |
        <span class="text-stone-300 uppercase tracking-widest text-[0.65rem]">Verified Customer Favorite</span>
      </div>

      <div class="flex items-baseline gap-3 pt-2">
        <span id="ProductPrice" class="text-white text-3xl md:text-4xl font-extrabold">{{ selected_variant.price | money }}</span>
        <span class="text-[0.65rem] bg-[#1a1924] text-[#8B7AE8] border border-[#8B7AE8]/30 px-2.5 py-1 rounded-md uppercase tracking-wider font-semibold">Free Expedited Shipping</span>
      </div>

      <div class="h-px bg-[#22222a] w-full"></div>

      <div class="text-stone-300 text-sm leading-relaxed font-light">
        {{ product.description }}
      </div>

      <!-- Add to Cart Form -->
      {% form 'product', product, id: 'AddToCartForm' %}
        <input type="hidden" name="id" id="SelectedVariantId" value="{{ selected_variant.id }}">

        {% if product.variants.size > 1 %}
          <div class="space-y-3 mb-6">
            <label class="block text-stone-300 text-[0.7rem] uppercase tracking-[0.2em] font-bold">Select Size / Edition</label>
            <div class="grid grid-cols-2 gap-3">
              {% for variant in product.variants %}
                <button type="button" onclick="selectVariant('{{ variant.id }}', '{{ variant.price | money }}')" class="variant-btn p-3.5 rounded-xl border text-left transition-all border-[#22222a] bg-[#111115] hover:border-[#8B7AE8]">
                  <span class="block text-xs font-bold text-white uppercase tracking-wider">{{ variant.title }}</span>
                  <span class="text-[0.7rem] text-[#8B7AE8] font-mono">{{ variant.price | money }}</span>
                </button>
              {% endfor %}
            </div>
          </div>
        {% endif %}

        <button type="submit" class="w-full bg-[#8B7AE8] hover:bg-[#7a68dc] text-black font-extrabold text-xs uppercase tracking-[0.25em] py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(139,122,232,0.3)]">
          Add To Cart — Immediate Shipping
        </button>
      {% endform %}

      <!-- Delivery Calculator -->
      <div class="bg-[#111117] border border-[#22222c] rounded-xl p-4 flex items-start gap-3">
        <i class="ri-truck-line text-lg text-[#8B7AE8] mt-0.5"></i>
        <div class="text-xs space-y-1">
          <p class="text-white font-bold tracking-wide">Estimated Delivery: <span class="text-[#8B7AE8]">3 to 5 Business Days</span></p>
          <p class="text-stone-400 text-[0.7rem]">1 business day dispatch with live tracking.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<script>
function selectVariant(id, price) {
  document.getElementById('SelectedVariantId').value = id;
  document.getElementById('ProductPrice').innerText = price;
}
</script>
`;
fs.writeFileSync(path.join(nativeThemeDir, 'sections', 's1ck-product-detail.liquid'), productDetailLiquid);

// 4. sections/s1ck-hero.liquid
const heroLiquid = `<section class="relative min-h-screen flex items-center justify-center pt-24 px-6 text-center overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-[#0a0a0a] z-10"></div>
  <div class="relative z-20 max-w-4xl space-y-6">
    <span class="text-[#8B7AE8] text-xs uppercase tracking-[0.3em] font-extrabold border border-[#8B7AE8]/30 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md">Pheromone Infused Niche Fragrances</span>
    <h1 class="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white">Command The Room Before You Speak</h1>
    <p class="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">Infused with 48mg human-grade pheromones. Gourmand seduction engineered for projection and skin longevity.</p>
    <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
      <a href="/collections/all" class="w-full sm:w-auto bg-[#8B7AE8] hover:bg-[#7a68dc] text-black font-extrabold text-xs uppercase tracking-[0.25em] px-8 py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(139,122,232,0.3)]">Explore Collections</a>
    </div>
  </div>
</section>
`;
fs.writeFileSync(path.join(nativeThemeDir, 'sections', 's1ck-hero.liquid'), heroLiquid);

// 5. sections/s1ck-footer.liquid
const footerLiquid = `<footer class="bg-[#050505] border-t border-[#22222a] py-16 px-6 md:px-12 text-stone-400 text-xs">
  <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
    <div class="space-y-4">
      <h3 class="text-white font-black text-lg tracking-widest uppercase">S1CK</h3>
      <p class="text-stone-400 font-light leading-relaxed">Luxury gourmand pheromone colognes and fine jewelry crafted for quiet confidence.</p>
    </div>
    <div>
      <h4 class="text-white font-bold uppercase tracking-wider mb-3">Shop</h4>
      <ul class="space-y-2">
        <li><a href="/collections/mens-fragrances" class="hover:text-white">Men's Fragrances</a></li>
        <li><a href="/collections/womens-fragrances" class="hover:text-white">Women's Fragrances</a></li>
        <li><a href="/pages/monthly-box" class="hover:text-white">VIP Club</a></li>
      </ul>
    </div>
    <div>
      <h4 class="text-white font-bold uppercase tracking-wider mb-3">Support</h4>
      <ul class="space-y-2">
        <li><a href="/pages/faq" class="hover:text-white">Shipping Policy</a></li>
        <li><a href="/pages/contact" class="hover:text-white">Contact Us</a></li>
      </ul>
    </div>
    <div class="space-y-3">
      <h4 class="text-white font-bold uppercase tracking-wider">Join VIP Club</h4>
      <p class="text-stone-400">Subscribe to receive 10% off your first order.</p>
    </div>
  </div>
  <div class="max-w-7xl mx-auto border-t border-[#1a1a22] mt-12 pt-6 text-center text-stone-500">
    &copy; {{ 'now' | date: "%Y" }} S1CK Shop. All rights reserved.
  </div>
</footer>
`;
fs.writeFileSync(path.join(nativeThemeDir, 'sections', 's1ck-footer.liquid'), footerLiquid);

// 6. Templates
fs.writeFileSync(path.join(nativeThemeDir, 'templates', 'index.liquid'), `{% section 's1ck-hero' %}`);
fs.writeFileSync(path.join(nativeThemeDir, 'templates', 'product.liquid'), `{% section 's1ck-product-detail' %}`);
fs.writeFileSync(path.join(nativeThemeDir, 'templates', 'collection.liquid'), `{% section 's1ck-hero' %}`);

// 7. Assets CSS & JS
const cssContent = `/* S1CK Native Theme Styles */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
h1, h2, h3 { font-family: 'Syne', sans-serif; }
`;
fs.writeFileSync(path.join(nativeThemeDir, 'assets', 's1ck-theme.css'), cssContent);
fs.writeFileSync(path.join(nativeThemeDir, 'assets', 's1ck-theme.js'), '// S1CK Native Theme Logic');

// 8. Config & Locales
const settingsSchema = [
    {
        "name": "theme_info",
        "theme_name": "S1CK Native Liquid Theme",
        "theme_author": "S1CK",
        "theme_version": "1.0.0"
    }
];
fs.writeFileSync(path.join(nativeThemeDir, 'config', 'settings_schema.json'), JSON.stringify(settingsSchema, null, 2));
fs.writeFileSync(path.join(nativeThemeDir, 'config', 'settings_data.json'), JSON.stringify({ current: {} }, null, 2));
fs.writeFileSync(path.join(nativeThemeDir, 'locales', 'en.default.json'), JSON.stringify({ general: { meta: {} } }, null, 2));

// Zip using JSZip (POSIX forward slashes)
const zip = new JSZip();

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

addFolderToZip(nativeThemeDir, zip);

const zipPath = path.join(rootDir, 's1ck-native-liquid-theme.zip');
zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 6 } })
    .then(content => {
        fs.writeFileSync(zipPath, content);
        const sizeMb = (fs.statSync(zipPath).size / (1024 * 1024)).toFixed(2);
        console.log(`Successfully generated Native Liquid Theme ZIP (${sizeMb} MB) at: ${zipPath}`);
    })
    .catch(err => {
        console.error('JSZip error:', err);
    });
