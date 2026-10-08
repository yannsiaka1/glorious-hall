import { mdiFormatQuoteClose } from '@mdi/js'
import { AnimatePresence, motion, type PanInfo } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { MaskLine, Reveal } from '@/components/ui/Reveal'
import { avis } from '@/content/avis'
import { EASE, EASE_DEVOILEMENT } from '@/lib/animation'
import { cn } from '@/lib/cn'

/** Délai entre deux avis en lecture automatique (ms). */
const ROTATION_MS = 7000
/** Distance (px) ou vitesse (px/s) de glissé qui fait changer d'avis. */
const SEUIL_GLISSE = 60
const SEUIL_VITESSE = 400

/**
 * « Leurs avis » : occupe au moins tout l'écran. Bandeau sombre en haut (coin
 * bas gauche très arrondi, comme la maquette « section_avis »), puis l'avis.
 *
 * Navigation : flèches, pastilles (flèches du clavier dans la liste des
 * pastilles), glissé au doigt ou à la souris. La lecture automatique s'arrête
 * au survol, au focus et dès qu'on navigue soi-même (recommandation WAI-ARIA
 * pour les carrousels).
 */
export function Testimonials() {
  const [index, setIndex] = useState(0)
  const [sens, setSens] = useState(1)
  const [enPause, setEnPause] = useState(false)
  const carrousel = useRef<HTMLElement>(null)
  const nombre = avis.length
  const plusieurs = nombre > 1
  const courant = avis[index] ?? avis[0]

  const aller = useCallback(
    (cible: number, manuel = true) => {
      setSens(cible > index || (index === nombre - 1 && cible === 0) ? 1 : -1)
      setIndex(((cible % nombre) + nombre) % nombre)
      if (manuel) setEnPause(true)
    },
    [index, nombre],
  )

  useEffect(() => {
    if (!plusieurs || enPause) return
    const minuterie = window.setTimeout(() => aller(index + 1, false), ROTATION_MS)
    return () => window.clearTimeout(minuterie)
  }, [plusieurs, enPause, index, aller])

  // Survol ou focus dans le carrousel : la lecture automatique s'arrête.
  useEffect(() => {
    const element = carrousel.current
    if (!element) return
    const pause = () => setEnPause(true)
    element.addEventListener('pointerenter', pause)
    element.addEventListener('focusin', pause)
    return () => {
      element.removeEventListener('pointerenter', pause)
      element.removeEventListener('focusin', pause)
    }
  }, [])

  // Flèches gauche / droite dans la liste des pastilles (une seule pastille dans l'ordre de tabulation).
  const surToucheListe = (evenement: KeyboardEvent<HTMLButtonElement>) => {
    if (evenement.key === 'ArrowRight') aller(index + 1)
    if (evenement.key === 'ArrowLeft') aller(index - 1)
  }

  const surFinDeGlisse = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SEUIL_GLISSE || info.velocity.x < -SEUIL_VITESSE) aller(index + 1)
    else if (info.offset.x > SEUIL_GLISSE || info.velocity.x > SEUIL_VITESSE) aller(index - 1)
  }

  if (!courant) return null

  return (
    <section
      id="avis"
      data-theme="clair"
      aria-labelledby="avis-titre"
      className="flex min-h-[100svh] flex-col bg-cream pb-16 lg:pb-[5vw]"
    >
      {/* Bandeau sombre : s'ouvre de gauche à droite */}
      <motion.div initial="cache" whileInView="visible" viewport={{ once: true, margin: '0px 0px -10% 0px' }}>
        <motion.div
          data-reveal
          variants={{ cache: { clipPath: 'inset(0 100% 0 0)' }, visible: { clipPath: 'inset(0 0% 0 0)' } }}
          transition={{ duration: 1.4, ease: EASE_DEVOILEMENT }}
          className="w-[94%] rounded-bl-[5rem] bg-[linear-gradient(90deg,#000_0%,#0d0d0c_62%,#2e2d2b_76%,#8d8a85_90%,var(--color-cream)_100%)] pt-[calc(var(--header-h)+0.5rem)] pr-6 pb-9 pl-[var(--gutter)] sm:rounded-bl-[7rem] lg:w-[54vw] lg:rounded-bl-[15vw] lg:bg-[linear-gradient(90deg,#000_0%,#0d0d0c_49%,#2e2d2b_60%,#8d8a85_75%,var(--color-cream)_90%)] lg:pt-[calc(var(--header-h)+1vw)] lg:pb-[3vw]"
        >
          <span className="eyebrow !text-gold-300 lg:!text-[clamp(0.9rem,1.45vw,1.3rem)]">Leurs avis</span>
          <h2
            id="avis-titre"
            className="mt-3 text-[clamp(1.6rem,7.4vw,2.2rem)] leading-[1.15] font-bold text-white sm:text-[clamp(1.6rem,3.2vw,3.1rem)] lg:mt-[0.9vw] lg:ml-[1.7vw]"
          >
            <MaskLine delai={0.4}>Ils nous ont fait</MaskLine>
            <MaskLine delai={0.5} className="lg:-mt-[0.1em]">
              <span className="text-gold-600">confiance</span>
              <span className="text-gold-300">.</span>
            </MaskLine>
          </h2>
        </motion.div>
      </motion.div>

      <div className="flex flex-1 flex-col justify-center page-x pt-12 lg:pt-[3vw]">
        <div className="mx-auto w-full max-w-[62rem] lg:mr-0 lg:ml-[24.4vw] lg:max-w-[58.4vw]">
          <Reveal>
            <p className="text-center font-roman text-[clamp(0.9rem,1.35vw,1.25rem)] tracking-[0.08em] text-gold-500 uppercase lg:mr-[7vw]">
              Ce qu’ils disent
            </p>
          </Reveal>

          <section
            ref={carrousel}
            aria-roledescription="carrousel"
            aria-label="Avis de nos clients"
            data-lenis-prevent-horizontal
            className="relative mt-5 lg:mt-[2.2vw]"
          >
            <motion.svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              data-reveal
              initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.2 }}
              className="mb-2 h-14 w-14 fill-gold-300 lg:absolute lg:-top-[2.2vw] lg:-left-[7.4vw] lg:mb-0 lg:h-[7vw] lg:w-[7vw]"
            >
              <path d={mdiFormatQuoteClose} />
            </motion.svg>

            <div aria-live={enPause ? 'polite' : 'off'} className="grid">
              <AnimatePresence mode="popLayout" initial={false} custom={sens}>
                <motion.figure
                  key={index}
                  custom={sens}
                  drag={plusieurs ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragEnd={surFinDeGlisse}
                  variants={{
                    entree: (s: number) => ({ opacity: 0, x: s * 60, filter: 'blur(6px)' }),
                    centre: { opacity: 1, x: 0, filter: 'blur(0px)' },
                    sortie: (s: number) => ({ opacity: 0, x: s * -60, filter: 'blur(6px)' }),
                  }}
                  initial="entree"
                  animate="centre"
                  exit="sortie"
                  transition={{ duration: 0.7, ease: EASE }}
                  className="col-start-1 row-start-1 cursor-grab touch-pan-y active:cursor-grabbing"
                >
                  <blockquote className="font-roman text-[clamp(1.15rem,1.96vw,1.85rem)] leading-[1.32] text-ink select-none">
                    “{courant.citation}”
                  </blockquote>
                  <figcaption className="mt-4 text-center lg:mt-[0.8vw] lg:mr-[7vw]">
                    <span className="mx-auto block h-px w-24 bg-gold-300 lg:w-[9.5vw]" />
                    <span className="mt-4 block font-roman text-[clamp(0.95rem,1.4vw,1.3rem)] tracking-[0.08em] text-ink uppercase lg:mt-[1.6vw]">
                      {courant.auteur}
                    </span>
                    <span className="font-roman text-[clamp(0.8rem,1.15vw,1.05rem)] text-ink/70">{courant.source}</span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
          </section>

          {plusieurs && (
            <div className="mt-8 flex items-center justify-center gap-4 lg:mr-[7vw]">
              <button
                type="button"
                onClick={() => aller(index - 1)}
                aria-label="Avis précédent"
                className="grid h-11 w-11 place-items-center rounded-full border border-ink/25 text-ink transition hover:border-gold-600 hover:bg-gold-600 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-2" role="tablist" aria-label="Choisir un avis">
                {avis.map((element, rang) => (
                  <button
                    key={`${element.auteur}-${rang}`}
                    type="button"
                    role="tab"
                    aria-selected={rang === index}
                    aria-label={`Avis ${rang + 1} sur ${nombre}`}
                    tabIndex={rang === index ? 0 : -1}
                    onClick={() => aller(rang)}
                    onKeyDown={surToucheListe}
                    className={cn(
                      'h-2 rounded-full border border-ink/50 transition-all duration-500',
                      rang === index ? 'w-6 bg-ink' : 'w-2 hover:bg-ink/30',
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => aller(index + 1)}
                aria-label="Avis suivant"
                className="grid h-11 w-11 place-items-center rounded-full border border-ink/25 text-ink transition hover:border-gold-600 hover:bg-gold-600 hover:text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
