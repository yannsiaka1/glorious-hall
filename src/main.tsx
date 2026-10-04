import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/pinyon-script/400.css'
import '@fontsource/gelasio/400.css'
import '@fontsource/gelasio/400-italic.css'
import '@fontsource-variable/open-sans'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/600.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
