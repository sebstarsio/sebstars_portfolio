# SebStars — Portfolio Architecte Logiciel Full-Stack

**🌍 Documentation** — 🇬🇧 [English](README.md) · 🇫🇷 [Français](README.fr.md)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel)](https://vercel.com/)

---

Ce dépôt n’est **pas** un site marketing statique. C’est une **application Next.js complète côté serveur** construite avec l’App Router : Server Components, métadonnées dynamiques, conventions file-based pour le SEO et génération programmatique d’images Open Graph avec **Satori** (`next/og`). La stack est conçue pour un SEO technique de niveau production, des données structurées (JSON-LD) et des analytics respectueux de la vie privée.

---

## Architecture

- **`src/app`** — App Router : layout racine (métadonnées, polices, providers globaux), routes statiques et dynamiques (`/`, `/a-propos`, `/projects`, `/projects/[id]`, `/lab`, `/demo/[id]`), `opengraph-image.tsx` file-based (global et par projet), `sitemap.ts`, `robots.ts`, et routes API (auth, panier, posts, produits, NASA, etc.).
- **`src/components`** — Composants UI et métier : `Header`, `Hero`, `Projects`, `ProjectCard`, `Services`, `Contact`, `About`, `StructuredData` (JSON-LD), `Starfield` (fond canvas), `CookieConsent` (bandeau RGPD), `SebStarsLab` (démos interactives). Les démos sont dans `components/demos/` (ex. Système solaire, Calculatrice, Constellations, Blog/CMS, E-commerce, Dashboard, Three-Body, Astro Data Viewer, Générateur de fractales).
- **`src/lib`** — Données et utilitaires : définitions des projets, config auth, helpers partagés.
- **`src/styles`** — CSS global et scopé par composant (variables, layout, démos).

Les métadonnées et le SEO sont pilotés par la **Next.js Metadata API** (title, description, Open Graph, Twitter, canonical, robots). Le **JSON-LD** est injecté via `StructuredData` (Person, WebSite, CreativeWork, SoftwareSourceCode, BreadcrumbList). Les **images OG** sont générées au build ou à la requête avec `ImageResponse` de `next/og` (racine et par projet).

---

## Fonctionnalités techniques clés

- **Génération dynamique d’images Open Graph** — Images OG racine et par projet via `opengraph-image.tsx` (Satori / `next/og`), 1200×630, sans assets statiques.
- **SEO technique** — Metadata API, `sitemap.ts`, `robots.ts`, URLs canoniques, JSON-LD (Person, WebSite, SoftwareSourceCode, BreadcrumbList).
- **Vercel Analytics** — `@vercel/analytics` avec suivi d’événements personnalisés (ex. clic démo projet, clic détails, envoi contact).
- **RGPD / Consentement cookies** — Bandeau de consentement léger et non bloquant ; choix stocké dans `localStorage`, pas de cookies de pistage.
- **SebStars Lab** — Vitrine UI interactive : boutons magnétiques, loaders, inputs glassmorphism, toggles, cartes premium.
- **Démos intégrées** — Démos full-stack et front-end (NextAuth, TipTap, Three.js, Canvas, routes API) sous `/demo/[id]`.
- **next/font** — Orbitron et Space Grotesk chargés via `next/font/google` avec variables CSS.

---

## Installation locale

```bash
git clone https://github.com/sebstars/sebstars_portfolio.git
cd sebstars_portfolio
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

**Scripts :** `npm run build` (build production), `npm run start` (serveur production), `npm run lint` (ESLint).

---

## Stack technique

| Couche     | Choix |
|------------|--------|
| Framework  | Next.js 16 (App Router) |
| Langage    | TypeScript 5 |
| UI         | React 19 |
| Styles     | Tailwind CSS 4, CSS global, variables CSS |
| Analytics  | Vercel Analytics + événements personnalisés |
| Auth (démos) | NextAuth.js |
| Rich text | TipTap (démos) |
| 3D / Canvas | Three.js, Canvas API (démos) |

---

*Portfolio Architecte Logiciel Full-Stack — Next.js, TypeScript, React. Belgique · Remote.*
