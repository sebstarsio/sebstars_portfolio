# STEP_LOG_54_1 — Identité visuelle unifiée (Research Lab / SaaS)

## Objectif

Unifier l’identité visuelle du portfolio SebStars autour d’une esthétique **Research Lab / SaaS Engineering Platform** : ingénierie logicielle, analyse de données, systèmes complexes, laboratoire technologique.

---

## 1. Palette "Deep Space"

### Fonds (variables CSS)

| Variable | Valeur (dark) | Usage |
|----------|----------------|--------|
| `--lab-bg-ebony` | `#0f1419` | Fond principal |
| `--lab-bg-slate` | `#020617` | Fond secondaire |
| `--lab-bg-zinc` | `#09090b` | Fond profond |

### Accents technologiques

| Variable | Valeur (dark) | Rôle |
|----------|----------------|------|
| `--lab-accent-cyan` | `#06b6d4` | Primary (interactions, bordures, glow) |
| `--lab-accent-violet` | `#7c3aed` | Secondary |
| `--lab-accent-emerald` | `#34d399` | Signal (succès, validation) |

### Mode clair

Les mêmes variables sont redéfinies dans `html.theme-light` avec des teintes adaptées (fonds clairs, accents plus doux).

**Fichier** : `src/styles/variables.css`

---

## 2. Effets visuels (variables)

### Glow technique

- `--lab-glow-cyan` : ombre portée cyan (20px + 40px)
- `--lab-glow-violet` : ombre portée violette
- `--lab-glow-emerald` : ombre portée emerald

### Glassmorphism

- `--lab-glass-bg` : fond translucide
- `--lab-glass-border` : bordure subtile
- `--lab-glass-blur` : `12px`
- `--lab-glass-highlight` : reflet lumineux `inset 0 1px 0`

**Fichier** : `src/styles/variables.css`

---

## 3. Utilitaires (lab-identity.css)

### Fichier créé

`src/styles/lab-identity.css` (importé dans `globals.css` après `variables.css`).

### Classes

- **Glow** : `.lab-glow-cyan`, `.lab-glow-violet`, `.lab-glow-emerald` (box-shadow)
- **Glow au hover** : `.lab-glow-cyan-hover`, `.lab-glow-violet-hover`
- **Glass** : `.lab-glass` (background + backdrop-filter + border + box-shadow)
- **Grille technique** : `.lab-grid-bg` — grille fine (24px), opacité ~4 %, masque radial pour estompage vers les bords
- **Data-lines** : `.lab-datalines-bg` — lignes horizontales répétées, masque linéaire vertical
- **Micro-interactions** : `.lab-card-lift` — `translateY(-4px)` au hover, transition 0.25s

---

## 4. Système de grille / data-lines

- **Grille** : `linear-gradient` horizontal + vertical (1px, rgba cyan 0.04), `background-size: 24px 24px`, `mask-image: radial-gradient(ellipse 80% 80%, …)` pour estomper sur les bords.
- **Data-lines** : `repeating-linear-gradient` horizontal (pas 20px), `mask-image: linear-gradient(to bottom, transparent, black, transparent)` pour estomper en haut/bas.

Appliqué à :
- Cartes projets : grille en `::before` sur `.rail-card`
- Lab : data-lines en `::before` sur `.lab-showroom`

---

## 5. Composants modifiés

| Composant | Modifications |
|-----------|----------------|
| **Body** (`main.css`) | Fond en `radial-gradient` avec `--lab-bg-ebony`, `--lab-bg-slate`, `--lab-bg-zinc` |
| **Section projets** (`projects.css`) | Fond section avec variables lab ; `.rail-card` : glass, grille en ::before, hover avec `--lab-glow-cyan` et lift -4px ; `.rail-pill` : glass |
| **Cartes (theme-light)** | Override grille, glass et glow avec variables lab mode clair |
| **Lab** (`lab.css`) | Variables internes pointant vers `--lab-accent-cyan`, `--lab-glow-cyan`, etc. ; `.lab-hero-bg` avec cyan lab ; `.lab-showroom` avec data-lines en ::before |
| **ViewSourceButton** (`view-source-button.css`) | `--lab-glass-bg`, `--lab-glass-border`, hover avec `--lab-glow-cyan` et `--lab-accent-cyan` |
| **ArchitectureNotes** (`architecture-notes.css`) | Badge et panneau en glass lab, hover avec `--lab-glow-cyan` |

---

## 6. Vignettes projets (Prompt #54)

Les images générées au Prompt #54 (calculatrice, constellations, blog-cms, ecommerce, dashboard, astro-data-viewer) ont été produites avec une direction « dark tech / cyan-violet ». La palette lab (cyan #06b6d4, violet #7c3aed, emerald #34d399) est désormais la référence. Pour une conformité stricte, les vignettes peuvent être régénérées en imposant ces couleurs dans les prompts ; aucun changement automatique des assets n’a été fait dans cette étape.

---

## 7. Validation

- **Build** : `npm run dev` / `npm run build` à lancer pour vérifier l’absence d’erreurs.
- **Vérifications** : cohérence des couleurs (cyan/violet/emerald), lisibilité des textes, glow discret sur cartes et badges, grille/data-lines discrets, hover cartes (lift + glow), compatibilité mobile inchangée.

---

## 8. Fichiers impactés

- `src/styles/variables.css` — palette et variables lab
- `src/styles/lab-identity.css` — **nouveau** (utilitaires)
- `src/styles/globals.css` — import de `lab-identity.css`
- `src/styles/main.css` — fond body
- `src/styles/components/projects.css` — section, cartes, pill, theme-light
- `src/styles/components/lab.css` — variables lab, hero, showroom data-lines
- `src/styles/components/view-source-button.css` — glass + glow
- `src/styles/components/architecture-notes.css` — glass + glow
