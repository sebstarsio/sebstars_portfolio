# STEP_LOG_58 — Réplication du modèle Solar System sur la Calculatrice

**Date** : 2025-03-12  
**Objectif** : Comprendre exactement pourquoi le projet Système Solaire fonctionne (vignette + page détail), puis reproduire la même mécanique pour la Calculatrice uniquement.

---

## 1. DIAGNOSTIC SOLAR SYSTEM

### Question : Le système solaire utilise-t-il une image statique ou un composant React live ?

**Réponse : OPTION A — Image statique.**

- **Carte projet** : `ProjectCard.tsx` affiche toujours `<Image src={project.thumbnailUrl ?? project.image} />`. Aucune branche ne rend `<SolarSystem />` ou un autre composant live. Pour solar-system, `thumbnailUrl` est absent, donc `src={project.image}` → `/images/projects/solar-system.svg`.
- **Page détail** : `src/app/projects/[id]/page.tsx` affiche `{project.image && <Image src={project.image} ... />}`. Aucun composant live ; uniquement l’image définie dans les données.

**Conclusion :**

```
SolarSystem rendering mode: STATIC IMAGE
```

Le composant `<SolarSystem />` est utilisé **uniquement** sur la route `/demo/solar-system` (`src/app/demo/[id]/page.tsx`), pas dans la carte ni sur la page détail projet.

---

## 2. Chaîne complète : source de donnée → composant → rendu final

| Étape | Fichier / acteur | Rôle |
|--------|-------------------|------|
| 1. Données | `src/lib/projects.ts` | Chaque projet a `image: '/images/projects/[id].svg'` (ex. `solar-system.svg`, `calculatrice.svg`). Pas de `thumbnailUrl` → la carte utilise `project.image`. |
| 2. Carte projet | `src/components/ProjectCard.tsx` | Reçoit `project` en prop. Affiche `<Image src={project.thumbnailUrl ?? project.image} />` dans `.rail-card-image`. Même code pour tous les projets. |
| 3. Liste des cartes | `src/components/Projects.tsx` | Appelle `getAllProjects()` puis mappe sur `<ProjectCard project={p} index={i} />`. Utilisé sur la Home et la page /projects. |
| 4. Page détail | `src/app/projects/[id]/page.tsx` | Appelle `getProjectById(id)`. Si `project.image` est défini, affiche `<Image src={project.image} ... />` dans le contenu. |

Aucune logique conditionnelle sur `project.id === 'solar-system'` dans ces fichiers. Solar System et Calculatrice passent par le même flux.

---

## 3. Modification appliquée à la Calculatrice

- **Aucun changement de mécanique** : la Calculatrice utilisait déjà la même architecture (image statique via `project.image`).
- **Vérification des chemins** :
  - Solar System : `image: '/images/projects/solar-system.svg'` → fichier `public/images/projects/solar-system.svg` (présent et valide).
  - Calculatrice : `image: '/images/projects/calculatrice.svg'` → fichier `public/images/projects/calculatrice.svg` (présent et valide).
- **Commentaire ajouté** dans `src/lib/projects.ts` au-dessus de l’entrée `calculatrice` pour documenter la règle (alignée sur Solar System) :

  - La vignette et l’image de détail utilisent le champ `project.image`.
  - Le fichier attendu pour la Calculatrice est `calculatrice.svg` dans `public/images/projects/`.

Aucun autre projet n’a été modifié.

---

## 4. Confirmation : la Calculatrice suit la même architecture que Solar System

| Critère | Solar System | Calculatrice |
|---------|--------------|--------------|
| Champ utilisé (carte + détail) | `project.image` | `project.image` |
| Composant carte | `ProjectCard` → `<Image src={…} />` | Idem |
| Composant page détail | `<Image src={project.image} />` | Idem |
| Fichier attendu | `public/images/projects/solar-system.svg` | `public/images/projects/calculatrice.svg` |
| Rendu live (démo) | `/demo/solar-system` → `<SolarSystem />` | `/demo/calculatrice` → `<Calculator />` |

Les deux projets partagent la même architecture : **image statique** pour carte et page détail, **composant live** uniquement sur la route `/demo/[id]`.

---

## 5. Fichiers impliqués dans le rendu (vignette + détail)

- `src/lib/projects.ts` — source de vérité pour `image` (et optionnellement `thumbnailUrl`).
- `src/components/ProjectCard.tsx` — rendu de la vignette via `thumbnailUrl ?? image`.
- `src/app/projects/[id]/page.tsx` — rendu de l’image en page détail via `project.image`.
- `src/components/Projects.tsx` — fournit la liste des projets aux cartes (Home et /projects).
- `public/images/projects/solar-system.svg` — asset utilisé pour Solar System.
- `public/images/projects/calculatrice.svg` — asset utilisé pour la Calculatrice.

---

## 6. Cache et rafraîchissement

Si la vignette ou l’image de détail ne se met pas à jour après ajout ou remplacement de `calculatrice.svg` :

1. Redémarrer le serveur Next.js : `npm run dev`
2. Vider le cache du navigateur ou faire un hard refresh : **Ctrl+F5** (Windows/Linux) ou **Cmd+Shift+R** (Mac).

Next.js et le navigateur peuvent conserver d’anciennes images en cache.
