import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom domains and Vercel/Cloudflare Pages serve from the root.
// GitHub Pages project sites set VITE_BASE to /SpectraClothing/ in their workflow.
const base = process.env.VITE_BASE || '/'

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
  // Fonts are installed locally via @fontsource — no remote font URLs anywhere.
  optimizeDeps: {
    include: ['@fontsource/space-grotesk', '@fontsource/inter'],
  },
})
