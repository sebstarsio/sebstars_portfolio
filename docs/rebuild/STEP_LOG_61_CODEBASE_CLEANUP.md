# STEP_LOG_61 — Nettoyage codebase (phase clôture)

**Date** : 2025-03-12  
**Objectif** : Nettoyage complet et rigoureux de la codebase avant clôture de phase — code mort, imports inutiles, archivage des fichiers non utilisés, assets résiduels, validation build.

---

## 1. Code mort et imports inutiles

### Constantes / variables supprimées

- **`src/components/demos/SolarSystem.tsx`** : suppression de la constante **`ORBIT_SIZE_DESKTOP`** (960), déclarée mais jamais lue. Seule `ORBIT_SIZE_MOBILE` (600) est utilisée pour le calcul d’échelle mobile.

### Imports

- Aucun import inutilisé supprimé dans ce passage. Les avertissements ESLint restants (ex. `architectureNotes` / `lang` non utilisés dans certains composants) concernent des **props** passées par le parent et conservées pour cohérence d’API ou usage futur ; ils n’ont pas été retirés pour éviter de casser le contrat des composants de démo.

### Blocs commentés / anciennes variantes

- Aucun gros bloc de code commenté ou ancienne variante temporaire repéré dans les fichiers modifiés. Aucune suppression effectuée dans ce cadre.

### Points laissés volontairement en place

- **Props `architectureNotes` et `lang`** dans les composants de démo : gardées pour cohérence et usage possible par des sous-composants (ex. badges techniques).
- **Outils ESLint / React** : les autres avertissements (hooks, `any`, etc.) n’ont pas été traités dans ce nettoyage pour limiter le périmètre et les risques de régression.

---

## 2. Archivage des fichiers non utilisés

### Dossier créé

- **`archive/`** à la racine du projet, avec **`archive/scripts/`** et **`archive/images/projects/`**.

### Fichiers déplacés vers `archive/scripts/`

| Fichier | Raison |
|--------|--------|
| `diagnostic-solar.js` | Script de diagnostic one-shot (source vignette/détail), non utilisé en build. |
| `capture-demos.js` | Ancien script de capture démos, remplacé par d’autres pipelines. |
| `generateProjectScreenshots.ts` | Script Playwright/Puppeteer de screenshots, non utilisé en prod. |
| `captureDemoOnly.ts` | Script de capture ciblée, non utilisé en prod. |
| `generateStudioScreenshots.ts` | Script mode studio / screenshots, non utilisé en prod. |
| `post-process-assets.js` | Pipeline post-traitement (sharp, vignette, logo), sorties non référencées. |

### Ajustement `package.json`

- Suppression des scripts pointant vers les fichiers archivés :
  - `screenshots`
  - `studio-screenshots`
  - `capture-demo`
  - `assets:build`
- Conservation de **`log:step2`** (référence `tools/rebuild/generate_step_log_02.mjs`).

### Fichiers non archivés (toujours utilisés)

- **`tools/rebuild/generate_step_log_02.mjs`** : toujours référencé par `npm run log:step2`, laissé en place.

---

## 3. Nettoyer les assets (images)

### Source de vérité

- **`src/lib/projects.ts`** : tous les projets utilisent **`image: '/images/projects/<id>.svg'`**.
- **Layout / Header** : `favicon.svg`, `favicon.png`, `logo.svg` dans `public/images/`.

### Images déplacées vers `archive/images/projects/`

- Tous les **`*-thumb.png`** et **`*-detail.png`** (anciennes captures / variantes non référencées) :
  - astro-data-viewer-thumb.png, astro-data-viewer-detail.png  
  - blog-cms-thumb.png, blog-cms-detail.png  
  - calculatrice-thumb.png, calculatrice-detail.png  
  - constellations-thumb.png, constellations-detail.png  
  - dashboard-thumb.png, dashboard-detail.png  
  - ecommerce-thumb.png, ecommerce-detail.png  
  - fractal-generator-thumb.png, fractal-generator-detail.png  
  - solar-system-thumb.png, solar-system-detail.png  
  - three-body-thumb.png, three-body-detail.png  
- Dossier **`processed/`** en entier (sorties WebP du pipeline post-traitement, non référencées).

### Images conservées dans `public/images/` et `public/images/projects/`

- **Projets** : tous les **`.svg`** référencés dans `projects.ts` (solar-system, calculatrice, constellations, blog-cms, ecommerce, dashboard, three-body, astro-data-viewer, fractal-generator).
- **Racine images** : `favicon.svg`, `favicon.png`, `logo.svg`.
- **`public/images/projects/raw/`** : conservé (avec `.gitkeep` si présent) pour d’éventuelles captures brutes.

### Documentation archive

- **`archive/README.md`** : description du contenu (scripts, images) et date d’archivage.

---

## 4. Validation du build

- **Commande** : `npm run build`
- **Résultat** : **succès** (compilation, TypeScript, génération des pages statiques sans erreur).
- Aucun import cassé, aucun fichier utile supprimé. La codebase reste stable après nettoyage.

---

## 5. Résumé

| Catégorie | Action |
|-----------|--------|
| Code mort | Suppression de `ORBIT_SIZE_DESKTOP` dans `SolarSystem.tsx`. |
| Imports inutiles | Aucune suppression (props démo conservées). |
| Scripts | 6 scripts déplacés dans `archive/scripts/`, 4 entrées npm supprimées. |
| Assets images | 18 PNG + dossier `processed/` déplacés dans `archive/images/projects/`. |
| Build | Validé (OK). |

---

## 6. Commit

- Message : `chore: cleanup dead code, unused imports, and archive legacy files`
- Fichiers modifiés : `src/components/demos/SolarSystem.tsx`, `package.json`, nouveau `archive/` et contenu, `docs/rebuild/STEP_LOG_61_CODEBASE_CLEANUP.md`.
