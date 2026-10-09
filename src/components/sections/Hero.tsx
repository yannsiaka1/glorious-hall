import { motion, useMotionValueEvent, useTransform, type MotionValue } from 'motion/react'
import { Play, Volume2, VolumeX, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { preload } from 'react-dom'
import { Icon } from '@/components/ui/Icon'
import { EASE, EASE_DEVOILEMENT } from '@/lib/animation'
import { atoutsHero } from '@/content/offre'
import { contact } from '@/content/site'
import { heroPaysage, heroPortrait, type Clip } from '@/content/videos'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { arreter, lire, preparerVideoMuette } from '@/lib/media'
import { useDefileur } from '@/lib/defileur'

/** Chronologie du chargement : vidéo, puis ombre de gauche, puis contenu (en secondes). */
const T_OMBRE = 0.55
const T_CONTENU = 1.35
/** Fondu enchaîné entre deux vidéos, en secondes. */
const FONDU = 1.2
/** La vidéo suivante commence à se charger ce nombre de secondes avant la fin de la courante. */
const ANTICIPATION = 8

const AUCUN_CLIP: Clip[] = []

type Liste = 'portrait' | 'paysage'
type Lecture = { liste: Liste | null; index: number; precedent: number | null }

/** Apparition échelonnée des éléments du hero, après l'ombre. */
const apparition = (rang: number) => ({
  initial: { opacity: 0, y: 26, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 1, delay: T_CONTENU + rang * 0.12, ease: EASE },
})

type VideoDeFondProps = {
  clip: Clip
  courante: boolean
  precharger: boolean
  enregistrer: (slug: string, video: HTMLVideoElement | null) => void
  onTimeUpdate: (video: HTMLVideoElement) => void
  onEnded: () => void
}

/** Une vidéo de la liste de lecture. La courante passe devant et apparaît en fondu. */
function VideoDeFond({ clip, courante, precharger, enregistrer, onTimeUpdate, onEnded }: VideoDeFondProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    preparerVideoMuette(video)
    enregistrer(clip.slug, video)
    return () => enregistrer(clip.slug, null)
  }, [clip.slug, enregistrer])

  return (
    // oxlint-disable-next-line jsx-a11y/media-has-caption -- vidéo d'ambiance muette, sans paroles
    <video
      ref={ref}
      src={clip.src}
      poster={clip.affiche}
      playsInline
      preload={courante || precharger ? 'auto' : 'metadata'}
      onLoadedMetadata={(evenement) => {
        if (evenement.currentTarget.currentTime < clip.debut) evenement.currentTarget.currentTime = clip.debut
      }}
      onTimeUpdate={(evenement) => onTimeUpdate(evenement.currentTarget)}
      onEnded={onEnded}
      className="absolute inset-0 h-full w-full object-cover transition-opacity ease-out"
      style={{ opacity: courante ? 1 : 0, zIndex: courante ? 2 : 1, transitionDuration: `${FONDU}s` }}
    />
  )
}

type Props = {
  /** 0 → 1 pendant que la section 2 monte et recouvre le hero. */
  recouvrement: MotionValue<number>
}

/**
 * Section d'ouverture.
 *
 * Au chargement : la vidéo apparaît, l'ombre glisse depuis la gauche, puis le
 * contenu arrive en cascade. Les vidéos se succèdent en fond, floutées :
 * verticales sur un écran en portrait (téléphone), horizontales sinon.
 * Le bouton lecture passe en mode cinéma : le flou s'efface, le son s'active
 * et seuls « L'élégance pour tous vos événements » et « Glorious Hall »
 * restent à l'écran.
 */
