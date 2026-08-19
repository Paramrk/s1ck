import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mkcert from 'vite-plugin-mkcert'

const IMAGE_EXTS = /\.(png|jpg|jpeg|webp|gif|svg)$/i;
const VIDEO_EXTS = /\.(mp4|webm|mov)$/i;
const FONT_EXTS = /\.(woff|woff2|ttf|otf|eot)$/i;

// https://vite.dev/config/
export default defineConfig({
  base: './',
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        let cleanFileName = filename.replace(/^assets\//, '');
        if (/^(.+)-[A-Za-z0-9_-]{8}\.([a-z0-9]+)$/i.test(cleanFileName)) {
          cleanFileName = cleanFileName.replace(/^(.+)-[A-Za-z0-9_-]{8}\.([a-z0-9]+)$/i, "$1.$2");
        }

        if (VIDEO_EXTS.test(cleanFileName)) {
          // Videos → resolve from Liquid mapping, Shopify Files CDN, or custom CDN
          return {
            runtime: `(function() {
              var w = typeof window !== 'undefined' ? window : {};
              var clean = ${JSON.stringify(cleanFileName)};
              if (w.__SHOPIFY_MEDIA_BASE_URL__) {
                var b0 = w.__SHOPIFY_MEDIA_BASE_URL__.endsWith('/') ? w.__SHOPIFY_MEDIA_BASE_URL__ : w.__SHOPIFY_MEDIA_BASE_URL__ + '/';
                return b0 + clean;
              }
              if (w.__SHOPIFY_VIDEOS__ && w.__SHOPIFY_VIDEOS__[clean]) {
                var v = w.__SHOPIFY_VIDEOS__[clean];
                if (v && typeof v === 'string' && v.length > 5 && !v.includes('no-image') && !v.includes('undefined')) {
                  return v.startsWith('//') ? 'https:' + v : v;
                }
              }
              var fileBase = w.__SHOPIFY_FILE_BASE_URL__ || w.__SHOPIFY_ASSET_BASE_URL__;
              if (fileBase) {
                var b = fileBase.endsWith('/') ? fileBase : fileBase + '/';
                return b + clean;
              }
              return './' + ${JSON.stringify(filename)};
            })()`
          };
        } else if (IMAGE_EXTS.test(cleanFileName) || FONT_EXTS.test(cleanFileName)) {
          // Images and Fonts → resolve from Theme Assets (__SHOPIFY_ASSET_BASE_URL__)
          return {
            runtime: `(function() {
              var w = typeof window !== 'undefined' ? window : {};
              var assetBase = w.__SHOPIFY_ASSET_BASE_URL__ || w.__SHOPIFY_FILE_BASE_URL__;
              if (assetBase) {
                var b = assetBase.endsWith('/') ? assetBase : assetBase + '/';
                return b + ${JSON.stringify(cleanFileName)};
              }
              return './' + ${JSON.stringify(filename)};
            })()`
          };
        }

        return {
          runtime: `(function() {
            var w = typeof window !== 'undefined' ? window : {};
            var base = w.__SHOPIFY_ASSET_BASE_URL__ || w.__SHOPIFY_FILE_BASE_URL__;
            if (base) {
              var b = base.endsWith('/') ? base : base + '/';
              return b + ${JSON.stringify(cleanFileName)};
            }
            return './' + ${JSON.stringify(filename)};
          })()`
        };
      }
      return { relative: true };
    }
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/s1ck-app.js',
        chunkFileNames: 'assets/s1ck-[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/s1ck-app.css';
          }
          return 'assets/[name][extname]';
        }
      }
    }
  },
  plugins: [react(), tailwindcss(), mkcert()],
  server: {
    // @ts-ignore - TS2769 mismatch in Vite 7
    https: true,
    hmr: {
      overlay: false,
    },
  },
})