import { motion, useScroll, useTransform } from 'motion/react'
import { MessageCircle } from 'lucide-react'
import { useRef, type ReactNode } from 'react'
import ceremonie from '../assets/img/ceremonie-exterieur.webp'
import { aboutStats } from '../content'
import { useScrollTo } from '../lib/scroll'
import { Counter } from './Counter'
import { MaskLine, Reveal } from './Reveal'

const B = ({ children }: { children: ReactNode }) => <strong className="font-bold text-ink">{children}</strong>

export function About() {
  const ref = useRef<HTMLElement>(null)
  const scrollTo = useScrollTo()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section id="a-propos" ref={ref} aria-labelledby="apropos-titre" className="relative overflow-hidden bg-gold-300">
      {/* Image avec léger parallaxe, fondue dans le doré */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[55%]">
        <motion.img
          src={ceremonie}
          alt="Cérémonie en plein air sur la terrasse de Glorious Hall"
          style={{ y: imgY }}
          className="h-[116%] w-full -translate-y-[8%] object-cover object-[70%_center]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-gold-300)_0%,rgb(225_189_120/0.85)_18%,transparent_55%)] max-md:bg-[linear-gradient(180deg,var(--color-gold-300)_0%,rgb(225_189_120/0.9)_55%,rgb(225_189_120/0.55)_100%)]" />
      </div>

      <div className="relative mx-auto grid max-w-[1260px] gap-10 px-5 py-20 sm:px-10 md:grid-cols-[1.15fr_auto] md:py-24 lg:px-16">
        <div className="max-w-xl">
          <Reveal>
            <span className="eyebrow text-gold-700">À propos de nous</span>
          </Reveal>
          <h2 id="apropos-titre" className="mt-4 text-[clamp(1.8rem,3.6vw,2.6rem)] font-bold leading-[1.15] text-ink">
            <MaskLine>
              Un <span className="text-gold-600">lieu</span> unique
            </MaskLine>
            <MaskLine delay={0.1}>
              au cœur <span className="text-gold-600">de Douala</span>
            </MaskLine>
          </h2>
          <Reveal delay={0.15}>
            <div className="mt-8 space-y-5 text-sm leading-relaxed tracking-[0.04em] text-[#4a3818] sm:text-[0.95rem]">
              <p>
                <B>Glorious Hall</B> est une salle <B>événementielle</B> moderne située à <B>Bonamoussadi</B>. Elle est conçue pour vous
                offrir une expérience inoubliable.
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
              className="group btn mt-8 bg-ink px-7 py-4 text-lg text-white hover:shadow-[0_16px_34px_-14px_rgb(0_0_0/0.7)]"
            >
              Nous contacter
              <MessageCircle className="h-6 w-6 fill-white text-white transition-transform duration-500 group-hover:rotate-12" />
            </button>
          </Reveal>
        </div>

        <ul className="grid grid-cols-2 gap-4 self-center md:grid-cols-1">
          {aboutStats.map((s, i) => (
            <motion.li
              key={s.label}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="min-w-[10rem] rounded-[1.6rem] bg-[#5a4a2e]/90 px-6 py-4 text-center text-white shadow-[0_20px_40px_-20px_rgb(0_0_0/0.6)] backdrop-blur-sm"
            >
              <p className="text-3xl font-bold tracking-[0.04em] sm:text-4xl">
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p className="text-base tracking-[0.06em] sm:text-lg">{s.label}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
