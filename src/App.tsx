import { motion, useScroll, useSpring } from 'motion/react'
import { useRef, useState } from 'react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Gallery } from './components/Gallery'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Lightbox } from './components/Lightbox'
import { Offer } from './components/Offer'
import { Services } from './components/Services'
import { Testimonials } from './components/Testimonials'
import { gallery, heroVideo } from './content'
import { SmoothScroll } from './lib/scroll'

function Page() {
  const offerRef = useRef<HTMLElement>(null)
  const [tour, setTour] = useState<number | null>(null)
  const [video, setVideo] = useState(false)

  // 0 quand la section "offre" entre par le bas, 1 quand elle recouvre entièrement le hero
  const { scrollYProgress: coverProgress } = useScroll({ target: offerRef, offset: ['start end', 'start start'] })
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <>
      <motion.div aria-hidden style={{ scaleX: bar }} className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-gold-400" />
      <Header />
      <main>
        {/* Le hero reste collé pendant que la section suivante monte par-dessus */}
        <div className="relative">
          <Hero coverProgress={coverProgress} onPlay={() => (heroVideo ? setVideo(true) : setTour(0))} />
          <Offer ref={offerRef} />
        </div>
        <Services />
        <Gallery />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />

      <Lightbox images={gallery} index={tour} onChange={setTour} />
      {video && heroVideo && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/90 p-4" onClick={() => setVideo(false)} role="dialog" aria-modal="true" aria-label="Vidéo de présentation">
          <video src={heroVideo} controls autoPlay playsInline className="max-h-[85svh] max-w-[92vw] rounded-3xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
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
