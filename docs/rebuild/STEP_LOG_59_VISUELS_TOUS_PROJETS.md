# STEP_LOG_59 — Alignement des visuels (vignette + détail) pour tous les projets

**Date** : 2025-03-12  
**Objectif** : Appliquer la même démarche que pour la Calculatrice (et le Système Solaire) à **tous** les projets : source = image statique (`project.image` → `public/images/projects/[id].svg`), SVG aligné sur la palette et la structure du composant, **aucune génération d’image par IA**.

---

## Règle appliquée (uniformisation)

- **Vignette** et **page détail** = **image statique** (`project.image` dans `src/lib/projects.ts`).
- Fichier servi : `public/images/projects/[id].svg`.
- Pour chaque projet : le SVG a été **édité à la main** pour utiliser la **palette du portfolio** (#050716, #080c1c, #7dd3fc, #8b5cf6, rgba(125,243,255,…)) et une structure cohérente avec le composant (sans créer de nouveau visuel par IA).

---

## Projets traités

| Projet | Fichier SVG | Source palette / structure | Modification |
|--------|-------------|----------------------------|--------------|
| **Système Solaire** | solar-system.svg | Déjà aligné (référence) | Aucune |
| **Calculatrice** | calculatrice.svg | calculator.css, état initial E = mc² | Déjà fait (STEP_LOG_50) |
| **Constellations** | constellations.svg | constellations.css + draw() : #050716, #e8ecf4, rgba(140,220,255,0.38) | Fond #050716, cadre #080c1c, étoiles #e8ecf4, lignes rgba(140,220,255), deux groupes d’étoiles reliées |
| **Blog/CMS** | blog-cms.svg | Lab / calculator-style | Fond #050716/#080c1c, cadre + barre titre, lignes contenu, bouton Article, icône + |
| **E-commerce** | ecommerce.svg | Lab / calculator-style | Fond #050716/#080c1c, grille 4 cartes produits, icône panier |
| **Dashboard** | dashboard.svg | Lab / calculator-style | Fond #050716/#080c1c, 2 cartes métriques (1.2K Users, 45K Revenue), zone graphique + courbe cyan |
| **Problème à N corps** | three-body.svg | ThreeBody.tsx PALETTES classic | Fond #050716/#080c1c, 3 trajectoires (dégradés #ff6bcb, #46e6ff, #ffe66b), 3 corps + glow |
| **Astro Data Viewer** | astro-data-viewer.svg | Lab + structure composant | Fond #050716/#080c1c, sidebar, grille cartes (images + exoplanètes), panneau détail avec bordure #7dd3fc |
| **Générateur de fractales** | fractal-generator.svg | Lab + structure type Mandelbrot | Fond #050716/#0f172a/#080c1c, triangles imbriqués (dégradé #7dd3fc → #8b5cf6) évoquant la récursion |

---

## Palette commune (portfolio / Lab)

- Fond : `#050716`, `#080c1c`
- Conteneurs : `#080c1c`, `rgba(22,32,52,…)`
- Bordure / accent : `#7dd3fc`, `rgba(125,243,255,0.15–0.35)`
- Secondaire : `#8b5cf6`, `#3b82f6`, `#10b981`
- Texte / étoiles : `#e8ecf4`, `#cbd5e1`, `#e2e8f0`

---

## Fichiers modifiés

- `public/images/projects/constellations.svg`
- `public/images/projects/blog-cms.svg`
- `public/images/projects/ecommerce.svg`
- `public/images/projects/dashboard.svg`
- `public/images/projects/three-body.svg`
- `public/images/projects/astro-data-viewer.svg`
- `public/images/projects/fractal-generator.svg`

Aucune modification des composants React ni de `src/lib/projects.ts` (chemins déjà corrects).

---

## Conformité « pas d’artiste »

- Aucun appel à DALL·E, Midjourney, Stable Diffusion ou autre génération d’image par IA.
- Tous les SVG ont été mis à jour par **édition manuelle** (couleurs, formes, texte) pour refléter la palette du code et une structure déjà présente ou dérivée du composant.
- Chaque visuel reste une **représentation statique** du projet ; la démo live reste sur `/demo/[id]`.

---

## Validation

- Chaque projet a un fichier `[id].svg` dans `public/images/projects/`.
- Les cartes et pages détail utilisent `project.image` → même fichier pour tous.
- Vérification visuelle : `npm run dev` → galerie projets et pages `/projects/[id]` pour chaque projet.
