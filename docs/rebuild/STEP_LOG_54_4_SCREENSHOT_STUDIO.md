# STEP LOG 54.4 — Screenshot Studio Mode & automatisation

## Objectif

Système interne de production d’assets visuels uniformes pour le portfolio SebStars : mode de rendu dédié à la capture (`?studio=1`) et script Playwright pour générer des captures 2K cohérentes et cinématographiques des pages projet.

---

## 1. Méthode retenue pour activer le mode studio

- **Détection** : paramètre d’URL `?studio=1`.
- **Application** : composant client `StudioModeDetector` (dans le layout racine, sous `Suspense`) lit `useSearchParams().get('studio')` et applique `body.setAttribute('data-studio', 'true')` lorsque la valeur est `'1'`, sinon retire l’attribut.
- **Avantages** : pas de state global, pas de cookie, reproductible (l’URL suffit pour le script de capture), purement visuel.

Fichiers concernés :

- `src/components/StudioModeDetector.tsx`
- `src/app/layout.tsx` (import + `<Suspense><StudioModeDetector /></Suspense>`)

---

## 2. Styles appliqués en mode studio

Fichier : `src/styles/components/studio-mode.css`, ciblé par `body[data-studio="true"]`.

| Effet | Détail |
|--------|--------|
| **Fond Deep Space** | `background` radial-gradient uniforme (ebony → slate → zinc). |
| **Grille Lab HD** | Pseudo-élément `::before` fixe, grille 32px, cyan très discret, masque radial pour adoucir les bords. |
| **Nettoyage UI** | Masquage de `.wf-header-zone`, `.wf-header`, `.cookie-consent` ; scrollbars cachées (webkit + scrollbar-width). |
| **Glow** | Légère intensification sur `.rail-card` et éléments `[class*="lab-glass"]` (box-shadow cyan). |
| **Vignetage** | Pseudo-élément `::after` fixe, `box-shadow: inset` pour assombrir les bords (effet cinématographique). |

Le contenu principal (`main`, `.wf-main`) reçoit un `padding-top` et un `z-index` pour rester au-dessus de la grille.

---

## 3. Outil utilisé

- **Playwright** (chromium), même stack que le script existant `generateProjectScreenshots.ts`.
- Script : `scripts/generateStudioScreenshots.ts`.
- Commande npm : `npm run studio-screenshots`.

---

## 4. Résolution de capture

- **Viewport** : 2560×1440 (2K 16:9).
- **Capture** : `fullPage: true` pour l’image détail (hauteur variable selon le contenu).
- **Vignette** : recadrage central 50 % de la capture détail, exportée en `[slug]-thumb.png`.

---

## 5. Projets capturés

- **Source** : liste d’ids déduite du fichier `src/lib/projects.ts` (regex sur `id: '...'`), sans importer le module (évite résolution `@/` depuis le script).
- **Exclus** : `solar-system`, `three-body`, `fractal-generator` (rendus graphiques / logique à part).
- **Cibles** : tous les autres projets listés dans la source de vérité (ex. `calculatrice`, `constellations`, `blog-cms`, `ecommerce`, `dashboard`, `astro-data-viewer`).

---

## 6. Convention de nommage

- **Détail** : `[slug]-detail.png` (ex. `calculatrice-detail.png`).
- **Vignette** : `[slug]-thumb.png` (ex. `calculatrice-thumb.png`).
- **Dossier** : `public/images/projects/`.

Compatible avec les champs `image` et `thumbnailUrl` (ou équivalents) des données projet.

---

## 7. Comportement du script

1. Lit les ids depuis `src/lib/projects.ts` et filtre les exclus.
2. Pour chaque id : `GET http://localhost:3000/projects/[id]?studio=1`.
3. Attend `main.wf-main` puis `body[data-studio="true"]`, puis délai de stabilisation (2,5 s).
4. Screenshot PNG full page → `[id]-detail.png`.
5. Recadrage central (50 %) avec Sharp → `[id]-thumb.png`.

Prérequis : serveur local (`npm run dev`) sur la base URL (défaut `http://localhost:3000`). Variable d’environnement `BASE_URL` optionnelle.

---

## 8. Limitations

- Dépendance au serveur local : le script ne lance pas le dev server.
- La liste des projets est déduite par regex ; tout changement de format des ids dans `projects.ts` peut nécessiter d’adapter la regex ou de passer par un export dédié.
- Les projets exclus (solar-system, three-body, fractal-generator) ne sont pas capturés par ce script ; d’autres pipelines (ex. `generateProjectScreenshots.ts` pour les démos) peuvent les gérer.
- Effets “cinéma” (vignetage, grille) sont appliqués en CSS dans le navigateur au moment de la capture ; pas de post-traitement (grain, etc.) dans le script pour l’instant.

---

## 9. Intégration design system 54.1

Le mode studio réutilise les variables et la logique visuelle du Lab (palette Deep Space, grille technique, glow). Les captures sont donc alignées avec l’identité “Research Lab / SaaS Engineering Platform” et réutilisables pour `thumbnailUrl` et `image` dans les données projet.
