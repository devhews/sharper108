AUSTRALIA 108 – SEAMLESS HOME V4

1. Keep your existing .env.local (Supabase URL and publishable key).
2. Run: npm install
3. Run: npm run typecheck && npm test && npm run build
4. Confirm dist/a108-seamless-background.webp exists.
5. On Cloudflare Pages > your EXISTING a108 project > Deployments > Create deployment, choose PRODUCTION and upload the entire new dist folder.
6. Visit https://a108.pages.dev/a108-seamless-background.webp and confirm the new image loads.
7. Open https://a108.pages.dev/?v=4 and hard-refresh.

Only presentation styles/assets were changed. No Supabase data, policies or roster logic changed.
The photo-derived background is based on the approved graphical mockup, not a documentary photo of the building.
