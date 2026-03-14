# STEP_LOG_57 — Standardisation visuelle globale du portfolio SebStars

**Date** : 2025-03-12  
**Objectif** : Appliquer à l’ensemble du portfolio la même rigueur visuelle et le même câblage technique que le projet « Système Solaire », sans aucune génération artistique artificielle.

---

## 1. Protocole Anti-Artiste (règle d’or)

- **Aucune image générée par IA** : DALL·E, Midjourney, Stable Diffusion et toute génération artistique automatisée sont interdites.
- **Sources autorisées** : code, CSS, Canvas, WebGL, paramètres initiaux des composants, intégration du composant React réel.
- Chaque visuel provient du **code réel du projet**.

---

## 2. Diagnostic de la source d’affichage (Système Solaire)

### Architecture retenue : **OPTION A — Image statique**

- **Cartes projets** (`ProjectCard.tsx`) : utilisation de `project.thumbnailUrl ?? project.image` avec le composant Next.js `<Image>`. Pas de composant live dans la carte.
- **Page détail** (`/projects/[id]/page.tsx`) : affichage de `project.image` via `<Image>`.
- **Source de données** : `src/lib/projects.ts`. Chaque projet possède `image: '/images/projects/[id].svg'` (pas de `thumbnailUrl` après rollback).
- **Fichiers visuels** : tous les projets pointent vers des **SVG** dans `public/images/projects/` (ex. `solar-system.svg`, `calculatrice.svg`, …).

Conclusion : le projet « Système Solaire » et l’ensemble du portfolio utilisent une **architecture image statique** (SVG). Aucun composant live n’est injecté dans les cartes ou les pages détail.

---

## 3. Uniformisation appliquée

- **Architecture** : conservée pour tous les projets — **image statique (SVG)**.
- **Chemins** : `image: '/images/projects/[id].svg'` pour les 9 projets. Aucun `thumbnailUrl` ; la carte utilise `project.image`.
- **Fichiers attendus** : les SVG existent dans `public/images/projects/` pour chaque `[id]`. L’utilisateur peut remplacer ou ajouter des assets dans ce dossier ; le code fonctionne dès que les chemins correspondent.

Aucun passage en « composant live » dans les cartes : cohérence totale avec l’architecture actuelle (image statique).

---

## 4. Optimisation du rendu par défaut (composants live)

Les ajustements ci‑dessous concernent le **rendu à t = 0** des **démos** (`/demo/[id]`), pour que la première frame soit propre, lisible et visuellement intéressante. Ils n’impactent pas les cartes ni les pages détail (qui restent en image statique).

### 4.1 SolarSystem (exclu — déjà corrigé et validé)

- Composant : `src/components/demos/SolarSystem.tsx`
- Aucune modification dans le cadre de cette étape.
- Architecture d’affichage carte / détail : **Image statique** (`solar-system.svg`).

---

### 4.2 Calculatrice (Calculator)

- **Composant** : `src/components/demos/Calculator.tsx`
- **Paramètres visuels ajustés** :
  - **Expression initiale** : `currentExpression` initialisé à `'E = mc²'` au lieu de `''`. L’écran affiche dès le chargement une équation stylisée lisible (y compris en miniature), sans modifier la logique de calcul.
- **Architecture d’affichage** : **Image statique** (`calculatrice.svg`).

---

### 4.3 Générateur de fractales (FractalGenerator)

- **Composant** : `src/components/demos/FractalGenerator.tsx`
- **Paramètres visuels ajustés** :
  - **Zoom initial** : `zoom` passé de `50` à `0`. Avec la formule `scale = 4 / Math.pow(2, params.zoom / 10)`, un zoom à 0 donne une vue complète de l’ensemble de Mandelbrot dès le premier rendu, sans zone vide ni sur-zoom.
  - Type par défaut : `mandelbrot`, iterations 50, palette `rainbow` — structure fractale visible immédiatement.
- **Architecture d’affichage** : **Image statique** (`fractal-generator.svg`).

---

### 4.4 Problème à N corps (ThreeBody)

- **Composant** : `src/components/demos/ThreeBody.tsx`
- **Paramètres visuels ajustés** :
  - **Initialisation au montage** : ajout d’un `useEffect` (dépendances vides) appelant `initDefault()` au premier rendu. Les corps sont ainsi créés dès t = 0 (configuration « Quasi stable » : répartition circulaire, vitesses tangentielles), au lieu d’afficher un canvas vide en attente d’un clic sur un preset.
- **Architecture d’affichage** : **Image statique** (`three-body.svg`).

---

### 4.5 Simulateur de constellations (Constellations)

