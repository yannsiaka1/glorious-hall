import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// `base: './'` : chemins relatifs, le même build fonctionne sur Vercel et en aperçu.
// APERCU=1 : polices intégrées au CSS (l'aperçu en ligne n'accepte pas les polices en fichiers séparés).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    assetsInlineLimit: process.env.APERCU ? (file) => (file.endsWith('.woff2') ? true : undefined) : undefined,
  },
})
