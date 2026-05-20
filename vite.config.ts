import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // ✅ root path for Vercel
  plugins: [react(), tailwindcss(), mkcert()],
  server: {
    // @ts-ignore - TS2769 mismatch in Vite 7
    https: true, // optional: allows https for local dev with mkcert
    hmr: {
      overlay: false, // disables browser error overlay
    },
  },
})