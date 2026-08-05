#!/usr/bin/env bash
# El proyecto de Vercel está configurado con framework "Other", build
# `bash build.sh` y output `dist`. La web no tiene dependencias ni compilación:
# esto solo junta en dist/ lo que hay que publicar, que es lo que esa
# configuración espera encontrar.
set -euo pipefail

rm -rf dist
mkdir -p dist

cp index.html aviso-legal.html privacidad.html dist/
cp -R assets dist/assets

echo "dist listo:"
ls -1 dist
