# Image Background Remover

Free, fast, no-signup image background removal. Built with Next.js + Tailwind CSS, powered by [Remove.bg](https://www.remove.bg/) API.

## Tech Stack

- **Frontend:** Next.js 15 (App Router) + Tailwind CSS
- **API:** Next.js Edge Route → Remove.bg API
- **Deploy:** Cloudflare Pages (frontend) + optional Cloudflare Worker (standalone proxy)
- **Storage:** None — images processed in memory only

## Project Structure

```
├── app/
│   ├── api/remove-bg/route.ts   # Edge API route (proxies to Remove.bg)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── BgRemover.tsx            # Main upload/preview/download component
├── worker/
│   ├── index.ts                 # Standalone Cloudflare Worker (optional)
│   └── wrangler.toml
└── docs/
    └── requirements.md          # MVP requirements document
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure API key

```bash
cp .env.local.example .env.local
# Edit .env.local and set REMOVE_BG_API_KEY
```

Get your API key at [remove.bg/api](https://www.remove.bg/api) — free tier: 50 calls/month.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Cloudflare Pages

1. Push this repo to GitHub
2. In Cloudflare Pages, connect the repo
3. Build settings:
   - **Build command:** `npm run build`
   - **Output directory:** `.next`
   - **Framework preset:** Next.js
4. Add environment variable: `REMOVE_BG_API_KEY`

## Optional: Standalone Cloudflare Worker

If you prefer a separate Worker instead of the built-in API route:

```bash
cd worker
npm install -g wrangler
wrangler deploy
wrangler secret put REMOVE_BG_API_KEY
```

Then set `NEXT_PUBLIC_WORKER_URL` in your environment to the Worker URL.

## License

MIT
