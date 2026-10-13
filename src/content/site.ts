/**
 * Identité, coordonnées et navigation de Glorious Hall.
 *
 * Source unique : l'en-tête, le pied de page, la section contact, le plan
 * d'accès et les données structurées (SEO) lisent tous ce fichier. Changer un
 * numéro ici le change partout.
 *
 * Coordonnées reprises du site de référence (glorioushall.com) et des
 * génériques des vidéos officielles.
 */

const NUMERO_WHATSAPP = '237640823166'
const MESSAGE_WHATSAPP = 'Bonjour, j’aimerais avoir plus d’informations sur vos services.'

export const site = {
  nom: 'Glorious Hall',
  signature: 'Événements d’exception',
  /** Domaine public, défini une seule fois dans `.env` (VITE_SITE_URL). */
  url: import.meta.env.VITE_SITE_URL.replace(/\/$/, ''),
  description:
    'Glorious Hall, salle événementielle à Bonamoussadi, Douala : mariages, anniversaires, séminaires et réceptions. ' +
    'Salle climatisée et sonorisée, espace extérieur, décoration et organisation clé en main.',
} as const

export const contact = {
  whatsapp: `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(MESSAGE_WHATSAPP)}`,
  telephones: [
    { libelle: '+237 6 72 96 23 64', lien: 'tel:+237672962364', international: '+237672962364' },
    { libelle: '+237 6 40 82 31 66', lien: 'tel:+237640823166', international: '+237640823166' },
  ],
  courriel: 'info@glorioushall.com',
  adresse: {
    rue: 'Carrefour Témoin',
    quartier: 'Bonamoussadi',
    ville: 'Douala',
    region: 'Littoral',
    pays: 'CM',
  },
  /**
   * Adresse sur une ligne, écrite exactement comme sur la fiche Google : pour
   * le référencement local, elle doit être identique partout.
   */
  adresseComplete: 'Carrefour Témoin, Bonamoussadi, Douala',
  /** Indication d'accès, toujours affichée à part (Google la refuse dans l'adresse). */
  acces: 'Entrée après celle du Yapaki Prestige',
  plan: 'https://www.google.com/maps/search/?api=1&query=Carrefour+T%C3%A9moin+Bonamoussadi+Douala',
} as const

export const navigation = [
  { id: 'accueil', libelle: 'Accueil' },
  { id: 'services', libelle: 'Nos services' },
  { id: 'galerie', libelle: 'Galerie' },
  { id: 'a-propos', libelle: 'À propos' },
  { id: 'avis', libelle: 'Avis' },
  { id: 'contact', libelle: 'Contact' },
] as const

export type SectionId = (typeof navigation)[number]['id']
