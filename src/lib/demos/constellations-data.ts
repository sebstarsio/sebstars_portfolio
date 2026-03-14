/**
 * DONNÉES CONSTELLATIONS
 */

export interface EquatorialCoordinates {
  ra: number;
  dec: number;
}

export interface Star {
  id: string;
  name: string;
  magnitude: number;
  distance: number;
  mass: number;
  equatorial: EquatorialCoordinates;
  color?: string;
}

export interface Constellation {
  id: string;
  name: string;
  nameLatin: string;
  stars: Star[];
  lines: number[][];
  mythology: string;
  description: string;
}

export const CONSTELLATIONS: Constellation[] = [
  {
    id: 'orion',
    name: 'Orion',
    nameLatin: 'Orion',
    mythology: 'Orion était un chasseur géant dans la mythologie grecque. Il fut tué par un scorpion et placé dans le ciel par Zeus. Il est représenté avec une épée et un bouclier.',
    description: 'Constellation visible dans l\'hémisphère nord en hiver. Contient plusieurs étoiles brillantes dont Bételgeuse et Rigel.',
    stars: [
      { id: 'betelgeuse', name: 'Bételgeuse', magnitude: 0.5, distance: 640, mass: 11.6, equatorial: { ra: 5.9195, dec: 7.407 }, color: '#ff6b47' },
      { id: 'rigel', name: 'Rigel', magnitude: 0.18, distance: 860, mass: 21, equatorial: { ra: 5.2423, dec: -8.202 }, color: '#b3d9ff' },
      { id: 'bellatrix', name: 'Bellatrix', magnitude: 1.64, distance: 250, mass: 8.6, equatorial: { ra: 5.4189, dec: 6.350 }, color: '#ffffff' },
      { id: 'mintaka', name: 'Mintaka', magnitude: 2.25, distance: 1200, mass: 24, equatorial: { ra: 5.5334, dec: -0.299 }, color: '#ffffff' },
      { id: 'alnilam', name: 'Alnilam', magnitude: 1.69, distance: 2000, mass: 40, equatorial: { ra: 5.6036, dec: -1.202 }, color: '#b3d9ff' },
      { id: 'alnitak', name: 'Alnitak', magnitude: 1.77, distance: 820, mass: 33, equatorial: { ra: 5.6793, dec: -1.943 }, color: '#ffffff' },
      { id: 'saiph', name: 'Saiph', magnitude: 2.07, distance: 650, mass: 15.5, equatorial: { ra: 5.7960, dec: -9.669 }, color: '#ffffff' },
    ],
    lines: [
      [0, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1], [1, 0],
      [3, 5],
    ],
  },
  {
    id: 'ursa-major',
    name: 'Grande Ourse',
    nameLatin: 'Ursa Major',
    mythology: 'Callisto, une nymphe aimée de Zeus, fut transformée en ourse par Héra. Zeus la plaça dans le ciel avec son fils Arcas (Petite Ourse).',
    description: 'Constellation circumpolaire de l\'hémisphère nord. Contient le célèbre astérisme de la Grande Casserole.',
    stars: [
      { id: 'dubhe', name: 'Dubhe', magnitude: 1.81, distance: 124, mass: 4.3, equatorial: { ra: 11.0622, dec: 61.751 }, color: '#ffeb99' },
      { id: 'merak', name: 'Merak', magnitude: 2.37, distance: 79, mass: 2.7, equatorial: { ra: 11.0307, dec: 56.382 }, color: '#ffffff' },
      { id: 'phecda', name: 'Phécda', magnitude: 2.41, distance: 84, mass: 2.6, equatorial: { ra: 11.8972, dec: 53.695 }, color: '#ffffff' },
      { id: 'megrez', name: 'Megrez', magnitude: 3.32, distance: 81, mass: 1.6, equatorial: { ra: 12.2571, dec: 57.032 }, color: '#ffffff' },
      { id: 'alioth', name: 'Alioth', magnitude: 1.76, distance: 81, mass: 2.9, equatorial: { ra: 12.9005, dec: 55.960 }, color: '#ffffff' },
      { id: 'mizar', name: 'Mizar', magnitude: 2.23, distance: 78, mass: 2.4, equatorial: { ra: 13.3988, dec: 54.925 }, color: '#ffffff' },
      { id: 'alkaid', name: 'Alkaid', magnitude: 1.85, distance: 101, mass: 6.1, equatorial: { ra: 13.7923, dec: 49.313 }, color: '#ffffff' },
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
      [0, 3],
    ],
  },
  {
    id: 'cassiopeia',
    name: 'Cassiopée',
    nameLatin: 'Cassiopeia',
    mythology: 'Reine d\'Éthiopie, mère d\'Andromède. Elle se vantait d\'être plus belle que les Néréides, ce qui causa la colère de Poséidon.',
    description: 'Constellation en forme de W visible dans l\'hémisphère nord. Circumpolaire et facilement reconnaissable.',
    /* W astérisme : 5 étoiles en ordre ouest→est (RA croissante). Tracé continu : sommet gauche → creux → sommet centre → creux → sommet droit. */
    stars: [
      { id: 'caph', name: 'Caph', magnitude: 2.28, distance: 54, mass: 1.9, equatorial: { ra: 0.1528, dec: 59.1502 }, color: '#ffffff' },
      { id: 'schedar', name: 'Schedar', magnitude: 2.24, distance: 228, mass: 4.5, equatorial: { ra: 0.6751, dec: 56.5374 }, color: '#ffeb99' },
      { id: 'gamma-cas', name: 'γ Cassiopeiae', magnitude: 2.47, distance: 613, mass: 15, equatorial: { ra: 0.9451, dec: 60.7168 }, color: '#ffffff' },
      { id: 'rukh', name: 'Ruchbah', magnitude: 2.68, distance: 99, mass: 2.2, equatorial: { ra: 1.4302, dec: 60.2354 }, color: '#ffffff' },
      { id: 'segin', name: 'Segin', magnitude: 3.35, distance: 442, mass: 3.4, equatorial: { ra: 1.9066, dec: 63.6701 }, color: '#ffffff' },
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4],
    ],
  },
  {
    id: 'cygnus',
    name: 'Cygnus',
    nameLatin: 'Cygnus',
    mythology: 'Représente le cygne dans lequel Zeus se transforma pour séduire Léda, reine de Sparte. Parfois associé à Orphée transformé en cygne après sa mort.',
    description: 'Constellation de l\'hémisphère nord en forme de croix. Contient Deneb, l\'une des étoiles les plus brillantes du ciel.',
    stars: [
      { id: 'deneb', name: 'Deneb', magnitude: 1.25, distance: 2600, mass: 19, equatorial: { ra: 20.6905, dec: 45.280 }, color: '#ffffff' },
      { id: 'sadr', name: 'Sadr', magnitude: 2.23, distance: 1800, mass: 12, equatorial: { ra: 20.3704, dec: 40.257 }, color: '#ffffff' },
      { id: 'albireo', name: 'Albireo', magnitude: 3.18, distance: 430, mass: 1.1, equatorial: { ra: 19.5120, dec: 27.960 }, color: '#ffeb99' },
      { id: 'epsilon-cyg', name: 'Gienah', magnitude: 2.48, distance: 72, mass: 2.0, equatorial: { ra: 20.7701, dec: 33.969 }, color: '#ffffff' },
    ],
    lines: [
      [0, 1], [1, 2], [1, 3],
    ],
  },
  {
    id: 'scorpius',
    name: 'Scorpion',
    nameLatin: 'Scorpius',
    mythology: 'Le scorpion qui tua Orion. Zeus plaça les deux dans le ciel, mais de manière à ce qu\'ils ne se rencontrent jamais (l\'un se lève quand l\'autre se couche).',
    description: 'Constellation du zodiaque visible dans l\'hémisphère sud. Contient Antares, une supergéante rouge.',
    stars: [
      { id: 'antares', name: 'Antares', magnitude: 1.06, distance: 550, mass: 12.4, equatorial: { ra: 16.4901, dec: -26.432 }, color: '#ff6b47' },
      { id: 'shaula', name: 'Shaula', magnitude: 1.62, distance: 570, mass: 10.4, equatorial: { ra: 17.5602, dec: -37.104 }, color: '#ffffff' },
      { id: 'sargas', name: 'Sargas', magnitude: 1.87, distance: 272, mass: 5.7, equatorial: { ra: 17.6220, dec: -42.998 }, color: '#ffffff' },
      { id: 'dschubba', name: 'Dschubba', magnitude: 2.29, distance: 402, mass: 5.2, equatorial: { ra: 16.00, dec: -22.62 }, color: '#ffffff' },
      { id: 'acrab', name: 'Acrab', magnitude: 2.56, distance: 404, mass: 4.9, equatorial: { ra: 16.09, dec: -19.80 }, color: '#ffffff' },
    ],
    lines: [
      [0, 3], [3, 4], [0, 1], [1, 2],
    ],
  },
  {
    id: 'ursa-minor',
    name: 'Petite Ourse',
    nameLatin: 'Ursa Minor',
    mythology: 'Arcas, le fils de Callisto, transformé en petit ours par Zeus pour protéger sa mère. Contient l\'étoile polaire Polaris, qui indique le nord.',
    description: 'Constellation circumpolaire de l\'hémisphère nord. Contient Polaris, l\'étoile polaire, utilisée pour la navigation.',
    stars: [
      { id: 'polaris', name: 'Polaris', magnitude: 1.98, distance: 433, mass: 4.5, equatorial: { ra: 2.53, dec: 89.26 }, color: '#ffeb99' },
      { id: 'kochab', name: 'Kochab', magnitude: 2.08, distance: 131, mass: 2.2, equatorial: { ra: 14.85, dec: 74.16 }, color: '#ffeb99' },
      { id: 'pherkad', name: 'Pherkad', magnitude: 3.05, distance: 487, mass: 4.3, equatorial: { ra: 15.35, dec: 71.83 }, color: '#ffffff' },
      { id: 'yildun', name: 'Yildun', magnitude: 4.36, distance: 172, mass: 1.8, equatorial: { ra: 17.54, dec: 86.59 }, color: '#ffffff' },
    ],
    lines: [
      [0, 1], // Polaris - Kochab
      [1, 2], // Kochab - Pherkad
      [0, 3], // Polaris - Yildun
    ],
  },
  {
    id: 'lyra',
    name: 'Lyre',
    nameLatin: 'Lyra',
    mythology: 'La lyre d\'Orphée, le musicien légendaire qui charmait les dieux et les bêtes sauvages. Après sa mort, Zeus plaça sa lyre dans le ciel.',
    description: 'Petite constellation de l\'hémisphère nord. Contient Vega, l\'une des étoiles les plus brillantes du ciel et sommet du Triangle d\'été.',
    stars: [
      { id: 'vega', name: 'Vega', magnitude: 0.03, distance: 25, mass: 2.1, equatorial: { ra: 18.62, dec: 38.78 }, color: '#b3d9ff' },
      { id: 'sulafat', name: 'Sulafat', magnitude: 3.25, distance: 620, mass: 2.3, equatorial: { ra: 18.98, dec: 32.69 }, color: '#ffffff' },
      { id: 'sheliak', name: 'Sheliak', magnitude: 3.52, distance: 960, mass: 2.5, equatorial: { ra: 18.84, dec: 33.36 }, color: '#ffffff' },
    ],
    lines: [
      [0, 1], // Vega - Sulafat
      [0, 2], // Vega - Sheliak
      [1, 2], // Sulafat - Sheliak
    ],
  },
  {
    id: 'aquila',
    name: 'Aigle',
    nameLatin: 'Aquila',
    mythology: 'L\'aigle de Zeus qui portait les foudres du dieu et enleva Ganymède pour servir d\'échanson aux dieux de l\'Olympe.',
    description: 'Constellation de l\'hémisphère nord. Contient Altair, sommet du Triangle d\'été avec Vega et Deneb.',
    stars: [
      { id: 'altair', name: 'Altair', magnitude: 0.77, distance: 17, mass: 1.8, equatorial: { ra: 19.85, dec: 8.87 }, color: '#ffffff' },
      { id: 'tarazed', name: 'Tarazed', magnitude: 2.72, distance: 395, mass: 2.6, equatorial: { ra: 19.77, dec: 10.61 }, color: '#ffeb99' },
      { id: 'alshain', name: 'Alshain', magnitude: 3.71, distance: 45, mass: 1.3, equatorial: { ra: 19.92, dec: 6.41 }, color: '#ffffff' },
    ],
    lines: [
      [0, 1], // Altair - Tarazed
      [0, 2], // Altair - Alshain
    ],
  },
  {
    id: 'pegasus',
    name: 'Pégase',
    nameLatin: 'Pegasus',
    mythology: 'Le cheval ailé né du sang de Méduse lorsque Persée la décapita. Pégase permit à Bellérophon de vaincre la Chimère.',
    description: 'Grande constellation de l\'hémisphère nord. Forme un grand carré visible en automne. Contient plusieurs étoiles brillantes.',
    stars: [
      { id: 'enif', name: 'Enif', magnitude: 2.38, distance: 672, mass: 10.0, equatorial: { ra: 21.74, dec: 9.88 }, color: '#ff6b47' },
      { id: 'markab', name: 'Markab', magnitude: 2.49, distance: 140, mass: 3.4, equatorial: { ra: 23.08, dec: 15.21 }, color: '#ffffff' },
      { id: 'scheat', name: 'Schéat', magnitude: 2.44, distance: 196, mass: 2.1, equatorial: { ra: 23.03, dec: 28.08 }, color: '#ff6b47' },
      { id: 'algenib', name: 'Algénib', magnitude: 2.83, distance: 333, mass: 7.0, equatorial: { ra: 0.22, dec: 15.18 }, color: '#ffffff' },
    ],
    lines: [
      [1, 2], // Markab - Schéat
      [2, 3], // Schéat - Algénib
      [3, 1], // Algénib - Markab (carré)
      [0, 1], // Enif - Markab
    ],
  },
  {
    id: 'andromeda',
    name: 'Andromède',
    nameLatin: 'Andromeda',
    mythology: 'Fille de Cassiopée et Céphée, enchaînée à un rocher pour être sacrifiée au monstre marin. Sauvée par Persée qui l\'épousa ensuite.',
    description: 'Constellation de l\'hémisphère nord. Contient la galaxie d\'Andromède, la galaxie la plus proche de la Voie Lactée visible à l\'œil nu.',
    stars: [
      { id: 'alpheratz', name: 'Alphératz', magnitude: 2.07, distance: 97, mass: 3.8, equatorial: { ra: 0.14, dec: 29.09 }, color: '#ffffff' },
      { id: 'mirach', name: 'Mirach', magnitude: 2.05, distance: 200, mass: 3.5, equatorial: { ra: 1.10, dec: 35.62 }, color: '#ff6b47' },
      { id: 'almach', name: 'Almach', magnitude: 2.10, distance: 350, mass: 3.2, equatorial: { ra: 2.06, dec: 42.33 }, color: '#ffeb99' },
    ],
    lines: [
      [0, 1], // Alphératz - Mirach
      [1, 2], // Mirach - Almach
    ],
  },
  {
    id: 'perseus',
    name: 'Persée',
    nameLatin: 'Perseus',
    mythology: 'Héros grec qui décapita Méduse et sauva Andromède. Il utilisa la tête de Méduse pour pétrifier ses ennemis.',
    description: 'Constellation de l\'hémisphère nord. Visible en automne et hiver. Contient plusieurs amas d\'étoiles et la célèbre étoile variable Algol.',
    stars: [
      { id: 'mirfak', name: 'Mirfak', magnitude: 1.79, distance: 592, mass: 5.5, equatorial: { ra: 3.24, dec: 49.86 }, color: '#ffffff' },
      { id: 'algol', name: 'Algol', magnitude: 2.12, distance: 93, mass: 3.2, equatorial: { ra: 3.14, dec: 40.96 }, color: '#ffffff' },
      { id: 'atik', name: 'Atik', magnitude: 2.87, distance: 750, mass: 5.8, equatorial: { ra: 3.44, dec: 31.88 }, color: '#ffffff' },
    ],
    lines: [
      [0, 1], // Mirfak - Algol
      [1, 2], // Algol - Atik
      [0, 2], // Mirfak - Atik
    ],
  },
  {
    id: 'bootes',
    name: 'Bouvier',
    nameLatin: 'Bootes',
    mythology: 'Représente un gardien de bétail ou un laboureur. Parfois identifié à Arcas, fils de Callisto, ou à Icarios, qui enseigna la viticulture.',
    description: 'Constellation de l\'hémisphère nord. Contient Arcturus, l\'une des étoiles les plus brillantes du ciel et la plus brillante de l\'hémisphère nord.',
    stars: [
      { id: 'arcturus', name: 'Arcturus', magnitude: -0.05, distance: 37, mass: 1.1, equatorial: { ra: 14.26, dec: 19.18 }, color: '#ff6b47' },
      { id: 'izar', name: 'Izar', magnitude: 2.35, distance: 202, mass: 2.2, equatorial: { ra: 14.75, dec: 27.07 }, color: '#ffeb99' },
      { id: 'muphrid', name: 'Muphrid', magnitude: 2.68, distance: 37, mass: 1.4, equatorial: { ra: 13.91, dec: 18.40 }, color: '#ffffff' },
    ],
    lines: [
      [0, 1], // Arcturus - Izar
      [0, 2], // Arcturus - Muphrid
      [1, 2], // Izar - Muphrid
    ],
  },
  {
    id: 'leo',
    name: 'Lion',
    nameLatin: 'Leo',
    mythology: 'Le lion de Némée, tué par Hercule lors de ses douze travaux. Sa peau était si dure qu\'Hercule dut l\'étouffer, puis l\'utilisa comme armure.',
    description: 'Constellation du zodiaque visible au printemps. Contient Régulus, l\'une des étoiles les plus brillantes du ciel.',
    stars: [
      { id: 'regulus', name: 'Régulus', magnitude: 1.36, distance: 79, mass: 3.5, equatorial: { ra: 10.14, dec: 11.97 }, color: '#b3d9ff' },
      { id: 'denebola', name: 'Denebola', magnitude: 2.14, distance: 36, mass: 1.8, equatorial: { ra: 11.82, dec: 14.57 }, color: '#ffffff' },
      { id: 'algieba', name: 'Algieba', magnitude: 2.01, distance: 126, mass: 1.2, equatorial: { ra: 10.20, dec: 19.84 }, color: '#ffeb99' },
    ],
    lines: [
      [0, 1], // Régulus - Denebola
      [0, 2], // Régulus - Algieba
      [1, 2], // Denebola - Algieba
    ],
  },
  {
    id: 'taurus',
    name: 'Taureau',
    nameLatin: 'Taurus',
    mythology: 'Le taureau blanc dans lequel Zeus se transforma pour enlever Europe, princesse phénicienne. Il la porta jusqu\'en Crète où elle devint reine.',
    description: 'Constellation du zodiaque visible en hiver. Contient Aldébaran et les Pléiades, un célèbre amas d\'étoiles.',
    stars: [
      { id: 'aldebaran', name: 'Aldébaran', magnitude: 0.87, distance: 65, mass: 1.2, equatorial: { ra: 4.60, dec: 16.51 }, color: '#ff6b47' },
      { id: 'elnath', name: 'Elnath', magnitude: 1.65, distance: 134, mass: 4.5, equatorial: { ra: 5.44, dec: 28.61 }, color: '#ffffff' },
      { id: 'alcyone', name: 'Alcyone', magnitude: 2.87, distance: 440, mass: 6.0, equatorial: { ra: 3.47, dec: 24.11 }, color: '#b3d9ff' },
    ],
    lines: [
      [0, 1], // Aldébaran - Elnath
      [0, 2], // Aldébaran - Alcyone
    ],
  },
  {
    id: 'gemini',
    name: 'Gémeaux',
    nameLatin: 'Gemini',
    mythology: 'Castor et Pollux, les jumeaux divins. Castor était mortel, Pollux immortel. Après la mort de Castor, Pollux partagea son immortalité avec lui.',
    description: 'Constellation du zodiaque visible en hiver. Contient Castor et Pollux, deux étoiles brillantes représentant les jumeaux.',
    stars: [
      { id: 'pollux', name: 'Pollux', magnitude: 1.14, distance: 34, mass: 1.9, equatorial: { ra: 7.76, dec: 28.03 }, color: '#ffeb99' },
      { id: 'castor', name: 'Castor', magnitude: 1.58, distance: 51, mass: 2.8, equatorial: { ra: 7.58, dec: 31.89 }, color: '#ffffff' },
      { id: 'alhena', name: 'Alhena', magnitude: 1.93, distance: 105, mass: 2.8, equatorial: { ra: 6.63, dec: 16.40 }, color: '#ffffff' },
    ],
    lines: [
      [0, 1], // Pollux - Castor
      [1, 2], // Castor - Alhena
      [0, 2], // Pollux - Alhena
    ],
  },
  {
    id: 'draco',
    name: 'Dragon',
    nameLatin: 'Draco',
    mythology: 'Le dragon Ladon qui gardait les pommes d\'or du jardin des Hespérides. Tué par Hercule lors de ses douze travaux.',
    description: 'Constellation circumpolaire de l\'hémisphère nord. Grande constellation en forme de serpent qui entoure la Petite Ourse.',
    stars: [
      { id: 'etamin', name: 'Etamin', magnitude: 2.24, distance: 154, mass: 2.8, equatorial: { ra: 17.66, dec: 51.49 }, color: '#ff6b47' },
      { id: 'rastaban', name: 'Rastaban', magnitude: 2.79, distance: 380, mass: 2.8, equatorial: { ra: 17.51, dec: 52.30 }, color: '#ffeb99' },
      { id: 'elrakis', name: 'Elrakis', magnitude: 3.82, distance: 100, mass: 1.5, equatorial: { ra: 19.21, dec: 67.66 }, color: '#ffffff' },
    ],
    lines: [
      [0, 1], // Etamin - Rastaban
      [1, 2], // Rastaban - Elrakis
    ],
  },
  {
    id: 'canis-major',
    name: 'Grand Chien',
    nameLatin: 'Canis Major',
    mythology: 'Le chien fidèle d\'Orion, qui l\'accompagne dans sa chasse éternelle. Représente parfois Laelaps, le chien qui ne ratait jamais sa proie.',
    description: 'Constellation de l\'hémisphère sud. Contient Sirius, l\'étoile la plus brillante du ciel nocturne.',
    stars: [
      { id: 'sirius', name: 'Sirius', magnitude: -1.46, distance: 8.6, mass: 2.0, equatorial: { ra: 6.75, dec: -16.72 }, color: '#ffffff' },
      { id: 'adhara', name: 'Adhara', magnitude: 1.50, distance: 430, mass: 12.5, equatorial: { ra: 6.94, dec: -28.97 }, color: '#b3d9ff' },
      { id: 'wezen', name: 'Wezen', magnitude: 1.83, distance: 1600, mass: 17, equatorial: { ra: 7.14, dec: -26.39 }, color: '#ffeb99' },
      { id: 'mirzam', name: 'Mirzam', magnitude: 1.98, distance: 500, mass: 13.5, equatorial: { ra: 6.38, dec: -17.96 }, color: '#ffffff' },
    ],
    lines: [
      [0, 3], // Sirius - Mirzam
      [0, 1], // Sirius - Adhara
      [1, 2], // Adhara - Wezen
    ],
  },
  {
    id: 'canis-minor',
    name: 'Petit Chien',
    nameLatin: 'Canis Minor',
    mythology: 'Le second chien d\'Orion, plus petit que son compagnon. Représente parfois Maera, le chien d\'Icarios.',
    description: 'Petite constellation de l\'hémisphère nord. Contient Procyon, l\'une des étoiles les plus brillantes du ciel.',
    stars: [
      { id: 'procyon', name: 'Procyon', magnitude: 0.34, distance: 11.4, mass: 1.5, equatorial: { ra: 7.66, dec: 5.22 }, color: '#ffffff' },
      { id: 'gomeisa', name: 'Gomeisa', magnitude: 2.89, distance: 170, mass: 3.5, equatorial: { ra: 7.45, dec: 8.29 }, color: '#b3d9ff' },
    ],
    lines: [
      [0, 1], // Procyon - Gomeisa
    ],
  },
  {
    id: 'cepheus',
    name: 'Céphée',
    nameLatin: 'Cepheus',
    mythology: 'Roi d\'Éthiopie, époux de Cassiopée et père d\'Andromède. Il fut placé dans le ciel avec sa famille après les événements du mythe d\'Andromède.',
    description: 'Constellation circumpolaire de l\'hémisphère nord. Forme un pentagone irrégulier visible toute l\'année.',
    stars: [
      { id: 'alphard-ceph', name: 'Alderamin', magnitude: 2.45, distance: 49, mass: 1.9, equatorial: { ra: 21.18, dec: 62.59 }, color: '#ffffff' },
      { id: 'alfirk', name: 'Alfirk', magnitude: 3.23, distance: 690, mass: 5.4, equatorial: { ra: 21.48, dec: 70.56 }, color: '#b3d9ff' },
      { id: 'errai', name: 'Errai', magnitude: 3.21, distance: 45, mass: 1.4, equatorial: { ra: 23.39, dec: 77.63 }, color: '#ffffff' },
    ],
    lines: [
      [0, 1], // Alderamin - Alfirk
      [1, 2], // Alfirk - Errai
      [2, 0], // Errai - Alderamin
    ],
  },
  {
    id: 'hercules',
    name: 'Hercule',
    nameLatin: 'Hercules',
    mythology: 'Hercule, le héros grec célèbre pour ses douze travaux. Il fut placé dans le ciel après sa mort et son apothéose.',
    description: 'Grande constellation de l\'hémisphère nord. Visible en été. Forme un trapèze caractéristique.',
    stars: [
      { id: 'rasalgethi', name: 'Rasalgethi', magnitude: 2.78, distance: 360, mass: 2.8, equatorial: { ra: 17.25, dec: 14.39 }, color: '#ff6b47' },
      { id: 'kornephoros', name: 'Kornephoros', magnitude: 2.78, distance: 139, mass: 2.9, equatorial: { ra: 16.51, dec: 21.49 }, color: '#ffeb99' },
      { id: 'zeta-her', name: 'ζ Herculis', magnitude: 2.81, distance: 35, mass: 1.5, equatorial: { ra: 16.41, dec: 31.60 }, color: '#ffffff' },
      { id: 'pi-her', name: 'π Herculis', magnitude: 3.16, distance: 377, mass: 2.5, equatorial: { ra: 17.15, dec: 36.81 }, color: '#ffffff' },
    ],
    lines: [
      [0, 1], // Rasalgethi - Kornephoros
      [1, 2], // Kornephoros - ζ Her
      [2, 3], // ζ Her - π Her
      [3, 0], // π Her - Rasalgethi
    ],
  },
  {
    id: 'sagittarius',
    name: 'Sagittaire',
    nameLatin: 'Sagittarius',
    mythology: 'Le centaure archer, souvent identifié à Chiron, le plus sage des centaures. Il pointe sa flèche vers le cœur du Scorpion.',
    description: 'Constellation du zodiaque visible dans l\'hémisphère sud. Contient le centre de la Voie Lactée et de nombreuses nébuleuses.',
    stars: [
      { id: 'kaus-australis', name: 'Kaus Australis', magnitude: 1.85, distance: 143, mass: 3.5, equatorial: { ra: 18.40, dec: -34.38 }, color: '#ffeb99' },
      { id: 'nunki', name: 'Nunki', magnitude: 2.05, distance: 228, mass: 4.5, equatorial: { ra: 18.96, dec: -26.30 }, color: '#b3d9ff' },
      { id: 'kaus-media', name: 'Kaus Media', magnitude: 2.72, distance: 348, mass: 3.0, equatorial: { ra: 18.17, dec: -29.83 }, color: '#ffffff' },
      { id: 'kaus-borealis', name: 'Kaus Borealis', magnitude: 2.82, distance: 78, mass: 1.8, equatorial: { ra: 18.35, dec: -25.42 }, color: '#ffffff' },
    ],
    lines: [
      [0, 2], // Kaus Australis - Kaus Media
      [2, 3], // Kaus Media - Kaus Borealis
      [0, 1], // Kaus Australis - Nunki
    ],
  },
  {
    id: 'virgo',
    name: 'Vierge',
    nameLatin: 'Virgo',
    mythology: 'Représente Déméter, déesse de l\'agriculture, ou Astrea, déesse de la justice. Elle tient souvent une gerbe de blé.',
    description: 'Constellation du zodiaque visible au printemps. Grande constellation contenant Spica, l\'une des étoiles les plus brillantes.',
    stars: [
      { id: 'spica', name: 'Spica', magnitude: 0.98, distance: 250, mass: 11.4, equatorial: { ra: 13.42, dec: -11.16 }, color: '#ffffff' },
      { id: 'porrima', name: 'Porrima', magnitude: 2.74, distance: 38, mass: 1.5, equatorial: { ra: 12.69, dec: -1.45 }, color: '#ffffff' },
      { id: 'vindemiatrix', name: 'Vindemiatrix', magnitude: 2.85, distance: 101, mass: 2.6, equatorial: { ra: 13.04, dec: 10.96 }, color: '#ffeb99' },
    ],
    lines: [
      [0, 1], // Spica - Porrima
      [1, 2], // Porrima - Vindemiatrix
    ],
  },
  {
    id: 'capricornus',
    name: 'Capricorne',
    nameLatin: 'Capricornus',
    mythology: 'La chèvre Amalthée qui allaita Zeus enfant. Parfois représentée comme une chèvre-poisson, symbole de la transition entre terre et mer.',
    description: 'Constellation du zodiaque visible en été. Forme un triangle caractéristique dans le ciel.',
    stars: [
      { id: 'deneb-algedi', name: 'Deneb Algedi', magnitude: 2.85, distance: 39, mass: 2.0, equatorial: { ra: 21.78, dec: -16.13 }, color: '#ffffff' },
      { id: 'dabih', name: 'Dabih', magnitude: 3.05, distance: 328, mass: 4.5, equatorial: { ra: 20.35, dec: -14.78 }, color: '#ffeb99' },
      { id: 'nashira', name: 'Nashira', magnitude: 3.69, distance: 139, mass: 2.3, equatorial: { ra: 21.67, dec: -16.66 }, color: '#ffffff' },
    ],
    lines: [
      [0, 1], // Deneb Algedi - Dabih
      [0, 2], // Deneb Algedi - Nashira
      [1, 2], // Dabih - Nashira
    ],
  },
  {
    id: 'pleiades',
    name: 'Pléiades',
    nameLatin: 'Pleiades',
    mythology: 'Les sept filles d\'Atlas et de Pléioné, transformées en étoiles par Zeus pour les protéger d\'Orion. Elles brillent ensemble dans le Taureau.',
    description: 'Amas d\'étoiles ouvert dans la constellation du Taureau. Visible à l\'œil nu, c\'est l\'un des amas les plus célèbres du ciel. Aussi appelé "Les Sept Sœurs".',
    stars: [
      { id: 'alcyone-pleiades', name: 'Alcyone', magnitude: 2.87, distance: 440, mass: 6.0, equatorial: { ra: 3.47, dec: 24.11 }, color: '#b3d9ff' },
      { id: 'atlas-pleiades', name: 'Atlas', magnitude: 3.62, distance: 440, mass: 5.0, equatorial: { ra: 3.49, dec: 24.05 }, color: '#ffffff' },
      { id: 'electra', name: 'Électre', magnitude: 3.72, distance: 440, mass: 5.0, equatorial: { ra: 3.44, dec: 24.11 }, color: '#ffffff' },
      { id: 'maia', name: 'Maia', magnitude: 3.87, distance: 440, mass: 4.5, equatorial: { ra: 3.45, dec: 24.22 }, color: '#b3d9ff' },
      { id: 'merope', name: 'Mérope', magnitude: 4.18, distance: 440, mass: 4.0, equatorial: { ra: 3.46, dec: 23.95 }, color: '#ffffff' },
      { id: 'taygeta', name: 'Taygète', magnitude: 4.30, distance: 440, mass: 4.0, equatorial: { ra: 3.48, dec: 24.47 }, color: '#ffffff' },
      { id: 'pleione', name: 'Pléioné', magnitude: 5.05, distance: 440, mass: 3.5, equatorial: { ra: 3.50, dec: 24.14 }, color: '#b3d9ff' },
    ],
    lines: [
      [0, 1], // Alcyone - Atlas
      [0, 2], // Alcyone - Électre
      [0, 3], // Alcyone - Maia
      [0, 4], // Alcyone - Mérope
      [1, 2], // Atlas - Électre
      [2, 3], // Électre - Maia
      [3, 4], // Maia - Mérope
      [4, 5], // Mérope - Taygète
      [5, 6], // Taygète - Pléioné
    ],
  },
  {
    id: 'aries',
    name: 'Bélier',
    nameLatin: 'Aries',
    mythology: 'Le bélier à toison d\'or qui sauva Phrixos et Hellé. Sa toison fut ensuite gardée en Colchide et conquise par Jason.',
    description: 'Constellation du zodiaque visible en automne. Forme un petit triangle avec Hamal, Sheratan et Mesarthim.',
    stars: [
      { id: 'hamal', name: 'Hamal', magnitude: 2.01, distance: 66, mass: 1.5, equatorial: { ra: 2.12, dec: 23.46 }, color: '#ffeb99' },
      { id: 'sheratan', name: 'Sheratan', magnitude: 2.64, distance: 60, mass: 1.9, equatorial: { ra: 1.91, dec: 20.81 }, color: '#ffffff' },
      { id: 'mesarthim', name: 'Mesarthim', magnitude: 3.86, distance: 204, mass: 2.1, equatorial: { ra: 1.89, dec: 19.29 }, color: '#ffffff' },
    ],
    lines: [[0, 1], [1, 2], [2, 0]],
  },
  {
    id: 'cancer',
    name: 'Cancer',
    nameLatin: 'Cancer',
    mythology: 'Le crabe envoyé par Héra pour gêner Hercule lors de son combat contre l\'Hydre. Écrasé par le héros, il fut placé dans le ciel.',
    description: 'Constellation du zodiaque visible en hiver. Contient l\'amas de la Crèche (M44), visible à l\'œil nu.',
    stars: [
      { id: 'acubens', name: 'Acubens', magnitude: 4.26, distance: 174, mass: 2.0, equatorial: { ra: 8.97, dec: 11.85 }, color: '#ffffff' },
      { id: 'altarf', name: 'Altarf', magnitude: 3.53, distance: 290, mass: 2.2, equatorial: { ra: 8.28, dec: 9.19 }, color: '#ffeb99' },
      { id: 'asellus-borealis', name: 'Asellus Borealis', magnitude: 4.67, distance: 181, mass: 1.6, equatorial: { ra: 8.72, dec: 21.47 }, color: '#ffffff' },
      { id: 'asellus-australis', name: 'Asellus Australis', magnitude: 3.94, distance: 141, mass: 1.7, equatorial: { ra: 8.77, dec: 18.15 }, color: '#ffffff' },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0]],
  },
  {
    id: 'libra',
    name: 'Balance',
    nameLatin: 'Libra',
    mythology: 'La balance d\'Astrea, déesse de la justice. Représente l\'équité et l\'équilibre. Autrefois associée aux pinces du Scorpion.',
    description: 'Constellation du zodiaque visible au printemps. Forme un quadrilatère avec Zubeneschamali et Zubenelgenubi.',
    stars: [
      { id: 'zubeneschamali', name: 'Zubeneschamali', magnitude: 2.61, distance: 185, mass: 3.5, equatorial: { ra: 15.04, dec: -9.38 }, color: '#b3d9ff' },
      { id: 'zubenelgenubi', name: 'Zubenelgenubi', magnitude: 2.75, distance: 77, mass: 1.6, equatorial: { ra: 14.85, dec: -16.04 }, color: '#ffffff' },
      { id: 'zubenelhakrabi', name: 'Zubenelhakrabi', magnitude: 3.91, distance: 152, mass: 2.2, equatorial: { ra: 15.59, dec: -8.41 }, color: '#ff6b47' },
    ],
    lines: [[0, 1], [1, 2], [2, 0]],
  },
  {
    id: 'pisces',
    name: 'Poissons',
    nameLatin: 'Pisces',
    mythology: 'Les deux poissons liés par une corde, représentant Aphrodite et Éros transformés pour échapper au monstre Typhon.',
    description: 'Constellation du zodiaque visible en automne. Grande constellation faible formant un V.',
    stars: [
      { id: 'alrescha', name: 'Alrescha', magnitude: 3.82, distance: 139, mass: 2.0, equatorial: { ra: 2.02, dec: 2.76 }, color: '#ffffff' },
      { id: 'fum-al-samakah', name: 'Fum al Samakah', magnitude: 4.48, distance: 492, mass: 3.0, equatorial: { ra: 23.27, dec: -3.69 }, color: '#b3d9ff' },
      { id: 'kullat-nunu', name: 'Kullat Nunu', magnitude: 4.45, distance: 294, mass: 2.5, equatorial: { ra: 1.13, dec: 15.18 }, color: '#ffffff' },
    ],
    lines: [[0, 1], [1, 2], [2, 0]],
  },
  {
    id: 'auriga',
    name: 'Cocher',
    nameLatin: 'Auriga',
    mythology: 'Érichthonios, roi d\'Athènes inventeur du char. Ou le berger portant une chèvre et ses chevreaux (Capella).',
    description: 'Constellation de l\'hémisphère nord visible en hiver. Contient Capella, l\'une des étoiles les plus brillantes du ciel.',
    stars: [
      { id: 'capella', name: 'Capella', magnitude: 0.08, distance: 43, mass: 2.6, equatorial: { ra: 5.28, dec: 46.00 }, color: '#ffeb99' },
      { id: 'menkalinan', name: 'Menkalinan', magnitude: 1.90, distance: 81, mass: 2.4, equatorial: { ra: 5.99, dec: 44.95 }, color: '#ffffff' },
      { id: 'hassaleh', name: 'Hassaleh', magnitude: 2.69, distance: 494, mass: 4.5, equatorial: { ra: 5.44, dec: 33.17 }, color: '#ff6b47' },
    ],
    lines: [[0, 1], [1, 2], [2, 0]],
  },
  {
    id: 'ophiuchus',
    name: 'Ophiuchus',
    nameLatin: 'Ophiuchus',
    mythology: 'Asclépios, dieu de la médecine, tenant le serpent. Il fut placé dans le ciel après avoir été foudroyé pour avoir ressuscité les morts.',
    description: 'Grande constellation équatoriale visible en été. Le Serpentaire sépare le Serpent en deux parties.',
    stars: [
      { id: 'rasalhague', name: 'Rasalhague', magnitude: 2.08, distance: 49, mass: 2.4, equatorial: { ra: 17.58, dec: 12.56 }, color: '#ffffff' },
      { id: 'sabik', name: 'Sabik', magnitude: 2.43, distance: 84, mass: 2.2, equatorial: { ra: 17.23, dec: -15.72 }, color: '#ffffff' },
      { id: 'yed-prior', name: 'Yed Prior', magnitude: 2.73, distance: 170, mass: 2.8, equatorial: { ra: 16.24, dec: -3.69 }, color: '#ff6b47' },
    ],
    lines: [[0, 1], [1, 2], [2, 0]],
  },
  {
    id: 'delphinus',
    name: 'Dauphin',
    nameLatin: 'Delphinus',
    mythology: 'Le dauphin qui aida Poséidon à convaincre Amphitrite de l\'épouser. En récompense, Poséidon le plaça dans le ciel.',
    description: 'Petite constellation de l\'hémisphère nord. Forme un losange caractéristique facile à repérer.',
    stars: [
      { id: 'sualocin', name: 'Sualocin', magnitude: 3.77, distance: 241, mass: 3.0, equatorial: { ra: 20.66, dec: 16.12 }, color: '#b3d9ff' },
      { id: 'rotanev', name: 'Rotanev', magnitude: 3.63, distance: 97, mass: 1.9, equatorial: { ra: 20.63, dec: 14.40 }, color: '#ffffff' },
      { id: 'gamma-del', name: 'γ Delphini', magnitude: 4.27, distance: 101, mass: 1.8, equatorial: { ra: 20.77, dec: 16.12 }, color: '#ffffff' },
    ],
    lines: [[0, 1], [1, 2], [2, 0]],
  },
  {
    id: 'corvus',
    name: 'Corbeau',
    nameLatin: 'Corvus',
    mythology: 'Le corbeau d\'Apollon, puni pour avoir menti sur la coupe d\'eau. Il fut placé près de l\'Hydre, qu\'il ne peut plus atteindre.',
    description: 'Petite constellation de l\'hémisphère sud. Forme un quadrilatère distinct au printemps.',
    stars: [
      { id: 'gienah-crv', name: 'Gienah', magnitude: 2.59, distance: 165, mass: 4.2, equatorial: { ra: 12.53, dec: -17.54 }, color: '#b3d9ff' },
      { id: 'kraz', name: 'Kraz', magnitude: 2.65, distance: 154, mass: 3.5, equatorial: { ra: 12.50, dec: -23.42 }, color: '#ffffff' },
      { id: 'algorab', name: 'Algorab', magnitude: 2.94, distance: 87, mass: 2.2, equatorial: { ra: 12.49, dec: -16.52 }, color: '#ffffff' },
    ],
    lines: [[0, 1], [1, 2], [2, 0]],
  },
  {
    id: 'crux',
    name: 'Croix du Sud',
    nameLatin: 'Crux',
    mythology: 'Constellation australe représentant la croix chrétienne. Utilisée pour la navigation dans l\'hémisphère sud.',
    description: 'Petite constellation de l\'hémisphère sud, la plus petite des 88. Très reconnaissable et utilisée pour trouver le pôle sud céleste.',
    stars: [
      { id: 'acrux', name: 'Acrux', magnitude: 0.77, distance: 321, mass: 17.8, equatorial: { ra: 12.44, dec: -63.10 }, color: '#b3d9ff' },
      { id: 'mimosa', name: 'Mimosa', magnitude: 1.25, distance: 280, mass: 16, equatorial: { ra: 12.80, dec: -59.69 }, color: '#b3d9ff' },
      { id: 'gacrux', name: 'Gacrux', magnitude: 1.59, distance: 88, mass: 1.8, equatorial: { ra: 12.52, dec: -57.11 }, color: '#ff6b47' },
      { id: 'delta-cru', name: 'δ Crucis', magnitude: 2.79, distance: 345, mass: 8.9, equatorial: { ra: 12.25, dec: -58.75 }, color: '#b3d9ff' },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0]],
  },
  {
    id: 'aquarius',
    name: 'Verseau',
    nameLatin: 'Aquarius',
    mythology: 'Ganymède, le plus beau des mortels, enlevé par l\'aigle de Zeus pour servir d\'échanson aux dieux. Il verse l\'eau de l\'immortalité.',
    description: 'Constellation du zodiaque visible en automne. Grande constellation faible formant un « Y » ou un porteur d\'eau.',
    stars: [
      { id: 'sadalmelik', name: 'Sadalmelik', magnitude: 2.95, distance: 523, mass: 6.0, equatorial: { ra: 22.09, dec: -0.32 }, color: '#ffeb99' },
      { id: 'sadalsuud', name: 'Sadalsuud', magnitude: 2.87, distance: 540, mass: 5.2, equatorial: { ra: 21.53, dec: -5.57 }, color: '#ffeb99' },
      { id: 'skat', name: 'Skat', magnitude: 3.27, distance: 160, mass: 2.2, equatorial: { ra: 22.96, dec: -15.82 }, color: '#ffffff' },
    ],
    lines: [[0, 1], [1, 2], [2, 0]],
  },
];

