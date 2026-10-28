#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# Prépare une vidéo pour le site : version complète (avec le son), affiche
# fixe et, pour les vidéos horizontales, un aperçu muet de 6 s pour la galerie.
#
#   scripts/encoder-video.sh <source.mp4> <slug> <paysage|portrait> [seconde-affiche]
#
# Exemple :
#   scripts/encoder-video.sh ~/Téléchargements/mariage.mp4 mariage-vert-or paysage 4
#
# Source à bandes noires : indiquer la zone utile dans RECADRAGE (largeur:hauteur:x:y),
# relevée avec `ffmpeg -i source.mp4 -vf cropdetect -f null -`. Exemple :
#   RECADRAGE=640:278:0:38 scripts/encoder-video.sh source.mp4 reception-jardin paysage 3
#
# Les fichiers produits vont dans public/videos/ :
#   paysage/<slug>.mp4 ou portrait/<slug>.mp4   vidéo complète
#   affiches/<format>/<slug>.webp               image affichée avant la lecture
#   affiches/paysage/<slug>-petit.webp          vignette de la galerie (paysage)
#   apercus/<slug>.mp4                          aperçu de survol (paysage)
#
# Réglages communs :
# - H.264 « High » + AAC dans un MP4 : lu par tous les navigateurs, iPhone compris ;
# - `-movflags +faststart` : la lecture commence avant la fin du téléchargement ;
# - 30 images/s au plus : au-delà, le poids augmente sans gain visible sur ces plans.
#
# Réglages propres à chaque format, parce que les deux ne sont pas vus de la même façon :
# - paysage : galerie, visionneuse et mode cinéma, où la vidéo est montrée nette et
#   en grand. Jusqu'à 1280 px de large et CRF 24 : mesuré sur trois sources, CRF 24
#   conserve 86 à 91 % du détail de la source, contre 79 à 86 % au CRF 27, pour
#   environ 40 % de poids en plus ;
# - portrait : fond du hero sur téléphone, flouté sauf en mode cinéma, et chargé
#   d'office en données mobiles. On garde 960 px de haut et CRF 27 : le détail
#   gagné ne se verrait pas sous le flou, le poids si.
# -----------------------------------------------------------------------------
set -euo pipefail

source_video="$1"
slug="$2"
format="$3"
affiche_a="${4:-3}"

racine="$(cd "$(dirname "$0")/.." && pwd)"
sortie="$racine/public/videos"
mkdir -p "$sortie/$format" "$sortie/affiches/$format" "$sortie/apercus"

# Zone utile de l'image, avant toute mise à l'échelle.
recadrage="${RECADRAGE:+crop=$RECADRAGE,}"

if [[ "$format" == "portrait" ]]; then
  echelle="${recadrage}scale=-2:'min(960,ih)':flags=lanczos"
  # L'affiche suit la vidéo : même taille, mêmes proportions.
  echelle_affiche="$echelle"
  crf=27
  debit=1400
else
  echelle="${recadrage}scale='min(1280,iw)':-2:flags=lanczos"
  # L'affiche fait au moins 960 px : la galerie l'affiche en grand, et un
  # agrandissement Lanczos fait ici reste plus net que celui du navigateur.
  echelle_affiche="${recadrage}scale='if(gt(iw,960),min(1280,iw),960)':-2:flags=lanczos"
  crf=24
  debit=2200
fi

ffmpeg -nostdin -v error -y -i "$source_video" \
  -vf "$echelle,fps='min(30,source_fps)'" \
  -c:v libx264 -preset slow -crf "$crf" -maxrate "${debit}k" -bufsize "$((debit * 2))k" \
  -profile:v high -pix_fmt yuv420p \
  -c:a aac -b:a 96k -ac 2 -movflags +faststart \
  "$sortie/$format/$slug.mp4"

ffmpeg -nostdin -v error -y -ss "$affiche_a" -i "$source_video" -frames:v 1 \
  -vf "$echelle_affiche" -c:v libwebp -quality 78 \
  "$sortie/affiches/$format/$slug.webp"

if [[ "$format" == "paysage" ]]; then
  ffmpeg -nostdin -v error -y -ss "$affiche_a" -i "$source_video" -frames:v 1 \
    -vf "${recadrage}scale=520:-2:flags=lanczos" -c:v libwebp -quality 74 \
    "$sortie/affiches/paysage/$slug-petit.webp"
  ffmpeg -nostdin -v error -y -ss "$affiche_a" -t 6 -i "$source_video" -an \
    -vf "${recadrage}scale=520:-2:flags=lanczos,fps=24" \
    -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart \
    "$sortie/apercus/$slug.mp4"
fi

echo "$slug ($format) : prêt."
