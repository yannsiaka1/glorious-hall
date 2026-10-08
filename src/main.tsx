import '@fontsource/arimo/latin-400.css'
import '@fontsource/arimo/latin-700.css'
import '@fontsource/lavishly-yours/latin-400.css'
import '@fontsource/luxurious-roman/latin-400.css'
import { StrictMode } from 'react'
import { ViteReactSSG } from 'vite-react-ssg/single-page'
import App from './App'
import './styles/index.css'

/**
 * `vite-react-ssg` (comme sur Precious) génère au build un index.html complet :
 * Google et les aperçus de partage lisent le contenu sans exécuter de script.
 * Dans le navigateur, React reprend ensuite la main sur ce HTML (hydratation).
 */
export const createRoot = ViteReactSSG(
  <StrictMode>
    <App />
  </StrictMode>,
)
