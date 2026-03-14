import { NextRequest, NextResponse } from 'next/server';

/**
 * Route API pour récupérer les données d'exoplanètes
 */
export const dynamic = 'force-dynamic';

// NextRequest requis par la signature de route API, non utilisé dans ce handler
export async function GET(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- paramètre requis par Next.js
  _request: NextRequest
) {
  try {
    const exoplanets = [
      {
        id: 'proxima-centauri-b',
        type: 'exoplanet' as const,
        title: 'Proxima Centauri b',
        description: "Exoplanète dans la zone habitable de Proxima Centauri, l'étoile la plus proche du Soleil. Découverte en 2016.",
        orbitalDistance: 0.0485,
        planetRadius: 1.3,
        stellarRadius: 0.15,
        mass: 1.27,
        orbitalPeriod: 11.2,
        temperature: 234,
      },
      {
        id: 'trappist-1-e',
        type: 'exoplanet' as const,
        title: 'TRAPPIST-1 e',
        description: 'Planète rocheuse dans la zone habitable du système TRAPPIST-1. Une des 7 planètes découvertes autour de cette étoile naine.',
        orbitalDistance: 0.029,
        planetRadius: 0.92,
        stellarRadius: 0.12,
        mass: 0.62,
        orbitalPeriod: 6.1,
        temperature: 251,
      },
      {
        id: 'kepler-452b',
        type: 'exoplanet' as const,
        title: 'Kepler-452b',
        description: 'Exoplanète surnommée "Terre 2.0" en raison de sa similarité avec la Terre. Située dans la zone habitable de son étoile.',
        orbitalDistance: 1.046,
        planetRadius: 1.63,
        stellarRadius: 1.11,
        mass: 5.0,
        orbitalPeriod: 384.8,
        temperature: 265,
      },
      {
        id: 'kepler-22b',
        type: 'exoplanet' as const,
        title: 'Kepler-22b',
        description: "Première exoplanète confirmée dans la zone habitable d'une étoile similaire au Soleil. Découverte en 2011.",
        orbitalDistance: 0.849,
        planetRadius: 2.4,
        stellarRadius: 0.97,
        mass: 36.0,
        orbitalPeriod: 289.9,
        temperature: 262,
      },
      {
        id: 'hd-40307g',
        type: 'exoplanet' as const,
        title: 'HD 40307 g',
        description: 'Super-Terre dans la zone habitable de son étoile. Potentiellement habitable avec une atmosphère.',
        orbitalDistance: 0.6,
        planetRadius: 1.9,
        stellarRadius: 0.77,
        mass: 7.1,
        orbitalPeriod: 197.8,
        temperature: 278,
      },
    ];

    return NextResponse.json({
      items: exoplanets,
      count: exoplanets.length,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching exoplanets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exoplanets', message: err.message },
      { status: 500 }
    );
  }
}
