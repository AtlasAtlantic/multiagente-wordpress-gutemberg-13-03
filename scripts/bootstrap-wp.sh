#!/bin/sh
set -eu

cd /var/www/html

: "${WP_DB_HOST:=db:3306}"
: "${WP_DB_NAME:=wordpress}"
: "${WP_DB_USER:=wordpress}"
: "${WP_DB_PASSWORD:=wordpress123}"
: "${WP_TABLE_PREFIX:=wp_}"
: "${WP_SITE_URL:=https://wordpress-ai.local}"
: "${WP_SITE_TITLE:=WordPress Local}"
: "${WP_CORE_VERSION:=latest}"
: "${WP_CLI_MEMORY_LIMIT:=256M}"
: "${WP_CLI_CACHE_DIR:=/tmp/wp-cli-cache}"
: "${WP_ADMIN_USER:=admin}"
: "${WP_ADMIN_PASSWORD:=admin123456}"
: "${WP_ADMIN_EMAIL:=admin@wordpress-ai.local}"

mkdir -p "$WP_CLI_CACHE_DIR"
export WP_CLI_CACHE_DIR

wp_cmd() {
  php -d "memory_limit=${WP_CLI_MEMORY_LIMIT}" /usr/local/bin/wp "$@"
}

[ -d wp-content ] || mkdir -p wp-content

if [ ! -f wp-settings.php ]; then
  echo "Core files not found in shared volume. Downloading WordPress core..."
  if [ "$WP_CORE_VERSION" = "latest" ]; then
    wp_cmd core download --allow-root
  else
    wp_cmd core download --version="$WP_CORE_VERSION" --allow-root
  fi
fi

if [ ! -f wp-config.php ]; then
  echo "Creating wp-config.php..."
  wp_cmd config create \
    --dbname="$WP_DB_NAME" \
    --dbuser="$WP_DB_USER" \
    --dbpass="$WP_DB_PASSWORD" \
    --dbhost="$WP_DB_HOST" \
    --dbprefix="$WP_TABLE_PREFIX" \
    --skip-check \
    --allow-root
fi

[ -w wp-content ] && mkdir -p wp-content/uploads || true

echo "Waiting for database availability..."
until wp_cmd db check --allow-root >/dev/null 2>&1; do
  sleep 2
done

if ! wp_cmd core is-installed --allow-root >/dev/null 2>&1; then
  echo "Installing WordPress..."
  wp_cmd core install \
    --url="$WP_SITE_URL" \
    --title="$WP_SITE_TITLE" \
    --admin_user="$WP_ADMIN_USER" \
    --admin_password="$WP_ADMIN_PASSWORD" \
    --admin_email="$WP_ADMIN_EMAIL" \
    --skip-email \
    --allow-root
else
  echo "WordPress is already installed."
fi

wp_cmd option update home "$WP_SITE_URL" --allow-root >/dev/null
wp_cmd option update siteurl "$WP_SITE_URL" --allow-root >/dev/null

echo "Bootstrap finished."
