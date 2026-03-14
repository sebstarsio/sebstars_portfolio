/**
 * DONNÉES ASTRONOMIQUES RÉALISTES - SYSTÈME SOLAIRE
 * 
 * Données basées sur les valeurs réelles de la NASA et de l'IAU
 */

export interface Moon {
  name: string;
  distance: number; // Distance du centre de la planète en km
  period: number; // Période orbitale en jours
  radius: number; // Rayon en km
}

export interface PlanetData {
  name: string;
  nameLatin: string;
  distance: number; // Distance moyenne du Soleil en UA (Unité Astronomique)
  period: number; // Période orbitale en jours terrestres
  speed: number; // Vitesse orbitale moyenne en km/s
  mass: number; // Masse en kg
  radius: number; // Rayon équatorial en km
  rotation: number; // Période de rotation en jours (négatif = rétrograde)
  inclination: number; // Inclinaison orbitale en degrés
  eccentricity: number; // Excentricité orbitale (0 = cercle, 1 = parabole)
  temperature: number; // Température moyenne en Kelvin
  color: string; // Couleur hexadécimale
  description: string;
  moons: Moon[];
  type: 'star' | 'terrestrial' | 'gas-giant' | 'ice-giant';
}

// Constantes astronomiques
export const AU = 149597870.7; // 1 UA en km
export const DAYS_PER_YEAR = 365.25;

// Données des planètes (valeurs réelles)
export const PLANETS_DATA: PlanetData[] = [
  {
    name: 'Soleil',
    nameLatin: 'Sol',
    distance: 0,
    period: 0,
    speed: 0,
    mass: 1.989e30,
    radius: 696340,
    rotation: 25.38, // Rotation différentielle
    inclination: 0,
    eccentricity: 0,
    temperature: 5778,
    color: '#ffd700',
    type: 'star',
    description: 'Notre étoile, une naine jaune de type G2V. Elle représente 99,86% de la masse totale du système solaire.',
    moons: [],
  },
  {
    name: 'Mercure',
    nameLatin: 'Mercurius',
    distance: 0.387,
    period: 87.97,
    speed: 47.87,
    mass: 3.285e23,
    radius: 2439.7,
    rotation: 58.65,
    inclination: 7.0,
    eccentricity: 0.206,
    temperature: 440,
    color: '#8c7853',
    type: 'terrestrial',
    description: 'La planète la plus proche du Soleil et la plus petite du système solaire. Sa surface est criblée de cratères.',
    moons: [],
  },
  {
    name: 'Vénus',
    nameLatin: 'Venus',
    distance: 0.723,
    period: 224.70,
    speed: 35.02,
    mass: 4.867e24,
    radius: 6051.8,
    rotation: -243.02, // Rétrograde
    inclination: 3.39,
    eccentricity: 0.007,
    temperature: 737,
    color: '#e6be8a',
    type: 'terrestrial',
    description: 'La planète la plus chaude du système solaire avec une atmosphère dense de dioxyde de carbone. Rotation rétrograde unique.',
    moons: [],
  },
  {
    name: 'Terre',
    nameLatin: 'Terra',
    distance: 1.0,
    period: 365.26,
    speed: 29.78,
    mass: 5.972e24,
    radius: 6371.0,
    rotation: 0.997,
    inclination: 0.0,
    eccentricity: 0.017,
    temperature: 288,
    color: '#4b6cb7',
    type: 'terrestrial',
    description: 'La seule planète connue à abriter la vie. Possède une atmosphère riche en azote et oxygène, et de l\'eau liquide.',
    moons: [
      { name: 'Lune', distance: 384400, period: 27.32, radius: 1737.4 },
    ],
  },
  {
    name: 'Mars',
    nameLatin: 'Mars',
    distance: 1.524,
    period: 686.98,
    speed: 24.07,
    mass: 6.39e23,
    radius: 3389.5,
    rotation: 1.026,
    inclination: 1.85,
    eccentricity: 0.094,
    temperature: 210,
    color: '#c1440e',
    type: 'terrestrial',
    description: 'La planète rouge, nommée ainsi à cause de l\'oxyde de fer à sa surface. Possède les plus grands volcans du système solaire.',
    moons: [
      { name: 'Phobos', distance: 9377, period: 0.319, radius: 11.1 },
      { name: 'Deimos', distance: 23460, period: 1.263, radius: 6.2 },
    ],
  },
  {
    name: 'Jupiter',
    nameLatin: 'Iuppiter',
    distance: 5.203,
    period: 4332.59,
    speed: 13.07,
    mass: 1.898e27,
    radius: 69911,
    rotation: 0.41,
    inclination: 1.31,
    eccentricity: 0.049,
    temperature: 165,
    color: '#d8ca9d',
    type: 'gas-giant',
    description: 'La plus grande planète du système solaire, une géante gazeuse avec une Grande Tache Rouge persistante. Protège les planètes intérieures des astéroïdes.',
    moons: [
      { name: 'Io', distance: 421700, period: 1.77, radius: 1821.6 },
      { name: 'Europe', distance: 671034, period: 3.55, radius: 1560.8 },
      { name: 'Ganymède', distance: 1070412, period: 7.15, radius: 2634.1 },
      { name: 'Callisto', distance: 1882709, period: 16.69, radius: 2410.3 },
    ],
  },
  {
    name: 'Saturne',
    nameLatin: 'Saturnus',
    distance: 9.537,
    period: 10759.22,
    speed: 9.68,
    mass: 5.683e26,
    radius: 58232,
    rotation: 0.45,
    inclination: 2.49,
    eccentricity: 0.057,
    temperature: 134,
    color: '#f4d03f',
    type: 'gas-giant',
    description: 'Connue pour ses magnifiques anneaux composés de glace et de roche. Possède 82 lunes confirmées, dont Titan, plus grande que Mercure.',
    moons: [
      { name: 'Titan', distance: 1221870, period: 15.95, radius: 2574.7 },
      { name: 'Encelade', distance: 238020, period: 1.37, radius: 252.1 },
      { name: 'Mimas', distance: 185539, period: 0.94, radius: 198.2 },
      { name: 'Rhéa', distance: 527108, period: 4.52, radius: 763.8 },
    ],
  },
  {
    name: 'Uranus',
    nameLatin: 'Uranus',
    distance: 19.191,
    period: 30688.5,
    speed: 6.80,
    mass: 8.681e25,
    radius: 25362,
    rotation: -0.72, // Rétrograde
    inclination: 0.77,
    eccentricity: 0.046,
    temperature: 76,
    color: '#85c1e9',
    type: 'ice-giant',
    description: 'Une géante de glace avec une rotation axiale unique (inclinée à 98°). Son atmosphère contient du méthane qui lui donne sa couleur bleu-vert.',
    moons: [
      { name: 'Titania', distance: 435910, period: 8.71, radius: 788.9 },
      { name: 'Obéron', distance: 583520, period: 13.46, radius: 761.4 },
      { name: 'Ariel', distance: 191020, period: 2.52, radius: 578.9 },
      { name: 'Umbriel', distance: 266000, period: 4.14, radius: 584.7 },
    ],
  },
  {
    name: 'Neptune',
    nameLatin: 'Neptunus',
    distance: 30.069,
    period: 60182,
    speed: 5.43,
    mass: 1.024e26,
    radius: 24622,
    rotation: 0.67,
    inclination: 1.77,
    eccentricity: 0.009,
    temperature: 72,
    color: '#5dade2',
    type: 'ice-giant',
    description: 'La planète la plus éloignée du Soleil. Connue pour ses vents violents (jusqu\'à 2100 km/h) et sa Grande Tache Sombre.',
    moons: [
      { name: 'Triton', distance: 354759, period: -5.88, radius: 1353.4 }, // Rétrograde
      { name: 'Protée', distance: 117647, period: 1.12, radius: 210.0 },
      { name: 'Néréide', distance: 5513818, period: 360.14, radius: 170.0 },
    ],
  },
];

