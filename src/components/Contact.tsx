import { motion } from 'motion/react'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import oiseaux from '../assets/img/oiseaux-cristal.webp'
import logo from '../assets/img/logo-sombre.webp'
import { contact } from '../content'
import { MapCard } from './MapCard'
import { Reveal } from './Reveal'

const ease = [0.22, 1, 0.36, 1] as const

/** Proportions de la maquette : bandeau haut de 27 % de la largeur sur ordinateur. */
export function Contact() {
  return (
    <section id="contact" data-theme="light" aria-labelledby="contact-titre" className="grid scroll-mt-[var(--header-h)] bg-cream lg:h-[27vw] lg:min-h-[23rem] lg:grid-cols-[53%_47%]">
      {/* Appel à l'action sur la photo des oiseaux de cristal */}
      <div className="relative min-h-[25rem] overflow-hidden lg:min-h-0">
        <img src={oiseaux} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-[60%_40%]" />
        <motion.img
          src={logo}
          alt=""
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.5, ease }}
          className="absolute right-[4%] top-[28%] hidden w-[17%] drop-shadow-[0_6px_14px_rgb(255_255_255/0.6)] sm:block"
        />
        <motion.div
          initial={{ x: '-100%' }}
          whileInView={{ x: '0%' }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 1.2, ease }}
          className="relative flex h-full w-[90%] flex-col justify-center bg-sand py-12 pl-[var(--gutter)] pr-10 [border-top-right-radius:38vw_100%] sm:w-[80%] lg:w-[83%] lg:py-0 lg:pr-[3vw] lg:[border-top-right-radius:20vw_92%]"
        >
          <h2 id="contact-titre" className="text-[clamp(1.4rem,1.75vw,1.95rem)] font-bold leading-[1.15] text-ink">
            Prêt à organiser
            <br />
            votre événement ?
          </h2>
          <p className="mt-3 text-[clamp(1.02rem,1.2vw,1.3rem)] font-bold leading-snug text-white [text-shadow:0_1px_2px_rgb(122_90_28/0.35)] lg:mt-[1vw]">
            Donnez-nous plus de détails
            <br />
            dès maintenant.
          </p>
          <p className="mt-3 max-w-[24rem] text-[clamp(0.8rem,0.92vw,0.98rem)] font-bold leading-snug text-[#5a4416] lg:mt-[1.2vw] lg:max-w-[25vw]">
            Notre équipe est disposée à répondre à toutes vos questions et à vous accompagner dans l’organisation de votre
            événement.
          </p>
          <a
            href={contact.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="group btn mt-6 h-14 gap-5 self-start rounded-2xl bg-black px-7 text-lg text-white hover:shadow-[0_16px_34px_-14px_rgb(0_0_0/0.7)] lg:mt-[2.3vw] lg:h-[clamp(3.2rem,5vw,4.6rem)] lg:rounded-[clamp(0.9rem,1.6vw,1.4rem)] lg:px-[2.3vw] lg:text-[clamp(1.05rem,1.75vw,1.6rem)]"
          >
            Nous contacter
            <MessageCircle className="h-[1.35em] w-[1.35em] fill-white text-white transition-transform duration-500 group-hover:rotate-12" />
          </a>
        </motion.div>
      </div>

      {/* Emplacement */}
      <div className="flex items-center bg-[#fff8f0] px-[var(--gutter)] py-10 lg:pl-[1.3vw] lg:pr-[var(--gutter)] lg:py-0">
        <Reveal y={40} className="grid w-full overflow-hidden rounded-2xl border border-gold-300/80 bg-[#f6ecdf] shadow-[0_20px_50px_-30px_rgb(0_0_0/0.35)] sm:grid-cols-[1fr_1.05fr] lg:h-[19vw] lg:min-h-[16rem]">
          <div className="flex flex-col justify-center p-6 lg:px-[1.5vw] lg:py-[1.2vw]">
            <h3 className="text-[clamp(1.05rem,1.3vw,1.3rem)] font-bold text-[#5a3424]">Notre emplacement</h3>
            <ul className="mt-4 space-y-3 text-[clamp(0.84rem,1vw,1rem)] leading-snug text-ink lg:mt-[1.1vw] lg:space-y-[0.9vw]">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 fill-[#5a3424] text-[#f6ecdf]" />
                {contact.address.replace(', Douala', '')}.
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 fill-[#5a3424] text-[#5a3424]" />
                <span className="flex flex-col">
                  {contact.phones.map((p) => (
                    <a key={p.href} href={p.href} className="transition-colors hover:text-gold-600">
                      {p.label}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#5a3424]" />
                <a href={`mailto:${contact.email}`} className="break-all transition-colors hover:text-gold-600">
                  {contact.email}
                </a>
              </li>
            </ul>
            <a
              href={contact.mapsLink}
              target="_blank"
              rel="noreferrer"
              className="btn mt-5 self-start rounded-full border-2 border-[#5a3424] px-5 py-2 text-sm text-[#5a3424] hover:bg-[#5a3424] hover:text-white lg:mt-[1.4vw]"
            >
              <MapPin className="h-4 w-4" />
              Voir sur Google Maps
            </a>
          </div>
          <MapCard className="h-60 sm:h-auto" />
        </Reveal>
      </div>
    </section>
  )
}
