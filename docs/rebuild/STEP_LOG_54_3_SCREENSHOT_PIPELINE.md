# STEP_LOG_54_3 — Pipeline de captures réelles des démos Lab

## Objectif

Remplacer les images générées artificiellement par des **captures réelles** des démos exécutées localement, avec un cadre visuel uniforme (viewport 1600×900, ratio 16:9).

---

## 1. Projets capturés

Les captures sont effectuées sur les pages **démo** (`/demo/[id]`) pour les projets suivants :

| ID projet        | Vignette              | Image détail            |
|------------------|------------------------|--------------------------|
| `calculatrice`   | `calculatrice-thumb.png`  | `calculatrice-detail.png`  |
| `constellations` | `constellations-thumb.png` | `constellations-detail.png` |
| `blog-cms`       | `blog-cms-thumb.png`      | `blog-cms-detail.png`      |
| `ecommerce`      | `ecommerce-thumb.png`     | `ecommerce-detail.png`     |
| `dashboard`      | `dashboard-thumb.png`     | `dashboard-detail.png`     |
| `astro-data-viewer` | `astro-data-viewer-thumb.png` | `astro-data-viewer-detail.png` |

**Total : 6 projets × 2 images = 12 fichiers** dans `public/images/projects/`.

---

## 2. Projets exclus

Les projets suivants conservent leurs visuels existants (rendus graphiques déjà pertinents) :

- **solar-system** (Système solaire)
- **three-body** (Problème à N corps)
- **fractal-generator** (Fractales)

Aucune capture automatique n’est effectuée pour ces projets.

---

## 3. Méthode de capture

### Outils

- **Playwright** (Chromium) : navigation et screenshot
- **Sharp** : recadrage central pour les vignettes
- **tsx** : exécution du script TypeScript

### Script

- **Emplacement** : `scripts/generateProjectScreenshots.ts`
- **Commande** : `npm run screenshots` (prérequis : `npm run dev` sur `http://localhost:3000`)

### Déroulement

1. Lancement du navigateur headless (Chromium).
2. Viewport fixe : **1600×900 px** (ratio 16:9).
3. Pour chaque projet de la liste :
   - Navigation vers `http://localhost:3000/demo/[id]`.
   - Attente du sélecteur `main.wf-main` et délai de 1,5 s pour le rendu.
   - Capture de la zone viewport (pas de full page) → enregistrement en `[id]-detail.png`.
   - Recadrage de la zone centrale (60 % largeur × 60 % hauteur) via Sharp → enregistrement en `[id]-thumb.png`.
4. Fermeture du navigateur.

### Données projets

La liste des projets à capturer et des projets exclus est définie dans le script (alignée sur `src/lib/projects.ts`). Les chemins d’images dans les données projets sont déjà du type :

- `thumbnailUrl: "/images/projects/[id]-thumb.png"`
- `image: "/images/projects/[id]-detail.png"`

Aucune modification de `src/lib/projects.ts` n’est nécessaire pour pointer vers les nouvelles captures.

---

## 4. Taille des images

| Fichier   | Dimensions (approx.) | Usage                    |
|-----------|----------------------|---------------------------|
| `*-detail.png` | 1600 × 900 px    | Page détail projet        |
| `*-thumb.png`  | 960 × 540 px (60 % du centre) | Cartes projets (vignettes) |

Format : **PNG**. Pas de fond ni grille ajoutés en post-traitement ; l’interface réelle de la démo est capturée telle quelle.

---

## 5. Réutilisation

Pour régénérer les captures après modification des démos :

1. Démarrer le site : `npm run dev`
2. Dans un autre terminal : `npm run screenshots`
3. Les fichiers dans `public/images/projects/` sont écrasés pour les 6 projets listés ci-dessus.

Option : `BASE_URL=http://localhost:3000 npm run screenshots` si le port diffère.