const MYTHOLOGIES: Record<string, string> = {
  'orion': 'Orion était un géant chasseur d\'une force immense. Son orgueil attira un scorpion envoyé par la Terre. Mortellement piqué, il fut placé dans le ciel par Artémis.',
  'ursa-major': 'Callisto, nymphe d\'Artémis, fut changée en ourse par jalousie divine. Son fils Arcas faillit la tuer sans la reconnaître. Zeus plaça mère et fils au ciel pour éviter la tragédie.',
  'cassiopeia': 'Cassiopée se vanta d\'être plus belle que les Néréides. En punition, les dieux envoyèrent un monstre marin contre son royaume.',
  'cygnus': 'Cygnus fut transformé en cygne par Zeus, touché par son chagrin pour un ami disparu.',
  'scorpius': 'Le scorpion géant envoyé par Gaïa pour tuer Orion. Après la mort d\'Orion, Zeus plaça le scorpion dans le ciel, mais de manière à ce qu\'il ne rencontre jamais Orion.',
  'ursa-minor': 'Arcas, fils de Callisto, transformé en petit ours par Zeus pour protéger sa mère. L\'étoile Polaris guide les navigateurs depuis des millénaires.',
  'lyra': 'La lyre d\'Orphée, dont la musique pouvait charmer les dieux, les bêtes et même les pierres. Après sa mort tragique, Zeus honora sa mémoire en plaçant sa lyre dans le ciel.',
  'aquila': 'L\'aigle de Zeus, messager des dieux. Il enleva Ganymède, le plus beau des mortels, pour servir d\'échanson aux dieux de l\'Olympe.',
  'pegasus': 'Le cheval ailé né du sang de Méduse. Il permit à Bellérophon de vaincre la Chimère, mais fut finalement placé parmi les étoiles par Zeus.',
  'andromeda': 'Princesse éthiopienne enchaînée à un rocher pour être sacrifiée. Sauvée par Persée, elle devint reine et fut placée dans le ciel avec son sauveur.',
  'perseus': 'Héros grec qui décapita Méduse et sauva Andromède. Il utilisa la tête de Méduse pour pétrifier ses ennemis et fut récompensé par les dieux.',
  'bootes': 'Arcas, fils de Callisto, ou Icarios qui enseigna la viticulture aux hommes. Il garde les étoiles comme un berger garde son troupeau.',
  'leo': 'Le lion de Némée, invulnérable aux armes. Hercule dut l\'étouffer de ses propres mains. Sa peau devint l\'armure légendaire d\'Hercule.',
  'taurus': 'Le taureau blanc de Zeus qui enleva Europe. Il la porta jusqu\'en Crète où elle devint reine et donna son nom au continent européen.',
  'gemini': 'Castor et Pollux, les jumeaux divins. Leur amour fraternel fut si fort que Pollux partagea son immortalité avec son frère mortel.',
  'draco': 'Le dragon Ladon, gardien des pommes d\'or. Tué par Hercule, il fut honoré par les dieux en étant placé dans le ciel comme constellation.',
  'canis-major': 'Le chien fidèle d\'Orion, qui l\'accompagne dans sa chasse éternelle. Sirius, l\'étoile la plus brillante, guide les navigateurs depuis l\'Antiquité.',
  'canis-minor': 'Le second chien d\'Orion, plus petit mais tout aussi fidèle. Procyon brille comme un phare dans le ciel d\'hiver.',
  'cepheus': 'Roi d\'Éthiopie, époux de Cassiopée et père d\'Andromède. Il fut placé dans le ciel avec sa famille, formant un groupe familial éternel.',
  'hercules': 'Le héros grec célèbre pour ses douze travaux. Après sa mort et son apothéose, Zeus le plaça dans le ciel pour honorer sa force et sa sagesse.',
  'sagittarius': 'Le centaure archer, souvent identifié à Chiron, le plus sage des centaures. Il pointe sa flèche vers le cœur du Scorpion, rappelant leur rivalité.',
  'virgo': 'Déméter, déesse de l\'agriculture, ou Astrea, déesse de la justice. Elle tient une gerbe de blé, symbole de fertilité et de justice divine.',
  'capricornus': 'La chèvre Amalthée qui allaita Zeus enfant. Représentée comme une chèvre-poisson, elle symbolise la transition entre terre et mer.',
  'pleiades': 'Les sept filles d\'Atlas et de Pléioné, transformées en étoiles par Zeus pour les protéger d\'Orion. Elles brillent ensemble dans le Taureau, formant l\'un des amas les plus célèbres du ciel.',
  'aries': 'Le bélier à toison d\'or qui sauva Phrixos et Hellé. Sa toison fut gardée en Colchide et conquise par Jason et les Argonautes.',
  'cancer': 'Le crabe envoyé par Héra pour gêner Hercule lors de son combat contre l\'Hydre. Écrasé par le héros, il fut placé dans le ciel.',
  'libra': 'La balance d\'Astrea, déesse de la justice. Représente l\'équité et l\'équilibre.',
  'pisces': 'Les deux poissons liés par une corde, représentant Aphrodite et Éros transformés pour échapper au monstre Typhon.',
  'auriga': 'Érichthonios, roi d\'Athènes inventeur du char, ou le berger portant une chèvre (Capella).',
  'ophiuchus': 'Asclépios, dieu de la médecine, tenant le serpent. Il fut placé dans le ciel après avoir été foudroyé pour avoir ressuscité les morts.',
  'delphinus': 'Le dauphin qui aida Poséidon à convaincre Amphitrite de l\'épouser. En récompense, Poséidon le plaça dans le ciel.',
  'corvus': 'Le corbeau d\'Apollon, puni pour avoir menti sur la coupe d\'eau. Il fut placé près de l\'Hydre.',
  'crux': 'Constellation australe représentant la croix chrétienne. Utilisée pour la navigation dans l\'hémisphère sud.',
  'aquarius': 'Ganymède, enlevé par l\'aigle de Zeus pour servir d\'échanson aux dieux. Il verse l\'eau de l\'immortalité.',
};

