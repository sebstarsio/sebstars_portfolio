'use client';

import ArchitectureNotes, { type ArchitectureNotesData } from '@/components/ui/ArchitectureNotes';
import ViewSourceButton from '@/components/ui/ViewSourceButton';

const DEMO_ID_TO_FILENAME: Record<string, string> = {
  'solar-system': 'SolarSystem.tsx',
  calculatrice: 'Calculator.tsx',
  constellations: 'Constellations.tsx',
  'blog-cms': 'BlogCMS.tsx',
  ecommerce: 'Ecommerce.tsx',
  dashboard: 'Dashboard.tsx',
  'three-body': 'ThreeBody.tsx',
  'astro-data-viewer': 'AstroDataViewer.tsx',
  'fractal-generator': 'FractalGenerator.tsx',
};

function getDemoFilename(githubUrl?: string, id?: string): string | undefined {
  if (githubUrl) {
    const segment = githubUrl.split('/').pop();
    if (segment && segment.endsWith('.tsx')) return segment;
  }
  return id ? DEMO_ID_TO_FILENAME[id] : undefined;
}

export interface DemoProjectForBadges {
  id: string;
  architectureNotes?: ArchitectureNotesData;
  githubUrl?: string;
}

/**
 * Couche flottante indépendante : boutons Specs et Code ancrés aux bords de l’écran,
 * alignés sur la ligne basse du header. Uniquement sur les pages démo.
 * Hors navbar, sans impact sur la hauteur ou le flux.
 */
export default function DemoTechnicalBadges({ project }: { project: DemoProjectForBadges }) {
  const lang = 'fr' as const;
  const filename = getDemoFilename(project.githubUrl, project.id);

  return (
    <div className="demo-technical-badges">
      {project.architectureNotes && (
        <div className="demo-technical-badges__slot demo-technical-badges__slot--specs">
          <ArchitectureNotes notes={project.architectureNotes} lang={lang} />
        </div>
      )}
      <div className="demo-technical-badges__slot demo-technical-badges__slot--code">
        <ViewSourceButton href={project.githubUrl} filename={filename} lang={lang} />
      </div>
    </div>
  );
}
