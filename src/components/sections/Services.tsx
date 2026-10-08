import {
  AnimatePresence,
  motion,
  useAnimate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState, type CSSProperties } from 'react'
import branche from '@/assets/img/branche-doree.webp'
import { Highlight } from '@/components/ui/Highlight'
import { EASE } from '@/lib/animation'
import { services, type Service } from '@/content/services'
import { useDefileur, useZoneEtapes } from '@/lib/defileur'
import { allerALEtape, enCoursDePas, hautDansDocument, type Arret } from '@/lib/steps'

const NOMBRE = services.length

/**
 * Forme du cadre photo, relevée point par point sur la maquette « section3 » :
 * grand arrondi en haut à gauche, bord supérieur qui descend vers la droite,
 * arrondis plus serrés en bas. Coordonnées relatives (0 à 1).
 */
const FORME_CADRE =
  'M0,0.24 A0.2,0.24 0 0 1 0.2,0.008 L0.48,0 L0.86,0.07 C0.95,0.087 1,0.16 1,0.24 L1,0.8 A0.17,0.2 0 0 1 0.83,1 L0.17,1 A0.17,0.22 0 0 1 0,0.78 Z'

/** Dimensions du cadre sur ordinateur (proportions de la maquette : 600 × 532). */
const VARIABLES_CADRE = {
  '--fh': 'min(40.3vw, 68svh)',
  '--fw': 'calc(var(--fh) * 1.128)',
} as CSSProperties

const CLASSES_TEXTE =
  'mt-3 max-w-[40rem] text-[clamp(0.9rem,1.38vw,1.7rem)] leading-[1.32] text-ink/90 [@media(max-height:700px)_and_(max-width:1023px)]:hidden lg:mt-[min(2.6svh,1.6vw)] lg:text-[clamp(0.9rem,min(1.38vw,2.4svh),1.7rem)]'

const VARIANTES_TEXTE = {
  cache: { opacity: 0, y: 14, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, delay: 0.3, ease: EASE } },
  sortie: { opacity: 0, transition: { duration: 0.3 } },
}

/** Bloc titre + texte d'un service (affiché, ou invisible pour réserver la place). */
function TexteService({ service, anime }: { service: Service; anime: boolean }) {
  // La copie invisible ne doit pas compter comme un titre de plus dans la page.
  const Titre = anime ? 'h2' : 'div'
  return (
    <>
      <Titre className="text-[clamp(1.3rem,2.6vw,3.2rem)] leading-[1.18] font-bold text-ink lg:text-[clamp(1.3rem,min(2.6vw,4.4svh),3.2rem)]">
        {service.titre.map((ligne, rang) => (
          <span
            key={ligne}
            className="block overflow-hidden pb-[0.06em]"
            style={{ paddingLeft: `${service.retraits[rang] ?? 0}em` }}
          >
            {anime ? (
              <motion.span
                className="block"
                variants={{
                  cache: (sens: number) => ({ y: sens > 0 ? '110%' : '-110%' }),
                  visible: { y: '0%', transition: { duration: 0.8, delay: 0.08 + rang * 0.08, ease: EASE } },
                  sortie: (sens: number) => ({
                    y: sens > 0 ? '-110%' : '110%',
                    transition: { duration: 0.4, ease: [0.4, 0, 1, 1] },
                  }),
                }}
              >
                <Highlight texte={ligne} />
              </motion.span>
            ) : (
              <span className="block">
                <Highlight texte={ligne} />
              </span>
            )}
          </span>
        ))}
      </Titre>
      {anime ? (
        <motion.p variants={VARIANTES_TEXTE} className={CLASSES_TEXTE}>
          {service.texte}
        </motion.p>
      ) : (
        <p className={CLASSES_TEXTE}>{service.texte}</p>
      )}
    </>
  )
}

/**
 * Section épinglée : un cran de molette (ou un glissé) = un service.
 * La branche dorée et les deux boutons restent en place ; le reste change.
 * Un dernier cran mène directement à la galerie.
 */
