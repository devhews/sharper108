# GitHub-ready source package

This package is prepared from the most recent available **Seamless Cinematic Home V4** source archive. It has not been verified against the exact source of the live Cloudflare deployment. Compare changes before tagging a production release.

## Sensitive data
- `scripts/source-backup.json` (staff and building records) was intentionally excluded.
- `.env.local`, service-role keys, passwords, `node_modules`, and `dist` are not included.
- Use `.env.example` to document required settings. Never commit real `.env.*` files or staff backups.
- Review all files for sensitive content before committing, and keep a separate secure backup of the live Supabase database.

## First upload
```bash
git init -b main
git add .
git status
git commit -m "Initial source baseline for Australia 108 Supervisor Guide"
git remote add origin https://github.com/YOUR-USERNAME/australia108-sharper-supervisor-guide.git
git push -u origin main
```
Do not use a production release tag until the source has been compared with your live deployed version and tested.
