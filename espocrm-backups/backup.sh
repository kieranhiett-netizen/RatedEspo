#!/usr/bin/env bash
set -e

DATE=$(date +%F_%H-%M)
BACKUP_DIR="/tmp/espo-backup-$DATE"
BACKUP_TAR="espocrm-backup-$DATE.tar.gz"

mkdir -p "$BACKUP_DIR/html"

echo "[*] Copying app files from espocrm volume..."
docker run --rm \
  -v espocrm:/var/www/html \
  -v "$BACKUP_DIR/html":/backup \
  ubuntu bash -c "cp -a /var/www/html/. /backup/"

echo "[*] Dumping database from espocrm-db..."
docker exec espocrm-db \
  mariadb-dump -uespocrm -p'database_password' espocrm \
  > "$BACKUP_DIR/espocrm-db.sql"

echo "[*] Creating tarball $BACKUP_TAR ..."
tar -czf "$BACKUP_TAR" -C "$BACKUP_DIR" .

echo "[*] Cleaning up temp directory..."
rm -rf "$BACKUP_DIR"

echo "[*] Done. Created $(pwd)/$BACKUP_TAR"
#!/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# === Configuration ===
BACKUP_DIR="/home/ubuntu/RatedEspo/espocrm-backups"
DATE=$(date +"%Y-%m-%d_%H-%M")
DB_NAME="espocrm"
DB_USER="espocrm"
DB_PASS="database_password"
APP_CONTAINER="espocrm"
DB_CONTAINER="espocrm-db"

# === Create backup folder ===
mkdir -p "$BACKUP_DIR/$DATE"

echo "[$DATE] Starting backup..."

# === Backup database ===
echo "Dumping database..."
/usr/bin/docker exec "$DB_CONTAINER" mysqldump -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$BACKUP_DIR/$DATE/espocrm-db.sql"

# === Backup CRM files ===
echo "Copying application files..."
/usr/bin/docker cp "$APP_CONTAINER:/var/www/html" "$BACKUP_DIR/$DATE/html"

# === Compress backup ===
echo "Compressing..."
/usr/bin/tar -czf "$BACKUP_DIR/espocrm-backup-$DATE.tar.gz" -C "$BACKUP_DIR" "$DATE"

# === Cleanup uncompressed folder ===
echo "Cleaning up temporary folder..."
rm -rf "$BACKUP_DIR/$DATE"

# === Delete backups older than 14 days ===
echo "Removing backups older than 14 days..."
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +14 -delete

echo "[$DATE] Backup completed successfully."
