import type { MetadataRoute } from 'next';
import { getAllProjects } from '@/lib/projects';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sebstars.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getAllProjects();
  // Slugs réels depuis @/lib/projects (ex. solar-system, calculatrice, blog-cms), jamais de littéral /projects/[id]
  const projectUrls: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE_URL}/projects/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/a-propos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/lab`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  return [...staticRoutes, ...projectUrls];
}
