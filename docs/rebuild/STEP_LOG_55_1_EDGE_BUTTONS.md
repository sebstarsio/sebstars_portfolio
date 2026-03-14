# STEP_LOG_55_1 — Boutons techniques ancrés aux bords de l’écran

## Objectif

Corriger le placement des boutons **Specs** et **Code** : ils ne doivent plus être dans la navbar ni limités à sa largeur. Ils doivent être ancrés aux bords de l’écran, alignés sur la ligne basse du header, sans ajouter de hauteur ni décaler le contenu.

---

## 1. Stratégie de positionnement retenue

**`position: fixed`** pour la couche qui porte les deux boutons.

- **Conteneur** `.demo-technical-badges` : `position: fixed; top: 88px; left: 0; right: 0; height: 0; pointer-events: none; z-index: 25`.
- **Slots** : `position: absolute` dans ce conteneur — Specs en `left: 0.75rem`, Code en `right: 0.75rem`, `top: 0`.
- Les boutons (ArchitectureNotes, ViewSourceButton) sont en `position: static` à l’intérieur des slots pour ne pas sortir du flux du slot.

---

## 2. Justification du choix

- **Fixed** : la couche est indépendante du scroll et du conteneur navbar (max-width). Elle couvre toute la largeur du viewport, ce qui permet un ancrage réel **bord gauche / bord droit** de l’écran.
- **`top: 88px`** : correspond à la hauteur de `.wf-header-zone` (ligne basse du header), donc alignement visuel avec le bas du header.
- **`height: 0`** : le conteneur ne réserve aucun espace vertical ; les boutons en `absolute` dans les slots dépassent sans influencer le layout.
- **`pointer-events: none`** sur le conteneur, **`pointer-events: auto`** sur les slots : seuls les boutons sont cliquables, le reste de la zone ne bloque pas les clics.

Une alternative en **`absolute`** aurait nécessité un ancrage à un wrapper parent (ex. body ou main) et une gestion plus fragile du scroll ; **fixed** assure un comportement stable et prévisible sur toutes les pages démo.

---

## 3. Comportement desktop

- **Specs** : bord gauche de l’écran, à `0.75rem` du bord.
- **Code** : bord droit de l’écran, à `0.75rem` du bord.
- Alignement vertical : sur la ligne définie par `top: 88px` (bas du header).
- Style : fond semi-transparent, bordure discrète, opacité ~0.7 au repos, renforcée au hover. Icône + libellé « Specs » / « Code ».
- Aucun impact sur la hauteur de la navbar ni sur le flux de la page.

---

## 4. Comportement mobile

- **Breakpoint** : `max-width: 780px`.
- **`top`** : `72px` (hauteur réduite de la zone header sur mobile).
- **Specs / Code** : toujours bord gauche / bord droit avec `left: 0.5rem` et `right: 0.5rem`.
- **Variante ultra compacte** : icône seule (libellé masqué visuellement avec technique “visually hidden” pour conserver l’accessibilité). Padding et taille d’icône réduits (10px).
- Les boutons restent cliquables et ne recouvrent pas les contrôles essentiels de la démo ni les liens principaux de la navbar.

---

## 5. Confirmation : aucune hauteur supplémentaire

- La couche `.demo-technical-badges` a **`height: 0`** et ne participe pas au flux du document.
- Aucun `margin`, `padding` ou élément en flux ajouté sous la navbar ou sous le header.
- Le Hero et le contenu des démos ne sont pas décalés.

---

## 6. Validation visuelle finale

- Navbar : hauteur inchangée, aucun espace vide ajouté en dessous.
- Specs : bien au bord gauche de l’écran (hors largeur navbar).
- Code : bien au bord droit de l’écran (hors largeur navbar).
- Boutons alignés visuellement avec la ligne basse du header.
- Desktop et mobile : pas de régression, boutons discrets, cliquables, sans chevauchement avec la navigation ou les contrôles de la démo.

---

## Fichiers concernés

- **Nouveau** : `src/components/DemoTechnicalBadges.tsx` — composant client qui affiche Specs et Code à partir du `project` (uniquement sur les pages démo).
- **Nouveau** : `src/styles/components/demo-technical-badges.css` — positionnement fixed, styles ghost, responsive.
- **Modifié** : `src/components/Header.tsx` — suppression de la prop `demoProject` et de tout rendu des badges dans la navbar.
- **Modifié** : `src/app/demo/[id]/page.tsx` — rendu de `<DemoTechnicalBadges project={...} />` à la place du passage de `demoProject` au Header.
- **Modifié** : `src/styles/components/header.css` — suppression des règles liées aux badges dans la navbar.
- **Modifié** : `src/styles/globals.css` — import de `demo-technical-badges.css`.
