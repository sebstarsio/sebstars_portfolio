# STEP LOG 54.5 — Pipeline de post-traitement des assets

## Objectif

Pipeline automatique pour uniformiser les captures d’écran des projets du portfolio SebStars : sharpening, vignette, overlay logo, sorties WebP optimisées pour les cartes (thumb) et les pages détail (full).

---

## 1. Librairie utilisée

- **Sharp** (Node.js) pour toute la chaîne : lecture, netteté, vignette (SVG composite), logo (composite avec opacité), recadrage, export WebP.

---

## 2. Dossier source scanné

- **Chemin** : `/public/images/projects/raw/`
- **Rôle** : source brute des captures (Screenshot Studio ou autres).
- Les fichiers source ne sont jamais modifiés ; seules les sorties sont écrites dans un dossier distinct.

---

## 3. Traitement appliqué

| Étape | Détail |
|--------|--------|
| **Sharpening** | `sharp.sharpen({ sigma: 0.8, m1: 1, m2: 0.5 })` — netteté légère, peu d’artefacts, texte et bords d’interface renforcés. |
| **Vignette** | Overlay SVG (gradient radial) : centre transparent, bords assombris (opacité ~0,35). Composite `over` pour un assombrissement discret et cinématographique. |
| **Logo** | Logo SebStars (`public/images/logo.svg`) redimensionné (~12 % du petit côté), opacité 40 %, position coin inférieur droit avec marge 2 %. Composite `over`. |

---

## 4. Stratégie de watermark (logo)

- **Source** : `public/images/logo.svg` (SVG).
- **Taille** : proportionnelle à l’image (ratio 12 % du plus petit côté), avec `fit: 'inside'` pour conserver les proportions.
- **Opacité** : 40 % (canal alpha multiplié via `linear()` après conversion en PNG intermédiaire).
- **Position** : coin inférieur droit, marge 2 % des bords.
- **Style** : watermark discret, non intrusif, cohérent avec le branding.

---

## 5. Format de sortie

- **Dossier** : `/public/images/projects/processed/`
- **Formats** : WebP uniquement.
- **Qualité** : full 88, thumb 82 (compromis qualité / poids).

---

## 6. Convention de nommage

- **Thumb (cartes / Lab)** : `[project]-thumb.webp`  
  - Format 16:9, largeur cible 640 px, recadrage central depuis la source.
- **Full (page détail)** : `[project]-full.webp`  
  - Haute résolution, dimensions de la source conservées (après traitements).

L’identifiant projet est déduit du nom du fichier source (sans extension, et en retirant les suffixes `-detail`, `-thumb`, `-full`). En cas de plusieurs fichiers pour un même projet, le script choisit en priorité un fichier dont le nom contient `-detail`, sinon le plus lourd.

---

## 7. Logique de scan

- Lecture de tous les fichiers dans `raw/` dont l’extension est `.png`, `.jpg`, `.jpeg` ou `.webp`.
- Regroupement par projet (id déduit du nom de fichier).
- Une seule source par projet (préférence `-detail`, sinon plus gros fichier).
- Pour chaque projet : application du pipeline (sharpen → vignette → logo) puis génération de `[id]-thumb.webp` et `[id]-full.webp`.

---

## 8. Optimisation pour les cartes (thumb)

- Recadrage central pour respecter le ratio 16:9.
- Redimensionnement à 640 px de large (hauteur proportionnelle).
- Qualité WebP 82 pour un poids raisonnable.
- Même pipeline visuel (netteté, vignette, logo) que la version full.

---

## 9. Commande et validation

- **Commande** : `npm run assets:build` → `node scripts/post-process-assets.js`
- **Validation** : exécuter la commande avec au moins une image dans `raw/` ; vérifier la présence de `[project]-thumb.webp` et `[project]-full.webp` dans `processed/`, le rendu du sharpening (subtil), de la vignette (discrète) et du logo (coin bas-droit, discret).

---

## 10. Limitations

- Le dossier `raw/` doit exister et contenir au moins un fichier image ; s’il est vide, le script crée `raw/` et affiche un message invitant à y déposer les captures.
- Le logo doit être présent à `public/images/logo.svg` ; sinon l’étape logo est ignorée (pas d’échec du script).
- Un seul fichier source par projet est utilisé ; en cas de plusieurs fichiers (ex. `-detail` et `-thumb`), le choix est fait selon les règles ci-dessus.
