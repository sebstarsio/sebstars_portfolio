import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const text = searchParams.get('text');
  const targetLang = searchParams.get('lang');

  if (!text || !targetLang) {
    return NextResponse.json(
      { error: 'Missing parameters: text and lang are required' },
      { status: 400 }
    );
  }

  if (targetLang === 'en') {
    return NextResponse.json({ translatedText: text });
  }

  try {
    const chunkSize = 500;
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      let end = Math.min(i + chunkSize, text.length);
      if (end < text.length && text[end] !== ' ') {
        const lastSpace = text.lastIndexOf(' ', end);
        if (lastSpace > i) end = lastSpace + 1;
      }
      chunks.push(text.substring(i, end));
    }

    const translatedChunks = await Promise.all(
      chunks.map(async (chunk) => {
        try {
          const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=en|fr`,
            { headers: { 'User-Agent': 'Mozilla/5.0' } }
          );
          if (!response.ok) throw new Error('Translation API error');
          const data = await response.json();
          return data.responseData?.translatedText || chunk;
        } catch {
          return chunk;
        }
      })
    );

    return NextResponse.json({ translatedText: translatedChunks.join(' ') });
  } catch {
    return NextResponse.json({ translatedText: text });
  }
}
