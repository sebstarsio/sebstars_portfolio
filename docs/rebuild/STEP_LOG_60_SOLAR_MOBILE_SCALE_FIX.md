# STEP_LOG_60 — Correction échelle et clipping mobile (Système Solaire)

**Date** : 2025-03-12  
**Objectif** : Corriger le rendu mobile de la démo Système Solaire (système minuscule, zones vides, coupure haut/bas) sans casser le desktop.

---

## 1. Cause réelle des bordures / zones vides

La cause venait du **scale CSS appliqué au conteneur** sur mobile dans `solar-system.css` :

- **@media (max-width: 768px)** : `.solar-system-container { transform: scale(0.38); }`
- **@media (max-width: 480px)** : `.solar-system-container { transform: scale(0.28); }`

En réduisant **tout le conteneur** (et non seulement le système planétaire), le bloc gardait sa place en flex (ex. une grande part de 100vh) mais le **contenu visible** était réduit à 38 % (ou 28 %) au centre. D’où :

- système solaire minuscule ;
- deux grandes bandes vides en haut et en bas (et sur les côtés) ;
- impression de « coupure » car le conteneur restait grand alors que le dessin était tout petit.

Aucune hauteur fixe type `h-64` ou `max-h-96` en cause : le problème était uniquement ce **scale sur le conteneur**.

---

## 2. Conteneur(s) corrigé(s)

**Fichier** : `src/styles/demos/solar-system.css`

- **@media (max-width: 768px)**  
  - Suppression de `transform: scale(0.38)` et `transform-origin` sur `.solar-system-container`.  
  - Conservation de `width: 100%`, `height: 100%`, `overflow: hidden`.  
  - Ajout de **`min-height: 55vh`** pour que la zone démo ait une hauteur minimale confortable sur mobile.

- **@media (max-width: 480px)**  
  - Suppression de `transform: scale(0.28)` et `transform-origin`.  
  - Ajout de **`min-height: 50vh`** pour `.solar-system-container`.

Le conteneur ne subit plus de scale CSS ; il occupe correctement l’espace et l’échelle est gérée en JS.

---

## 3. Logique de hauteur mobile retenue

- Section démo : **`height: 100vh`**, **`max-height: 100vh`** (inchangé).
- Conteneur démo (`.solar-system-container`) :
  - **768px** : **`min-height: 55vh`** pour éviter un tassement excessif (hero + wave + contrôles).
  - **480px** : **`min-height: 50vh`** pour garder une zone utile sur très petit écran.

Pas de hauteur arbitraire énorme ; le flux reste normal avec un minimum garanti pour la zone de rendu.

---

## 4. Logique d’échelle mobile ajoutée

**Fichier** : `src/components/demos/SolarSystem.tsx`

- **Constantes** :  
  - `MOBILE_BREAKPOINT = 768`  
  - `ORBIT_SIZE_MOBILE = 600` (orbite Neptune en px sur mobile, cohérent avec le CSS)

- **Nouvel `useEffect` (montage uniquement)** :  
  - **`updateMobileScale()`** : si `window.innerWidth < 768`, mesure du conteneur (`containerRef.current.getBoundingClientRect()`), puis  
    - `scaleToFit = (min(largeur, hauteur) / 600) * 0.9`  
    - scale clampé entre **0.35** et **1.1**, puis `setScale(next)` (sans changer si la différence est < 0.02 pour éviter les oscillations).

  - Appels de **`updateMobileScale`** :  
    - au montage : **requestAnimationFrame** + **setTimeout(..., 150)** pour laisser le layout se stabiliser ;  
    - sur **resize** ;  
    - sur **ResizeObserver** du conteneur (si dispo) pour réagir aux changements de taille réelle (rotation, réduction de la zone démo, etc.).

Résultat sur mobile : le système remplit la zone utile (≈ 90 % du plus petit côté), reste lisible, et le zoom molette continue de modifier `scale` par-dessus cette base.

---

## 5. Ajustement du centre

Aucun changement explicite du centre de rotation ou du positionnement du Soleil. Le centre reste géré par le layout flex du conteneur (`align-items: center`, `justify-content: center`) et par le `transform-origin: center center` sur `.solar-system`. En supprimant le scale CSS du conteneur, le bloc `.solar-system` occupe à nouveau toute la zone et le centrage est correct.

---

## 6. Validation desktop

- Aucune modification du comportement pour **viewport ≥ 768px** : pas de scale CSS, pas d’appel à `updateMobileScale` (guard `window.innerWidth >= MOBILE_BREAKPOINT`).
- Scale initiale **0.7** inchangée ; zoom molette inchangé.
- Pas de régression sur le centrage ni sur le Hero / démo.

---

## 7. Validation mobile

- **Conteneur** : plus de scale CSS → plus de « mini système au milieu d’un grand cadre » ; la zone de rendu correspond à la zone visible.
- **Échelle** : calculée pour remplir ~90 % du plus petit côté (min(largeur, hauteur) / 600 * 0.9), avec min 0.35 et max 1.1 → système plus grand, lisible, sans bordures géantes.
- **Hauteur** : `min-height: 55vh` / `50vh` évite un conteneur trop écrasé.
- **Clipping** : plus de scale sur le conteneur, overflow géré par la taille réelle du conteneur et le scale JS → pas de coupure artificielle haut/bas.
- **Interactivité** : clics et zoom molette conservés ; ResizeObserver + resize permettent d’adapter l’échelle après rotation ou redimensionnement.

---

## Résumé

- **Cause** : `transform: scale(0.38)` / `scale(0.28)` sur `.solar-system-container` en CSS mobile.
- **Correctifs** : suppression de ce scale, `min-height` mobile sur le conteneur, calcul d’échelle en JS (fit au conteneur, ResizeObserver + resize), sans toucher au desktop.
