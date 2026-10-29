# Australia 108 | Sharper Supervisor Guide

## Delivery status
A **production-oriented source project**, not a deployed live website. Built from the provided October 23 backup and approved home page. Requires an owner-controlled Supabase and Cloudflare project. The web app has no hardcoded user passwords or service-role keys.

## Features
- Dark premium responsive theme, real Australia 108 photo and Sharper logo, Melbourne seconds clock
- Large global search, clickable staff profiles, roster edit/delete, weekday/weekend day/night groups
- PDF and CSV downloads generated from the exact same in-memory report dataset
- Building references, unresolved cleaning cases, staff directory, supervisor-only backup
- Supabase realtime change subscriptions plus focus refetch; central CRUD
- Database RLS: supervisor may write, staff account may only read

## Setup (accounts owned by Sharper)
1. Create a **free Supabase** project. In Supabase SQL Editor, run `sql/001_schema.sql`. It is intended for a *new* database, and should be run once.
2. In Authentication → Users, create **two** email/password users manually: one supervisor, one shared staff-read-only account. Turn off public self-registration and do not allow anonymous authentication. These are two different credentials, not individual staff accounts.
3. Copy their authentication user UUIDs and run the following SQL in Supabase SQL Editor (replace placeholders):
   ```sql
   insert into public.app_members(user_id,role) values
     ('SUPERVISOR_AUTH_UUID','supervisor'),
     ('STAFF_AUTH_UUID','staff');
   ```
4. In Supabase project settings obtain **Project URL** and **publishable/anon key**, which may be used in frontend code. Copy `.env.example` to `.env.local` and fill those two variables. **Never** put a service role key in frontend code.
5. Run `npm install`, `npm run typecheck`, `npm test`, `npm run build`.
6. Import the **original** roster on an administrator-controlled computer. Set shell environment variables `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` temporarily, then run `node scripts/seed.mjs`. Keep the service role key private. Script is idempotent by UUID. A staff entry named *Senura* versus roster entry *Seniru* remains unmatched pending human verification.
7. Verify roster counts: 23 shifts, 22 staff directory entries, 3 building entries, 0 cleaning entries. Cross-check 104 weekday and 56 weekend scheduled shift hours (unmultiplied template entries).
8. Create a Cloudflare Pages project connected to a **private** Git repository with build command `npm run build` and output directory `dist`. Configure the same two `VITE_*` environment variables in Pages. Use Cloudflare's default `*.pages.dev` domain.
9. Test login as supervisor and staff, edit/create/delete, permission enforcement, live changes in two browsers, mobile navigation and CSV/PDF report outputs.

## Security caveats
- The shared staff password does not identify individual staff members. If compromised, rotate it. The link itself must not be considered private.
- Building access instructions and employment types are currently visible to **all authenticated staff**; restrict sensitive fields further if needed. No telephone/email fields are included.
- Database policies prevent staff writes even if someone enables hidden controls manually.
- Free Supabase projects may pause for inactivity and have limited backup/availability guarantees. Keep an exported offline copy of critical emergency information.
- This starter does not yet support photo upload, site isolation for multiple buildings, automatic point-in-time restore, offline edits, or supervisory two-factor enforcement. Implement these as subsequent tracked releases rather than claiming they are complete.
- The staff code suggestion in the previous plan has been implemented as **one shared read-only Supabase user credential**, not an unprotected anonymous database endpoint. Staff must authenticate, but they do not need personal accounts.

## Developer structure
- `src/types.ts`: domain models
- `src/repository.ts`: central CRUD, repository boundary
- `src/reports.ts`: consistent CSV/PDF report exporters
- `src/utils.ts`: shift calculation and formatting
- `src/main.tsx`: page routing and existing module components
- `src/style.css`: responsive design tokens and screens
- `sql/001_schema.sql`: tables, RLS, change audit and realtime setup
- `scripts/seed.mjs`: one-time data migration with fixed IDs

## Next engineering upgrades
Split `src/main.tsx` into `features/{roster,staff,building,cleaning,reports}`, add Zod schemas and Playwright E2E tests, use a migration runner, add access-code rotation procedures, add multi-site scoping and secure attachments if Sharper expands. This is a working baseline, not a claim of complete future-proofing.
