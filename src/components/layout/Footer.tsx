import { motion } from 'motion/react'
import { ArrowRight, ChevronRight, Headphones, Mail, MapPin, Phone } from 'lucide-react'
import logo from '@/assets/img/logo-clair.webp'
import feuillesDroite from '@/assets/img/pied-feuilles-d.webp'
import feuillesGauche from '@/assets/img/pied-feuilles-g.webp'
import ornement from '@/assets/img/pied-ornement.webp'
import vague from '@/assets/img/pied-vague.webp'
import reception from '@/assets/img/reception.webp'
import { Icon } from '@/components/ui/Icon'
import { MapCard } from '@/components/ui/MapCard'
import { Reveal } from '@/components/ui/Reveal'
import { inclus, options } from '@/content/offre'
import { contact, navigation, site } from '@/content/site'
import { useDefileur } from '@/lib/defileur'

function TitreColonne({ children }: { children: string }) {
  return (
    <h3 className="font-roman text-[clamp(1.3rem,1.55vw,1.6rem)] whitespace-nowrap text-gold-300">
      {children}
      <motion.span
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.3 }}
        className="mt-2 block h-0.5 w-10 origin-left bg-gold-300"
      />
    </h3>
  )
}

/** Pied de page repris de la maquette « Pied de page luxueux » (décors dorés extraits de la maquette). */
export function Footer() {
  const defileur = useDefileur()

  return (
    <footer data-theme="sombre" className="relative overflow-hidden bg-black text-white">
      <img
        src={reception}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover opacity-55 blur-[3px]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.25)_0%,rgb(0_0_0/0.8)_38%,#000_78%)]" />
      <img
        src={feuillesGauche}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute bottom-[calc(3.6rem+1vw)] left-0 w-[7.5vw] min-w-16 mix-blend-screen"
      />
      <img
        src={feuillesDroite}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute right-0 bottom-[calc(3.6rem+1vw)] w-[3.2vw] min-w-6 mix-blend-screen"
      />

      <div className="relative grid gap-12 page-x pt-28 pb-10 sm:grid-cols-2 lg:gap-x-[2.2vw] lg:gap-y-12 lg:pt-[13vw] lg:pb-[2.5vw] xl:grid-cols-[1.05fr_0.65fr_1.4fr_1.1fr_1.65fr]">
        <Reveal className="text-center sm:col-span-2 xl:col-span-1">
          <img src={logo} alt={site.nom} loading="lazy" className="mx-auto w-[clamp(7rem,8.5vw,9rem)] animate-float" />
          <p className="mt-3 text-[0.66rem] tracking-[0.24em] whitespace-nowrap text-white/90 uppercase">
            {site.signature}
          </p>
          <span className="mx-auto mt-4 block h-px w-24 bg-gold-300/70" />
          <p className="mt-4 font-script text-[clamp(1.8rem,2.05vw,2.2rem)] leading-[1.25] text-gold-300">
            Le lieu où vos
            <br />
            meilleurs souvenirs
            <br />
            prennent vie.
          </p>
          <span className="mx-auto mt-4 block h-px w-24 bg-gold-300/70" />
        </Reveal>

        <Reveal delai={0.08}>
          <nav aria-label="Plan du site">
            <TitreColonne>Navigation</TitreColonne>
            <ul className="mt-6 space-y-3 text-[0.92rem]">
              {navigation.map(({ id, libelle }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(evenement) => {
                      evenement.preventDefault()
                      defileur.allerA(id)
                    }}
                    className="group flex w-full max-w-44 items-center justify-between text-white/90 transition-colors hover:text-gold-300"
                  >
                    {libelle}
                    <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>

        <Reveal delai={0.16}>
          <TitreColonne>Nos services</TitreColonne>
          <ul className="mt-6 space-y-3 text-[0.9rem]">
            {inclus.slice(0, 4).map((prestation) => (
              <li key={prestation.icone} className="group flex items-center gap-4 text-white/90">
                <Icon
                  nom={prestation.icone}
                  className="h-6 w-6 shrink-0 text-gold-300 transition-transform duration-300 group-hover:scale-110"
                />
                {prestation.libelle.join(' ')}
              </li>
            ))}
          </ul>
          <span className="my-5 block h-px bg-gold-300/30" />
          <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-[0.78rem] leading-snug">
            {options.map((prestation) => (
              <li key={prestation.icone} className="group flex items-center gap-2.5 text-white/85">
                <Icon
                  nom={prestation.icone}
                  className="h-5 w-5 shrink-0 text-gold-300 transition-transform duration-300 group-hover:scale-110"
                />
                {prestation.libelle.join(' ')}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delai={0.24}>
          <TitreColonne>Notre emplacement</TitreColonne>
          <address className="not-italic">
            <ul className="mt-6 space-y-4 text-[0.9rem] text-white/90">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-6 w-6 shrink-0 fill-gold-300 text-black" aria-hidden="true" />
                {contact.adresseCourte}
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-6 w-6 shrink-0 fill-gold-300 text-gold-300" aria-hidden="true" />
                <span className="flex flex-col">
                  {contact.telephones.map((telephone) => (
                    <a key={telephone.lien} href={telephone.lien} className="hover:text-gold-300">
                      {telephone.libelle}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-6 w-6 shrink-0 text-gold-300" aria-hidden="true" />
                <a href={`mailto:${contact.courriel}`} className="break-all hover:text-gold-300">
                  {contact.courriel}
                </a>
              </li>
            </ul>
          </address>
        </Reveal>

        <Reveal delai={0.32} className="sm:col-span-2 xl:col-span-1">
          <MapCard className="aspect-[1.65] w-full rounded-[1.6rem] border border-gold-300/70" />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <a
              href={contact.plan}
              target="_blank"
              rel="noreferrer"
              className="btn min-h-11 gap-1.5 rounded-full bg-gradient-to-b from-[#c49349] to-[#8a5f22] px-3 text-[0.72rem] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35)] hover:brightness-110"
            >
              <MapPin className="h-4 w-4 shrink-0 fill-white" aria-hidden="true" />
              <span className="whitespace-nowrap">Voir sur Google Maps</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </a>
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="btn min-h-11 gap-1.5 rounded-full border border-gold-300 px-3 text-[0.72rem] text-white hover:bg-gold-300 hover:text-ink"
            >
              <Headphones className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="whitespace-nowrap">Nous contacter</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>

      {/* Vagues dorées de la maquette, puis barre de bas de page */}
      <img
        src={vague}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none relative block h-[clamp(2.2rem,3.8vw,4.5rem)] w-full object-cover mix-blend-screen"
      />
      <div className="relative border-t border-gold-300/80 bg-black">
        <div className="flex flex-col items-center justify-between gap-3 page-x py-5 text-[0.7rem] tracking-[0.22em] text-white/85 sm:flex-row">
          <p className="text-center">
            © {__ANNEE__} {site.nom.toUpperCase()} · Tous droits réservés.
          </p>
          <img
            src={ornement}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="hidden h-6 mix-blend-screen md:block"
          />
          <a href={contact.whatsapp} target="_blank" rel="noreferrer" className="tracking-[0.1em] hover:text-gold-300">
            Nous contacter
          </a>
        </div>
      </div>
    </footer>
  )
}
