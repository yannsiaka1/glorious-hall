import {
  AnimatePresence, motion, useAnimate, useMotionValueEvent, useReducedMotion, useScroll, useTransform,
} from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import branch from '../assets/img/branche-doree.webp'
import { services } from '../content'
import { Highlight } from '../lib/Highlight'
import { useScrollTo } from '../lib/scroll'

const ease = [0.22, 1, 0.36, 1] as const
const N = services.length

/**
 * Pinning : la section fait N écrans de haut, son contenu reste collé (sticky)
 * et l'index affiché dépend de la progression du scroll dans la section.
 */
export function Services() {
  const ref = useRef<HTMLElement>(null)
  const scrollTo = useScrollTo()
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [plantScope, animatePlant] = useAnimate()

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const next = Math.min(N - 1, Math.max(0, Math.floor(p * N)))
    if (next !== index) {
      setDir(next > index ? 1 : -1)
      setIndex(next)
    }
  })

  // Une rafale de vent plus forte à chaque changement de slide
  useEffect(() => {
    if (reduce || !plantScope.current) return
    animatePlant(
      plantScope.current,
      { rotate: [0, -6 * dir, 3.5 * dir, -1.8 * dir, 0.8 * dir, 0] },
      { duration: 2.2, ease: 'easeOut' },
    )
  }, [index, dir, reduce, animatePlant, plantScope])

  const goTo = (k: number) => {
    const el = ref.current
    if (!el) return
    const target = Math.min(N - 1, Math.max(0, k))
    const top = el.getBoundingClientRect().top + window.scrollY
    const travel = el.offsetHeight - window.innerHeight
    scrollTo(top + ((target + 0.5) / N) * travel)
  }

  const s = services[index]
  const progressHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section
      id="services"
      ref={ref}
      aria-label="Nos services"
      className="relative bg-cream"
      style={{ height: `${N * 100}svh` }}
    >
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        {/* La plante dorée : fixe, secouée par le vent */}
        <div
          ref={plantScope}
          aria-hidden
          className="pointer-events-none absolute right-[-2rem] top-16 z-20 w-28 origin-[92%_96%] sm:right-0 sm:top-10 sm:w-44 lg:right-2 lg:w-56"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease }}
            className="origin-[92%_96%]"
          >
            {/* Balancement continu (CSS) sur un calque séparé pour ne pas entrer en conflit avec motion */}
            <img src={branch} alt="" className="w-full origin-[92%_96%] animate-wind" />
          </motion.div>
        </div>

        <div className="mx-auto grid w-full max-w-[1260px] gap-5 px-5 pt-16 sm:px-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12 lg:pt-0 lg:px-16">
          {/* Visuel */}
          <div className="relative h-[28svh] sm:h-[40svh] lg:h-[min(70svh,600px)]">
            <div className="blob relative h-full w-full overflow-hidden bg-white shadow-[0_30px_60px_-30px_rgb(0_0_0/0.45)]">
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
                  className={`absolute inset-0 h-full w-full ${s.imageFit === 'contain' ? 'object-contain p-8 mix-blend-multiply' : 'object-cover'}`}
                />
              </AnimatePresence>
            </div>

            {/* Légende avec flèches */}
            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded-[2rem] bg-gradient-to-r from-gold-600/85 via-gold-500/60 to-transparent py-3 pl-2 pr-8 backdrop-blur-[2px] sm:bottom-6 sm:left-4 sm:gap-4 sm:pr-14">
              <button
                onClick={() => goTo(index - 1)}
                disabled={index === 0}
                aria-label="Service précédent"
                className="grid h-9 w-9 place-items-center rounded-full text-white transition hover:bg-white/20 disabled:opacity-30"
              >
                <ChevronLeft className="h-7 w-7" strokeWidth={2.5} />
              </button>
              <div className="min-w-[8.5rem] text-center text-white sm:min-w-[11rem]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={s.key}
                    initial={{ opacity: 0, y: 12 * dir }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 * dir }}
                    transition={{ duration: 0.45, ease }}
                  >
                    <p className="text-base font-bold leading-tight tracking-[0.08em] sm:text-xl">{s.caption}</p>
                    <p className="text-xs tracking-[0.04em] text-white/90 sm:text-sm">{s.captionSub}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <button
                onClick={() => goTo(index + 1)}
                disabled={index === N - 1}
                aria-label="Service suivant"
                className="grid h-9 w-9 place-items-center rounded-full text-white transition hover:bg-white/20 disabled:opacity-30"
              >
                <ChevronRight className="h-7 w-7" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Texte */}
          <div className="relative">
            <span className="eyebrow [@media(max-height:720px)_and_(max-width:767px)]:hidden">Nos services</span>

            <div className="relative mt-3 h-[11.5rem] sm:h-[12.5rem] lg:mt-5 lg:h-[15rem]">
              <AnimatePresence mode="wait" initial={false} custom={dir}>
                <motion.div key={s.key} custom={dir} initial="hidden" animate="show" exit="out">
                  <h2 className="text-[clamp(1.35rem,2.6vw,2rem)] font-bold leading-[1.2] text-ink">
                    {s.title.map((line, i) => (
                      <span key={line} className="block overflow-hidden pb-[0.06em]" style={{ paddingLeft: `${i * 1.6}rem` }}>
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
                    className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-ink/85 sm:text-lg"
                  >
                    {s.text}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-3 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center sm:gap-6 lg:mt-8">
              {/* Liste : change avec la slide */}
              <div className="relative h-[7.4rem] w-full overflow-hidden rounded-2xl sm:h-[9.6rem] sm:w-[16rem] sm:shrink-0">
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
                    <div className="absolute inset-0 bg-ink/70" />
                    <ul className="relative flex h-full flex-col justify-center gap-2 px-5 py-3">
                      {s.points.map((p, i) => (
                        <motion.li
                          key={p}
                          initial={{ opacity: 0, x: -14 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.35 + i * 0.07, ease }}
                          className="flex items-start gap-3 text-xs font-semibold leading-snug text-white sm:text-[0.8rem]"
                        >
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-white" />
                          {p}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Les deux boutons : fixes */}
              <div className="flex gap-3 sm:flex-col sm:gap-4">
                <button
                  onClick={() => scrollTo('galerie')}
                  className="btn flex-1 whitespace-nowrap bg-ink px-4 py-3 text-white hover:shadow-[0_14px_30px_-12px_rgb(0_0_0/0.6)] sm:flex-none sm:px-10 sm:py-4"
                >
                  Voir la galerie
                </button>
                <button
                  onClick={() => scrollTo('contact')}
                  className="btn flex-1 whitespace-nowrap bg-gold-600 px-4 py-3 text-white hover:bg-gold-500 hover:shadow-[0_14px_30px_-12px_rgb(156_116_38/0.9)] sm:flex-none sm:px-10 sm:py-4"
                >
                  Nous contacter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rail de progression */}
        <nav aria-label="Services" className="absolute bottom-6 right-5 z-20 hidden flex-col items-end gap-3 lg:flex xl:right-8">
          <div className="absolute right-[5px] top-1 h-[calc(100%-0.5rem)] w-px bg-ink/10">
            <motion.div style={{ height: progressHeight }} className="w-px bg-gold-600" />
          </div>
          {services.map((item, i) => (
            <button key={item.key} onClick={() => goTo(i)} className="group relative flex items-center gap-3">
              <span
                className={`text-xs tracking-[0.06em] transition-all duration-500 ${
                  i === index ? 'translate-x-0 text-gold-600 opacity-100' : 'translate-x-2 text-ink/50 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                }`}
              >
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
