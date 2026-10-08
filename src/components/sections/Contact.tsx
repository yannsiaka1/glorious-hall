import { motion } from 'motion/react'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import logo from '@/assets/img/logo-sombre.webp'
import oiseaux from '@/assets/img/oiseaux-cristal.webp'
import { MapCard } from '@/components/ui/MapCard'
import { Reveal } from '@/components/ui/Reveal'
import { EASE } from '@/lib/animation'
import { contact } from '@/content/site'

/** Proportions de la maquette : bandeau haut de 27 % de la largeur sur ordinateur. */
export function Contact() {
  return (
    <section
      id="contact"
      data-theme="clair"
      aria-labelledby="contact-titre"
      className="grid scroll-mt-[var(--header-h)] bg-cream lg:h-[27vw] lg:min-h-[23rem] lg:grid-cols-[53%_47%]"
    >
      {/* Appel à l'action sur la photo des oiseaux de cristal */}
      <div className="relative min-h-[25rem] overflow-hidden lg:min-h-0">
        <img
          src={oiseaux}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[60%_40%]"
        />
        <motion.img
          src={logo}
          alt=""
          loading="lazy"
          data-reveal
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
          className="absolute top-[28%] right-[4%] hidden w-[17%] drop-shadow-[0_6px_14px_rgb(255_255_255/0.6)] sm:block"
        />
        <motion.div
          data-reveal
          initial={{ x: '-100%' }}
          whileInView={{ x: '0%' }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 1.2, ease: EASE }}
          className="relative flex h-full w-[90%] flex-col justify-center [border-top-right-radius:38vw_100%] bg-sand py-12 pr-10 pl-[var(--gutter)] sm:w-[80%] lg:w-[83%] lg:[border-top-right-radius:20vw_92%] lg:py-0 lg:pr-[3vw]"
        >
          <h2 id="contact-titre" className="text-[clamp(1.4rem,1.75vw,1.95rem)] leading-[1.15] font-bold text-ink">
            Prêt à organiser
            <br />
            votre événement ?
          </h2>
          <p className="mt-3 text-[clamp(1.02rem,1.2vw,1.3rem)] leading-snug font-bold text-white [text-shadow:0_1px_2px_rgb(122_90_28/0.35)] lg:mt-[1vw]">
            Donnez-nous plus de détails
            <br />
            dès maintenant.
          </p>
          <p className="mt-3 max-w-[24rem] text-[clamp(0.8rem,0.92vw,0.98rem)] leading-snug font-bold text-[#5a4416] lg:mt-[1.2vw] lg:max-w-[25vw]">
            Notre équipe est disposée à répondre à toutes vos questions et à vous accompagner dans l’organisation de
            votre événement.
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
      <div className="flex items-center bg-[#fff8f0] px-[var(--gutter)] py-10 lg:py-0 lg:pr-[var(--gutter)] lg:pl-[1.3vw]">
        <Reveal
          y={40}
          className="grid w-full overflow-hidden rounded-2xl border border-gold-300/80 bg-[#f6ecdf] shadow-[0_20px_50px_-30px_rgb(0_0_0/0.35)] sm:grid-cols-[1fr_1.05fr] lg:h-[19vw] lg:min-h-[16rem]"
        >
          <address className="flex flex-col justify-center p-6 not-italic lg:px-[1.5vw] lg:py-[1.2vw]">
            <h3 className="text-[clamp(1.05rem,1.3vw,1.3rem)] font-bold text-[#5a3424]">Notre emplacement</h3>
            <ul className="mt-4 space-y-3 text-[clamp(0.84rem,1vw,1rem)] leading-snug text-ink lg:mt-[1.1vw] lg:space-y-[0.9vw]">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 fill-[#5a3424] text-[#f6ecdf]" aria-hidden="true" />
                {contact.adresseComplete}.
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 fill-[#5a3424] text-[#5a3424]" aria-hidden="true" />
                <span className="flex flex-col">
                  {contact.telephones.map((telephone) => (
                    <a key={telephone.lien} href={telephone.lien} className="transition-colors hover:text-gold-600">
                      {telephone.libelle}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#5a3424]" aria-hidden="true" />
                <a href={`mailto:${contact.courriel}`} className="break-all transition-colors hover:text-gold-600">
                  {contact.courriel}
                </a>
              </li>
            </ul>
            <a
              href={contact.plan}
              target="_blank"
              rel="noreferrer"
              className="btn mt-5 self-start rounded-full border-2 border-[#5a3424] px-5 py-2 text-sm text-[#5a3424] hover:bg-[#5a3424] hover:text-white lg:mt-[1.4vw]"
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Voir sur Google Maps
            </a>
          </address>
          <MapCard className="h-60 sm:h-auto" />
        </Reveal>
      </div>
    </section>
  )
}
