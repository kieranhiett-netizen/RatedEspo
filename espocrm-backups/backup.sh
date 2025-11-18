#!/bin/bash

# === Configuration ===
BACKUP_DIR="/home/ubuntu/espocrm-backups"
DATE=$(date +"%Y-%m-%d_%H-%M")
DB_NAME="espocrm"
DB_USER="espocrm"
DB_PASS="database_password"
APP_CONTAINER="espocrm"
DB_CONTAINER="espocrm-db"

# === Create backup folder ===
mkdir -p "$BACKUP_DIR/$DATE"

# === Backup database ===
docker exec $DB_CONTAINER sh -c "mariadb-dump -u$DB_USER -p$DB_PASS $DB_NAME" > "$BACKUP_DIR/$DATE/db.sql"

# === Backup CRM files ===
docker cp $APP_CONTAINER:/var/www/html "$BACKUP_DIR/$DATE/html"

# === Compress backup ===
tar -czf "$BACKUP_DIR/espocrm-backup-$DATE.tar.gz" -C "$BACKUP_DIR" "$DATE"

# === Cleanup uncompressed folder ===
rm -rf "$BACKUP_DIR/$DATE"

# === Delete backups older than 14 days ===
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +14 -delete
