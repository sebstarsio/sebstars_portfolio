import { NextRequest, NextResponse } from 'next/server';

/**
 * Route API pour récupérer les images de la NASA
 * Utilise l'API NASA Image and Video Library
 */
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'nebula';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('page_size') || '50');

    const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}&media_type=image`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`NASA API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (!data.collection || !data.collection.items) {
      return NextResponse.json({
        items: [],
        total: 0,
        page,
        pageSize,
        hasMore: false,
      });
    }

    const items = (data.collection?.items || [])
      .map((item: { data?: { nasa_id?: string; title?: string; description?: string; description_508?: string; date_created?: string; center?: string; keywords?: string[] }[]; links?: { render?: string; href?: string }[] }, index: number) => {
        const metadata = item.data?.[0] || {};
        const links = item.links || [];
        const imageLink = links.find((link: { render?: string }) => link.render === 'image') || links[0];
        if (!imageLink?.href) return null;
        return {
          id: `nasa-${metadata.nasa_id || `item-${index}`}`,
          type: 'image' as const,
          title: metadata.title || 'Image NASA',
          description: metadata.description || metadata.description_508 || '',
          imageUrl: imageLink.href,
          thumbUrl: imageLink.href,
          date: metadata.date_created ? metadata.date_created.split('T')[0] : '',
          tag: metadata.center || 'NASA',
          keywords: metadata.keywords || [],
        };
      })
      .filter((x: unknown) => x !== null);

    return NextResponse.json({
      items,
      total: data.collection?.metadata?.total_hits || 0,
      page,
      pageSize,
      hasMore: items.length === pageSize,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching NASA images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NASA images', message: err.message },
      { status: 500 }
    );
  }
}
