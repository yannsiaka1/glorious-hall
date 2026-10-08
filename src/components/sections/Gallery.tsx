import { AnimatePresence, LayoutGroup, motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { ChevronRight, Play } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Lightbox } from '@/components/ui/Lightbox'
import { LogoScene } from '@/components/ui/LogoScene'
import { EASE } from '@/lib/animation'
import { filtresGalerie, galerie, type FiltreGalerie, type VideoGalerie } from '@/content/videos'
import { cn } from '@/lib/cn'
import { arreter, lire, preparerVideoMuette } from '@/lib/media'
import { useZoneEtapes } from '@/lib/defileur'
import { hautDansDocument } from '@/lib/steps'

/** Temps laissé pour découvrir la galerie avant que le cran suivant ne l'efface (ms). */
const PAUSE_ARRIVEE = 900
/** Nombre de vignettes affichées pour un filtre. */
const VIGNETTES = 5

const nombreParCategorie = galerie.reduce<Record<string, number>>((total, video) => {
  total[video.categorie] = (total[video.categorie] ?? 0) + 1
  return total
}, {})

type VignetteProps = {
  video: VideoGalerie
  grande: boolean
  /** Aperçu animé en continu (grande vignette, galerie à l'écran). */
  enContinu: boolean
  onOuvrir: () => void
}

/** Vignette vidéo : affiche fixe, aperçu animé au survol (ou en continu pour la grande). */
function Vignette({ video, grande, enContinu, onOuvrir }: VignetteProps) {
  const apercu = useRef<HTMLVideoElement>(null)
  const [survol, setSurvol] = useState(false)
  const enLecture = enContinu || survol

  useEffect(() => {
    if (apercu.current) preparerVideoMuette(apercu.current)
  }, [])

  useEffect(() => {
    const element = apercu.current
    if (!element) return
    if (enLecture) lire(element)
    else arreter(element)
  }, [enLecture])

  return (
    <button
      type="button"
      onClick={onOuvrir}
      onMouseEnter={() => setSurvol(true)}
      onMouseLeave={() => setSurvol(false)}
      onFocus={() => setSurvol(true)}
      onBlur={() => setSurvol(false)}
      aria-label={`Lire la vidéo : ${video.titre}`}
      className="group relative h-full w-full overflow-hidden rounded-[1.4rem] text-left lg:rounded-[1.8rem]"
    >
      <img
        src={grande ? video.affiche : video.afficheReduite}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-(--ease-lux) group-hover:scale-110"
      />
      {/* oxlint-disable-next-line jsx-a11y/media-has-caption -- aperçu muet de 6 secondes, sans paroles */}
      <video
        ref={apercu}
        src={video.apercu}
        loop
        playsInline
        preload="none"
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-(--ease-lux) group-hover:scale-110',
          enLecture ? 'opacity-100' : 'opacity-0',
        )}
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-black/35 text-white opacity-0 backdrop-blur-sm transition duration-500 group-hover:opacity-100 lg:h-11 lg:w-11">
        <Play className="ml-0.5 h-4 w-4 fill-current" />
      </span>
      <span
        className={cn(
          'absolute bottom-0 left-0 rounded-[0_999px_999px_0] bg-gradient-to-r from-black/30 via-black/15 to-black/0 text-white backdrop-blur-md backdrop-saturate-150 transition-transform duration-500 ease-(--ease-lux) group-hover:-translate-y-1',
          grande ? 'px-[7%] pt-[3.5%] pb-[5%] lg:min-w-[55%]' : 'px-4 pt-2 pb-2.5 lg:min-w-[62%]',
        )}
      >
        <span
          className={cn(
            'block font-bold tracking-[0.1em]',
            grande ? 'text-[clamp(1.1rem,2vw,1.9rem)]' : 'text-[clamp(0.78rem,1.1vw,1.05rem)]',
          )}
        >
          {video.categorie}
        </span>
        <span
          className={cn(
            'flex items-center gap-1 tracking-[0.08em]',
            grande ? 'text-[clamp(0.75rem,1.15vw,1.1rem)]' : 'text-[clamp(0.62rem,0.85vw,0.8rem)]',
          )}
        >
          {nombreParCategorie[video.categorie]} VIDÉOS
          <ChevronRight className="h-[1.1em] w-[1.1em] transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </span>
    </button>
  )
}

/**
 * Galerie épinglée, en trois crans :
 * 1. arrivée : la galerie remplit l'écran, nette ; une courte pause laisse le
 *    temps de la découvrir avant que le cran suivant ne puisse l'effacer ;
 * 2. le contenu s'efface et laisse le logo animé seul à l'écran ;
 * 3. on passe à la section suivante.
 */
