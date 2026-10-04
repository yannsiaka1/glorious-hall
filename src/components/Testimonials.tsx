import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { testimonials } from '../content'
import { MaskLine, Reveal } from './Reveal'

export function Testimonials() {
  const [i, setI] = useState(0)
  const many = testimonials.length > 1

  useEffect(() => {
    if (!many) return
    const id = window.setInterval(() => setI((v) => (v + 1) % testimonials.length), 7000)
    return () => window.clearInterval(id)
  }, [many, i])

  const t = testimonials[i]

  return (
    <section id="avis" aria-labelledby="avis-titre" className="bg-cream pb-24">
      {/* Bandeau titre : forme sombre arrondie */}
      <motion.div
        initial={{ clipPath: 'inset(0 100% 0 0 round 0 0 12rem 0)' }}
        whileInView={{ clipPath: 'inset(0 0% 0 0 round 0 0 12rem 0)' }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
        className="w-full max-w-[880px] rounded-bl-[10rem] bg-[linear-gradient(90deg,#000_0%,#2a2a28_45%,#5a5956_70%,#e8e3dd_100%)] px-5 pb-14 pt-10 sm:rounded-bl-[14rem] sm:px-10 lg:px-16"
      >
        <span className="eyebrow text-gold-300">Leurs avis</span>
        <h2 id="avis-titre" className="mt-3 text-[clamp(1.8rem,3.6vw,2.6rem)] font-bold text-white">
          <MaskLine delay={0.4}>
            Ils nous ont fait <span className="text-gold-500">confiance.</span>
          </MaskLine>
        </h2>
      </motion.div>

      <div className="mx-auto mt-16 max-w-3xl px-5 text-center sm:px-10">
        <Reveal>
          <p className="font-quote text-lg font-semibold tracking-[0.06em] text-gold-500 [font-variant:small-caps]">Ce qu’ils disent</p>
        </Reveal>
        <div className="relative mt-6">
          <motion.span
            aria-hidden
            initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.2 }}
            className="absolute -left-2 -top-10 font-quote text-[7rem] leading-none text-gold-300 sm:-left-16"
          >
            ”
          </motion.span>
          <AnimatePresence mode="wait">
            <motion.figure
              key={t.author}
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <blockquote className="font-quote text-xl leading-relaxed text-ink sm:text-2xl">“{t.quote}”</blockquote>
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 }}
                className="mx-auto mt-5 block h-px w-24 bg-gold-300"
              />
              <figcaption className="mt-4">
                <span className="block font-quote text-lg font-semibold tracking-[0.04em] [font-variant:small-caps]">{t.author}</span>
                <span className="font-quote text-ink/70">{t.source}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        {many && (
          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((x, k) => (
              <button
                key={x.author}
                onClick={() => setI(k)}
                aria-label={`Avis ${k + 1}`}
                className={`h-2 rounded-full border border-ink/50 transition-all duration-500 ${k === i ? 'w-6 bg-ink' : 'w-2'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
