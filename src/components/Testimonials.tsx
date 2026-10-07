import { mdiFormatQuoteClose } from '@mdi/js'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { testimonials } from '../content'
import { MaskLine, Reveal } from './Reveal'

/** Proportions relevées sur la maquette « section_avis ». */
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
    <section id="avis" data-theme="light" aria-labelledby="avis-titre" className="scroll-mt-[var(--header-h)] bg-cream pb-16 lg:pb-[6vw]">
      {/* Bandeau sombre, coin bas gauche très arrondi, fondu vers la droite */}
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -10% 0px' }}>
        <motion.div
          variants={{ hidden: { clipPath: 'inset(0 100% 0 0)' }, show: { clipPath: 'inset(0 0% 0 0)' } }}
          transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
          className="w-[94%] rounded-bl-[7rem] bg-[linear-gradient(90deg,#000_0%,#0d0d0c_50%,#2e2d2b_62%,#8d8a85_80%,var(--color-cream)_96%)] pb-9 pt-7 pl-[var(--gutter)] lg:h-[17.2vw] lg:w-[54vw] lg:rounded-bl-[15vw] lg:bg-[linear-gradient(90deg,#000_0%,#0d0d0c_49%,#2e2d2b_60%,#8d8a85_75%,var(--color-cream)_90%)] lg:pb-0 lg:pt-[3.6vw]"
        >
          <span className="eyebrow !text-gold-300 lg:!text-[clamp(0.9rem,1.45vw,1.3rem)]">Leurs avis</span>
          <h2 id="avis-titre" className="mt-3 text-[clamp(1.6rem,3.2vw,3.1rem)] font-bold text-white lg:ml-[1.7vw] lg:mt-[0.9vw] lg:whitespace-nowrap">
            <MaskLine delay={0.4}>
              Ils nous ont fait <span className="text-gold-600">confiance</span>
              <span className="text-gold-300">.</span>
            </MaskLine>
          </h2>
        </motion.div>
      </motion.div>

      <div className="page-x mt-12 lg:mt-[4.9vw]">
        <div className="mx-auto max-w-[62rem] lg:ml-[24.4vw] lg:mr-0 lg:max-w-[58.4vw] lg:pl-0">
          <Reveal>
            <p className="text-center font-roman text-[clamp(0.9rem,1.35vw,1.25rem)] uppercase tracking-[0.08em] text-gold-500 lg:mr-[7vw]">
              Ce qu’ils disent
            </p>
          </Reveal>
          <div className="relative mt-5 lg:mt-[2.2vw]">
            <motion.svg
              viewBox="0 0 24 24"
              aria-hidden
              initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.2 }}
              className="mb-2 h-14 w-14 fill-gold-300 lg:absolute lg:-left-[7.4vw] lg:-top-[2.2vw] lg:mb-0 lg:h-[7vw] lg:w-[7vw]"
            >
              <path d={mdiFormatQuoteClose} />
            </motion.svg>
            <AnimatePresence mode="wait">
              <motion.figure
                key={t.author}
                initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <blockquote className="font-roman text-[clamp(1.15rem,1.96vw,1.85rem)] leading-[1.32] text-ink">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-center lg:mr-[7vw] lg:mt-[0.8vw]">
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="mx-auto block h-px w-24 bg-gold-300 lg:w-[9.5vw]"
                  />
                  <span className="mt-4 block font-roman text-[clamp(0.95rem,1.4vw,1.3rem)] uppercase tracking-[0.08em] text-ink lg:mt-[1.6vw]">
                    {t.author}
                  </span>
                  <span className="font-roman text-[clamp(0.8rem,1.15vw,1.05rem)] text-ink/70">{t.source}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          {many && (
            <div className="mt-6 flex justify-center gap-2 lg:mr-[7vw]">
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
      </div>
    </section>
  )
}
