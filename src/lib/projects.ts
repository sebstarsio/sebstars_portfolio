/**
 * MODULE DONNÉES PROJETS
 * 
 * Ce fichier contient toutes les données des projets à afficher dans le portfolio.
 */

import { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'solar-system',
    title: 'Système Solaire',
    subtitle: 'Simulation interactive du système solaire avec données astronomiques réelles de la NASA et de l\'IAU, permettant une exploration éducative immersive des planètes et de leurs caractéristiques.',
    description: 'Simulation interactive du système solaire avec orbites réalistes et informations planétaires détaillées. Rendu en temps réel avec animations CSS 3D. Données astronomiques réelles (NASA/IAU) avec mode éducatif, statistiques globales, comparaisons entre planètes, recherche, et export de données.',
    category: 'animation',
    technologies: ['TypeScript', 'CSS3', 'React', 'Next.js'],
    image: '/images/projects/solar-system.svg',
    demo: '/demo/solar-system',
    github: 'https://github.com/sebstars/systeme-solaire',
    githubUrl: 'https://github.com/sebstarsio/sebstars_portfolio/blob/main/src/components/demos/SolarSystem.tsx',
    architectureNotes: {
      fr: {
        algorithm: 'Orbites planétaires modélisées en CSS 3D (transform, animation) avec données NASA/IAU pour échelles et périodes.',
        performance: 'Animations GPU-accelerated via will-change et transform; un seul repaint par frame.',
        challenge: 'Aligner le rendu visuel avec les données astronomiques réelles sans librairie physique.',
      },
      en: {
        algorithm: 'Planetary orbits modeled in CSS 3D (transform, animation) with NASA/IAU data for scale and periods.',
        performance: 'GPU-accelerated animations via will-change and transform; single repaint per frame.',
        challenge: 'Aligning visual rendering with real astronomical data without a physics library.',
      },
    },
    features: [
      'Animations CSS 3D fluides avec orbites réalistes',
      'Données astronomiques réelles (NASA/IAU)',
      'Mode éducatif avec descriptions détaillées',
      'Statistiques globales et comparaisons entre planètes',
      'Recherche et export de données (JSON, CSV)',
      'Informations complètes (température, excentricité, inclinaison, lunes)',
      'Contrôles interactifs (pause/play, reset, zoom, plein écran)'
    ],
  },
  {
    // ATTENTION — Vignette et page détail (même mécanique que Système Solaire) :
    // Pour que la vignette et l'image de la Calculatrice s'affichent correctement,
    // le fichier calculatrice.svg doit être présent dans : public/images/projects/
    id: 'calculatrice',
    title: 'Calculatrice Avancée',
    subtitle: 'Calculatrice scientifique complète avec historique, fonctions avancées et gestion de mémoire pour les calculs complexes.',
    description: 'Calculatrice scientifique complète avec historique des calculs (50 dernières opérations), mode normal et scientifique, fonctions trigonométriques (sin, cos, tan, asin, acos, atan), logarithmiques (log, ln), racines (√, ∛), puissances (x², x³, ^), constantes (π, e), gestion de mémoire (MC, MR, M+, M-, MS), bouton Ans pour réutiliser le dernier résultat, et affichage de l\'expression en cours.',
    category: 'animation',
    technologies: ['TypeScript', 'CSS3', 'HTML5', 'React', 'Next.js'],
    image: '/images/projects/calculatrice.svg',
    demo: '/demo/calculatrice',
    github: 'https://github.com/sebstars/calculatrice',
    githubUrl: 'https://github.com/sebstarsio/sebstars_portfolio/blob/main/src/components/demos/Calculator.tsx',
    architectureNotes: {
      fr: {
        algorithm: 'Évaluation d\'expressions via parsing et exécution séquentielle; pile pour priorité des opérateurs.',
        performance: 'État local React minimal; historique limité à 50 entrées pour éviter les re-renders inutiles.',
        challenge: 'Gérer les cas limites (division par zéro, NaN, infini) et l\'affichage des expressions en cours.',
      },
      en: {
        algorithm: 'Expression evaluation via parsing and sequential execution; stack for operator precedence.',
        performance: 'Minimal React local state; history capped at 50 entries to avoid unnecessary re-renders.',
        challenge: 'Handling edge cases (division by zero, NaN, infinity) and live expression display.',
      },
    },
    features: [
      'Mode normal et scientifique avec basculement',
      'Historique des calculs (50 dernières opérations) avec réutilisation',
      'Fonctions trigonométriques et logarithmiques complètes',
      'Racines, puissances et constantes mathématiques (π, e)',
      'Gestion de la mémoire (MC, MR, M+, M-, MS)',
      'Bouton Ans pour réutiliser le dernier résultat',
      'Affichage de l\'expression en cours de saisie'
    ],
  },
  {
    id: 'constellations',
    title: 'Simulateur de Constellations',
    subtitle: 'Exploration interactive du ciel étoilé avec effets visuels avancés, permettant de découvrir les constellations et leurs mythologies dans une expérience immersive.',
    description: 'Simulateur de constellations interactif avec ciel étoilé réaliste, effets de lumière et halos pour les étoiles, recherche avancée, export de données, mode nuit/jour et animations fluides. Exploration immersive du ciel avec informations détaillées sur les étoiles et leurs mythologies.',
    category: 'animation',
    technologies: ['TypeScript', 'Canvas API', 'HTML5', 'React', 'Next.js'],
    image: '/images/projects/constellations.svg',
    demo: '/demo/constellations',
    github: 'https://github.com/sebstars/constellations',
    githubUrl: 'https://github.com/sebstarsio/sebstars_portfolio/blob/main/src/components/demos/Constellations.tsx',
    architectureNotes: {
      fr: {
        algorithm: 'Projection équatoriale (RA/Dec) vers canvas 2D; rendu des étoiles et halos en Canvas API.',
        performance: 'requestAnimationFrame pour boucle de rendu; mise en cache des paths et dégradés.',
        challenge: 'Conserver lisibilité et performance avec des centaines d\'étoiles et effets de halo.',
      },
      en: {
        algorithm: 'Equatorial projection (RA/Dec) to 2D canvas; star and halo rendering via Canvas API.',
        performance: 'requestAnimationFrame for render loop; cached paths and gradients.',
        challenge: 'Keeping readability and performance with hundreds of stars and halo effects.',
      },
    },
    features: [
      'Ciel étoilé interactif avec effets de lumière réalistes et halos',
      'Recherche de constellations et étoiles avec informations détaillées',
      'Mode nuit/jour pour différentes ambiances visuelles',
      'Mythologies et descriptions complètes des constellations',
      'Distances et coordonnées équatoriales des étoiles',
      'Export de données (JSON/CSV)',
      'Système de zoom et pan fluide avec animations'
    ],
  },
  {
    id: 'blog-cms',
    title: 'Blog/CMS Full Stack',
    subtitle: 'Système de gestion de contenu complet avec authentification, éditeur WYSIWYG et base de données PostgreSQL pour créer et gérer du contenu de manière professionnelle.',
    description: 'Blog/CMS Full Stack avec authentification sécurisée (NextAuth.js), éditeur WYSIWYG Tiptap, prévisualisation en temps réel, base de données PostgreSQL, Prisma ORM et interface d\'administration. Démonstration complète d\'une application full stack moderne avec expérience utilisateur avancée.',
    category: 'fullstack',
    technologies: ['TypeScript', 'Next.js', 'PostgreSQL', 'Prisma', 'NextAuth.js', 'Tiptap', 'React'],
    image: '/images/projects/blog-cms.svg',
    demo: '/demo/blog-cms',
    github: 'https://github.com/sebstars/blog-cms',
    githubUrl: 'https://github.com/sebstarsio/sebstars_portfolio/blob/main/src/components/demos/BlogCMS.tsx',
    architectureNotes: {
      fr: {
        algorithm: 'CRUD articles via API Routes Next.js; éditeur Tiptap (ProseMirror); auth NextAuth.js avec rôles.',
        performance: 'Données mock en mémoire pour la démo; requêtes optimisées côté API pour un vrai backend.',
        challenge: 'Gérer permissions (USER/AUTHOR/ADMIN) et synchronisation état serveur / éditeur riche.',
      },
      en: {
        algorithm: 'Article CRUD via Next.js API Routes; Tiptap editor (ProseMirror); NextAuth.js with roles.',
        performance: 'In-memory mock data for demo; optimized API queries for a real backend.',
        challenge: 'Handling permissions (USER/AUTHOR/ADMIN) and server state / rich editor sync.',
      },
    },
    features: [
      'Base de données PostgreSQL avec Prisma ORM',
      'Authentification sécurisée avec NextAuth.js',
      'Éditeur WYSIWYG Tiptap avec barre d\'outils complète',
      'Prévisualisation en temps réel et CRUD complet d\'articles',
      'Gestion des tags et relations DB complexes',
      'Système de permissions par rôle (USER, AUTHOR, ADMIN)',
      'Interface d\'administration complète'
    ],
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Fullstack',
    subtitle: 'Boutique en ligne complète avec base de données PostgreSQL, gestion du panier, commandes, paiements Stripe et système de recommandations pour une expérience d\'achat complète.',
    description: 'Application e-commerce fullstack avec base de données PostgreSQL (Supabase), API REST complète, gestion du panier, commandes et stock en temps réel. Architecture moderne avec Next.js, Prisma ORM et authentification.',
    category: 'fullstack',
    technologies: ['TypeScript', 'Next.js', 'PostgreSQL', 'Prisma', 'Stripe', 'NextAuth.js', 'React'],
    image: '/images/projects/ecommerce.svg',
    demo: '/demo/ecommerce',
    github: 'https://github.com/sebstars/ecommerce',
    githubUrl: 'https://github.com/sebstarsio/sebstars_portfolio/blob/main/src/components/demos/Ecommerce.tsx',
    architectureNotes: {
      fr: {
        algorithm: 'API REST (produits, panier, checkout); intégration Stripe; état panier persistant côté client.',
        performance: 'Cache des produits et catégories; chargement progressif et états de chargement explicites.',
        challenge: 'Simuler flux paiement et stock sans backend réel; cohérence panier / session.',
      },
      en: {
        algorithm: 'REST API (products, cart, checkout); Stripe integration; client-side persistent cart state.',
        performance: 'Product and category caching; progressive loading and explicit loading states.',
        challenge: 'Simulating payment and inventory flow without a real backend; cart/session consistency.',
      },
    },
    features: [
      'Base de données PostgreSQL avec Prisma ORM',
      'API REST complète avec Next.js API Routes',
      'Catalogue de produits avec catégories et recherche',
      'Panier d\'achat persistant et gestion des commandes',
      'Paiements Stripe avec webhooks',
      'Système de recommandations basé sur l\'historique',
      'Liste de souhaits (wishlist)',
      'Gestion du stock en temps réel'
    ],
  },
  {
    id: 'dashboard',
    title: 'Dashboard de Données',
    subtitle: 'Tableau de bord interactif avec visualisation de données en temps réel, graphiques dynamiques et export pour analyser les performances métriques.',
    description: 'Dashboard interactif avec 8 métriques en temps réel, 4 types de graphiques (ligne, barres, aires, camembert), filtres temporels (7j, 30j, 90j, 1an), export JSON/CSV et mise à jour automatique toutes les 5 secondes. Canvas API optimisé.',
    category: 'data-ia',
    technologies: ['TypeScript', 'Canvas API', 'HTML5', 'React', 'Next.js'],
    image: '/images/projects/dashboard.svg',
    demo: '/demo/dashboard',
    github: 'https://github.com/sebstars/dashboard',
    githubUrl: 'https://github.com/sebstarsio/sebstars_portfolio/blob/main/src/components/demos/Dashboard.tsx',
    architectureNotes: {
      fr: {
        algorithm: 'Génération de séries temporelles et métriques simulées; 4 types de graphiques dessinés en Canvas.',
        performance: 'Rendu Canvas 2D unique par type de graphique; mise à jour toutes les 5s sans bloquer l\'UI.',
        challenge: 'Éviter les re-calculs coûteux et garder les graphiques lisibles sur petits écrans.',
      },
      en: {
        algorithm: 'Simulated time series and metrics generation; 4 chart types drawn in Canvas.',
        performance: 'Single Canvas 2D render per chart type; 5s refresh without blocking the UI.',
        challenge: 'Avoiding expensive recalculations and keeping charts readable on small screens.',
      },
    },
    features: [
      '8 métriques en temps réel (utilisateurs, revenus, commandes, conversion, sessions, rebond, durée, pages vues)',
      '4 types de graphiques (ligne, barres, aires, camembert)',
      'Filtres temporels (7 jours, 30 jours, 90 jours, 1 an)',
      'Export de données (JSON, CSV)',
      'Mise à jour automatique avec indicateurs de tendance',
      'Graphiques dynamiques avec Canvas API optimisé'
    ],
  },
  {
    id: 'three-body',
    title: 'Problème à N Corps',
    subtitle: 'Simulation interactive du problème à N corps en gravitation newtonienne avec rendu WebGL/Three.js, permettant d\'explorer le chaos déterministe avec des visualisations 3D accélérées par GPU.',
    description: 'Simulation interactive du problème à N corps (3-5 corps) en gravitation newtonienne avec rendu WebGL/Three.js, mode multi-corps, sauvegarde/chargement de configurations, comparaison de simulations et export avancé. Explorez le chaos déterministe avec des visualisations 3D accélérées par GPU.',
    category: 'animation',
    technologies: ['TypeScript', 'Three.js', 'WebGL', 'Canvas API', 'HTML5', 'Next.js'],
    image: '/images/projects/three-body.svg',
    demo: '/demo/three-body',
    github: 'https://github.com/sebstars/three-body',
    githubUrl: 'https://github.com/sebstarsio/sebstars_portfolio/blob/main/src/components/demos/ThreeBody.tsx',
    architectureNotes: {
      fr: {
        algorithm: 'Simulation N-body simplifiée avec intégration temporelle (Euler ou Verlet); gravitation newtonienne.',
        performance: 'Rendu optimisé via requestAnimationFrame; double mode Canvas 2D et WebGL/Three.js.',
        challenge: 'Maintenir la stabilité numérique sans bibliothèques physiques externes.',
      },
      en: {
        algorithm: 'Simplified N-body simulation with time-step integration; Newtonian gravity.',
        performance: 'Rendering optimized via requestAnimationFrame; dual Canvas 2D and WebGL/Three.js mode.',
        challenge: 'Maintaining numerical stability without external physics libraries.',
      },
    },
    features: [
      'Rendu WebGL/Three.js avec accélération GPU',
      'Mode multi-corps (3 à 5 corps configurables)',
      'Simulation physique réaliste avec chaos déterministe',
      'Sauvegarde/chargement de configurations et comparaison de simulations',
      'Export/import de configurations et trajectoires (JSON/CSV)',
      'Palettes de couleurs personnalisables et presets avancés',
      'Mode scientifique et éducatif avec explications détaillées'
    ],
  },
  {
    id: 'astro-data-viewer',
    title: 'Astro Data Viewer',
    subtitle: 'Exploration interactive de données astronomiques de la NASA avec images, exoplanètes en 3D, export et partage pour découvrir l\'univers de manière immersive.',
    description: 'Mini-app d\'exploration de données astronomiques : images NASA/JWST, exoplanètes avec visualisation 3D, export CSV/JSON, partage social et mode présentation. Interface moderne avec animations CSS avancées.',
    category: 'data-ia',
    technologies: ['TypeScript', 'Three.js', 'HTML5', 'CSS3', 'React', 'Next.js'],
    image: '/images/projects/astro-data-viewer.svg',
    demo: '/demo/astro-data-viewer',
    github: 'https://github.com/sebstars/astro-data-viewer',
    githubUrl: 'https://github.com/sebstarsio/sebstars_portfolio/blob/main/src/components/demos/AstroDataViewer.tsx',
    architectureNotes: {
      fr: {
        algorithm: 'Appels API NASA (APOD, Images, Exoplanets); visualisation 3D exoplanètes avec Three.js; traduction optionnelle.',
        performance: 'Pagination et lazy loading des images; mémoïsation des résultats de recherche.',
        challenge: 'Gérer quotas API et fallback quand les services NASA sont indisponibles.',
      },
      en: {
        algorithm: 'NASA API calls (APOD, Images, Exoplanets); Three.js exoplanet 3D visualization; optional translation.',
        performance: 'Image pagination and lazy loading; memoized search results.',
        challenge: 'Handling API quotas and fallback when NASA services are unavailable.',
      },
    },
    features: [
      'Images astronomiques NASA/JWST avec recherche avancée',
      'Catalogue d\'exoplanètes avec visualisation 3D (Three.js)',
      'Export de données (CSV, JSON)',
      'Partage social d\'images et mode présentation plein écran',
      'Recherche et filtres avancés',
      'Animations CSS avancées et micro-interactions fluides'
    ],
  },
  {
    id: 'fractal-generator',
    title: 'Générateur de Fractales',
    subtitle: 'Exploration interactive de motifs mathématiques complexes avec 6 types de fractales, rendu progressif et mode éducatif pour comprendre les mathématiques derrière ces structures fascinantes.',
    description: 'Générateur de fractales interactif avec 6 types (Mandelbrot, Julia, Burning Ship, Newton, Sierpinski, Koch). Rendu progressif, mode éducatif avec explications mathématiques, 8 palettes de couleurs, export avancé (PNG, JSON, CSV) et sauvegarde de configurations. Zoom jusqu\'à 200x avec contrôles Julia interactifs.',
    category: 'animation',
    technologies: ['TypeScript', 'Canvas API', 'HTML5', 'React', 'Next.js'],
    image: '/images/projects/fractal-generator.svg',
    demo: '/demo/fractal-generator',
    github: 'https://github.com/sebstars/fractal-generator',
    githubUrl: 'https://github.com/sebstarsio/sebstars_portfolio/blob/main/src/components/demos/FractalGenerator.tsx',
    architectureNotes: {
      fr: {
        algorithm: 'Calcul par pixel (Mandelbrot, Julia, etc.) avec nombre d\'itérations configurable; palettes par dégradé.',
        performance: 'Rendu progressif et double buffering; Web Worker possible pour ne pas bloquer le thread principal.',
        challenge: 'Précision numérique pour zoom élevé; équilibre qualité / temps de calcul.',
      },
      en: {
        algorithm: 'Per-pixel computation (Mandelbrot, Julia, etc.) with configurable iterations; gradient palettes.',
        performance: 'Progressive rendering and double buffering; Web Worker optional to avoid blocking main thread.',
        challenge: 'Numerical precision at high zoom; balancing quality vs. compute time.',
      },
    },
    features: [
      '6 types de fractales (Mandelbrot, Julia, Burning Ship, Newton, Sierpinski, Koch)',
      'Rendu progressif avec barre de progression et double buffering',
      'Mode éducatif avec explications mathématiques détaillées',
      '8 palettes de couleurs (Rainbow, Fire, Ocean, Neon, Aurora, Sunset, Matrix, Grayscale)',
      'Zoom jusqu\'à 200x avec contrôles Julia interactifs',
      'Export PNG haute résolution et export avancé (JSON, CSV)',
      'Sauvegarde/chargement de configurations et statistiques de rendu'
    ],
  },
];

export function getProjectById(id: string): Project | undefined {
  return projects.find(project => project.id === id);
}

export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectsByCategory(category: Project['category']): Project[] {
  return projects.filter(project => project.category === category);
}
