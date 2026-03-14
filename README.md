# SebStars — Full-Stack Software Architect Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel)](https://vercel.com/)

---

This repository is **not** a static marketing site. It is a **full Next.js server-side application** built with the App Router: Server Components, dynamic metadata, file-based conventions for SEO, and programmatic Open Graph image generation with **Satori** (`next/og`). The stack is designed for production-grade technical SEO, structured data (JSON-LD), and privacy-conscious analytics.

---

## Architecture

- **`src/app`** — App Router: root layout (metadata, fonts, global providers), static and dynamic routes (`/`, `/a-propos`, `/projects`, `/projects/[id]`, `/lab`, `/demo/[id]`), file-based `opengraph-image.tsx` (global and per-project), `sitemap.ts`, `robots.ts`, and API routes (auth, cart, posts, products, NASA, etc.).
- **`src/components`** — UI and feature components: `Header`, `Hero`, `Projects`, `ProjectCard`, `Services`, `Contact`, `About`, `StructuredData` (JSON-LD), `Starfield` (canvas background), `CookieConsent` (RGPD bandeau), `SebStarsLab` (interactive demos). Demos live under `components/demos/` (e.g. Solar System, Calculator, Constellations, Blog/CMS, E-commerce, Dashboard, Three-Body, Astro Data Viewer, Fractal Generator).
- **`src/lib`** — Data and utilities: project definitions, auth config, shared helpers.
- **`src/styles`** — Global and component-scoped CSS (variables, layout, demos).

Metadata and SEO are driven by the **Next.js Metadata API** (title, description, Open Graph, Twitter, canonical, robots). **JSON-LD** is injected via `StructuredData` (Person, WebSite, CreativeWork, SoftwareSourceCode, BreadcrumbList). **OG images** are generated at build/request time with `ImageResponse` from `next/og` (root and per project).

---

## Key Technical Features

- **Dynamic Open Graph image generation** — Root and per-project OG images via `opengraph-image.tsx` (Satori / `next/og`), 1200×630, no static assets required.
- **Technical SEO** — Metadata API, `sitemap.ts`, `robots.ts`, canonical URLs, JSON-LD (Person, WebSite, SoftwareSourceCode, BreadcrumbList).
- **Vercel Analytics** — `@vercel/analytics` with custom event tracking (e.g. project demo click, details click, contact submit).
- **RGPD / Cookie consent** — Lightweight, non-blocking consent bandeau; choice stored in `localStorage`, no tracking cookies.
- **SebStars Lab** — Interactive UI showcase: magnetic buttons, loaders, glassmorphism inputs, toggles, premium cards.
- **Embedded demos** — Full-stack and front-end demos (NextAuth, TipTap, Three.js, Canvas, API routes) under `/demo/[id]`.
- **next/font** — Orbitron and Space Grotesk loaded via `next/font/google` with CSS variables.

---

## Local Setup

```bash
git clone https://github.com/sebstars/sebstars_portfolio.git
cd sebstars_portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Scripts:** `npm run build` (production build), `npm run start` (production server), `npm run lint` (ESLint).

---

## Tech Stack

| Layer        | Choice |
|-------------|--------|
| Framework   | Next.js 16 (App Router) |
| Language    | TypeScript 5 |
| UI          | React 19 |
| Styling     | Tailwind CSS 4, global CSS, CSS variables |
| Analytics   | Vercel Analytics + custom events |
| Auth (demos)| NextAuth.js |
| Rich text   | TipTap (demos) |
| 3D / Canvas | Three.js, Canvas API (demos) |

---

*Full-Stack Software Architect portfolio — Next.js, TypeScript, React. Belgium · Remote.*
