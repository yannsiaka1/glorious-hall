import { AnimatePresence, LayoutGroup, motion, useScroll, useTransform } from 'motion/react'
import { ChevronRight } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import monogram from '../assets/img/monogramme-blanc.webp'
import { gallery, galleryFilters } from '../content'
import { Lightbox } from './Lightbox'

const ease = [0.22, 1, 0.36, 1] as const

// Particules dorées (positions fixes pour éviter tout saut entre rendus)
const bokeh = Array.from({ length: 46 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1
  return { left: r(1) * 100, top: r(2) * 100, size: 2 + r(3) * 9, delay: r(4) * 4, blur: r(5) > 0.65 }
})

export function Gallery() {
  const ref = useRef<HTMLElement>(null)
  const [filter, setFilter] = useState<(typeof galleryFilters)[number]>('Tous')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // 1er temps : le contenu s'efface. 2e temps : l'image de fond seule, puis la section se libère.
  const contentOpacity = useTransform(scrollYProgress, [0.1, 0.42], [1, 0])
  const contentY = useTransform(scrollYProgress, [0.1, 0.42], [0, -70])
  const contentBlur = useTransform(scrollYProgress, [0.1, 0.42], ['blur(0px)', 'blur(14px)'])
  const contentEvents = useTransform(scrollYProgress, (p) => (p > 0.3 ? 'none' : 'auto'))
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.18, 1, 0.96])
  const bgOpacity = useTransform(scrollYProgress, [0, 0.42], [0.35, 1])
  const glow = useTransform(scrollYProgress, [0.1, 0.5], [0.2, 0.75])

  const items = useMemo(() => (filter === 'Tous' ? gallery : gallery.filter((g) => g.category === filter)), [filter])
  const counts = useMemo(
    () => gallery.reduce<Record<string, number>>((acc, g) => ({ ...acc, [g.category]: (acc[g.category] ?? 0) + 1 }), {}),
    [],
  )
  const visible = items.slice(0, 5)

  return (
    <section id="galerie" ref={ref} aria-labelledby="galerie-titre" className="relative bg-cream" style={{ height: '300svh' }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden rounded-t-[3rem] bg-black sm:rounded-t-[5rem]">
        {/* Image de fond */}
        <motion.div aria-hidden style={{ scale: bgScale }} className="absolute inset-0">
          <motion.div
            style={{ opacity: glow }}
            className="absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(225_189_120/0.45),transparent_65%)]"
          />
          <motion.img
            src={monogram}
            alt=""
            style={{ opacity: bgOpacity }}
            className="absolute left-1/2 top-1/2 w-[min(78vmin,760px)] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_40px_rgb(225_189_120/0.55)]"
          />
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
                boxShadow: '0 0 12px rgb(225 189 120 / 0.8)',
              }}
            />
          ))}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(0_0_0/0.75)_100%)]" />
        </motion.div>

        {/* Contenu */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY, filter: contentBlur, pointerEvents: contentEvents }}
          className="relative mx-auto flex h-full max-w-[1260px] flex-col justify-center px-5 pb-8 pt-20 sm:px-10 lg:px-16"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="eyebrow ml-2 self-start text-gold-300 sm:ml-28"
          >
            Galerie
          </motion.span>
          <motion.h2
            id="galerie-titre"
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease }}
            className="mt-3 text-[clamp(1.6rem,3.4vw,2.6rem)] font-bold tracking-[0.03em] text-white sm:ml-28"
          >
            Nos dernières <span className="text-gold-300">réalisations.</span>
          </motion.h2>

          <div
            role="tablist"
            aria-label="Filtrer la galerie"
            data-lenis-prevent
            className="mt-6 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] sm:gap-5"
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
                className={`relative shrink-0 rounded-full border px-5 py-2 text-sm transition-colors duration-300 sm:px-12 ${
                  filter === f ? 'border-white text-ink' : 'border-gold-300/80 text-white hover:border-gold-300 hover:text-gold-300'
                }`}
              >
                {filter === f && (
                  <motion.span layoutId="gal-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                )}
                <span className="relative">{f}</span>
              </motion.button>
            ))}
          </div>

          <LayoutGroup>
            <motion.ul layout className="mt-7 grid h-[min(52svh,440px)] grid-cols-2 grid-rows-3 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-5">
              <AnimatePresence mode="popLayout">
                {visible.map((g, i) => (
                  <motion.li
                    layout
                    key={g.src}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6, ease }}
                    className={i === 0 ? 'col-span-2 md:row-span-2' : ''}
                  >
                    <button
                      onClick={() => setLightbox(items.indexOf(g))}
                      className="group relative h-full w-full overflow-hidden rounded-[1.6rem] text-left focus-visible:rounded-[1.6rem]"
                      aria-label={`Agrandir : ${g.alt}`}
                    >
                      <img
                        src={g.src}
                        alt={g.alt}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
                      <span
                        className={`absolute bottom-3 left-3 rounded-[1.4rem] bg-gradient-to-r from-gold-600/90 to-gold-500/30 px-4 py-2 text-white backdrop-blur-[2px] transition-transform duration-500 group-hover:-translate-y-1 ${
                          i === 0 ? 'sm:bottom-6 sm:left-6 sm:px-8 sm:py-4' : ''
                        }`}
                      >
                        <span className={`block font-bold tracking-[0.08em] ${i === 0 ? 'text-lg sm:text-2xl' : 'text-sm'}`}>{g.category}</span>
                        <span className="flex items-center gap-1 text-[0.7rem] tracking-[0.08em] sm:text-xs">
                          {counts[g.category]} VISUELS
                          <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </span>
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </LayoutGroup>
        </motion.div>
      </div>
      <Lightbox images={items} index={lightbox} onChange={setLightbox} />
    </section>
  )
}
