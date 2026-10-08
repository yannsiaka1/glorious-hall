/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Domaine public du site, sans barre finale (fichier .env). */
  readonly VITE_SITE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** Année de la construction du site (pied de page), fixée par vite.config.ts. */
declare const __ANNEE__: number

/** Hébergement alternatif de certains médias (voir src/lib/media.ts). */
declare const __MEDIAS__: Readonly<Record<string, string>>
