# EspoCRM Extension Workflow

This folder keeps everything needed to build and deploy our custom EspoCRM extensions.

## Directory layout

- `source/` – human-friendly source code for each extension. Create one folder per extension, e.g. `source/rated-magic-buttons`.
- `packages/` – distributable `.zip` files generated from the source. Commit these so we can deploy the exact build that was reviewed.
- `install-extension.sh` – helper script that copies a package into the EspoCRM container, runs the Espo CLI installer, and triggers a rebuild.

## Building an extension

1. Create a new folder inside `source/` using Espo's extension builder or manual scaffolding.
2. Implement and test locally. You can use the same Docker Compose stack (`espocrm-docker/`) to spin up a dev environment.
3. Zip the extension following Espo's packaging rules and drop the archive into `packages/` (use a semantic version in the filename, e.g. `rated-magic-buttons-1.0.0.zip`).

> Tip: keep any build scripts you use inside the relevant source folder so future changes are reproducible.

## Installing an extension on Docker / the VM

From the repo root run:

```bash
./extensions/install-extension.sh extensions/packages/rated-magic-buttons-1.0.0.zip
```

The script will:

1. Copy the zip into the running `espocrm` container.
2. Run `php command.php extension:install`.
3. Run `php command.php rebuild` so metadata and clients pick up the changes.
4. Remove the temporary zip from the container to keep things tidy.

This works both on your laptop (against the local Docker stack) and on the VM, as long as `espocrm-docker/docker-compose.yml` is the active stack.

## Creating new workflows

If we add CI/CD later, GitHub Actions can watch `packages/` and automatically run the installer on the VM or build artifacts for download. For now, committing both the source and the package keeps everything auditable.
