# STEP LOG 56 — Rollback des assets projets (chemins Legacy)

## Objectif

Annuler les tentatives de remplacement des images par des captures automatisées ou assets intermédiaires, et restaurer les chemins d’images d’origine (Legacy) pour un état stable sans liens cassés.

---

## 1. Fichier source modifié

- **Source de vérité** : `src/lib/projects.ts` (pas de `src/data/projects.ts` dans ce projet).
- Ce fichier alimente la galerie (ProjectCard) et les pages détail (`/projects/[id]`).

---

## 2. Méthode de rollback utilisée

- **Git** : consultation de l’historique (`git show 4f330eb:src/lib/projects.ts`).
- **Commit de référence** : `4f330eb` — "Production release — SebStars portfolio v1.0".
- Dans cet état, chaque projet avait uniquement `image: '/images/projects/[id].svg'` (pas de `thumbnailUrl`).
- **Vérification physique** : présence des 9 fichiers SVG dans `public/images/projects/` (solar-system.svg, calculatrice.svg, constellations.svg, blog-cms.svg, ecommerce.svg, dashboard.svg, three-body.svg, astro-data-viewer.svg, fractal-generator.svg).

---

## 3. Chemins restaurés

Pour chaque projet, remplacement de :

- `thumbnailUrl: '/images/projects/[id]-thumb.png'`
- `image: '/images/projects/[id]-detail.png'`

par :

- **`image: '/images/projects/[id].svg'`** (seul champ image conservé).

| Projet            | Chemin restauré                          |
|-------------------|-------------------------------------------|
| solar-system      | /images/projects/solar-system.svg         |
| calculatrice      | /images/projects/calculatrice.svg         |
| constellations    | /images/projects/constellations.svg       |
| blog-cms          | /images/projects/blog-cms.svg             |
| ecommerce         | /images/projects/ecommerce.svg            |
| dashboard         | /images/projects/dashboard.svg            |
| three-body        | /images/projects/three-body.svg           |
| astro-data-viewer | /images/projects/astro-data-viewer.svg    |
| fractal-generator | /images/projects/fractal-generator.svg    |

---

## 4. Références cassées supprimées

- Suppression de toutes les références à `*-thumb.png` et `*-detail.png` dans les données projets.
- Suppression du champ `thumbnailUrl` pour chaque entrée (la galerie utilise `thumbnailUrl ?? image`, donc `image` seul suffit).

---

## 5. Confirmation absence de 404

- Chaque chemin restauré pointe vers un fichier **présent** dans `public/images/projects/`.
- Aucun lien mort : les SVG legacy sont versionnés et existants.
- La galerie et les pages détail utilisent désormais uniquement `project.image` (ou `thumbnailUrl ?? image`, avec `thumbnailUrl` absent donc `image`).

---

## 6. Validation

À exécuter après déploiement ou en local :

- `npm run dev` → vérifier la galerie projets et plusieurs pages `/projects/[id]`.
- Vérifier l’absence d’erreurs 404 sur les images et l’affichage correct des visuels SVG.
