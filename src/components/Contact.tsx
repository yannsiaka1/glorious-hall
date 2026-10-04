import { motion } from 'motion/react'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import oiseaux from '../assets/img/oiseaux-cristal.webp'
import monogram from '../assets/img/monogramme-noir.webp'
import { contact } from '../content'
import { Reveal } from './Reveal'

const ease = [0.22, 1, 0.36, 1] as const

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-titre" className="grid bg-cream lg:grid-cols-2">
      {/* Appel à l'action */}
      <div className="relative min-h-[26rem] overflow-hidden">
        <img src={oiseaux} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <motion.img
          src={monogram}
          alt=""
          initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.5, ease }}
          className="absolute right-6 top-1/3 hidden w-24 rounded-2xl mix-blend-multiply sm:block"
        />
        <motion.div
          initial={{ x: '-100%' }}
          whileInView={{ x: '0%' }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 1.2, ease }}
          className="relative flex h-full w-[92%] flex-col justify-center rounded-tr-[14rem] bg-gold-300 px-6 py-14 sm:w-[80%] sm:px-12"
        >
          <h2 id="contact-titre" className="text-2xl font-bold leading-tight text-ink sm:text-3xl">
            Prêt à organiser
            <br />
            votre événement ?
          </h2>
          <p className="mt-4 text-lg font-bold leading-snug text-white">Donnez-nous plus de détails dès maintenant.</p>
          <p className="mt-4 max-w-sm text-sm font-semibold leading-snug text-[#4a3818]">
            Notre équipe est disposée à répondre à toutes vos questions et à vous accompagner dans l’organisation de votre
            événement.
          </p>
          <a
            href={contact.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="group btn mt-8 self-start bg-ink px-7 py-4 text-lg text-white hover:shadow-[0_16px_34px_-14px_rgb(0_0_0/0.7)]"
          >
            Nous contacter
            <MessageCircle className="h-6 w-6 fill-white transition-transform duration-500 group-hover:rotate-12" />
          </a>
        </motion.div>
      </div>

      {/* Emplacement */}
      <div className="flex items-center px-4 py-10 sm:px-10">
        <Reveal y={40} className="grid w-full overflow-hidden rounded-[1.6rem] border border-gold-300/70 bg-white/60 shadow-[0_20px_50px_-30px_rgb(0_0_0/0.4)] md:grid-cols-[1fr_1.05fr]">
          <div className="p-6 sm:p-8">
            <h3 className="text-lg font-bold text-[#5a3a1c]">Notre emplacement</h3>
            <ul className="mt-5 space-y-4 text-sm text-ink">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#5a3a1c]" />
                {contact.address}
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#5a3a1c]" />
                <span className="flex flex-col">
                  {contact.phones.map((p) => (
                    <a key={p.href} href={p.href} className="transition-colors hover:text-gold-600">
                      {p.label}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#5a3a1c]" />
                <a href={`mailto:${contact.email}`} className="transition-colors hover:text-gold-600">
                  {contact.email}
                </a>
              </li>
            </ul>
            <a
              href={contact.mapsLink}
              target="_blank"
              rel="noreferrer"
              className="btn mt-6 border border-[#5a3a1c] px-6 py-2.5 text-sm text-[#5a3a1c] hover:bg-[#5a3a1c] hover:text-white"
            >
              <MapPin className="h-4 w-4" />
              Voir sur Google Maps
            </a>
          </div>
          <iframe
            title="Plan d’accès Glorious Hall"
            src={contact.mapsEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-64 w-full border-0 grayscale-[30%] transition duration-700 hover:grayscale-0 md:h-full md:min-h-[18rem]"
          />
        </Reveal>
      </div>
    </section>
  )
}
