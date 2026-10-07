import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { forwardRef, useEffect, useRef, useState, type CSSProperties } from 'react'
import { included, options } from '../content'
import { Icon } from '../lib/icons'
import { useScrollTo } from '../lib/scroll'

const ease = [0.22, 1, 0.36, 1] as const
// Les tailles `calc(N * var(--u))` sont en pixels de la maquette « section2 » (1728 × 1117).

type Item = { icon: string; label: readonly string[] }

function Feature({ item, i, size, className = '' }: { item: Item; i: number; size: 'lg' | 'sm'; className?: string }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.85, delay: 0.15 + i * 0.07, ease }}
      className={`group flex flex-col items-center text-center ${className}`}
    >
      <span className="relative grid place-items-center transition-transform duration-500 ease-(--ease-lux) group-hover:-translate-y-1.5">
        <span className="absolute inset-[-20%] rounded-full bg-gold-300/25 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
        <Icon
          name={item.icon}
          className={
            size === 'lg'
              ? 'relative h-14 w-14 text-gold-300 [@media(max-height:720px)]:h-11 [@media(max-height:720px)]:w-11 lg:h-[calc(80*var(--u))] lg:w-[calc(80*var(--u))] lg:[@media(max-height:720px)]:h-[calc(80*var(--u))] lg:[@media(max-height:720px)]:w-[calc(80*var(--u))]'
              : 'relative h-12 w-12 text-gold-300 [@media(max-height:720px)]:h-10 [@media(max-height:720px)]:w-10 lg:h-[calc(72*var(--u))] lg:w-[calc(72*var(--u))] lg:[@media(max-height:720px)]:h-[calc(72*var(--u))] lg:[@media(max-height:720px)]:w-[calc(72*var(--u))]'
          }
        />
      </span>
      <span className="mt-2 font-bold leading-[1.15] tracking-[0.14em] text-gold-300 transition-colors duration-300 group-hover:text-gold-200 max-lg:text-[0.95rem] lg:mt-[calc(8*var(--u))] lg:text-[calc(28*var(--u))]">
        {item.label.map((line) => (
          <span key={line} className="block whitespace-nowrap">
            {line}
          </span>
        ))}
      </span>
    </motion.li>
  )
}

type Props = { coverProgress: MotionValue<number> }

/**
 * Section 2, reprise de la maquette « section2 ».
 * - Ordinateur : une page pleine hauteur, identique à la maquette.
 * - Téléphone et tablette : la section s'arrête à l'écran et les services
 *   défilent sur le côté au rythme du défilement, puis la page reprend.
 */
