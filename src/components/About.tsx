import { motion, useScroll, useTransform } from 'motion/react'
import { MessageCircle } from 'lucide-react'
import { useRef, type ReactNode } from 'react'
import ceremonie from '../assets/img/ceremonie-exterieur.webp'
import { aboutStats } from '../content'
import { useScrollTo } from '../lib/scroll'
import { Counter } from './Counter'
import { MaskLine, Reveal } from './Reveal'

const B = ({ children }: { children: ReactNode }) => <strong className="font-bold text-ink">{children}</strong>

/** Proportions relevées sur la maquette « section_avis » (section haute de 47,8 % de la largeur). */
export function About() {
  const ref = useRef<HTMLElement>(null)
  const scrollTo = useScrollTo()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-7%', '7%'])

  return (
    <section
      id="a-propos"
      ref={ref}
      data-theme="light"
      aria-labelledby="apropos-titre"
      className="relative scroll-mt-[var(--header-h)] overflow-hidden bg-sand lg:h-[47.8vw] lg:min-h-[34rem]"
    >
      {/* Photo à droite, fondue dans l'or (en haut sur téléphone) */}
      <div className="relative h-[58vw] max-h-[26rem] w-full overflow-hidden lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:max-h-none lg:w-[49%]">
        <motion.img
          src={ceremonie}
          alt="Cérémonie en plein air sur la terrasse de Glorious Hall"
          style={{ y: imgY }}
          className="absolute inset-x-0 top-[-8%] h-[116%] w-full object-cover object-[60%_center]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgb(224_185_114/0.85)_85%,var(--color-sand)_100%)] lg:bg-[linear-gradient(90deg,var(--color-sand)_0%,rgb(224_185_114/0.8)_12%,rgb(224_185_114/0.25)_26%,transparent_34%)]" />
      </div>

      <div className="page-x relative grid gap-8 pb-14 pt-4 lg:h-full lg:grid-cols-[38vw_minmax(9rem,13.5vw)] lg:items-center lg:gap-[1.8vw] lg:py-[4.6vw]">
        <div>
          <Reveal>
            <span className="eyebrow !text-[#6b4f1a] lg:!text-[clamp(0.9rem,1.45vw,1.3rem)]">À propos de nous</span>
          </Reveal>
          <h2 id="apropos-titre" className="mt-4 text-[clamp(1.75rem,3.4vw,3.3rem)] font-bold leading-[1.18] text-ink lg:ml-[1vw]">
            <MaskLine>
              Un <span className="text-gold-600">lieu</span> unique
            </MaskLine>
            <MaskLine delay={0.1}>
              au cœur <span className="text-gold-600">de Douala</span>
            </MaskLine>
          </h2>
          <Reveal delay={0.15}>
            <div className="mt-6 space-y-[1.2em] text-[clamp(0.84rem,0.98vw,1rem)] leading-[1.5] tracking-[0.1em] text-[#4a3818] lg:mt-[2.6vw]">
              <p>
                <B>Glorious Hall</B> est une salle <B>événementielle</B> moderne située à <B>Bonamoussadi</B>. Elle est conçue
                pour vous offrir une expérience inoubliable.
              </p>
              <p>
                La <B>salle</B> allie confort, modernité et élégance, avec un <B>équipement</B> à la pointe de la technologie
                (sonorisation, climatisation, cuisine équipée…) et un cadre <B>sécuritaire</B>.
              </p>
              <p>
                Nous disposons également d’une <B>équipe</B> plus que qualifiée et dévouée pour faire de vos rêves vos meilleurs{' '}
                <B>souvenirs</B>.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.25}>
            <button
              onClick={() => scrollTo('contact')}
              className="group btn mt-7 h-14 gap-4 rounded-2xl bg-black px-7 text-lg text-white hover:shadow-[0_16px_34px_-14px_rgb(0_0_0/0.7)] lg:mt-[2.2vw] lg:h-[clamp(3.2rem,5.1vw,4.6rem)] lg:rounded-[clamp(0.9rem,1.6vw,1.4rem)] lg:px-[2.1vw] lg:text-[clamp(1rem,1.75vw,1.55rem)]"
            >
              Nous contacter
              <MessageCircle className="h-[1.3em] w-[1.3em] fill-white text-white transition-transform duration-500 group-hover:rotate-12" />
            </button>
          </Reveal>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:gap-[0.9vw]">
          {aboutStats.map((s, i) => (
            <motion.li
              key={s.label}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 0.9, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className={`flex flex-col items-center justify-center rounded-[1.4rem] bg-[#5a4a2e]/92 px-3 py-3 text-center text-white shadow-[0_20px_40px_-20px_rgb(0_0_0/0.6)] backdrop-blur-sm lg:h-[6.68vw] lg:min-h-[4.6rem] lg:rounded-[1.6vw] lg:py-0 ${
                i === aboutStats.length - 1 ? 'max-sm:col-span-2' : ''
              }`}
            >
              <p className="text-[clamp(1.5rem,2.5vw,2.4rem)] font-bold leading-none tracking-[0.04em] tabular-nums">
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-[clamp(0.78rem,1.2vw,1.15rem)] leading-tight tracking-[0.06em]">{s.label}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
