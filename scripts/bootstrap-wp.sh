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
: "${WP_ADMIN_USER:=admin}"
: "${WP_ADMIN_PASSWORD:=admin123456}"
: "${WP_ADMIN_EMAIL:=admin@wordpress-ai.local}"

echo "Waiting for WordPress core files..."
attempts=0
while [ ! -f wp-settings.php ] && [ "$attempts" -lt 40 ]; do
  attempts=$((attempts + 1))
  sleep 2
done

if [ ! -f wp-settings.php ]; then
  echo "Core files not found in shared volume. Downloading with WP-CLI..."
  wp core download --allow-root
fi

if [ ! -f wp-config.php ]; then
  echo "Creating wp-config.php..."
  wp config create \
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
until wp db check --allow-root >/dev/null 2>&1; do
  sleep 2
done

if ! wp core is-installed --allow-root >/dev/null 2>&1; then
  echo "Installing WordPress..."
  wp core install \
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

wp option update home "$WP_SITE_URL" --allow-root >/dev/null
wp option update siteurl "$WP_SITE_URL" --allow-root >/dev/null

echo "Bootstrap finished."
