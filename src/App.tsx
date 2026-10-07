import { motion, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Gallery } from './components/Gallery'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Offer } from './components/Offer'
import { Services } from './components/Services'
import { Testimonials } from './components/Testimonials'
import { SmoothScroll, useStepZone } from './lib/scroll'
import { docTop } from './lib/steps'

function Page() {
  const offerRef = useRef<HTMLElement>(null)

  // 0 quand la section 2 entre par le bas, 1 quand elle recouvre entièrement le hero
  const { scrollYProgress: coverProgress } = useScroll({ target: offerRef, offset: ['start end', 'start start'] })
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  // Un cran : la section 2 monte et remplace exactement le hero
  useStepZone({ id: 'hero', stops: () => (offerRef.current ? [0, docTop(offerRef.current)] : []) })

  return (
    <>
      <motion.div aria-hidden style={{ scaleX: bar }} className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-gold-400" />
      <Header />
      <main>
        <div className="relative">
          <Hero coverProgress={coverProgress} />
          <Offer ref={offerRef} coverProgress={coverProgress} />
        </div>
        <Services />
        <Gallery />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
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
