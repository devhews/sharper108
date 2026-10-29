# Exact-look homepage deployment

This is the COMPLETE React project, preserving all routes, Supabase data access, permissions, and reports. Changes are scoped to homepage CSS and background photo only.

1. Extract this ZIP. Work inside `australia108-web`.
2. Copy your existing `.env.local` into this folder (Project URL and PUBLISHABLE key only, never service-role key).
3. In Windows Command Prompt in the folder run:
   `set "PATH=C:\Program Files\nodejs;%PATH%"`
   `npm install`
   `npm run typecheck`
   `npm test`
   `npm run build`
4. Confirm `dist/index.html` and `dist/home-tower.jpg` exist.
5. On Cloudflare: select the project which hosts **a108.pages.dev**. Use Deployments > Create deployment (Production). Upload the contents of `dist`, with `index.html` at the top level.
6. Check Cloudflare's production deployment URL, then open https://a108.pages.dev/?design=v3 and hard-refresh (Ctrl+Shift+R).
7. If the preview URL is new but `a108.pages.dev` is still old, check Domains and that the deployment is Production, not Preview.

Visual changes are CSS. Your Supabase database must not be reset or reimported.
