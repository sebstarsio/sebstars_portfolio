# STEP_LOG_50 — Calculatrice : rendu visuel et source des visuels (vignette + détail)

**Date** : 2025-03-12  
**Objectif** : Appliquer à la **Calculatrice** la même démarche que pour le Système Solaire : améliorer le rendu du composant, identifier la vraie source de la vignette et de la page détail, aligner l’image statique sur le code. **Aucune génération d’image par IA** — uniquement code, CSS et édition ciblée du SVG existant.

---

## 1. Constantes identifiées (Calculator.tsx + calculator.css)

Équivalent des paramètres “layout” du Solar System pour la Calculatrice :

| Élément | Rôle | Valeur / source |
|--------|------|------------------|
| `currentExpression` | Texte affiché au-dessus du display (expression en cours) | Initial : `'E = mc²'` (déjà défini en STEP_LOG_57) |
| `display` | Valeur principale à l’écran | Initial : `'0'` |
| `mode` | Mode normal / scientifique | Initial : `'normal'` |
| Palette (calculator.css) | Couleurs du conteneur, écran, boutons | `#080c1c`, `#03050e`, `#7dd3fc`, `#c8ebff`, `#162034`, `#3b82f6`, `#10b981` |
| Structure | Grille 4 colonnes (normale), mémoire en haut, écran, puis boutons | Définie par les classes CSS et le JSX |

Aucune “distance” ou “orbite” : la composition est pilotée par l’état initial (expression + display) et la palette CSS.

---

## 2. Source réelle de la vignette et du visuel page détail

- **Vignette (carte projet)** : `ProjectCard` utilise `project.thumbnailUrl ?? project.image`. Pour la Calculatrice, seul `project.image` est défini → **image statique** `project.image` = `/images/projects/calculatrice.svg`.
- **Page détail** : `src/app/projects/[id]/page.tsx` affiche `<Image src={project.image} />` → même fichier **calculatrice.svg**.

Donc :

- **Vignette** : fichier `public/images/projects/calculatrice.svg` (propriété `project.image` dans `src/lib/projects.ts`).
- **Visuel détail** : même fichier `public/images/projects/calculatrice.svg`.

Le composant live `<Calculator />` n’est utilisé que sur `/demo/calculatrice`, pas dans la carte ni sur la page détail.

---

## 3. Modifications appliquées

### 3.1 Composant (déjà en place)

- `currentExpression` initial = `'E = mc²'` pour un premier frame lisible et “science” (fait en STEP_LOG_57).
- Aucun autre changement de logique ou d’interactivité.

### 3.2 Image statique (calculatrice.svg)

- **Objectif** : aligner le SVG sur le **code** (palette et structure du composant), sans créer de nouvelle image IA.
- **Méthode** : reprise du SVG existant ; remplacement des couleurs et du contenu texte par celles de `calculator.css` et de l’état initial.

Modifications effectuées :

- Fond : dégradé sombre `#050716` → `#080c1c` (équivalent du fond du portfolio / calculator-container).
- Cadre : fond `#080c1c`, bordure `rgba(125,243,255,0.35)` (cyan du composant).
- Écran : fond `#03050e`, ligne d’expression “E = mc²” en `rgba(125,243,255,0.6)`, valeur “0” en `#c8ebff` (aligné calculator-display-text).
- Boutons mémoire : `#162034`, bordure cyan (calculator-btn-memory).
- Boutons numériques / opérateurs : même palette (#162034, #3b82f6, #10b981) et structure simplifiée (7, 8, 9, ÷, =).

Aucun nouvel asset généré par IA ; uniquement mise à jour du SVG pour qu’il reflète le rendu du composant.

---

## 4. Logique adoptée (équivalent “distances / tailles / position”)

- **“Disposition”** : expression initiale visible (`E = mc²`) + display `0` pour un rendu cohérent à t = 0.
- **“Tailles relatives”** : dans le SVG, proportions lisibles en miniature (cadre, écran, une rangée de chiffres + opérateur + égal).
- **“Position initiale”** : pas d’animation ; le SVG est une capture statique alignée sur le premier frame du composant (mode normal, expression + 0).

---

## 5. Validation

- **Carte projet** : la vignette affiche `calculatrice.svg` (même chemin que Solar System : `project.image`).
- **Page détail** : l’image de détail est le même `calculatrice.svg`.
- **Démo** : `/demo/calculatrice` reste entièrement interactive (clic boutons, historique, mode scientifique), sans régression.
- **Règle “pas d’artiste”** : aucune génération DALL·E / Midjourney / Stable Diffusion ; seuls le code React et l’édition du SVG existant ont été utilisés.

---

## 6. Uniformisation — règle pour tous les projets

Pour **chaque projet** du portfolio (y compris Système Solaire et Calculatrice) :

1. **Vignette et image de détail** = **image statique**.
   - Source : `project.image` (et éventuellement `project.thumbnailUrl`) dans `src/lib/projects.ts`.
   - Fichier servi : `public/images/projects/[id].svg` (ou .png si utilisé).

2. **Pour “améliorer” le visuel carte / détail** :
   - **Option A** : Améliorer le **composant live** (paramètres initiaux, CSS) pour que le premier frame soit bon ; puis **remplacer** le fichier image par une capture manuelle de la démo (`/demo/[id]`) si on veut que la vignette/détail reflètent exactement le composant.
   - **Option B** : Éditer le **SVG existant** (couleurs, texte, formes) pour l’aligner sur la palette et la structure du composant (comme pour calculatrice.svg), **sans** génération IA.

3. **Interdit** : génération d’images par IA (DALL·E, Midjourney, Stable Diffusion, etc.). Tout visuel doit provenir du code (composant + CSS) ou d’un fichier image édité manuellement / par script à partir du code.

4. **Documentation** : pour chaque projet, un commentaire ou une doc peut rappeler que la vignette et la page détail viennent de `project.image` et que le fichier à mettre à jour est `public/images/projects/[id].svg` (ou le chemin utilisé).

---

## 7. Fichiers modifiés

- `public/images/projects/calculatrice.svg` — alignement sur la palette et la structure du composant Calculator (pas de nouvel art).
- `src/components/demos/Calculator.tsx` — aucun changement dans cette étape (expression initiale déjà réglée en STEP_LOG_57).
- `src/lib/projects.ts` — aucun changement (commentaire Calculatrice déjà présent en STEP_LOG_58).

---

## 8. Extension aux autres projets

La même démarche (alignement du SVG sur la palette du composant, sans IA) a été appliquée à tous les autres projets du portfolio. Voir **STEP_LOG_59_VISUELS_TOUS_PROJETS.md** pour la liste et le détail des modifications.

---

## 9. Confirmation interactivité

- Les clics sur les boutons (chiffres, opérateurs, =, mémoire, mode scientifique) fonctionnent.
- L’historique et le basculement de mode ne sont pas affectés.
- Aucune modification du comportement du composant ; seuls l’état initial (déjà en place) et le fichier SVG statique ont été concernés.
