import { AnimatePresence, motion, useMotionValueEvent, useTransform, type MotionValue } from 'motion/react'
import { Play, Volume2, VolumeX, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { contact, heroStats, heroVideos } from '../content'
import { Icon } from '../lib/icons'
import { useScrollTo } from '../lib/scroll'

const ease = [0.22, 1, 0.36, 1] as const
// Chronologie du chargement : vidéo, puis ombre de gauche, puis contenu
const T_SHADOW = 0.55
const T_CONTENT = 1.35
const FADE = 1.2
const N = heroVideos.length

type Props = { coverProgress: MotionValue<number> }

export function Hero({ coverProgress }: Props) {
  const scrollTo = useScrollTo()
  const [index, setIndex] = useState(0)
  const [previous, setPrevious] = useState<number | null>(null)
  const [cinema, setCinema] = useState(false)
  const [muted, setMuted] = useState(true)
  const videos = useRef(new Map<number, HTMLVideoElement>())
  const covered = useRef(false)

  const goTo = useCallback((next: number) => {
    setIndex((current) => {
      if (next === current) return current
      setPrevious(current)
      return next
    })
  }, [])

  // Lecture de la vidéo courante, arrêt de la précédente après le fondu
  useEffect(() => {
    const v = videos.current.get(index)
    if (v) {
      const clip = heroVideos[index]
      if (v.currentTime < clip.debut || v.currentTime >= clip.fin - 0.5) v.currentTime = clip.debut
      v.muted = muted
      if (!covered.current) v.play().catch(() => {})
    }
    if (previous === null) return
    const t = window.setTimeout(() => setPrevious(null), FADE * 1000 + 100)
    return () => window.clearTimeout(t)
    // `muted` est appliqué par son propre effet
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, previous])

  useEffect(() => {
    const v = videos.current.get(index)
    if (v) v.muted = muted
  }, [muted, index])

  const enterCinema = () => {
    setCinema(true)
    setMuted(false)
    const v = videos.current.get(index)
    if (v) {
      v.muted = false
      v.play().catch(() => {})
    }
  }
  const exitCinema = useCallback(() => {
    setCinema(false)
    setMuted(true)
  }, [])

  useEffect(() => {
    if (!cinema) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && exitCinema()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cinema, exitCinema])

  // Recouvert par la section 2 : on coupe le son, on quitte le mode lecture, on met en pause
  useMotionValueEvent(coverProgress, 'change', (p) => {
    if (p > 0.5 && cinema) exitCinema()
    const hide = p > 0.98
    if (hide === covered.current) return
    covered.current = hide
    const v = videos.current.get(index)
    if (!v) return
    if (hide) v.pause()
    else v.play().catch(() => {})
  })

  const scale = useTransform(coverProgress, [0, 1], [1, 0.94])
  const dim = useTransform(coverProgress, [0, 1], [0, 0.7])
  const radius = useTransform(coverProgress, [0, 1], [56, 80])

  const rendered = [...new Set([previous, index, (index + 1) % N].filter((i): i is number => i !== null))]

  const c = (i: number) => ({
    initial: { opacity: 0, y: 26, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: 14, filter: 'blur(8px)', transition: { duration: 0.45, ease } },
    transition: { duration: 1, delay: T_CONTENT + i * 0.12, ease },
  })

  return (
    <motion.section
      id="accueil"
      data-theme="dark"
      aria-label="Accueil"
      style={{ scale, borderBottomLeftRadius: radius, borderBottomRightRadius: radius }}
      className="sticky top-0 flex h-[100svh] origin-top flex-col overflow-hidden bg-coal"
    >
      {/* Vidéos de fond, floutées ; nettes en mode lecture */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.14 }}
        animate={{ opacity: 1, scale: cinema ? 1 : 1.06, filter: cinema ? 'blur(0px)' : 'blur(3px)' }}
        transition={{ opacity: { duration: 1.6, ease }, scale: { duration: 1.6, ease }, filter: { duration: 0.9, ease } }}
      >
        {rendered.map((i) => {
          const clip = heroVideos[i]
          return (
            <video
              key={clip.slug}
              ref={(el) => {
                if (el) videos.current.set(i, el)
                else videos.current.delete(i)
              }}
              poster={clip.affiche}
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={(e) => {
                if (e.currentTarget.currentTime < clip.debut) e.currentTarget.currentTime = clip.debut
              }}
              onTimeUpdate={(e) => {
                if (i === index && e.currentTarget.currentTime >= clip.fin) goTo((index + 1) % N)
              }}
              onEnded={() => i === index && goTo((index + 1) % N)}
              className="absolute inset-0 h-full w-full object-cover transition-opacity ease-out"
              style={{ opacity: i === index ? 1 : 0, transitionDuration: `${FADE}s` }}
            >
              <source src={clip.src} type="video/mp4" />
            </video>
          )
        })}
      </motion.div>

      {/* L'ombre de gauche glisse en place, puis s'efface en mode lecture */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(90deg,#272725_0%,#272725f5_32%,#272725c4_47%,#27272533_62%,transparent_72%)] max-md:bg-[linear-gradient(180deg,#27272555_0%,#272725bb_42%,#272725f2_70%,#272725_100%)]"
        initial={{ x: '-100%' }}
        animate={{ x: '0%', opacity: cinema ? 0.38 : 1 }}
        transition={{ x: { duration: 1.3, delay: T_SHADOW, ease }, opacity: { duration: 0.9, ease } }}
      />
      <motion.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-black" />

      {/* Contenu */}
      <div className="page-x relative flex min-h-0 flex-1 flex-col justify-end pb-6 pt-[var(--header-h)] md:justify-center md:pb-4">
        <div className="max-w-[44rem]">
          <motion.p {...c(0)} className="font-roman text-[clamp(1rem,1.35vw,1.3rem)] text-white/90">
            L’élégance pour tous vos événements
          </motion.p>
          <motion.h1
            className="font-script text-[clamp(3.4rem,6.5vw,6.6rem)] leading-[1.12] text-gold-300 [text-shadow:0_2px_18px_rgb(0_0_0/0.35)]"
            initial={{ clipPath: 'inset(-20% 100% -20% 0)' }}
            animate={{ clipPath: 'inset(-20% 0% -20% 0)' }}
            transition={{ duration: 1.6, delay: T_CONTENT + 0.1, ease: [0.65, 0, 0.35, 1] }}
          >
            Glorious Hall,
          </motion.h1>

          <motion.div
            animate={{ opacity: cinema ? 0 : 1, y: cinema ? 14 : 0, filter: cinema ? 'blur(6px)' : 'blur(0px)' }}
            transition={{ duration: 0.6, ease }}
            inert={cinema}
          >
            <h2 className="font-roman text-[clamp(1.75rem,3.5vw,3.35rem)] leading-[1.18] text-white">
              {['le lieu où vos meilleurs', 'souvenirs prennent vie.'].map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    className="block"
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 1.1, delay: T_CONTENT + 0.35 + i * 0.12, ease }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h2>
            <motion.p
              {...c(5)}
              className="mt-4 max-w-[34rem] text-[clamp(0.82rem,1vw,0.98rem)] leading-relaxed tracking-[0.12em] text-white/85 max-md:[@media(max-height:740px)]:hidden"
            >
              Mariage, séminaire, anniversaire, baptême, réception, gala… Une salle moderne, équipée et raffinée à Douala,
              pensée pour donner vie à des moments inoubliables.
            </motion.p>
            <motion.div {...c(6)} className="mt-6 flex flex-wrap gap-2.5 sm:mt-7 sm:gap-4">
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="btn min-h-12 rounded-full bg-white px-5 text-[0.8rem] text-ink hover:shadow-[0_12px_30px_-10px_rgb(224_190_128/0.7)] sm:px-7 sm:text-sm"
              >
                Réserver maintenant
              </a>
              <button
                onClick={() => scrollTo('galerie')}
                className="btn min-h-12 rounded-full border border-gold-300/80 px-5 text-[0.8rem] text-white hover:border-gold-300 hover:bg-gold-300 hover:text-ink sm:px-9 sm:text-sm"
              >
                Voir la salle
              </button>
            </motion.div>
          </motion.div>

          <motion.div {...c(7)} className="mt-6 flex gap-2" role="tablist" aria-label="Choisir une vidéo">
            {heroVideos.map((clip, i) => (
              <button
                key={clip.slug}
                role="tab"
                aria-selected={i === index}
                aria-label={clip.titre}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full border border-white/70 transition-all duration-500 ${
                  i === index ? 'w-7 bg-white' : 'w-2 hover:bg-white/50'
                }`}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Lecture : le flou s'atténue, les textes s'effacent sauf le titre */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: T_CONTENT + 0.9, ease }}
        className="absolute right-[var(--gutter)] top-[calc(var(--header-h)+0.25rem)] z-10 flex items-center gap-3 md:right-[7%] md:top-[40%]"
      >
        <AnimatePresence>
          {cinema && (
            <motion.button
              key="son"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? 'Activer le son' : 'Couper le son'}
              className="grid h-12 w-12 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-white hover:text-ink"
            >
              {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </motion.button>
          )}
        </AnimatePresence>
        <button
          onClick={cinema ? exitCinema : enterCinema}
          className="group relative grid h-16 w-16 place-items-center rounded-full bg-black/35 backdrop-blur-sm md:h-24 md:w-24"
          aria-label={cinema ? 'Fermer la vidéo' : 'Regarder la vidéo'}
          aria-pressed={cinema}
        >
          {!cinema && <span className="absolute inset-0 animate-ping rounded-full bg-white/15 [animation-duration:2.4s]" />}
          <span className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-ink transition-transform duration-500 group-hover:scale-110 md:h-16 md:w-16">
            {cinema ? <X className="h-5 w-5 md:h-6 md:w-6" /> : <Play className="ml-0.5 h-5 w-5 fill-current md:ml-1 md:h-6 md:w-6" />}
          </span>
        </button>
      </motion.div>

      <motion.div
        animate={{ opacity: cinema ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="absolute right-[5%] top-[62%] hidden md:block"
      >
        <motion.p {...c(8)} className="text-right text-xs font-bold leading-snug tracking-[0.1em] text-white">
          +100 réservations
          <br />
          depuis le début
        </motion.p>
      </motion.div>

      {/* Barre d'atouts */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: cinema ? 0 : 1, y: cinema ? 40 : 0 }}
        transition={cinema ? { duration: 0.5, ease } : { duration: 1.1, delay: T_CONTENT + 0.7, ease }}
        inert={cinema}
        className="page-x relative pb-4 sm:pb-6"
      >
          <ul className="grid grid-cols-5 gap-1 rounded-[1.6rem] bg-black/70 px-2 py-3 backdrop-blur-md sm:rounded-[2rem] sm:px-8 sm:py-5">
            {heroStats.map((s, i) => (
              <motion.li
                key={s.label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: T_CONTENT + 0.9 + i * 0.08, ease }}
                className="group flex flex-col items-center text-center"
              >
                <Icon
                  name={s.icon}
                  className="h-6 w-6 text-gold-300 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110 sm:h-11 sm:w-11"
                />
                <span className="mt-1.5 text-[0.62rem] font-bold leading-tight tracking-[0.06em] text-gold-300 sm:mt-2 sm:text-lg">
                  {s.value}
                </span>
                <span className="text-[0.58rem] leading-tight tracking-[0.04em] text-gold-200/90 sm:text-base">{s.label}</span>
              </motion.li>
            ))}
          </ul>
      </motion.div>
    </motion.section>
  )
}
