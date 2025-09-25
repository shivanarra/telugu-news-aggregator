This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

### Option A: GitHub → Vercel (recommended)
1. Push this repo to GitHub (already done if you see this on GitHub).
2. Go to https://vercel.com/import and select `shivanarra/telugu-news-aggregator`.
3. Verify settings when prompted:
   - Install command: `npm ci`
   - Build command: `npm run build`
   - Framework: `Next.js`
4. Deploy. Vercel will give you a live URL. Add a custom domain if needed.

### Option B: Vercel CLI
```bash
npm i -g vercel
vercel login
# from project folder
vercel            # preview deploy
vercel --prod     # production deploy
```

### Notes
- Pages in `src/app/**` are dynamic (`force-dynamic`) and fetch fresh data on each request with a short in-memory cache (60s).
- `next-pwa` is enabled in production. It caches static assets, not RSS data.
- If you want persistent/shared caching, add Vercel KV (Upstash Redis) or a database.

### Optional next steps
- Add a Cron job (Vercel Cron) to hit an API route that pre-warms the feed cache.
- Wire Vercel KV to store normalized articles and reduce cold-start latency.
