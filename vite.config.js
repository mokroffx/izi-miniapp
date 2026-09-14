import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5174,
    strictPort: true,
    // Telegram only opens https URLs in its WebView, so local development runs
    // behind a tunnel (e.g. cloudflared) rather than plain localhost.
    allowedHosts: ['.trycloudflare.com'],
    hmr: {
      clientPort: 443,
      protocol: 'wss',
    },
  },
})
