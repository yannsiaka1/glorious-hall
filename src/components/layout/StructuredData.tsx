import { capaciteTotale, inclus } from '@/content/offre'
import { services } from '@/content/services'
import { contact, site } from '@/content/site'

/**
 * Données structurées (schema.org, JSON-LD) : elles décrivent la salle aux
 * moteurs de recherche — type de lieu, adresse, téléphones, capacité,
 * équipements, prestations — pour qu'ils l'affichent comme un établissement
 * plutôt que comme un simple lien.
 *
 * Tout est tiré du contenu du site : rien n'est déclaré ici qui n'y figure
 * pas. Aucun avis n'est balisé : Google ignore les avis qu'un site publie sur
 * lui-même, et ceux de la page sont encore des exemples.
 */
export function StructuredData() {
  const salle = `${site.url}/#salle`
  const [principal] = contact.telephones

  const donnees = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['EventVenue', 'LocalBusiness'],
        '@id': salle,
        name: site.nom,
        description: site.description,
        url: `${site.url}/`,
        image: `${site.url}/og-image.jpg`,
        logo: `${site.url}/logo.png`,
        telephone: principal?.international,
        email: contact.courriel,
        address: {
          '@type': 'PostalAddress',
          streetAddress: contact.adresse.rue,
          addressLocality: `${contact.adresse.quartier}, ${contact.adresse.ville}`,
          addressRegion: contact.adresse.region,
          addressCountry: contact.adresse.pays,
        },
        hasMap: contact.plan,
        areaServed: { '@type': 'City', name: contact.adresse.ville },
        maximumAttendeeCapacity: capaciteTotale,
        amenityFeature: [
          ...inclus.map((prestation) => ({
            '@type': 'LocationFeatureSpecification',
            name: prestation.libelle.join(' ').replace('& ', 'et '),
            value: true,
          })),
          { '@type': 'LocationFeatureSpecification', name: 'Espace extérieur', value: true },
        ],
        contactPoint: contact.telephones.map((telephone) => ({
          '@type': 'ContactPoint',
          contactType: 'reservations',
          telephone: telephone.international,
          availableLanguage: 'fr',
        })),
        makesOffer: services.map((service) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: service.legende, description: service.texte },
        })),
      },
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#site`,
        url: `${site.url}/`,
        name: site.nom,
        inLanguage: 'fr',
        publisher: { '@id': salle },
      },
    ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(donnees) }} />
}
