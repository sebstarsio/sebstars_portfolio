import { ImageResponse } from 'next/og';
import { getProjectById } from '@/lib/projects';

/** OG image dynamique par projet (titre + « Projet SebStars » + technos). Fallback image générique si id inconnu. */
export const alt = 'SebStars — Projet';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function GenericSebStarsImage() {
  return (
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
    </div>
  );
}

/** Génère l’image OG pour /projects/[id]. params.id résolu via await (convention App Router). */
export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    return new ImageResponse(<GenericSebStarsImage />, { ...size });
  }

  const techLine =
    project.technologies && project.technologies.length > 0
      ? project.technologies.slice(0, 5).join(' • ')
      : 'Projet SebStars';

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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
          }}
        >
          <span
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              fontFamily: 'system-ui, sans-serif',
              textAlign: 'center',
              maxWidth: 1000,
            }}
          >
            {project.title}
          </span>
          <span
            style={{
              fontSize: 26,
              fontWeight: 500,
              color: 'rgba(200, 220, 255, 0.9)',
              letterSpacing: '0.02em',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Projet SebStars
          </span>
          <span
            style={{
              fontSize: 20,
              fontWeight: 400,
              color: 'rgba(160, 180, 220, 0.75)',
              marginTop: 8,
              letterSpacing: '0.04em',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            {techLine}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
