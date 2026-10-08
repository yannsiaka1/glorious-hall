import { motion, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { StructuredData } from '@/components/layout/StructuredData'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'
import { Gallery } from '@/components/sections/Gallery'
import { Hero } from '@/components/sections/Hero'
import { Offer } from '@/components/sections/Offer'
import { Services } from '@/components/sections/Services'
import { Testimonials } from '@/components/sections/Testimonials'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { useZoneEtapes } from '@/lib/defileur'
import { hautDansDocument } from '@/lib/steps'

/**
 * Enchaînement de la page :
 * hero → (1 cran) section 2 qui le recouvre → défilement libre → services
 * (1 cran par service, puis 1 cran vers la galerie) → galerie (contenu, puis
 * logo seul, puis 1 cran vers « À propos ») → défilement libre jusqu'au pied.
 *
 * L'ordre des sections compte : services et galerie prennent pour dernier
 * arrêt le haut de la section qui les suit.
 */
function Page() {
  const offre = useRef<HTMLElement>(null)

  // 0 quand la section 2 entre par le bas, 1 quand elle recouvre entièrement le hero.
  const { scrollYProgress: recouvrement } = useScroll({ target: offre, offset: ['start end', 'start start'] })
  const { scrollYProgress } = useScroll()
  const progression = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  useZoneEtapes({
    id: 'accueil',
    arrets: () => (offre.current ? [{ y: 0 }, { y: hautDansDocument(offre.current) }] : []),
  })

  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white"
      >
        Aller au contenu
      </a>
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progression }}
        className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-gold-400"
      />
      <Header />
      <main id="contenu">
        <div className="relative">
          <Hero recouvrement={recouvrement} />
          <Offer ref={offre} recouvrement={recouvrement} />
        </div>
        <Services />
        <Gallery />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <StructuredData />
    </>
  )
}

export default function App() {
  return (
    <SmoothScroll>
      <Page />
    </SmoothScroll>
  )
}
