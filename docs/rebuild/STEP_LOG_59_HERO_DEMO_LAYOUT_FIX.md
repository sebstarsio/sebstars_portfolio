# STEP_LOG_59 — Correction du chevauchement Hero / démo (Système Solaire)

**Date** : 2025-03-12  
**Objectif** : Corriger le bug de layout sur la page démo du projet Système Solaire : le Hero masquait partiellement ou totalement la démo (surtout sur mobile).

---

## 1. Fichiers de layout analysés

- **`src/app/demo/[id]/page.tsx`** : structure de la page démo (Header → DemoTechnicalBadges → main.wf-main → renderDemo()).
- **`src/components/demos/SolarSystem.tsx`** : composant avec une section Hero (`wf-section wf-hero`) puis la section démo (`wf-section wf-projects` contenant le système planétaire). Logique de positionnement dans un `useEffect` (updateSystemPosition).
- **`src/styles/components/header.css`** : zone header 88px (72px sur mobile), header sticky avec margin-top négatif.
- **`src/styles/demos/solar-system.css`** : section démo en `height: 100vh`, `z-index: 2`, overflow hidden.

---

## 2. Cause réelle du conflit

Le chevauchement venait **du `translateY` appliqué au conteneur interne du système solaire** (`.solar-system`, `systemRef`).

- **Formule utilisée** : `offset = heroBottom - containerTop - neptuneRadius + 50`, puis `transform: translateY(${offset}px) scale3d(...)`.
- **Comportement** : La section démo (`wf-projects`) est **sous** le Hero dans le flux. Donc `containerTop` > `heroBottom`, d’où un **offset négatif** (souvent fort, ex. -500).
- **Effet** : `translateY(-500px)` déplace le système planétaire **vers le haut**, donc **sous la section Hero** : la démo est masquée, surtout sur mobile (viewport court).

Aucun problème de `overflow-hidden` ou de z-index sur le Hero en soi : le flux est correct (Hero puis section démo). C’est uniquement ce **translateY négatif** qui tire la démo sous le Hero.

---

## 3. Correctif appliqué

**Fichier** : `src/components/demos/SolarSystem.tsx`

- **Règle** : ne plus appliquer de `translateY` négatif, pour ne jamais remonter la démo sous le Hero.
- **Implémentation** :  
  - Dans le `useEffect` principal (resize / scroll / wheel) : calcul de `offset` inchangé, puis **`translateY = Math.max(0, offset)`** avant d’appliquer le `transform`.  
  - Dans le second `useEffect` (dépendant de `scale`) : même logique **`translateY = Math.max(0, offset)`**.
- **Comportement obtenu** :  
  - Si le conteneur est sous le Hero (cas normal), offset &lt; 0 → `translateY = 0` : la démo reste centrée dans sa section, entièrement visible.  
  - Si un jour offset &gt; 0 (cas marginal), un léger décalage vers le bas reste possible, sans masquer la démo.

Aucune modification du Hero, ni des sections, ni du Header. Aucun changement de structure HTML.

---

## 4. Ajustements mobile

- La même formule avec **`Math.max(0, offset)`** s’applique à toutes les tailles d’écran (resize et scroll écoutés).
- Sur mobile, `containerTop` reste supérieur à `heroBottom`, donc offset reste négatif → `translateY(0)` : la démo ne remonte plus sous le Hero.
- La section démo garde `height: 100vh` et `z-index: 2` (solar-system.css) ; pas de changement côté CSS.

---

## 5. Validation desktop

- La démo est entièrement visible sous le Hero.
- Le Hero ne masque plus le haut de la démo.
- Les planètes et le Soleil restent visibles et cliquables.
- Le scale (zoom molette) continue de fonctionner ; le `transform` ne contient plus de `translateY` négatif.

---

## 6. Validation mobile

- La démo apparaît bien sous le Hero, sans être cachée.
- Elle ne remonte plus sous le Hero grâce au clamp de `translateY`.
- Pas de débordement bloquant ; la zone reste exploitable.
- Pas d’amputation visuelle de la démo.

---

## 7. Confirmation

La démo Système Solaire est maintenant **visible et accessible** sur desktop et mobile, sans chevauchement avec le Hero. Le correctif est limité à la logique de positionnement (clamp du `translateY`) ; le Hero et le composant SolarSystem ne sont pas cassés.
