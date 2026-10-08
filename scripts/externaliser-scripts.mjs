/**
 * Sort les scripts en ligne du HTML généré (repris de Precious).
 *
 * Pourquoi : la politique de sécurité du contenu (CSP, vercel.json) autorise
 * `script-src 'self'`, c'est-à-dire uniquement des fichiers servis par le
 * domaine. Un `<script>` écrit directement dans la page serait refusé.
 *
 * vite-react-ssg insère un tel script pour exposer son identifiant de build.
 * Plutôt que d'affaiblir la CSP avec `unsafe-inline`, on déplace son contenu
 * dans un fichier. Les blocs `application/ld+json` (données structurées) ne
 * sont pas concernés : ils ne sont pas exécutés et doivent rester dans la page.
 *
 * Le script retire aussi le manifeste de données que vite-react-ssg écrit
 * pour les sites à plusieurs pages, inutile pour une page unique.
 *
 *   node scripts/externaliser-scripts.mjs
 */
import { createHash } from 'node:crypto'
import { readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const DIST = 'dist'
const PAGE = join(DIST, 'index.html')

let html = await readFile(PAGE, 'utf8')

// <script> sans attribut src et sans type « application/ld+json »
const motif = /<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g

let sortis = 0
for (const trouve of [...html.matchAll(motif)]) {
  const code = trouve[1]?.trim()
  if (!code) continue
  // Nom dérivé du contenu : il change avec le code, le cache ne sert jamais une version périmée.
  const empreinte = createHash('sha256').update(code).digest('hex').slice(0, 10)
  const fichier = `assets/inline-${empreinte}.js`
  await writeFile(join(DIST, fichier), `${code}\n`, 'utf8')
  html = html.replace(trouve[0], `<script src="/${fichier}"></script>`)
  sortis += 1
}
await writeFile(PAGE, html, 'utf8')

for (const nom of await readdir(DIST)) {
  if (nom.startsWith('static-loader-data-manifest-')) await rm(join(DIST, nom))
}

console.log(
  sortis === 0 ? 'Aucun script en ligne à sortir.' : `${sortis} script(s) en ligne déplacé(s) vers un fichier.`,
)