export function getMythology(constellationId: string): string | null {
  return MYTHOLOGIES[constellationId] || null;
}

/**
 * Projection équatoriale → plan 2D (canvas).
 * - RA (Right Ascension) : en HEURES, 0–24. Conversion : 1 h = 15° → radians = (ra/24)*2π.
 * - Dec (Declination) : en DEGRÉS, -90 à +90. Conversion : radians = (dec * π) / 180.
 * Centre écran = (centerX, centerY). Zoom = scale (multiplicateur sur les écarts).
 * Orientation : RA croissant vers la droite ; Dec croissant (nord) vers le haut (y décroissant).
 *
 * Correction locale (centre de vue / constellation) : si refDec (degré) est fourni, on applique
 * un facteur X UNIFORME basé sur refDec pour toute la constellation, au lieu de cos(dec) par étoile.
 * Ainsi facteur_X = 1/cos(refDec) pour toutes les étoiles → préserve l’aspect ratio (pas d’écrasement).
 * Sans refDec : comportement d’origine (cos(dec) par étoile), pour compatibilité.
 */
export function equatorialToCanvas(
  ra: number,
  dec: number,
  centerX: number,
  centerY: number,
  scale: number,
  ra0: number,
  dec0: number
): { x: number; y: number } {
  const toRad = Math.PI / 180;
  const raRad = (ra * 15) * toRad;
  const decRad = dec * toRad;
  const ra0Rad = (ra0 * 15) * toRad;
  const dec0Rad = dec0 * toRad;

  const cosDec = Math.cos(decRad);
  const sinDec = Math.sin(decRad);
  const cosDec0 = Math.cos(dec0Rad);
  const sinDec0 = Math.sin(dec0Rad);
  const deltaRa = raRad - ra0Rad;
  const cosDeltaRa = Math.cos(deltaRa);
  const sinDeltaRa = Math.sin(deltaRa);

  const denom = 1 + sinDec0 * sinDec + cosDec0 * cosDec * cosDeltaRa;
  if (denom <= 0) return { x: -1e6, y: -1e6 };
  const k = 2 / denom;

  const xProj = k * cosDec * sinDeltaRa;
  const yProj = k * (cosDec0 * sinDec - sinDec0 * cosDec * cosDeltaRa);

  const baseScale = 120;
  const x = centerX + xProj * baseScale * scale;
  const y = centerY - yProj * baseScale * scale;
  return { x, y };
}
