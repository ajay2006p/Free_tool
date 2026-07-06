# Deploy — MongoDB + Vercel + Render

Your stack:
- **Database:** MongoDB Atlas (free)
- **Website (`web/`)** and **Admin (`admin/`)**: deploy each to **Vercel** (recommended) or **Render**
- Both apps talk to the **same** MongoDB database.

---

## Step 1 — Create a free MongoDB (Atlas)
1. Go to **mongodb.com/atlas** → sign up → **Create** a free **M0** cluster.
2. **Database Access** → Add a database user (username + password). Save them.
3. **Network Access** → Add IP → **Allow access from anywhere** (`0.0.0.0/0`).
   (Vercel/Render use changing IPs, so this is required.)
4. **Connect → Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   Add a database name after the `/` → use `alltools`:
   ```
   mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/alltools?retryWrites=true&w=majority
   ```

## Step 2 — Point the code at MongoDB & create the collections
Put that string into **`web/.env`** AND **`admin/.env`** as `DATABASE_URL` (same value in both). Then, once:
```bash
cd web
npm install
npm run setup        # generates client, creates collections, seeds example posts

cd ../admin
npm install
npm run generate
```
Now run locally to confirm: `npm run dev` in each (web = :3000, admin = :3001).

## Step 3 — Push to GitHub
```bash
cd "C:\Users\pc\OneDrive\Desktop\website all in one ads"
git init
git add .
git commit -m "all-in-one tools platform"
```
Create a repo on github.com, then run the two `git remote add` / `git push` commands GitHub shows you.
(`.env` files are gitignored — your secrets are NOT uploaded. Good.)

## Step 4 — Deploy to Vercel (make TWO projects)
Your website and admin are separate apps, so import the repo twice.

**Website:**
1. vercel.com → **Add New → Project** → import your repo
2. **Root Directory = `web`**
3. **Environment Variables** (below) → **Deploy**

**Admin:**
1. **Add New → Project** → same repo
2. **Root Directory = `admin`**
3. Env vars → **Deploy**

### Env vars — website (web)
| Key | Value |
|---|---|
| `DATABASE_URL` | your MongoDB string |
| `NEXT_PUBLIC_SITE_URL` | your website's Vercel URL (e.g. https://alltools.vercel.app) |
| `NEXT_PUBLIC_ADSTERRA_KEY` | your Adsterra key (optional) |
| `USER_SESSION_SECRET` | any long random text |
| `ANTHROPIC_API_KEY` | (optional, for AI tools) |
| `SOCIAL_DL_API_URL` / `_KEY` / `_HOST` | (optional, downloader) |
| `SCRAPER_API_URL` / `_KEY` | (optional, scraper) |

### Env vars — admin
| Key | Value |
|---|---|
| `DATABASE_URL` | same MongoDB string |
| `ADMIN_PASSWORD` | your admin password (change it!) |
| `ADMIN_TOKEN` | any long random text (change it!) |
| `NEXT_PUBLIC_WEBSITE_URL` | your website's Vercel URL |
| `NEXT_PUBLIC_ADSTERRA_KEY` | your Adsterra key |
| `ADSTERRA_API_TOKEN` | (optional, real earnings) |
| `ANTHROPIC_API_KEY` | (optional, AI blog writer) |

## Step 4 (alt) — Deploy to Render
For each app: **New → Web Service** → connect the repo →
- **Root Directory:** `web` (and a second service with `admin`)
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`  (admin uses `npm start` → port 3001; Render sets the port via `$PORT`, so set Start to `next start -p $PORT`)
- Add the same env vars as above.

## Step 5 — Turn on ads
Open your **live** website URL, then in **Adsterra → Websites** add that domain and wait for approval. Real ads only serve on your approved live domain (never on localhost).

---

### Notes
- Change `ADMIN_PASSWORD`, `ADMIN_TOKEN`, `USER_SESSION_SECRET` before going live.
- Manage ads from **Admin → Monetization** (no redeploy needed).
- The old local SQLite data isn't carried over — MongoDB starts fresh (the seed re-adds the 3 example blog posts). Write new posts from the admin panel.
