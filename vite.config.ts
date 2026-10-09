import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Connect, type Logger, type Plugin } from 'vite'

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
 * Contrôle des vidéos en développement (`npm run dev`) et en prévisualisation
 * (`npm run preview`). Les vidéos sont livrées à part du code : si elles ne
 * sont pas dans public/videos, Vite répond par la page d'accueil, la vidéo
 * échoue sans aucun message et seule l'affiche reste visible. Ce plugin :
 * - affiche au démarrage le bilan des vidéos et affiches de
 *   src/content/videos.ts absentes du disque ;
 * - répond 404 à un média absent et le nomme dans le terminal.
 */
function controleMedias(): Plugin {
  const MEDIA = /^\/videos\/.+\.(mp4|webm|webp)$/

  const repondre404 = (racine: string, journal: Logger): Connect.NextHandleFunction => {
    const dejaSignales = new Set<string>()
    return (requete, reponse, suivant) => {
      let chemin: string
      try {
        chemin = decodeURIComponent((requete.url ?? '').split('?')[0] ?? '')
      } catch {
        return suivant()
      }
      const fichier = path.join(racine, chemin)
      if (!MEDIA.test(chemin) || !fichier.startsWith(racine + path.sep) || existsSync(fichier)) return suivant()
      if (!dejaSignales.has(chemin)) {
        dejaSignales.add(chemin)
        journal.warn(`Média introuvable : ${path.relative(process.cwd(), fichier)}`, { timestamp: true })
      }
      reponse.statusCode = 404
      reponse.end()
    }
  }

  return {
    name: 'glorious-hall:medias',
    configureServer(serveur) {
      const { base, logger, publicDir } = serveur.config
      serveur.middlewares.use(repondre404(publicDir, logger))

      // Bilan à partir du catalogue réel (src/content/videos.ts) : toute
      // chaîne d'un tableau exporté qui désigne un fichier de public/videos.
      serveur.httpServer?.once('listening', () => {
        setTimeout(async () => {
          try {
            const catalogue: Record<string, unknown> = await serveur.ssrLoadModule('/src/content/videos.ts')
            const attendus = new Set<string>()
            for (const liste of Object.values(catalogue)) {
              if (!Array.isArray(liste)) continue
              for (const element of liste) {
                if (typeof element !== 'object' || element === null) continue
                for (const valeur of Object.values(element)) {
                  if (typeof valeur === 'string' && valeur.startsWith(`${base}videos/`)) {
                    attendus.add(valeur.slice(base.length))
                  }
                }
              }
            }
            const manquants = [...attendus].filter((chemin) => !existsSync(path.join(publicDir, chemin)))
            const videos = [...attendus].filter((chemin) => chemin.endsWith('.mp4')).length
            if (manquants.length === 0) {
              logger.info(
                `  Médias : ${videos} vidéos et ${attendus.size - videos} affiches présentes dans public/videos.`,
              )
              return
            }
            const parDossier = new Map<string, number>()
            for (const chemin of manquants) {
              const dossier = path.dirname(chemin)
              parDossier.set(dossier, (parDossier.get(dossier) ?? 0) + 1)
            }
            logger.warn(
              [
                `\n  ${manquants.length} média(s) sur ${attendus.size} absent(s) du disque :`,
                ...[...parDossier].map(
                  ([dossier, nombre]) => `    public/${dossier}/ : ${nombre} fichier(s) manquant(s)`,
                ),
                '  Les vidéos sont livrées à part du code (archives glorious-hall-videos-*.zip) :',
                '  voir README, section « Vidéos ».\n',
              ].join('\n'),
            )
          } catch {
            // Le bilan est une aide : il ne doit jamais gêner le démarrage.
          }
        }, 300)
      })
    },
    configurePreviewServer(serveur) {
      const racine = path.resolve(serveur.config.root, serveur.config.build.outDir)
      serveur.middlewares.use(repondre404(racine, serveur.config.logger))
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
    plugins: [
      react(),
      tailwindcss(),
      fichiersReferencement(env['VITE_SITE_URL'] ?? ''),
      prechargementPolices(),
      controleMedias(),
    ],
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
