# STEP LOG 54.3 — Captures fidèles des démos (vérité technique)

## Objectif

Remplacer les images des projets par des **captures réelles** des démos : uniquement le rendu du composant, sans navbar, footer, boutons Specs/Code ni aucun élément de page. Photographie technique du code en action.

---

## 1. Démos détectées

Source : `src/components/demos/` et routes `/demo/[id]`.

| id | Composant |
|----|-----------|
| solar-system | SolarSystem.tsx |
| calculatrice | Calculator.tsx |
| constellations | Constellations.tsx |
| blog-cms | BlogCMS.tsx |
| ecommerce | Ecommerce.tsx |
| dashboard | Dashboard.tsx |
| three-body | ThreeBody.tsx |
| astro-data-viewer | AstroDataViewer.tsx |
| fractal-generator | FractalGenerator.tsx |

---

## 2. Règle de capture : contenu uniquement

Les captures montrent **uniquement** :

- le rendu du composant de démo
- l’interface propre à la démo

**N’apparaissent pas** : navbar, footer, titres de page, boutons Specs/Code, layout global. Réalisation via capture du seul élément `main.wf-main` (Playwright `locator('main.wf-main').screenshot()`).

---

## 3. Script et noms des captures

- **Script** : `scripts/captureDemoOnly.ts` (commande : `npm run capture-demo`).
- **Viewport** : 2560×1440 (haute résolution).
- **Stabilisation** : 2,5 s après chargement avant capture.
- **Dossier** : `public/images/projects/`.

Pour chaque démo :

| Projet | Fichier détail | Fichier vignette |
|--------|----------------|-------------------|
| solar-system | solar-system-detail.png | solar-system-thumb.png |
| calculatrice | calculatrice-detail.png | calculatrice-thumb.png |
| constellations | constellations-detail.png | constellations-thumb.png |
| blog-cms | blog-cms-detail.png | blog-cms-thumb.png |
| ecommerce | ecommerce-detail.png | ecommerce-thumb.png |
| dashboard | dashboard-detail.png | dashboard-thumb.png |
| three-body | three-body-detail.png | three-body-thumb.png |
| astro-data-viewer | astro-data-viewer-detail.png | astro-data-viewer-thumb.png |
| fractal-generator | fractal-generator-detail.png | fractal-generator-thumb.png |

- **Detail** : capture complète de `main.wf-main` (composant entier).
- **Thumb** : recadrage central (55 % de la largeur et hauteur) de l’image détail.

---

## 4. Fidélité technique

- Aucune interprétation artistique, illustration conceptuelle ni mise en scène graphique.
- Les images correspondent au rendu produit par le code (composant réel en fonctionnement).
- Aucun effet, recolorisation ni design externe ajouté.

---

## 5. Données projets

Dans `src/lib/projects.ts`, les champs `thumbnailUrl` et `image` pointent déjà vers `/images/projects/[id]-thumb.png` et `/images/projects/[id]-detail.png`. Aucune modification des données projets n’a été nécessaire.

---

## 6. Validation visuelle

À contrôler après `npm run dev` :

- [ ] Vignettes visibles dans la galerie / cartes projets.
- [ ] Images détail correctes sur chaque page `/projects/[id]`.
- [ ] Absence de navbar, footer, boutons Specs/Code et titres de page dans les images.
- [ ] Fidélité au rendu des démos (Système Solaire : soleil, orbites, planètes ; Calculatrice : écran, touches ; etc.).

---

## 7. Confirmation de fidélité technique

Les assets générés sont des **captures techniques** du composant de démo isolé, issues du rendu réel produit par le code, sans retouche ni élément de page.
