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
