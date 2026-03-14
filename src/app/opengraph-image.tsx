import { ImageResponse } from 'next/og';

export const alt = 'SebStars — Architecte Logiciel Fullstack';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 48,
          background: 'radial-gradient(circle at 50% 50%, #1a1b41 0%, #0d0e24 45%, #080c1c 100%)',
        }}
      >
        {/* Accent lumineux discret en haut */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 600,
            height: 2,
            background: 'linear-gradient(90deg, transparent, rgba(100, 180, 255, 0.4), transparent)',
            borderRadius: 2,
          }}
        />
        {/* Titre principal */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1,
                fontFamily: 'system-ui, sans-serif',
            }}
          >
            SebStars
          </span>
          <span
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: 'rgba(200, 220, 255, 0.95)',
              letterSpacing: '0.02em',
                fontFamily: 'system-ui, sans-serif',
            }}
          >
            Architecte Logiciel Fullstack
          </span>
          <span
            style={{
              fontSize: 22,
              fontWeight: 400,
              color: 'rgba(160, 180, 220, 0.75)',
              marginTop: 12,
              letterSpacing: '0.08em',
                fontFamily: 'system-ui, sans-serif',
            }}
          >
            React • Next.js • UI Premium
          </span>
        </div>
        {/* Point lumineux cosmique discret */}
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: 'rgba(150, 200, 255, 0.6)',
            boxShadow: '0 0 20px rgba(150, 200, 255, 0.3)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
