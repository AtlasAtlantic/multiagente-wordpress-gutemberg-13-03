#!/bin/sh
set -eu

PROJECT_NAME="${1:-wordpress-ai-stack}"
PROJECT_DOMAIN="${2:-${PROJECT_NAME}.local}"
PROJECT_TITLE="${3:-WordPress AI Stack}"
ADMIN_EMAIL="${4:-admin@${PROJECT_DOMAIN}}"

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
ENV_FILE="$ROOT_DIR/.env"
EXAMPLE_FILE="$ROOT_DIR/.env.example"

if [ ! -f "$EXAMPLE_FILE" ]; then
  echo "Falta .env.example en $ROOT_DIR" >&2
  exit 1
fi

cp "$EXAMPLE_FILE" "$ENV_FILE"

sed -i.bak \
  -e "s#^COMPOSE_PROJECT_NAME=.*#COMPOSE_PROJECT_NAME=${PROJECT_NAME}#" \
  -e "s#^WP_DOMAIN=.*#WP_DOMAIN=${PROJECT_DOMAIN}#" \
  -e "s#^WP_SITE_URL=.*#WP_SITE_URL=https://${PROJECT_DOMAIN}#" \
  -e "s#^WP_SITE_TITLE=.*#WP_SITE_TITLE=${PROJECT_TITLE}#" \
  -e "s#^WP_ADMIN_EMAIL=.*#WP_ADMIN_EMAIL=${ADMIN_EMAIL}#" \
  -e "s#^PLAYWRIGHT_BASE_URL=.*#PLAYWRIGHT_BASE_URL=https://${PROJECT_DOMAIN}#" \
  "$ENV_FILE"
rm -f "$ENV_FILE.bak"

echo "Proyecto inicializado."
echo "- Nombre: ${PROJECT_NAME}"
echo "- Dominio: ${PROJECT_DOMAIN}"
echo "- Titulo: ${PROJECT_TITLE}"
echo ""
echo "Siguientes pasos:"
echo "1. Anade '127.0.0.1 ${PROJECT_DOMAIN}' a /etc/hosts"
echo "2. Ejecuta: docker compose up -d"
