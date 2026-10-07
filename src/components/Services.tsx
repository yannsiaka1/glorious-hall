import { AnimatePresence, motion, useAnimate, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import branch from '../assets/img/branche-doree.webp'
import { services } from '../content'
import { Highlight } from '../lib/Highlight'
import { useLenis, useScrollTo, useStepZone } from '../lib/scroll'
import { docTop, isStepping, stepTo } from '../lib/steps'

const ease = [0.22, 1, 0.36, 1] as const
const N = services.length

/**
 * Forme du cadre photo, relevée point par point sur la maquette :
 * grand arrondi en haut à gauche, bord supérieur qui descend vers la droite,
 * arrondis plus serrés en bas. Coordonnées relatives (0 à 1).
 */
const FRAME_PATH =
  'M0,0.24 A0.2,0.24 0 0 1 0.2,0.008 L0.48,0 L0.86,0.07 C0.95,0.087 1,0.16 1,0.24 L1,0.8 A0.17,0.2 0 0 1 0.83,1 L0.17,1 A0.17,0.22 0 0 1 0,0.78 Z'

/** Dimensions du cadre (ratio de la maquette : 600 × 532). */
const frameVars = {
  '--fh': 'min(40.3vw, 68svh)',
  '--fw': 'calc(var(--fh) * 1.128)',
} as CSSProperties

function stopsOf(el: HTMLElement | null) {
  if (!el) return []
  const top = docTop(el)
  const travel = el.offsetHeight - window.innerHeight
  return Array.from({ length: N }, (_, i) => top + (travel * i) / (N - 1))
}

/**
 * Section épinglée : un cran de molette (ou un glissé) = un service.
 * La plante et les deux boutons restent en place ; le reste change.
 */
export function Services() {
  const ref = useRef<HTMLElement>(null)
  const lenis = useLenis()
  const scrollTo = useScrollTo()
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const indexRef = useRef(0)
  const [plantScope, animatePlant] = useAnimate()

  const show = (next: number) => {
    if (next === indexRef.current) return
    setDir(next > indexRef.current ? 1 : -1)
    indexRef.current = next
    setIndex(next)
  }

  useStepZone({ id: 'services', stops: () => stopsOf(ref.current), onStep: show })

  // Barre de défilement, clavier natif, lien d'ancre : on suit la position
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!isStepping()) show(Math.round(Math.min(1, Math.max(0, p)) * (N - 1)))
  })
  const progressHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  // Une rafale de vent plus forte à chaque changement de service
  useEffect(() => {
    if (reduce || !plantScope.current) return
    animatePlant(
      plantScope.current,
      { rotate: [0, -6 * dir, 3.5 * dir, -1.8 * dir, 0.8 * dir, 0] },
      { duration: 2.2, ease: 'easeOut' },
    )
  }, [index, dir, reduce, animatePlant, plantScope])

  const goTo = (k: number) => {
    const target = Math.max(0, Math.min(N - 1, k))
    if (target === indexRef.current) return
    stepTo(lenis, 'services', target)
  }

  const s = services[index]

  return (
    <section
      id="services"
      ref={ref}
      data-theme="light"
      aria-label="Nos services"
      className="relative bg-cream"
      style={{ height: `${N * 100}svh` }}
    >
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="gh-cadre" clipPathUnits="objectBoundingBox">
            <path d={FRAME_PATH} />
          </clipPath>
        </defs>
      </svg>

      <div className="sticky top-0 h-[100svh] overflow-hidden" style={frameVars}>
        {/* La plante dorée : fixe, secouée par le vent */}
        <div
          ref={plantScope}
          aria-hidden
          className="pointer-events-none absolute right-[-1.5rem] top-[calc(var(--header-h)-0.5rem)] z-20 w-24 origin-[92%_96%] sm:w-36 lg:right-0 lg:top-[calc(var(--header-h)-2.2rem)] lg:w-[15vw] lg:max-w-[17rem]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease }}
            className="origin-[92%_96%]"
          >
            <img src={branch} alt="" className="w-full origin-[92%_96%] animate-wind" />
          </motion.div>
        </div>

        <div className="page-x flex h-full flex-col justify-center gap-4 pb-5 pt-[calc(var(--header-h)+0.25rem)] lg:grid lg:grid-cols-[var(--fw)_minmax(0,1fr)] lg:items-center lg:gap-[3.4vw] lg:pb-0 lg:pt-[calc(var(--header-h)*0.55)]">
          {/* Visuel */}
          <div className="relative h-[min(30svh,calc((100vw-2*var(--gutter))/1.5))] w-full drop-shadow-[0_26px_34px_rgb(0_0_0/0.22)] sm:h-[min(36svh,calc((100vw-2*var(--gutter))/1.6))] lg:h-[var(--fh)] lg:w-[var(--fw)]">
            <div className="relative h-full w-full overflow-hidden bg-white" style={{ clipPath: 'url(#gh-cadre)' }}>
              <AnimatePresence initial={false} custom={dir}>
                <motion.img
                  key={s.key}
                  src={s.image}
                  alt={s.imageAlt}
                  custom={dir}
                  variants={{
                    enter: (d: number) => ({
                      clipPath: d > 0 ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)',
                      scale: 1.25,
                    }),
                    center: { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, zIndex: 2 },
                    exit: (d: number) => ({ scale: 0.92, y: d > 0 ? '-6%' : '6%', opacity: 0.4, zIndex: 1 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 1.15, ease }}
                  className={`absolute inset-0 h-full w-full ${s.imageFit === 'contain' ? 'object-contain px-[14%] pb-[22%] pt-[6%]' : 'object-cover'}`}
                />
              </AnimatePresence>

              {/* Légende : verre dépoli teinté par la photo, flèches de navigation */}
              <div className="absolute bottom-0 left-[1.2%] z-10 flex w-[66%] items-center justify-between gap-1 rounded-[999px_999px_2.5rem_0] bg-gradient-to-r from-black/30 via-black/15 to-black/5 px-[3%] pb-[4.5%] pt-[3.5%] text-white backdrop-blur-md backdrop-saturate-150">
                <button
                  onClick={() => goTo(index - 1)}
                  disabled={index === 0}
                  aria-label="Service précédent"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full transition hover:bg-white/20 disabled:opacity-30 lg:h-12 lg:w-12"
                >
                  <ChevronLeft className="h-7 w-7 lg:h-10 lg:w-10" strokeWidth={2.4} />
                </button>
                <div className="min-w-0 flex-1 text-center">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={s.key}
                      initial={{ opacity: 0, y: 12 * dir }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 * dir }}
                      transition={{ duration: 0.45, ease }}
                    >
                      <p className="text-[clamp(0.9rem,1.7vw,1.9rem)] font-bold leading-tight tracking-[0.1em]">{s.caption}</p>
                      {s.captionLines.map((line) => (
                        <p key={line} className="text-[clamp(0.62rem,1.1vw,1.15rem)] leading-snug tracking-[0.06em] text-white/95">
                          {line}
                        </p>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <button
                  onClick={() => goTo(index + 1)}
                  disabled={index === N - 1}
                  aria-label="Service suivant"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full transition hover:bg-white/20 disabled:opacity-30 lg:h-12 lg:w-12"
                >
                  <ChevronRight className="h-7 w-7 lg:h-10 lg:w-10" strokeWidth={2.4} />
                </button>
              </div>
            </div>
          </div>

          {/* Texte : même hauteur que le cadre, liste et boutons calés en bas */}
          <div className="relative flex min-h-0 flex-col lg:h-[var(--fh)]">
            <span className="eyebrow self-start lg:mt-[calc(var(--fh)*0.07)]">Nos services</span>

            <div className="relative mt-3 min-h-0 flex-1 lg:mt-[calc(var(--fh)*0.04)]">
              <AnimatePresence mode="wait" initial={false} custom={dir}>
                <motion.div key={s.key} custom={dir} initial="hidden" animate="show" exit="out">
                  <h2 className="text-[clamp(1.3rem,2.6vw,3.2rem)] font-bold leading-[1.18] text-ink">
                    {s.title.map((line, i) => (
                      <span key={line} className="block overflow-hidden pb-[0.06em]" style={{ paddingLeft: `${s.retraits[i] ?? 0}em` }}>
                        <motion.span
                          className="block"
                          variants={{
                            hidden: (d: number) => ({ y: d > 0 ? '110%' : '-110%' }),
                            show: { y: '0%', transition: { duration: 0.8, delay: 0.08 + i * 0.08, ease } },
                            out: (d: number) => ({ y: d > 0 ? '-110%' : '110%', transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } }),
                          }}
                        >
                          <Highlight text={line} />
                        </motion.span>
                      </span>
                    ))}
                  </h2>
                  <motion.p
                    variants={{
                      hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
                      show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, delay: 0.3, ease } },
                      out: { opacity: 0, transition: { duration: 0.3 } },
                    }}
                    className="mt-3 max-w-[40rem] text-[clamp(0.9rem,1.38vw,1.7rem)] leading-[1.32] text-ink/90 [@media(max-height:700px)_and_(max-width:1023px)]:hidden lg:mt-[calc(var(--fh)*0.04)]"
                  >
                    {s.text}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-3 flex items-stretch gap-3 lg:mt-0 lg:items-center lg:gap-[1.7vw]">
              {/* Liste : change avec le service */}
              <div className="relative h-[8.2rem] min-w-0 flex-1 overflow-hidden rounded-xl lg:h-[clamp(9.5rem,14.2vw,17rem)] lg:w-[clamp(15rem,20.5vw,25rem)] lg:flex-none">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={s.key}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease }}
                    className="absolute inset-0"
                  >
                    <img src={s.pointsBg} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-[#2b2b2b]/75" />
                    <ul className="relative flex h-full flex-col justify-center gap-[0.55em] px-4 py-3 lg:px-[1.4vw]">
                      {s.points.map((p, i) => (
                        <motion.li
                          key={p}
                          initial={{ opacity: 0, x: -14 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.35 + i * 0.07, ease }}
                          className="flex items-start gap-2.5 text-[0.72rem] font-bold leading-[1.2] text-white lg:gap-[0.9vw] lg:text-[clamp(0.72rem,1.05vw,1.2rem)]"
                        >
                          <span className="mt-[0.3em] h-[0.6em] w-[0.6em] shrink-0 rounded-full bg-white" />
                          {p}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Les deux boutons : fixes */}
              <div className="flex w-[42%] shrink-0 flex-col justify-center gap-3 lg:w-[clamp(12rem,18.6vw,22rem)] lg:gap-[1.6vw]">
                <button
                  onClick={() => scrollTo('galerie')}
                  className="btn min-h-12 rounded-2xl bg-black px-3 text-[0.95rem] text-white hover:shadow-[0_14px_30px_-12px_rgb(0_0_0/0.6)] lg:h-[clamp(3.2rem,5.5vw,5.6rem)] lg:rounded-[clamp(0.9rem,1.25vw,1.2rem)] lg:text-[clamp(1rem,1.75vw,1.9rem)]"
                >
                  Voir la galerie
                </button>
                <button
                  onClick={() => scrollTo('contact')}
                  className="btn min-h-12 rounded-2xl bg-gold-600 px-3 text-[0.95rem] text-white hover:bg-gold-500 hover:shadow-[0_14px_30px_-12px_rgb(157_115_38/0.9)] lg:h-[clamp(3.2rem,5.5vw,5.6rem)] lg:rounded-[clamp(0.9rem,1.25vw,1.2rem)] lg:text-[clamp(1rem,1.75vw,1.9rem)]"
                >
                  Nous contacter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Repères de progression, discrets, au bord droit */}
        <nav aria-label="Services" className="absolute right-3 top-[62%] z-20 hidden -translate-y-1/2 flex-col items-end gap-3 xl:flex">
          <div className="absolute right-[5px] top-1 h-[calc(100%-0.5rem)] w-px bg-ink/10">
            <motion.div style={{ height: progressHeight }} className="w-px bg-gold-600" />
          </div>
          {services.map((item, i) => (
            <button key={item.key} onClick={() => goTo(i)} className="group relative flex items-center gap-3" aria-label={item.caption} aria-current={i === index}>
              <span className="pointer-events-none absolute right-6 translate-x-2 whitespace-nowrap rounded-full bg-cream/90 px-2 py-0.5 text-xs tracking-[0.06em] text-gold-700 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                {item.caption}
              </span>
              <span
                className={`relative h-[11px] w-[11px] rounded-full border transition-all duration-500 ${
                  i === index ? 'scale-110 border-gold-600 bg-gold-600' : 'border-ink/30 bg-cream group-hover:border-gold-600'
                }`}
              />
            </button>
          ))}
        </nav>
      </div>
    </section>
  )
}