export function Gallery() {
  const ref = useRef<HTMLElement>(null)
  const [filtre, setFiltre] = useState<FiltreGalerie>('Tous')
  const [ouverte, setOuverte] = useState<number | null>(null)
  const [aLEcran, setALEcran] = useState(false)
  const [fondSeul, setFondSeul] = useState(false)

  useZoneEtapes({
    id: 'galerie',
    arrets: () => {
      const section = ref.current
      if (!section) return []
      const haut = hautDansDocument(section)
      const suivante = section.nextElementSibling
      return [
        { y: haut, pause: PAUSE_ARRIVEE },
        { y: haut + section.offsetHeight - window.innerHeight },
        ...(suivante ? [{ y: hautDansDocument(suivante) }] : []),
      ]
    },
  })

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const { scrollYProgress: approche } = useScroll({ target: ref, offset: ['start end', 'start start'] })
  const arrondi = useTransform(approche, [0.7, 1], ['9rem', '0rem'])
  const opaciteContenu = useTransform(scrollYProgress, [0.1, 0.6], [1, 0])
  const decalageContenu = useTransform(scrollYProgress, [0.1, 0.6], [0, -60])
  const flouContenu = useTransform(scrollYProgress, [0.1, 0.6], ['blur(0px)', 'blur(12px)'])
  const clicsContenu = useTransform(scrollYProgress, (p) => (p > 0.35 ? 'none' : 'auto'))
  const voile = useTransform(scrollYProgress, [0.1, 0.7], [0.72, 0])
  const echelleFond = useTransform(scrollYProgress, [0, 1], [1.06, 1])

  // Le logo se révèle quand le contenu s'efface, et se rejoue à chaque passage.
  useMotionValueEvent(scrollYProgress, 'change', (progression) => {
    setFondSeul((avant) => (progression > 0.55 ? true : progression < 0.2 ? false : avant))
  })

  useEffect(() => {
    const section = ref.current
    if (!section) return
    const observateur = new IntersectionObserver(([entree]) => setALEcran(entree?.isIntersecting ?? false), {
      threshold: 0.15,
    })
    observateur.observe(section)
    return () => observateur.disconnect()
  }, [])

  const videos = useMemo(
    () => (filtre === 'Tous' ? galerie : galerie.filter((video) => video.categorie === filtre)),
    [filtre],
  )
  const vignettes = videos.slice(0, VIGNETTES)

  return (
    <section
      id="galerie"
      ref={ref}
      data-theme="sombre"
      aria-labelledby="galerie-titre"
      className="relative bg-cream"
      style={{ height: '200svh' }}
    >
      <motion.div
        style={{ borderTopLeftRadius: arrondi, borderTopRightRadius: arrondi }}
        className="sticky top-0 h-[100svh] overflow-hidden bg-black"
      >
        {/* Fond : logo animé */}
        <motion.div style={{ scale: echelleFond }} className="absolute inset-0">
          <LogoScene actif={fondSeul} />
          <motion.div aria-hidden="true" style={{ opacity: voile }} className="absolute inset-0 bg-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgb(0_0_0/0.7)_100%)]" />
        </motion.div>

        {/* Contenu : remplit l'écran sous l'en-tête */}
        <motion.div
          style={{ opacity: opaciteContenu, y: decalageContenu, filter: flouContenu, pointerEvents: clicsContenu }}
          className="relative flex h-full flex-col page-x pt-[calc(var(--header-h)+0.25rem)] pb-[max(1.25rem,3svh)]"
        >
          <div className="lg:pl-[10vw]">
            <motion.span
              data-reveal
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
              className="eyebrow !text-gold-300 normal-case"
            >
              Galerie
            </motion.span>
            <motion.h2
              id="galerie-titre"
              data-reveal
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.1, ease: EASE }}
              className="mt-2 text-[clamp(1.55rem,min(2.9vw,5svh),2.9rem)] font-bold tracking-[0.03em] text-white lg:pl-[1.5vw]"
            >
              Nos dernières <span className="text-gold-300">réalisations.</span>
            </motion.h2>
          </div>

          <div
            role="tablist"
            aria-label="Filtrer la galerie"
            data-lenis-prevent-horizontal
            className="mt-[clamp(1rem,2.4svh,1.6rem)] flex shrink-0 [scrollbar-width:none] gap-2.5 overflow-x-auto pb-1 sm:gap-4 lg:gap-[2.9vw]"
          >
            {filtresGalerie.map((nom, rang) => (
              <motion.button
                key={nom}
                type="button"
                role="tab"
                aria-selected={filtre === nom}
                data-reveal
                onClick={() => setFiltre(nom)}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + rang * 0.06, ease: EASE }}
                className={cn(
                  'relative shrink-0 rounded-full border-2 px-5 py-1.5 text-sm transition-colors duration-300 lg:min-w-[13vw] lg:py-[0.55vw] lg:text-[clamp(0.85rem,1.2vw,1.1rem)]',
                  nom === 'Tous' && 'lg:min-w-[6.5vw]',
                  filtre === nom
                    ? 'border-white text-ink'
                    : 'border-gold-300/80 text-white hover:border-gold-300 hover:text-gold-300',
                )}
              >
                {filtre === nom && (
                  <motion.span
                    layoutId="pastille-filtre"
                    className="absolute inset-0 rounded-full bg-white"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{nom}</span>
              </motion.button>
            ))}
          </div>

          <LayoutGroup>
            <motion.ul
              layout
              className="mt-[clamp(1rem,3svh,2rem)] grid min-h-0 flex-1 grid-cols-2 grid-rows-[1.25fr_1fr_1fr] gap-2.5 sm:gap-4 lg:grid-cols-[1.97fr_1fr_1fr] lg:grid-rows-2 lg:gap-[2.6vw]"
            >
              <AnimatePresence mode="popLayout">
                {vignettes.map((video, rang) => (
                  <motion.li
                    layout
                    key={video.slug}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className={cn('min-h-0', rang === 0 && 'col-span-2 lg:col-span-1 lg:row-span-2')}
                  >
                    <Vignette
                      video={video}
                      grande={rang === 0}
                      enContinu={rang === 0 && aLEcran && !fondSeul}
                      onOuvrir={() => setOuverte(videos.indexOf(video))}
                    />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </LayoutGroup>
        </motion.div>
      </motion.div>
      <Lightbox videos={videos} index={ouverte} onChange={setOuverte} />
    </section>
  )
}