// Fonction pour calculer la position d'une planète à un moment donné
export function calculatePlanetPosition(
  planet: PlanetData,
  time: number, // Temps en jours depuis une date de référence
  scale: number = 1 // Échelle pour l'affichage
): { x: number; y: number; angle: number } {
  if (planet.distance === 0) {
    return { x: 0, y: 0, angle: 0 };
  }

  // Calcul de l'anomalie moyenne (M)
  const n = (2 * Math.PI) / planet.period; // Mouvement moyen
  const M = n * time;

  // Approximation de l'anomalie excentrique (E) avec la méthode de Newton
  let E = M;
  for (let i = 0; i < 10; i++) {
    const f = E - planet.eccentricity * Math.sin(E) - M;
    const fPrime = 1 - planet.eccentricity * Math.cos(E);
    if (Math.abs(fPrime) < 1e-10) break;
    E = E - f / fPrime;
  }

  // Calcul de l'anomalie vraie (ν)
  const nu = 2 * Math.atan2(
    Math.sqrt(1 + planet.eccentricity) * Math.sin(E / 2),
    Math.sqrt(1 - planet.eccentricity) * Math.cos(E / 2)
  );

  // Distance radiale
  const r = planet.distance * (1 - planet.eccentricity * Math.cos(E));

  // Position en coordonnées polaires puis cartésiennes
  const angle = nu;
  const x = r * Math.cos(angle) * scale;
  const y = r * Math.sin(angle) * scale;

  return { x, y, angle };
}

// Fonction pour formater les grandes distances
export function formatDistance(au: number): string {
  if (au < 0.1) return `${(au * 1000).toFixed(0)} millions de km`;
  if (au < 1) return `${(au * 100).toFixed(1)} millions de km`;
  return `${au.toFixed(2)} UA`;
}

// Fonction pour formater les périodes
export function formatPeriod(days: number): string {
  if (days < 1) return `${(days * 24).toFixed(1)} heures`;
  if (days < 365) return `${days.toFixed(1)} jours`;
  const years = days / DAYS_PER_YEAR;
  if (years < 1) return `${days.toFixed(0)} jours`;
  return `${years.toFixed(2)} ans`;
}
