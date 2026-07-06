# DevHub — all-in-one platform (two apps, one database)

Two separate apps that share a single SQLite database in **`/data`**:

```
website all in one ads/
├── web/     → the public WEBSITE (blog + all services/tools)   → http://localhost:3000
├── admin/   → the ADMIN PANEL (CMS, profile menu, monetization) → http://localhost:3001
└── data/    → the SHARED database (app.db)
```

The website has **no admin inside it** — content is managed from the separate
admin app, which connects to the same database.

## Run it

**First time (creates the shared database + example posts):**
```bash
cd web
npm install
npm run setup        # generates client, creates /data/app.db, seeds posts

cd ../admin
npm install
npm run generate     # generates the admin's DB client (same shared DB)
```

**Every day (run BOTH in two terminals):**
```bash
# terminal 1 — website
cd web && npm run dev      # http://localhost:3000

# terminal 2 — admin panel
cd admin && npm run dev    # http://localhost:3001
```

## Admin login
Open http://localhost:3001 → password **`admin123`** (set in `admin/.env`).
Write posts here; they appear on the website instantly. **Change `ADMIN_PASSWORD`
and `ADMIN_TOKEN` before going live.**

## Services on the website
- **Developer Tools** (live): JSON formatter, Base64, URL encoder, JWT decoder,
  UUID, hash, password generator, lorem ipsum, case converter, word counter,
  color converter, regex tester, Markdown previewer, QR code.
- **SEO Tools** (live): meta-tag, Open Graph, robots.txt and slug generators.
- **AI, Learning, Career, CRM, Marketing, Productivity, Community, Freelancing,
  Resources** — full catalog present with SEO-ready pages, marked "coming soon"
  until built. Add functional versions over time in `web/components/tools/` +
  `web/lib/toolRegistry.js`, and flip `live: true` in `web/lib/catalog.js`.

## Ads (Adsterra)
Configured in `web/.env` → `NEXT_PUBLIC_ADSTERRA_KEY`. Ad slots across the site
render your Adsterra banner automatically. Manage/preview it from the admin
panel's **Monetization** page. An Adsterra key maps to ONE banner size — set
`NEXT_PUBLIC_ADSTERRA_WIDTH/HEIGHT` to match, and create more units for other
placements.

⚠️ **Never click or repeatedly view your own ads** (including the admin preview) —
ad networks ban accounts for it.

## SEO
Server-rendered pages, per-page metadata, JSON-LD, canonical URLs, a full
`sitemap.xml` (every category + tool + blog post) and `robots.txt`. Set
`NEXT_PUBLIC_SITE_URL` in `web/.env` to your real domain before launch.

## Production
1. Change secrets in `admin/.env`; set real domain in `web/.env`.
2. For a real database, switch `provider` to `postgresql` in **both**
   `web/prisma/schema.prisma` and `admin/prisma/schema.prisma`, point
   `DATABASE_URL` at a hosted Postgres (Neon/Supabase/Railway), and run
   `npm run db:push` in `web`.
3. Deploy each app separately (e.g. Vercel) — both pointing at the same DB.
