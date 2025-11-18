This repo contains the files used to run our EspoCRM instance — mainly the Docker setup, reverse proxy config, and backup script. The actual EspoCRM application runs inside Docker, so we only version the bits we control.

What’s Here
espocrm-docker/
  ├── docker-compose.yml   # Defines the EspoCRM, MariaDB, and Caddy containers
  └── Caddyfile            # Handles HTTPS and routing

espocrm-backups/
  └── backup.sh            # Script used to create daily backups

.gitignore                 # Keeps backups and other generated files out of Git

How It Works

Docker Compose runs the full stack (EspoCRM + database + Caddy).

Caddy provides HTTPS and reverse proxy.

backup.sh creates timestamped backups on the VM.

The EspoCRM app itself comes from the official Docker image — we don’t store its code here.

Using This Repo
Local (for editing + Cursor)

Clone the repo locally and open it in Cursor:

git clone git@github.com:kieranhiett-netizen/RatedEspo.git
cd RatedEspo
cursor .

On the Server (for deployment)

Pull changes and restart the stack:

cd ~/RatedEspo
git pull
docker compose down
docker compose up -d

Notes

Extensions workflow

- `extensions/source/` – source code for each custom EspoCRM extension (one folder per extension).
- `extensions/packages/` – zipped extension builds that get installed on Espo; commit them so deployments are reproducible.
- `extensions/install-extension.sh` – helper script that copies a package into the `espocrm` container, runs Espo’s CLI installer, and triggers a rebuild. Usage:

```
./extensions/install-extension.sh extensions/packages/my-extension-1.0.0.zip
```

Backups and database dumps are intentionally excluded from Git.