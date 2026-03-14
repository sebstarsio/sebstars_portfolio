# STEP_LOG_60 — Uniformisation des vignettes et pages détail (référence Système Solaire)

**Date** : 2025-03-12  
**Objectif** : Uniformiser toutes les images de vignettes et de pages détail en prenant comme **référence** les images du projet Système Solaire (format, fond, style).

---

## Référence : Système Solaire

- **Dimensions** : `320 × 240` (viewBox `0 0 320 240`).
- **Fond** : Dégradé linéaire unique :
  - `#0a0d28` (0 %) → `#10163b` (50 %) → `#080c1c` (100 %).
- **Détails** : Petits cercles type « étoiles de fond » en coins (`r="0.8"`, `fill="#fff"`, `opacity="0.5"`).
- **Contenu** : Centré, bordures discrètes `rgba(255,255,255,0.14)` ou équivalent.

Une seule image (`solar-system.svg`) sert à la fois à la **vignette** (carte projet) et à la **page détail** (`project.image`).

---

## Règles appliquées à tous les projets

1. **Format** : Tous les SVG ont été passés en **320 × 240** (même ratio 4:3 que le Système Solaire).
2. **Fond** : Même dégradé que la référence :
   ```xml
   <linearGradient id="...Bg">
     <stop offset="0%" style="stop-color:#0a0d28"/>
     <stop offset="50%" style="stop-color:#10163b"/>
     <stop offset="100%" style="stop-color:#080c1c"/>
   </linearGradient>
   <rect width="320" height="240" fill="url(#...Bg)"/>
   ```
3. **Étoiles de fond** : Quatre à six petits cercles en coins (mêmes paramètres que le Système Solaire).
4. **Contenu** : Chaque projet conserve son sujet (calculatrice, constellations, blog, e-commerce, dashboard, N corps, astro, fractales), avec bordures et couleurs harmonisées (`rgba(255,255,255,0.12)` à `0.14`).

---

## Fichiers modifiés

| Projet              | Fichier                  | Modifications                                      |
|---------------------|--------------------------|----------------------------------------------------|
| Calculatrice        | calculatrice.svg         | 320×240, fond référence, étoiles, contenu recentré |
| Constellations      | constellations.svg       | 320×240, fond référence, étoiles                   |
| Blog/CMS            | blog-cms.svg             | 320×240, fond référence, bloc 200×200 centré, étoiles |
| E-commerce          | ecommerce.svg            | 320×240, fond référence, grille centrée, étoiles  |
| Dashboard           | dashboard.svg            | 320×240, fond référence, cartes + courbe, étoiles  |
| Problème à N corps  | three-body.svg           | 320×240, fond référence, trajectoires + corps, étoiles |
| Astro Data Viewer   | astro-data-viewer.svg    | 320×240, fond référence, sidebar + grille, étoiles |
| Générateur fractales| fractal-generator.svg   | 320×240, fond référence, triangles, étoiles       |
| **Système Solaire** | solar-system.svg        | Inchangé (déjà conforme, référence)                |

---

## Résultat

- **Vignettes** (cartes sur la home et `/projects`) : même format et même rendu de fond pour tous les projets.
- **Pages détail** (`/projects/[id]`) : même format d’image, affichage homogène.
- **Source** : pour chaque projet, une seule image statique `project.image` → `public/images/projects/[id].svg` (pas de `thumbnailUrl` distinct).

Aucune génération d’image par IA ; uniquement mise à jour manuelle des SVG pour coller à la référence Système Solaire.
