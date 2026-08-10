#!/usr/bin/env bash
# El proyecto de Vercel está configurado con framework "Other", build
# `bash build.sh` y output `dist`. La web no tiene dependencias ni
# compilación: esto solo junta en dist/ lo que hay que publicar, que es lo
# que esa configuración espera encontrar.
set -euo pipefail

rm -rf dist
mkdir -p dist

# Páginas sueltas en la raíz
cp index.html aviso-legal.html privacidad.html sitemap.xml robots.txt dist/

# Cada sección es una carpeta con index.html dentro: así la URL queda limpia
# y sin extensión.
for seccion in work films music ads directors studio contact real-estate; do
  cp -R "$seccion" "dist/$seccion"
done

cp -R assets dist/assets
cp -R data   dist/data

echo "dist listo:"
ls -1 dist
