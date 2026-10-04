import { motion } from 'motion/react'
import { forwardRef } from 'react'
import { included, options } from '../content'
import { icons } from '../lib/icons'
import { useScrollTo } from '../lib/scroll'
import { Reveal } from './Reveal'

const ease = [0.22, 1, 0.36, 1] as const

function Feature({ icon, label, i }: { icon: string; label: string; i: number }) {
  const Icon = icons[icon]
  return (
    <motion.li
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.8, delay: i * 0.07, ease }}
      className="group flex flex-col items-center text-center"
    >
      <span className="relative grid h-14 w-14 place-items-center rounded-2xl transition-all duration-500 group-hover:-translate-y-1.5 group-hover:bg-gold-300/10">
        <span className="absolute inset-0 rounded-2xl opacity-0 shadow-[0_0_30px_rgb(225_189_120/0.45)] transition-opacity duration-500 group-hover:opacity-100" />
        <Icon className="h-9 w-9 text-gold-300" strokeWidth={1.6} aria-hidden />
      </span>
      <span className="mt-2 max-w-[9rem] text-sm font-bold leading-tight tracking-[0.06em] text-gold-300 transition-colors duration-300 group-hover:text-gold-200 sm:text-base">
        {label}
      </span>
    </motion.li>
  )
}

export const Offer = forwardRef<HTMLElement>(function Offer(_, ref) {
  const scrollTo = useScrollTo()
  return (
    <section
      ref={ref}
      aria-labelledby="offre-titre"
      className="relative z-10 -mt-px overflow-hidden rounded-t-[2.5rem] bg-stone shadow-[0_-30px_60px_-20px_rgb(0_0_0/0.55)] sm:rounded-t-[3.5rem]"
    >
      <div className="bg-[linear-gradient(105deg,#2e2e2c_0%,#3a3a38_18%,#8f8d89_45%,#cbc7c2_75%)] px-5 pb-16 pt-12 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1260px] flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <motion.h2
              id="offre-titre"
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
              className="font-script text-[clamp(2.6rem,6vw,4.4rem)] leading-[1.2] text-gold-300"
            >
              Ce que nous vous offrons
            </motion.h2>
            <Reveal delay={0.3}>
              <p className="mt-1 max-w-2xl font-serif text-base leading-relaxed text-white sm:text-xl">
                Nous mettons le meilleur de nous-mêmes à votre disposition, parce que votre satisfaction est notre récompense.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.45} className="shrink-0">
            <button
              onClick={() => scrollTo('contact')}
              className="btn bg-gold-600 px-8 py-4 text-white shadow-[0_14px_30px_-12px_rgb(156_116_38/0.9)] hover:bg-gold-500"
            >
              Nous contacter
            </button>
          </Reveal>
        </div>
      </div>

      <div className="px-4 pb-20 sm:px-10 lg:px-16">
        <Reveal y={50} className="mx-auto -mt-4 max-w-[1260px] rounded-[2.5rem] bg-coal px-6 py-10 sm:px-12 sm:py-12">
          <h3 className="sr-only">Inclus avec la salle</h3>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {included.map((f, i) => (
              <Feature key={f.label} {...f} i={i} />
            ))}
          </ul>
          <div className="my-9 flex items-center gap-4">
            <h3 className="font-bold text-white">En option</h3>
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease }}
              className="h-px flex-1 origin-left bg-gradient-to-r from-gold-300/60 to-transparent"
            />
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
            {options.map((f, i) => (
              <Feature key={f.label} {...f} i={i} />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
})