export function Services() {
  const ref = useRef<HTMLElement>(null)
  const defileur = useDefileur()
  const reduit = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [sens, setSens] = useState(1)
  const indexRef = useRef(0)
  const [plante, animerPlante] = useAnimate<HTMLDivElement>()

  const afficher = (cible: number) => {
    const borne = Math.max(0, Math.min(NOMBRE - 1, cible))
    if (borne === indexRef.current) return
    const nouveauSens = borne > indexRef.current ? 1 : -1
    setSens(nouveauSens)
    indexRef.current = borne
    setIndex(borne)
    // Une rafale de vent plus forte secoue la branche à chaque changement de service.
    if (!reduit && plante.current) {
      void animerPlante(
        plante.current,
        { rotate: [0, -6 * nouveauSens, 3.5 * nouveauSens, -1.8 * nouveauSens, 0.8 * nouveauSens, 0] },
        { duration: 2.2, ease: 'easeOut' },
      )
    }
  }

  useZoneEtapes({
    id: 'services',
    arrets: () => {
      const section = ref.current
      if (!section) return []
      const haut = hautDansDocument(section)
      const course = section.offsetHeight - window.innerHeight
      const arrets: Arret[] = services.map((_, rang) => ({ y: haut + (course * rang) / (NOMBRE - 1) }))
      // Dernier arrêt : le haut de la section suivante (la galerie), en un cran.
      const suivante = section.nextElementSibling
      if (suivante) arrets.push({ y: hautDansDocument(suivante) })
      return arrets
    },
    surEtape: afficher,
  })

  // Barre de défilement, clavier natif, lien d'ancre : on suit aussi la position brute.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (progression) => {
    if (!enCoursDePas()) afficher(Math.round(Math.min(1, Math.max(0, progression)) * (NOMBRE - 1)))
  })
  const hauteurProgression = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  const allerA = (cible: number) => {
    if (cible < 0 || cible >= NOMBRE || cible === indexRef.current) return
    allerALEtape(defileur.lenis(), 'services', cible)
  }

  const service = services[index] ?? services[0]
  if (!service) return null

  return (
    <section
      id="services"
      ref={ref}
      data-theme="clair"
      aria-label="Nos services"
      className="relative bg-cream"
      style={{ height: `${NOMBRE * 100}svh` }}
    >
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="forme-cadre" clipPathUnits="objectBoundingBox">
            <path d={FORME_CADRE} />
          </clipPath>
        </defs>
      </svg>

      <div className="sticky top-0 h-[100svh] overflow-hidden" style={VARIABLES_CADRE}>
        {/* La branche dorée : fixe, secouée par le vent */}
        <div
          ref={plante}
          aria-hidden="true"
          className="pointer-events-none absolute top-[calc(var(--header-h)-0.5rem)] right-[-1.5rem] z-20 w-24 origin-[92%_96%] sm:w-36 lg:top-[calc(var(--header-h)-2.2rem)] lg:right-0 lg:w-[15vw] lg:max-w-[17rem]"
        >
          <motion.div
            data-reveal
            initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: EASE }}
            className="origin-[92%_96%]"
          >
            <img src={branche} alt="" loading="lazy" className="w-full origin-[92%_96%] animate-wind" />
          </motion.div>
        </div>

        <div className="flex h-full flex-col justify-center gap-4 page-x pt-[calc(var(--header-h)+0.25rem)] pb-5 lg:grid lg:grid-cols-[var(--fw)_minmax(0,1fr)] lg:items-center lg:gap-[3.4vw] lg:pt-[calc(var(--header-h)*0.55)] lg:pb-0">
          {/* Visuel */}
          <div className="relative h-[min(30svh,calc((100vw-2*var(--gutter))/1.5))] w-full drop-shadow-[0_26px_34px_rgb(0_0_0/0.22)] sm:h-[min(36svh,calc((100vw-2*var(--gutter))/1.6))] lg:h-[var(--fh)] lg:w-[var(--fw)]">
            <div className="relative h-full w-full overflow-hidden bg-white" style={{ clipPath: 'url(#forme-cadre)' }}>
              <AnimatePresence initial={false} custom={sens}>
                <motion.img
                  key={service.cle}
                  src={service.image}
                  alt={service.descriptionImage}
                  loading="lazy"
                  custom={sens}
                  variants={{
                    entree: (s: number) => ({
                      clipPath: s > 0 ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)',
                      scale: 1.25,
                    }),
                    centre: { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, zIndex: 2 },
                    sortie: (s: number) => ({ scale: 0.92, y: s > 0 ? '-6%' : '6%', opacity: 0.4, zIndex: 1 }),
                  }}
                  initial="entree"
                  animate="centre"
                  exit="sortie"
                  transition={{ duration: 1.15, ease: EASE }}
                  className={`absolute inset-0 h-full w-full ${
                    service.cadrage === 'contain' ? 'object-contain px-[14%] pt-[6%] pb-[22%]' : 'object-cover'
                  }`}
                />
              </AnimatePresence>

              {/* Légende : verre dépoli teinté par la photo, flèches de navigation */}
              <div className="absolute bottom-0 left-[1.2%] z-10 flex w-[66%] items-center justify-between gap-1 rounded-[999px_999px_2.5rem_0] bg-gradient-to-r from-black/30 via-black/15 to-black/5 px-[3%] pt-[3.5%] pb-[4.5%] text-white backdrop-blur-md backdrop-saturate-150">
                <button
                  type="button"
                  onClick={() => allerA(index - 1)}
                  disabled={index === 0}
                  aria-label="Service précédent"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full transition hover:bg-white/20 disabled:opacity-30 lg:h-12 lg:w-12"
                >
                  <ChevronLeft className="h-7 w-7 lg:h-10 lg:w-10" strokeWidth={2.4} />
                </button>
                <div className="min-w-0 flex-1 text-center" aria-live="polite">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={service.cle}
                      initial={{ opacity: 0, y: 12 * sens }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 * sens }}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      <p className="text-[clamp(0.9rem,1.7vw,1.9rem)] leading-tight font-bold tracking-[0.1em]">
                        {service.legende}
                      </p>
                      {service.sousLegende.map((ligne) => (
                        <p
                          key={ligne}
                          className="text-[clamp(0.62rem,1.1vw,1.15rem)] leading-snug tracking-[0.06em] text-white/95"
                        >
                          {ligne}
                        </p>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <button
                  type="button"
                  onClick={() => allerA(index + 1)}
                  disabled={index === NOMBRE - 1}
                  aria-label="Service suivant"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full transition hover:bg-white/20 disabled:opacity-30 lg:h-12 lg:w-12"
                >
                  <ChevronRight className="h-7 w-7 lg:h-10 lg:w-10" strokeWidth={2.4} />
                </button>
              </div>
            </div>
          </div>

          {/* Texte, liste et boutons */}
          <div className="relative flex min-h-0 flex-col">
            <span className="eyebrow self-start">Nos services</span>

            {/*
              Sur ordinateur, les textes de tous les services sont superposés de
              façon invisible : le bloc prend la hauteur du plus long. Le texte
              ne passe donc jamais sous la liste, et les deux boutons ne bougent
              pas d'un service à l'autre.
            */}
            <div className="relative mt-3 min-h-0 flex-1 lg:mt-[min(2.6svh,1.6vw)] lg:grid lg:flex-none">
              <div aria-hidden="true" className="invisible hidden lg:col-start-1 lg:row-start-1 lg:grid">
                {services.map((autre) => (
                  <div key={autre.cle} className="col-start-1 row-start-1">
                    <TexteService service={autre} anime={false} />
                  </div>
                ))}
              </div>
              <div className="lg:col-start-1 lg:row-start-1">
                <AnimatePresence mode="wait" initial={false} custom={sens}>
                  <motion.div key={service.cle} custom={sens} initial="cache" animate="visible" exit="sortie">
                    <TexteService service={service} anime />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-3 flex items-stretch gap-3 lg:mt-[min(3.6svh,2.2vw)] lg:items-center lg:gap-[1.7vw]">
              {/* Liste à puces : change avec le service */}
              <div className="relative h-[8.2rem] min-w-0 flex-1 overflow-hidden rounded-xl lg:h-[clamp(9.5rem,min(14.2vw,24svh),17rem)] lg:w-[clamp(15rem,min(20.5vw,36svh),25rem)] lg:flex-none">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={service.cle}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: EASE }}
                    className="absolute inset-0"
                  >
                    <img
                      src={service.fondListe}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#2b2b2b]/75" />
                    <ul className="relative flex h-full flex-col justify-center gap-[0.55em] px-4 py-3 lg:px-[1.4vw]">
                      {service.points.map((point, rang) => (
                        <motion.li
                          key={point}
                          initial={{ opacity: 0, x: -14 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.35 + rang * 0.07, ease: EASE }}
                          className="flex items-start gap-2.5 text-[0.72rem] leading-[1.2] font-bold text-white lg:gap-[0.9vw] lg:text-[clamp(0.72rem,min(1.05vw,1.85svh),1.2rem)]"
                        >
                          <span className="mt-[0.3em] h-[0.6em] w-[0.6em] shrink-0 rounded-full bg-white" />
                          {point}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Les deux boutons : fixes */}
              <div className="flex w-[42%] shrink-0 flex-col justify-center gap-3 lg:w-[clamp(12rem,min(18.6vw,33svh),22rem)] lg:gap-[min(1.6vw,2.8svh)]">
                <button
                  type="button"
                  onClick={() => defileur.allerA('galerie')}
                  className="btn min-h-12 rounded-2xl bg-black px-3 text-[0.95rem] text-white hover:shadow-[0_14px_30px_-12px_rgb(0_0_0/0.6)] lg:h-[clamp(3.2rem,min(5.5vw,9.6svh),5.6rem)] lg:rounded-[clamp(0.9rem,1.25vw,1.2rem)] lg:text-[clamp(1rem,min(1.75vw,3.1svh),1.9rem)]"
                >
                  Voir la galerie
                </button>
                <button
                  type="button"
                  onClick={() => defileur.allerA('contact')}
                  className="btn min-h-12 rounded-2xl bg-gold-600 px-3 text-[0.95rem] text-white hover:bg-gold-500 hover:shadow-[0_14px_30px_-12px_rgb(157_115_38/0.9)] lg:h-[clamp(3.2rem,min(5.5vw,9.6svh),5.6rem)] lg:rounded-[clamp(0.9rem,1.25vw,1.2rem)] lg:text-[clamp(1rem,min(1.75vw,3.1svh),1.9rem)]"
                >
                  Nous contacter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Repères de progression, discrets, au bord droit */}
        <nav
          aria-label="Services"
          className="absolute top-[62%] right-3 z-20 hidden -translate-y-1/2 flex-col items-end gap-3 xl:flex"
        >
          <div className="absolute top-1 right-[5px] h-[calc(100%-0.5rem)] w-px bg-ink/10">
            <motion.div style={{ height: hauteurProgression }} className="w-px bg-gold-600" />
          </div>
          {services.map((autre, rang) => (
            <button
              key={autre.cle}
              type="button"
              onClick={() => allerA(rang)}
              aria-label={autre.legende}
              aria-current={rang === index ? 'step' : undefined}
              className="group relative flex items-center gap-3"
            >
              <span className="pointer-events-none absolute right-6 translate-x-2 rounded-full bg-cream/90 px-2 py-0.5 text-xs tracking-[0.06em] whitespace-nowrap text-gold-700 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                {autre.legende}
              </span>
              <span
                className={`relative h-[11px] w-[11px] rounded-full border transition-all duration-500 ${
                  rang === index
                    ? 'scale-110 border-gold-600 bg-gold-600'
                    : 'border-ink/30 bg-cream group-hover:border-gold-600'
                }`}
              />
            </button>
          ))}
        </nav>
      </div>
    </section>
  )
}
