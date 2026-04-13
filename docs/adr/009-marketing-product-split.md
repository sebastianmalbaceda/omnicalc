# ADR-009: Marketing/Product Separation

- **Status:** Accepted
- **Date:** 2026-04-13
- **Context:** Need separate web applications for SEO-optimized marketing pages and the actual product SPA.

## Decision

Split the web presence into two separate applications:

1. **`apps/marketing/`** — Next.js (SSR/SSG) at `tudominio.com`
   - Landing page, pricing, downloads, blog
   - Sign-in / Sign-up pages
   - SEO-optimized metadata and Open Graph tags

2. **`apps/web/`** — Vite + React (SPA) at `app.tudominio.com`
   - The actual calculator product
   - Requires authentication
   - Optimized for interactivity, not SEO

## Rationale

- **SEO Performance:** Next.js SSR ensures Google can crawl and index marketing pages instantly. SPAs struggle with SEO.
- **Bundle Size:** The product SPA is heavy (calculator logic, state management, API clients). Loading this on the marketing page would hurt Lighthouse scores.
- **Tauri/Electron Compatibility:** Tauri needs static files (Vite output). Next.js SSR cannot be wrapped by Tauri.
- **Team Scalability:** Marketing team can update landing pages without touching product code.
- **Industry Standard:** Spotify (`spotify.com` vs `open.spotify.com`), Discord (`discord.com` vs Discord web app), Slack (`slack.com` vs `app.slack.com`).

## Trade-offs

- Two apps to maintain instead of one
- Shared components must be imported from `packages/ui/`
- Auth flow requires redirect between domains

## Consequences

- Marketing site deployed to Vercel (Next.js optimized)
- Web app deployed to Vercel/Netlify (static SPA)
- Auth redirects from marketing to web app after sign-in
- Both apps share the same NestJS backend (`apps/api/`)
