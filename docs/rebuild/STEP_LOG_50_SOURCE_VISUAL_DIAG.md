# STEP_LOG_50_SOURCE_VISUAL_DIAG — Source réelle du visuel Système Solaire

## 1. Source réelle de la vignette (carte projet)

- **Composant** : `src/components/ProjectCard.tsx`
- **Propriété utilisée** : `project.image`
- **Rendu** : Si `project.image` est défini, la carte affiche un `<Image>` Next.js avec `src={project.image}`, `fill`, `objectFit: 'cover'`.
- **Donnée** : Dans `src/lib/projects.ts`, le projet `solar-system` a `image: '/images/projects/solar-system.svg'`.
- **Fichier réel** : Les URLs commençant par `/` sont servies depuis `public/`. Donc la vignette vient du fichier **`public/images/projects/solar-system.svg`**.

**Conclusion** : La vignette **ne provient pas** du composant `SolarSystem.tsx`. Elle provient d’une **image statique** : `public/images/projects/solar-system.svg`.

---

## 2. Source réelle du visuel en page détail

- **Page** : `src/app/projects/[id]/page.tsx`
- **Bloc concerné** : Lignes 102-113 : `{project.image && ( <div>...<Image src={project.image} ... />...</div> )}`
- **Propriété** : `project.image` (même champ que pour la carte).
- **Fichier réel** : Même fichier **`public/images/projects/solar-system.svg`**.

**Conclusion** : Le visuel de la page détail **ne provient pas** du composant `SolarSystem.tsx`. Il provient de la **même image statique** : `public/images/projects/solar-system.svg`.

---

## 3. Correction effectuée

Puisque la vignette et la page détail utilisent toutes les deux **l’image statique** `public/images/projects/solar-system.svg`, les changements faits dans `SolarSystem.tsx` et `solar-system.css` ne peuvent pas les affecter.

**Action** : Mise à jour du fichier **`public/images/projects/solar-system.svg`** pour qu’il reflète les mêmes choix visuels que la démo :

- **Orbites** : Même logique que le CSS (compression interne, respiration externe) : 8 orbites avec rayons dérivés des diamètres 180, 265, 350, 430, 570, 700, 830, 960 px, mis à l’échelle dans le viewBox 320×240.
- **Soleil** : Taille réduite par rapport aux orbites (équivalent ~72 px en logique démo), dégradé radial cohérent.
- **Planètes** : Tailles différenciées (Mercure plus petite, Jupiter/Saturne plus grandes), couleurs alignées sur le CSS.
- **Position** : Répartition angulaire asymétrique (déphasage) pour éviter l’alignement en ligne et rappeler les `animation-delay` du composant live.
- **Style** : Bordures d’orbites un peu plus visibles (équivalent `rgba(255,255,255,0.14)`), fond spatial identique.

Le SVG reste une illustration statique (pas d’animation dans la vignette/détail), mais la **composition** (répartition, tailles, couleurs) est alignée avec le rendu de la démo `/demo/solar-system`.

---

## 4. Détail de la correction (SVG)

- **Fichier modifié** : `public/images/projects/solar-system.svg`
- **Changements** :
  - Fond : dégradé aligné sur le thème sombre du portfolio (`#0a0d28` → `#080c1c`).
  - Orbites : 8 cercles (au lieu de 3) avec rayons dérivés des diamètres CSS (180 à 960 px), mis à l’échelle dans le viewBox 320×240 ; stroke `rgba(255,255,255,0.14)`.
  - Soleil : rayon 9 (équivalent ~72 px), dégradé radial avec point clair.
  - Planètes : 8 planètes (Mercure → Neptune) avec rayons différenciés (2 à 4.5), couleurs identiques au CSS, positions angulaires décalées pour une composition asymétrique (pas d’alignement).
  - Petits points d’étoiles conservés en arrière-plan.

---

## 5. Validation finale

- **Build** : `npm run dev` / `npm run build` à lancer après mise à jour du SVG.
- **Vérifications à faire** :
  - **Carte projet** (accueil ou `/projects`) : la vignette du projet « Système Solaire » doit afficher le nouveau visuel (8 orbites, soleil central, 8 planètes réparties de façon asymétrique).
  - **Page détail** `/projects/solar-system` : l’image sous le titre doit afficher le même visuel.
  - **Démo** `/demo/solar-system` : inchangée (composant + CSS), les ajustements STEP_LOG_50_SOLAR_LAYOUT restent en vigueur.
