import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

/**
 * Fichiers destinés aux moteurs de recherche, générés à partir du domaine
 * déclaré dans .env (VITE_SITE_URL) : un seul endroit à changer.
 */
function fichiersReferencement(urlSite: string): Plugin {
  let rendusServeur = false
  return {
    name: 'glorious-hall:referencement',
    apply: 'build',
    configResolved(config) {
      rendusServeur = Boolean(config.build.ssr)
    },
    generateBundle() {
      if (rendusServeur) return
      const site = urlSite.replace(/\/$/, '')
      const aujourdhui = new Date().toISOString().slice(0, 10)
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          `  <url>\n    <loc>${site}/</loc>\n    <lastmod>${aujourdhui}</lastmod>\n` +
          '    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n',
      })
    },
  }
}

/**
 * Précharge les polices affichées dès l'ouverture (titre manuscrit, titres et
 * texte) : elles arrivent avec la page au lieu d'être découvertes par la
 * feuille de style, ce qui évite le clignement du texte au chargement.
 */
function prechargementPolices(): Plugin {
  let base = '/'
  const POLICES = /(lavishly-yours|luxurious-roman|arimo)-latin-(400|700)-normal-[\w-]+\.woff2$/
  return {
    name: 'glorious-hall:polices',
    apply: 'build',
    configResolved(config) {
      base = config.base
    },
    transformIndexHtml: {
      order: 'post',
      handler(_html, contexte) {
        if (!contexte.bundle) return []
        return Object.keys(contexte.bundle)
          .filter((fichier) => POLICES.test(fichier))
          .map((fichier) => ({
            tag: 'link',
            attrs: { rel: 'preload', href: `${base}${fichier}`, as: 'font', type: 'font/woff2', crossorigin: '' },
            injectTo: 'head' as const,
          }))
      },
    },
  }
}

/**
 * Variables de construction :
 * - APERCU=1 : polices intégrées à la feuille de style (aperçu hébergé, qui
 *   n'accepte pas les fichiers de police séparés) ;
 * - MEDIAS=chemin/vers/medias.json : table « chemin du média → adresse » pour
 *   servir certains fichiers de public/ depuis un autre hébergement (CDN,
 *   stockage de l'aperçu). Voir src/lib/media.ts.
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apercu = Boolean(process.env['APERCU'])
  const fichierMedias = process.env['MEDIAS']
  const medias: Record<string, string> = fichierMedias ? JSON.parse(readFileSync(fichierMedias, 'utf8')) : {}

  return {
    // Site servi à la racine du domaine. L'aperçu, lui, peut être servi depuis
    // un sous-dossier : chemins relatifs.
    base: apercu ? './' : '/',
    plugins: [react(), tailwindcss(), fichiersReferencement(env['VITE_SITE_URL'] ?? ''), prechargementPolices()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    define: {
      __ANNEE__: JSON.stringify(new Date().getFullYear()),
      __MEDIAS__: JSON.stringify(medias),
    },
    build: {
      // Page unique : une seule feuille de style, plus simple à mettre en cache.
      cssCodeSplit: false,
      assetsInlineLimit: apercu ? (fichier: string) => (/\.woff2?$/.test(fichier) ? true : undefined) : undefined,
    },
  }
})
