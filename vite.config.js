import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project sites are served from https://<user>.github.io/<repo>/.
// Override with:  VITE_BASE=/ npm run build   (for local / custom domains)
const base = process.env.VITE_BASE || '/SpectraClothing/'

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
