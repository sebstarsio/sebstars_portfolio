# STEP_LOG_53 — Correctifs responsive (Lab mobile)

## Contexte

Correction des régressions mobiles signalées sur le SebStars Lab sans dégrader le design desktop.

---

## 1. Système Solaire (`SolarSystem.tsx` / `solar-system.css`)

### 1.1 Cause du chevauchement Hero / démo

- Les sections `.wf-hero` et `.wf-section.wf-projects` sont en flux normal ; sur mobile, un stacking context ou un rendu particulier pouvait faire passer le Hero visuellement au-dessus de la zone démo.
- La section contenant le système solaire n’avait pas de `z-index` explicite.

### 1.2 Correctifs appliqués

**A. Z-index / stacking**

- `section.wf-section.wf-projects` : ajout de `position: relative` et `z-index: 2` pour qu’elle se dessine au-dessus du Hero et éviter tout chevauchement sur mobile.

**B. Adaptation au viewport / centrage**

- Les orbites ont des tailles fixes (180px à 960px) ; sur petit écran, le contenu dépassait.
- Sur **max-width: 768px** : `.solar-system-container` reçoit `transform: scale(0.38)` et `transform-origin: center center` pour que l’ensemble (jusqu’à 960px) tienne dans l’écran tout en restant centré.
- Sur **max-width: 480px** : scale passé à `0.28` pour les très petits écrans.
- `overflow: hidden` et `min-height: 0` sur le conteneur sont conservés pour éviter tout débordement.

**C. Recentrage**

- Le centrage est assuré par le flex existant (`align-items: center`, `justify-content: center`) sur `.solar-system-container` ; le scale est appliqué avec `transform-origin: center center`, donc la scène reste centrée.

**Fichiers modifiés**

- `src/styles/demos/solar-system.css`

---

## 2. Calculatrice (`Calculator.tsx` / `calculator.css`)

### 2.1 Problème

- En mode scientifique, la grille en 8 colonnes débordait sur mobile.
- Les touches étaient trop grandes sur petit écran.

### 2.2 Correctifs appliqués

**A. Grille mode scientifique**

- Déjà en place à 768px : `grid-template-columns: repeat(4, 1fr)` pour `.calculator-grid.scientific-mode`.
- Ajout de `gap: 0.4rem` à 768px, puis `gap: 0.35rem` à 600px et `gap: 0.3rem` à 480px pour limiter le débordement et garder un clavier lisible.

**B. Réduction des touches sur mobile**

- **768px** : `font-size: 0.8rem` pour `.calculator-btn-scientific`.
- **600px** : padding et min-height réduits pour les boutons scientifiques (`padding: 0.7rem 0.4rem`, `min-height: 44px`, `font-size: 0.75rem`).
- **480px** : réduction globale (`.calculator-btn` et `.calculator-btn-scientific` plus compacts), écran et mémoire aussi réduits (`calculator-screen`, `calculator-btn-memory`, `calculator-display-text`) pour que tout tienne sans scroll horizontal.

**C. Mode standard**

- Non modifié ; les media queries ciblent le mode scientifique et les tailles globales des boutons sans changer la logique du mode standard.

**Fichiers modifiés**

- `src/styles/demos/calculator.css`

---

## 3. Badges Specs / Code (`ViewSourceButton`, `ArchitectureNotes`)

### 3.1 Objectif

- Rester visibles et cliquables sur petit écran.
- Éviter tout débordement latéral ou sortie du viewport.

### 3.2 Correctifs appliqués

**ViewSourceButton** (`view-source-button.css`)

- **768px** : `top: 0.75rem`, `right: 0.75rem`, `padding: 0.2rem 0.4rem`, `font-size: 9px`.
- **480px** : `top: 0.5rem`, `right: 0.5rem`, `padding: 0.2rem 0.35rem`, `font-size: 9px`.

**ArchitectureNotes** (`architecture-notes.css`)

- **768px** : `top: 0.75rem`, `left: 0.75rem` ; badge avec `padding: 0.2rem 0.4rem`, `font-size: 9px` ; panneau avec `width: min(300px, calc(100vw - 1.5rem))`, `max-height: 60vh`.
- **480px** : `top: 0.5rem`, `left: 0.5rem` ; badge encore un peu réduit ; panneau `width: calc(100vw - 1rem)`, `max-height: 55vh` pour rester dans l’écran.

**Fichiers modifiés**

- `src/styles/components/view-source-button.css`
- `src/styles/components/architecture-notes.css`

---

## 4. Validation

- **Desktop** : aucun changement en dehors des media queries ; comportement et rendu inchangés.
- **Mobile** :
  - Système solaire : section démo au-dessus du Hero (z-index), scale pour tenir dans le viewport, scène centrée.
  - Calculatrice : grille scientifique en 4 colonnes, touches plus compactes, pas de débordement horizontal.
  - Badges : positions et tailles adaptées, panneau Specs contenu dans l’écran.

---

## 5. Limitations éventuelles

- **Système solaire** : le scale est fixe (0.38 / 0.28) par breakpoint ; un scale fluide (type `clamp` ou calcul JS) pourrait affiner pour des largeurs intermédiaires.
- **Calculatrice** : en mode scientifique sur très petit écran (≈320px), les touches restent utilisables mais très compactes ; une alternative (ex. fonctions scientifiques repliables) n’a pas été mise en place, les réglages de grille et de taille étant jugés suffisants.