export const Offer = forwardRef<HTMLElement, Props>(function Offer({ coverProgress }, ref) {
  const scrollTo = useScrollTo()
  const innerRef = useRef<HTMLElement | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const [travel, setTravel] = useState(0)
  const radius = useTransform(coverProgress, [0.6, 1], [48, 0])

  // Longueur du défilement latéral (téléphone/tablette uniquement)
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current
      const rail = railRef.current
      if (!track || !rail || window.innerWidth >= 1024) return setTravel(0)
      // largeur de mise en page : insensible au décalage (transform) en cours
      setTravel(Math.max(0, rail.offsetWidth - track.clientWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (trackRef.current) ro.observe(trackRef.current)
    if (railRef.current) ro.observe(railRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: innerRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, (p) => -p * travel)
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  const setRefs = (el: HTMLElement | null) => {
    innerRef.current = el
    if (typeof ref === 'function') ref(el)
    else if (ref) ref.current = el
  }

  return (
    <section
      ref={setRefs}
      data-theme="dark"
      aria-labelledby="offre-titre"
      className="u-scope relative z-10"
      style={{ height: travel ? `calc(100svh + ${travel}px)` : undefined } as CSSProperties}
    >
      <motion.div
        style={{ borderTopLeftRadius: radius, borderTopRightRadius: radius }}
        className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden lg:justify-start bg-[linear-gradient(98deg,#000_0%,#000_56%,#101010_62%,#222_70%,#363636_80%,#4b4b4b_90%,#5f5f5f_100%)] shadow-[0_-30px_60px_-20px_rgb(0_0_0/0.55)]"
      >
        {/* En-tête de section : titre, sous-titre et bouton */}
        <div className="page-x flex shrink-0 items-start justify-between gap-6 pt-[var(--header-h)] max-lg:flex-col">
          <div>
            {/* L'observateur est sur le parent : un élément entièrement rogné (clip-path) n'est jamais « visible » */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}>
              <motion.h2
                id="offre-titre"
                variants={{ hidden: { clipPath: 'inset(-30% 100% -30% 0)' }, show: { clipPath: 'inset(-30% 0% -30% 0)' } }}
                transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
                className="font-script text-[clamp(2.7rem,11vw,4.2rem)] leading-[1.2] text-gold-300 lg:text-[calc(110*var(--u))]"
              >
                Ce que nous vous offrons
              </motion.h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1, delay: 0.35, ease }}
              className="font-roman leading-[1.15] text-white max-lg:mt-1 max-lg:text-[clamp(1.02rem,3.6vw,1.35rem)] lg:mt-[calc(24*var(--u))] lg:text-[calc(38*var(--u))]"
            >
              Nous mettons le meilleur de nous-mêmes à <br className="hidden lg:block" />
              votre disposition, parce que votre satisfaction est notre récompense.
            </motion.p>
          </div>
          <motion.button
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, delay: 0.5, ease }}
            onClick={() => scrollTo('contact')}
            className="btn shrink-0 rounded-2xl bg-gold-600 px-7 py-3 text-white shadow-[0_14px_30px_-12px_rgb(157_115_38/0.9)] hover:bg-gold-500 lg:mt-[calc(36*var(--u))] lg:h-[calc(95*var(--u))] lg:w-[calc(321*var(--u))] lg:rounded-[calc(24*var(--u))] lg:p-0 lg:text-[calc(32*var(--u))]"
          >
            Nous contacter
          </motion.button>
        </div>

        <div className="h-8 shrink-0 lg:h-auto lg:min-h-4 lg:flex-1" />

        {/* Carte noire : prestations incluses puis options */}
        <div className="relative shrink-0">
          <motion.div
            aria-hidden
            initial={{ x: '-12%', opacity: 0 }}
            whileInView={{ x: '0%', opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.3, ease }}
            className="absolute inset-y-0 -left-8 right-[4%] rounded-r-[2.5rem] bg-[#050505] lg:right-[2.8%] lg:rounded-r-[calc(75*var(--u))]"
          />

          {/* Ordinateur : disposition de la maquette */}
          <div className="relative hidden lg:block lg:h-[calc(577*var(--u))]">
            <h3 className="sr-only">Inclus avec la salle</h3>
            <ul className="absolute left-[10.3%] top-[calc(45*var(--u))] grid w-[80%] grid-cols-5">
              {included.map((item, i) => (
                <Feature key={item.icon} item={item} i={i} size="lg" />
              ))}
            </ul>
            <h3 className="absolute left-[10.6%] top-[calc(262*var(--u))] text-[calc(30*var(--u))] font-bold text-white">
              En option
            </h3>
            <ul className="absolute left-[8%] top-[calc(325*var(--u))] grid w-[85%] grid-cols-6">
              {options.map((item, i) => (
                <Feature key={item.icon} item={item} i={i + 5} size="sm" />
              ))}
            </ul>
          </div>

          {/* Téléphone et tablette : bandeau qui défile sur le côté */}
          <div ref={trackRef} className="relative overflow-hidden py-7 [@media(max-height:720px)]:py-4 lg:hidden">
            <motion.div ref={railRef} style={{ x }} className="w-max space-y-6 pl-[var(--gutter)] [@media(max-height:720px)]:space-y-3 pr-[calc(var(--gutter)+4%)]">
              <ul className="flex">
                {included.map((item, i) => (
                  <Feature key={item.icon} item={item} i={i} size="lg" className="w-[34vw] shrink-0 sm:w-[24vw]" />
                ))}
              </ul>
              <p className="font-bold text-white">En option</p>
              <ul className="flex">
                {options.map((item, i) => (
                  <Feature key={item.icon} item={item} i={i} size="sm" className="w-[34vw] shrink-0 sm:w-[24vw]" />
                ))}
              </ul>
            </motion.div>
          </div>
          {travel > 0 && (
            <div aria-hidden className="relative mx-[var(--gutter)] mb-1 mt-0 h-0.5 overflow-hidden rounded-full bg-white/10 lg:hidden">
              <motion.div style={{ width: bar }} className="h-full bg-gold-300" />
            </div>
          )}
        </div>

        <div className="h-2 shrink-0 lg:h-[calc(117*var(--u))]" />
      </motion.div>
    </section>
  )
})
