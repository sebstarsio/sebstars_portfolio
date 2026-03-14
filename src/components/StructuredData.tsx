import type { Project } from '@/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sebstars.io';

function getPersonSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'SebStars',
    alternateName: 'Sébastien',
    jobTitle: 'Architecte logiciel & Développeur Fullstack',
    description:
      'Architecte logiciel et développeur Fullstack. Interfaces premium, écosystème React/Next.js, expériences web avancées. Approche produit et système. Basé en Wallonie (Belgique). 100% Remote available.',
    url: SITE_URL,
    knowsAbout: [
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'Architecture logicielle',
      'Interfaces utilisateur',
      'APIs',
      'PostgreSQL',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Saint-Ghislain',
      addressRegion: 'Wallonia',
      addressCountry: 'BE',
    },
    areaServed: [
      { '@type': 'Country', name: 'Belgium' },
      { '@type': 'AdministrativeArea', name: 'Wallonia' },
      { '@type': 'Continent', name: 'Europe' },
    ],
    knowsLanguage: [{ '@type': 'Language', name: 'French' }, { '@type': 'Language', name: 'English' }],
  };
}

function getWebSiteSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SebStars.io',
    url: SITE_URL,
    description:
      'Portfolio de SebStars : architecte logiciel et développeur Fullstack. Projets React/Next.js, interfaces premium. Belgique · 100% Remote available.',
    inLanguage: 'fr',
    publisher: {
      '@type': 'Person',
      name: 'SebStars',
      url: SITE_URL,
    },
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function StructuredData({
  type,
  project,
  breadcrumbs,
}: {
  type: string;
  project?: Project;
  breadcrumbs?: BreadcrumbItem[];
}) {
  let data: Record<string, unknown> | null = null;

  if (type === 'person') {
    data = getPersonSchema();
  } else if (type === 'website') {
    data = getWebSiteSchema();
  } else if (type === 'breadcrumb' && breadcrumbs?.length) {
    data = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: `${SITE_URL}${item.url.startsWith('/') ? item.url : `/${item.url}`}`,
      })),
    };
  } else if ((type === 'project' || type === 'creativework') && project) {
    data = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description: project.description || project.subtitle,
      url: `${SITE_URL}/projects/${project.id}`,
      author: { '@type': 'Person', name: 'SebStars', url: SITE_URL },
    };
  } else if (type === 'software-source-code' && project) {
    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      name: project.title,
      description: project.description || project.subtitle || '',
      url: `${SITE_URL}/projects/${project.id}`,
      author: { '@type': 'Person', name: 'SebStars', url: SITE_URL },
    };
    if (project.technologies && project.technologies.length > 0) {
      schema.programmingLanguage = project.technologies;
    }
    if (project.github) {
      schema.codeRepository = project.github;
    }
    if (project.category) {
      const categoryMap: Record<string, string> = {
        animation: 'Multimedia',
        fullstack: 'DeveloperApplication',
        vitrine: 'WebApplication',
        ecommerce: 'WebApplication',
        'data-ia': 'DeveloperApplication',
      };
      schema.applicationCategory = categoryMap[project.category] || 'WebApplication';
    }
    data = schema;
  }

  if (!data) return null;

  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
