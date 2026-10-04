import { AnimatePresence, motion, useTransform, type MotionValue } from 'motion/react'
import { Play } from 'lucide-react'
import { useEffect, useState } from 'react'
import { contact, heroSlides, heroStats } from '../content'
import { icons } from '../lib/icons'
import { useScrollTo } from '../lib/scroll'

const ease = [0.22, 1, 0.36, 1] as const
// Chronologie du chargement : image, puis ombre gauche, puis contenu
const T_SHADOW = 0.55
const T_CONTENT = 1.35

type Props = { coverProgress: MotionValue<number>; onPlay: () => void }

export function Hero({ coverProgress, onPlay }: Props) {
  const scrollTo = useScrollTo()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % heroSlides.length), 6500)
    return () => window.clearInterval(id)
  }, [index])

  // Quand la section suivante monte par-dessus, le hero recule légèrement et s'assombrit
  const scale = useTransform(coverProgress, [0, 1], [1, 0.93])
  const dim = useTransform(coverProgress, [0, 1], [0, 0.65])
  const radius = useTransform(coverProgress, [0, 1], [48, 72])

  const c = (i: number) => ({
    initial: { opacity: 0, y: 26, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 1, delay: T_CONTENT + i * 0.12, ease },
  })

  return (
    <motion.section
      id="accueil"
      aria-label="Accueil"
      style={{ scale, borderBottomLeftRadius: radius, borderBottomRightRadius: radius }}
      className="sticky top-0 h-[100svh] min-h-[640px] origin-top overflow-hidden bg-coal"
    >
      {/* Diaporama */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.12 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease }}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={index}
            src={heroSlides[index].src}
            alt={heroSlides[index].alt}
            className="absolute inset-0 h-full w-full object-cover object-[65%_center]"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.4, ease }, scale: { duration: 7, ease: 'linear' } }}
            fetchPriority={index === 0 ? 'high' : 'auto'}
          />
        </AnimatePresence>
      </motion.div>

      {/* L'ombre de gauche glisse en place */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(90deg,#272725_0%,#272725f5_34%,#272725c4_48%,#27272533_62%,transparent_72%)] max-md:bg-[linear-gradient(180deg,#27272566_0%,#272725cc_45%,#272725_80%)]"
        initial={{ x: '-100%' }}
        animate={{ x: '0%' }}
        transition={{ duration: 1.3, delay: T_SHADOW, ease }}
      />
      <motion.div aria-hidden style={{ opacity: dim }} className="absolute inset-0 bg-black" />

      {/* Contenu */}
      <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-end px-5 pb-36 sm:px-10 md:justify-center md:pb-24 lg:px-16">
        <div className="max-w-xl">
          <motion.p {...c(0)} className="font-serif text-sm italic text-white/85 sm:text-base">
            L’élégance pour tous vos événements
          </motion.p>
          <motion.h1
            className="mt-2 font-script text-[clamp(3rem,8vw,5.6rem)] leading-[1.15] text-gold-300"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            transition={{ duration: 1.6, delay: T_CONTENT + 0.1, ease: [0.65, 0, 0.35, 1] }}
          >
            Glorious Hall,
          </motion.h1>
          <h2 className="mt-1 font-serif text-[clamp(1.6rem,3.6vw,2.6rem)] leading-[1.2] tracking-[0.02em] text-white">
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
          <motion.p {...c(5)} className="mt-5 max-w-md text-sm leading-relaxed tracking-[0.03em] text-white/80 sm:text-[0.95rem]">
            Mariage, séminaire, anniversaire, baptême, réception, gala… Une salle moderne, équipée et raffinée à Douala,
            pensée pour donner vie à des moments inoubliables.
          </motion.p>
          <motion.div {...c(6)} className="mt-7 flex flex-wrap gap-3 sm:gap-4">
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="btn bg-white px-6 py-3 text-sm text-ink hover:shadow-[0_12px_30px_-10px_rgb(225_189_120/0.7)]"
            >
              Réserver maintenant
            </a>
            <button
              onClick={() => scrollTo('galerie')}
              className="btn border border-gold-300/80 px-7 py-3 text-sm text-white hover:border-gold-300 hover:bg-gold-300 hover:text-ink"
            >
              Voir la salle
            </button>
          </motion.div>
          <motion.div {...c(7)} className="mt-7 flex gap-2" role="tablist" aria-label="Choisir une photo">
            {heroSlides.map((s, i) => (
              <button
                key={s.alt}
                role="tab"
                aria-selected={i === index}
                aria-label={`Photo ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full border border-white/70 transition-all duration-500 ${
                  i === index ? 'w-7 bg-white' : 'w-2 hover:bg-white/50'
                }`}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Lecture vidéo */}
      <motion.button
        onClick={onPlay}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: T_CONTENT + 0.9, ease }}
        className="group absolute right-[8%] top-[38%] hidden h-24 w-24 place-items-center rounded-full bg-black/35 backdrop-blur-sm md:grid"
        aria-label="Découvrir la salle en images"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-white/15 [animation-duration:2.4s]" />
        <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-ink transition-transform duration-500 group-hover:scale-110">
          <Play className="ml-1 h-6 w-6 fill-current" />
        </span>
      </motion.button>
      <motion.p
        {...c(8)}
        className="absolute right-[6%] top-[64%] hidden text-right text-xs font-semibold leading-snug tracking-[0.08em] text-white md:block"
      >
        +100 réservations
        <br />
        depuis le début
      </motion.p>

      {/* Barre d'atouts */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: T_CONTENT + 0.7, ease }}
        className="absolute inset-x-3 bottom-4 sm:inset-x-6 lg:inset-x-16"
      >
        <ul
          data-lenis-prevent
          className="mx-auto flex max-w-[1260px] snap-x snap-mandatory gap-2 overflow-x-auto rounded-[2rem] bg-black/70 px-4 py-4 backdrop-blur-md [scrollbar-width:none] sm:justify-between sm:px-8 sm:py-5"
        >
          {heroStats.map((s, i) => {
            const Icon = icons[s.icon]
            return (
              <motion.li
                key={s.label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: T_CONTENT + 0.9 + i * 0.08, ease }}
                className="group flex min-w-[8.5rem] shrink-0 snap-start flex-col items-center text-center"
              >
                <Icon
                  className="h-8 w-8 text-gold-300 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110 sm:h-11 sm:w-11"
                  strokeWidth={1.6}
                  aria-hidden
                />
                <span className="mt-2 text-sm font-bold tracking-[0.06em] text-gold-300 sm:text-lg">{s.value}</span>
                <span className="text-xs tracking-[0.06em] text-gold-200/90 sm:text-base">{s.label}</span>
              </motion.li>
            )
          })}
        </ul>
      </motion.div>
    </motion.section>
  )
}
