#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$REPO_ROOT/espocrm-docker/docker-compose.yml"
PACKAGE_INPUT="${1:-}"

if [[ -z "$PACKAGE_INPUT" ]]; then
  echo "Usage: $0 path/to/package.zip" >&2
  echo "Example: $0 extensions/packages/rated-magic-buttons-1.0.0.zip" >&2
  exit 1
fi

if [[ "$PACKAGE_INPUT" = /* ]]; then
  PACKAGE_PATH="$PACKAGE_INPUT"
else
  PACKAGE_PATH="$REPO_ROOT/$PACKAGE_INPUT"
fi

if [[ ! -f "$PACKAGE_PATH" ]]; then
  echo "Package not found: $PACKAGE_PATH" >&2
  exit 1
fi

PACKAGE_NAME="$(basename "$PACKAGE_PATH")"
CONTAINER_TMP="/tmp/$PACKAGE_NAME"

copy_package() {
  echo "Copying $PACKAGE_NAME into espocrm container..."
  docker compose -f "$COMPOSE_FILE" cp "$PACKAGE_PATH" espocrm:"$CONTAINER_TMP"
}

install_package() {
  echo "Installing extension via EspoCRM CLI..."
  docker compose -f "$COMPOSE_FILE" exec -T espocrm php command.php extension:install "$CONTAINER_TMP" --force
}

rebuild_espo() {
  echo "Running EspoCRM rebuild..."
  docker compose -f "$COMPOSE_FILE" exec -T espocrm php command.php rebuild
}

cleanup() {
  echo "Cleaning up temporary package..."
  docker compose -f "$COMPOSE_FILE" exec -T espocrm rm -f "$CONTAINER_TMP" >/dev/null 2>&1 || true
}

copy_package
install_package
rebuild_espo
cleanup

echo "Extension installation complete."
