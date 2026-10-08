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
# Les fichiers produits vont dans public/videos/ :
#   paysage/<slug>.mp4 ou portrait/<slug>.mp4   vidéo complète
#   affiches/<format>/<slug>.webp               image affichée avant la lecture
#   affiches/paysage/<slug>-petit.webp          vignette de la galerie (paysage)
#   apercus/<slug>.mp4                          aperçu de survol (paysage)
#
# Réglages :
# - H.264 « High » + AAC dans un MP4 : lu par tous les navigateurs, iPhone compris ;
# - `-movflags +faststart` : la lecture commence avant la fin du téléchargement ;
# - 30 images/s au plus et débit plafonné : poids raisonnable sur mobile.
# -----------------------------------------------------------------------------
set -euo pipefail

source_video="$1"
slug="$2"
format="$3"
affiche_a="${4:-3}"

racine="$(cd "$(dirname "$0")/.." && pwd)"
sortie="$racine/public/videos"
mkdir -p "$sortie/$format" "$sortie/affiches/$format" "$sortie/apercus"

if [[ "$format" == "portrait" ]]; then
  echelle="scale=-2:'min(960,ih)':flags=lanczos"
else
  echelle="scale='min(960,iw)':-2:flags=lanczos"
fi

ffmpeg -nostdin -v error -y -i "$source_video" \
  -vf "$echelle,fps='min(30,source_fps)'" \
  -c:v libx264 -preset slow -crf 27 -maxrate 1400k -bufsize 2800k \
  -profile:v high -pix_fmt yuv420p \
  -c:a aac -b:a 96k -ac 2 -movflags +faststart \
  "$sortie/$format/$slug.mp4"

ffmpeg -nostdin -v error -y -ss "$affiche_a" -i "$source_video" -frames:v 1 \
  -vf "$echelle" -c:v libwebp -quality 78 \
  "$sortie/affiches/$format/$slug.webp"

if [[ "$format" == "paysage" ]]; then
  ffmpeg -nostdin -v error -y -ss "$affiche_a" -i "$source_video" -frames:v 1 \
    -vf "scale=520:-2:flags=lanczos" -c:v libwebp -quality 74 \
    "$sortie/affiches/paysage/$slug-petit.webp"
  ffmpeg -nostdin -v error -y -ss "$affiche_a" -t 6 -i "$source_video" -an \
    -vf "scale=520:-2:flags=lanczos,fps=24" \
    -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart \
    "$sortie/apercus/$slug.mp4"
fi

echo "$slug ($format) : prêt."
