import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: { navigateFallbackDenylist: [/^\/rest\//, /^\/auth\//] },
      manifest: {
        name: 'TAP — Social Identity', short_name: 'TAP', start_url: '/', display: 'standalone',
        background_color: '#07070b', theme_color: '#07070b',
        icons: [{ src: '/tap-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }]
      }
    })
  ]
})