- **Composant** : `src/components/demos/Constellations.tsx`
- **Paramètres analysés** : pas de modification nécessaire.
  - État initial : `zoom: 1.0`, `ra0: 0`, `dec0: 60`, `showLines: true`, `showMythology: true`. La fonction `draw()` est appelée au resize et via `useEffect([draw])`, donc la carte stellaire et les lignes sont visibles dès le premier frame.
- **Architecture d’affichage** : **Image statique** (`constellations.svg`).

---

### 4.6 Astro Data Viewer

- **Composant** : `src/components/demos/AstroDataViewer.tsx`
- **Paramètres analysés** : pas de modification dans cette étape.
  - État initial : onglet `images`, `searchQuery: 'nebula'`, chargement des données via API. Le premier frame peut être un état de chargement ; l’interface (grille, filtres) est déjà lisible.
- **Architecture d’affichage** : **Image statique** (`astro-data-viewer.svg`).

---

### 4.7 Blog/CMS Full Stack (BlogCMS)

- **Composant** : `src/components/demos/BlogCMS.tsx`
- **Rendu à t = 0** : interface éditeur / liste d’articles ; pas de paramètre « visuel » algorithmique à ajuster.
- **Architecture d’affichage** : **Image statique** (`blog-cms.svg`).

---

### 4.8 E-commerce Fullstack (Ecommerce)

- **Composant** : `src/components/demos/Ecommerce.tsx`
- **Rendu à t = 0** : catalogue / panier ; interface déjà structurée dès le chargement.
- **Architecture d’affichage** : **Image statique** (`ecommerce.svg`).

---

### 4.9 Dashboard de données (Dashboard)

- **Composant** : `src/components/demos/Dashboard.tsx`
- **Rendu à t = 0** : métriques et graphiques ; chargement des séries et premier rendu Canvas déjà en place.
- **Architecture d’affichage** : **Image statique** (`dashboard.svg`).

---

## 5. Liste récapitulative des projets

| Projet              | Composant           | Paramètres visuels ajustés                                      | Architecture d’affichage |
|---------------------|---------------------|------------------------------------------------------------------|---------------------------|
| Système Solaire     | SolarSystem.tsx     | Aucun (déjà validé)                                             | Image statique            |
| Calculatrice        | Calculator.tsx      | `currentExpression` initial = `'E = mc²'`                       | Image statique            |
| Fractales           | FractalGenerator.tsx| `zoom` initial = `0` (vue Mandelbrot complète)                   | Image statique            |
| Problème à N corps  | ThreeBody.tsx       | `initDefault()` au montage (corps visibles à t = 0)              | Image statique            |
| Constellations      | Constellations.tsx  | Aucun (déjà équilibré)                                           | Image statique            |
| Astro Data Viewer   | AstroDataViewer.tsx | Aucun                                                            | Image statique            |
| Blog/CMS            | BlogCMS.tsx         | Aucun                                                            | Image statique            |
| E-commerce          | Ecommerce.tsx       | Aucun                                                            | Image statique            |
| Dashboard           | Dashboard.tsx       | Aucun                                                            | Image statique            |

---

## 6. Vérifications effectuées

- **Galerie projets** : les cartes utilisent `project.image` (SVG) ; pas d’image cassée si les fichiers existent dans `public/images/projects/`.
- **Pages détail** : affichage de `project.image` ; cohérence avec les cartes.
- **Démos** (`/demo/[id]`) : rendu à t = 0 amélioré pour Calculator (équation), FractalGenerator (zoom 0), ThreeBody (corps initialisés).
- **Protocole Anti-Artiste** : aucune génération d’image par IA ; tous les visuels proviennent du code (composants live en démo) ou des assets statiques (SVG) déjà présents.

---

## 7. Conformité au protocole Anti-Artiste

- Aucun appel à DALL·E, Midjourney, Stable Diffusion ou tout outil de génération artistique.
- Améliorations réalisées uniquement par : ajustement du code (état initial, `useEffect`), paramètres des composants (zoom, expression, initialisation des corps).
- Chaque visuel affiché en démo provient du **code réel** du projet ; les cartes et pages détail utilisent des **images statiques (SVG)** déjà fournies ou à déposer dans `public/images/projects/`.

---

## 8. Fichiers modifiés

- `src/components/demos/Calculator.tsx` — valeur initiale de `currentExpression`.
- `src/components/demos/FractalGenerator.tsx` — valeur initiale de `zoom` dans `params`.
- `src/components/demos/ThreeBody.tsx` — `useEffect` au montage appelant `initDefault()`.

Aucune modification des données dans `src/lib/projects.ts` ni des composants de cartes ou de pages détail (architecture image statique inchangée).
