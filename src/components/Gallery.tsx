import { AnimatePresence, LayoutGroup, motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { ChevronRight, Play } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { gallery, galleryBackground, galleryFilters, type Video } from '../content'
import { useStepZone } from '../lib/scroll'
import { docTop } from '../lib/steps'
import { Lightbox } from './Lightbox'

const ease = [0.22, 1, 0.36, 1] as const

// Paillettes dorées (positions fixes pour éviter tout saut entre rendus)
const bokeh = Array.from({ length: 40 }, (_, i) => {
  const r = (n: number) => (((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1) + 1) % 1
  return { left: r(1) * 100, top: r(2) * 100, size: 2 + r(3) * 8, delay: r(4) * 4, blur: r(5) > 0.65 }
})

const counts = gallery.reduce<Record<string, number>>((acc, g) => ({ ...acc, [g.category]: (acc[g.category] ?? 0) + 1 }), {})

/** Vignette vidéo : affiche fixe, aperçu animé au survol (ou en continu pour la grande). */
function Tile({ item, big, onOpen, autoPlay }: { item: Video; big: boolean; onOpen: () => void; autoPlay: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [hover, setHover] = useState(false)
  const playing = autoPlay || hover

  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (playing) v.play().catch(() => {})
    else v.pause()
  }, [playing])

  return (
    <button
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="group relative h-full w-full overflow-hidden rounded-[1.4rem] text-left lg:rounded-[1.8rem]"
      aria-label={`Lire la vidéo : ${item.titre}`}
    >
      <img
        src={big ? item.affiche : item.afficheSmall}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-(--ease-lux) group-hover:scale-110"
      />
      <video
        ref={ref}
        src={item.apercu}
        muted
        loop
        playsInline
        preload="none"
        className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-(--ease-lux) group-hover:scale-110 ${
          playing ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/35 text-white opacity-0 backdrop-blur-sm transition duration-500 group-hover:opacity-100 lg:h-11 lg:w-11">
        <Play className="ml-0.5 h-4 w-4 fill-current" />
      </span>
      <span
        className={`absolute bottom-0 left-0 rounded-[0_999px_999px_0] bg-gradient-to-r from-black/30 via-black/15 to-black/0 text-white backdrop-blur-md backdrop-saturate-150 transition-transform duration-500 ease-(--ease-lux) group-hover:-translate-y-1 ${
          big ? 'px-[7%] pb-[5%] pt-[3.5%] lg:min-w-[55%]' : 'px-4 pb-2.5 pt-2 lg:min-w-[62%]'
        }`}
      >
        <span className={`block font-bold tracking-[0.1em] ${big ? 'text-[clamp(1.1rem,2vw,1.9rem)]' : 'text-[clamp(0.78rem,1.1vw,1.05rem)]'}`}>
          {item.category}
        </span>
        <span className={`flex items-center gap-1 tracking-[0.08em] ${big ? 'text-[clamp(0.75rem,1.15vw,1.1rem)]' : 'text-[clamp(0.62rem,0.85vw,0.8rem)]'}`}>
          {counts[item.category]} VIDÉOS
          <ChevronRight className="h-[1.1em] w-[1.1em] transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </span>
    </button>
  )
}

/**
 * Galerie épinglée en deux temps :
 * 1er cran : le contenu s'efface et laisse le fond (logo doré animé) ;
 * 2e cran : on passe à la section suivante.
 */
export function Gallery() {
  const ref = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLVideoElement>(null)
  const [filter, setFilter] = useState<(typeof galleryFilters)[number]>('Tous')
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [inView, setInView] = useState(false)

  useStepZone({
    id: 'galerie',
    stops: () => {
      const el = ref.current
      if (!el) return []
      const top = docTop(el)
      return [top, top + el.offsetHeight - window.innerHeight]
    },
  })

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const { scrollYProgress: approach } = useScroll({ target: ref, offset: ['start end', 'start start'] })
  const radius = useTransform(approach, [0.7, 1], ['9rem', '0rem'])
  const contentOpacity = useTransform(scrollYProgress, [0.02, 0.55], [1, 0])
  const contentY = useTransform(scrollYProgress, [0.02, 0.55], [0, -60])
  const contentBlur = useTransform(scrollYProgress, [0.02, 0.55], ['blur(0px)', 'blur(12px)'])
  const contentEvents = useTransform(scrollYProgress, (p) => (p > 0.35 ? 'none' : 'auto'))
  const veil = useTransform(scrollYProgress, [0.05, 0.7], [0.74, 0])
  const sparkle = useTransform(scrollYProgress, [0.05, 0.7], [1, 0.25])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1])

  // Le fond doré se rejoue à chaque arrivée sur le 2e temps, puis se fige sur le logo
  const revealed = useRef(false)
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const v = bgRef.current
    if (!v) return
    if (p > 0.55 && !revealed.current) {
      revealed.current = true
      v.currentTime = 0
      v.play().catch(() => {})
    } else if (p < 0.2 && revealed.current) {
      revealed.current = false
      v.pause()
    }
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const items = useMemo(() => (filter === 'Tous' ? gallery : gallery.filter((g) => g.category === filter)), [filter])
  const visible = items.slice(0, 5)

  return (
    <section id="galerie" ref={ref} data-theme="dark" aria-labelledby="galerie-titre" className="relative bg-cream" style={{ height: '200svh' }}>
      <motion.div
        style={{ borderTopLeftRadius: radius, borderTopRightRadius: radius }}
        className="sticky top-0 h-[100svh] overflow-hidden bg-black"
      >
        {/* Fond : générique doré des vidéos officielles */}
        <motion.div aria-hidden style={{ scale: bgScale }} className="absolute inset-0">
          <video
            ref={bgRef}
            src={galleryBackground.src}
            poster={galleryBackground.affiche}
            muted
            playsInline
            preload="auto"
            onEnded={(e) => e.currentTarget.pause()}
            className="absolute inset-0 h-full w-full scale-[1.55] object-contain md:scale-100 md:object-cover"
          />
          <motion.div style={{ opacity: veil }} className="absolute inset-0 bg-black" />
          <motion.div style={{ opacity: sparkle }} className="absolute inset-0">
            {bokeh.map((b, i) => (
              <span
                key={i}
                className="absolute animate-twinkle rounded-full bg-gold-300"
                style={{
                  left: `${b.left}%`,
                  top: `${b.top}%`,
                  width: b.size,
                  height: b.size,
                  animationDelay: `${b.delay}s`,
                  filter: b.blur ? 'blur(2px)' : undefined,
                  boxShadow: '0 0 12px rgb(224 190 128 / 0.8)',
                }}
              />
            ))}
          </motion.div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgb(0_0_0/0.7)_100%)]" />
        </motion.div>

        {/* Contenu */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY, filter: contentBlur, pointerEvents: contentEvents }}
          className="page-x relative flex h-full flex-col justify-center pb-6 pt-[calc(var(--header-h)+0.25rem)] lg:pb-8"
        >
          <div className="lg:pl-[10vw]">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
              className="eyebrow normal-case !text-gold-300"
            >
              Galerie
            </motion.span>
            <motion.h2
              id="galerie-titre"
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.1, ease }}
              className="mt-2 text-[clamp(1.55rem,2.9vw,2.9rem)] font-bold tracking-[0.03em] text-white lg:pl-[1.5vw]"
            >
              Nos dernières <span className="text-gold-300">réalisations.</span>
            </motion.h2>
          </div>

          <div
            role="tablist"
            aria-label="Filtrer la galerie"
            data-lenis-prevent-horizontal
            className="mt-5 flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] sm:gap-4 lg:mt-[2.2svh] lg:gap-[2.9vw]"
          >
            {galleryFilters.map((f, i) => (
              <motion.button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.06, ease }}
                className={`relative shrink-0 rounded-full border-2 px-5 py-1.5 text-sm transition-colors duration-300 lg:min-w-[13vw] lg:py-[0.55vw] lg:text-[clamp(0.85rem,1.2vw,1.1rem)] ${
                  f === 'Tous' ? 'lg:min-w-[6.5vw]' : ''
                } ${filter === f ? 'border-white text-ink' : 'border-gold-300/80 text-white hover:border-gold-300 hover:text-gold-300'}`}
              >
                {filter === f && (
                  <motion.span layoutId="gal-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                )}
                <span className="relative">{f}</span>
              </motion.button>
            ))}
          </div>

          <LayoutGroup>
            <motion.ul
              layout
              className="mt-5 grid h-[min(58svh,calc((100vw-2*var(--gutter))*1.3))] grid-cols-2 grid-rows-[1.25fr_1fr_1fr] gap-2.5 sm:gap-4 lg:mt-[3svh] lg:h-[min(56svh,calc((100vw-2*var(--gutter))*0.297))] lg:grid-cols-[1.97fr_1fr_1fr] lg:grid-rows-2 lg:gap-[2.6vw]"
            >
              <AnimatePresence mode="popLayout">
                {visible.map((g, i) => (
                  <motion.li
                    layout
                    key={g.slug}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6, ease }}
                    className={i === 0 ? 'col-span-2 lg:col-span-1 lg:row-span-2' : ''}
                  >
                    <Tile item={g} big={i === 0} autoPlay={i === 0 && inView} onOpen={() => setLightbox(items.indexOf(g))} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </LayoutGroup>
        </motion.div>
      </motion.div>
      <Lightbox items={items} index={lightbox} onChange={setLightbox} />
    </section>
  )
}
