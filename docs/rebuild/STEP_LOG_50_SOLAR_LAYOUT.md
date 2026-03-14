# STEP_LOG_50 — Amélioration du rendu visuel SolarSystem

## Objectif

Améliorer la composition visuelle du composant `SolarSystem.tsx` (démo Lab) pour un rendu plus harmonieux, lisible et cinématographique, sans casser l’interactivité ni la logique du système solaire.

---

## 1. Constantes identifiées

### Fichier `src/styles/demos/solar-system.css`

| Élément | Constante / règle | Rôle |
|--------|-------------------|------|
| **Soleil** | `width/height: 80px`, `radial-gradient`, `box-shadow` | Taille et présence du centre |
| **Orbites** | `width/height` par classe (200 → 900 px), `border: 1px solid rgba(255,255,255,0.1)` | Distances relatives, visibilité des cercles |
| **Animation orbites** | `orbit-rotate` 0°→360°, `animation-duration` 8s à 60s par planète | Vitesse angulaire, pas de déphasage initial |
| **Planètes** | `width/height: 20px`, `top: -10px`, `left: 50%`, `transform: translate3d(-50%,0,0)` | Taille unique, centrage sur l’orbite |
| **Planètes** | Couleurs + `box-shadow: 0 0 4px` par classe | Identification, halo léger |

### Fichier `src/components/demos/SolarSystem.tsx`

| Constante | Valeur | Rôle |
|----------|--------|------|
| `scale` (état) | 0.7 (défaut) | Zoom global du système |
| `neptuneRadius` | 450 | Demi-diamètre orbite Neptune pour le positionnement vertical (alignement hero) |
| `offset` | `heroBottom - containerTop - neptuneRadius + 50` | Translation verticale du bloc `.solar-system` |

Aucune constante de type `ORBIT_SPACING`, `SCALE_FACTOR`, `SUN_SIZE` ou `BASE_RADIUS` n’existait en JS : tout le rendu dimensionnel est piloté par le CSS.

---

## 2. Réglages modifiés

### 2.1 Distances / orbites (compression non linéaire)

- **Logique** : resserrer un peu les planètes internes, donner plus de respiration aux orbites externes, tout en gardant une progression cohérente (pas de distances uniformes).
- **Valeurs avant** (diamètres en px) : 200, 300, 400, 500, 600, 700, 800, 900.
- **Valeurs après** (diamètres en px) : 180, 265, 350, 430, 570, 700, 830, 960.

Interprétation : légère compression pour Mercure–Mars, puis écartement progressif pour Jupiter–Neptune. La plus grande orbite (Neptune) passe de 900 à 960 px pour un meilleur équilibre en bord de scène.

### 2.2 Position initiale (asymétrie)

- **Problème** : toutes les orbites utilisaient la même animation `orbit-rotate` sans décalage, donc toutes les planètes démarraient alignées (même angle 0°).
- **Solution** : `animation-delay` négatif par orbite pour simuler un déphasage au chargement.

Valeurs utilisées :

| Orbite | Durée | animation-delay |
|--------|--------|------------------|
| Mercure | 8s | 0s |
| Vénus | 12s | -1.6s |
| Terre | 16s | -3.2s |
| Mars | 20s | -5s |
| Jupiter | 30s | -7.5s |
| Saturne | 40s | -10s |
| Uranus | 50s | -12.5s |
| Neptune | 60s | -15s |

Résultat : au chargement, les planètes sont déjà réparties sur leurs orbites, composition asymétrique et plus vivante sans toucher à la logique d’animation.

### 2.3 Tailles relatives (planètes)

- **Logique** : garder les petites planètes visibles, renforcer la présence de Jupiter et Saturne, éviter une taille unique qui noie les différences.
- **Modifications** :
  - Mercure : 14 px (au lieu de 20).
  - Vénus : 18 px.
  - Terre : 20 px (référence).
  - Mars : 17 px.
  - Jupiter : 30 px.
  - Saturne : 26 px.
  - Uranus / Neptune : 22 px.

Pour chaque planète : `width`, `height` et `top: -halfHeight` pour conserver le centrage sur l’orbite (avec `transform: translate3d(-50%, 0, 0)`).

### 2.4 Soleil

- Taille : 80 px → 72 px pour ne pas écraser la scène.
- Dégradé : `radial-gradient` avec point de lumière décalé (`at 30% 30%`) et transition jusqu’à une teinte plus orangée.
- Halo : box-shadow avec rgba pour un glow un peu plus doux, animation `sun-glow` légèrement ralentie (2.5s).
- Hover : scale 1.2 → 1.15.

### 2.5 Polissage visuel

- **Orbites** : bordure `rgba(255,255,255,0.1)` → `0.14` pour une meilleure lisibilité.
- **Planètes** : petits dégradés radiaux (point clair à 30% 30%) + `box-shadow` renforcé (6px, 8px pour Jupiter/Saturne) pour un peu plus de relief et de contraste, sans effet cartoon.

### 2.6 Composant SolarSystem.tsx

- `neptuneRadius` : 450 → 480 pour correspondre au nouveau diamètre d’orbite Neptune (960 px) dans le calcul de positionnement vertical (`updateSystemPosition` et effet lié à `scale`).

---

## 3. Logique adoptée (résumé)

- **Distances** : compression légère des orbites internes, respiration accrue pour les externes ; progression non linéaire, pas d’échelle uniforme.
- **Tailles** : hiérarchie claire (petites rocheuses, géantes gazeuses plus marquées), toutes restent cliquables et lisibles.
- **Position initiale** : déphasage par `animation-delay` négatif pour une répartition angulaire asymétrique dès le premier frame.
- **Style** : rester premium / spatial (dégradés discrets, halos, pas de cartoon), cohérent avec le thème SebStars.

---

## 4. Rendu carte projet vs page détail

- **Carte projet (thumbnail)** : la carte utilise l’image statique `project.image` (`/images/projects/solar-system.svg`). Les changements ci‑dessus concernent uniquement le composant démo (`SolarSystem.tsx` + CSS). L’image SVG de la carte n’a pas été modifiée ; si besoin d’alignement visuel, il faudrait adapter ce SVG à part.
- **Page détail projet** : affiche la même image statique et les liens « Voir la démo » / « Voir le code ». Le rendu amélioré s’applique sur la **page démo** (`/demo/solar-system`), où le composant SolarSystem est rendu en entier.

---

## 5. Interactivité

- Aucun changement sur les handlers (clic, zoom molette, pause, etc.).
- Les orbites gardent `pointer-events: none` ; les planètes et le Soleil restent `pointer-events: auto` avec les mêmes `z-index`.
- Les tailles et positions sont uniquement en CSS (width, height, top) ; les hitboxes suivent naturellement les nouveaux rayons.
- Les animations (orbit-rotate, sun-glow) et le scale global restent gérés comme avant ; seul le calcul de `neptuneRadius` a été mis à jour pour le positionnement.

**Conclusion** : l’interactivité (clics planètes/Soleil, rotation, zoom, pause) est préservée.

---

## 6. Validation

- **Build** : `npm run build` exécuté avec succès après les modifications.
- **Fichiers modifiés** :
  - `src/styles/demos/solar-system.css` (orbites, soleils, planètes, bordures, halos).
  - `src/components/demos/SolarSystem.tsx` (neptuneRadius 450 → 480, commentaires).

Recommandation : lancer `npm run dev`, ouvrir `/demo/solar-system`, vérifier le rendu (équilibre, asymétrie au chargement, lisibilité, clics et zoom) en desktop et mobile.
