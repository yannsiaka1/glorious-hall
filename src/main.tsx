import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/lavishly-yours/latin-400.css'
import '@fontsource/luxurious-roman/latin-400.css'
import '@fontsource/arimo/latin-400.css'
import '@fontsource/arimo/latin-700.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
