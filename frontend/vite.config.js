import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: "Liora",
        short_name: "Liora",
        description: "AI powered chatBot",
        theme_color: "#212121",
        background_color : "black",
        icons: [
          {
            "src": "icons/Liora-48x48.png",
            "sizes": "48x48",
            "type": "image/png"
          },
          {
            "src": "icons/Liora-72x72.png",
            "sizes": "72x72",
            "type": "image/png"
          },
          {
            "src": "icons/Liora-96x96.png",
            "sizes": "96x96",
            "type": "image/png"
          },
          {
            "src": "icons/Liora-128x128.png",
            "sizes": "128x128",
            "type": "image/png"
          },
          {
            "src": "icons/Liora-144x144.png",
            "sizes": "144x144",
            "type": "image/png"
          },
          {
            "src": "icons/Liora-152x152.png",
            "sizes": "152x152",
            "type": "image/png"
          },
          {
            "src": "icons/Liora-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "icons/Liora-256x256.png",
            "sizes": "256x256",
            "type": "image/png"
          },
          {
            "src": "icons/Liora-384x384.png",
            "sizes": "384x384",
            "type": "image/png"
          },
          {
            "src": "icons/Liora-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ],
        start_url: '.',
        display: 'standalone'
      },
      workbox: {
        runtimeCaching:
          [
            {
              urlPattern: '*',
              handler: "CacheFirst"
            }
          ]
      },
      registerType: 'autoUpdate'
    }),
    tailwindcss()],
})