export function Hero({ recouvrement }: Props) {
  const defileur = useDefileur()
  const portrait = useMediaQuery('(orientation: portrait)')
  const liste: Liste | null = portrait === null ? null : portrait ? 'portrait' : 'paysage'
  const clips = liste === 'portrait' ? heroPortrait : liste === 'paysage' ? heroPaysage : AUCUN_CLIP

  const [lecture, setLecture] = useState<Lecture>({ liste: null, index: 0, precedent: null })
  // Un changement d'orientation repart de la première vidéo de la nouvelle liste.
  const index = lecture.liste === liste ? lecture.index : 0
  const precedent = lecture.liste === liste ? lecture.precedent : null
  const suivant = clips.length > 0 ? (index + 1) % clips.length : 0
  const courant = clips[index]

  const [anticipe, setAnticipe] = useState<string | null>(null)
  const [cinema, setCinema] = useState(false)
  const [muet, setMuet] = useState(true)
  const videos = useRef(new Map<string, HTMLVideoElement>())
  const recouvert = useRef(false)

  const enregistrer = useCallback((slug: string, video: HTMLVideoElement | null) => {
    if (video) videos.current.set(slug, video)
    else videos.current.delete(slug)
  }, [])

  const aller = useCallback(
    (cible: number) => {
      setLecture((etat) => {
        const depuis = etat.liste === liste ? etat.index : 0
        if (etat.liste === liste && cible === depuis) return etat
        return { liste, index: cible, precedent: depuis }
      })
    },
    [liste],
  )

  // Vidéo courante : repart du début de son passage et se lance.
  useEffect(() => {
    if (!courant) return
    const video = videos.current.get(courant.slug)
    if (!video) return
    if (video.currentTime < courant.debut || video.currentTime >= courant.fin - 0.5) video.currentTime = courant.debut
    if (!recouvert.current) lire(video)
  }, [courant])

  // La vidéo précédente s'arrête une fois le fondu terminé.
  useEffect(() => {
    if (precedent === null) return
    const minuterie = window.setTimeout(
      () => {
        const ancien = clips[precedent]
        const video = ancien ? videos.current.get(ancien.slug) : undefined
        if (video) arreter(video)
        setLecture((etat) => ({ ...etat, precedent: null }))
      },
      FONDU * 1000 + 100,
    )
    return () => window.clearTimeout(minuterie)
  }, [precedent, clips])

  // Le son ne concerne que la vidéo courante.
  useEffect(() => {
    if (!courant) return
    const video = videos.current.get(courant.slug)
    if (video) video.muted = muet
  }, [muet, courant])

  const surTemps = (clip: Clip) => (video: HTMLVideoElement) => {
    if (clip !== courant) return
    if (video.currentTime >= clip.fin - ANTICIPATION && anticipe !== clip.slug) setAnticipe(clip.slug)
    if (video.currentTime >= clip.fin) aller(suivant)
  }

  const entrerCinema = () => {
    setCinema(true)
    setMuet(false)
    // Appelé pendant le clic : la lecture avec le son est autorisée.
    const video = courant ? videos.current.get(courant.slug) : undefined
    if (video) {
      video.muted = false
      lire(video)
    }
  }
  const sortirCinema = useCallback(() => {
    setCinema(false)
    setMuet(true)
  }, [])

  useEffect(() => {
    if (!cinema) return
    const surTouche = (evenement: KeyboardEvent) => {
      if (evenement.key === 'Escape') sortirCinema()
    }
    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  }, [cinema, sortirCinema])

  // Recouvert par la section 2 : on quitte le mode cinéma et on met en pause.
  useMotionValueEvent(recouvrement, 'change', (progression) => {
    if (progression > 0.5 && cinema) sortirCinema()
    const cache = progression > 0.98
    if (cache === recouvert.current) return
    recouvert.current = cache
    const video = courant ? videos.current.get(courant.slug) : undefined
    if (!video) return
    if (cache) arreter(video)
    else lire(video)
  })

  // Pendant le recouvrement, le hero recule légèrement et s'assombrit.
  const echelle = useTransform(recouvrement, [0, 1], [1, 0.94])
  const assombri = useTransform(recouvrement, [0, 1], [0, 0.7])
  const arrondi = useTransform(recouvrement, [0, 1], [56, 80])

  const rendus = [...new Set([precedent, index, suivant])].filter(
    (i): i is number => i !== null && clips[i] !== undefined,
  )
  const premierPortrait = heroPortrait[0]
  const premierPaysage = heroPaysage[0]

  // Affiche de la première vidéo, chargée en priorité, au bon format selon l'écran.
  if (premierPortrait) {
    preload(premierPortrait.affiche, { as: 'image', fetchPriority: 'high', media: '(orientation: portrait)' })
  }
  if (premierPaysage) {
    preload(premierPaysage.affiche, { as: 'image', fetchPriority: 'high', media: '(orientation: landscape)' })
  }

  return (
    <motion.section
      id="accueil"
      data-theme="sombre"
      aria-label="Accueil"
      style={{ scale: echelle, borderBottomLeftRadius: arrondi, borderBottomRightRadius: arrondi }}
      className="sticky top-0 flex h-[100svh] origin-top flex-col overflow-hidden bg-coal"
    >
      {/* Fond : affiche (présente dès le prérendu), puis vidéos floutées, nettes en mode cinéma */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.14 }}
        animate={{ opacity: 1, scale: cinema ? 1 : 1.06, filter: cinema ? 'blur(0px)' : 'blur(3px)' }}
        transition={{
          opacity: { duration: 1.6, ease: EASE },
          scale: { duration: 1.6, ease: EASE },
          filter: { duration: 0.9, ease: EASE },
        }}
      >
        {premierPortrait && premierPaysage && (
          <picture>
            <source media="(orientation: portrait)" srcSet={premierPortrait.affiche} />
            <img
              src={premierPaysage.affiche}
              alt=""
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>
        )}
        {rendus.map((i) => {
          const clip = clips[i]
          if (!clip) return null
          return (
            <VideoDeFond
              key={clip.slug}
              clip={clip}
              courante={i === index}
              precharger={i === suivant && anticipe === courant?.slug}
              enregistrer={enregistrer}
              onTimeUpdate={surTemps(clip)}
              onEnded={() => {
                if (i === index) aller(suivant)
              }}
            />
          )
        })}
      </motion.div>

      {/* L'ombre de gauche glisse en place, puis s'estompe en mode cinéma */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 z-[3] bg-[linear-gradient(90deg,#272725_0%,#272725f5_32%,#272725c4_47%,#27272533_62%,transparent_72%)] max-md:bg-[linear-gradient(180deg,#27272555_0%,#272725bb_42%,#272725f2_70%,#272725_100%)]"
        initial={{ x: '-100%' }}
        animate={{ x: '0%', opacity: cinema ? 0.38 : 1 }}
        transition={{ x: { duration: 1.3, delay: T_OMBRE, ease: EASE }, opacity: { duration: 0.9, ease: EASE } }}
      />
      <motion.div
        aria-hidden="true"
        style={{ opacity: assombri }}
        className="pointer-events-none absolute inset-0 z-[3] bg-black"
      />

      {/*
        Contenu. Les tailles suivent la largeur ET la hauteur de l'écran
        (`min(…vw, …svh)`) : sur un portable où le navigateur laisse peu de
        hauteur, le bloc rétrécit au lieu de déborder. Les marges automatiques
        (plutôt que justify-center) le gardent toujours sous l'en-tête.
      */}
      <div className="relative z-[4] flex min-h-0 flex-1 flex-col page-x pt-[var(--header-h)] pb-6 md:pb-4">
        <div className="mt-auto max-w-[44rem] md:mb-auto">
          <motion.p
            data-reveal
            {...apparition(0)}
            className="font-roman text-[clamp(min(1rem,2.6svh),min(1.35vw,2.6svh),1.3rem)] text-white/90"
          >
            L’élégance pour tous vos événements
          </motion.p>
          <h1>
            <motion.span
              data-reveal
              className="block font-script text-[clamp(min(3.4rem,11svh),min(6.5vw,11svh),6.6rem)] leading-[1.12] text-gold-300 [text-shadow:0_2px_18px_rgb(0_0_0/0.35)]"
              initial={{ clipPath: 'inset(-20% 100% -20% 0)' }}
              animate={{ clipPath: 'inset(-20% 0% -20% 0)' }}
              transition={{ duration: 1.6, delay: T_CONTENU + 0.1, ease: EASE_DEVOILEMENT }}
            >
              Glorious Hall,
            </motion.span>
            <motion.span
              className="block font-roman text-[clamp(min(1.75rem,5.6svh),min(3.5vw,5.6svh),3.35rem)] leading-[1.18] text-white"
              animate={{ opacity: cinema ? 0 : 1, y: cinema ? 14 : 0, filter: cinema ? 'blur(6px)' : 'blur(0px)' }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {['le lieu où vos meilleurs', 'souvenirs prennent vie.'].map((ligne, rang) => (
                <span key={ligne} className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    data-reveal
                    className="block"
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 1.1, delay: T_CONTENU + 0.35 + rang * 0.12, ease: EASE }}
                  >
                    {ligne}
                  </motion.span>
                </span>
              ))}
            </motion.span>
          </h1>

          <motion.div
            animate={{ opacity: cinema ? 0 : 1, y: cinema ? 14 : 0, filter: cinema ? 'blur(6px)' : 'blur(0px)' }}
            transition={{ duration: 0.6, ease: EASE }}
            inert={cinema}
          >
            <motion.p
              data-reveal
              {...apparition(5)}
              className="mt-4 max-w-[34rem] text-[clamp(min(0.82rem,2svh),min(1vw,2svh),0.98rem)] leading-relaxed tracking-[0.12em] text-white/85 md:mt-[min(1rem,2svh)] md:[@media(max-height:660px)]:hidden max-md:[@media(max-height:740px)]:hidden"
            >
              Mariage, séminaire, anniversaire, baptême, réception, gala… Une salle moderne, équipée et raffinée à
              Douala, pensée pour donner vie à des moments inoubliables.
            </motion.p>
            <motion.div
              data-reveal
              {...apparition(6)}
              className="mt-6 flex flex-wrap gap-2.5 sm:mt-7 sm:gap-4 md:mt-[min(1.75rem,3.5svh)]"
            >
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="btn min-h-12 rounded-full bg-white px-5 text-[0.8rem] text-ink hover:shadow-[0_12px_30px_-10px_rgb(224_190_128/0.7)] sm:px-7 sm:text-sm"
              >
                Réserver maintenant
              </a>
              <button
                type="button"
                onClick={() => defileur.allerA('galerie')}
                className="btn min-h-12 rounded-full border border-gold-300/80 px-5 text-[0.8rem] text-white hover:border-gold-300 hover:bg-gold-300 hover:text-ink sm:px-9 sm:text-sm"
              >
                Voir la salle
              </button>
            </motion.div>
          </motion.div>

          {/* Pastilles : une par vidéo de la liste (place réservée dès le prérendu) */}
          <motion.div
            data-reveal
            {...apparition(7)}
            role="tablist"
            aria-label="Choisir une vidéo"
            className="mt-6 flex min-h-2 flex-wrap gap-2 md:mt-[min(1.5rem,3svh)]"
          >
            {clips.map((clip, rang) => (
              <button
                key={clip.slug}
                type="button"
                role="tab"
                aria-selected={rang === index}
                aria-label={clip.titre}
                onClick={() => aller(rang)}
                className={`h-2 rounded-full border border-white/70 transition-all duration-500 ${
                  rang === index ? 'w-7 bg-white' : 'w-2 hover:bg-white/50'
                }`}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bouton lecture (mode cinéma) et réglage du son */}
      <motion.div
        data-reveal
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: T_CONTENU + 0.9, ease: EASE }}
        className="absolute top-[calc(var(--header-h)+0.25rem)] right-[var(--gutter)] z-10 flex items-center gap-3 md:top-[40%] md:right-[7%]"
      >
        {cinema && (
          <motion.button
            type="button"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setMuet((valeur) => !valeur)}
            aria-label={muet ? 'Activer le son' : 'Couper le son'}
            className="grid h-12 w-12 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-white hover:text-ink"
          >
            {muet ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </motion.button>
        )}
        <button
          type="button"
          onClick={cinema ? sortirCinema : entrerCinema}
          aria-label={cinema ? 'Fermer la vidéo' : 'Regarder la vidéo'}
          aria-pressed={cinema}
          className="group relative grid h-16 w-16 place-items-center rounded-full bg-black/35 backdrop-blur-sm md:h-24 md:w-24"
        >
          {!cinema && (
            <span className="absolute inset-0 animate-ping rounded-full bg-white/15 [animation-duration:2.4s]" />
          )}
          <span className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-ink transition-transform duration-500 group-hover:scale-110 md:h-16 md:w-16">
            {cinema ? (
              <X className="h-5 w-5 md:h-6 md:w-6" />
            ) : (
              <Play className="ml-0.5 h-5 w-5 fill-current md:ml-1 md:h-6 md:w-6" />
            )}
          </span>
        </button>
      </motion.div>

      <motion.div
        animate={{ opacity: cinema ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-[62%] right-[5%] z-[4] hidden md:[@media(min-height:521px)]:block"
      >
        <motion.p
          data-reveal
          {...apparition(8)}
          className="text-right text-xs leading-snug font-bold tracking-[0.1em] text-white"
        >
          +100 réservations
          <br />
          depuis le début
        </motion.p>
      </motion.div>

      {/* Barre d'atouts */}
      <motion.div
        data-reveal
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: cinema ? 0 : 1, y: cinema ? 40 : 0 }}
        transition={cinema ? { duration: 0.5, ease: EASE } : { duration: 1.1, delay: T_CONTENU + 0.7, ease: EASE }}
        inert={cinema}
        className="relative z-[4] page-x pb-4 sm:pb-[min(1.5rem,3svh)]"
      >
        <ul className="grid grid-cols-5 gap-1 rounded-[1.6rem] bg-black/70 px-2 py-3 backdrop-blur-md sm:rounded-[2rem] sm:px-8 sm:py-[min(1.25rem,2.4svh)]">
          {atoutsHero.map((atout, rang) => (
            <motion.li
              key={atout.libelle}
              data-reveal
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: T_CONTENU + 0.9 + rang * 0.08, ease: EASE }}
              className="group flex flex-col items-center text-center"
            >
              <Icon
                nom={atout.icone}
                className="h-6 w-6 text-gold-300 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110 sm:h-[min(2.75rem,6svh)] sm:w-[min(2.75rem,6svh)]"
              />
              <span className="mt-1.5 text-[0.62rem] leading-tight font-bold tracking-[0.06em] text-gold-300 sm:mt-[min(0.5rem,1svh)] sm:text-[min(1.125rem,2.7svh)]">
                {atout.valeur}
              </span>
              <span className="text-[0.58rem] leading-tight tracking-[0.04em] text-gold-200/90 sm:text-[min(1rem,2.4svh)]">
                {atout.libelle}
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.section>
  )
}
