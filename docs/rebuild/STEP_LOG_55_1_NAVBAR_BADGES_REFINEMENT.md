# STEP_LOG_55_1 — Affinage des badges techniques dans la Navbar

## Objectif

Affiner l’intégration des boutons **Specs** et **Code** dans la Navbar des pages projet : apparition discrète au hover (Option A) et variante desktop / mobile ultra compacte (Option B), sans modifier la hauteur de la Navbar.

---

## 1. Comportement hover implémenté (Option A)

**Oui.**

- **Au repos** : opacité réduite (`opacity: 0.5`), légère désaturation (`filter: saturate(0.85)`), bordure très discrète (`rgba(125, 243, 255, 0.15)`). Les badges restent visibles mais peu mis en avant.
- **Au survol de la Navbar** (`.wf-header-inner--with-badges:hover`) : opacité augmentée (`0.92`), saturation normale (`filter: saturate(1)`), bordure un peu plus marquée. Transition courte (`0.22s ease`) sur `opacity`, `color`, `border-color`, `filter`.
- **Au survol direct du badge** : opacité 1, couleur accent, bordure renforcée (comportement déjà présent, conservé).

Aucune classe `group` Tailwind utilisée : tout est géré en CSS avec `.wf-header-inner--with-badges:hover` sur le conteneur. Pas d’animation forte, effet discret et lisible.

---

## 2. Logique desktop / mobile appliquée (Option B)

**Oui.**

- **Desktop** : icône + texte, format miniature (9px, padding réduit), position gauche/droite en bas de la Navbar inchangée.
- **Mobile** (breakpoint `max-width: 780px`) : variante **ultra compacte** — **icône seule**.
  - Labels « Specs » et « Code » sont **visuellement masqués** via une technique d’accessibilité (position absolue, clip, taille 1px) pour garder le sens pour les lecteurs d’écran tout en n’affichant que l’icône.
  - Padding minimal (`0.2rem`), `font-size: 0`, `gap: 0`, icônes 10×10px.
  - Positions `left` / `right` à `0.5rem` pour rester dans la zone utile sans chevaucher les liens.

Aucun `hidden md:flex` / `flex md:hidden` : une seule structure, différenciation par CSS (media query + masquage visuel du label sur mobile).

---

## 3. Choix retenu pour la version mobile

- **Icône seule** (label masqué visuellement, conservé pour l’accessibilité).
- Taille et padding minimaux pour ne pas gêner la navigation (Home, Projets, Lab, Contact).
- Même positionnement en bas de la Navbar (absolute bottom, left/right), sans ajout de hauteur ni d’espace vertical.

---

## 4. Positionnement et non-régression

- **Specs** : `absolute; bottom: 0; left: 1rem` (0.5rem sur mobile).
- **Code** : `absolute; bottom: 0; right: 1rem` (0.5rem sur mobile).
- Parent : `.wf-header-inner` reste `position: relative`, pas de `margin-bottom` ajouté.
- **Aucune hauteur supplémentaire** : les badges restent en position absolue dans le bloc existant, aucun nouveau flux ni espace vide sous la Navbar.

---

## 5. Validation desktop

- Page projet (ex. `/demo/calculatrice`) : badges visibles en bas à gauche (Specs) et à droite (Code).
- Au repos : discrets (opacité ~0.5, peu saturés).
- Au survol de la Navbar : plus visibles (opacité ~0.92), transition fluide.
- Clics Specs (panneau) et Code (lien GitHub) fonctionnels.
- Pas d’empiètement sur le logo ni sur les liens de navigation.

---

## 6. Validation mobile

- Sur viewport ≤ 780px : navbar en colonne, badges en bas à gauche/droite, **icône seule**, très compacts.
- Aucun chevauchement avec Home, Projets, Lab, Contact.
- Boutons restent cliquables (zone tactile suffisante).
- Aucune augmentation de hauteur de la Navbar constatée.

---

## 7. Confirmation : aucune hauteur supplémentaire

- Les badges sont en `position: absolute; bottom: 0` dans `.wf-header-inner`.
- Aucun `margin-bottom`, aucun `padding-bottom` ajouté au header ou à la zone navbar.
- Le Hero et le contenu sous la Navbar ne sont pas décalés.

---

## Fichiers modifiés

- `src/styles/components/header.css` : règles au repos / hover (Option A), règles responsive mobile icône seule (Option B), transitions.
