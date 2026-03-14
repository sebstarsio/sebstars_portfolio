import { NextRequest, NextResponse } from 'next/server';

/**
 * Route API pour récupérer l'image du jour de la NASA (APOD)
 */
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date'); // Format YYYY-MM-DD
    const count = searchParams.get('count'); // Nombre d'images (max 10)

    const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';

    // Si count est demandé, récupérer plusieurs APOD
    if (count) {
      const countNum = Math.min(parseInt(count), 5); // Réduire à 5 pour éviter trop de requêtes
      const items: unknown[] = [];

      // Récupérer les APOD des derniers jours (en parallèle avec Promise.allSettled)
      const promises = [];
      for (let i = 0; i < countNum; i++) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - i);
        const dateStr = targetDate.toISOString().split('T')[0];

        const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${dateStr}`;
        promises.push(
          fetch(url)
            .then(res => res.ok ? res.json() : null)
            .then((data: { date?: string; title?: string; explanation?: string; hdurl?: string; url?: string; thumbnail_url?: string; copyright?: string } | null) => {
              if (data && (data.hdurl || data.url)) {
                return {
                  id: `apod-${data.date || dateStr}`,
                  type: 'image' as const,
                  title: data.title || 'Astronomy Picture of the Day',
                  description: data.explanation || '',
                  imageUrl: data.hdurl || data.url || '',
                  thumbUrl: data.thumbnail_url || data.url || '',
                  date: data.date || dateStr,
                  tag: 'APOD',
                  copyright: data.copyright,
                };
              }
              return null;
            })
            .catch(() => null)
        );
      }

      const results = await Promise.allSettled(promises);
      results.forEach((result: PromiseSettledResult<unknown>) => {
        if (result.status === 'fulfilled' && result.value) {
          items.push(result.value);
        }
      });

      return NextResponse.json({
        items,
        count: items.length,
      });
    }

    // Sinon, récupérer un seul APOD
    let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
    if (date) {
      url += `&date=${date}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`NASA APOD API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    const item = {
      id: `apod-${data.date || 'today'}`,
      type: 'image' as const,
      title: data.title || 'Astronomy Picture of the Day',
      description: data.explanation || '',
      imageUrl: data.hdurl || data.url || '',
      thumbUrl: data.thumbnail_url || data.url || '',
      date: data.date || '',
      tag: 'APOD',
      copyright: data.copyright,
    };

    return NextResponse.json({
      items: item,
      count: 1,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching NASA APOD:', error);
    return NextResponse.json(
      { error: 'Failed to fetch APOD', message: err.message },
      { status: 500 }
    );
  }
}
