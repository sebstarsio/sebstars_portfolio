# STEP LOG 54 — Assets visuels conceptuels (illustrations)

## Objectif

Remplacer les captures d’écran des projets par des **illustrations conceptuelles professionnelles** : représentation du concept algorithmique, identité visuelle cohérente, image "Research Lab / Engineering".

---

## 1. Projets détectés

Source : `src/lib/projects.ts`.

| id | title |
|----|--------|
| solar-system | Système Solaire |
| calculatrice | Calculatrice Avancée |
| constellations | Simulateur de Constellations |
| blog-cms | Blog/CMS Full Stack |
| ecommerce | (E-commerce) |
| dashboard | Dashboard de Données |
| three-body | Problème à N Corps |
| astro-data-viewer | Astro Data Viewer |
| fractal-generator | Générateur de Fractales |

---

## 2. Concept visuel choisi par projet

| Projet | Concept thumb | Concept detail |
|--------|----------------|----------------|
| **solar-system** | Vue top-down, orbites elliptiques, soleil central, pas d’UI | Même concept, plus d’orbites et de profondeur |
| **calculatrice** | Équation mathématique élégante (E=mc², intégrale), typo stylisée | Symboles mathématiques (∫, Σ), style scientifique |
| **constellations** | Carte stellaire minimaliste, étoiles reliées, grille subtile | Étoiles, lignes fines, coordonnées scientifiques |
| **blog-cms** | Flux de contenu / données : nœuds et connexions | Structure document, flux de données |
| **ecommerce** | Flux commerce : produit, panier, transaction (formes abstraites) | Nœuds et connexions, flux commerce |
| **dashboard** | Graphique abstrait : tendance, barres, métriques | Lignes de données, graphiques, métriques |
| **three-body** | Problème à 3 corps : trajectoires gravitationnelles, chaos | Orbites, masses, trajectoires |
| **astro-data-viewer** | Carte stellaire, étoiles connectées, coordonnées | Données astronomiques, étoiles, grille |
| **fractal-generator** | Motif fractal géométrique, structure récursive | Fractale, lignes fines, profondeur mathématique |

Style commun : fond noir profond (#0f172a), accents cyan (#06b6d4) et violet (#7c3aed), glow technologique discret, pas d’interface UI ni de texte superflu.

---

## 3. Fichiers générés

Tous enregistrés dans `/public/images/projects/`.

| Projet | Thumbnail | Image détail |
|--------|-----------|--------------|
| solar-system | solar-system-thumb.png | solar-system-detail.png |
| calculatrice | calculatrice-thumb.png | calculatrice-detail.png |
| constellations | constellations-thumb.png | constellations-detail.png |
| blog-cms | blog-cms-thumb.png | blog-cms-detail.png |
| ecommerce | ecommerce-thumb.png | ecommerce-detail.png |
| dashboard | dashboard-thumb.png | dashboard-detail.png |
| three-body | three-body-thumb.png | three-body-detail.png |
| astro-data-viewer | astro-data-viewer-thumb.png | astro-data-viewer-detail.png |
| fractal-generator | fractal-generator-thumb.png | fractal-generator-detail.png |

**Total :** 18 assets (9 vignettes + 9 images détail).

---

## 4. Données projets

Dans `src/lib/projects.ts`, les champs utilisés sont déjà :

- `thumbnailUrl: "/images/projects/[id]-thumb.png"`
- `image: "/images/projects/[id]-detail.png"`

Aucune modification du fichier projets n’est nécessaire : les noms de fichiers générés respectent cette convention.

---

## 5. Validation du rendu

À vérifier après `npm run dev` :

- [ ] Nouvelles vignettes visibles sur les cartes projet (section Projets / Lab)
- [ ] Images détail correctes sur chaque page `/projects/[id]`
- [ ] Cohérence visuelle entre projets (palette, style minimal, pas d’UI)
- [ ] Bonne lisibilité sur fond sombre
- [ ] Impression globale "laboratoire de recherche logiciel"

---

## 6. Notes

- Les illustrations sont **conceptuelles** (concept du projet), pas des captures d’écran.
- Palette : noir profond, cyan, violet, éventuellement émeraude ; glow discret.
- Format cible : 16:9 pour thumb et detail ; rendu iconique pour les vignettes.
